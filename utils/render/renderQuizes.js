import { header } from "../../components/header/header.js";
import { render } from "./render.js";

export function renderQuizList(app) {
  header(app);

  const quizHtml = `
        <div class="quiz-container">
            <div id="quiz" class="quiz-grid"></div>
        </div>
    `;

  render(app, quizHtml);

  const quizzes = Object.keys(localStorage)
    .filter((key) => key.startsWith("quiz_"))
    .map((key) => JSON.parse(localStorage.getItem(key)));

  // Конфигурация для Intersection Observer
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.9,
  };

  const initialLoadCount = 6;
  const loadMoreCount = 6;
  let currentIndex = 0;
  let isLoading = false;
  let observer = null;

  const quizContainer = document.getElementById("quiz");
  const loader = document.getElementById("loader");

  // Создаем observer один раз
  function createObserver() {
    if (observer) observer.disconnect();

    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (
          entry.isIntersecting &&
          !isLoading &&
          currentIndex < quizzes.length
        ) {
          loadMoreQuizzes();
        }
      });
    }, observerOptions);

    // Наблюдаем за последним элементом
    const lastCard = document.querySelector(".quiz-card-container:last-child");
    if (lastCard) {
      observer.observe(lastCard);
    }
  }

  // Функция для загрузки дополнительных квизов
  function loadMoreQuizzes() {
    if (isLoading || currentIndex >= quizzes.length) {
      return;
    }

    isLoading = true;
    loader.style.display = "block";
    setTimeout(() => {
      const endIndex = Math.min(currentIndex + loadMoreCount, quizzes.length);
      const quizzesToShow = quizzes.slice(currentIndex, endIndex);

      const quizSelectionHtml = quizzesToShow
        .map(
          (quiz) => `
      <div class="quiz-card-container">
    <h2 class="quiz-card-name">${quiz.name}</h2>
    <p class="quiz-card-description">${quiz.description}</p>
    <button onclick="setupEditQuiz('${quiz.id}')">Изменить</button>
    <button onclick="setupPassQuiz('${quiz.id}')">Пройти тест</button>
  </div>
    `,
        )
        .join("");

      quizContainer.insertAdjacentHTML("beforeend", quizSelectionHtml);
      currentIndex = endIndex;
      isLoading = false;
      loader.style.display = "none";
      // Обновляем observer для нового последнего элемента
      createObserver();
    }, 2000);
  }

  window.setupPassQuiz = function (idQuiz) {
    console.log(idQuiz);
    window.location = `#pass_test/${idQuiz}/`;
  };

  // Начальная загрузка
  function initialLoad() {
    const endIndex = Math.min(initialLoadCount, quizzes.length);
    const quizzesToShow = quizzes.slice(0, endIndex);

    const quizSelectionHtml = quizzesToShow
      .map(
        (quiz, index) => `
      <div class="quiz-card-container">
    <h2 class="quiz-card-name">${quiz.name}</h2>
    <p class="quiz-card-description">${quiz.description}</p>
    <button onclick="setupEditQuiz('${quiz.id}')">Изменить</button>
    <button onclick="setupPassQuiz('${quiz.id}')">Пройти тест</button>
  </div>
    `,
      )
      .join("");

    quizContainer.innerHTML = quizSelectionHtml;
    currentIndex = endIndex;

    // Создаем observer после начальной загрузки
    createObserver();
  }

  initialLoad();

  window.setupEditQuiz = function (idQuiz) {
    window.location = `#edit_test/${idQuiz}/`;
  };
}
