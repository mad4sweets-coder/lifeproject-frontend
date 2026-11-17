// 선택지 카드 (직업 제안 C06, 선택 인생 이벤트 C09)
// 예: <ChoiceCard title="방직 공장 기술공" tag="소득 배율 ×1.1" desc="설명" on={sel===id} onClick={...} />
import Badge from './Badge';
import './ui.css';

function ChoiceCard({ title, tag, desc, on, onClick }) {
  return (
    <button className={'choice-card' + (on ? ' on' : '')} onClick={onClick}>
      <div className="choice-card-top">
        <span className="choice-card-title">{title}</span>
        {tag && <Badge color="gold">{tag}</Badge>}
      </div>
      {desc && <div className="choice-card-desc">{desc}</div>}
    </button>
  );
}

export default ChoiceCard;
