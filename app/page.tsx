"use client";
import Image from "next/image";
import texts from "@/lib/texts.json";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function Home() {
  const [paragraph, setParagraph] = useState<string>();

  const [userInput, setUserInput] = useState("");
  const [charIndex, setCharIndex] = useState(0);

  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(50);

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

      if (key === " " || key === "Backspace") {
        event.preventDefault();
      }

      if (key.length > 1 && key !== "Backspace") return;
      console.log("A key was pressed:", event.key);

      if (key === "Backspace") {
        setUserInput((prevInput) => prevInput.slice(0, -1));
        setCharIndex((prevIndex) => Math.max(0, prevIndex - 1));
      } else {
        setUserInput((prevInput) => prevInput + key);
        setCharIndex((prevIndex) => prevIndex + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [end]);

  let wordcounts = userInput.split(" ").filter((word) => word !== "");

  const actualPara = paragraph?.split(" ").slice(start, end) || [];
  const userpara = userInput.split(" ");

  const correctWords = userpara.filter((word, index) => {
    return word.length > 0 && word === actualPara[index];
  });

  return (
    <div className="bg-black text-white w-screen h-screen flex justify-around items-center align-middle flex-col  ">
      <div className="flex justify-center align-middle items-center gap-2">
        words:
        <div
          className=" bg-white/20 p-1 rounded-sm hover:cursor-pointer hover:text-orange-500"
          onClick={() => {
            setEnd(10);
            setCharIndex(0);
            setUserInput("");
          }}
        >
          10
        </div>
        <div
          className=" bg-white/20 p-1 rounded-sm hover:cursor-pointer hover:text-orange-500"
          onClick={() => {
            setEnd(30);
            setCharIndex(0);
            setUserInput("");
          }}
        >
          30
        </div>
        <div
          className=" bg-white/20 p-1 rounded-sm hover:cursor-pointer hover:text-orange-500"
          onClick={() => {
            setEnd(70);
            setCharIndex(0);
            setUserInput("");
          }}
        >
          70
        </div>
      </div>
      <div className="flex flex-col text-start justify-center align-middle items-center">
        <div className="text-3xl">
          {wordcounts.length}/{end}
          <div className="">Correct words : {correctWords.length}</div>
        </div>
        <div className={cn("text-xl tracking-widest max-w-5xl leading-[3rem]")}>
          {paragraph?.split("").map((char, i) => {
            let charState = "untyped";

            if (i < charIndex) {
              charState = char === userInput[i] ? "correct" : "incorrect";
            } else if (i === charIndex) {
              charState = "current";
            }

            return (
              <span
                key={i}
                className={cn({
                  "text-gray-700": charState === "untyped",
                  "text-green-500": charState === "correct",
                  "text-red-500": charState === "incorrect",
                  "text-white": charState === "current",
                })}
              >
                {char}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
