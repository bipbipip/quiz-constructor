import { render } from "../../utils/render/render.js";

export function header(app) {
  render(
    app,
    `
         <header class="header">
            <a href="#home">Главная меню</a>
            <a href="#create_test">Создать тест</a>
            <a href="#solve_test">Список тестов</a>
            <button id="themeToggle">Переключить тему</button>
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
