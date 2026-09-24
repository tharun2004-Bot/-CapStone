/*
  CareerRAG auth module — demo-only client-side auth using localStorage.
  Passwords are stored in plain text in the browser for prototype purposes.
  Swap signup()/login() to call your real backend (e.g. POST /api/auth/*)
  before shipping this anywhere real.
*/
const CareerRAG = (function () {
  const USERS_KEY = "careerrag_users";
  const SESSION_KEY = "careerrag_session";

  function getUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  }
  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function signup({ name, email, password }) {
    const users = getUsers();
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, error: "An account with that email already exists." };
    }
    users.push({ name, email, password });
    saveUsers(users);
    setSession({ name, email });
    return { ok: true };
  }

  function login({ email, password }) {
    const users = getUsers();
    const match = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!match) return { ok: false, error: "Email or password is incorrect." };
    setSession({ name: match.name, email: match.email });
    return { ok: true };
  }

  function setSession(session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }
  function getSession() {
    const s = localStorage.getItem(SESSION_KEY);
    return s ? JSON.parse(s) : null;
  }
  function logout() {
    localStorage.removeItem(SESSION_KEY);
    window.location.href = "login.html";
  }
  // Call on any page that requires a logged-in user; redirects if none.
  function requireAuth() {
    const s = getSession();
    if (!s) window.location.href = "login.html";
    return s;
  }

  return { signup, login, logout, getSession, requireAuth };
})();
