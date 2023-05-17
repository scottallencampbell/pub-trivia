import { OpenAiContext } from "contexts/OpenAiContext";
import { useEffect, useState } from "react";
import Answer from "./Answer";

interface IQuestion {
  question: any,
  onAnswered: Function
}

const Question = ({ question, onAnswered }: IQuestion) => {
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(-1);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(-1);
  const [answerStyle, setAnswerStyle] = useState("");
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
 
  useEffect(() => {  
    if (question != undefined && question.Text != undefined && question.Answers != undefined)  {
      setCorrectAnswerIndex(question.Answers.findIndex((answer : any) => answer.IsCorrect)); 
      setSelectedAnswerIndex(-1);
      setIsAnswered(false);
      setIsAnswerRevealed(false);
      
      const longestAnswer = Math.max(...(question.Answers.map((x: any) => x.Text.length)));
      const rounded = Math.floor(longestAnswer / 10) * 10;
      setAnswerStyle(`answer-length-${rounded}`);
    }
  }, [question]);
  
  const handleAnswerSelected = (i: number) => {    
    if (isAnswered)
      return;

    setIsAnswered(true);
    setSelectedAnswerIndex(i);

    if (correctAnswerIndex == i)
      setTimeout(() => onAnswered(i == correctAnswerIndex), 2000);
    else {
      setTimeout(() => setIsAnswerRevealed(true), 2000);
      setTimeout(() => onAnswered(i == correctAnswerIndex), 6000);
    }
  }

  return ( 
    <>
    { question == undefined ?  <></> :
      <>
        <div className="question-text">{question.Text}</div>
        {
        question.Answers.map((answer: any, i: number) => (
          <Answer key={i} answer={answer} answerStyle={answerStyle} index={i} isSelected={selectedAnswerIndex == i || (isAnswerRevealed && i == correctAnswerIndex)} onSelected={() => handleAnswerSelected(i) }></Answer>
        ))}  
      </> 
    } 
    </>      
  )
}

export default Question