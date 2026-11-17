// 능력치 바 (C05): 0~100 값을 빛나는 막대로
// 예: <StatBar type="health" value={life.health} />
// type: health 건강 / happiness 행복 / knowledge 지식 / relation 관계
import './ui.css';

const STAT = {
  health: { label: '건강', color: 'var(--stat-health)' },
  happiness: { label: '행복', color: 'var(--stat-happiness)' },
  knowledge: { label: '지식', color: 'var(--stat-knowledge)' },
  relation: { label: '관계', color: 'var(--stat-relation)' },
};

function StatBar({ type, value }) {
  const s = STAT[type];
  const v = Math.max(0, Math.min(100, Math.round(value || 0)));

  return (
    <div className="stat" style={{ '--bar-color': s.color }}>
      <span className="stat-label">{s.label}</span>
      <div className="stat-bar" role="meter" aria-label={s.label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={v}>
        <div className="stat-fill" style={{ width: v + '%' }} />
      </div>
      <span className="stat-value">{v}</span>
    </div>
  );
}

export default StatBar;
