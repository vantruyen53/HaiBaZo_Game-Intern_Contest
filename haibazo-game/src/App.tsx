import { useEffect, useRef, useState } from 'react';
import './App.css'
import Circle from './circle';

function App() {
  
  //UI state
  const [input, setInput] = useState<number>(5)
  const [positions, setPosition] = useState<{order: number, x:number, y: number}[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [autoPlay, setAutoPlay] = useState(false)
  const [stopCircleTimer, setStopCircleTimer] = useState(false)

  //Data state
  const [totalTime, setTotalTime] = useState(0)
  const [playingStatus, setPlayingStatus] = useState<'play'| 'game-over'|'all-cleared'>('play')
  const [totalSelected, setTotalSelected] = useState(0)
  const [nextOrder, setNextOrder] = useState(1);
  const [gameKey, setGameKey] = useState(0)

  const timerRef = useRef<number|undefined>(undefined)

  const stopTimer = () => {
    clearInterval(timerRef.current);
  };

  useEffect(()=>{
    if(totalSelected === input)
      setTimeout(()=>{
        stopTimer();
        setPlayingStatus('all-cleared')
      }, 3000)
  }, [totalSelected, input])

  const mainWidth = 500, mainHeight = 500;
  const diameter = 40;


  const ranDomPosition = ()=>{
    const x = Math.random() * (mainWidth - diameter)
    const y = Math.random() * (mainHeight - diameter)
    return {x, y};
  }

  const renderCircles = ()=>{
    for(let i = 1; i <= input; i++){
      const posistion = ranDomPosition()
      setPosition(pre => [...pre, {order: i, ...posistion}]);
    }
  }

  const handlPlaying = ()=>{

    if(!isPlaying){
      setIsPlaying(true)
      console.log('Start game')

      renderCircles();

      timerRef.current = setInterval(()=>{
        setTotalTime(pre =>pre+=100)
      }, 100)
    }
    else if(isPlaying && playingStatus === 'play'){

      console.log('Restart during playing')

      stopTimer()

      setPosition([]);
      setTotalSelected(0);
      setPlayingStatus('play')
      setTotalTime(0);
      setNextOrder(1);
      setAutoPlay(false)
      setStopCircleTimer(false)
      setGameKey(pre => pre + 1)

      renderCircles();

      timerRef.current = setInterval(()=>{
        setTotalTime(pre =>pre+=100)
      }, 100)

    }
    else {
      setIsPlaying(false)
      console.log('Restart after done all cleared')

      stopTimer()
      setPosition([])
      setTotalTime(0)
      setTotalSelected(0);
      setPlayingStatus('play')
      setTotalTime(0);
      setNextOrder(1);
      setAutoPlay(false)
      setStopCircleTimer(false)
      setGameKey(pre => pre + 1)
    }

  }

  const handlAutoPlay = ()=>{
    setAutoPlay(pre=>!pre)
  }

  return (
    <>
      <header className="header">
        <h3 style={{color:playingStatus==='play'?'darkgray':playingStatus==='all-cleared'?'darkgreen':'darkred'}}>
          {playingStatus==='play'?'Let\'t play':playingStatus==='all-cleared'?'All Cleared' : 'Game Over'}
        </h3>
        <div className='wapper-input'>
          <div className="lable">Points:</div>
          <input value={input} type="number" onChange={(e)=>setInput(e.target.value as unknown as number)}/>
        </div>
        <div className='wapper-input'>
          <div className="lable">Time:</div>
          <span className='time'>{(totalTime/1000).toFixed(1)}s</span>
        </div>
        <div style={{display:'flex', gap:'10px'}}>
          <button onClick={handlPlaying}>{isPlaying ? 'Restart' : 'Play'}</button>
          {(isPlaying && playingStatus==='play') && <button onClick={handlAutoPlay}>Auto Play {autoPlay ? 'OFF' : 'ON'}</button>}
        </div>
      </header>

      <main className="main"
        style={{width:mainWidth, height:mainHeight}}
      >
        {
          positions.map(item => {
            return <Circle
              key={`${gameKey}-${item.order}`}
              diameter={diameter}
              order={item.order}
              totalPoints={input}
              topPosition={item.y}
              leftPosition={item.x}
              isStopTimer={stopCircleTimer}
              autoPlay={autoPlay && item.order===nextOrder}
              onSelect={(order:number)=>{
                if(order===nextOrder){
                  setNextOrder(pre=>pre+=1);
                }
                else{
                  setPlayingStatus('game-over');
                  stopTimer()
                  setStopCircleTimer(true)
                }
              }}
              onCircleGone={(order:number)=>setTotalSelected(pre=>pre+=order)}
            />
          }
        )
        }
      </main>

    </>
  )
}

export default App
