// 선택 이벤트 창 (C09) - 엔진 응답의 needChoice 가 true 일 때 띄워요
// 예: <EventChoiceModal open={life.needChoice} event={life.pendingEvent}
//        onChoose={(choiceId) => POST /api/engine/choice { lifeId, choiceId, guestToken }} />
// 꼭 골라야 하는 창이라 바깥을 눌러도 안 닫혀요. 고르는 중(busy)에는 버튼이 잠겨요.
import Modal from './Modal';
import './ui.css';

function EventChoiceModal({ open, event, onChoose, busy }) {
  if (!open || !event) return null;
  const choices = event.choices || [];

  return (
    <Modal open title="인생의 갈림길">
      <p className="choice-q">{event.logText}</p>
      <div className="choice-opts">
        {choices.map((c, i) => (
          <button key={c.choiceId} type="button" className="choice-opt" disabled={busy}
            onClick={() => onChoose && onChoose(c.choiceId)}>
            <span className="choice-no">{i + 1}</span>
            <span>{c.choiceText}</span>
          </button>
        ))}
      </div>
      <p className="choice-hint">한 번 고르면 되돌릴 수 없어요.</p>
    </Modal>
  );
}

export default EventChoiceModal;
