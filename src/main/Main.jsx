// 메인 화면 H01 (주소: /) - M01 시안
//   - 시대 고르기: OrbitGlobe (value / onChange)
//   - 태어나기 버튼: POST /api/engine/birth { decade, guestToken }
//   - 아무 시대에나 태어나기: 궤도를 몇 번 빠르게 돌린 뒤 무작위 시대로 멈춤 → 그 시대로 birth 호출
//   - 실시간 목록: useLiveFeed() 예시 데이터 (C17 소켓 붙으면 교체)
//   - 실시간 숫자: useAsiaCounter() = 유엔 세계인구전망 2024 아시아 통계로 계산 (그대로 써도 됨)
import { useEffect, useRef, useState } from 'react';
import Header from '../common/ui/Header';
import Badge from '../common/ui/Badge';
import Button from '../common/ui/Button';
import Panel from '../common/ui/Panel';
import FeedList from '../common/ui/FeedList';
import BigStat from '../common/ui/BigStat';
import StarIcon from '../common/ui/StarIcon';
import OrbitGlobe, { DECADES } from '../common/ui/OrbitGlobe';
import { useAsiaCounter, useLiveFeed } from './useLiveStats';
import './main.css';

// 주사위 아이콘 (아무 시대에나)
function DiceIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <rect x="1.5" y="1.5" width="13" height="13" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="5" cy="5" r="1.2" fill="currentColor" /><circle cx="11" cy="11" r="1.2" fill="currentColor" />
      <circle cx="8" cy="8" r="1.2" fill="currentColor" /><circle cx="11" cy="5" r="1.2" fill="currentColor" />
      <circle cx="5" cy="11" r="1.2" fill="currentColor" />
    </svg>
  );
}

function Main() {
  const [decade, setDecade] = useState(1980);
  const [spinning, setSpinning] = useState(false);
  const [luck, setLuck] = useState(false); // 운명이 골라 준 시대인지 (칸에 금색 표시)
  const timers = useRef([]);
  const range = decade === 2020 ? '2020 – 현재' : decade + ' – ' + (decade + 9);

  const counter = useAsiaCounter();
  const feed = useLiveFeed();

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const choose = (d) => {
    setDecade(d);
    setLuck(false);
  };

  // 아무 시대에나: 궤도를 점점 느리게 몇 번 돌리다가 무작위 시대에서 멈춤
  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setLuck(false);
    const final = DECADES[Math.floor(Math.random() * DECADES.length)];
    const delays = [0, 140, 300, 490, 720, 1000, 1340];
    let last = decade;
    delays.forEach((ms, i) => {
      timers.current.push(setTimeout(() => {
        let d = final;
        if (i < delays.length - 1) {
          do { d = DECADES[Math.floor(Math.random() * DECADES.length)]; } while (d === last);
        }
        last = d;
        setDecade(d);
        if (i === delays.length - 1) {
          setSpinning(false);
          setLuck(true);
          // 실제 화면: 여기서 바로 POST /api/engine/birth { decade: d } 호출
        }
      }, ms));
    });
  };

  return (
    <div className="ms sky">
      <Header />
      <main className="ms-in">
        <section className="ms-hero">
          <Badge live>지금 아시아 48개국 실시간</Badge>
          <h1 className="ms-title">환승인생</h1>
          <p className="ms-lead">시대를 고르면 나라, 성별, 집안 형편이 무작위로 정해집니다. 매년 선택하며 한 사람의 일생을 끝까지 살아 보세요.</p>

          <div className={'ms-pick' + (luck ? ' luck' : '') + (spinning ? ' spinning' : '')} aria-live="polite">
            <span className="ms-pick-dot" />
            <div>{luck ? '운명이 고른 시대' : spinning ? '시대를 고르는 중' : '태어날 시대'}<b>{decade}년대</b></div>
            <span className="ms-pick-hint">{range}<br />{luck ? '이 시대로 태어납니다' : '오른쪽 궤도에서 바꿀 수 있어요'}</span>
          </div>

          <div className="ms-acts">
            <Button type="primary" size="lg" className="ms-cta" disabled={spinning}>
              <StarIcon size={14} color="var(--on-primary)" />{decade}년대에 태어나기
            </Button>
            <Button size="lg" className="ms-cont" disabled={spinning}>이어서 살기<small>프리야 싱, 34세, 인도</small></Button>
          </div>
          <button type="button" className="ms-random" onClick={spin} disabled={spinning}>
            <DiceIcon />{spinning ? '운명이 시대를 고르는 중…' : '시대도 운에 맡기고 아무 때나 태어나기'}
          </button>
        </section>

        <Panel title="지금 아시아" className="ms-globe"
          right={<span className="ms-legend"><span><i className="bigstat-dot birth" />태어남</span><span><i className="bigstat-dot death" />떠남</span></span>}>
          <OrbitGlobe value={decade} onChange={choose} births={feed.globeBirths} deaths={feed.globeDeaths} />
        </Panel>

        <Panel title="방금 시작된 인생" right={<a href="#">전체 보기</a>} className="ms-c1">
          <FeedList items={feed.born} />
        </Panel>
        <Panel title="방금 끝난 인생" right={<a href="/memorial">추모관</a>} className="ms-c2">
          <FeedList items={feed.died} />
        </Panel>
        <Panel className="ms-c3">
          <div className="col" style={{ gap: 12 }}>
            <BigStat label="오늘 아시아에서 태어난 아기" value={counter.bornToday} dot="birth"
              sub={<>이 페이지를 연 뒤 <b>+{counter.bornSincePage.toLocaleString('ko-KR')}</b>명</>} />
            <BigStat label="오늘 아시아에서 떠난 사람" value={counter.diedToday} dot="death"
              sub={<>이 페이지를 연 뒤 <b>+{counter.diedSincePage.toLocaleString('ko-KR')}</b>명</>} />
            <p className="ms-source">유엔 세계인구전망 2024 기준 추정 (아시아 연간 출생 약 6,491만 명, 사망 약 3,488만 명)</p>
          </div>
        </Panel>
      </main>
    </div>
  );
}

export default Main;
