import { OpenAiContext, OpenAiProvider } from "../contexts/OpenAiContext";
import React, { useEffect, useRef, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { allCategories } from "../models/categories";
import { GameProvider } from "contexts/GameContext";
import Typewriter from "components/Typewriter";
import Question from "components/Question";
import { Model } from "models/game";
import configSettings from "settings/config.json";

interface IGame {}

const Game = ({}: IGame) => {
  const [gameCategories, setGameCategories] = useState<Model.Category[]>([]);
  const [stage, setStage] = useState(-1);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(-1);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
  const [score, setScore] = useState(0);
  const [showCategory, setShowCategory] = useState(false);

  const { getQuestionsAndAnswers } = OpenAiContext();

  const getRandomCategory = (): string => {
    const randomGroupIndex = Math.floor(Math.random() * allCategories.length);
    const subcategories = allCategories[randomGroupIndex].Subcategories;
    const category =
      subcategories[Math.floor(Math.random() * subcategories.length)];

    allCategories.splice(randomGroupIndex, 1);

    return category;
  };

  const handleQuestionAnswered = (isCorrect: boolean) => {
    fadeOut("question", 1, false);

    setTimeout(() => {
      const points =
        100 * (currentCategoryIndex + 1) + currentQuestionIndex * 20;
      setScore(score + (isCorrect ? points : 0));

      if (currentQuestionIndex < configSettings.questionsPerCategory - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        fadeIn("question", 2000, 0);
      } else if (currentCategoryIndex == configSettings.categoriesPerGame - 1) {
        advanceGameStage();
      } else {
        setCurrentCategoryIndex(currentCategoryIndex + 1);
        setCurrentQuestionIndex(0);
        setShowCategory(true);
      }
    }, 2000);
  };

  const advanceGameStage = () => {
    setStage(stage + 1);
  };

  const fadeIn = (
    id: string,
    delayStart: number,
    delayEnd: number,
    withDissolve: boolean = true,
    onFinish?: Function
  ) => {
    const el = document.getElementById(id)!;
    const fadeSpeed = 500;
    setTimeout(() => {
      el.style.transition = `${fadeSpeed}ms`;
      el.style.opacity = "1";
      el.style.zIndex = "1000";
    }, delayStart);

    if (delayEnd != 0) {
      setTimeout(() => {
        fadeOut(id, 0, withDissolve);
      }, delayStart + delayEnd);
    }

    if (onFinish != null) {
      setTimeout(() => {
        onFinish();
      }, delayStart + delayEnd + fadeSpeed * 2 + 1000);
    }
  };

  const fadeOut = (
    id: string,
    delayStart: number,
    withDissolve: boolean = true,
    onFinish?: Function
  ) => {
    const el = document.getElementById(id)!;
    const fadeSpeed = 500;

    setTimeout(() => {
      el.style.transition = `${fadeSpeed}ms`;
      el.style.opacity = "0";
      el.style.zIndex = "0";
    }, delayStart + (withDissolve ? 1000 : 0));

    if (withDissolve) {
      setTimeout(() => {
        dissolve(id);
      }, delayStart);
    }

    if (onFinish != null) {
      setTimeout(() => {
        onFinish();
      }, delayStart + fadeSpeed + (withDissolve ? 1000 : 0));
    }
  };

  const dissolve = (id: string) => {
    const el = document.getElementById(id)!;
    const sub = el.getElementsByClassName(
      "flex justify-center items-center text-center custom_hight relative"
    );

    for (var i = 0; i < sub.length; i++) {
      const item = sub[i];
      item.setAttribute(
        "style",
        "transition: 1s; textShadow: 0 0 32px white; transform: scale(1.2); color: transparent"
      );
    }
  };

  const logCurrentQuestion = () => {
    if (currentQuestionIndex == 0) {
      console.log(" ");
      console.log(gameCategories[currentCategoryIndex].Text);
      console.log("-".repeat(gameCategories[currentCategoryIndex].Text.length));
    }

    console.log(
      gameCategories[currentCategoryIndex].Questions[currentQuestionIndex].Text
    );
  };

  useEffect(() => {
    if (currentCategoryIndex < 0) return;

    const getNextQuestions = async (categoryIndex: number, text: string) => {
      console.log(
        ">> Getting next questions for category " + categoryIndex + ": " + text
      );
      const nextQuestions = await getQuestionsAndAnswers(
        configSettings.questionsPerCategory,
        text
      );
      console.log(
        ">> Received questions for category " + categoryIndex + ": " + text
      );

      gameCategories[categoryIndex].Questions = nextQuestions;

      setGameCategories(gameCategories);

      if (categoryIndex == 0) {
        setCurrentQuestionIndex(0);
        getNextQuestions(1, gameCategories[1].Text);
      } else if (categoryIndex < configSettings.categoriesPerGame)
        getNextQuestions(
          categoryIndex + 1,
          gameCategories[categoryIndex + 1].Text
        );
    };

    if (currentCategoryIndex == 0) getNextQuestions(0, gameCategories[0].Text);
    //else if (currentCategoryIndex < categoriesPerGame)
    //  getNextQuestions(currentCategoryIndex + 1, gameCategories[currentCategoryIndex + 1].Text);
  }, [currentCategoryIndex]);

  useEffect(() => {
    if (currentCategoryIndex < 0) return;
    logCurrentQuestion();
  }, [currentQuestionIndex]);

  useEffect(() => {
    if (stageNames[stage] != "game") return;

    if (showCategory)
      fadeIn("category", 0, 2000, true, () =>
        setTimeout(() => setShowCategory(false), 1000)
      );
    else fadeIn("question", 2000, 0);
  }, [showCategory]);

  useEffect(() => {
    const newCategories: Model.Category[] = [];

    for (let i = 0; i < configSettings.categoriesPerGame; i++) {
      const category = new Model.Category();
      category.Text = getRandomCategory();
      newCategories.push(category);
    }

    setGameCategories(newCategories);
    setCurrentCategoryIndex(0);
    advanceGameStage();
  }, []);

  const stageNames = [
    "pulsing-logo",
    "introduction",
    "category-list",
    "game",
    "final-score",
  ];

  const waitUntilQuestionsAvailable = () => {
    if (gameCategories[0].Questions == undefined) {
      window.setTimeout(waitUntilQuestionsAvailable, 250);
    } else {
      fadeOut("pulsing-logo", 1000, false, () => {
        fadeIn("game", 0, 0, true, () => {
          setShowCategory(true);
        });
      });
    }
  };

  useEffect(() => {
    const toStage = stageNames[stage];

    switch (stageNames[stage]) {
      case "pulsing-logo":
        fadeIn(toStage, 1000, 5000, false, () => {
          advanceGameStage();
        });
        break;

      case "introduction":
        fadeIn(toStage, 0, 0);
        break;

      case "category-list":
        fadeIn(toStage, 0, 0, true, () => {
          setCurrentCategoryIndex(0);
        });
        break;

      case "game":
        fadeIn("pulsing-logo", 1000, 0, false, () => {
          waitUntilQuestionsAvailable();
        });
        break;

      case "final-score":
        fadeOut("game", 0);
        fadeIn(toStage, 2000, 0);
        break;
    }
  }, [stage]);

  return (
    <div className="w-full  text-[white] mx-auto">
      <div id="pulsing-logo" className="animated">
        <div className="flex justify-center items-center relative custom_hight ">
          <img className="" src="/logo.png"></img>
        </div>
      </div>
      <div
        id="introduction"
        className="animated w-full text-center text-2xl sm:text-3xl md:text-4xl font-semibold my-0  md:leading-[56px] mx-auto "
      >
        <div className="flex justify-center items-center text-center  relative p-4 max-w-5xl mx-auto custom_hight">
          <Typewriter
            id="typewriter-introduction"
            started={stageNames[stage] == "introduction"}
            onFinish={() => {
              fadeOut("introduction", 2000, true, () => {
                advanceGameStage();
              });
            }}
          >
            Welcome to GPT, the Generative Pub Trivia game.|I'll ask you a
            series of questions about the following categories.|Remember, no
            using your cell phone, and please don't shout out your answers.
          </Typewriter>
        </div>
      </div>
      {gameCategories == undefined ? (
        <></>
      ) : (
        <div
          id="category-list"
          className="animated w-full text-center text-3xl md:text-4xl font-semibold my-0 mx-auto md:leading-[36px] custom_hight flex justify-center items-center"
        >
          <div className="flex justify-center items-center text-center  relative p-4">
            <Typewriter
              id="typewriter-category-list"
              started={stageNames[stage] == "category-list"}
              onFinish={() => {
                fadeOut("category-list", 3000, true, () => {
                  advanceGameStage();
                });
              }}
            >
              {gameCategories.map((x) => x.Text).join("|")}
            </Typewriter>
          </div>
        </div>
      )}
      {currentCategoryIndex == -1 || currentQuestionIndex == -1 ? (
        <></>
      ) : (
        <div id="game" className="animated  w-full">
          <div className="w-full">
            <div className="header-content  mt-0 w-full max-w-5xl flex justify-between items-center mx-auto px-2 py-1 ">
              <div className="text-[20px] sm:text-[24px] md:text-[30px] font-medium">
                Score: {score}
              </div>
              <div className=" transition-all duration-[300] flex justify-center items-center flex-wrap ">
                {gameCategories.map((category, i) => (
                  <div
                    className={`w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 ml-2 sm:ml-4 bg-[#666666] ${
                      currentCategoryIndex >= i ? "square_lit" : ""
                    }`}
                    title={category.Text}
                    id={`category-${i}`}
                    key={`category-${i}`}
                  ></div>
                ))}
              </div>
            </div>
          </div>

          {showCategory ? (
            <div id="category" className="flex items-center justify-center">
              <div className="flex justify-center items-center text-center min-h-[80vh] relative font-semibold text-[36px] sm:text-[44px] md:text-[48px] w-full  leadig-[50px]">
                <Typewriter
                  id="typewriter-category"
                  started={stageNames[stage] == "game"}
                >
                  {gameCategories[currentCategoryIndex].Text}
                </Typewriter>
              </div>
            </div>
          ) : (
            <div
              id="question"
              className="flex flex-col justify-center items-center  max-w-1200 mx-auto  w-full text-center p-3 min-h-[80vh] xxl:min-h-[88vh]"
            >
              <Question
                question={
                  gameCategories[currentCategoryIndex].Questions[
                    currentQuestionIndex
                  ]
                }
                onAnswered={(isCorrect: boolean) =>
                  handleQuestionAnswered(isCorrect)
                }
              ></Question>
            </div>
          )}
        </div>
      )}
      <div id="final-score" className="animated w-full ">
        <div className="flex justify-center items-center text-center relative text-3xl sm:text-[4xl] md:text-5xl font-semibold mx-auto my-0 md:leading-[56px] custom_hight ">
          <Typewriter
            id="typewriter-final-score"
            started={stageNames[stage] == "final-score"}
          >{`Congratulations, you finished the game with ${score} points!|Refresh the browser to play again!`}</Typewriter>
        </div>
      </div>
    </div>
  );
};

export default Game;
