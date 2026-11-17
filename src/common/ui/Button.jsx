// 공통 버튼
// 예: <Button type="primary" size="lg" onClick={...}>1980년대에 태어나기</Button>
// type: primary(금색) / light(흰색) / danger(빨강 테두리) / ghost(테두리 없음) / 없으면 기본(테두리만)
// size: sm / lg / 없으면 보통,  block: 가로 꽉 채우기,  pill: 알약 모양
import './ui.css';

function Button({ type, size, block, pill, className = '', children, ...rest }) {
  let cls = 'btn';
  if (type) cls += ' btn-' + type;
  if (size) cls += ' btn-' + size;
  if (block) cls += ' btn-block';
  if (pill) cls += ' btn-pill';
  return (
    <button type="button" className={cls + ' ' + className} {...rest}>
      {children}
    </button>
  );
}

export default Button;
