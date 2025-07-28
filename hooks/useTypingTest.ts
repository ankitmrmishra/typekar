import { useEffect, useState } from "react";
import texts from "@/lib/texts.json";

/**
 * Custom React hook for managing a typing test game.
 *
 * This hook encapsulates all the logic required for a typing test, including:
 * - Selecting a random paragraph and slicing it to a desired word count
 * - Tracking user input and completed words
 * - Handling keyboard events for typing and word completion
 * - Calculating typing speed (WPM) and accuracy
 * - Providing a reset function to restart the test with a different word count
 *
 * @param {number} [defaultWordCount=50] - The default number of words for the typing test
 * @returns {object} An object containing all state and functions needed for the typing test UI
 *
 * @property {string} paragraph - The current paragraph to be typed (as a string)
 * @property {string} currentWordInput - The current word being typed by the user
 * @property {string[]} completedWords - Array of words the user has completed
 * @property {number} currentWordIndex - Index of the current word in the paragraph
 * @property {number} start - Start index for slicing the paragraph (always 0)
 * @property {number} end - End index for slicing the paragraph (word count)
 * @property {number|null} startTime - Timestamp when typing started (ms since epoch)
 * @property {number|null} endTime - Timestamp when typing ended (ms since epoch)
 * @property {string[]} actualWords - Array of words in the current paragraph
 * @property {string[]} correctWords - Array of correctly typed words
 * @property {number} wpm - Words per minute achieved by the user
 * @property {number} accuracy - Typing accuracy as a percentage
 * @property {function} resetTest - Function to reset the test with a new word count
 */
export function useTypingTest(defaultWordCount: number = 50) {
  // The paragraph to be typed by the user
  const [paragraph, setParagraph] = useState<string>("");
  // The current word being typed
  const [currentWordInput, setCurrentWordInput] = useState("");
  // Array of words the user has completed
  const [completedWords, setCompletedWords] = useState<string[]>([]);
  // Index of the current word in the paragraph
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  // Start and end indices for slicing the paragraph
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(defaultWordCount);
  // Timing state for WPM calculation
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);

  // Select a random paragraph and slice it to the desired word count
  const randomIndex = Math.floor(Math.random() * texts.length);
  const randomParagraph = texts[randomIndex];
  const initialPara = randomParagraph
    .split(" ")
    .slice(start, end)
    .join(" ")
    .toLowerCase();

  // Update the paragraph whenever the word count changes
  useEffect(() => {
    setParagraph(initialPara);
  }, [end]);

  // Keyboard event handler for typing logic
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore input if the test is finished
      if (endTime) return;
      const { key } = event;
      // Start timer on first key press
      if (!startTime) {
        setStartTime(Date.now());
      }
      // Spacebar completes the current word
      if (key === " ") {
        event.preventDefault();
        if (currentWordInput.length > 0) {
          setCompletedWords((prev) => [...prev, currentWordInput]);
          setCurrentWordInput("");
          setCurrentWordIndex((prev) => prev + 1);
        }
        return;
      }
      // Ignore non-character keys except Backspace
      if (key.length > 1 && key !== "Backspace") return;
      // Backspace removes the last character
      if (key === "Backspace") {
        setCurrentWordInput((prev) => prev.slice(0, -1));
      } else {
        // Add typed character to current word
        setCurrentWordInput((prev) => prev + key);
      }
    };
    // Attach and clean up event listener
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentWordInput, endTime, startTime]);

  // Split the paragraph into words for comparison
  const actualWords = paragraph?.split(" ") || [];

  // Array of correctly typed words
  const correctWords = completedWords.filter(
    (word, i) => word === actualWords[i]
  );

  // End the test when the required number of words is completed
  useEffect(() => {
    if (completedWords.length >= end && !endTime) {
      setEndTime(Date.now());
    }
  }, [completedWords]);

  // Calculate WPM and accuracy
  let wpm = 0;
  let accuracy = 0;
  if (startTime && endTime) {
    const durationInMinutes = (endTime - startTime) / 1000 / 60;
    wpm = Math.round(correctWords.length / durationInMinutes);
    accuracy = Math.round((correctWords.length / completedWords.length) * 100);
  }

  /**
   * Resets the typing test with a new word count.
   *
   * @param {number} newEnd - The new number of words for the test
   */
  const resetTest = (newEnd: number) => {
    setEnd(newEnd);
    setCompletedWords([]);
    setCurrentWordInput("");
    setCurrentWordIndex(0);
    setStartTime(null);
    setEndTime(null);
  };

  return {
    paragraph,
    currentWordInput,
    completedWords,
    currentWordIndex,
    start,
    end,
    startTime,
    endTime,
    actualWords,
    correctWords,
    wpm,
    accuracy,
    resetTest,
  };
}
