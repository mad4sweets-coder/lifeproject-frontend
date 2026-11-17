// 인생 기록 한 줄 (C03)
// 예: <LogItem age={19} year={1966} text="방직 공장에 들어갔습니다." big detail="그해 인도에서는…" />
// big: 큰 사건 강조(금색 줄), star: 중요 표시, detail: 아래 상자 속 설명(역사 배경, AI 서술)
import './ui.css';

function LogItem({ age, year, text, big, star, detail }) {
  return (
    <div className={'log-item' + (big ? ' big' : '')}>
      <span className="log-age">{age}세{year && <><br /><small>{year}</small></>}</span>
      <div>
        <div className="log-text">{text}</div>
        {detail && <div className="log-detail">{detail}</div>}
      </div>
      <span className="log-star" aria-label={star ? '중요' : undefined}>{star ? '★' : ''}</span>
    </div>
  );
}

export default LogItem;
