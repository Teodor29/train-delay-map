import auth from "../models/auth.js";

export default class RegisterForm extends HTMLElement {
    constructor() {
        super();
        this.user = {};
    }

    connectedCallback() {
        this.innerHTML = `
            <div class="container">
                <form action="" id="login-form">
                    <label>E-post</label>
                    <input type="email" id="email-input" required="required">
                    <label>Lösenord</label>
                    <input type="password" id="password-input" required="required">
                    <input type="submit" class="button btn-big" value="Registrera">
                    <a style="font-size: 1rem" href="#login">
                        Logga in
                    </a>
                    <p class="flashMessage" id="error-message"></p>
                </form>
            </div>
        `;
        this.init();
    }

    init() {
        const loginFormElement = document.getElementById("login-form");
        const emailInputElement = document.getElementById("email-input");
        const passwordInputElement = document.getElementById("password-input");
        const errorMessageElement = document.getElementById("error-message");

        loginFormElement.addEventListener("submit", async (event) => {
            event.preventDefault();
            this.user.email = emailInputElement.value;
            this.user.password = passwordInputElement.value;

            if (this.user.email && this.user.password) {
                let result = await auth.register(this.user);

                console.log("Result: ", result);

                if (result === "ok") {
                    location.hash = "login";
                }

                if (result === "user already exists") {
                    errorMessageElement.textContent = "Användaren finns redan";
                }
            }
        });

        emailInputElement.addEventListener("input", async (event) => {
            this.user = {
                ...this.user,
            };

            this.user.email = event.target.value;
        }
        );
        passwordInputElement.addEventListener("input", async (event) => {
            this.user = {
                ...this.user,
            };

            this.user.password = event.target.value;
        }
        );
    }
}
