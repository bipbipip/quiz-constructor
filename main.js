import {setItem, getItem, removeItem, clearStorage, updateItem} from "./storage.js";
window.addEventListener("hashchange", e => {
    const PageName = location.hash.replace("#", "");
    ProcessPage(PageName);
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
    }

}


function ProcessPage(PageName) {
    application.innerHTML = '';

    const page = pages[PageName] ?? pages.home;
    const title = document.createElement('h1');
    const description = document.createElement('p');
    title.textContent = page.title;
    description.textContent = page.description;
    application.appendChild(title);
    application.appendChild(description);
}

ProcessPage(location.hash.replace('#', ''));
setItem("quizes", {name: 'quiz 2', question: 'question description', answer1: 'answer', answer2: 'answer2'});
console.log(getItem('quizes'));

