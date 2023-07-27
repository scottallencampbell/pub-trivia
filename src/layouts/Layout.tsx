import { OpenAiContext } from "contexts/OpenAiContext";
import { useCallback, useEffect, useState } from "react";
import { HelmetProvider } from "react-helmet-async";

interface ILayout {
  children: any;
}

export const Layout = ({ children }: ILayout) => {
  return (
    <>
      <HelmetProvider>
        <title>Generative Pub Trivia</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lato"
          rel="preload"
          as="style"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Lato&display=swap"
          rel="stylesheet"
          media="print"
        />
      </HelmetProvider>
      <div id="overlay"></div>
      <div className="">
        <div className="flex justify-start items-center px-3  h-[60px] py-2 gap-2 bg-gradient-to-r from-[#467fd6] via-[#4589ed] to-[#5594f1]">
          <img className="h-[48px]" src="/logo.png"></img>
          <div className="text-white font-semibold  text-xl md:text-2xl">
            Generative Pub Trivia
          </div>
        </div>
        <div className="outer">
          <main>{children}</main>
        </div>
      </div>
    </>
  );
};
