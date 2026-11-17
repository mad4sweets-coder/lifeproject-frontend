// 올해 일어난 일 (C03·C09) - 엔진 /api/engine/next 응답의 events 를 그대로 넣으면 돼요
// 예: <YearEvents age={life.currentAge - 1} year={life.birthYear + life.currentAge - 1} events={life.events} />
// 선택 이벤트(choice = true)는 여기서 빼고 EventChoiceModal 로 보여 줘요.
// 아무 일도 없던 해는 "조용히 지나간 한 해" 문구가 나와요.
import EffectChips from './EffectChips';
import './ui.css';

function YearEvents({ age, year, events }) {
  const list = (events || []).filter((e) => !e.choice);

  return (
    <div className="year">
      <div className="year-head">
        <span className="year-age">{age}<small>세</small></span>
        {year && <span className="year-year">{year}년</span>}
      </div>
      {list.length === 0 ? (
        <p className="year-quiet">특별한 일 없이 조용히 지나간 한 해였어요.</p>
      ) : (
        <ul className="year-list">
          {list.map((e, i) => (
            <li key={e.eventId + '-' + i} className="year-item">
              <span className="year-dot" aria-hidden="true" />
              <div>
                <p className="year-text">{e.logText}</p>
                <EffectChips effect={e} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default YearEvents;
