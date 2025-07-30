import { header } from "../../components/header/header.js";
import { render } from "./render.js";

function addStyles() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '../style.css';
    document.head.appendChild(link);
}

export function renderQuizList(app) {
    addStyles();
    header(app);

    const quizHtml = `
        <div class="quiz-container">
            <div id="quiz"></div>
            <button class="btn hidden" id="nextBtn">Ответить</button>
            <button class="btn hidden" id="forwardBtn">Вперед</button>
            <button class="btn hidden" id="backBtn" onclick="goBack()">Назад</button>
            <div class="progress-container hidden" id="progressContainer">
                <div id="progressBar" class="progress-bar" style="width: 0%;"></div>
            </div>
            <div class="timer hidden" id="timer"></div>
            <div class="result" id="result"></div>
        </div>
    `;

    render(app, quizHtml);

    let timer;
    let totalTime; // Общее время на викторину
    let timeLeft; // Остаток времени

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
    quizContainer.classList.add('visible');

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
        
        totalTime = currentQuiz.questions.length * 60; // 60 секунд на вопрос
        timeLeft = totalTime;

        quizContainer.classList.add('visible');
        document.getElementById('nextBtn').classList.remove('hidden');
        document.getElementById('forwardBtn').classList.add('hidden');
        document.getElementById('backBtn').classList.add('hidden');
        document.getElementById('progressContainer').classList.add('visible');
        document.getElementById('timer').classList.add('visible');
        renderQuestion(currentQuiz);
        startTimer(); // Запускаем таймер
    };

    function renderQuestion(quiz) {
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

        updateButtonStates();
    }

    function updateButtonStates() {
        document.getElementById('backBtn').classList.toggle('hidden', currentQuestion === 0);
        document.getElementById('forwardBtn').classList.toggle('hidden', currentQuestion === currentQuiz.questions.length - 1);
    }

    function startTimer() {
        let timerDisplay = document.getElementById('timer');
        
        timerDisplay.textContent = `Осталось времени: ${timeLeft / 60} минут ${timeLeft % 60} секунд`;
        timer = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = `Осталось времени: ${Math.floor(timeLeft / 60)} минут ${timeLeft % 60} секунд`;

            if (timeLeft <= 0) {
                clearInterval(timer);
                timerDisplay.textContent = "Время истекло!";
                document.getElementById('nextBtn').disabled = true;
                alert('Время вышло!');
                showResult();
            }
        }, 1000);
    }

    let answeredQuestions = []; // Массив для отслеживания отвеченных вопросов

    function checkAnswer() {
        if (answeredQuestions[currentQuestion]) {
            alert('Вы уже ответили на этот вопрос.');
            return false;
        }

        document.getElementById('result').classList.remove('hidden');

        let isCorrect = false;
        let isPartiallyCorrect = false;

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
                isCorrect = true;
            }

            document.getElementById('result').innerHTML = isCorrect 
                ? `<span class="correct">Верно!</span>` 
                : `<span class="incorrect">Неверно!</span>`;

            answeredQuestions[currentQuestion] = true;

            setTimeout(() => {
                currentQuestion++;
                if (currentQuestion < currentQuiz.questions.length) {
                    renderQuestion(currentQuiz);
                } else {
                    showResult();
                }
            }, 1000);

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

            const allCorrectSelected = correctIndexes.every(idx => selected.includes(idx));
            const anyCorrectSelected = selected.some(idx => correctIndexes.includes(idx));

            if (allCorrectSelected) {
                score++;
                isCorrect = true;
            } else if (anyCorrectSelected) {
                isPartiallyCorrect = true;
            }

            if (isCorrect) {
                document.getElementById('result').innerHTML = `<span class="correct">Верно!</span>`;
            } else if (isPartiallyCorrect) {
                document.getElementById('result').innerHTML = `<span class="incorrect">Частично верно!</span>`;
            } else {
                document.getElementById('result').innerHTML = `<span class="incorrect">Неверно!</span>`;
            }

            answeredQuestions[currentQuestion] = true;

            setTimeout(() => {
                currentQuestion++;
                if (currentQuestion < currentQuiz.questions.length) {
                    renderQuestion(currentQuiz);
                } else {
                    showResult();
                }
            }, 1000);

            return true;
        }
    }

    function showResult() {
        clearInterval(timer);
        document.getElementById('timer').classList.remove('visible');
        document.getElementById('quiz').innerHTML = '';
        document.getElementById('nextBtn').classList.add('hidden');
        document.getElementById('forwardBtn').classList.add('hidden');
        document.getElementById('backBtn').classList.add('hidden');
        document.getElementById('progressContainer').classList.remove('visible');
        document.getElementById('result').classList.add('hidden');
        
        const resultHtml = `
            <h2>Результаты викторины</h2>
            <p>Красаучек, набрал ${score} балла из ${currentQuiz.questions.length}</p>
            <button onclick="goToQuizList()">К списку тестов</button>
        `;
        document.getElementById('quiz').innerHTML = resultHtml;
        answeredQuestions = []; 
        document.getElementById('nextBtn').disabled = false;
    }

    function updateProgressBar(totalQuestions) {
        const progressBar = document.getElementById('progressBar');
        const progressPercentage = ((currentQuestion + 1) / totalQuestions) * 100;
        progressBar.style.width = `${progressPercentage}%`;
    }
    
    document.getElementById('nextBtn').onclick = function () {
        if (!checkAnswer()) return;
        updateProgressBar(currentQuiz.questions.length);
    };

    document.getElementById('forwardBtn').onclick = function () {
        if (currentQuestion < currentQuiz.questions.length - 1) {
            currentQuestion++;
            renderQuestion(currentQuiz);
        }
    };

    window.goBack = function () {
        if (currentQuestion > 0) {
            currentQuestion--;
            renderQuestion(currentQuiz);
        } else {
            quizContainer.innerHTML = quizSelectionHtml;
            quizContainer.classList.add('visible');
            document.getElementById('nextBtn').classList.add('hidden');
            document.getElementById('backBtn').classList.add('hidden');
            document.getElementById('forwardBtn').classList.add('hidden');
            document.getElementById('progressContainer').classList.remove('visible');
        }
    };

    window.goToQuizList = function () {
        const progressBar = document.getElementById('progressBar');
        progressBar.style.width = '0%';
        quizContainer.innerHTML = quizSelectionHtml;
        quizContainer.classList.add('visible');
        document.getElementById('nextBtn').classList.add('hidden');
        document.getElementById('backBtn').classList.add('hidden');
        document.getElementById('forwardBtn').classList.add('hidden');
        document.getElementById('progressContainer').classList.remove('visible');
    };

    document.getElementById('solve_test').addEventListener('click', function(event) {
        event.preventDefault(); 
        goToQuizList();
        answeredQuestions = [];

        clearInterval(timer);
        document.getElementById('timer').classList.remove('visible');
    });
}