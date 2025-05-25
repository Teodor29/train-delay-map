import auth from "../models/auth.js";
export default class SavedView extends HTMLElement {
    // connect component
    connectedCallback() {
        let flashMessage = "";

        if (auth.flash) {
            flashMessage = auth.flash;

            auth.flash = "";
        }

        let logout = "";

        if (sessionStorage.getItem("loggedIn")) {
            logout = `<a href="#login" id="logout">Logga ut</a>`;
        } else {
            window.location.hash = "login";
        }

        this.innerHTML = `
            <header class="header">
                <lager-title title="Home"></lager-title>
            </header>
            <main class="main container">
                <h1>Saved</h1>
                ${logout}
                <h3 class="flashMessage">${flashMessage}</h3>
                <button>
                    <img src="assets/img/saved.svg" alt="Spara">
                    Spara
                 </button>
            </main>
        `;

        const logoutButton = document.getElementById("logout");

        logoutButton.addEventListener("click", async () => {
            auth.logout();
            location.hash = "login";
        });
    }
}
