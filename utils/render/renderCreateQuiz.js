import { header } from "../../components/header/header.js";
import { render } from "./render.js";

export function renderCreateQuiz(app) {
  header(app);

  render(
    app,
    `
        <div class="container">
            <h1>Создать тест</h1>
            <div class="create-quiz">
                <form  method="get" class="create-quiz-form">
                    <input type="text" id="key" name="quizName" placeholder="Название теста">
                    <input type="text" id="description" name="quizDescription" placeholder="Описание теста">
                    <button type="button" id="addQuestionBtn">Добавить вопрос</button>
                    <div id="questionContainer"></div>
                    <input type="submit" id="send" name="sendQuiz">
                </form>
            </div>
        </div>
    `,
  );

  setupAddQuestion();
}

let currentQuestionNumber = 0;

function addQuestion() {
  const container = document.getElementById("questionContainer");
  const questionNumber = currentQuestionNumber; // Сохраняем текущий номер вопроса

  const questionWrapper = document.createElement("div");
  questionWrapper.className = "question-wrapper";
  questionWrapper.id = `question-${questionNumber}`;

  const questionFieldName = document.createElement("input");
  questionFieldName.type = "text";
  questionFieldName.placeholder = "Введите вопрос";
  questionFieldName.name = `question-${questionNumber}-text`;

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
        addSingleAnswer(questionWrapper, questionNumber);
        break;
      case "multi":
        addMultipleAnswer(questionWrapper, questionNumber);
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
  addSingleAnswer(questionWrapper, questionNumber);

  currentQuestionNumber++;
}

function setupAddQuestion() {
  const addQuestionBtn = document.getElementById("addQuestionBtn");
  if (addQuestionBtn) {
    addQuestionBtn.addEventListener("click", addQuestion);
  }
}

function addSingleAnswer(questionWrapper, questionNumber) {
  const answerContainer = document.createElement("div");
  answerContainer.className = "answer-container";

  const addAnswerBtn = document.createElement("button");
  addAnswerBtn.type = "button";
  addAnswerBtn.textContent = "Добавить вариант ответа";

  let answerCount = 0;

  addAnswerBtn.onclick = function () {
    const answerWrapper = document.createElement("div");
    answerWrapper.className = "answer-wrapper";

    const answerInput = document.createElement("input");
    answerInput.type = "text";
    answerInput.placeholder = "Вариант ответа";
    answerInput.name = `question-${questionNumber}-answer-${answerCount}-text`;

    const correctCheckbox = document.createElement("input");
    correctCheckbox.type = "radio";
    correctCheckbox.name = `question-${questionNumber}-answer`;

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

    answerCount++;
  };

  // Добавляем начальный ответ
  addAnswerBtn.click();

  answerContainer.appendChild(addAnswerBtn);
  questionWrapper.appendChild(answerContainer);
}

function addMultipleAnswer(questionWrapper, questionNumber) {
  // Аналогично addSingleAnswer, но можно выбирать несколько правильных ответов
  // Реализация похожа на addSingleAnswer
}

function addDetailedAnswer(questionWrapper, questionNumber) {
  const answerContainer = document.createElement("div");
  answerContainer.className = "answer-container";

  const answerInput = document.createElement("textarea");
  answerInput.placeholder = "Поле для развернутого ответа";
  answerInput.name = `question-${questionNumber}-answer`;
  answerInput.disabled = true;

  answerContainer.appendChild(answerInput);
  questionWrapper.appendChild(answerContainer);
}
