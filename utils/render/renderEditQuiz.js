import { header } from "../../components/header/header.js";
import { render } from "./render.js";
import { setItem, getItem, updateItem, removeItem } from "../../storage.js";
import {
  addQuestion,
  setupAddQuestion,
  addAnswer,
  addDetailedAnswer,
  getRandomString,
  validateQuiz,
  setupSaveQuiz,
} from "./renderCreateQuiz.js";

export function renderEditQuiz(app) {
  header(app);

  render(
    app,
    `
        <div class="container">
            <h1>Изменить тест</h1>
            <div class="create-quiz">
                <form method="get" class="create-quiz-form">
                    <input type="text" id="key" name="quizName" placeholder="Название теста">
                    <input type="text" id="description" name="quizDescription" placeholder="Описание теста">
                    <button type="button" id="addQuestionBtn">Добавить вопрос</button>
                    <div id="questionContainer"></div>
                    <button type="button" id="saveQuizBtn">Сохранить изменения</button>
                </form>
            </div>
        </div>
    `,
  );

  setupEditQuiz();
}

function setupEditQuiz() {
  const currentUrl = window.location.href;
  const idQuiz = currentUrl.split("/")[5];
  const quiz = getItem(`quiz_${idQuiz}`);

  if (!quiz) {
    alert("Тест не найден!");
    window.location.href = `#solve_test`;
    return;
  }

  // Заполняем основные поля
  document.querySelector('input[name="quizName"]').value = quiz.name;
  document.querySelector('input[name="quizDescription"]').value =
    quiz.description;

  // Настраиваем обработчики
  setupAddQuestion();
  setupSaveQuizForEdit(idQuiz);

  // Восстанавливаем вопросы
  restoreQuizQuestions(quiz.questions);
}

function setupSaveQuizForEdit(quizId) {
  const saveQuizBtn = document.getElementById("saveQuizBtn");
  if (saveQuizBtn) {
    saveQuizBtn.addEventListener("click", () => {
      if (validateQuiz()) {
        updateQuiz(quizId);
      }
    });
  }
}

function updateQuiz(quizId) {
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
      const detailedAnswerText = wrapper.querySelector("textarea").value;
      question.answers.push({
        text: detailedAnswerText,
        isCorrect: true,
      });
    }

    questions.push(question);
  });

  // Получаем текущий квиз из localStorage
  const existingQuiz = getItem(`quiz_${quizId}`);
  if (!existingQuiz) {
    alert("Ошибка: тест не найден!");
    return;
  }

  // Создаем обновленный квиз
  const updatedQuiz = {
    ...existingQuiz, // Сохраняем все существующие поля
    name: quizName,
    description: quizDescription,
    questions: questions,
    updatedAt: new Date().toISOString(),
  };

  // Сохраняем обновленный квиз
  try {
    // Используем updateItem с правильным callback
    updateItem(`quiz_${quizId}`, (existingItem) => {
      // Парсим существующий item
      const parsedItem = JSON.parse(existingItem);
      // Возвращаем обновленную версию
      return JSON.stringify({
        ...parsedItem,
        name: quizName,
        description: quizDescription,
        questions: questions,
        updatedAt: new Date().toISOString(),
      });
    });

    alert(`Тест "${updatedQuiz.name}" успешно обновлен!`);
    window.location.href = `#solve_test`;
  } catch (e) {
    console.error("Ошибка при сохранении теста:", e);
    alert("Произошла ошибка при сохранении теста");
  }
}

function restoreQuizQuestions(questions) {
  const questionContainer = document.getElementById("questionContainer");
  if (!questionContainer) return;

  questionContainer.innerHTML = "";

  questions.forEach((question) => {
    // Создаем структуру вопроса вручную, а не через click()
    const questionWrapper = document.createElement("div");
    questionWrapper.className = "question-wrapper";
    questionWrapper.id = `question-${question.id || getRandomString(9)}`;

    // Создаем элементы вопроса
    const questionFieldName = document.createElement("input");
    questionFieldName.type = "text";
    questionFieldName.placeholder = "Введите вопрос";
    questionFieldName.name = `${questionWrapper.id}-text`;
    questionFieldName.value = question.text || "";
    questionFieldName.required = true;

    // Создаем select для типа вопроса
    const selectQuestion = document.createElement("select");
    selectQuestion.className = "question-type";
    selectQuestion.name = `${questionWrapper.id}-type`;

    const options = [
      { value: "single", text: "Одиночный ответ" },
      { value: "multi", text: "Множественный ответ" },
      { value: "detailed", text: "Развернутый ответ" },
    ];

    options.forEach((option) => {
      const optionElement = document.createElement("option");
      optionElement.value = option.value;
      optionElement.textContent = option.text;
      if (option.value === question.type) {
        optionElement.selected = true;
      }
      selectQuestion.appendChild(optionElement);
    });

    // Кнопка удаления вопроса
    const deleteQuestion = document.createElement("button");
    deleteQuestion.type = "button";
    deleteQuestion.textContent = "Удалить вопрос";
    deleteQuestion.onclick = function () {
      questionWrapper.remove();
    };

    // Добавляем элементы в вопрос
    questionWrapper.appendChild(selectQuestion);
    questionWrapper.appendChild(questionFieldName);
    questionWrapper.appendChild(deleteQuestion);

    // Добавляем контейнер для ответов
    const answerContainer = document.createElement("div");
    answerContainer.className = "answer-container";
    questionWrapper.appendChild(answerContainer);

    // Добавляем вопрос в контейнер
    questionContainer.appendChild(questionWrapper);

    // Восстанавливаем ответы сразу, без ожидания событий
    restoreQuestionAnswers(questionWrapper, question);

    // Инициируем событие change для правильного отображения
    const event = new Event("change");
    selectQuestion.dispatchEvent(event);
  });
}

function restoreQuestionAnswers(questionWrapper, question) {
  const answerContainer = questionWrapper.querySelector(".answer-container");
  if (!answerContainer) return;

  // Очищаем контейнер, но сохраняем кнопку добавления
  const addBtn = answerContainer.querySelector("button");
  answerContainer.innerHTML = "";
  if (addBtn) {
    answerContainer.appendChild(addBtn);
  }

  // Для вопросов с вариантами ответов
  if (question.type === "single" || question.type === "multi") {
    // Создаем кнопку добавления ответов, если ее нет
    if (!addBtn) {
      const addAnswerBtn = document.createElement("button");
      addAnswerBtn.type = "button";
      addAnswerBtn.textContent = "Добавить вариант ответа";
      addAnswerBtn.onclick = function () {
        addNewAnswer(questionWrapper, question.type);
      };
      answerContainer.appendChild(addAnswerBtn);
    }

    // Восстанавливаем каждый ответ
    if (question.answers && question.answers.length > 0) {
      question.answers.forEach((answer) => {
        addNewAnswer(questionWrapper, question.type, answer);
      });
    } else {
      // Добавляем пустой ответ по умолчанию
      addNewAnswer(questionWrapper, question.type);
    }
  }
  // Для развернутого ответа
  else if (question.type === "detailed") {
    const answerTextarea = document.createElement("textarea");
    answerTextarea.placeholder = "Поле для развернутого ответа";
    answerTextarea.name = `${questionWrapper.id}-answer`;
    if (question.answers && question.answers[0]?.text) {
      answerTextarea.value = question.answers[0].text;
    }
    answerContainer.appendChild(answerTextarea);
  }
}

function addNewAnswer(questionWrapper, questionType, answerData = null) {
  const answerContainer = questionWrapper.querySelector(".answer-container");
  if (!answerContainer) return;

  const answerWrapper = document.createElement("div");
  answerWrapper.className = "answer-wrapper";
  answerWrapper.id = `answer-${answerData?.id || getRandomString(9)}`;

  // Поле для текста ответа
  const answerInput = document.createElement("input");
  answerInput.type = "text";
  answerInput.placeholder = "Вариант ответа";
  answerInput.required = true;
  answerInput.name = `${questionWrapper.id}-answer-${answerWrapper.id}-text`;
  if (answerData?.text) {
    answerInput.value = answerData.text;
  }

  // Чекбокс/радио для правильного ответа
  const correctInput = document.createElement("input");
  correctInput.type = questionType === "single" ? "radio" : "checkbox";
  correctInput.name = `${questionWrapper.id}-correct-answer`;
  if (answerData?.isCorrect) {
    correctInput.checked = true;
  }

  // Кнопка удаления ответа
  const deleteAnswerBtn = document.createElement("button");
  deleteAnswerBtn.type = "button";
  deleteAnswerBtn.textContent = "Удалить";
  deleteAnswerBtn.onclick = function () {
    answerWrapper.remove();
  };

  // Собираем ответ
  answerWrapper.appendChild(answerInput);
  answerWrapper.appendChild(document.createTextNode(" Правильный ответ: "));
  answerWrapper.appendChild(correctInput);
  answerWrapper.appendChild(deleteAnswerBtn);

  // Находим кнопку добавления ответа
  const addBtn = answerContainer.querySelector("button");

  // Безопасная вставка - либо перед кнопкой, либо в конец контейнера
  try {
    if (addBtn && addBtn.parentNode === answerContainer) {
      answerContainer.insertBefore(answerWrapper, addBtn);
    } else {
      answerContainer.appendChild(answerWrapper);
    }
  } catch (e) {
    console.error("Ошибка при добавлении ответа:", e);
    answerContainer.appendChild(answerWrapper);
  }
}
