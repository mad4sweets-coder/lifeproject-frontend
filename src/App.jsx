import { Routes, Route } from 'react-router-dom';
import Header from './common/ui/Header';
import Main from './main/Main';
import LoginPage from './pages/login/LoginPage';
import JoinPage from './pages/join/JoinPage';
import BirthPage from './pages/birth/BirthPage';
import DesignGuide from './common/DesignGuide';
import VillageTest from './engine/village/VillageTest';

function App() {
  return (
    <>
      {/* 모든 화면 위 머리글 (공통) */}
      <Header />
      <Routes>
        {/* H01 메인 */}
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/join" element={<JoinPage />} />
        {/* C02 출생 추첨 */}
        <Route path="/birth" element={<BirthPage />} />
        {/* 디자인 가이드 (공통) */}
        <Route path="/design-guide" element={<DesignGuide />} />
        {/* C08 마을 이동 테스트 (엔진) */}
        <Route path="/village-test" element={<VillageTest />} />
      </Routes>
    </>
  );
}

export default App;
