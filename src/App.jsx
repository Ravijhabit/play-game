import {useState, useEffect} from 'react';
import './App.css';
import axios from 'axios';
function App() {
  const [attempt, setAttempt]= useState(10);
  const [evenDiv, setEvenDiv] = useState([]);
  const [oddDiv, setOddDiv] = useState([]);
  const [visible, setVisible] = useState(false);
  const [play,setPlay] = useState(false);
  const [show,setShow] = useState(false);
  const [winner, setWinner] = useState('');
  useEffect(()=>{
    document.addEventListener('keydown',handler);
    return ()=>{
      document.removeEventListener('keydown',handler);
    };
  });

  const handler = async (event) =>{
    event.preventDefault();
    if(event.key===' ' && play){
      const response = await axios.post('https://recipe-api-esip.onrender.com/randomnumbergenerator?minValue=100&maxValue=1000');
      const data = response.data[0];
      if(data%2===0){
        setEvenDiv([...evenDiv,data]);
      }else{
        setOddDiv([...oddDiv,data]);
      }
      setAttempt(prev=>prev-1);
    }
    if(event.key==='r' || event.key==='p'){
      setVisible(true);
      setPlay(true);
      setEvenDiv([]);
      setOddDiv([]);
      setShow(false);
      setAttempt(10);
    }
    else if(event.key==='s'){
      setVisible(false);
      setPlay(false);
    }
    if(attempt===1){
      setPlay(false);
      setVisible(false);
      const oddData=oddDiv.reduce(((acc,el)=>acc+el),0);
      const evenData=evenDiv.reduce(((acc,el)=>acc+el),0);
      setShow(true);
      if(evenData>oddData){
        setWinner('even');
      }else{
        setWinner('odd');
      }
    }
  }
  return (
    <div className="App">
      <h1>Play Room</h1>
      <div className={visible ?'visible':'invisible'}>
        <p>The game has {attempt} attempts left</p>
        <p>Hit space to play the next turn</p>
      </div>
      <section role="playground" className="playground">
        <section className="left container">
          <div className="scoreBoard">
            <p>Player Even</p>
            <p>Total Score {evenDiv.reduce(((acc,el)=>acc+el),0)}</p>
          </div>
          <div className="scores">
            {evenDiv.map((evenData,index)=>(
              <div className="data" key={index}>{evenData}</div>
            ))}
          </div>
          {show ? winner==='even' && <h1>You Win</h1>:''}
        </section>
        <section className="right container">
          <div className="scoreBoard">
              <p>Player Odd</p>
              <p>Total Score {oddDiv.reduce(((acc,el)=>acc+el),0)}</p>
          </div>
          <div className="scores">
          {oddDiv.map((oddData,index)=>(
              <div className="data" key={index}>{oddData}</div>
            ))}
          </div>
          {show ? winner==='odd' && <h1>You Win</h1>:''}
        </section>
      </section>
      <p className={visible?'invisible':'visible'}>Hit R to start a new game</p>
      <p className={(visible && play)?'visible':'invisible'}> Hit S to stop the game</p>
    </div>
  )
}

export default App
