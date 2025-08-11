import { header } from "../../components/header/header.js";
import { render } from "./render.js";
import { setItem, getItem, updateItem, removeItem } from "../../storage.js";
import { footer } from "../../components/footer/footer.js";

export function renderCreateQuiz(app) {
  header(app);

  render(
    app,
    `
        <div class="create-intro full-page container">
          <div class="create">
              <h1 class="home-section-head">Создать тест</h1>
              <div class="create-quiz">
                  <form  method="get" class="create-quiz-form">
                      <input type="text" id="key" class="main-input-field" name="quizName" placeholder="Название теста">
                      <input type="text" id="description" class="main-input-field" name="quizDescription" placeholder="Описание теста">
                      <button type="button" class="quiz-button" id="addQuestionBtn">Добавить вопрос</button>
                      <div id="questionContainer" class="question-container"></div>
                      <button type="button" class="quiz-button" id="saveQuizBtn">Создать тест</button>
                  </form>
              </div>
          </div>
        </div>
    `,
  );
  footer(app);
  setupAddQuestion();
  setupSaveQuiz();
  setupAutoSave();
}

export function addQuestion() {
  const container = document.getElementById("questionContainer");
  const questionNumber = getRandomString(9); // Сохраняем текущий номер вопроса

  const questionWrapper = document.createElement("div");
  questionWrapper.className = "question-wrapper";
  questionWrapper.id = `question-${questionNumber}`;

  const questionFieldName = document.createElement("input");
  questionFieldName.type = "text";
  questionFieldName.placeholder = "Введите вопрос";
  questionFieldName.className = "main-input-field";
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
  deleteQuestion.className = "quiz-button";
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

export function setupAddQuestion() {
  const addQuestionBtn = document.getElementById("addQuestionBtn");
  if (addQuestionBtn) {
    addQuestionBtn.addEventListener("click", addQuestion);
  }
}

export function addAnswer(
  questionWrapper,
  questionNumber,
  answerType = "radio",
) {
  const answerContainer = document.createElement("div");
  answerContainer.className = "answer-container";
  console.log(answerType);
  const addAnswerBtn = document.createElement("button");
  addAnswerBtn.type = "button";
  addAnswerBtn.textContent = "Добавить вариант ответа";
  addAnswerBtn.className = "quiz-button";

  addAnswerBtn.onclick = function () {
    let answerCount = getRandomString(9);
    const answerWrapper = document.createElement("div");
    answerWrapper.className = "answer-wrapper";
    answerWrapper.id = `answer-${answerCount}`;

    const answerSection = document.createElement("div");
    answerSection.className = "answer-section";

    const answerInput = document.createElement("input");
    answerInput.type = "text";
    answerInput.className = "main-input-field";
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
    correctCheckbox.className = "checkbox";
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
    deleteAnswerBtn.className = "quiz-button";
    deleteAnswerBtn.textContent = "Удалить";
    deleteAnswerBtn.onclick = function () {
      answerWrapper.remove();
    };

    answerWrapper.appendChild(answerInput);
    answerSection.appendChild(document.createTextNode(" Правильный ответ: "));
    answerSection.appendChild(correctCheckbox);
    answerSection.appendChild(deleteAnswerBtn);
    answerWrapper.appendChild(answerSection);
    answerContainer.appendChild(answerWrapper);
  };

  // Добавляем начальный ответ
  addAnswerBtn.click();
  answerContainer.prepend(addAnswerBtn);
  questionWrapper.appendChild(answerContainer);
}

export function addDetailedAnswer(questionWrapper, questionNumber) {
  const answerContainer = document.createElement("div");
  answerContainer.className = "answer-container";

  const answerInput = document.createElement("textarea");
  answerInput.placeholder = "Поле для развернутого ответа";
  answerInput.className = "main-input-textarea";
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
  if (!validateQuiz()) {
    return null; // Прерываем сохранение если валидация не пройдена
  }
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
      //Здесь мзменена логика сохранение детаил вопросов
      const detailedAnswerText = wrapper.querySelector("textarea").value; // Получаем текст из текстового поля
      question.answers.push({
        text: detailedAnswerText,
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

  setupPreviewQuiz(quiz.id);

  return quiz;
}

window.setupPreviewQuiz = function (idQuiz) {
  window.location = `#preview_test/${idQuiz}/`;
};

export function setupSaveQuiz() {
  const saveQuizBtn = document.getElementById("saveQuizBtn");
  if (saveQuizBtn) {
    saveQuizBtn.addEventListener("click", () => {
      if (validateQuiz()) {
        saveQuiz();
      }
    });
  }
}

let autoSaveTimer;
export function setupAutoSave() {
  // Автосохранение при изменении формы
  document.addEventListener("input", function (event) {
    if (event.target.closest(".create-quiz-form")) {
      clearTimeout(autoSaveTimer);
      autoSaveTimer = setTimeout(autoSaveQuiz, 5000);
    }
  });

  // Восстановление при загрузке страницы
  const savedQuiz = getItem("auto_save_quiz");
  console.log("Загружены автосохранённые данные:", savedQuiz);

  if (savedQuiz) {
    // Даём время на рендеринг формы
    setTimeout(() => {
      const shouldRestore = confirm(
        "Найдены несохранённые данные. Восстановить?",
      );
      if (shouldRestore) {
        restoreAutoSaveQuiz(savedQuiz);
      } else {
        removeItem("auto_save_quiz");
      }
    }, 100); // Небольшая задержка для гарантии готовности DOM
  }
}

function autoSaveQuiz() {
  console.log("Автосохранение...");
  const quizNameInput = document.querySelector('input[name="quizName"]');
  const quizDescriptionInput = document.querySelector(
    'input[name="quizDescription"]',
  );

  if (!quizNameInput || !quizDescriptionInput) return; // Проверяем, что элементы существуют

  const quizName = quizNameInput.value || "";
  const quizDescription = quizDescriptionInput.value || "";

  const questions = [];
  const questionWrappers = document.querySelectorAll(".question-wrapper");

  questionWrappers.forEach((wrapper) => {
    const questionId = wrapper.id.replace("question-", "");
    const questionTextInput = wrapper.querySelector(
      'input[type="text"][placeholder="Введите вопрос"]',
    );
    const questionSelect = wrapper.querySelector("select.question-type");

    if (!questionTextInput || !questionSelect) return; // Пропускаем, если нет вопроса или типа

    const questionText = questionTextInput.value || "";
    const questionType = questionSelect.value || "single";

    const question = {
      id: questionId,
      text: questionText,
      type: questionType,
      answers: [],
    };

    if (questionType === "single" || questionType === "multi") {
      const answerWrappers = wrapper.querySelectorAll(".answer-wrapper");
      answerWrappers.forEach((answerWrapper) => {
        const answerTextInput =
          answerWrapper.querySelector('input[type="text"]');
        const correctInput = answerWrapper.querySelector(
          `input[type="${questionType === "single" ? "radio" : "checkbox"}"]`,
        );

        if (!answerTextInput || !correctInput) return;

        question.answers.push({
          text: answerTextInput.value || "",
          isCorrect: correctInput.checked,
        });
      });
    } else if (questionType === "detailed") {
      const answerTextarea = wrapper.querySelector("textarea");
      if (answerTextarea) {
        question.answers.push({
          text: answerTextarea.value || "",
          isCorrect: true,
        });
      }
    }

    questions.push(question);
  });

  const quiz = {
    name: quizName,
    description: quizDescription,
    questions: questions,
    lastSave: new Date().toISOString(),
  };

  setItem("auto_save_quiz", quiz);
}

//Функция восстановления недоделанного квиза
function restoreAutoSaveQuiz(savedQuiz) {
  if (!savedQuiz) return;

  // Восстанавливаем название и описание теста
  const quizNameInput = document.querySelector('input[name="quizName"]');
  const quizDescriptionInput = document.querySelector(
    'input[name="quizDescription"]',
  );

  if (quizNameInput) quizNameInput.value = savedQuiz.name || "";
  if (quizDescriptionInput)
    quizDescriptionInput.value = savedQuiz.description || "";

  // Очищаем контейнер вопросов
  const questionContainer = document.getElementById("questionContainer");
  if (!questionContainer) return;
  questionContainer.innerHTML = "";

  // Восстанавливаем вопросы последовательно
  restoreQuestionsSequentially(savedQuiz.questions || [], 0);
}
function restoreQuestionsSequentially(questions, index) {
  if (index >= questions.length) return;

  const question = questions[index];
  const addQuestionBtn = document.getElementById("addQuestionBtn");

  if (!addQuestionBtn) return;

  // Добавляем новый вопрос
  addQuestionBtn.click();

  // Ждем пока создастся DOM вопроса
  setTimeout(() => {
    const questionWrappers = document.querySelectorAll(".question-wrapper");
    const currentQuestionWrapper =
      questionWrappers[questionWrappers.length - 1];

    if (!currentQuestionWrapper) {
      restoreQuestionsSequentially(questions, index + 1);
      return;
    }

    // Устанавливаем ID вопроса
    if (question.id) currentQuestionWrapper.id = `question-${question.id}`;

    // Заполняем текст вопроса
    const questionInput = currentQuestionWrapper.querySelector(
      'input[type="text"][placeholder="Введите вопрос"]',
    );
    if (questionInput && question.text) questionInput.value = question.text;

    // Устанавливаем тип вопроса
    const questionSelect = currentQuestionWrapper.querySelector(
      "select.question-type",
    );
    if (questionSelect && question.type) {
      questionSelect.value = question.type;

      // Имитируем изменение типа с задержкой
      setTimeout(() => {
        const event = new Event("change");
        questionSelect.dispatchEvent(event);

        // После изменения типа заполняем ответы
        setTimeout(() => {
          restoreAnswers(currentQuestionWrapper, question);

          // Переходим к следующему вопросу
          restoreQuestionsSequentially(questions, index + 1);
        }, 100);
      }, 100);
    } else {
      restoreQuestionsSequentially(questions, index + 1);
    }
  }, 100);
}

function restoreAnswers(questionWrapper, question) {
  if (!question.answers || !question.answers.length) return;

  // Для вопросов с вариантами ответов
  if (question.type === "single" || question.type === "multi") {
    // Удаляем стандартный ответ (если есть)
    const defaultAnswer = questionWrapper.querySelector(".answer-wrapper");
    if (defaultAnswer) defaultAnswer.remove();

    // Добавляем сохраненные ответы
    restoreAnswersSequentially(
      questionWrapper,
      question.answers,
      0,
      question.type,
    );
  }
  // Для развернутого ответа
  else if (question.type === "detailed") {
    const answerTextarea = questionWrapper.querySelector("textarea");
    if (answerTextarea && question.answers[0]?.text) {
      answerTextarea.value = question.answers[0].text;
    }
  }
}

function restoreAnswersSequentially(
  questionWrapper,
  answers,
  index,
  questionType,
) {
  if (index >= answers.length) return;

  const answer = answers[index];
  const addAnswerBtn = questionWrapper.querySelector(
    ".answer-container > button",
  );

  if (!addAnswerBtn) return;

  // Добавляем новый вариант ответа
  addAnswerBtn.click();

  // Ждем пока создастся DOM ответа
  setTimeout(() => {
    const answerWrappers = questionWrapper.querySelectorAll(".answer-wrapper");
    const currentAnswerWrapper = answerWrappers[answerWrappers.length - 1];

    if (!currentAnswerWrapper) {
      restoreAnswersSequentially(
        questionWrapper,
        answers,
        index + 1,
        questionType,
      );
      return;
    }

    // Заполняем текст ответа
    const answerInput =
      currentAnswerWrapper.querySelector('input[type="text"]');
    if (answerInput && answer.text) answerInput.value = answer.text;

    // Устанавливаем правильный ответ
    const correctInput = currentAnswerWrapper.querySelector(
      `input[type="${questionType === "single" ? "radio" : "checkbox"}"]`,
    );
    if (correctInput) correctInput.checked = !!answer.isCorrect;

    // Переходим к следующему ответу
    restoreAnswersSequentially(
      questionWrapper,
      answers,
      index + 1,
      questionType,
    );
  }, 100);
}
export function validateQuiz() {
  highlightInvalidFields();
  // Проверка названия теста
  const quizName = document
    .querySelector('input[name="quizName"]')
    .value.trim();
  if (!quizName) {
    alert("Пожалуйста, введите название теста");
    return false;
  }

  // Проверка описания теста
  const quizDescription = document
    .querySelector('input[name="quizDescription"]')
    .value.trim();
  if (!quizDescription) {
    alert("Пожалуйста, введите описание теста");
    return false;
  }

  // Проверка наличия вопросов
  const questionWrappers = document.querySelectorAll(".question-wrapper");
  if (questionWrappers.length === 0) {
    alert("Добавьте хотя бы один вопрос");
    return false;
  }

  // Проверка каждого вопроса
  for (const wrapper of questionWrappers) {
    const questionText = wrapper
      .querySelector('input[type="text"][placeholder="Введите вопрос"]')
      .value.trim();
    if (!questionText) {
      alert("Пожалуйста, заполните текст вопроса");
      return false;
    }

    const questionType = wrapper.querySelector("select").value;
    const answerContainer = wrapper.querySelector(".answer-container");

    // Проверка ответов в зависимости от типа вопроса
    if (questionType === "single" || questionType === "multi") {
      const answerWrappers = wrapper.querySelectorAll(".answer-wrapper");
      if (answerWrappers.length <= 1) {
        alert("Добавьте хотя бы два варианта ответа");
        return false;
      }

      let hasCorrectAnswer = false;
      for (const answerWrapper of answerWrappers) {
        const answerText = answerWrapper
          .querySelector('input[type="text"]')
          .value.trim();
        if (!answerText) {
          alert("Пожалуйста, заполните текст варианта ответа");
          return false;
        }

        const correctInput = answerWrapper.querySelector(
          `input[type="${questionType === "single" ? "radio" : "checkbox"}"]`,
        );
        if (correctInput.checked) {
          hasCorrectAnswer = true;
        }
      }

      if (!hasCorrectAnswer) {
        alert("Укажите хотя бы один правильный ответ");
        return false;
      }
    } else if (questionType === "detailed") {
      const answerTextarea = wrapper.querySelector("textarea");
      if (!answerTextarea || answerTextarea.value.trim() === "") {
        alert("Пожалуйста, добавьте поле для развернутого ответа");
        return false;
      }
    }
  }

  return true;
}
function highlightInvalidFields() {
  // Сброс предыдущей подсветки
  document.querySelectorAll(".invalid-field").forEach((el) => {
    el.classList.remove("invalid-field");
  });

  // 1. Проверка основных полей теста
  const quizNameInput = document.querySelector('input[name="quizName"]');
  if (!quizNameInput.value.trim()) {
    quizNameInput.classList.add("invalid-field");
  }

  const quizDescriptionInput = document.querySelector(
    'input[name="quizDescription"]',
  );
  if (!quizDescriptionInput.value.trim()) {
    quizDescriptionInput.classList.add("invalid-field");
  }

  // 2. Проверка всех вопросов
  let hasQuestions = false;
  document.querySelectorAll(".question-wrapper").forEach((wrapper) => {
    hasQuestions = true;

    // Проверка текста вопроса
    const questionInput = wrapper.querySelector(
      'input[type="text"][placeholder="Введите вопрос"]',
    );
    if (!questionInput.value.trim()) {
      questionInput.classList.add("invalid-field");
    }

    // Получаем тип вопроса
    const questionTypeSelect = wrapper.querySelector("select.question-type");
    const questionType = questionTypeSelect.value;

    // 3. Проверка ответов в зависимости от типа вопроса
    if (questionType === "single" || questionType === "multi") {
      const answerWrappers = wrapper.querySelectorAll(".answer-wrapper");
      let hasAnswers = false;
      let hasCorrectAnswer = false;

      answerWrappers.forEach((answerWrapper) => {
        hasAnswers = true;

        // Проверка текста ответа
        const answerInput = answerWrapper.querySelector('input[type="text"]');
        if (!answerInput.value.trim()) {
          answerInput.classList.add("invalid-field");
        }

        // Проверка выбранного правильного ответа
        const correctInput = answerWrapper.querySelector(
          `input[type="${questionType === "single" ? "radio" : "checkbox"}"]`,
        );
        if (correctInput.checked) {
          hasCorrectAnswer = true;
        }
      });

      // Подсветка если нет ответов вообще
      if (!hasAnswers) {
        const addAnswerBtn = wrapper.querySelector(
          ".answer-container > button",
        );
        if (addAnswerBtn) addAnswerBtn.classList.add("invalid-field");
      }
    } else if (questionType === "detailed") {
      const answerTextarea = wrapper.querySelector("textarea");
      if (!answerTextarea || answerTextarea.value.trim() === "") {
        if (answerTextarea) {
          answerTextarea.classList.add("invalid-field");
        } else {
          const answerContainer = wrapper.querySelector(".answer-container");
          if (answerContainer) answerContainer.classList.add("invalid-field");
        }
      }
    }
  });

  if (!hasQuestions) {
    const addQuestionBtn = document.getElementById("addQuestionBtn");
    if (addQuestionBtn) addQuestionBtn.classList.add("invalid-field");
  }
}
