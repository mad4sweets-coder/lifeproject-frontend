// 네 갈래 별 아이콘 (로고, 버튼 앞, 출생 표시)
// 예: <StarIcon size={16} />,  <StarIcon size={12} color="var(--on-primary)" />
import './ui.css';

function StarIcon({ size = 16, color = 'var(--primary)' }) {
  return (
    <svg className="star-icon" width={size} height={size} viewBox="0 0 18 18" aria-hidden="true">
      <path d="M9 0 Q10.6 7.4 18 9 Q10.6 10.6 9 18 Q7.4 10.6 0 9 Q7.4 7.4 9 0Z" fill={color} />
    </svg>
  );
}

export default StarIcon;
