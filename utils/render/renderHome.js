import { header } from "../../components/header/header.js";
import { render } from "./render.js";

export function renderHomePage(app) {
  header(app);
  render(
    app,
    `
        <div class="container">
            <h1>Домашняя страница</h1>
            <div class="create-quiz">
                 
            </div>
        </div>
    `,
  );
}
