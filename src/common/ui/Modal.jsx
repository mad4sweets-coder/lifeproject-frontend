// 선택 창 (모달): 집중 선택, 직업 선택, 이벤트 선택에 사용
// 예: <Modal open={life.needFocus} title="올해 무엇에 집중할까요?">...</Modal>
// onClose를 넘기면 바깥을 눌러 닫을 수 있음 (꼭 골라야 하는 창은 onClose 생략)
import Panel from './Panel';
import './ui.css';

function Modal({ open, title, onClose, children }) {
  if (!open) {
    return null;
  }
  return (
    <div className="modal-back" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <Panel title={title}>{children}</Panel>
      </div>
    </div>
  );
}

export default Modal;
