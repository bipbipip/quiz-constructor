import { header } from "../../components/header/header.js";
import { render } from "./render.js";

export function renderQuizList(app) {
  header(app);

  const quizHtml = `
    <div id="quizSelection">
        <h1>Список тестов</h1>
        <button class="start" onclick="startQuiz(0)">Тест 1</button>
        <button class="start" onclick="startQuiz(1)">Тест 2</button>
        <button class="start" onclick="startQuiz(2)">Тест 3</button>
    </div>

    <div class="quiz-container">
        <div id="quiz" style="display: none;"></div>
        <button class="btn" id="nextBtn" style="display: none;">Ответить</button>
        <button class="btn" id="backBtn" style="display: none;" onclick="goBack()">Назад</button>
        <div class="result" id="result"></div>
    </div>
  `;

  render(app, quizHtml);

  // Вопросы
  const quizzes = [
    [
      {
        question: "Какой океан на Земле самый большой?",
        answers: [
          { text: "Тихий", correct: true },
          { text: "Атлантический", correct: false },
          { text: "Северно-Ледовитый", correct: false },
          { text: "Индийский", correct: false }
        ]
      },
      {
        question: "Какие функции у почек?",
        answers: [
          { text: "Удаление излишков жидкости", correct: true },
          { text: "Выработка гормонов", correct: true },
          { text: "Кровообращение", correct: false },
          { text: "Насыщение крови кислородом", correct: false }
        ]
      }
    ],
    [
      {
        question: "Может ли тинкер провести войду лазерную коррекцию зрения?",
        answers: [
          { text: "Да", correct: false },
          { text: "Нет", correct: false },
          { text: "Да, но только с вазелиновым шершавчиком впритирочку", correct: true }
        ]
      },
      {
        question: "Если использовать виспа как анальный шарик?",
        answers: [
          { text: "Порвется жопа", correct: true },
          { text: "Порвется тизер", correct: false }
        ]
      }
    ],
    [
      {
        question: "Кто гг ведьмака?",
        answers: [
          { text: "Геральт", correct: true },
          { text: "Весемир", correct: false },
          { text: "Цири", correct: false }
        ]
      },
      {
        question: "Сколько мечей у ведьмака?",
        answers: [
          { text: "2", correct: false },
          { text: "1", correct: false },
          { text: "3", correct: false },
          { text: "2 и 1", correct: true }
        ]
      }
    ]
  ];

  // Сохраняем квизы в хранилище
  if (!localStorage.getItem('quizzes')) {
    localStorage.setItem('quizzes', JSON.stringify(quizzes));
  }

  let currentQuestion = 0;
  let score = 0;
  let userAnswers = [];
  let quiz = [];

  // Функция для начала викторины
  window.startQuiz = function (index) {
    const quizzes = JSON.parse(localStorage.getItem('quizzes'));
    if (!quizzes || !quizzes[index]) {
      alert('Ошибка: викторина не найдена.');
      return;
    }
    quiz = quizzes[index];

    document.getElementById('quizSelection').style.display = 'none';
    document.getElementById('quiz').style.display = 'block';
    document.getElementById('nextBtn').style.display = 'block';
    document.getElementById('backBtn').style.display = 'block';

    currentQuestion = 0;
    score = 0;
    userAnswers = [];
    renderQuestion();
  };

  // Рендерим вопрос
  function renderQuestion() {
    const quizDiv = document.getElementById('quiz');
    const question = quiz[currentQuestion];
    if (!question) return;

    let html = `<div class="question">${currentQuestion + 1}. ${question.question}</div><div class="answers">`;
    question.answers.forEach((answer, idx) => {
      html += `<label><input type="checkbox" name="answer" value="${idx}"> ${answer.text}</label>`;
    });
    html += `</div>`;
    quizDiv.innerHTML = html;
    document.getElementById('result').textContent = '';
    document.getElementById('nextBtn').textContent = currentQuestion === quiz.length - 1 ? 'Завершить' : 'Ответить';
  }

  // Проверяем ответы
  function checkAnswer() {
    const checkboxes = document.querySelectorAll('input[name="answer"]');
    let selected = Array.from(checkboxes).filter(cb => cb.checked).map(cb => Number(cb.value));

    if (selected.length === 0) {
      alert('Выберите хотя бы один ответ.');
      return false;
    }
    userAnswers[currentQuestion] = selected;

    const correctIndexes = quiz[currentQuestion].answers
      .map((a, i) => a.correct ? i : null)
      .filter(i => i !== null);

    const isCorrect = selected.length === correctIndexes.length && selected.every(s => correctIndexes.includes(s));

    if (isCorrect) score++;
    return true;
  }

  // Показываем результат
  function showResult() {
    document.getElementById('quiz').innerHTML = '';
    document.getElementById('nextBtn').style.display = 'none';
    document.getElementById('result').textContent = `Правильно ${score} из ${quiz.length} вопросов.`;
  }

  // Работа кнопки ответа
  document.getElementById('nextBtn').onclick = function () {
    if (!checkAnswer()) return;

    currentQuestion++;
    if (currentQuestion < quiz.length) {
      renderQuestion();
    } else {
      showResult();
    }
  };

  // Функция для возврата к выбору викторины
  window.goBack = function () {
    document.getElementById('quizSelection').style.display = 'block';
    document.getElementById('quiz').style.display = 'none';
    document.getElementById('nextBtn').style.display = 'none';
    document.getElementById('backBtn').style.display = 'none';
  };
}