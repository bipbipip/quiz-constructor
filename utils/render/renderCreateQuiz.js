import {header} from "../../components/header/header.js";
import {render} from "./render.js";

export function renderCreateQuiz(app) {
    header(app);

    render(app, `
        <div class="container">
            <h1>Создать тест</h1>
            <div class="create-quiz">
                 
            </div>
        </div>
    `);
}