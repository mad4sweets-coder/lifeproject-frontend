// 실시간 목록 (방금 시작된 인생, 방금 끝난 인생)
// 예: <FeedList items={[{ id: 1, time: '방금', title: '방글라데시 다카', sub: '여자아이', side: '형편 2', fresh: true }]} />
// time: 왼쪽 금색 글자(없으면 생략), title: 굵은 줄, sub: 그 아래 설명, side: 오른쪽 작은 글자(줄바꿈은 \n)
// fresh: 새로 들어온 줄이면 true → 위에서 미끄러져 들어오고 잠깐 깜빡임 (id가 같으면 다시 안 깜빡임)
import './ui.css';

function FeedList({ items }) {
  return (
    <ul className="feed" aria-live="polite">
      {items.map((it) => (
        <li key={it.id} className={it.fresh ? 'fresh' : undefined}>
          {it.time && <span className="feed-time">{it.time}</span>}
          <span className="feed-main"><b>{it.title}</b>{it.sub}</span>
          {it.side && (
            <span className="feed-side">
              {String(it.side).split('\n').map((line, i) => <span key={i}>{i > 0 && <br />}{line}</span>)}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

export default FeedList;
