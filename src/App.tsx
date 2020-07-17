import React, { useState } from 'react';
import { fetchQuizQuestions } from './API';
import { AppGlobalStyle, Wrapper } from './assets/styles/App.styles';
// Components
import QuestionCard from './components/QuestionCard';
// Types
import { QuestionState, Difficulty } from './API';

const TOTAL_QUESTIONS = 10;

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
};

const App = () => {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [questionNr, setQuestionNr] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameover, setGameover] = useState(true);

  const startTrivia = async () => {
    try {
      setLoading(true);
      setGameover(false);

      const questionBank = await fetchQuizQuestions(
        TOTAL_QUESTIONS,
        Difficulty.EASY
      );

      setQuestions(questionBank);
      setScore(0);
      setUserAnswers([]);
      setQuestionNr(0);
      setLoading(false);
    } catch (error) {
      throw error;
    }
  };

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameover) {
      // Users answer
      const answer = e.currentTarget.value;
      const isCorrect = questions[questionNr].correct_answer === answer;

      if (isCorrect) {
        setScore((prev) => prev + 1);
      }

      const answerObject = {
        question: questions[questionNr].question,
        answer,
        correct: isCorrect,
        correctAnswer: questions[questionNr].correct_answer,
      };

      setUserAnswers((prev) => [...prev, answerObject]);
    }
  };

  const nextQuestion = () => {
    const next = questionNr + 1;
    if (next === TOTAL_QUESTIONS) {
      setGameover(true);
    } else {
      setQuestionNr(next);
    }
  };

  return (
    <>
      <AppGlobalStyle />
      <Wrapper>
        <h1>REACT QUIZ</h1>
        {(gameover || userAnswers.length === TOTAL_QUESTIONS) && (
          <button className='start' onClick={startTrivia}>
            Begin!
          </button>
        )}

        {!gameover && <p className='score'>Score: {score}</p>}

        {loading && <p>Loading Questions...</p>}

        {!loading && !gameover && (
          <QuestionCard
            questionNr={questionNr + 1}
            totalQuestions={TOTAL_QUESTIONS}
            question={questions[questionNr].question}
            answers={questions[questionNr].answers}
            userAnswer={userAnswers ? userAnswers[questionNr] : undefined}
            callback={checkAnswer}
          />
        )}

        {!gameover &&
          !loading &&
          userAnswers.length === questionNr + 1 &&
          questionNr !== TOTAL_QUESTIONS - 1 && (
            <button className='next' onClick={nextQuestion}>
              Next Question
            </button>
          )}
      </Wrapper>
    </>
  );
};

export default App;
