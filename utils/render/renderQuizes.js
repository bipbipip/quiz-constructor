import { header } from "../../components/header/header.js";
import { render } from "./render.js";

export function renderQuizList(app) {
  header(app);

  const quizHtml = `
    <div class="quiz-container">
        <div id="quiz" class="quiz-grid"></div>
        <button class="btn" id="nextBtn" style="display: none;">Ответить</button>
        <button class="btn" id="backBtn" style="display: none;" onclick="goBack()">Назад</button>
        <div class="result" id="result"></div>
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
          (quiz, index) => `
      <div class="quiz-card-container">
        <h2 class="quiz-card-name">${quiz.name}</h2>
        <p class="quiz-card-description">${quiz.description}</p>
        <button onclick="setupEditQuiz('${quiz.id}')">Изменить</button>
        <button onclick="startQuiz(${currentIndex + index})">Пройти тест</button>
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
        <button onclick="startQuiz(${index})">Пройти тест</button>
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

  // let currentQuestion = 0;
  // let score = 0;
  // let userAnswers = [];
  // let currentQuiz = null;
  //
  // window.startQuiz = function (index) {
  //   currentQuiz = quizzes[index];
  //   if (!currentQuiz) {
  //     alert("Ошибка: викторина не найдена.");
  //     return;
  //   }
  //
  //   currentQuestion = 0;
  //   score = 0;
  //   userAnswers = [];
  //
  //   document.getElementById("nextBtn").style.display = "block";
  //   document.getElementById("backBtn").style.display = "block";
  //
  //   renderQuestion(currentQuiz);
  // };
  //
  // function renderQuestion(quiz) {
  //   const question = quiz.questions[currentQuestion];
  //   if (!question) return;
  //
  //   let html = `
  //     <h2>${quiz.name}</h2>
  //     <p>${quiz.description}</p>
  //     <div class="question">${currentQuestion + 1}. ${question.text}</div>
  //     <div class="answers">
  //   `;
  //
  //   if (question.type === "detailed") {
  //     html += `<textarea id="detailedAnswer" placeholder="Введите ваш ответ"></textarea>`;
  //   } else {
  //     question.answers.forEach((answer, idx) => {
  //       const inputType = question.type === "multi" ? "checkbox" : "radio";
  //       html += `<label><input type="${inputType}" name="answer" value="${idx}"> ${answer.text}</label><br>`;
  //     });
  //   }
  //
  //   html += `</div>`;
  //
  //   document.getElementById("quiz").innerHTML = html;
  //   document.getElementById("result").textContent = "";
  //   document.getElementById("nextBtn").textContent =
  //     currentQuestion === quiz.questions.length - 1 ? "Завершить" : "Ответить";
  // }
  //
  // function checkAnswer() {
  //   if (currentQuiz.questions[currentQuestion].type === "detailed") {
  //     const detailedAnswer = document
  //       .getElementById("detailedAnswer")
  //       .value.trim();
  //     userAnswers[currentQuestion] = detailedAnswer;
  //
  //     if (detailedAnswer.length === 0) {
  //       alert("Пожалуйста, введите ответ.");
  //       return false;
  //     }
  //
  //     const correctAnswer =
  //       currentQuiz.questions[currentQuestion].answers[0].text;
  //
  //     if (detailedAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
  //       score++;
  //     }
  //
  //     return true;
  //   } else {
  //     const checkboxes = document.querySelectorAll('input[name="answer"]');
  //     let selected = Array.from(checkboxes)
  //       .filter((cb) => cb.checked)
  //       .map((cb) => Number(cb.value));
  //
  //     if (selected.length === 0) {
  //       alert("Выберите хотя бы один ответ.");
  //       return false;
  //     }
  //
  //     userAnswers[currentQuestion] = selected;
  //
  //     const correctIndexes = currentQuiz.questions[currentQuestion].answers
  //       .map((a, i) => (a.isCorrect ? i : null))
  //       .filter((i) => i !== null);
  //
  //     const isCorrect = selected.every((s) => correctIndexes.includes(s));
  //     if (isCorrect) score++;
  //     return true;
  //   }
  // }
  //
  // function showResult() {
  //   document.getElementById("quiz").innerHTML = "";
  //   document.getElementById("nextBtn").style.display = "none";
  //   document.getElementById("backBtn").style.display = "none";
  //
  //   const resultHtml = `
  //     <h2>Результаты викторины</h2>
  //     <p>Красаучек, набрал ${score} балла из ${currentQuiz.questions.length} </p>
  //     <button onclick="goToQuizList()">К списку тестов</button>
  //   `;
  //   document.getElementById("quiz").innerHTML = resultHtml;
  // }
  //
  // document.getElementById("nextBtn").onclick = function () {
  //   if (!checkAnswer()) return;
  //
  //   currentQuestion++;
  //   if (currentQuestion < currentQuiz.questions.length) {
  //     renderQuestion(currentQuiz);
  //   } else {
  //     showResult();
  //   }
  // };
  //
  // window.goBack = function () {
  //   if (currentQuestion > 0) {
  //     currentQuestion--;
  //     renderQuestion(currentQuiz);
  //   } else {
  //     currentIndex = 0;
  //     quizContainer.innerHTML = "";
  //     initialLoad();
  //     document.getElementById("nextBtn").style.display = "none";
  //     document.getElementById("backBtn").style.display = "none";
  //   }
  // };
  //
  // window.goToQuizList = function () {
  //   currentIndex = 0;
  //   quizContainer.innerHTML = "";
  //   initialLoad();
  //   document.getElementById("nextBtn").style.display = "none";
  //   document.getElementById("backBtn").style.display = "none";
  // };
}
