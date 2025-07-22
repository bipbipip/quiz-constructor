import { header } from "../../components/header/header.js";
import { render } from "./render.js";

export function renderQuizList(app) {
  header(app);

  const quizHtml = `
    <div class="quiz-container">
        <div id="quiz"></div>
        <button class="btn" id="nextBtn" style="display: none;">Ответить</button>
        <button class="btn" id="backBtn" style="display: none;" onclick="goBack()">Назад</button>
        <div class="progress-container" id="progressContainer" style="display: none;">
            <div id="progressBar" class="progress-bar" style="width: 0%;"></div>
        </div>
        <div class="result" id="result"></div>
    </div>
  `;

  render(app, quizHtml);

  function addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .progress-container {
        width: 20em;
        background-color: #eee;
        border-radius: 5px;
        height: 20px;
        margin: 10px 0;
      }
  
      .progress-bar {
        height: 100%;
        background-color: #f94dff; 
        border-radius: 5px;
        transition: width 0.3s;
      }
    `;
    document.head.appendChild(style);
  }

  const quizzes = Object.keys(localStorage)
    .filter(key => key.startsWith('quiz_'))
    .map(key => JSON.parse(localStorage.getItem(key)));

  const quizSelectionHtml = quizzes.map((quiz, index) => `
    <div>
      <button onclick="startQuiz(${index})">${quiz.name}</button>
    </div>
  `).join('');

  const quizContainer = document.getElementById('quiz');
  quizContainer.innerHTML = quizSelectionHtml;
  quizContainer.style.display = 'block';

  let currentQuestion = 0;
  let score = 0;
  let userAnswers = [];
  let currentQuiz = null;

  window.startQuiz = function (index) {
    currentQuiz = quizzes[index];
    if (!currentQuiz) {
      alert('Ошибка: викторина не найдена.');
      return;
    }

    currentQuestion = 0;
    score = 0;
    userAnswers = [];

    quizContainer.style.display = 'block';
    document.getElementById('nextBtn').style.display = 'block';
    document.getElementById('backBtn').style.display = 'block';
    document.getElementById('progressContainer').style.display = 'block';
    
    renderQuestion(currentQuiz);
  };

  function renderQuestion(quiz) {
    addStyles();
    const question = quiz.questions[currentQuestion];
    if (!question) return;

    let html = `
      <h2>${quiz.name}</h2>
      <p>${quiz.description}</p>
      <div class="question">${currentQuestion + 1}. ${question.text}</div>
      <div class="answers">
    `;
    
    if (question.type === "detailed") {
      html += `<textarea id="detailedAnswer" placeholder="Введите ваш ответ"></textarea>`;
    } else {
      question.answers.forEach((answer, idx) => {
        const inputType = question.type === 'multi' ? 'checkbox' : 'radio';
        html += `<label><input type="${inputType}" name="answer" value="${idx}"> ${answer.text}</label><br>`;
      });
    }

    html += `</div>`;
    document.getElementById('quiz').innerHTML = html;
    document.getElementById('result').textContent = '';

    document.getElementById('nextBtn').textContent = currentQuestion === quiz.questions.length - 1 ? 'Завершить' : 'Ответить';
  }

  function checkAnswer() {
    if (currentQuiz.questions[currentQuestion].type === "detailed") {
      const detailedAnswer = document.getElementById('detailedAnswer').value.trim();
      userAnswers[currentQuestion] = detailedAnswer;

      if (detailedAnswer.length === 0) {
        alert('Пожалуйста, введите ответ.');
        return false;
      }

      const correctAnswer = currentQuiz.questions[currentQuestion].answers[0].text;

      if (detailedAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
        score++;
      }

      return true;
    } else {
      const checkboxes = document.querySelectorAll('input[name="answer"]');
      let selected = Array.from(checkboxes).filter(cb => cb.checked).map(cb => Number(cb.value));

      if (selected.length === 0) {
        alert('Выберите хотя бы один ответ.');
        return false;
      }

      userAnswers[currentQuestion] = selected;

      const correctIndexes = currentQuiz.questions[currentQuestion].answers
        .map((a, i) => a.isCorrect ? i : null)
        .filter(i => i !== null);

      const isCorrect = selected.every(s => correctIndexes.includes(s));
      if (isCorrect) score++;
      return true;
    }
  }

  function showResult() {
    document.getElementById('quiz').innerHTML = '';
    document.getElementById('nextBtn').style.display = 'none';
    document.getElementById('backBtn').style.display = 'none';
    document.getElementById('progressContainer').style.display = 'none';
    
    const resultHtml = `
      <h2>Результаты викторины</h2>
      <p>Красаучек, набрал ${score} балла из ${currentQuiz.questions.length} </p>
      <button onclick="goToQuizList()">К списку тестов</button>
    `;
    document.getElementById('quiz').innerHTML = resultHtml;
  }

  function updateProgressBar(totalQuestions) {
    const progressBar = document.getElementById('progressBar');
    const progressPercentage = ((currentQuestion + 1) / totalQuestions) * 100;
    progressBar.style.width = `${progressPercentage}%`;
  }
  
  document.getElementById('nextBtn').onclick = function () {
    if (!checkAnswer()) return;
    updateProgressBar(currentQuiz.questions.length);
    currentQuestion++;
    if (currentQuestion < currentQuiz.questions.length) {
      renderQuestion(currentQuiz);
    } else {
      showResult();
    }
  };

  window.goBack = function () {
    if (currentQuestion > 0) {
      currentQuestion--;
      renderQuestion(currentQuiz);
    } else {
      quizContainer.innerHTML = quizSelectionHtml;
      quizContainer.style.display = 'block';
      document.getElementById('nextBtn').style.display = 'none';
      document.getElementById('backBtn').style.display = 'none';
      document.getElementById('progressContainer').style.display = 'none';
    }
  };

window.goToQuizList = function () {
  progressBar.style.width = '0%';
  quizContainer.innerHTML = quizSelectionHtml;
  quizContainer.style.display = 'block';
  document.getElementById('nextBtn').style.display = 'none';
  document.getElementById('backBtn').style.display = 'none';
  document.getElementById('progressContainer').style.display = 'none';
};

document.getElementById('solve_test').addEventListener('click', function(event) {
  event.preventDefault(); 
  goToQuizList();
});
}