"use client";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useTypingTest } from "@/hooks/useTypingTest";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useRef, useLayoutEffect, useState } from "react";

export default function Home() {
  // Use the custom hook to manage typing test logic
  const {
    paragraph,
    currentWordInput,
    completedWords,
    currentWordIndex,
    end,
    endTime,
    actualWords,
    correctWords,
    wpm,
    accuracy,
    resetTest,
  } = useTypingTest();

  const isMobile = useIsMobile();
  const router = useRouter();

  // --- Smooth vertical scroll logic ---
  const WORDS_BLOCK_SIZE = 1000; // Number of words to render in the block
  const VISIBLE_LINES = 4;
  const LINE_HEIGHT_REM = 2.5; // Should match the line height in rem (e.g., text-3xl leading-relaxed)
  const LINE_HEIGHT_PX = 40; // fallback for JS calculation if needed

  // Calculate the current line based on the current word's position
  const wordsBefore = actualWords.slice(0, currentWordIndex);
  // Create a dummy element to measure line breaks
  const blockRef = useRef<HTMLDivElement>(null);
  const [lineIndex, setLineIndex] = useState(0);

  // Calculate the current line index by measuring the offsetTop of the current word
  useLayoutEffect(() => {
    if (!blockRef.current) return;
    const currentWordElem = blockRef.current.querySelector(
      '[data-current-word="true"]'
    ) as HTMLElement;
    if (currentWordElem && blockRef.current) {
      // Calculate which line the current word is on
      const blockTop = blockRef.current.getBoundingClientRect().top;
      const wordTop = currentWordElem.getBoundingClientRect().top;
      const offset = wordTop - blockTop;
      const line = Math.round(offset / LINE_HEIGHT_PX);
      setLineIndex(line);
    }
  }, [currentWordIndex]);

  // Only render a block of words for performance
  const blockStart = 0;
  const blockEnd = Math.min(actualWords.length, WORDS_BLOCK_SIZE);
  const blockWords = actualWords.slice(blockStart, blockEnd);

  // Calculate the vertical offset for smooth scroll
  const translateY = -(lineIndex * LINE_HEIGHT_REM) + "rem";

  if (isMobile) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-black text-white">
        <div className="text-center space-y-4">
          <div className="text-3xl font-bold tracking-wide">
            Please use a desktop for the best experience.
          </div>
          <div className="text-lg text-white/60">
            This typing test is optimized for desktop screens.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-black text-white">
      {/* Header */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-light tracking-wider">TypeKar</div>
            <div className="flex items-center gap-8">
              <span className="text-sm font-medium tracking-wide text-white/60">
                WORDS
              </span>
              <div className="flex gap-2">
                {[10, 30, 70].map((num) => (
                  <button
                    key={num}
                    className={cn(
                      "w-12 h-12 border border-white/20 text-sm font-medium tracking-wide transition-all duration-200",
                      "hover:border-white hover:bg-white hover:text-black",
                      end === num ? "border-white bg-white text-black" : ""
                    )}
                    onClick={() => resetTest(num)}
                  >
                    {num}
                  </button>
                ))}
              </div>
              {/* Auth Buttons */}
              <div className="flex gap-3 ml-8">
                <button
                  className="px-6 py-2 border border-white/20 rounded-full text-sm font-semibold tracking-wide transition-all duration-200 hover:border-white hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-white/40"
                  onClick={() => {
                    /* TODO: handle sign in */
                  }}
                >
                  Sign In
                </button>
                <button
                  className="px-6 py-2 border border-orange-400 bg-orange-400 text-black rounded-full text-sm font-semibold tracking-wide transition-all duration-200 hover:bg-orange-500 hover:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-400/40"
                  onClick={() => {
                    /* TODO: handle sign up */
                  }}
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-16">
        {endTime ? (
          // Results View
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-12">
              <div className="space-y-4">
                <h1 className="text-6xl font-light tracking-wider">RESULTS</h1>
                <div className="w-24 h-px bg-white mx-auto"></div>
              </div>

              <div className="grid grid-cols-2 gap-16">
                <div className="text-center space-y-2">
                  <div className="text-5xl font-light tracking-wider">
                    {wpm}
                  </div>
                  <div className="text-sm font-medium tracking-widest text-white/60">
                    WORDS PER MINUTE
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-5xl font-light tracking-wider">
                    {accuracy}%
                  </div>
                  <div className="text-sm font-medium tracking-widest text-white/60">
                    ACCURACY
                  </div>
                </div>
              </div>

              <button
                className="px-12 py-4 border border-white/20 text-sm font-medium tracking-widest hover:border-white hover:bg-white hover:text-black transition-all duration-200"
                onClick={() => resetTest(end)}
              >
                RESTART TEST
              </button>
            </div>
          </div>
        ) : (
          // Typing Interface
          <div className="space-y-12">
            {/* Progress Bar */}
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm font-medium tracking-wide">
                <span className="text-white/60">
                  PROGRESS: {completedWords.length} / {end}
                </span>
                <span className="text-white/60">
                  CORRECT: {correctWords.length}
                </span>
              </div>
              <div className="w-full h-px bg-white/10">
                <div
                  className="h-full bg-white transition-all duration-300"
                  style={{ width: `${(completedWords.length / end) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Typing Area - smooth vertical scroll */}
            <div
              className=" p-10 bg-black overflow-hidden"
              style={{ height: `${VISIBLE_LINES * LINE_HEIGHT_REM * 2}rem` }}
            >
              <div
                ref={blockRef}
                className="font-mono text-3xl leading-relaxed tracking-wide select-none flex flex-wrap gap-x-4 gap-y-2 transition-transform duration-300"
                style={{ transform: `translateY(${translateY})` }}
              >
                {blockWords.map((word, wordIndex) => {
                  const globalWordIndex = blockStart + wordIndex;
                  const isCurrentWord = globalWordIndex === currentWordIndex;
                  return (
                    <span
                      key={globalWordIndex}
                      data-current-word={isCurrentWord ? "true" : undefined}
                      className="inline-block"
                    >
                      {word.split("").map((char, charIndex) => {
                        let userChar = "";
                        // Determine which character to compare
                        if (globalWordIndex < completedWords.length) {
                          userChar =
                            completedWords[globalWordIndex][charIndex] || "";
                        } else if (globalWordIndex === completedWords.length) {
                          userChar = currentWordInput[charIndex] || "";
                        }
                        // Set character state for coloring
                        let charState: "correct" | "incorrect" | "untyped" =
                          "untyped";
                        if (userChar) {
                          if (userChar === char) {
                            charState = "correct";
                          } else {
                            charState = "incorrect";
                          }
                        }
                        // Highlight the current character being typed
                        const isCurrent =
                          globalWordIndex === completedWords.length &&
                          charIndex === currentWordInput.length;
                        return (
                          <span
                            key={charIndex}
                            className={cn({
                              "text-white bg-white/20": isCurrent,
                              "text-white":
                                charState === "correct" && !isCurrent,
                              "text-white/30 bg-white/10":
                                charState === "incorrect" && !isCurrent,
                              "text-white/30":
                                charState === "untyped" && !isCurrent,
                            })}
                          >
                            {char}
                          </span>
                        );
                      })}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Instructions */}
            <div className="text-center">
              <p className="text-sm font-medium tracking-wide text-white/40">
                START TYPING TO BEGIN THE TEST
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
