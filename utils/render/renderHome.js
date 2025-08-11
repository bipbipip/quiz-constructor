import { header } from "../../components/header/header.js";
import { render } from "./render.js";
import { footer } from "../../components/footer/footer.js";

export function renderHomePage(app) {
  header(app);
  render(
    app,
    `
    <section class="home-intro full-page container">
        <div class="home">
            <h1 class="home-section-head">Создавайте увлекательные квизы!</h1>
            <section class="home-section">
            <h2 class="home-section-subhead">Легкий и мощный конструктор квизов поможет вам:</h2>
                 <div class="home-section-intro">
                    <ul class="home-section-list">
                        <li class="home-section-list-item">Генерировать викторины, тесты и опросы без программирования</li>
                        <li class="home-section-list-item">Редактировать викторины, менять тип вопросов, их наполнение и тд.</li>
                        <li class="home-section-list-item">Сразу после создание теста можно просмотреть ее итоговый вид</li>
                        <li class="home-section-list-item">Анализировать результаты и вовлеченность аудитории</li>
                    </ul>
                </div>
            <h2 class="home-section-subhead">Кому подойдет наш конструктор?</h2>
                <div class="home-section-intro">
                  <ul class="home-section-list">
                          <li class="home-section-list-item">Преподавателям – для интерактивного обучения и проверки знаний</li>
                          <li class="home-section-list-item">Маркетологам – для вовлечения аудитории и сбора данных</li>
                          <li class="home-section-list-item">HR-специалистам – для тестирования сотрудников и кандидатов</li>
                          <li class="home-section-list-item">Блогерам и контент-мейкерам – для развлечения подписчиков</li>
                      </ul>
                </div>
                
            </section>
            
        </div>
    </section>
    `,
  );
  footer(app);
}
