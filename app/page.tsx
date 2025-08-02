"use client";

import { cn } from "@/lib/utils";
import { useTypingTest } from "@/hooks/useTypingTest";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useRef, useLayoutEffect, useState, useEffect } from "react";

export default function Home() {
  // =================================================================================
  // I. STATE AND HOOKS INTEGRATION
  // =================================================================================

  /**
   * Core typing test logic is managed by this custom hook.
   * It provides all necessary state and functions for the game.
   */
  const {
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

  /**
   * Custom hook to detect if the user is on a mobile device.
   */
  const isMobile = useIsMobile();

  /**
   * Ref for the hidden input element. This is the key to ensuring the virtual
   * keyboard appears on mobile devices, which do not show a keyboard unless
   * an input field is focused.
   */
  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * Ref for the div containing the words. Used to calculate the position of the
   * current word for the smooth scrolling effect.
   */
  const blockRef = useRef<HTMLDivElement>(null);

  /**
   * State for the current line index the user is on.
   * This is used to calculate the `translateY` value for the scroll effect.
   * @type {[number, React.Dispatch<React.SetStateAction<number>>]}
   */
  const [lineIndex, setLineIndex] = useState(0);

  // =================================================================================
  // II. UI LOGIC AND EFFECTS
  // =================================================================================

  // --- Smooth Vertical Scroll Logic ---
  const WORDS_BLOCK_SIZE = 1000; // Max words to render to prevent performance issues.
  const VISIBLE_LINES = 4; // The number of lines visible in the typing area.
  const LINE_HEIGHT_REM = 2.5; // Corresponds to `leading-relaxed` on a `text-3xl`.
  const LINE_HEIGHT_PX = 40; // Pixel fallback for calculation.

  /**
   * `useLayoutEffect` is used here to prevent visual flicker. It runs synchronously
   * after the DOM has been mutated but before the browser has painted. This ensures
   * that the scroll position is calculated and applied in the same frame, creating
   * a seamless scrolling experience.
   */
  useEffect(() => {
    if (!blockRef.current) return;

    const currentWordElem = blockRef.current.querySelector(
      '[data-current-word="true"]'
    ) as HTMLElement;

    if (currentWordElem) {
      const blockTop = blockRef.current.getBoundingClientRect().top;
      const wordTop = currentWordElem.getBoundingClientRect().top;
      const offset = wordTop - blockTop;
      // Calculate the current line based on the element's position.
      const line = Math.floor(offset / LINE_HEIGHT_PX);
      setLineIndex(line);
    } else {
      // If the current word element isn't found (e.g., after a test reset),
      // ensure the scroll position is reset to the top.
      setLineIndex(0);
    }
  }, [currentWordIndex, actualWords]); // Re-calculate when the word or text changes.

  // Sliced words to render, improving performance for very long paragraphs.
  const blockStart = 0;
  const blockEnd = Math.min(actualWords.length, WORDS_BLOCK_SIZE);
  const blockWords = actualWords.slice(blockStart, blockEnd);

  // The CSS `transform` value to apply for the scrolling effect.
  const translateY = -(lineIndex * LINE_HEIGHT_REM) + "rem";

  /**
   * Effect to manage the focus of the hidden input field.
   * This is crucial for user experience, especially on mobile.
   */
  useEffect(() => {
    // We always want the input to be focused so the user can start typing.
    inputRef.current?.focus();
  }, [isMobile, endTime]); // Refocus when view changes (e.g., test ends).

  // =================================================================================
  // III. RENDER LOGIC
  // =================================================================================

  return (
    <div
      className="min-h-screen w-full bg-black text-white"
      // The entire page is clickable to focus the hidden input, which
      // brings up the keyboard on mobile if it was dismissed.
      onClick={() => inputRef.current?.focus()}
    >
      <input
        ref={inputRef}
        type="text"
        className="absolute top-[-9999px] left-[-9999px] opacity-0"
        autoFocus
      />

      {/* Main Content: Conditionally renders Test or Results */}
      <div className="max-w-7xl mx-auto px-2 md:px-8 py-8 md:py-16">
        {endTime ? (
          // Results View
          <div className="flex flex-col items-center justify-center min-h-[40vh] md:min-h-[60vh]">
            <div className="text-center space-y-8 md:space-y-12">
              <div className="space-y-2 md:space-y-4">
                <h1 className="text-4xl md:text-6xl font-light tracking-wider">
                  RESULTS
                </h1>
                <div className="w-16 md:w-24 h-px bg-white mx-auto"></div>
              </div>
              <div className="grid grid-cols-2 gap-8 md:gap-16">
                <div className="text-center space-y-1 md:space-y-2">
                  <div className="text-3xl md:text-5xl font-light tracking-wider">
                    {wpm}
                  </div>
                  <div className="text-xs md:text-sm font-medium tracking-widest text-white/60">
                    WORDS PER MINUTE
                  </div>
                </div>
                <div className="text-center space-y-1 md:space-y-2">
                  <div className="text-3xl md:text-5xl font-light tracking-wider">
                    {accuracy}%
                  </div>
                  <div className="text-xs md:text-sm font-medium tracking-widest text-white/60">
                    ACCURACY
                  </div>
                </div>
              </div>
              <button
                className="px-8 md:px-12 py-3 md:py-4 border border-white/20 text-xs md:text-sm font-medium tracking-widest hover:border-white hover:bg-white hover:text-black transition-all duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  resetTest(end);
                  setLineIndex(0); // Reset scroll on restart as well.
                }}
              >
                RESTART TEST
              </button>
            </div>
          </div>
        ) : (
          // Typing Interface
          <div className="space-y-8 md:space-y-12">
            <div className="space-y-2 md:space-y-4">
              <span className="text-xs md:text-sm font-medium tracking-wide text-white/60 hidden md:inline-block">
                WORDS
              </span>
              <div className="flex gap-2">
                {[10, 30, 70].map((num) => (
                  <button
                    key={num}
                    className={cn(
                      "w-10 h-10 md:w-12 md:h-12 border border-white/20 text-xs md:text-sm font-medium tracking-wide transition-all duration-200",
                      "hover:border-white hover:bg-white hover:text-black",
                      end === num ? "border-white bg-white text-black" : ""
                    )}
                    onClick={(e) => {
                      // Stop propagation to prevent the parent div's onClick from firing,
                      // which could interfere with the reset logic.
                      e.stopPropagation();
                      resetTest(num);
                      setLineIndex(0); // CRITICAL: Reset scroll position on test change.
                    }}
                  >
                    {num}
                  </button>
                ))}
              </div>
              <div className="flex justify-between items-center text-xs md:text-sm font-medium tracking-wide">
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
            <div
              className="border border-white/10 p-4 md:p-10 bg-black overflow-hidden cursor-text"
              style={{ height: `${VISIBLE_LINES * LINE_HEIGHT_REM * 2}rem` }}
            >
              <div
                ref={blockRef}
                className="font-mono text-xl md:text-3xl leading-relaxed tracking-wide select-none flex flex-wrap gap-x-2 md:gap-x-4 gap-y-1 md:gap-y-2 transition-transform duration-300"
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
                        if (globalWordIndex < completedWords.length) {
                          userChar =
                            completedWords[globalWordIndex][charIndex] || "";
                        } else if (globalWordIndex === completedWords.length) {
                          userChar = currentWordInput[charIndex] || "";
                        }

                        let charState: "correct" | "incorrect" | "untyped" =
                          "untyped";
                        if (userChar) {
                          charState =
                            userChar === char ? "correct" : "incorrect";
                        }

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
            <div className="text-center">
              <p className="text-xs md:text-sm font-medium tracking-wide text-white/40">
                START TYPING TO BEGIN THE TEST
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
