import { useEffect, useState } from "react";

interface IAnswer {
  answer: any;
  answerStyle: string;
  index: number;
  isSelected: boolean;
  onSelected: Function;
}

const Answer = ({
  answer,
  answerStyle,
  index,
  isSelected,
  onSelected,
}: IAnswer) => {
  const handleClick = () => {
    onSelected(index);
  };

  return (
    <div
      className={`flex justify-center px-3 py-3 mx-auto my-4  border border-solid border-[white] rounded-xl w-[250px] md:w-[250px] sm:min-w-[320px]  min-h-[180px]
       transition-all duration-[400] cursor-pointer 
       hover:border-4 hover:border-solid hover:!border-[#5594f1]  hover:shadow-white hover:shadow-lg
       ${isSelected ? "selected" : ""} ${answer.IsCorrect ? "correct" : ""}`}
      onClick={() => handleClick()}
    >
      <div
        className={`text-[16px] md:text-[24px] font-bold flex justify-center items-center gap-1 w-full ${answerStyle}`}
      >
        <div className="text-[16px] md:text-[24px] font-bold ">
          {String.fromCharCode(65 + index)}.{" "}
        </div>
        <div>{answer.Text}</div>
      </div>
    </div>
  );
};

export default Answer;
