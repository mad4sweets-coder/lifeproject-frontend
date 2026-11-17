// 지금 인생 상태 뱃지 (학력·직업·결혼·자녀·부모·나라) - 엔진 LifeDTO 를 통째로 넣으면 돼요
// 예: <LifeStatus life={life} />
import Badge from './Badge';
import './ui.css';

const EDU = { NONE: '학력 없음', ELEM: '초졸', MIDDLE: '중졸', HIGH: '고졸', UNI: '대졸', GRAD: '대학원졸' };
const SCHOOL_NOW = { ELEM: '초등학생', MIDDLE: '중학생', HIGH: '고등학생', UNI: '대학생', GRAD: '대학원생' };

function LifeStatus({ life }) {
  if (!life) return null;
  const items = [];

  // 학교·학력
  if (life.schoolStatus === 'ENROLLED' && SCHOOL_NOW[life.eduLevel]) {
    items.push({ text: SCHOOL_NOW[life.eduLevel], color: 'blue' });
  } else if (life.eduLevel && !(life.eduLevel === 'NONE' && life.currentAge < 7)) {
    // 아직 학교 갈 나이가 안 된 아기는 학력 표시 안 함
    items.push({ text: (EDU[life.eduLevel] || life.eduLevel) + (life.schoolStatus === 'DROPPED' ? ' (중퇴)' : '') });
  }

  // 직업
  if (life.jobStatus === 'EMPLOYED') items.push({ text: life.jobName || '직장인', color: 'gold' });
  else if (life.jobStatus === 'UNEMPLOYED') items.push({ text: '구직 중', color: 'red' });
  else if (life.jobStatus === 'RETIRED') items.push({ text: '은퇴' });

  // 가족
  if (life.marriedYn === 'Y') items.push({ text: '기혼', color: 'green' });
  if (life.childCount > 0) items.push({ text: '자녀 ' + life.childCount + '명', color: 'green' });
  if (life.parentAlive === 'N') items.push({ text: '부모님 별세' });

  // 이민 (태어난 나라와 사는 나라가 다를 때)
  if (life.birthCountry && life.currentCountry && life.birthCountry !== life.currentCountry) {
    items.push({ text: '이민 (' + life.currentCountry + ')', color: 'blue' });
  }

  return (
    <div className="life-status">
      {items.map((it) => <Badge key={it.text} color={it.color}>{it.text}</Badge>)}
    </div>
  );
}

export default LifeStatus;
