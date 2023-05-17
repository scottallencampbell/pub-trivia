import { useEffect, useState } from "react";

interface IAnswer {
  answer: any,
  answerStyle: string,
  index: number,
  isSelected: boolean,
  onSelected: Function
}

const Answer = ({ answer, answerStyle, index, isSelected, onSelected }: IAnswer) => {
  const handleClick = () => {    
    onSelected(index);   
  }

  return ( 
      <div className={`answer ${isSelected ? "selected" : ""} ${answer.IsCorrect ? "correct" : ""}`} onClick={() => handleClick()}>
        <div className={`answer-text ${answerStyle}`}>
          <div className="answer-letter">{String.fromCharCode(65 + index)}. </div><div>{answer.Text}</div>
        </div>     
      </div>
  )
}

export default Answer