// components
// import { renderQuizList } from "./utils/render/renderQuizes.js";
// import { renderCreateQuiz } from "./utils/render/renderCreateQuiz.js";
// import {renderHomePage} from "./utils/render/renderHome.js";

// utils
//import {render} from "./utils/render/render.js";

import { getItem, setItem, updateItem, removeItem } from "./storage.js";

window.addEventListener("hashchange", (e) => {
  const pageName = location.hash.replace("#", "");
  processPage(pageName);
});
const application = document.getElementById("app");

const pages = {
  home: {
    title: "На главную",
    description: "Основная страница конструктора",
    appComponent: () =>
      import("./utils/render/renderHome.js").then(
        (module) => module.renderHomePage,
      ),
  },
  create_test: {
    title: "Создать тест",
    description: "Здесь вы можете создать свой тест",
    appComponent: () =>
      import("./utils/render/renderCreateQuiz.js").then(
        (module) => module.renderCreateQuiz,
      ),
  },

  solve_test: {
    title: "Список тестов",
    description: "Здесь хранятся ваши тесты",
    appComponent: () =>
      import("./utils/render/renderQuizes.js").then(
        (module) => module.renderQuizList,
      ),
  },
};

export async function processPage(pageName) {
  application.innerHTML = "";

  const page = pages[pageName] ?? pages.home;
  const renderFunction = await page.appComponent();

  renderFunction(application);
}

// setItem('quizes', [{id: "1", name:"Quiz 1", question: "What color is?"} , {id: "2", name:"Quiz 2", question: "What color is?"}])
// const quiz = getItem('quizes');
// console.log(quiz[0]);
