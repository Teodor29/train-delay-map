export default class Router extends HTMLElement {
    constructor() {
        super();

        this.currentRoute = "";

        this.allRoutes = {
            "": {
                view: "<map-view></map-view>",
                name: "Karta",
                icon: "map",
            },
            saved: {
                view: "<saved-view></saved-view>",
                name: "Sparade",
                icon: "saved",
            },
            login: {
                view: "<login-form></login-form>",
                name: "Logga in",
            },
            register: {
                view: "<register-form></register-form>",
                name: "Registrera",
            },
        };
    }

    get routes() {
        return this.allRoutes;
    }

    // connect component
    connectedCallback() {
        window.addEventListener("hashchange", () => {
            this.resolveRoute();
        });

        this.resolveRoute();
    }

    resolveRoute() {
        this.currentRoute = location.hash.replace("#", "").split("/")[0];

        this.render();
    }

    render() {
        this.innerHTML = `
            <div class="route-container">
                <not-found></not-found>
            </div>
        `;

        if (this.routes[this.currentRoute]) {
            this.innerHTML = `
                <div class="route-container">
                    ${this.routes[this.currentRoute].view}
                </div>
            `;
        }

    }
}
