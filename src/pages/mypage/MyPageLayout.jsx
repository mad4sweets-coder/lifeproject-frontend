import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import client from '../../api/api';
import MyPageSide from './MyPageSide';
import styles from './MyPage.module.css';

// 마이페이지 틀 (주소가 /mypage 로 시작하면 항상 이 화면이 먼저 그려짐)
//   왼쪽: MyPageSide (메뉴)
//   오른쪽: <Outlet /> 자리에 주소에 맞는 화면이 들어감
//     /mypage → MyPage,  /mypage/edit → EditPage,  /mypage/lives → LivesPage,  /mypage/traits → TraitsPage
// 내 정보(GET /api/members/me)는 여기서 한 번만 받아서 context 로 아래 화면들에 넘겨 줌
function MyPageLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation(); // 지금 주소 (예: /mypage/edit)
  const [my, setMy] = useState(null);

  // 1. 처음 들어올 때 한 번: 로그인 확인 + 내 정보 받기
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login'); // 로그인한 회원만 (M04)
      return;
    }
    client.get('/api/members/me')
      .then((res) => setMy(res.data))
      .catch((err) => {
        // 토큰 만료(401) → 로그인 정보 지우고 로그인 화면으로
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('nickname');
          localStorage.removeItem('memberRole');
          navigate('/login');
        }
      });
  }, [navigate]);

  // 2. 주소를 보고 왼쪽 메뉴 중 어느 것을 금색으로 할지
  let active = 'home';
  if (pathname.startsWith('/mypage/edit')) active = 'edit';
  else if (pathname.startsWith('/mypage/lives')) active = 'lives';
  else if (pathname.startsWith('/mypage/traits')) active = 'traits';

  // 3. 서버 응답 오기 전
  if (!my) {
    return <div className={styles.loading}>불러오는 중…</div>;
  }

  return (
    <div className={styles.container}>
      <MyPageSide active={active} nickname={my.nickname} loginId={my.loginId} />
      {/* 아래 화면들은 useOutletContext() 로 my, setMy 를 꺼내 씀 */}
      <Outlet context={{ my, setMy }} />
    </div>
  );
}

export default MyPageLayout;
