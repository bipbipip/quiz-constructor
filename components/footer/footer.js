import { render } from "../../utils/render/render.js";

export function footer(app) {
  render(
    app,
    `
          <footer class="footer container">
            <section class="footer-body">
             <p class="footer-paragraph">Проект создан в рамках обучения и не несет коммерческой цели.</p>
             <p class="footer-paragraph">Разработчики: Шерешик Илья, Хоухлянцев Кирилл.</p>
            </section>
          </footer>
        `,
  );
}
