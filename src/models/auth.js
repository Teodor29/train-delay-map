import { apiKey, authBaseURL } from "../utils.js";

const auth = {
  token: sessionStorage.getItem("token"),

  login: async function login(user) {
    try {
      const response = await fetch(`${authBaseURL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...user,
          api_key: apiKey,
        }),
      });

      if (response.status === 401) {
        return "Felaktigt användarnamn eller lösenord";
      }

      if (!response.ok) {
        return "Ett fel inträffade. Försök igen senare.";
      }

      const result = await response.json();

      sessionStorage.setItem("token", result.data.token);
      sessionStorage.setItem("loggedIn", true);

      return "ok";
    } catch (error) {
      console.error("Error: ", error);
    }
  },

  logout: function logout() {
    sessionStorage.removeItem("loggedIn");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("flash");
  },

  register: async function register(user) {
    try {
      const response = await fetch(`${authBaseURL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...user,
          api_key: apiKey,
        }),
      });

      if (response.status === 500) {
        return "user already exists";
      }

      if (response.status === 200) {
        return "not ok";
      }

      const result = await response.json();

      return "ok";
    } catch (error) {
      console.error("Error: ", error);
    }
  },
};
export default auth;
