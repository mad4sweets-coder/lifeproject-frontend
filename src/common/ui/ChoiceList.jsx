// 선택지 목록 (집중 선택 C04, 직업 선택 C06)
// 예: <ChoiceList items={[{ value: 'SPORT', label: '운동', desc: '건강↑ 행복↑' }]} onPick={(v) => ...} />
import Button from './Button';
import './ui.css';

function ChoiceList({ items, selected, onPick }) {
  return (
    <div className="choice-list">
      {items.map((it) => (
        <Button key={it.value} block
          className={'choice' + (selected === it.value ? ' selected' : '')}
          onClick={() => onPick(it.value)}>
          <span>{it.label}</span>
          {it.desc && <small>{it.desc}</small>}
        </Button>
      ))}
    </div>
  );
}

export default ChoiceList;
