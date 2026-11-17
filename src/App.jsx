import { Routes, Route } from 'react-router-dom';
import VillageTest from './engine/village/VillageTest';
import DesignGuide from './common/DesignGuide';
import Main from './main/Main';

function App() {
  

  return (
    <Routes>
      {/* 디자인 가이드 (공통) */}
      <Route path="/design-guide" element={<DesignGuide />} />
      {/* H01 메인 */}
      <Route path="/" element={<Main />} />
      {/* C08 마을 이동 테스트 (엔진) */}
      <Route path="/village-test" element={<VillageTest />} />
    </Routes>
  )
}

export default App
