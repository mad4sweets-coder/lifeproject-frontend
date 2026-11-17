// C08 마을 이동 (와이어프레임 '인생 진행' 화면 가운데 마을·채팅 칸) - 밤하늘 스타일
// 사용법:
// <Village countryCode="IND" age={34} gender="M"
//    caption="인도에서의 청년기 (34세, 공장 조장)"
//    myMessage="안녕하세요"                       ← 내가 보낸 채팅 (C18, 없으면 생략)
//    others={[{ id: 1, name: '라훌', age: 30, x: 30, y: 60, message: '반가워요' }]}  ← 같은 나라 접속자 (C17)
//    costume="#3a7d44" />                          ← 장착 코스튬 색 (M09, 없으면 기본 옷)
import { useEffect, useState } from 'react';
import { COUNTRIES, THEMES, AREA, STEP, SKY_STARS } from './villageData';
import './village.css';

// 건물 사이 장식 그림 (이모지 대신 직접 그린 실루엣)
function Deco({ kind }) {
  if (kind === 'palm') {
    return (
      <svg viewBox="0 0 40 48" className="v-deco" aria-hidden="true">
        <path d="M21 46 C20 34 19 24 22 14" stroke="#3b2f3f" strokeWidth="3" fill="none" />
        <path d="M22 14 C14 8 6 10 2 16 M22 14 C30 8 38 10 40 16 M22 14 C18 6 12 2 6 4 M22 14 C26 6 32 2 38 4" stroke="#1f3a3a" strokeWidth="4" fill="none" strokeLinecap="round" />
      </svg>
    );
  }
  if (kind === 'blossom') {
    return (
      <svg viewBox="0 0 40 48" className="v-deco" aria-hidden="true">
        <path d="M20 46 V26 M20 32 L13 25" stroke="#3b2f3f" strokeWidth="3" fill="none" />
        <circle cx="20" cy="18" r="13" fill="#6b4a7a" />
        <circle cx="12" cy="22" r="8" fill="#7d5590" />
        <circle cx="28" cy="21" r="8" fill="#7d5590" />
        <circle cx="16" cy="13" r="2" fill="#f2c6e0" /><circle cx="25" cy="16" r="2" fill="#f2c6e0" /><circle cx="19" cy="24" r="2" fill="#f2c6e0" />
      </svg>
    );
  }
  if (kind === 'mountain') {
    return (
      <svg viewBox="0 0 40 48" className="v-deco" aria-hidden="true">
        <path d="M0 46 L14 18 L22 30 L28 22 L40 46Z" fill="#2c3560" />
        <path d="M14 18 L18 26 L11 25Z" fill="#c9d2ff" opacity="0.7" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 40 48" className="v-deco" aria-hidden="true">
      <path d="M20 46 V28" stroke="#3b2f3f" strokeWidth="3" />
      <circle cx="20" cy="20" r="14" fill="#1f3a34" />
    </svg>
  );
}

function Village({ countryCode, age, gender = 'M', caption, myMessage, others = [], costume }) {
  // 내 위치 (마을 크기 대비 %)
  const [pos, setPos] = useState({ x: 50, y: 76 });
  const [dir, setDir] = useState('right');

  const info = COUNTRIES[countryCode] || ['', 'EAST'];
  const flagCode = info[0];
  const region = info[1];
  const theme = THEMES[region];

  // 나라(권역)가 바뀌면 처음 자리로 (이민 C09)
  useEffect(() => {
    setPos({ x: 50, y: 76 });
  }, [countryCode]);

  // 방향키로 이동 (마을 밖, 건물 쪽으로는 못 감)
  useEffect(() => {
    const onKeyDown = (e) => {
      const tag = e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
        return; // 입력 중에는 안 움직임
      }
      let dx = 0;
      let dy = 0;
      if (e.key === 'ArrowUp') dy = -STEP;
      else if (e.key === 'ArrowDown') dy = STEP;
      else if (e.key === 'ArrowLeft') dx = -STEP;
      else if (e.key === 'ArrowRight') dx = STEP;
      else return;

      e.preventDefault();
      if (dx < 0) setDir('left');
      if (dx > 0) setDir('right');

      setPos((p) => ({
        x: Math.min(AREA.maxX, Math.max(AREA.minX, p.x + dx)),
        y: Math.min(AREA.maxY, Math.max(AREA.minY, p.y + dy)),
      }));
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const clothes = costume || (gender === 'F' ? '#e98aa6' : '#7aa8ff');

  return (
    <div className={'village village-' + region} style={{ background: theme.sky }}>
      {/* 하늘: 별 */}
      {SKY_STARS.map(([x, y, s], i) => (
        <span key={i} className="v-star" style={{ left: x + '%', top: y + '%', width: s, height: s, animationDelay: (i % 5) * 0.6 + 's' }} />
      ))}

      {/* 땅과 길 */}
      <div className="v-ground" style={{ background: theme.ground }} />
      <div className="v-road" style={{ background: theme.road }} />

      {/* 건물 4채 + 사이 장식 */}
      <div className="v-buildings">
        {theme.buildings.map((name, i) => (
          <div key={name} className="v-slot">
            <div className="v-building">
              <div className="v-roof" style={{ background: theme.roof }} />
              <div className="v-wall" style={{ background: theme.wall }}>
                <span className="v-window" /><span className="v-window" />
                <span className="v-door" />
              </div>
            </div>
            <div className="v-sign">{name}</div>
            {i < 3 && <Deco kind={theme.deco} />}
          </div>
        ))}
      </div>

      {/* 위쪽 안내: 지금 상황, 조작키 */}
      <div className="v-caption">
        {flagCode && <img src={`https://flagcdn.com/w20/${flagCode}.png`} alt="" />}
        {caption}
      </div>
      <div className="v-keys">
        <kbd>←</kbd><kbd>→</kbd><kbd>↑</kbd><kbd>↓</kbd> 이동 <kbd>Enter</kbd> 채팅
      </div>

      {/* 같은 나라 접속자 (흐린 실루엣) */}
      {others.map((o) => (
        <div key={o.id} className="v-person other" style={{ left: o.x + '%', top: o.y + '%' }}>
          {o.message && <div className="v-bubble">{o.message}</div>}
          <div className="v-head" />
          <div className="v-body" />
          <div className="v-name">{o.name}{o.age != null && ', ' + o.age + '세'}</div>
        </div>
      ))}

      {/* 나 */}
      <div className={'v-person me ' + dir} style={{ left: pos.x + '%', top: pos.y + '%' }}>
        {myMessage && <div className="v-bubble mine">{myMessage}</div>}
        <div className="v-head" />
        <div className="v-body" style={{ background: clothes }} />
        <div className="v-name mine">나{age != null && ', ' + age + '세'}</div>
      </div>
    </div>
  );
}

export default Village;
