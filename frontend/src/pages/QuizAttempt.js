import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';

const QuizAttempt = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const { data } = await API.get(`/quizzes/${id}`);
        setQuiz(data);
        if (data.attempted) {
          setSubmitted(true);
        }
      } catch (err) {
        navigate('/quizzes');
      }
      setLoading(false);
    };
    fetchQuiz();
  }, [id, navigate]);

  const handleAnswer = (questionIndex, optionIndex) => {
    if (submitted) return;
    setAnswers({ ...answers, [questionIndex]: optionIndex });
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < quiz.questions.length) {
      alert('Please answer all questions before submitting');
      return;
    }
    setSubmitting(true);
    try {
      const answerArray = quiz.questions.map((_, i) => answers[i]);
      const { data } = await API.post(`/quizzes/${id}/submit`, { answers: answerArray });
      setResults(data);
      setSubmitted(true);
    } catch (err) {
      alert('Submission failed');
    }
    setSubmitting(false);
  };

  const getOptionClass = (qIndex, oIndex) => {
    let cls = 'quiz-option';
    if (!submitted) {
      if (answers[qIndex] === oIndex) cls += ' selected';
      return cls;
    }
    if (results) {
      const r = results.results[qIndex];
      if (oIndex === r.correctAnswer) cls += ' correct';
      else if (oIndex === r.selectedAnswer && !r.isCorrect) cls += ' incorrect';
    } else {
      if (oIndex === quiz.questions[qIndex].correctAnswer) cls += ' correct';
      if (answers[qIndex] === oIndex && oIndex !== quiz.questions[qIndex].correctAnswer) cls += ' incorrect';
    }
    return cls;
  };

  if (loading) return <div className="loading"><div className="spinner" /> Loading quiz...</div>;
  if (!quiz) return null;

  return (
    <div className="page-container">
      <div className="back-link" onClick={() => navigate('/quizzes')}>← Back to Quizzes</div>

      <div className="page-header">
        <h1>Quiz: {quiz.material?.title}</h1>
        <p>{quiz.totalQuestions} questions</p>
      </div>

      {submitted && results && (
        <div className="detail-section quiz-score-card">
          <div className="quiz-score-value">{results.percentage}%</div>
          <div className="quiz-score-label">
            You scored {results.score} out of {results.totalQuestions}
          </div>
          <div className="progress-bar-container" style={{ maxWidth: 300, margin: '1rem auto' }}>
            <div className="progress-bar-fill" style={{ width: `${results.percentage}%` }} />
          </div>
        </div>
      )}

      {submitted && !results && quiz.attempted && (
        <div className="detail-section quiz-score-card">
          <div className="quiz-score-value">{Math.round((quiz.score / quiz.totalQuestions) * 100)}%</div>
          <div className="quiz-score-label">
            You scored {quiz.score} out of {quiz.totalQuestions}
          </div>
        </div>
      )}

      {quiz.questions.map((q, qIndex) => (
        <div key={qIndex} className="quiz-question">
          <div className="quiz-question-number">Question {qIndex + 1}</div>
          <div className="quiz-question-text">{q.question}</div>
          {q.options.map((option, oIndex) => (
            <div key={oIndex} className={getOptionClass(qIndex, oIndex)} onClick={() => handleAnswer(qIndex, oIndex)}>
              <div className="quiz-option-marker">
                {String.fromCharCode(65 + oIndex)}
              </div>
              <span>{option}</span>
            </div>
          ))}
          {submitted && q.explanation && (
            <div className="quiz-explanation">
              💡 {q.explanation}
            </div>
          )}
        </div>
      ))}

      {!submitted && (
        <div style={{ textAlign: 'center', margin: '2rem 0' }}>
          <button className="btn btn-success btn-lg" onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Submitting...' : `Submit Quiz (${Object.keys(answers).length}/${quiz.questions.length} answered)`}
          </button>
        </div>
      )}

      {submitted && (
        <div style={{ textAlign: 'center', margin: '2rem 0' }}>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/quizzes')}>Back to Quizzes</button>
        </div>
      )}
    </div>
  );
};

export default QuizAttempt;
