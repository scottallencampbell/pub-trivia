import { OpenAiContext } from "contexts/OpenAiContext"
import { useEffect, useState } from "react"
import Answer from "./Answer"

interface IQuestion {
  question: any
  onAnswered: Function
}

const Question = ({ question, onAnswered }: IQuestion) => {
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(-1)
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(-1)
  const [answerStyle, setAnswerStyle] = useState("")
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false)
  const [isAnswered, setIsAnswered] = useState(false)

  useEffect(() => {
    if (question != undefined && question.Text != undefined && question.Answers != undefined) {
      setCorrectAnswerIndex(question.Answers.findIndex((answer: any) => answer.IsCorrect))
      setSelectedAnswerIndex(-1)
      setIsAnswered(false)
      setIsAnswerRevealed(false)

      const longestAnswer = Math.max(...question.Answers.map((x: any) => x.Text.length))
      const rounded = Math.floor(longestAnswer / 10) * 10
      setAnswerStyle(`answer-length-${rounded}`)
    }
  }, [question])

  const handleAnswerSelected = (i: number) => {
    if (isAnswered) return

    setIsAnswered(true)
    setSelectedAnswerIndex(i)

    if (correctAnswerIndex == i) setTimeout(() => onAnswered(i == correctAnswerIndex), 2000)
    else {
      setTimeout(() => setIsAnswerRevealed(true), 2000)
      setTimeout(() => onAnswered(i == correctAnswerIndex), 6000)
    }
  }

  return (
    <>
      {question == undefined ? (
        <></>
      ) : (
        <div className=" w-full mx-auto flex flex-col justify-center items-center">
          <div className="max-w-5xl text-2xl sm:text-3xl md:text-4xl font-semibold mb-12 px-2 mt-12">
            {question.Text}
          </div>
          <div className="flex flex-col md:flex-row justify-center items-center  mx-auto flex-wrap w-full md:max-w-3xl">
            {question.Answers.map((answer: any, i: number) => (
              <div className="sm:w-1/2 mx-auto " key={i}>
                <Answer
                  answer={answer}
                  answerStyle={answerStyle}
                  index={i}
                  isSelected={
                    selectedAnswerIndex == i || (isAnswerRevealed && i == correctAnswerIndex)
                  }
                  onSelected={() => handleAnswerSelected(i)}
                ></Answer>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default Question
