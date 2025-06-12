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
                <h1>Sparade</h1>
                ${logout}
                <h3 class="flashMessage">${flashMessage}</h3>
                <saved-list></saved-list>
                <button class="btn-big bg-red" id="clear-fav">Rensa stationer</button>
            </main>
        `;

        document
            .getElementById("logout")
            .addEventListener("click", async () => {
                auth.logout();
                location.hash = "login";
            });

        document.getElementById("clear-fav").addEventListener("click", () => {
            if (confirm("Är du säker på att du vill ta bort alla sparade stationer?")) {
                localStorage.removeItem("savedStations");
                window.location.reload();
            }
        })

    }
}
