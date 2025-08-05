import { header } from "../../components/header/header.js";
import { render } from "./render.js";
import { getItem } from "../../storage.js";

// Функция для добавления стилей на страницу
function addStyles() {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "../style.css";
  document.head.appendChild(link);
}

export function renderPreviewQuiz(app) {
  header(app);
  addStyles(); // Добавляем стили

  const quizHtml = `
      <div class="quiz-body">
        <div class="quiz-container">
            <div id="quiz" class="preview-quiz"></div>
            <button class="btn hidden" id="backBtn" onclick="goBack()">Назад</button>
            <button class="btn hidden" id="toListBtn">К списку тестов</button>
            <button class="btn" id="forwardBtn">Вперед</button>
        </div>
      </div>
    `;

  render(app, quizHtml); // Рендерим HTML для теста
  setupPreviewQuiz();
}

// Функция для настройки теста
function setupPreviewQuiz() {
  const currentUrl = window.location.href; // Получаем текущий URL
  const parts = currentUrl.split("/"); // Разбиваем URL на части
  const quizId = parts[5] ? parts[5] : ""; // Извлекаем quizId из четвёртой части URL

  const quiz = getItem(`quiz_${quizId}`); // Получаем тест из localStorage

  // Если тест не найден
  if (!quiz) {
    alert("Тест не найден!");
    window.location.href = "/";
    return;
  }

  let currentQuestionIndex = 0; // Индекс текущего вопроса
  renderQuestion(quiz, currentQuestionIndex); // Рендерим первый вопрос

  // Обработчик для кнопки "Вперед"
  document.getElementById("forwardBtn").onclick = function () {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      currentQuestionIndex++; // Увеличиваем индекс вопроса
      renderQuestion(quiz, currentQuestionIndex); // Рендерим следующий вопрос
    } else {
      // На последнем вопросе скрываем кнопку "Вперед" и показываем "К списку тестов"
      document.getElementById("forwardBtn").classList.add("hidden");
      document.getElementById("toListBtn").classList.remove("hidden");
    }
  };

  // Функция для кнопки "Назад"
  window.goBack = function () {
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--; // Уменьшаем индекс вопроса
      renderQuestion(quiz, currentQuestionIndex); // Рендерим предыдущий вопрос
    }
  };

  // Обработчик для кнопки "К списку тестов"
  document.getElementById("toListBtn").onclick = function () {
    window.location.href = "#solve_test"; // Перенаправляем на страницу со списком тестов
  };
}

// Функция для рендеринга вопроса
function renderQuestion(quiz, index) {
  const question = quiz.questions[index]; // Получаем текущий вопрос
  const quizContainer = document.getElementById("quiz");

  if (!question) return; // Если вопрос не найден, ничего не делаем

  let html = `
        <h2>${quiz.name}</h2>
        <p>${quiz.description}</p>
        <div class="question">${index + 1}. ${question.text}</div>
        <div class="answers">
    `;

  // В зависимости от типа вопроса рендерим ответы
  if (question.type === "detailed") {
    html += `<textarea id="detailedAnswer" placeholder="Введите ваш ответ" disabled></textarea>`;
  } else {
    question.answers.forEach((answer, idx) => {
      const inputType = question.type === "multi" ? "checkbox" : "radio"; // Определяем тип input
      html += `
            <div class="checkbox">
                <input type="${inputType}" id="answer${idx}" name="answer" value="${idx}" />
                <label for="answer${idx}">${answer.text}</label>
            </div>
        `;
    });
  }

  html += `</div>`;
  quizContainer.innerHTML = html;

  updateButtonStates(quiz, index); // Обновляем состояние кнопок
}

// Функция для обновления состояния кнопок в зависимости от текущего вопроса
function updateButtonStates(quiz, index) {
  // Скрываем или показываем кнопку "Назад"
  document.getElementById("backBtn").classList.toggle("hidden", index === 0);

  // Скрываем кнопку "Вперед" на последнем вопросе и показываем кнопку "К списку тестов"
  document
    .getElementById("forwardBtn")
    .classList.toggle("hidden", index >= quiz.questions.length - 1);

  // Скрываем кнопку "К списку тестов", если мы не на последнем вопросе
  document
    .getElementById("toListBtn")
    .classList.toggle("hidden", index < quiz.questions.length - 1);
}

// Запускаем рендеринг теста после загрузки
document.addEventListener("DOMContentLoaded", () => {
  renderPreviewQuiz(app);
});
