// 정보 칸 (성별, 이름, 가정형편, 기대수명, 평균 소득…)
// 여러 개는 <div className="info-grid"> 로 감싸면 자동 정렬
// 예: <InfoBox label="기대수명" value="47세" />
import './ui.css';

function InfoBox({ label, value }) {
  return (
    <div className="info-box">
      <div className="info-box-label">{label}</div>
      <div className="info-box-value">{value}</div>
    </div>
  );
}

export default InfoBox;
