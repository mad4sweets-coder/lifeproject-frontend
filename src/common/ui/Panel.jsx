// 공통 카드(패널): 화면의 구역을 나눌 때 사용
// 예: <Panel title="방금 시작된 인생" right={<a href="#">전체 보기</a>}>...</Panel>
// right: 제목 오른쪽에 붙일 링크·버튼 (없으면 생략)
import './ui.css';

function Panel({ title, right, className = '', children, style }) {
  return (
    <div className={'panel ' + className} style={style}>
      {(title || right) && (
        <div className="panel-head">
          <span className="panel-title">{title}</span>
          {right}
        </div>
      )}
      {children}
    </div>
  );
}

export default Panel;
