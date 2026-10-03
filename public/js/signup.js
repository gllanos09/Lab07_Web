document.getElementById('signup-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const errorBox = document.getElementById('form-error');
  errorBox.textContent = '';

  const payload = {
    name: document.getElementById('name').value.trim(),
    lastName: document.getElementById('lastName').value.trim(),
    phoneNumber: document.getElementById('phoneNumber').value.trim(),
    birthdate: document.getElementById('birthdate').value,
    email: document.getElementById('email').value.trim(),
    password: document.getElementById('password').value
  };

  try {
    const res = await fetch('/api/auth/signUp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();

    if (!res.ok) {
      errorBox.textContent = data.message || 'Error al registrarse';
      return;
    }

    window.location.href = '/signin';
  } catch (err) {
    errorBox.textContent = 'No se pudo conectar con el servidor';
  }
});
