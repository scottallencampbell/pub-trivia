import { OpenAiContext } from "contexts/OpenAiContext";
import { useCallback, useEffect, useState } from "react";
import { HelmetProvider } from "react-helmet-async";

interface ILayout {
  children: any
}
  
export const Layout = ({children}: ILayout) => {    
  
  return (
    <>
    <HelmetProvider>
      <title>Generative Pub Trivia</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />      
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link href="https://fonts.googleapis.com/css2?family=Lato" rel="preload" as="style"/>
      <link href="https://fonts.googleapis.com/css2?family=Lato&display=swap" rel="stylesheet" media="print" />
    </HelmetProvider>
    <div id="overlay"></div>
    <div className="">
      <div className="top-bar">
        <img className="logo" src="/logo.png"></img>
        <div className="title">Generative Pub Trivia</div>
        <div className="top-bar-buttons">      
        </div>
      </div>             
      <div className="outer">         
        <main>
         {children}
        </main>        
      </div>
    </div>  
    </>
    );
  }
