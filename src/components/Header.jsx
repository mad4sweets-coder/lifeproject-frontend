import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';

// 모든 화면 위에 붙는 머리글
// 로그인 안 했을 때: 추모관 · 로그인 · 회원가입
// 로그인 했을 때:   추모관 · (관리자) · 마이페이지 · 닉네임 · 로그아웃
function Header() {
  const navigate = useNavigate();

  // 주소가 바뀔 때마다 Header 를 다시 그리게 함
  // (로그인 후 메인으로 이동하면 → 다시 그려지면서 토큰을 새로 읽음)
  useLocation();

  // 브라우저에 저장된 값 읽기 (없으면 null)
  const token = localStorage.getItem('token');
  const nickname = localStorage.getItem('nickname');
  const isAdmin = localStorage.getItem('memberRole') === 'ADMIN';

  // 로그아웃: 저장해 둔 토큰·닉네임·권한을 지우고 메인으로
  // (비회원 임시 토큰 guestToken 은 다른 키라서 지우지 않음)
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('nickname');
    localStorage.removeItem('memberRole');
    navigate('/');
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <Link to="/" className={styles.logo}>환승인생</Link>
        <span className={styles.badge}>아시아 · 1940 – 현재</span>
      </div>

      <nav className={styles.headerRight}>
        <Link to="/memorial" className={styles.navBtn}>추모관</Link>

        {token ? (
          // ── 로그인 상태 ──
          <>
            {isAdmin && <Link to="/admin" className={styles.navBtnDark}>관리자</Link>}
            <Link to="/mypage" className={styles.navBtn}>마이페이지</Link>
            <span className={styles.nickname}>{nickname} 님</span>
            <button type="button" className={styles.navBtn} onClick={handleLogout}>로그아웃</button>
          </>
        ) : (
          // ── 비로그인 상태 ──
          <>
            <Link to="/login" className={styles.navBtn}>로그인</Link>
            <Link to="/join" className={styles.navBtn}>회원가입</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
