import { useNavigate } from 'react-router-dom';
import Button from '../../common/ui/Button';
import styles from './MyPage.module.css';

// 마이페이지 왼쪽 메뉴 (마이페이지 · 개인정보 수정 · 전생 기록 · 특성 강화 화면이 같이 씀)
// 예: <MyPageSide active="edit" nickname="민승" loginId="msj01" />
// active: 지금 보고 있는 메뉴 → 'home' / 'edit' / 'lives' / 'traits'
const MENUS = [
  { key: 'home', label: '마이페이지', path: '/mypage' },
  { key: 'edit', label: '개인정보 수정', path: '/mypage/edit' },
  { key: 'lives', label: '전생 기록', path: '/mypage/lives' },
  { key: 'traits', label: '특성 강화', path: '/mypage/traits' },
];

function MyPageSide({ active, nickname, loginId }) {
  const navigate = useNavigate();

  // 로그아웃 (M03): 로그인 토큰만 지우고 비회원 guestToken 은 그대로 둠
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('nickname');
    localStorage.removeItem('memberRole');
    navigate('/');
  };

  return (
    <aside className={styles.side}>
      <div className={styles.profile}>
        <div className={styles.character}>캐릭터</div>
        <div>
          <div className={styles.profileName}>{nickname}</div>
          <div className={styles.profileSub}>{loginId}</div>
        </div>
      </div>

      {/* 메뉴 4개를 반복해서 그림 (지금 메뉴는 금색) */}
      {MENUS.map((m) => (
        <button
          key={m.key}
          className={m.key === active ? `${styles.menu} ${styles.menuOn}` : styles.menu}
          onClick={() => navigate(m.path)}
        >
          {m.label} <span>›</span>
        </button>
      ))}

      <Button size="sm" onClick={logout}>로그아웃</Button>
    </aside>
  );
}

export default MyPageSide;
