import React, { useState, useEffect } from "react";
import Points from "./Points";
import './App.css';
const API_URL =  process.env.REACT_APP_QUIZ_KEY;
function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [present, setPresent] = useState(0);
  const [score, setScore] = useState(0);
  const [showAns, setShowAns] = useState(false);
  const [complete, setComplete] = useState(false);
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  useEffect(() => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => {
        const shuffle = data.results.map((quest) => ({
          ...quest,
          options: shuffleArray(
            quest.incorrect_answers.map((option) => option.replace(/&quot;/g, '"')).concat(quest.correct_answer.replace(/&quot;/g, '"'))
          ),
          question: quest.question.replace(/&quot;/g, '"'),
        }));
        setQuestions(shuffle);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);
  const handleClick = (opted) => {
    const ans = questions[present].correct_answer;
    if (opted === ans) {
      setScore(score + 1);
    }
    if (present === questions.length - 1) {
      setComplete(true);
    }
    setShowAns(true);
  };
  const nextQuestion = () => {
    const nextQue = present + 1;
    if (nextQue <= questions.length) {
      setPresent(nextQue);
    }
    setShowAns(false);
  };
  return (
    <>
      {present < questions.length && questions[present] ? (
        <div className="show">
          <h2>{questions[present].question}</h2>
          <div className="answer">
            {questions[present].options.map((answer) => (
              <button
                key={answer}
                onClick={() => handleClick(answer)}
                disabled={present === questions.length}
              >
                {answer}
              </button>
            ))}
          </div>
          {showAns && (
            <p className="display">The correct answer is {questions[present].correct_answer}</p>
          )}
          <div className="continue">
          <button onClick={nextQuestion} disabled={!showAns}>
            Next
          </button>
          </div>
        </div>
      ) : (
        <div>{complete && <Points score={score} />}</div>
      )}
    </>
  );
}

export default Quiz;