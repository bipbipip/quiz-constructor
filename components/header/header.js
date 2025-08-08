import { render } from "../../utils/render/render.js";

export function header(app) {
  render(
    app,
    `
         <header class="header container">
         <section class="header-body">
            <a href="#menu" class="burger-menu">
            <img src="../../utils/images/burger-button.svg" alt="burger-menu icon">
            </a>
            <div class="menu-overlay" id="menu">
            
            <div class="header-burger-menu-stack">
                <a href="#home" class="header-link-burger">Главная меню</a>
                <a href="#create_test" class="header-link-burger">Создать тест</a>
                <a href="#solve_test" class="header-link-burger">Список тестов</a>
            </div>
            <div class="close-btn-container">
                <a href="#" class="close-btn">+</a>
            </div>    
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
