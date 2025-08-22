import { useEffect, useState } from "react"

interface IAnswer {
  answer: any
  answerStyle: string
  index: number
  isSelected: boolean
  onSelected: Function
}

const Answer = ({ answer, answerStyle, index, isSelected, onSelected }: IAnswer) => {
  const handleClick = () => {
    onSelected(index)
  }

  return (
    <div
      className={`flex justify-center px-2 py-2 mx-4 my-4 border-[3px] border-solid border-[white] rounded-xl w-[250px] md:w-[250px] sm:min-w-[320px]  min-h-[180px]
       transition-all duration-[400] cursor-pointer 
       duration-300
       hover:border-solid hover:!border-[#5594f1]
       ${isSelected ? "selected" : ""} ${answer.IsCorrect ? "correct" : ""}`}
      onClick={() => handleClick()}
    >
      <div
        className={`text-[16px] md:text-[24px] font-bold flex justify-center items-center gap-1 w-full ${answerStyle}`}
      >
        {String.fromCharCode(65 + index)}.&nbsp;&nbsp;
        {answer.Text}
      </div>
    </div>
  )
}

export default Answer
