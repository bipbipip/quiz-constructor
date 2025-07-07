import {header} from "../../components/header/header.js";
import {render} from "./render.js";

export function renderCreateQuiz(app) {
    header(app);

    render(app, `
        <div class="container">
            <h1>Создать тест</h1>
            <div class="create-quiz">
                <form  method="get">
                    <input type="text" id="key" name="quizName" placeholder="Название теста">
                    <input type="text" id="description" name="quizDescription" placeholder="Описание теста">
                    <select id="question-select" name="questions">
                        <option value="single">Одиночный ответ</option>
                        <option value="multi">Множественный ответ</option>
                        <option value="detailed">Развернутый ответ</option>
                    </select>
                    <input type="submit" id="send" name="sendQuiz">
                </form>
                
            </div>
        </div>
    `);
}
setTimeout(() => {
    const selectElement = document.getElementById("question-select");

    if (selectElement) {


        selectElement.addEventListener('change', function() {
            const newValue = this.value;


            switch (newValue) {
                case 'single':
                    console.log("Одиночный ответ");
                    break;
                case 'multi':
                    console.log("Множественный ответ");
                    break;
                case 'detailed':
                    console.log("Развернутый ответ");
                    break;
            }
        });
    }
}, 0);




