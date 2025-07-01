// components
import { renderQuizList } from "./utils/render/renderQuizes.js";

// utils
import {render} from "./utils/render/render.js";

import {getItem, setItem, updateItem, removeItem} from "./storage.js";
window.addEventListener("hashchange", e => {
    const pageName = location.hash.replace("#", "");
    processPage(pageName);
})
const application = document.getElementById('app');

const pages = {
    'home': {
        title: 'На главную',
        description: 'Основная страница конструктора',

    },
    'create_test': {
        title: 'Создать тест',
        description: 'Здесь вы можете создать свой тест',
    },

    'solve_test': {
        title: 'Список тестов',
        description: 'Здесь хранятся ваши тесты',
        appComponent: renderQuizList,
    }

}


export function processPage(pageName) {
    application.innerHTML = '';

    const page = pages[pageName] ?? pages.home;
    page.appComponent(application);

    // const title = document.createElement('h1');
    // const description = document.createElement('p');
    // title.textContent = page.title;
    // description.textContent = page.description;
    // application.appendChild(title);
    // application.appendChild(description);


}


processPage(location.hash.replace('#', ''));
setItem('quizes', [{id: "1", name:"Quiz 1", question: "What color is?"} , {id: "2", name:"Quiz 2", question: "What color is?"}])
const quiz = getItem('quizes');
console.log(quiz[0]);
