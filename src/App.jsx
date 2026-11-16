import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import MainPage from './pages/main/MainPage';
import LoginPage from './pages/login/LoginPage';
import JoinPage from './pages/join/JoinPage';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/join" element={<JoinPage />} />
      </Routes>
    </>
  );
}

export default App;
