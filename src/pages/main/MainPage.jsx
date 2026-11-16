import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './MainPage.module.css';

// ───────────────────────────────────────────────
// 임시 데이터 (아직 API 가 없어서 고정값. API 생기면 이 부분만 교체)
// ───────────────────────────────────────────────

// 아시아 1초당 출생·사망 수 (대략값, 나중에 COUNTRY_STAT 통계로 교체)
const BIRTHS_PER_SEC = 2.2;
const DEATHS_PER_SEC = 1.0;

// 태어날 시대 9개 (1940년대 ~ 2020년대)
const DECADES = [1940, 1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020];

// "이 시대에 태어나는 아기라면" 나라별 확률 (예시)
const BIRTH_SHARE = [
  { country: '인도', percent: 38 },
  { country: '중국', percent: 33 },
  { country: '베트남', percent: 9 },
  { country: '일본', percent: 8 },
  { country: '대한민국', percent: 7 },
  { country: '북한', percent: 5 },
];

// 나라별 지금 살고 있는 플레이어 (예시, 나중에 C14 접속자 수로 교체)
const PLAYERS = [
  { country: '인도', count: 98 },
  { country: '중국', count: 84 },
  { country: '대한민국', count: 52 },
  { country: '일본', count: 37 },
  { country: '베트남', count: 26 },
  { country: '북한', count: 15 },
];

// 최근 추모관 글 (예시, 나중에 B01 추모관 API 로 교체)
const RECENT_MEMORIALS = [
  { postId: 1, name: '김순자', info: '대한민국 · 1952년생 · 84세', message: '전쟁 통에 태어나 손주 셋을 봤다.', tributes: 12, comments: 3 },
  { postId: 2, name: 'Nguyen Van An', info: '베트남 · 1968년생 · 41세', message: '두 번 피란을 갔지만 끝내 고향으로.', tributes: 8, comments: 1 },
  { postId: 3, name: 'Priya Sharma', info: '인도 · 1991년생 · 77세', message: '마을 첫 대학 졸업생이 되었다.', tributes: 5, comments: 2 },
];

// ───────────────────────────────────────────────

// 메인 화면 (H01)
function MainPage() {
  const navigate = useNavigate();
  const isLogin = !!localStorage.getItem('token'); // 토큰이 있으면 로그인 상태

  const [decade, setDecade] = useState(1940); // 고른 시대
  const [seconds, setSeconds] = useState(0);  // 이 페이지를 연 뒤 지난 시간(초)

  // ① 화면이 처음 뜰 때 한 번 실행 → 0.1초마다 지난 시간을 다시 계산
  useEffect(() => {
    const start = Date.now();
    const timer = setInterval(() => {
      setSeconds((Date.now() - start) / 1000);
    }, 100);
    return () => clearInterval(timer); // 다른 화면으로 가면 타이머 정지
  }, []);

  // 지난 시간 × 1초당 수 = 지금까지 태어난/떠난 사람 수
  const born = Math.floor(seconds * BIRTHS_PER_SEC);
  const died = Math.floor(seconds * DEATHS_PER_SEC);
  const totalPlayers = PLAYERS.reduce((sum, p) => sum + p.count, 0);
  const maxPlayers = Math.max(...PLAYERS.map((p) => p.count));

  // ② 태어나기 버튼: 회원은 퀘스트 설정(C01) → 비회원은 바로 출생(C02)
  const handleBirth = () => {
    if (isLogin) {
      navigate('/quest', { state: { decade } });
    } else {
      navigate('/birth', { state: { decade } });
    }
  };

  return (
    <div className={styles.container}>
      {/* ───── 1. 맨 위: 게임 소개 + 실시간 카운터 ───── */}
      <section className={styles.hero}>
        <div className={styles.heroTop}>
          <div className={styles.heroLeft}>
            <p className={styles.heroSub}>아시아 · 1940 – 현재 인생 시뮬레이션</p>
            <h1 className={styles.heroTitle}>환승인생</h1>
            <p className={styles.heroDesc}>
              어느 나라, 어느 시대에 태어날지는 아무도 모릅니다.
              <br />
              실제 통계로 정해지는 한 번의 인생을 살아 보세요.
            </p>
          </div>

          <div className={styles.counters}>
            <div className={styles.counterBox}>
              <p className={styles.counterLabel}>이 페이지를 연 뒤 태어난 아기</p>
              <p className={styles.counterNum}>{born.toLocaleString()}명</p>
            </div>
            <div className={styles.counterBox}>
              <p className={styles.counterLabel}>같은 시간 세상을 떠난 사람</p>
              <p className={styles.counterNum}>{died.toLocaleString()}명</p>
            </div>
            <p className={styles.counterNote}>아시아 연간 통계 기준 추정치</p>
          </div>
        </div>

        <div className={styles.live}>
          <span className={styles.liveBadge}>● LIVE</span>
          지금 {totalPlayers}명이 아시아 어딘가에서 살고 있어요
        </div>
      </section>

      <div className={styles.middle}>
        {/* ───── 2. 왼쪽: 시대 고르기 + 태어나기 ───── */}
        <section className={styles.panel}>
          <p className={styles.smallTitle}>태어날 시대 (10년 단위)</p>

          <div className={styles.decadeGrid}>
            {DECADES.map((d) => (
              <button
                key={d}
                type="button"
                className={d === decade ? styles.decadeActive : styles.decadeBtn}
                onClick={() => setDecade(d)}
              >
                <strong>{d}년대</strong>
                <span>{d} – {d === 2020 ? '현재' : d + 9}</span>
              </button>
            ))}
          </div>

          <button type="button" className={styles.birthBtn} onClick={handleBirth}>
            태어나기
          </button>
          {!isLogin && <p className={styles.hint}>비회원은 퀘스트 없이 바로 태어나요.</p>}

          <hr className={styles.line} />

          <h3 className={styles.panelTitle}>{decade}년대 아시아에서 태어나는 아기라면</h3>
          <p className={styles.hint}>태어날 나라는 그 시대 출생아 수 비율로 정해져요. (예시)</p>

          <ul className={styles.barList}>
            {BIRTH_SHARE.map((b) => (
              <li key={b.country} className={styles.barRow}>
                <span className={styles.barName}>{b.country}</span>
                <span className={styles.barTrack}>
                  <span className={styles.barFill} style={{ width: `${b.percent}%` }} />
                </span>
                <span className={styles.barValue}>{b.percent}%</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ───── 3. 오른쪽: 이어서 살기 + 나라별 플레이어 ───── */}
        <section className={styles.panel}>
          <h3 className={styles.panelTitle}>이어서 살기</h3>

          <div className={styles.continueBox}>
            <div className={styles.character}>캐릭터</div>
            <div className={styles.continueText}>
              <p>진행 중인 인생이 없어요</p>
              <span>시대를 고르고 새로 태어나 보세요</span>
            </div>
            {/* TODO: 진행 중인 인생 조회 API 생기면 활성화 (C03) */}
            <button type="button" className={styles.darkBtn} disabled>이어하기</button>
          </div>

          {!isLogin && (
            <div className={styles.guestBox}>
              <p className={styles.smallTitle}>비회원 안내</p>
              <p className={styles.hint}>
                비회원 인생은 이 브라우저에만 저장되고 7일 뒤 사라져요.
                회원은 퀘스트·포인트·추모관을 쓸 수 있어요.
              </p>
              <Link to="/join" className={styles.whiteBtn}>회원가입</Link>
            </div>
          )}

          <hr className={styles.line} />

          <h3 className={styles.panelTitle}>나라별 지금 살고 있는 플레이어</h3>
          <p className={styles.hint}>시대와 관계없이 나라 기준이에요. (예시)</p>

          <ul className={styles.barList}>
            {PLAYERS.map((p) => (
              <li key={p.country} className={styles.barRow}>
                <span className={styles.barName}>{p.country}</span>
                <span className={styles.barTrack}>
                  <span className={styles.barFill} style={{ width: `${(p.count / maxPlayers) * 100}%` }} />
                </span>
                <span className={styles.barValue}>{p.count}명</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* ───── 4. 맨 아래: 최근 추모관 ───── */}
      <section className={styles.panel}>
        <div className={styles.memorialHead}>
          <h3 className={styles.panelTitle}>최근 추모관에 올라온 인생</h3>
          <Link to="/memorial" className={styles.whiteBtn}>추모관 전체 보기 ›</Link>
        </div>

        <div className={styles.memorialGrid}>
          {RECENT_MEMORIALS.map((m) => (
            <Link key={m.postId} to={`/memorial/${m.postId}`} className={styles.memorialCard}>
              <div className={styles.memorialImg}>캐릭터 (마지막 모습)</div>
              <div className={styles.memorialBody}>
                <p className={styles.memorialName}>{m.name}</p>
                <p className={styles.memorialInfo}>{m.info}</p>
                <p className={styles.memorialMsg}>“{m.message}”</p>
                <p className={styles.memorialCount}>🕯 추모 {m.tributes} · 댓글 {m.comments}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export default MainPage;
