import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import client from '../../api/api';
import common from '../login/LoginPage.module.css'; // 로그인 화면과 같은 카드 모양
import styles from './FindPage.module.css';           // 탭·결과 칸만 따로

// 아이디·비밀번호 찾기 (M09)  주소: /find
// 탭 2개: 아이디 찾기 / 비밀번호 찾기
//   ① 인증번호 받기  POST /api/members/find/sendCode  { purpose, email, loginId }
//   ② 아이디 확인    POST /api/members/find/id        { email, code }
//   ③ 비번 재설정    POST /api/members/find/resetPw   { loginId, email, code, newPassword, newPasswordCheck }
function FindPage() {
  const navigate = useNavigate();

  const [tab, setTab] = useState('FIND_ID'); // 'FIND_ID' 또는 'RESET_PW'

  // 입력칸
  const [loginId, setLoginId] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordCheck, setNewPasswordCheck] = useState('');

  // 화면 상태
  const [sent, setSent] = useState(false);      // 인증번호를 보냈는지 (보냈으면 번호 입력칸 보이기)
  const [info, setInfo] = useState('');         // 안내 문구 (초록)
  const [error, setError] = useState('');       // 오류 문구 (빨강)
  const [foundId, setFoundId] = useState('');   // 찾은 아이디 (msj***)

  // 탭 바꾸면 입력칸·문구 모두 비우기
  const changeTab = (t) => {
    setTab(t);
    setLoginId(''); setEmail(''); setCode('');
    setNewPassword(''); setNewPasswordCheck('');
    setSent(false); setInfo(''); setError(''); setFoundId('');
  };

  // ① 인증번호 받기
  const sendCode = async () => {
    setInfo(''); setError('');
    if (tab === 'RESET_PW' && !loginId) return setError('아이디를 입력해 주세요.');
    if (!email) return setError('이메일을 입력해 주세요.');

    try {
      const res = await client.post('/api/members/find/sendCode', {
        purpose: tab,
        email,
        loginId: tab === 'RESET_PW' ? loginId : null,
      });
      setSent(true);
      setInfo(res.data.message); // "입력한 정보가 맞다면 메일이 발송됩니다."
    } catch (err) {
      setError(err.response?.data?.message || '인증번호를 보내지 못했습니다.');
    }
  };

  // ② 아이디 찾기 → 확인
  const findId = async () => {
    setInfo(''); setError('');
    if (!code) return setError('인증번호를 입력해 주세요.');

    try {
      const res = await client.post('/api/members/find/id', { email, code });
      setFoundId(res.data.loginId); // 예: msj***
    } catch (err) {
      setError(err.response?.data?.message || '인증번호가 올바르지 않거나 만료되었습니다.');
    }
  };

  // ③ 비밀번호 찾기 → 새 비밀번호 저장
  const resetPw = async () => {
    setInfo(''); setError('');
    if (!code) return setError('인증번호를 입력해 주세요.');
    if (!newPassword) return setError('새 비밀번호를 입력해 주세요.');
    if (newPassword !== newPasswordCheck) return setError('새 비밀번호 확인이 일치하지 않습니다.');

    try {
      await client.post('/api/members/find/resetPw', {
        loginId, email, code, newPassword, newPasswordCheck,
      });
      alert('비밀번호를 변경했습니다. 새 비밀번호로 로그인해 주세요.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || '비밀번호를 바꾸지 못했습니다.');
    }
  };

  return (
    <div className={common.container}>
      <div className={common.card}>
        <div className={common.cardTitle}>아이디 · 비밀번호 찾기</div>

        <div className={common.cardBody}>
          {/* 탭 */}
          <div className={styles.tabs}>
            <button type="button" className={tab === 'FIND_ID' ? styles.tabOn : styles.tab}
              onClick={() => changeTab('FIND_ID')}>아이디 찾기</button>
            <button type="button" className={tab === 'RESET_PW' ? styles.tabOn : styles.tab}
              onClick={() => changeTab('RESET_PW')}>비밀번호 찾기</button>
          </div>

          {/* 아이디 찾기 결과가 나오면 결과만 보여 줌 */}
          {foundId ? (
            <>
              <div className={styles.result}>
                가입한 아이디는 <b>{foundId}</b> 입니다.
              </div>
              <button type="button" className={common.btnDark} onClick={() => navigate('/login')}>
                로그인하러 가기
              </button>
              <button type="button" className={common.btn} onClick={() => changeTab('RESET_PW')}>
                비밀번호도 찾기
              </button>
            </>
          ) : (
            <>
              {/* 비밀번호 찾기만 아이디 입력 */}
              {tab === 'RESET_PW' && (
                <>
                  <label className={common.label}>아이디</label>
                  <input className={common.input} value={loginId} disabled={sent}
                    onChange={(e) => setLoginId(e.target.value)} />
                </>
              )}

              <label className={common.label}>가입한 이메일</label>
              <div className={styles.row}>
                <input className={common.input} value={email} disabled={sent}
                  onChange={(e) => setEmail(e.target.value)} />
                <button type="button" className={styles.sendBtn} onClick={sendCode}>
                  {sent ? '다시 받기' : '인증번호 받기'}
                </button>
              </div>

              {/* 인증번호를 보낸 뒤에만 보이는 칸 */}
              {sent && (
                <>
                  <label className={common.label}>인증번호 6자리 (5분 안에 입력)</label>
                  <input className={common.input} value={code} maxLength={6}
                    onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))} />

                  {tab === 'RESET_PW' && (
                    <>
                      <label className={common.label}>새 비밀번호</label>
                      <input className={common.input} type="password" value={newPassword}
                        placeholder="영문·숫자·특수문자 포함 8~20자"
                        onChange={(e) => setNewPassword(e.target.value)} />

                      <label className={common.label}>새 비밀번호 확인</label>
                      <input className={common.input} type="password" value={newPasswordCheck}
                        onChange={(e) => setNewPasswordCheck(e.target.value)} />
                    </>
                  )}
                </>
              )}

              {info && <div className={styles.infoBox}>{info}</div>}
              {error && <div className={common.errorBox}>{error}</div>}

              {sent && (
                <button type="button" className={common.btnDark}
                  onClick={tab === 'FIND_ID' ? findId : resetPw}>
                  {tab === 'FIND_ID' ? '아이디 확인' : '비밀번호 변경'}
                </button>
              )}
            </>
          )}

          <div className={common.links}>
            <Link to="/login">로그인</Link>
            <span>|</span>
            <Link to="/join">회원가입</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FindPage;
