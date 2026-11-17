// 문서 카드 (출생신고서, 인생 결과)
// 예: <DocCard title="출생 신고서" en="Certificate of live birth" right="No. 000123"
//        footer={<Button type="primary">삶을 시작하기</Button>}>...</DocCard>
import './ui.css';

function DocCard({ title, en, right, footer, children }) {
  return (
    <div className="doc">
      <div className="doc-head">
        <span className="doc-title">{title}{en && <small>{en}</small>}</span>
        {right && <small>{right}</small>}
      </div>
      <div className="doc-body">{children}</div>
      {footer && <div className="doc-foot">{footer}</div>}
    </div>
  );
}

export default DocCard;
