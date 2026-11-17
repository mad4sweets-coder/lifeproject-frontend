// 특성 레벨 점 (C13): ■■□□□ Lv.2
// 예: <LevelDots label="투자 성공" level={2} />
import './ui.css';

function LevelDots({ label, level, max = 5 }) {
  const dots = [];
  for (let i = 0; i < max; i++) {
    dots.push(<span key={i} className={'level-dot' + (i < level ? ' on' : '')} />);
  }
  return (
    <div className="level">
      <span>{label}</span>
      <span className="level-dots">
        {dots}
        <span className="level-text">Lv.{level}</span>
      </span>
    </div>
  );
}

export default LevelDots;
