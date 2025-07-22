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

  //Извлекает ключи из localStorage, фильтрует их по префиксу quiz_, а затем преобразует в объекты викторин с помощью JSON.parse
  const quizzes = Object.keys(localStorage)
    .filter(key => key.startsWith('quiz_'))
    .map(key => JSON.parse(localStorage.getItem(key)));

  // Отображение списка викторин
  const quizSelectionHtml = quizzes.map((quiz, index) => `
    <div class="quiz-card-container">
    <h2 class="quiz-card-name">${quiz.name}</h2>
    <p class="quiz-card-description">${quiz.description}</p>
      <button onclick="startQuiz(${index})">Пройти тест</button>
    </div>
  `).join('');


  //Находим элемент с ID quiz и добавляет в него HTML-код с кнопками викторин.
  const quizContainer = document.getElementById('quiz');
  quizContainer.innerHTML = quizSelectionHtml;
  // quizContainer.style.display = 'block';

  //Переменные состояния
  let currentQuestion = 0;
  let score = 0;
  let userAnswers = [];
  let currentQuiz = null;

  //Функция запускает викторину по индексу. Если викторина не найдена, выводится сообщение об ошибке.
  window.startQuiz = function (index) {
    currentQuiz = quizzes[index];
    if (!currentQuiz) {
      alert('Ошибка: викторина не найдена.');
      return;
    }

    currentQuestion = 0;
    score = 0;
    userAnswers = [];

    //Отображение текущего вопроса
    // quizContainer.style.display = 'block';
    document.getElementById('nextBtn').style.display = 'block';
    document.getElementById('backBtn').style.display = 'block';

    
    renderQuestion(currentQuiz);
  };

  //Загружаем текущий вопрос и проверяем, существует ли он.
  function renderQuestion(quiz) {
    const question = quiz.questions[currentQuestion];
    if (!question) return;

    let html = `
      <h2>${quiz.name}</h2>
      <p>${quiz.description}</p>
      <div class="question">${currentQuestion + 1}. ${question.text}</div>
      <div class="answers">
    `;
    
    //Обработка типов вопросов
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

        // Проверяем, что ответ не пустой
        if (detailedAnswer.length === 0) {
            alert('Пожалуйста, введите ответ.');
            return false; // Ответ не засчитывается
        }

        // Получаем правильный ответ из question.answers
        const correctAnswer = currentQuiz.questions[currentQuestion].answers[0].text;

        // Сравниваем введённый текст с правильным ответом
        if (detailedAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
            score++; // Увеличиваем счет, если ответ правильный
        }

        return true; // Возвращаем true, если проверка прошла
    } else {
        // Логика для других типов вопросов
        const checkboxes = document.querySelectorAll('input[name="answer"]');
        let selected = Array.from(checkboxes).filter(cb => cb.checked).map(cb => Number(cb.value));

        if (selected.length === 0) {
            alert('Выберите хотя бы один ответ.');
            return false; // Не выбраны ответы
        }

        userAnswers[currentQuestion] = selected;

        const correctIndexes = currentQuiz.questions[currentQuestion].answers
            .map((a, i) => a.isCorrect ? i : null)
            .filter(i => i !== null);

        const isCorrect = selected.every(s => correctIndexes.includes(s));
        if (isCorrect) score++; // Увеличиваем счет, если ответ правильный
        return true; // Возвращаем true, если проверка прошла
    }
}
  //Функция отображает результаты викторины и кнопку для возврата к списку тестов.
  function showResult() {
    document.getElementById('quiz').innerHTML = '';
    document.getElementById('nextBtn').style.display = 'none';
    document.getElementById('backBtn').style.display = 'none';
    
    const resultHtml = `
      <h2>Результаты викторины</h2>
      <p>Красаучек, набрал ${score} балла из ${currentQuiz.questions.length} </p>
      <button onclick="goToQuizList()">К списку тестов</button>
    `;
    document.getElementById('quiz').innerHTML = resultHtml;
  }

  //Кнопка ответить
  document.getElementById('nextBtn').onclick = function () {
    if (!checkAnswer()) return;

    currentQuestion++;
    if (currentQuestion < currentQuiz.questions.length) {
      renderQuestion(currentQuiz);
    } else {
      showResult();
    }
  };

  //Кнопка назад
  window.goBack = function () {
    if (currentQuestion > 0) {
      currentQuestion--; // Уменьшаем индекс текущего вопроса
      renderQuestion(currentQuiz); // Отображаем предыдущий вопрос
    } else {
      // Если мы на первом вопросе, возвращаемся к выбору викторины
      quizContainer.innerHTML = quizSelectionHtml; // Отображаем список викторин снова
      // quizContainer.style.display = 'block';
      document.getElementById('nextBtn').style.display = 'none';
      document.getElementById('backBtn').style.display = 'none';
    }
  };

  //Функция для возврата к списку викторин
  window.goToQuizList = function () {
    quizContainer.innerHTML = quizSelectionHtml; // Возвращаемся к списку викторин
    // quizContainer.style.display = 'block';
    document.getElementById('nextBtn').style.display = 'none';
    document.getElementById('backBtn').style.display = 'none';
  };
}
