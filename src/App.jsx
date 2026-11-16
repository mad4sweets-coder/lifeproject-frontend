import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import MainPage from './pages/main/MainPage';
import LoginPage from './pages/login/LoginPage';
import JoinPage from './pages/join/JoinPage';
import BirthPage from './pages/birth/BirthPage';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/join" element={<JoinPage />} />
        <Route path="/birth" element={<BirthPage />} />
      </Routes>
    </>
  );
}

export default App;
