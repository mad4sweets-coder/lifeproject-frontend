// 상단 헤더 (모든 화면 공통)
// 예: <Header nickname="동현" onLogout={logout} />  (비회원이면 nickname 생략 → 로그인·회원가입 버튼)
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Button from './Button';
import StarIcon from './StarIcon';
import './ui.css';

function Header({ nickname, onLogout }) {
  const navigate = useNavigate();
  const navClass = ({ isActive }) => (isActive ? 'on' : '');

  return (
    <header className="header">
      <div className="header-in">
        <Link to="/" className="header-logo"><StarIcon size={16} />환승인생</Link>
        <nav className="header-nav">
          <NavLink to="/" end className={navClass}>시작하기</NavLink>
          <NavLink to="/memorial" className={navClass}>추모관</NavLink>
          <NavLink to="/mypage" className={navClass}>내 인생들</NavLink>
        </nav>
        <div className="header-space" />
        <div className="header-right">
          {nickname ? (
            <>
              <span className="header-user"><b>{nickname}</b>님</span>
              <Button size="sm" onClick={onLogout}>로그아웃</Button>
            </>
          ) : (
            <>
              <Button size="sm" onClick={() => navigate('/login')}>로그인</Button>
              <Button size="sm" type="light" onClick={() => navigate('/join')}>회원가입</Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
