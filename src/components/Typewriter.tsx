import { type } from "os"
import { useEffect, useState } from "react"

interface ITypewriter {
  id: string
  started: boolean
  onFinish?: any | null
  children: string
}

const Typewriter = ({ id, started, onFinish, children }: ITypewriter) => {
  const [words, setWords] = useState<any[]>([])

  const splitWords = (): any[] => {
    const words = children.replace(/\|/g, "<br/><br/> ").split(" ")
    const wordsWithDelays = []
    let runningDelay = 1

    for (let i = 0; i < words.length; i++) {
      const word = words[i]
      const lastWord = i > 0 ? words[i - 1] : ""
      let delay = Math.floor(Math.random() * 500) // 5000 - Math.floor(Math.random() * 5000);

      if (Math.random() < 0.6) delay = 0

      if (lastWord.endsWith("<br/>")) delay += 2000
      else if (lastWord.endsWith(".")) delay += 1000

      runningDelay += delay
      wordsWithDelays.push({ word: word, delay: runningDelay })
    }

    return wordsWithDelays
  }

  useEffect(() => {
    if (started && children && children.length > 0) {
      const delay = 1
      const wordsWithDelays = splitWords()
      const finalWordDelay = wordsWithDelays[wordsWithDelays.length - 1].delay + delay

      setWords(wordsWithDelays)

      if (onFinish) setTimeout(() => onFinish(), finalWordDelay)

      setTimeout(() => displayWords(wordsWithDelays), delay)
    }
  }, [started, children])

  const displayWords = (wordsWithDelays: any[]) => {
    for (let i = 0; i < wordsWithDelays.length; i++) {
      const spanID = `${id}-${i}`
      const el = document.getElementById(spanID)!

      setTimeout(() => {
        el.style.opacity = "1"
      }, wordsWithDelays[i].delay)
    }
  }

  return (
    <div id={id} className={`typewriter`}>
      {words.map((item, i) => (
        <span id={`${id}-${i}`} key={i} dangerouslySetInnerHTML={{ __html: item.word + " " }} />
      ))}
    </div>
  )
}

export default Typewriter
