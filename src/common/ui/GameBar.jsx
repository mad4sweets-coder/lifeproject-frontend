// 게임 진행 바 (인생 진행 화면 위): 나이, 연도, 자동 저장, 속도 조절
// 예: <GameBar age={34} year={1981} savedYear={1981} paused={paused} speed={speed}
//        onPause={...} onSpeed={setSpeed} onShop={...} onHome={...} />
import Button from './Button';
import './ui.css';

function GameBar({ age, year, savedYear, paused, speed, onPause, onSpeed, onShop, onHome }) {
  return (
    <div className="gamebar">
      <div className="gamebar-in">
        <span className="gamebar-age">{age}<small>세</small></span>
        <span className="gamebar-year">{year}년</span>
        <div className="header-space" />
        {savedYear && <span className="gamebar-saved">{savedYear}년까지 자동 저장됨</span>}
        {onShop && <Button size="sm" type="ghost" onClick={onShop}>코스튬 상점</Button>}
        <Button size="sm" type={paused ? 'primary' : undefined} onClick={onPause}>
          {paused ? '계속하기' : '일시정지'}
        </Button>
        <div className="gamebar-speed" role="group" aria-label="진행 속도">
          {[1, 2, 4].map((s) => (
            <button key={s} type="button" className={speed === s ? 'on' : ''} onClick={() => onSpeed(s)}>
              {s}×
            </button>
          ))}
        </div>
        {onHome && <Button size="sm" type="ghost" onClick={onHome}>처음으로</Button>}
      </div>
    </div>
  );
}

export default GameBar;
