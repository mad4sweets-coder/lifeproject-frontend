// 작은 표시 딱지
// 예: <Badge color="green">대졸</Badge>,  <Badge color="dark">인도 (당시 영국령 인도)</Badge>,  <Badge color="gold" live>실시간</Badge>
// color: gold / green / blue / red / yellow / dark / 없으면 기본(테두리만),  live: 앞에 반짝이는 금색 점
import './ui.css';

function Badge({ color, live, children }) {
  let cls = 'badge';
  if (color) cls += ' badge-' + color;
  if (live) cls += ' badge-live';
  return <span className={cls}>{children}</span>;
}

export default Badge;
