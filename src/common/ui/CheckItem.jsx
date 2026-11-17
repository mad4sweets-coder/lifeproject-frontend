// 체크 목록 한 줄 (퀘스트 고르기 C01)
// 예: <CheckItem label="80세까지 살기" right="1P" on={picked} onClick={toggle} />
import './ui.css';

function CheckItem({ label, right, on, onClick }) {
  return (
    <button className={'check-item' + (on ? ' on' : '')} onClick={onClick}>
      <span className="check-box" />
      <span className="check-label">{label}</span>
      {right && <span className="check-right">{right}</span>}
    </button>
  );
}

export default CheckItem;
