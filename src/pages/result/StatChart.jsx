// C18 능력치 변화 그래프 (나이별 건강·행복·지식·관계 꺾은선)
// 그래프 라이브러리 없이 SVG로 직접 그림
// 예: <StatChart years={result.years} />
const LINES = [
  { key: 'health', label: '건강', color: 'var(--stat-health)' },
  { key: 'happiness', label: '행복', color: 'var(--stat-happiness)' },
  { key: 'knowledge', label: '지식', color: 'var(--stat-knowledge)' },
  { key: 'relation', label: '관계', color: 'var(--stat-relation)' },
];

const W = 640;   // 그림 너비
const H = 220;   // 그림 높이
const PAD = 28;  // 여백 (눈금 글자 자리)

function StatChart({ years }) {
  if (!years || years.length < 2) {
    return <p className="sub">기록이 부족해서 그래프를 그릴 수 없어요.</p>;
  }

  const maxAge = years[years.length - 1].age;
  // 나이 → x 좌표, 값(0~100) → y 좌표
  const x = (age) => PAD + (age / Math.max(1, maxAge)) * (W - PAD * 2);
  const y = (v) => H - PAD - (v / 100) * (H - PAD * 2);

  // 10세마다 아래 눈금
  const ticks = [];
  for (let a = 0; a <= maxAge; a += 10) ticks.push(a);

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="나이별 능력치 변화 그래프">
        {/* 가로 기준선 0·50·100 */}
        {[0, 50, 100].map((v) => (
          <g key={v}>
            <line x1={PAD} x2={W - PAD} y1={y(v)} y2={y(v)} stroke="var(--line)" strokeWidth="1" />
            <text x={PAD - 6} y={y(v) + 4} fontSize="10" textAnchor="end" fill="var(--ink-light)">{v}</text>
          </g>
        ))}
        {/* 나이 눈금 */}
        {ticks.map((a) => (
          <text key={a} x={x(a)} y={H - 8} fontSize="10" textAnchor="middle" fill="var(--ink-light)">{a}세</text>
        ))}
        {/* 능력치 4개 꺾은선 */}
        {LINES.map((l) => (
          <polyline
            key={l.key}
            fill="none"
            stroke={l.color}
            strokeWidth="2"
            strokeLinejoin="round"
            points={years.map((r) => `${x(r.age)},${y(r[l.key])}`).join(' ')}
          />
        ))}
      </svg>
      {/* 범례 */}
      <div className="row" style={{ justifyContent: 'center', fontSize: 'var(--fs-xs)' }}>
        {LINES.map((l) => (
          <span key={l.key}>
            <i style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, background: l.color, marginRight: 4 }} />
            {l.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default StatChart;
