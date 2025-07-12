function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must login first');
      window.location.href = 'login.html';
    }
}

checkAuth();
  
function logout() {
    localStorage.clear();
    window.location.href = 'login.html';
}
  