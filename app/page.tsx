"use client";

import texts from "@/lib/texts.json";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { redirect, useRouter } from "next/navigation";

export default function Home() {
  const [paragraph, setParagraph] = useState<string>();
  const [currentWordInput, setCurrentWordInput] = useState("");
  const [completedWords, setCompletedWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(50);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);

  const router = useRouter();
  const randomIndex = Math.floor(Math.random() * texts.length);
  const radnom_paragraph = texts[randomIndex];
  const initial_para = radnom_paragraph
    .split(" ")
    .slice(start, end)
    .join(" ")
    .toLowerCase();

  useEffect(() => {
    setParagraph(initial_para);
  }, [end]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { key } = event;
      if (!startTime) {
        setStartTime(Date.now());
      }

      if (key === " ") {
        event.preventDefault();
        if (currentWordInput.length > 0) {
          setCompletedWords((prev) => [...prev, currentWordInput]);
          setCurrentWordInput("");
          setCurrentWordIndex((prev) => prev + 1);
        }
        return;
      }

      if (key.length > 1 && key !== "Backspace") return;

      if (key === "Backspace") {
        setCurrentWordInput((prev) => prev.slice(0, -1));
      } else {
        setCurrentWordInput((prev) => prev + key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentWordInput]);

  const actualWords = paragraph?.split(" ") || [];

  const correctWords = completedWords.filter(
    (word, i) => word === actualWords[i]
  );

  useEffect(() => {
    if (completedWords.length >= end) {
      setEndTime(Date.now());
    }

    console.log("this is chanfing");
  }, [completedWords]);

  let wpm = 0;
  let accuracy = 0;

  if (startTime && endTime) {
    const durationInMinutes = (endTime - startTime) / 1000 / 60;
    wpm = Math.round(correctWords.length / durationInMinutes);
    accuracy = Math.round((correctWords.length / completedWords.length) * 100);
  }

  return (
    <div className="bg-black text-white w-screen h-screen flex justify-around items-center align-middle flex-col">
      {/* Word count selector */}
      <div className="flex justify-center align-middle items-center gap-2">
        words:
        {[10, 30, 70].map((num) => (
          <div
            key={num}
            className=" p-1 rounded-sm hover:cursor-pointer hover:text-orange-500"
            onClick={() => {
              setEnd(num);
              setCompletedWords([]);
              setCurrentWordInput("");
              setCurrentWordIndex(0);
            }}
          >
            {num}
          </div>
        ))}
      </div>

      <div className="flex flex-col text-start justify-center align-middle items-center">
        <div className="text-3xl">
          {completedWords.length}/{end}
          <div>Correct words: {correctWords.length}</div>
        </div>

        {endTime ? (
          <div className="mt-6 p-4 rounded-xl text-center shadow-lg">
            <h2 className="text-2xl font-bold mb-2 text-white">Your Results</h2>
            <p className="text-xl text-white">
              WPM: <span className="text-green-400">{wpm}</span>
            </p>
            <p className="text-xl text-white">
              Accuracy: <span className="text-blue-400">{accuracy}%</span>
            </p>
          </div>
        ) : (
          <div
            className={cn("text-xl tracking-widest max-w-5xl leading-[3rem]")}
          >
            {actualWords.map((word, wordIndex) => (
              <span key={wordIndex} className="mr-2 inline-block">
                {word.split("").map((char, charIndex) => {
                  let userChar = "";

                  if (wordIndex < completedWords.length) {
                    userChar = completedWords[wordIndex][charIndex] || "";
                  } else if (wordIndex === completedWords.length) {
                    userChar = currentWordInput[charIndex] || "";
                  }

                  let charState: "correct" | "incorrect" | "untyped" =
                    "untyped";

                  if (userChar) {
                    if (userChar === char) {
                      charState = "correct";
                    } else {
                      charState = "incorrect";
                    }
                  }

                  const isCurrent =
                    wordIndex === completedWords.length &&
                    charIndex === currentWordInput.length;

                  return (
                    <span
                      key={charIndex}
                      className={cn({
                        "text-white underline": isCurrent,
                        "text-green-500": charState === "correct" && !isCurrent,
                        "text-red-500": charState === "incorrect" && !isCurrent,
                        "text-gray-700": charState === "untyped" && !isCurrent,
                      })}
                    >
                      {char}
                    </span>
                  );
                })}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
