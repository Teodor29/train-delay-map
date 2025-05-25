// core imports
import Router from "./router.js";
import Navigation from "./navigation.js";

// view imports
import HomeView from "./views/map.js";
import SavedView from "./views/saved.js";

// login components imports
import LoginForm from "./components/login-form.js";
import RegisterForm from "./components/register-form.js";

// map components imports
import Map from "./components/map.js";

// views
customElements.define("map-view", HomeView);
customElements.define("saved-view", SavedView);

// login components
customElements.define("login-form", LoginForm);
customElements.define("register-form", RegisterForm);

// core components
customElements.define("router-outlet", Router);
customElements.define("navigation-outlet", Navigation);

// map components
customElements.define("map-display", Map);
