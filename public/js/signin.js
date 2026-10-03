document.getElementById('signin-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const errorBox = document.getElementById('form-error');
  errorBox.textContent = '';

  try {
    const res = await fetch('/api/auth/signIn', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();

    if (!res.ok) {
      errorBox.textContent = data.message || 'Error al iniciar sesión';
      return;
    }

    sessionStorage.setItem('token', data.token);
    const payload = Auth.decode(data.token);
    const roles = payload.roles || [];

    window.location.href = roles.includes('admin') ? '/dashboard/admin' : '/dashboard/user';
  } catch (err) {
    errorBox.textContent = 'No se pudo conectar con el servidor';
  }
});

// Si ya hay un token válido, evitar mostrar el login de nuevo
(() => {
  const token = Auth.getToken();
  if (token && Auth.isValid(token)) {
    const payload = Auth.decode(token);
    window.location.href = (payload.roles || []).includes('admin') ? '/dashboard/admin' : '/dashboard/user';
  }
})();
