import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Globe from 'react-globe.gl';
import client from '../../api/api';
import styles from './BirthPage.module.css';


// ───────────────────────────────────────────────
// 설정값
// ───────────────────────────────────────────────

// 지구 사진 (NASA Blue Marble) - public/globe 폴더에 넣어 둔 이미지
const EARTH_IMG = '/globe/earth-blue-marble.jpg';
const EARTH_BUMP = '/globe/earth-topology.png';


// 나라별 착륙 지점 (위도·경도)
const COUNTRY_POS = {
  KOR: { lat: 36.5, lng: 127.8 },
  PRK: { lat: 40.0, lng: 127.0 },
  JPN: { lat: 36.2, lng: 138.3 },
  CHN: { lat: 34.0, lng: 104.0 },
  VNM: { lat: 16.0, lng: 107.5 },
  IND: { lat: 22.5, lng: 79.0 },
};
const ASIA_CENTER = { lat: 28, lng: 105 };

// 연출 시간 (밀리초)
const MIN_FLY_TIME = 3500; // 서버 응답이 빨라도 최소 이만큼은 비행
const APPROACH_TIME = 2200; // 지구가 그 나라로 돌아가는 시간
const DROP_TIME = 2400; // 사람이 떨어지는 시간 (CSS 와 맞춤)

// 화면에 보여줄 문구 (단계별)
const PHASE_TEXT = {
  flying: '아시아 상공을 비행하고 있어요',
  approach: '착륙할 곳을 찾고 있어요',
  drop: '뛰어내립니다!',
  landed: '',
  error: '',
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ───────────────────────────────────────────────
// 출생 추첨 화면 (C02)
// ───────────────────────────────────────────────
function BirthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const decade = location.state?.decade; // 메인에서 고른 시대

  const globeRef = useRef(); // 지구본 손잡이
  const stageRef = useRef(); // 화면 영역
  const planeRef = useRef(); // 비행기 (직접 위치를 바꿔서 움직임)
  const startedRef = useRef(false); // 개발 모드에서 두 번 실행되는 것 막기

  const [size, setSize] = useState({ w: 800, h: 600 });
  const [phase, setPhase] = useState('flying'); // flying → approach → drop → landed
  const phaseRef = useRef('flying');
  const [life, setLife] = useState(null); // 서버가 정해 준 인생
  const [error, setError] = useState('');

  const changePhase = (p) => {
    phaseRef.current = p;
    setPhase(p);
  };

  // ① 시대를 안 고르고 주소로 바로 들어오면 메인으로
  useEffect(() => {
    if (!decade) navigate('/');
  }, [decade, navigate]);

  // ② 화면 크기에 맞춰 지구본 크기 정하기
  useEffect(() => {
    const resize = () => {
      const box = stageRef.current.getBoundingClientRect();
      setSize({ w: box.width, h: box.height });
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  // ③ 지구본 첫 모습: 아시아를 멀리서 보면서 천천히 자전
  const handleGlobeReady = () => {
    const globe = globeRef.current;
    const controls = globe.controls();
    controls.enableZoom = false;
    controls.enablePan = false;

    // 지구 사진이 늦게 뜬 경우(이미 착륙 단계)에는 처음 모습으로 되돌리지 않음
    if (phaseRef.current !== 'flying') return;
    globe.pointOfView({ ...ASIA_CENTER, altitude: 2.4 }, 0);
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.8;
  };

  // ④ 비행기 움직이기 (매 프레임 위치 계산)
  useEffect(() => {
    let frame;
    let angle = Math.PI * 0.15; // 궤도 위 현재 각도
    let approachStart = null; // 착륙 접근을 시작한 시각
    let from = null; // 접근 시작 위치

    const move = (time) => {
      const plane = planeRef.current;
      if (!plane) return;

      const cx = size.w / 2;
      const cy = size.h / 2;
      const R = Math.min(size.w, size.h) * 0.42; // 궤도 가로 반지름
      const tilt = 0.32; // 궤도를 비스듬히 눕힌 정도
      let x, y, heading, scale, front;

      if (phaseRef.current === 'flying') {
        // 지구 둘레를 타원으로 빙글빙글
        angle += 0.012;
        x = cx + R * Math.cos(angle);
        y = cy + R * tilt * Math.sin(angle);
        heading = Math.atan2(R * tilt * Math.cos(angle), -R * Math.sin(angle));
        front = Math.sin(angle) > 0; // 아래쪽 반 = 지구 앞쪽
        scale = 0.75 + 0.35 * (Math.sin(angle) + 1) / 2;
        from = { x, y, scale };
      } else {
        // 지구 정가운데 바로 위로 날아가서 멈춤 (그 아래가 태어날 나라)
        if (!approachStart) approachStart = time;
        const t = Math.min((time - approachStart) / 1600, 1);
        const ease = 1 - Math.pow(1 - t, 3);
        const toX = cx;
        const toY = cy - Math.min(size.w, size.h) * 0.3;
        x = from.x + (toX - from.x) * ease;
        y = from.y + (toY - from.y) * ease;
        scale = from.scale + (1.1 - from.scale) * ease;
        heading = Math.atan2(toY - from.y, toX - from.x) * (1 - ease); // 마지막엔 오른쪽을 봄
        front = true;

        // 사람이 뛰어내리고 잠시 뒤 오른쪽으로 날아가 사라짐
        if (phaseRef.current === 'landed' || phaseRef.current === 'drop') {
          const leave = Math.max((time - approachStart - APPROACH_TIME - 900) / 1800, 0);
          x += leave * leave * size.w * 0.7;
          y -= leave * 60;
          plane.style.opacity = String(Math.max(1 - leave, 0));
        }
      }

      plane.style.transform =
        `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${heading}rad) scale(${scale})`;
      plane.style.zIndex = front ? 3 : 0; // 뒤쪽일 때는 지구 뒤로 숨김

      frame = requestAnimationFrame(move);
    };

    frame = requestAnimationFrame(move);
    return () => cancelAnimationFrame(frame);
  }, [size]);

  // ⑤ 서버에 출생 요청 → 연출 순서대로 진행
  useEffect(() => {
    if (!decade || startedRef.current) return;
    startedRef.current = true;

    const run = async () => {
      try {
        const isLogin = !!localStorage.getItem('token');
        const oldGuestToken = isLogin ? null : localStorage.getItem('guestToken');

        // 서버 요청과 최소 비행 시간을 동시에 기다림
        const [res] = await Promise.all([
          // POST /api/engine/birth  { decade, guestToken }
          // 회원은 api.js 가 Authorization 헤더(토큰)를 자동으로 붙여서 서버가 회원 인생으로 저장
          client.post('/api/engine/birth', { decade, guestToken: oldGuestToken }),
          sleep(MIN_FLY_TIME),
        ]);

        const born = res.data;
        if (!born || !born.birthCountry) {
          throw new Error('이 시대의 통계 데이터가 아직 없어요.');
        }
        setLife(born);

        // 비회원이면 새 임시 토큰 저장 (이어하기에 사용)
        if (!isLogin && born.guestToken) {
          localStorage.setItem('guestToken', born.guestToken);
        }

        // 지구를 그 나라로 돌리기
        const pos = COUNTRY_POS[born.birthCountry] || ASIA_CENTER;
        const globe = globeRef.current;
        globe.controls().autoRotate = false;
        changePhase('approach');
        globe.pointOfView({ ...pos, altitude: 1.5 }, APPROACH_TIME);
        await sleep(APPROACH_TIME);

        // 뛰어내리기
        changePhase('drop');
        await sleep(DROP_TIME);

        // 착륙!
        changePhase('landed');
      } catch (err) {
        // 서버가 보낸 안내 문구가 있으면 그대로 보여줌 (예: "1940년대 통계 데이터가 없어서 태어날 수 없어요.")
        const msg = err.response?.data;
        if (typeof msg === 'string' && msg) setError(msg);
        else setError(err.response ? '서버에서 오류가 났어요.' : err.message);
        changePhase('error');
      }
    };

    run();
  }, [decade]);

  // 착륙 지점 표시 (퍼지는 원 + 이름표)
  const pos = life ? COUNTRY_POS[life.birthCountry] || ASIA_CENTER : null;
  const landed = phase === 'landed';
  const rings = landed && pos ? [pos] : [];
  const pins = landed && pos ? [{ ...pos, code: life.birthCountry, name: life.countryName }] : [];

  // 이름표 HTML 만들기 (지구본 라이브러리는 DOM 요소를 받음)
  // 바깥 div 는 라이브러리가 위치를 잡고, 안쪽 div 에만 애니메이션을 줌
  const makePin = (d) => {
    const el = document.createElement('div');
    el.innerHTML =
      `<div class="${styles.pin}"><span class="${styles.pinCode}">${d.code}</span>${d.name ?? ''}</div>`;
    return el;
  };

  const genderText = life?.gender === 'M' ? '남자' : '여자';
  const countryText = life
    ? life.histName && life.histName !== life.countryName
      ? `${life.countryName} (당시 ${life.histName})`
      : life.countryName
    : '';

  return (
    <div className={styles.page}>
      <div ref={stageRef} className={styles.stage}>
        {/* 지구본 */}
        <div className={styles.globeLayer}>
          <Globe
            ref={globeRef}
            width={size.w}
            height={size.h}
            backgroundColor="rgba(0,0,0,0)"
            globeImageUrl={EARTH_IMG}
            bumpImageUrl={EARTH_BUMP}
            showAtmosphere
            atmosphereColor="#7cc4ff"
            atmosphereAltitude={0.2}
            onGlobeReady={handleGlobeReady}
            ringsData={rings}
            ringColor={() => (t) => `rgba(255, 214, 92, ${1 - t})`}
            ringMaxRadius={5}
            ringPropagationSpeed={2.5}
            ringRepeatPeriod={900}
            htmlElementsData={pins}
            htmlElement={makePin}
            htmlAltitude={0.02}
          />
        </div>

        {/* 비행기 */}
        <div ref={planeRef} className={styles.plane} aria-hidden="true">
          <Airplane />
        </div>

        {/* 낙하산 타고 떨어지는 아기 */}
        {(phase === 'drop' || phase === 'landed') && (
          <div
            className={styles.jumper}
            style={{ '--fall': `${Math.min(size.w, size.h) * 0.3}px` }}
            aria-hidden="true"
          >
            <Parachute />
          </div>
        )}

        {/* 맨 위 안내 문구 */}
        <header className={styles.topBar}>
          <p className={styles.step}>출생 추첨</p>
          <h1 className={styles.title}>{decade}년대, 아시아 어딘가</h1>
          {PHASE_TEXT[phase] && (
            <p className={styles.status}>
              <span className={styles.dot} />
              {PHASE_TEXT[phase]}
            </p>
          )}
        </header>

        {/* 결과 카드 */}
        {landed && life && (
          <section className={styles.resultCard}>
            <p className={styles.resultEyebrow}>{life.birthYear}년, 새 생명이 태어났어요</p>
            <h2 className={styles.resultName}>
              {life.name}
              <span className={styles.resultGender}>{genderText}</span>
            </h2>
            <p className={styles.resultCountry}>{countryText}</p>

            <ul className={styles.facts}>
              <li>
                <span>가정형편</span>
                <strong>소득 {life.wealthClass}분위</strong>
              </li>
              <li>
                <span>사는 곳</span>
                <strong>{life.isUrban === 'Y' ? '도시' : '시골'}</strong>
              </li>
              <li>
                <span>기대수명</span>
                <strong>{life.lifeExpectancy ? `${Math.round(life.lifeExpectancy)}세` : '-'}</strong>
              </li>
              <li>
                <span>1인당 GDP</span>
                <strong>{life.gdpPerCapita ? `$${Math.round(life.gdpPerCapita).toLocaleString()}` : '-'}</strong>
              </li>
            </ul>

            <div className={styles.actions}>
              <button type="button" className={styles.ghostBtn} onClick={() => navigate('/')}>
                메인으로
              </button>
              {/* TODO: 출생신고서 화면(C02) 만들면 연결 */}
              <button
                type="button"
                className={styles.primaryBtn}
                onClick={() => navigate('/certificate', { state: { life } })}
              >
                출생신고서 보기
              </button>
            </div>
          </section>
        )}

        {/* 오류 */}
        {phase === 'error' && (
          <section className={styles.resultCard}>
            <h2 className={styles.resultName}>착륙하지 못했어요</h2>
            <p className={styles.resultCountry}>{error}</p>
            <div className={styles.actions}>
              <button type="button" className={styles.primaryBtn} onClick={() => navigate('/')}>
                메인으로
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────
// 그림 (SVG)
// ───────────────────────────────────────────────

// 위에서 본 비행기 (오른쪽을 향함)
function Airplane() {
  return (
    <svg width="72" height="72" viewBox="0 0 64 64">
      <defs>
        <linearGradient id="body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#cfd8e3" />
        </linearGradient>
      </defs>
      {/* 날개 */}
      <path d="M30 31 L18 6 L23 6 L40 31 Z" fill="#dfe6ee" />
      <path d="M30 33 L18 58 L23 58 L40 33 Z" fill="#c9d3de" />
      {/* 꼬리날개 */}
      <path d="M10 31 L5 21 L8 21 L15 31 Z" fill="#dfe6ee" />
      <path d="M10 33 L5 43 L8 43 L15 33 Z" fill="#c9d3de" />
      {/* 몸통 */}
      <rect x="6" y="28.5" width="48" height="7" rx="3.5" fill="url(#body)" />
      <path d="M50 28.5 Q60 32 50 35.5 Z" fill="url(#body)" />
      {/* 창문 줄 */}
      <rect x="20" y="31" width="26" height="1.6" rx="0.8" fill="#7aa7d6" opacity="0.8" />
      {/* 꼬리 포인트 색 */}
      <rect x="6" y="28.5" width="6" height="7" rx="3" fill="#ffb84d" />
    </svg>
  );
}

// 낙하산 + 아기 바구니
function Parachute() {
  return (
    <svg width="84" height="105" viewBox="0 0 64 80">
      <g className={styles.canopy}>
        <path d="M4 26 Q32 -8 60 26 Z" fill="#ff7a59" />
        <path d="M18 26 Q32 -4 46 26 Z" fill="#ffe08a" />
        <path d="M28 26 Q32 4 36 26 Z" fill="#ff7a59" />
        <path d="M4 26 Q11 30 18 26 Q25 30 32 26 Q39 30 46 26 Q53 30 60 26" fill="none" stroke="#c44b30" strokeWidth="1" />
      </g>
      {/* 줄 */}
      <path d="M6 27 L28 58 M58 27 L36 58 M22 28 L30 58 M42 28 L34 58" stroke="#e8edf3" strokeWidth="0.8" />
      {/* 바구니 + 아기 */}
      <circle cx="32" cy="60" r="5" fill="#ffe0c2" />
      <path d="M24 64 h16 l-2 10 h-12 Z" fill="#8a5a3b" />
      <path d="M24 64 h16" stroke="#6b4228" strokeWidth="2" />
    </svg>
  );
}

export default BirthPage;
