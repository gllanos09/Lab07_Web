(async () => {
  const payload = Auth.guard();
  if (!payload) return;

  const form = document.getElementById('profile-form');
  const errorBox = document.getElementById('form-error');
  const okBox = document.getElementById('form-success');

  try {
    const res = await Auth.fetchWithAuth('/api/users/me');
    const user = await res.json();

    document.getElementById('email').value = user.email || '';
    document.getElementById('name').value = user.name || '';
    document.getElementById('lastName').value = user.lastName || '';
    document.getElementById('phoneNumber').value = user.phoneNumber || '';
    document.getElementById('birthdate').value = user.birthdate ? user.birthdate.substring(0, 10) : '';
    document.getElementById('url_profile').value = user.url_profile || '';
    document.getElementById('address').value = user.address || '';
    document.getElementById('age').value = user.age != null ? user.age : '';
    document.getElementById('roles').textContent = (user.roles || []).join(', ');

    M.updateTextFields();
  } catch (err) {
    errorBox.textContent = 'No se pudo cargar el perfil';
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorBox.textContent = '';
    okBox.textContent = '';

    const body = {
      name: document.getElementById('name').value.trim(),
      lastName: document.getElementById('lastName').value.trim(),
      phoneNumber: document.getElementById('phoneNumber').value.trim(),
      birthdate: document.getElementById('birthdate').value,
      url_profile: document.getElementById('url_profile').value.trim(),
      address: document.getElementById('address').value.trim()
    };

    try {
      const res = await Auth.fetchWithAuth('/api/users/me', {
        method: 'PUT',
        body: JSON.stringify(body)
      });
      const data = await res.json();

      if (!res.ok) {
        errorBox.textContent = data.message || 'Error al actualizar';
        return;
      }

      document.getElementById('age').value = data.age != null ? data.age : '';
      okBox.textContent = 'Perfil actualizado correctamente';
    } catch (err) {
      errorBox.textContent = 'No se pudo conectar con el servidor';
    }
  });
})();
