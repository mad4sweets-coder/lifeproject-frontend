// 칩 목록 (올해의 집중, 추천 질문)
// 예: <Chips items={[{ value: 'WORK', label: '일에 몰두' }]} selected="WORK" onPick={choose} />
import './ui.css';

function Chips({ items, selected, onPick }) {
  return (
    <div className="chips">
      {items.map((it) => (
        <button key={it.value} className={'chip' + (selected === it.value ? ' on' : '')}
          onClick={() => onPick(it.value)}>
          {it.label}
        </button>
      ))}
    </div>
  );
}

export default Chips;
