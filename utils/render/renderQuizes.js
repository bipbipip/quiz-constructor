import {header} from "../../components/header/header.js";
import {render} from "./render.js";

export function renderQuizList(app) {
    header(app);

    render(app, `
        <div class="container">
            <h1>Список тестов</h1>
            <div class="quiz-list">
                 
            </div>
        </div>
    `);
}