import { render } from "../../utils/render/render.js";

export function header(app) {
  render(
    app,
    `
         <header class="header container">
         <section class="header-body">
         <div class="burger-menu">
            <input type="checkbox" id="burger-checkbox" class="burger-checkbox"> 
            <label for="burger-checkbox" class="burger"></label>
            <ul class="menu-list">
                <li><a href="#home" class="menu-item">Главная</a><li>
                <li><a href="#create_test" class="menu-item">Создать тест</a><li>
                <li><a href="#solve_test" class="menu-item">Список тестов</a><li>
            </ul>
        </div>

            <div class="header-menu">
                <a href="#home" class="header-link">Главная меню</a>
                <a href="#create_test" class="header-link">Создать тест</a>
                <a href="#solve_test" class="header-link">Список тестов</a>
            </div>
                <button id="themeToggle">Переключить тему</button>
            
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
