// 메인 화면 실시간 데이터 (목록은 서버·소켓 붙기 전까지 예시)
// - useAsiaCounter(): 아시아 실제 통계(유엔 세계인구전망 2024, 2026년 추정)로 오늘 태어난/떠난 사람 수를 실시간 계산
// - useLiveFeed():   방금 시작된 인생 / 방금 끝난 인생 목록에 몇 초마다 새 줄 추가 (예시 데이터)
import { useEffect, useRef, useState } from 'react';

// 유엔 세계인구전망 2024 (중위 추계) - 아시아 2026년
export const ASIA_BIRTHS_PER_YEAR = 64911065; // 연간 출생아 수
export const ASIA_DEATHS_PER_YEAR = 34879246; // 연간 사망자 수
const SEC_PER_YEAR = 365 * 24 * 60 * 60;
export const BIRTHS_PER_SEC = ASIA_BIRTHS_PER_YEAR / SEC_PER_YEAR; // 약 2.06명
export const DEATHS_PER_SEC = ASIA_DEATHS_PER_YEAR / SEC_PER_YEAR; // 약 1.11명

// 오늘 0시부터 지금까지 + 이 페이지를 연 뒤 늘어난 수 (0.15초마다 다시 계산)
export function useAsiaCounter() {
  const openedAt = useRef(Date.now());
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 150);
    return () => clearInterval(id);
  }, []);

  const midnight = new Date(now);
  midnight.setHours(0, 0, 0, 0);
  const secToday = (now - midnight.getTime()) / 1000;
  const secPage = (now - openedAt.current) / 1000;

  return {
    bornToday: Math.floor(secToday * BIRTHS_PER_SEC),
    diedToday: Math.floor(secToday * DEATHS_PER_SEC),
    bornSincePage: Math.floor(secPage * BIRTHS_PER_SEC),
    diedSincePage: Math.floor(secPage * DEATHS_PER_SEC),
  };
}

// ---------- 예시 목록 데이터 ----------
// [나라, 도시, 경도, 위도, 출생 비중(대략 연간 출생아 수, 백만 명)]
const CITIES = [
  ['인도', '뭄바이', 72.9, 19.1, 5.7], ['인도', '델리', 77.2, 28.6, 5.7], ['인도', '콜카타', 88.4, 22.6, 5.7], ['인도', '러크나우', 80.9, 26.8, 5.7],
  ['중국', '청두', 104.1, 30.7, 3], ['중국', '광저우', 113.3, 23.1, 3], ['중국', '정저우', 113.6, 34.7, 3],
  ['파키스탄', '카라치', 67, 24.9, 3.1], ['파키스탄', '라호르', 74.3, 31.5, 3.1],
  ['인도네시아', '자카르타', 106.8, -6.2, 2.2], ['인도네시아', '수라바야', 112.7, -7.3, 2.2],
  ['방글라데시', '다카', 90.4, 23.8, 3], ['필리핀', '마닐라', 121, 14.6, 1.7],
  ['베트남', '하노이', 105.8, 21, 0.7], ['베트남', '호찌민', 106.7, 10.8, 0.7],
  ['아프가니스탄', '카불', 69.2, 34.5, 1.4], ['이라크', '바그다드', 44.4, 33.3, 1.2],
  ['이란', '테헤란', 51.4, 35.7, 1], ['튀르키예', '이스탄불', 29, 41, 1],
  ['미얀마', '양곤', 96.2, 16.8, 0.9], ['우즈베키스탄', '타슈켄트', 69.2, 41.3, 0.9], ['예멘', '사나', 44.2, 15.4, 0.9],
  ['일본', '도쿄', 139.7, 35.7, 0.7], ['사우디아라비아', '리야드', 46.7, 24.7, 0.55],
  ['태국', '방콕', 100.5, 13.7, 0.5], ['네팔', '카트만두', 85.3, 27.7, 0.5],
  ['말레이시아', '쿠알라룸푸르', 101.7, 3.1, 0.45], ['대한민국', '서울', 127, 37.5, 0.24],
];
const NAMES = {
  인도: ['라훌 샤르마', '프리야 싱', '아밋 쿠마르', '아니타 데비'], 중국: ['왕 레이', '리 메이', '장 웨이', '천 징'],
  파키스탄: ['무함마드 알리', '아이샤 칸', '하산 라자'], 인도네시아: ['부디 산토소', '시티 누르', '아구스 위자야'],
  방글라데시: ['아이샤 라만', '카림 호세인', '파티마 베굼'], 필리핀: ['호세 산토스', '마리아 레예스'],
  베트남: ['응우옌 티 마이', '쩐 반 남'], 아프가니스탄: ['아마드 사피', '자흐라 누리'], 이라크: ['하이데르 자부리', '누르 사디'],
  이란: ['알리 레자이', '마리암 호세이니'], 튀르키예: ['메흐메트 일디즈', '아이셰 카야'], 미얀마: ['아웅 민', '띤 띤 예'],
  우즈베키스탄: ['루스탐 카리모프', '딜노자 유수포바'], 예멘: ['사이드 하미리', '아말 나세르'], 일본: ['사토 겐지', '다나카 유키'],
  사우디아라비아: ['압둘라 하르비', '사라 오타이비'], 태국: ['솜차이 분마', '쑤다 씨리'], 네팔: ['람 타파', '시타 구룽'],
  말레이시아: ['아흐마드 이스마일', '누르 아이니'], 대한민국: ['김영수', '이순자'],
};

const TOTAL = CITIES.reduce((sum, c) => sum + c[4], 0);
const rand = (a, b) => a + Math.random() * (b - a);
const pickOne = (arr) => arr[Math.floor(Math.random() * arr.length)];

function pickCity() {
  let r = Math.random() * TOTAL;
  for (const c of CITIES) {
    r -= c[4];
    if (r <= 0) return c;
  }
  return CITIES[0];
}

let seq = 0;
let lastName = '';
function makeBirth(at, fresh) {
  const [country, city, lon, lat] = pickCity();
  const level = pickOne([1, 1, 2, 2, 2, 3, 3, 3, 4, 5]);
  return {
    id: 'b' + seq++, at, fresh, lon, lat,
    title: country + ' ' + city,
    sub: Math.random() < 0.512 ? '남자아이' : '여자아이',
    side: '형편 ' + level,
  };
}
function makeDeath(at, fresh) {
  const [country, city, lon, lat] = pickCity();
  const age = Math.round(Math.min(98, Math.max(1, rand(48, 92) + rand(-10, 6))));
  const year = new Date(at).getFullYear();
  return {
    id: 'd' + seq++, at, fresh, lon, lat,
    title: (() => {
      const pool = (NAMES[country] || ['이름 없음']).filter((n) => n !== lastName);
      lastName = pickOne(pool.length ? pool : NAMES[country]);
      return lastName;
    })(),
    sub: country + ' ' + city,
    side: (year - age) + '–' + year + '\n' + age + '세',
  };
}

// 몇 초 전인지 글자로
export function agoText(at, now) {
  const s = Math.max(0, Math.floor((now - at) / 1000));
  if (s < 3) return '방금';
  if (s < 60) return s + '초 전';
  return Math.floor(s / 60) + '분 전';
}

// 방금 시작된/끝난 인생 목록 (목록 3줄, 지구본용 위치 10개)
export function useLiveFeed({ show = 3, keepOnGlobe = 10 } = {}) {
  const [born, setBorn] = useState(() => [9, 4, 1].map((s) => makeBirth(Date.now() - s * 1000, false)).reverse());
  const [died, setDied] = useState(() => [14, 7, 2].map((s) => makeDeath(Date.now() - s * 1000, false)).reverse());
  const [now, setNow] = useState(() => Date.now());

  // 1초마다 '몇 초 전' 글자 새로고침
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // 출생: 2~4초마다, 사망: 3.5~6초마다 새 줄 (실제 비율 약 2 : 1)
  useEffect(() => {
    let t1;
    let t2;
    const addBirth = () => {
      setBorn((list) => [makeBirth(Date.now(), true), ...list].slice(0, keepOnGlobe));
      t1 = setTimeout(addBirth, rand(2000, 4000));
    };
    const addDeath = () => {
      setDied((list) => [makeDeath(Date.now(), true), ...list].slice(0, keepOnGlobe));
      t2 = setTimeout(addDeath, rand(3500, 6000));
    };
    t1 = setTimeout(addBirth, rand(1500, 2500));
    t2 = setTimeout(addDeath, rand(2500, 4000));
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [keepOnGlobe]);

  const withTime = (list) => list.slice(0, show).map((it) => ({ ...it, time: agoText(it.at, now) }));

  return {
    born: withTime(born),
    died: withTime(died).map(({ time, ...rest }) => rest), // 사망 목록은 시간 대신 생몰년
    globeBirths: born,
    globeDeaths: died,
  };
}
