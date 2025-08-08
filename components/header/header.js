import { render } from "../../utils/render/render.js";

export function header(app) {
  render(
    app,
    `
         <header class="header container">
         <section class="header-body">
            <div class="header-menu">
            <a href="#home" class="header-link">Главная меню</a>
            <a href="#create_test" class="header-link">Создать тест</a>
            <a href="#solve_test" class="header-link">Список тестов</a>
            </div>
            <button id="themeToggle">Переключить тему</button>
            <a href="#menu" class="burger-menu"></a>
            </section>
        </header>
    `,
  );
  document.getElementById("themeToggle").addEventListener("click", toggleTheme);

  initTheme();
}
// Функция для переключения темы
function toggleTheme() {
  const htmlElement = document.documentElement;
  const currentTheme = htmlElement.getAttribute("data-theme");
  let newTheme = currentTheme === "dark" ? "light" : "dark";

  // Устанавливаем новую тему
  htmlElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
}

// Инициализация темы (при загрузке страницы)
function initTheme() {
  const savedTheme = localStorage.getItem("theme");
  console.log(savedTheme);
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  // Если тема сохранена в localStorage, используем её, иначе — системную
  const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
  document.documentElement.setAttribute("data-theme", initialTheme);
}
