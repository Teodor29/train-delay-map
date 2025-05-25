import auth from "../models/auth.js";

export default class LoginForm extends HTMLElement {
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
                <input type="submit" class="button btn-big" value="Logga in">
                <a style="font-size: 1rem" href="#register">
                    Registrera
                </a>
            </form>
        </div>
        `;
        this.init();
    }

    init() {
        const loginFormElement = document.getElementById('login-form');
        const emailInputElement = document.getElementById('email-input');
        const passwordInputElement = document.getElementById('password-input');

        loginFormElement.addEventListener('submit', async (event) => {
            event.preventDefault();
            this.user.email = emailInputElement.value;
            this.user.password = passwordInputElement.value;

            if (this.user.email && this.user.password) {
                console.log("this.user: ", this.user);
                let result = await auth.login(this.user);

                console.log("Result: ", result);

                if (result === "ok") {
                    location.hash = "saved";
                }
            }
        });

        emailInputElement.addEventListener('input', async (event) => {
            this.user = {
                ...this.user,
            };

            this.user.email = event.target.value;
        });

        passwordInputElement.addEventListener('input', async (event) => {
            this.user = {
                ...this.user,
            };

            this.user.password = event.target.value;
        });
    }
}

