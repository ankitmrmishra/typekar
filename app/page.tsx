"use client";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useTypingTest } from "@/hooks/useTypingTest";

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

  const router = useRouter();

  return (
    <div className="min-h-screen w-full bg-black text-white">
      {/* Header */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-light tracking-wider">
              TYPING TEST
            </div>
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

            {/* Typing Area */}
            <div className="border border-white/10 p-12">
              <div className="font-mono text-3xl leading-relaxed tracking-wide select-none">
                {actualWords.map((word, wordIndex) => (
                  <span key={wordIndex} className="mr-6 inline-block">
                    {word.split("").map((char, charIndex) => {
                      let userChar = "";
                      // Determine which character to compare
                      if (wordIndex < completedWords.length) {
                        userChar = completedWords[wordIndex][charIndex] || "";
                      } else if (wordIndex === completedWords.length) {
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
                        wordIndex === completedWords.length &&
                        charIndex === currentWordInput.length;

                      return (
                        <span
                          key={charIndex}
                          className={cn({
                            "text-white bg-white/20": isCurrent,
                            "text-white": charState === "correct" && !isCurrent,
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
                ))}
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
