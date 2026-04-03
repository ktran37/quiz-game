// Dark mode toggle
const darkModeToggle = document.getElementById("dark-mode-toggle");

if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark");
  darkModeToggle.textContent = "Light Mode";
}

darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  darkModeToggle.textContent = isDark ? "Light Mode" : "Dark Mode";
  localStorage.setItem("darkMode", isDark);
});

// DOM elements
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const startButton = document.getElementById("start-btn");
const questionText = document.getElementById("question-text");
const answersContainer = document.getElementById("answers-container");
const currentQuestionSpan = document.getElementById("current-question");
const totalQuestionsSpan = document.getElementById("total-questions");
const scoreSpan = document.getElementById("score");
const finalScoreSpan = document.getElementById("final-score");
const maxScoreSpan = document.getElementById("max-score");
const resultMessage = document.getElementById("result-message");
const restartButton = document.getElementById("restart-btn");
const progressBar = document.getElementById("progress");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");

const quizQuestions = [
  {
    question: "What is the capital of France?",
    answers: [
      { text: "London", correct: false },
      { text: "Berlin", correct: false },
      { text: "Paris", correct: true },
      { text: "Madrid", correct: false },
    ],
  },
  {
    question: "Which planet is known as the Red Planet?",
    answers: [
      { text: "Venus", correct: false },
      { text: "Mars", correct: true },
      { text: "Jupiter", correct: false },
      { text: "Saturn", correct: false },
    ],
  },
  {
    question: "What is the largest ocean on Earth?",
    answers: [
      { text: "Atlantic Ocean", correct: false },
      { text: "Indian Ocean", correct: false },
      { text: "Arctic Ocean", correct: false },
      { text: "Pacific Ocean", correct: true },
    ],
  },
  {
    question: "Which of these is NOT a programming language?",
    answers: [
      { text: "Java", correct: false },
      { text: "Python", correct: false },
      { text: "Banana", correct: true },
      { text: "JavaScript", correct: false },
    ],
  },
  {
    question: "What is the chemical symbol for gold?",
    answers: [
      { text: "Go", correct: false },
      { text: "Gd", correct: false },
      { text: "Au", correct: true },
      { text: "Ag", correct: false },
    ],
  },
];

// QUIZ STATE VARS
let currentQuestionIndex = 0;
let score = 0;
let answersDisabled = false;
let userAnswers = []; // null = unanswered, otherwise index of chosen answer

totalQuestionsSpan.textContent = quizQuestions.length;
maxScoreSpan.textContent = quizQuestions.length;

// event listeners
startButton.addEventListener("click", startQuiz);
restartButton.addEventListener("click", restartQuiz);
prevBtn.addEventListener("click", () => {
  currentQuestionIndex--;
  showQuestion();
});
nextBtn.addEventListener("click", () => {
  if (currentQuestionIndex < quizQuestions.length - 1) {
    currentQuestionIndex++;
    showQuestion();
  } else {
    showResults();
  }
});

function startQuiz() {
  // reset vars
  currentQuestionIndex = 0;
  score = 0;
  scoreSpan.textContent = 0;
  userAnswers = new Array(quizQuestions.length).fill(null);

  startScreen.classList.remove("active");
  quizScreen.classList.add("active");

  showQuestion();
}

function showQuestion() {
  const currentQuestion = quizQuestions[currentQuestionIndex];
  const savedAnswerIndex = userAnswers[currentQuestionIndex];

  // lock answers if this question was already answered
  answersDisabled = savedAnswerIndex !== null;

  currentQuestionSpan.textContent = currentQuestionIndex + 1;

  const progressPercent = (currentQuestionIndex / quizQuestions.length) * 100;
  progressBar.style.width = progressPercent + "%";

  questionText.textContent = currentQuestion.question;

  answersContainer.innerHTML = "";

  currentQuestion.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.textContent = answer.text;
    button.classList.add("answer-btn");
    button.dataset.correct = answer.correct;
    button.dataset.index = index;

    // restore previous answer highlighting
    if (savedAnswerIndex !== null) {
      if (answer.correct) {
        button.classList.add("correct");
      } else if (index === savedAnswerIndex) {
        button.classList.add("incorrect");
      }
    }

    button.addEventListener("click", selectAnswer);
    answersContainer.appendChild(button);
  });

  // update nav buttons
  prevBtn.disabled = currentQuestionIndex === 0;
  nextBtn.disabled = savedAnswerIndex === null;
  nextBtn.textContent =
    currentQuestionIndex === quizQuestions.length - 1
      ? "Finish \u2192"
      : "Next \u2192";
}

function selectAnswer(event) {
  if (answersDisabled) return;
  answersDisabled = true;

  const selectedButton = event.target;
  const selectedIndex = parseInt(selectedButton.dataset.index);

  // save answer and recalculate score
  userAnswers[currentQuestionIndex] = selectedIndex;
  score = userAnswers.reduce((total, answerIndex, qIndex) => {
    if (answerIndex === null) return total;
    return total + (quizQuestions[qIndex].answers[answerIndex].correct ? 1 : 0);
  }, 0);
  scoreSpan.textContent = score;

  // highlight correct/incorrect
  Array.from(answersContainer.children).forEach((button) => {
    if (button.dataset.correct === "true") {
      button.classList.add("correct");
    } else if (button === selectedButton) {
      button.classList.add("incorrect");
    }
  });

  // enable Next/Finish button
  nextBtn.disabled = false;
}

function showResults() {
  quizScreen.classList.remove("active");
  resultScreen.classList.add("active");

  finalScoreSpan.textContent = score;

  const percentage = (score / quizQuestions.length) * 100;

  if (percentage === 100) {
    resultMessage.textContent = "Perfect! You're a genius!";
  } else if (percentage >= 80) {
    resultMessage.textContent = "Great job! You know your stuff!";
  } else if (percentage >= 60) {
    resultMessage.textContent = "Good effort! Keep learning!";
  } else if (percentage >= 40) {
    resultMessage.textContent = "Not bad! Try again to improve!";
  } else {
    resultMessage.textContent = "Keep studying! You'll get better!";
  }
}

function restartQuiz() {
  resultScreen.classList.remove("active");

  startQuiz();
}