// 가로 막대 한 줄 (나라별 접속자, 출생 비율)
// 예: <BarRow label="인도" value={98} max={98} unit="명" />
import './ui.css';

function BarRow({ label, value, max, unit = '' }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="bar-row">
      <span>{label}</span>
      <div className="bar-track"><div className="bar-fill" style={{ width: pct + '%' }} /></div>
      <span className="bar-value">{value}{unit}</span>
    </div>
  );
}

export default BarRow;
