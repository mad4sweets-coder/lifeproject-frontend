import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../../api/api';
import styles from './JoinPage.module.css';

// 회원가입 화면 (M01)
function JoinPage() {
  const navigate = useNavigate();

  // 입력값 5개를 한 상자에
  const [form, setForm] = useState({
    loginId: '',
    password: '',
    passwordCheck: '',
    nickname: '',
    email: '',
  });

  // 중복 확인 통과 여부 (true 여야 가입 가능)
  const [checked, setChecked] = useState({ loginId: false, nickname: false, email: false });

  // 각 칸 아래에 보여 줄 안내 문구
  const [msg, setMsg] = useState({ loginId: '', nickname: '', email: '' });

  // 맨 아래 왼쪽에 보여 줄 오류 문구
  const [error, setError] = useState('');

  // ① 글자를 칠 때마다 실행
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // 중복 확인한 칸을 다시 고치면 → 다시 확인해야 함
    if (name in checked) {
      setChecked({ ...checked, [name]: false });
      setMsg({ ...msg, [name]: '' });
    }
  };

  // ② 중복 확인 버튼 (field = 'loginId' | 'nickname' | 'email')
  const checkDuplicate = async (field) => {
    const value = form[field];
    if (!value) {
      setMsg({ ...msg, [field]: '먼저 입력해 주세요.' });
      return;
    }

    const urls = {
      loginId: `/api/members/checkId?loginId=${encodeURIComponent(value)}`,
      nickname: `/api/members/checkNickname?nickname=${encodeURIComponent(value)}`,
      email: `/api/members/checkEmail?email=${encodeURIComponent(value)}`,
    };

    try {
      const res = await client.get(urls[field]); // 서버에 물어보기
      if (res.data.available) {
        setChecked({ ...checked, [field]: true });
        setMsg({ ...msg, [field]: '사용할 수 있습니다.' });
      } else {
        setChecked({ ...checked, [field]: false });
        setMsg({ ...msg, [field]: '이미 사용 중입니다.' });
      }
    } catch {
      setMsg({ ...msg, [field]: '서버에 연결할 수 없습니다.' });
    }
  };

  // ③ 가입하기 버튼
  const handleSubmit = async (e) => {
    e.preventDefault(); // 새로고침 막기
    setError('');

    // 화면에서 먼저 검사 (서버에서도 한 번 더 검사함)
    if (!/^[a-zA-Z0-9]{4,20}$/.test(form.loginId)) {
      return setError('아이디는 영문·숫자 4~20자로 입력해 주세요.');
    }
    if (!/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,20}$/.test(form.password)) {
      return setError('비밀번호는 영문·숫자·특수문자를 포함해 8~20자로 입력해 주세요.');
    }
    if (form.password !== form.passwordCheck) {
      return setError('비밀번호 확인이 일치하지 않습니다.');
    }
    if (form.nickname.length < 2 || form.nickname.length > 10) {
      return setError('닉네임은 2~10자로 입력해 주세요.');
    }
    if (!checked.loginId || !checked.nickname || !checked.email) {
      return setError('아이디·닉네임·이메일 중복 확인을 해 주세요.');
    }

    try {
      await client.post('/api/members', form); // 서버로 보내기
      alert('회원가입이 완료되었습니다.');
      navigate('/login'); // 로그인 화면으로 이동
    } catch (err) {
      setError(err.response?.data?.message || '서버에 연결할 수 없습니다.');
    }
  };

  // 비밀번호 확인 칸 아래 문구
  const pwMatch = form.password === form.passwordCheck;
  const pwMatchMsg =
    form.passwordCheck === '' ? '' : pwMatch ? '비밀번호가 일치합니다.' : '비밀번호가 일치하지 않습니다.';

  // 문구 색: 통과면 초록(hintOk), 아니면 빨강(hint)
  const hintClass = (ok) => (ok ? styles.hintOk : styles.hint);

  return (
    <div className={styles.container}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <div className={styles.cardTitle}>회원가입</div>

        <div className={styles.cardBody}>
          {/* 아이디 */}
          <div className={styles.row}>
            <label className={styles.label}>아이디</label>
            <div className={styles.field}>
              <div className={styles.inputWithBtn}>
                <input className={styles.input} name="loginId" value={form.loginId}
                  onChange={handleChange} placeholder="영문·숫자 4~20자" />
                <button type="button" className={styles.btn} onClick={() => checkDuplicate('loginId')}>중복 확인</button>
              </div>
              <p className={hintClass(checked.loginId)}>{msg.loginId}</p>
            </div>
          </div>

          {/* 비밀번호 */}
          <div className={styles.row}>
            <label className={styles.label}>비밀번호</label>
            <div className={styles.field}>
              <input className={styles.input} type="password" name="password" value={form.password}
                onChange={handleChange} placeholder="영문·숫자·특수문자 포함 8~20자" />
            </div>
          </div>

          {/* 비밀번호 확인 */}
          <div className={styles.row}>
            <label className={styles.label}>비밀번호 확인</label>
            <div className={styles.field}>
              <input className={styles.input} type="password" name="passwordCheck" value={form.passwordCheck}
                onChange={handleChange} />
              <p className={hintClass(pwMatch)}>{pwMatchMsg}</p>
            </div>
          </div>

          {/* 닉네임 */}
          <div className={styles.row}>
            <label className={styles.label}>닉네임</label>
            <div className={styles.field}>
              <div className={styles.inputWithBtn}>
                <input className={styles.input} name="nickname" value={form.nickname}
                  onChange={handleChange} placeholder="2~10자" />
                <button type="button" className={styles.btn} onClick={() => checkDuplicate('nickname')}>중복 확인</button>
              </div>
              <p className={hintClass(checked.nickname)}>{msg.nickname}</p>
            </div>
          </div>

          {/* 이메일 */}
          <div className={styles.row}>
            <label className={styles.label}>이메일</label>
            <div className={styles.field}>
              <div className={styles.inputWithBtn}>
                <input className={styles.input} type="email" name="email" value={form.email}
                  onChange={handleChange} placeholder="아이디·비밀번호 찾기에 사용" />
                <button type="button" className={styles.btn} onClick={() => checkDuplicate('email')}>중복 확인</button>
              </div>
              <p className={hintClass(checked.email)}>{msg.email}</p>
            </div>
          </div>
        </div>

        <div className={styles.cardFooter}>
          <p className={styles.error}>{error}</p>
          <div className={styles.footerBtns}>
            <button type="button" className={styles.btn} onClick={() => navigate('/')}>취소</button>
            <button type="submit" className={styles.btnDark}>가입하기</button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default JoinPage;
