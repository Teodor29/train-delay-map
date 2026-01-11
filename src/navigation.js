import Router from "./router.js";

export default class Navigation extends HTMLElement {
  constructor() {
    super();

    this.router = new Router();
  }

  // connect component
  connectedCallback() {
    const routes = this.router.routes;

    let navigationLinks = "";

    for (let path in routes) {
      if (path !== "login" && path !== "register") {
        navigationLinks += `<a href='#${path}'>
                <img src="assets/img/${routes[path].icon}.svg" alt="icon" />
                ${routes[path].name}
                </a>`;
      }
    }

    this.innerHTML = `
        <nav class="nav-links">${navigationLinks}</nav>
        `;
  }
}
