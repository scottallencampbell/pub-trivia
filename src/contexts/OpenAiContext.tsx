import { createContext, useContext, useEffect, useState } from "react"
import configSettings from "settings/config.json";
import axios from "axios";
import { Model } from "models/game";

interface IOpenAiContext {
  getQuestionsAndAnswers: (count: number, category: string) => Promise<Model.Question[]>
}

export const OpenAiContext = (): IOpenAiContext => {
  const {
    getQuestionsAndAnswers
  } = useContext(Context);

  return {    
    getQuestionsAndAnswers
  };
}
    
const Context = createContext({} as IOpenAiContext);

export function OpenAiProvider({ children }: { children: any }) {

  const getQuestionsAndAnswers = async (count: number, category: string): Promise<Model.Question[]> => {    
    const prompt = `
      Please create a unique list of ${count} trivia questions on the topic of ${category}, in JSON format.  
      The ${count} questions should be ordered in increasing difficulty, from easy to very hard.  
      Each question should have ${configSettings.answersPerQuestion} answers, and the correct answer should be listed first.  
      There should only be one correct answer.
      Remember the words in the answers shouldn't occur in the question itself.
      The JSON should be formatted like so: [  {    "question": "...",    "answers": ["...", "...", "...", "..."] } ]`;
    
    const response = await askOpenAi(prompt);
    const inner = JSON.parse(response.choices[0].text);
    
    let result = [] as Model.Question[];

    for (let i = 0; i < inner.length; i++) {
      let question = new Model.Question();
      question.Text = inner[i].question;
      question.Answers = [];

      result.push(question);
      
      for (let j = 0; j < inner[i].answers.length; j++) {
        let answer = new Model.Answer();
        answer.Text = inner[i].answers[j];
        answer.IsCorrect = j == 0;
        question.Answers.push(answer);
      }

      question.Answers = shuffleArray(question.Answers);
    }

    return result;
  }

  const getRequestBody = (prompt: string) :any => {
    const body =     
      { 
        "prompt": prompt,
        "temperature": 0.7,
        "max_tokens": 1000,
        "top_p": 1,
        "frequency_penalty": 0,
        "presence_penalty": 0.5,
        "stop": ["\"\"\""]
      }

    return body;
  }
  
  const getRequestHeaders = () :any => {
    const headers = 
      { 
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + configSettings.openAiApiKey
      }
    };

    return headers;
  }
  
  const askOpenAi = async (prompt: string): Promise<any> => {   
    const body = getRequestBody(prompt);
    const header = getRequestHeaders();

    const result = await axios.post(configSettings.openAiApiRootUrl, body, header)
    .then((result: { data: any }) => {      
      return result.data;
    }
    ).catch((error: any) => { throw error; });
    
    return result;    
  }

  const shuffleArray = (a: any[]) => {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  return (
    <Context.Provider value={{
      getQuestionsAndAnswers
    }}>{children}
    </Context.Provider>
  )
}
