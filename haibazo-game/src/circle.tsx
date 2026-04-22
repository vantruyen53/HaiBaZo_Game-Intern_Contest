import { useState, useRef, useEffect } from 'react';
import './circle.css' ;

interface Cicle{
  diameter:number,
  order: number,
  totalPoints:number,
  topPosition: number,
  leftPosition: number,
  isStopTimer:boolean,
  autoPlay:boolean,
  onSelect: (order:number)=>void,
  onCircleGone: (order:number)=>void,
}

export default function Circle({diameter, order, totalPoints , topPosition, leftPosition, isStopTimer, autoPlay, onSelect, onCircleGone}:Cicle) {

  const [remainingTime, setRemainingTime] = useState<number>(3000)
  const [selected, setSelected] = useState(false)

  const timerRef = useRef<number|undefined>(undefined)

  function stopTimer(){
    clearInterval(timerRef.current)
  }

  useEffect(()=>{
    if(remainingTime-100===0)
      stopTimer()

    if(isStopTimer)
      stopTimer()  
  }, [remainingTime])

  useEffect(()=>{
    if(autoPlay){
      const timeout = setTimeout(()=>{
        handlSelect()
      }, 1000)
      return () => clearTimeout(timeout)
    }
  }, [autoPlay])

  function handlSelect(){
    if(selected || isStopTimer) return;
    setSelected(true);

    onSelect(order)
    onCircleGone(1)

    timerRef.current = setInterval(()=>{
      setRemainingTime(pre=>pre-100)
    }, 100)
  }


  return (
    <button 
      className={`cicle ${remainingTime <= 1000 ? 'fade-out' : ''} ${selected ? 'selected' : ''}`}
      style={{width:diameter, height:diameter, top:topPosition, left:leftPosition, zIndex:selected ? order + totalPoints : order}}
      onClick={handlSelect}
    >
        <div className="circle-order">{order}</div>  
        {(remainingTime > 0 && selected) && <div className={`remaining-time ${selected && 'remaintim-time-on_selected'}`}>{(remainingTime/1000).toFixed(1)}s</div>}
    </button>
  )
}