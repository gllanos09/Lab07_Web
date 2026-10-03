(async () => {
  const payload = Auth.guard(); // cualquier usuario autenticado (user o admin)
  if (!payload) return;

  try {
    const res = await Auth.fetchWithAuth('/api/users/me');
    const user = await res.json();
    document.getElementById('welcome-name').textContent = user.name || user.email;
    document.getElementById('welcome-email').textContent = user.email;
  } catch (err) {
    console.error(err);
  }
})();
