// 선택 카드 묶음 (메인의 연대 선택)
// 예: <OptionGrid items={[{ value: 1940, label: '1940년대', sub: '1940 – 1949' }]} selected={decade} onPick={setDecade} />
import './ui.css';

function OptionGrid({ items, selected, onPick }) {
  return (
    <div className="option-grid">
      {items.map((it) => (
        <button key={it.value} className={'option-card' + (selected === it.value ? ' on' : '')}
          onClick={() => onPick(it.value)}>
          {it.label}
          {it.sub && <small>{it.sub}</small>}
        </button>
      ))}
    </div>
  );
}

export default OptionGrid;
