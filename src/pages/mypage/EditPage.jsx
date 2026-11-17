import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../../api/api';
import Button from '../../common/ui/Button';
import Modal from '../../common/ui/Modal';
import MyPageSide from './MyPageSide';
import common from './MyPage.module.css'; // 마이페이지와 같은 틀 (container, card, title …)
import styles from './EditPage.module.css'; // 이 화면만 쓰는 입력칸 모양

// 개인정보 수정 (M05) + 회원 탈퇴 (M06)  주소: /mypage/edit
// 와이어프레임 16쪽
function EditPage() {
  const navigate = useNavigate();

  const [my, setMy] = useState(null); // 처음 불러온 내 정보 (원래 닉네임·이메일 비교용)

  // 입력칸 값
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordCheck, setNewPasswordCheck] = useState('');

  // 안내 문구
  const [nickMsg, setNickMsg] = useState('');
  const [emailMsg, setEmailMsg] = useState('');
  const [message, setMessage] = useState(''); // 저장 결과
  const [error, setError] = useState('');     // 저장 오류

  // 탈퇴
  const [withdrawPw, setWithdrawPw] = useState('');
  const [withdrawError, setWithdrawError] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false); // 탈퇴 확인 창

  // 1. 화면이 열리면 내 정보 불러와서 입력칸에 채우기
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }
    client.get('/api/members/me')
      .then((res) => {
        setMy(res.data);
        setNickname(res.data.nickname);
        setEmail(res.data.email);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      });
  }, [navigate]);

  // 2. 닉네임 중복 확인 (원래 닉네임 그대로면 확인 필요 없음)
  const checkNickname = async () => {
    if (nickname === my.nickname) return setNickMsg('지금 쓰는 닉네임이에요.');
    const res = await client.get('/api/members/check-nickname', { params: { nickname } });
    setNickMsg(res.data.available ? '사용할 수 있는 닉네임이에요.' : '이미 사용 중인 닉네임이에요.');
  };

  // 3. 이메일 중복 확인
  const checkEmail = async () => {
    if (email === my.email) return setEmailMsg('지금 쓰는 이메일이에요.');
    const res = await client.get('/api/members/check-email', { params: { email } });
    setEmailMsg(res.data.available ? '사용할 수 있는 이메일이에요.' : '이미 사용 중인 이메일이에요.');
  };

  // 4. 저장하기 → PUT /api/members/me
  const save = async () => {
    setMessage('');
    setError('');
    if (!currentPassword) return setError('현재 비밀번호를 입력해 주세요.');
    if (newPassword && newPassword !== newPasswordCheck) return setError('새 비밀번호 확인이 일치하지 않습니다.');

    try {
      const res = await client.put('/api/members/me', {
        nickname, email, currentPassword, newPassword, newPasswordCheck,
      });
      // 헤더 닉네임도 바꾸기
      localStorage.setItem('nickname', res.data.nickname);
      setMy({ ...my, nickname, email });
      setCurrentPassword('');
      setNewPassword('');
      setNewPasswordCheck('');
      setMessage('저장했습니다.');
    } catch (err) {
      setError(err.response?.data?.message || '저장하지 못했습니다.');
    }
  };

  // 5. 회원 탈퇴 버튼 → 비밀번호 입력했는지 보고 확인 창 열기
  const openConfirm = () => {
    setWithdrawError('');
    if (!withdrawPw) return setWithdrawError('비밀번호를 입력해 주세요.');
    setConfirmOpen(true);
  };

  // 6. 확인 창에서 "탈퇴하기" → POST /api/members/me/withdraw
  const withdraw = async () => {
    try {
      await client.post('/api/members/me/withdraw', { currentPassword: withdrawPw });
      // 로그인 토큰 지우고 메인으로 (비회원 guestToken 은 그대로)
      localStorage.removeItem('token');
      localStorage.removeItem('nickname');
      localStorage.removeItem('memberRole');
      navigate('/');
    } catch (err) {
      setConfirmOpen(false);
      setWithdrawError(err.response?.data?.message || '탈퇴하지 못했습니다.');
    }
  };

  if (!my) {
    return <div className={common.loading}>불러오는 중…</div>;
  }

  return (
    <div className={common.container}>
      <MyPageSide active="edit" nickname={my.nickname} loginId={my.loginId} />

      <main className={common.main}>
        <h1 className={common.title}>개인정보 수정</h1>
        <p className={common.lead}>저장하려면 현재 비밀번호를 꼭 입력해 주세요. 아이디는 바꿀 수 없어요.</p>

        {/* ===== 개인정보 수정 (M05) ===== */}
        <section className={common.card}>
          <div className={styles.row}>
            <label>아이디</label>
            <input className={styles.input} value={my.loginId} disabled />
          </div>

          <div className={styles.row}>
            <label>닉네임</label>
            <input className={styles.input} value={nickname}
              onChange={(e) => { setNickname(e.target.value); setNickMsg(''); }} />
            <Button onClick={checkNickname}>중복 확인</Button>
          </div>
          {nickMsg && <p className={styles.hint}>{nickMsg}</p>}

          <div className={styles.row}>
            <label>현재 비밀번호</label>
            <input className={styles.input} type="password" value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)} />
          </div>

          <div className={styles.row}>
            <label>새 비밀번호</label>
            <input className={styles.input} type="password" value={newPassword}
              placeholder="바꾸지 않으려면 비워 두세요"
              onChange={(e) => setNewPassword(e.target.value)} />
          </div>

          <div className={styles.row}>
            <label>새 비밀번호 확인</label>
            <input className={styles.input} type="password" value={newPasswordCheck}
              onChange={(e) => setNewPasswordCheck(e.target.value)} />
          </div>

          <div className={styles.row}>
            <label>이메일</label>
            <input className={styles.input} value={email}
              onChange={(e) => { setEmail(e.target.value); setEmailMsg(''); }} />
            <Button onClick={checkEmail}>중복 확인</Button>
          </div>
          {emailMsg && <p className={styles.hint}>{emailMsg}</p>}

          {error && <div className={styles.error}>{error}</div>}
          {message && <div className={styles.ok}>{message}</div>}

          <div className={styles.actions}>
            <Button onClick={() => navigate('/mypage')}>취소</Button>
            <Button type="primary" onClick={save}>저장하기</Button>
          </div>
        </section>

        {/* ===== 회원 탈퇴 (M06) ===== */}
        <section className={common.card}>
          <div className={common.cardHead}>
            <span className={common.cardTitle}>회원 탈퇴</span>
          </div>
          <p className={common.desc}>탈퇴하면 다시 로그인할 수 없어요. 비밀번호를 입력해 본인 확인을 해 주세요.</p>
          <div className={styles.row}>
            <input className={styles.input} type="password" value={withdrawPw} placeholder="비밀번호"
              onChange={(e) => setWithdrawPw(e.target.value)} />
            <Button type="danger" onClick={openConfirm}>회원 탈퇴</Button>
          </div>
          {withdrawError && <div className={styles.error}>{withdrawError}</div>}
        </section>
      </main>

      {/* ===== 탈퇴 확인 창 (팀 공통 Modal) ===== */}
      <Modal open={confirmOpen} title="정말 탈퇴할까요?" onClose={() => setConfirmOpen(false)}>
        <p className={common.desc}>탈퇴하면 이 계정으로 다시 로그인할 수 없어요.</p>
        <div className={styles.actions}>
          <Button onClick={() => setConfirmOpen(false)}>취소</Button>
          <Button type="danger" onClick={withdraw}>탈퇴하기</Button>
        </div>
      </Modal>
    </div>
  );
}

export default EditPage;
