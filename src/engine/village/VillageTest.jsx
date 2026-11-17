// C08 마을 이동 테스트 화면 (주소: /village-test)
import { useState } from 'react';
import Village from './Village';
import { COUNTRIES } from './villageData';
import Panel from '../../common/ui/Panel';

function VillageTest() {
  const [code, setCode] = useState('IND');
  const [gender, setGender] = useState('M');
  const [msg, setMsg] = useState('');
  const [sent, setSent] = useState('');

  const others = [
    { id: 1, name: '라훌', age: 30, x: 24, y: 68, message: '안녕하세요!' },
    { id: 2, name: '프리야', age: 27, x: 76, y: 70, message: '저도 1950년대생이에요' },
    { id: 3, name: '아밋', age: 41, x: 36, y: 92 },
  ];

  return (
    <div className="page col">
      <h2>C08 마을 이동 테스트</h2>
      <div className="row">
        나라
        <select className="input" value={code} onChange={(e) => setCode(e.target.value)}>
          {Object.keys(COUNTRIES).map((c) => (
            <option key={c} value={c}>{c} ({COUNTRIES[c][1]})</option>
          ))}
        </select>
        성별
        <select className="input" value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="M">남</option>
          <option value="F">여</option>
        </select>
      </div>

      <div style={{ maxWidth: 560 }}>
        <Panel title={code + ' 마을과 채팅'}>
          <Village countryCode={code} age={34} gender={gender}
            caption={code + '에서의 청년기 (34세, 공장 조장)'}
            myMessage={sent} others={others} />
          <div className="row" style={{ marginTop: 8 }}>
            <input className="input" style={{ flex: 1 }} placeholder="채팅 입력 후 Enter" value={msg}
              onChange={(e) => setMsg(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { setSent(msg); setMsg(''); } }} />
          </div>
        </Panel>
      </div>
    </div>
  );
}

export default VillageTest;
