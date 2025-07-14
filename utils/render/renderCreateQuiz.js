import { header } from "../../components/header/header.js";
import { render } from "./render.js";
import { setItem, getItem, updateItem, removeItem } from "../../storage.js";

export function renderCreateQuiz(app) {
  header(app);

  render(
    app,
    `
        <div class="container">
            <h1>Создать тест</h1>
            <div class="create-quiz">
                <form  method="get" class="create-quiz-form">
                    <input type="text" id="key" name="quizName" placeholder="Название теста" required>
                    <input type="text" id="description" name="quizDescription" placeholder="Описание теста" required>
                    <button type="button" id="addQuestionBtn">Добавить вопрос</button>
                    <div id="questionContainer"></div>
                    <input type="button" id="saveQuizBtn"  value="Создать тест">
                </form>
            </div>
        </div>
    `,
  );

  setupAddQuestion();
  setupSaveQuiz();
}

function addQuestion() {
  const container = document.getElementById("questionContainer");
  const questionNumber = getRandomString(9); // Сохраняем текущий номер вопроса

  const questionWrapper = document.createElement("div");
  questionWrapper.className = "question-wrapper";
  questionWrapper.id = `question-${questionNumber}`;

  const questionFieldName = document.createElement("input");
  questionFieldName.type = "text";
  questionFieldName.placeholder = "Введите вопрос";
  questionFieldName.name = `question-${questionNumber}-text`;
  questionFieldName.required = true;
  questionFieldName.addEventListener("input", function () {
    const questionValue = questionFieldName.value;
    console.log(`${questionWrapper.id}`, questionValue);
  });

  // Создание select
  const selectQuestion = document.createElement("select");
  selectQuestion.id = `question-select-${questionNumber}`;
  selectQuestion.className = "question-type";
  selectQuestion.name = `question-${questionNumber}-type`;

  const options = [
    { value: "single", text: "Одиночный ответ" },
    { value: "multi", text: "Множественный ответ" },
    { value: "detailed", text: "Развернутый ответ" },
  ];
  options.forEach((option) => {
    const optionElement = document.createElement("option");
    optionElement.value = option.value;
    optionElement.textContent = option.text;
    selectQuestion.appendChild(optionElement);
  });

  // Кнопка удаления
  const deleteQuestion = document.createElement("button");
  deleteQuestion.type = "button";
  deleteQuestion.textContent = "Удалить вопрос";
  deleteQuestion.onclick = function () {
    questionWrapper.remove();
  };

  // Обработчик изменения типа вопроса
  selectQuestion.addEventListener("change", function () {
    const answerContainer = questionWrapper.querySelector(".answer-container");
    if (answerContainer) answerContainer.remove();

    const newValue = this.value;
    switch (newValue) {
      case "single":
        addAnswer(questionWrapper, questionNumber, "radio");
        break;
      case "multi":
        addAnswer(questionWrapper, questionNumber, "checkbox");
        break;
      case "detailed":
        addDetailedAnswer(questionWrapper, questionNumber);
        break;
    }
  });

  questionWrapper.appendChild(selectQuestion);
  questionWrapper.appendChild(questionFieldName);
  questionWrapper.appendChild(deleteQuestion);
  container.appendChild(questionWrapper);

  // Добавляем контейнер для ответов по умолчанию (одиночный)
  addAnswer(questionWrapper, questionNumber, "radio");
}

function setupAddQuestion() {
  const addQuestionBtn = document.getElementById("addQuestionBtn");
  if (addQuestionBtn) {
    addQuestionBtn.addEventListener("click", addQuestion);
  }
}

function addAnswer(questionWrapper, questionNumber, answerType = "radio") {
  const answerContainer = document.createElement("div");
  answerContainer.className = "answer-container";
  console.log(answerType);
  const addAnswerBtn = document.createElement("button");
  addAnswerBtn.type = "button";
  addAnswerBtn.textContent = "Добавить вариант ответа";

  addAnswerBtn.onclick = function () {
    let answerCount = getRandomString(9);
    const answerWrapper = document.createElement("div");
    answerWrapper.className = "answer-wrapper";
    answerWrapper.id = `answer-${answerCount}`;

    const answerInput = document.createElement("input");
    answerInput.type = "text";
    answerInput.placeholder = "Вариант ответа";
    answerInput.required = true;
    answerInput.name = `question-${questionNumber}-answer-${answerCount}-text`;
    answerInput.addEventListener("input", function () {
      const answerValue = answerInput.value;
      console.log(`${answerWrapper.id}:`, answerValue);
    });

    const correctCheckbox = document.createElement("input");
    correctCheckbox.type = answerType;
    correctCheckbox.name = `question-${questionNumber}-answer`;
    correctCheckbox.value = "true";
    correctCheckbox.addEventListener("input", function () {
      const correctAnswer = document.querySelectorAll(
        `input[name=question-${questionNumber}-answer]`,
      );
      for (const f of correctAnswer) {
        if (f.checked) {
          console.log(`${answerWrapper.id}`, f.value);
        }
      }
    });

    const deleteAnswerBtn = document.createElement("button");
    deleteAnswerBtn.type = "button";
    deleteAnswerBtn.textContent = "Удалить";
    deleteAnswerBtn.onclick = function () {
      answerWrapper.remove();
    };

    answerWrapper.appendChild(answerInput);
    answerWrapper.appendChild(document.createTextNode(" Правильный ответ: "));
    answerWrapper.appendChild(correctCheckbox);
    answerWrapper.appendChild(deleteAnswerBtn);
    answerContainer.appendChild(answerWrapper);
  };

  // Добавляем начальный ответ
  addAnswerBtn.click();
  answerContainer.prepend(addAnswerBtn);
  questionWrapper.appendChild(answerContainer);
}

function addDetailedAnswer(questionWrapper, questionNumber) {
  const answerContainer = document.createElement("div");
  answerContainer.className = "answer-container";

  const answerInput = document.createElement("textarea");
  answerInput.placeholder = "Поле для развернутого ответа";
  answerInput.name = `question-${questionNumber}-answer`;

  answerContainer.appendChild(answerInput);
  questionWrapper.appendChild(answerContainer);
}
///////////////////
export function getRandomString(count) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < count; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export function saveQuiz() {
  // Получаем основные данные теста
  const quizName = document.querySelector('input[name="quizName"]').value;
  const quizDescription = document.querySelector(
    'input[name="quizDescription"]',
  ).value;

  // Собираем все вопросы
  const questions = [];
  const questionWrappers = document.querySelectorAll(".question-wrapper");

  questionWrappers.forEach((wrapper) => {
    const questionId = wrapper.id.replace("question-", "");
    const questionText = wrapper.querySelector('input[type="text"]').value;
    const questionType = wrapper.querySelector("select").value;

    const question = {
      id: questionId,
      text: questionText,
      type: questionType,
      answers: [],
    };

    // Собираем ответы в зависимости от типа вопроса
    if (questionType === "single" || questionType === "multi") {
      const answerWrappers = wrapper.querySelectorAll(".answer-wrapper");

      answerWrappers.forEach((answerWrapper) => {
        const answerId = answerWrapper.id.replace("answer-", "");
        const answerText =
          answerWrapper.querySelector('input[type="text"]').value;
        const isCorrect =
          questionType === "single"
            ? answerWrapper.querySelector('input[type="radio"]').checked
            : answerWrapper.querySelector('input[type="checkbox"]').checked;

        question.answers.push({
          id: answerId,
          text: answerText,
          isCorrect: isCorrect,
        });
      });
    } else if (questionType === "detailed") {
      question.answers.push({
        text: "",
        isCorrect: true,
      });
    }

    questions.push(question);
  });

  const quiz = {
    id: getRandomString(10),
    name: quizName,
    description: quizDescription,
    questions: questions,
    createdAt: new Date().toISOString(),
  };

  // Сохраняем в localStorage
  setItem(`quiz_${quiz.id}`, quiz);

  alert(`Тест "${quiz.name}" успешно сохранен!`);

  return quiz;
}
function setupSaveQuiz() {
  const saveQuizBtn = document.getElementById("saveQuizBtn");
  if (saveQuizBtn) {
    saveQuizBtn.addEventListener("click", saveQuiz);
  }
}
