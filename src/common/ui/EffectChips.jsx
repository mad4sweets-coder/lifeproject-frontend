// 효과 칩 (이벤트·선택지가 능력치·돈에 준 변화)
// 예: <EffectChips effect={{ effHealth: -10, effHappiness: 5, effIncomeRate: 0.1, effWealthRate: -0.3 }} />
// 엔진 응답의 events[i] 를 그대로 넣으면 돼요. 0인 항목은 안 보여요.
import './ui.css';

const ITEMS = [
  ['effHealth', '건강', 'var(--stat-health)'],
  ['effHappiness', '행복', 'var(--stat-happiness)'],
  ['effKnowledge', '지식', 'var(--stat-knowledge)'],
  ['effRelation', '관계', 'var(--stat-relation)'],
];

function EffectChips({ effect }) {
  if (!effect) return null;
  const chips = [];

  ITEMS.forEach(([key, label, color]) => {
    const v = Math.round(effect[key] || 0);
    if (v !== 0) chips.push({ key, label, text: (v > 0 ? '+' : '') + v, up: v > 0, color });
  });
  // 소득·재산은 비율 (0.1 = +10%)
  [['effIncomeRate', '소득'], ['effWealthRate', '재산']].forEach(([key, label]) => {
    const v = Math.round((effect[key] || 0) * 100);
    if (v !== 0) chips.push({ key, label, text: (v > 0 ? '+' : '') + v + '%', up: v > 0, color: 'var(--primary)' });
  });

  if (chips.length === 0) return null;
  return (
    <span className="effects">
      {chips.map((c) => (
        <span key={c.key} className={'effect ' + (c.up ? 'up' : 'down')} style={{ '--fx': c.color }}>
          <i />{c.label} {c.text}
        </span>
      ))}
    </span>
  );
}

export default EffectChips;
