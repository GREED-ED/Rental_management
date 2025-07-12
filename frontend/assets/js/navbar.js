document.addEventListener('DOMContentLoaded', () => {
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));

let navbarHTML = `
  <nav class="navbar">
    <div class="nav-brand">
      <a href="index.html" class="brand-link">Bhadama</a>
    </div>
    <div class="nav-links">
      ${token && user ? `
        <a href="index.html" class="nav-link">Home</a>
        <a href="dashboard.html" class="nav-link">Dashboard</a>
        <div class="user-info">
          <span class="user-name" style="text-decoration:underline"> ${user.name}</span>
          <span class="user-type">${user.user_type}</span>
          <button onclick="logout()" class="logout-btn">Logout</button>
        </div>
      ` : `
        <a href="index.html" class="nav-link">Home</a>
        <a href="login.html" class="nav-link auth-link">Login</a>
        <a href="register.html" class="nav-link auth-link register">Register</a>
      `}
    </div>
  </nav>
`;
// console.log("TOKEN:", token);
// console.log("USER:", user);
const navbarDiv = document.getElementById('navbar');
if (navbarDiv) {
  navbarDiv.innerHTML = navbarHTML;
} else {
  console.warn("Navbar div not found!");
}
});
function logout() {
  localStorage.clear();
  window.location.href = 'index.html';
}