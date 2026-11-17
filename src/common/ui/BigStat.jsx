// 큰 숫자 (메인의 실시간 출생·사망 수, 결과 화면 요약)
// 예: <BigStat label="오늘 아시아에서 태어난 아기" value={80412} dot="birth" sub={<>이 페이지를 연 뒤 <b>+37</b>명</>} />
// dot: birth(금색 점) / death(빈 원) / 없으면 점 없음,  value가 숫자면 1,204처럼 쉼표,  sub: 아래 작은 줄
import './ui.css';

function BigStat({ label, value, dot, sub }) {
  const shown = typeof value === 'number' ? value.toLocaleString('ko-KR') : value;
  return (
    <div className="bigstat">
      <div className="bigstat-label">{dot && <i className={'bigstat-dot ' + dot} />}{label}</div>
      <div className="bigstat-value">{shown}</div>
      {sub && <div className="bigstat-sub">{sub}</div>}
    </div>
  );
}

export default BigStat;
