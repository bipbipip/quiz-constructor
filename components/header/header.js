import { render } from "../../utils/render/render.js";

export function header(app) {
  render(
    app,
    `
         <header class="header">
            <a href="#home">Главная меню</a>
            <a href="#create_test">Создать тест</a>
            <a href="#solve_test">Список тестов</a>
        </header>
    `,
  );
}
