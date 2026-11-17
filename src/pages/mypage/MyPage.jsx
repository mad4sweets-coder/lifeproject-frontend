import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../../api/api';
import Button from '../../common/ui/Button';
import MyPageSide from './MyPageSide';
import styles from './MyPage.module.css';

// 마이페이지 (M04)  주소: /mypage
// 와이어프레임 15쪽: 왼쪽 메뉴 + 가입 정보 + 숫자 칸 3개 + 진행 중인 인생 + 전생 기록·특성 강화 바로가기
function MyPage() {
  const navigate = useNavigate();
  const [my, setMy] = useState(null); // 서버에서 받은 마이페이지 정보 (받기 전엔 null)

  // 화면이 처음 열릴 때 한 번 실행
  useEffect(() => {
    // 1. 토큰이 없으면 로그인 화면으로 (M04: 로그인한 회원만)
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }

    // 2. 서버에 내 정보 요청 (토큰은 api.js 가 자동으로 붙여 줌)
    client.get('/api/members/me')
      .then((res) => setMy(res.data))
      .catch((err) => {
        // 3. 토큰이 만료됐으면(401) 토큰 지우고 로그인 화면으로
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      });
  }, [navigate]);

  // 서버 응답이 오기 전
  if (!my) {
    return <div className={styles.loading}>불러오는 중…</div>;
  }

  return (
    <div className={styles.container}>
      {/* ===== 왼쪽 메뉴 (MyPageSide.jsx) ===== */}
      <MyPageSide active="home" nickname={my.nickname} loginId={my.loginId} />

      {/* ===== 오른쪽 내용 ===== */}
      <main className={styles.main}>
        <h1 className={styles.title}>마이페이지</h1>
        <p className={styles.lead}>내 가입 정보와 지금까지 살아 본 인생을 확인해요.</p>

        {/* 가입 정보 */}
        <section className={styles.card}>
          <div className={styles.cardHead}>
            <span className={styles.cardTitle}>가입 정보</span>
            <Button size="sm" onClick={() => navigate('/mypage/edit')}>개인정보 수정</Button>
          </div>
          <dl className={styles.info}>
            <dt>아이디</dt><dd>{my.loginId}</dd>
            <dt>닉네임</dt><dd>{my.nickname}</dd>
            <dt>이메일</dt><dd>{my.email}</dd>
            <dt>가입 일자</dt><dd>{my.joinDate}</dd>
          </dl>
        </section>

        {/* 숫자 칸 3개 */}
        <div className={styles.stats}>
          <div className={styles.stat}><span>보유 포인트</span><b>{my.point}P</b></div>
          <div className={styles.stat}><span>살아본 인생</span><b>{my.lifeCount}번</b></div>
          <div className={styles.stat}><span>퀘스트 달성</span><b>{my.questDone}개</b></div>
        </div>

        {/* 진행 중인 인생 */}
        <section className={styles.card}>
          <div className={styles.cardHead}>
            <span className={styles.cardTitle}>진행 중인 인생</span>
          </div>
          {my.lifeId ? (
            <div className={styles.life}>
              <div className={styles.character}>캐릭터</div>
              <div className={styles.lifeText}>
                <b>{my.lifeName}</b>
                <span>{my.countryName} · {my.currentAge}살</span>
              </div>
              {/* TODO: 게임 진행 화면 주소가 정해지면 바꾸기 (C03, 엔진 담당) */}
              <Button type="primary" onClick={() => navigate('/play', { state: { lifeId: my.lifeId } })}>
                이어하기
              </Button>
            </div>
          ) : (
            <div className={styles.life}>
              <div className={styles.character}>캐릭터</div>
              <div className={styles.lifeText}>
                <b>진행 중인 인생이 없어요</b>
                <span>메인에서 새 인생을 시작해 보세요.</span>
              </div>
              <Button onClick={() => navigate('/')}>태어나기</Button>
            </div>
          )}
        </section>

        {/* 전생 기록 · 특성 강화 바로가기 */}
        <div className={styles.twoCol}>
          <section className={styles.card}>
            <div className={styles.cardHead}><span className={styles.cardTitle}>전생 기록</span></div>
            <p className={styles.desc}>지금까지 {my.lifeCount}번의 인생을 살았어요.</p>
            <Button block onClick={() => navigate('/mypage/lives')}>바로가기 ›</Button>
          </section>
          <section className={styles.card}>
            <div className={styles.cardHead}><span className={styles.cardTitle}>특성 강화</span></div>
            <p className={styles.desc}>포인트 {my.point}점으로 특성을 올릴 수 있어요.</p>
            <Button block onClick={() => navigate('/mypage/traits')}>바로가기 ›</Button>
          </section>
        </div>
      </main>
    </div>
  );
}

export default MyPage;
