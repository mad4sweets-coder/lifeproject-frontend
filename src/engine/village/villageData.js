// C08 마을 이동 - 데이터 (밤하늘 스타일)
// 아시아 48개국(UN 기준) → [국기용 2자리 코드, 권역]
export const COUNTRIES = {
  // 동아시아 (EAST)
  CHN: ['cn', 'EAST'], JPN: ['jp', 'EAST'], KOR: ['kr', 'EAST'], PRK: ['kp', 'EAST'], MNG: ['mn', 'EAST'],
  // 동남아시아 (SOUTHEAST)
  BRN: ['bn', 'SOUTHEAST'], KHM: ['kh', 'SOUTHEAST'], IDN: ['id', 'SOUTHEAST'], LAO: ['la', 'SOUTHEAST'],
  MYS: ['my', 'SOUTHEAST'], MMR: ['mm', 'SOUTHEAST'], PHL: ['ph', 'SOUTHEAST'], SGP: ['sg', 'SOUTHEAST'],
  THA: ['th', 'SOUTHEAST'], TLS: ['tl', 'SOUTHEAST'], VNM: ['vn', 'SOUTHEAST'],
  // 남아시아 (SOUTH)
  AFG: ['af', 'SOUTH'], BGD: ['bd', 'SOUTH'], BTN: ['bt', 'SOUTH'], IND: ['in', 'SOUTH'], IRN: ['ir', 'SOUTH'],
  MDV: ['mv', 'SOUTH'], NPL: ['np', 'SOUTH'], PAK: ['pk', 'SOUTH'], LKA: ['lk', 'SOUTH'],
  // 중앙아시아 (CENTRAL)
  KAZ: ['kz', 'CENTRAL'], KGZ: ['kg', 'CENTRAL'], TJK: ['tj', 'CENTRAL'], TKM: ['tm', 'CENTRAL'], UZB: ['uz', 'CENTRAL'],
  // 서아시아 (WEST)
  ARM: ['am', 'WEST'], AZE: ['az', 'WEST'], BHR: ['bh', 'WEST'], CYP: ['cy', 'WEST'], GEO: ['ge', 'WEST'],
  IRQ: ['iq', 'WEST'], ISR: ['il', 'WEST'], JOR: ['jo', 'WEST'], KWT: ['kw', 'WEST'], LBN: ['lb', 'WEST'],
  OMN: ['om', 'WEST'], QAT: ['qa', 'WEST'], SAU: ['sa', 'WEST'], PSE: ['ps', 'WEST'], SYR: ['sy', 'WEST'],
  TUR: ['tr', 'WEST'], ARE: ['ae', 'WEST'], YEM: ['ye', 'WEST'],
};

// 권역별 밤 마을 모양: 하늘(그라데이션)·땅·길 색, 건물 4채(이름·벽·지붕), 건물 사이 장식(deco)
// deco: blossom 벚나무 / palm 야자수 / tree 둥근 나무 / mountain 먼 산  (Village.jsx의 Deco 그림)
export const THEMES = {
  EAST: {
    sky: 'linear-gradient(180deg, #0b1230 0%, #1b2a62 100%)', ground: '#141f38', road: '#222c4b',
    roof: '#2c3358', wall: '#3a405f', deco: 'blossom',
    buildings: ['학교', '시장', '우리 집', '공장'],
  },
  SOUTHEAST: {
    sky: 'linear-gradient(180deg, #091530 0%, #183a5a 100%)', ground: '#11292b', road: '#252f44',
    roof: '#4b3326', wall: '#574632', deco: 'palm',
    buildings: ['학교', '수상 시장', '우리 집', '논'],
  },
  SOUTH: {
    sky: 'linear-gradient(180deg, #110f30 0%, #3a2552 100%)', ground: '#241f33', road: '#352c45',
    roof: '#6a3428', wall: '#584852', deco: 'tree',
    buildings: ['학교', '바자르', '우리 집', '공장'],
  },
  CENTRAL: {
    sky: 'linear-gradient(180deg, #0a1030 0%, #23306a 100%)', ground: '#1b2638', road: '#2b3350',
    roof: '#6a2a2e', wall: '#4a4d68', deco: 'mountain',
    buildings: ['학교', '시장', '유르트', '목장'],
  },
  WEST: {
    sky: 'linear-gradient(180deg, #0e0f2e 0%, #3b2a55 100%)', ground: '#2a2436', road: '#3a3147',
    roof: '#5a4e68', wall: '#4b4258', deco: 'palm',
    buildings: ['학교', '수크', '우리 집', '모스크'],
  },
};

// 걸어 다닐 수 있는 범위 (마을 크기 대비 %): 건물 앞 땅만
export const AREA = { minX: 7, maxX: 93, minY: 62, maxY: 94 };
export const STEP = 2; // 방향키 한 번에 움직이는 거리 (%)

// 하늘에 뿌릴 별 위치 (x %, y %, 크기 px) - 매번 같은 자리
export const SKY_STARS = [
  [6, 8, 1], [14, 22, 1.5], [22, 6, 1], [31, 16, 1], [39, 4, 2], [47, 20, 1], [55, 9, 1],
  [63, 25, 1.5], [70, 5, 1], [78, 17, 1], [86, 8, 1.5], [93, 24, 1], [10, 33, 1], [58, 34, 1],
  [35, 30, 1], [82, 32, 1],
];
