(async () => {
  const payload = Auth.guard('admin');
  if (!payload) return;

  const tbody = document.getElementById('users-tbody');
  let users = [];

  try {
    const res = await Auth.fetchWithAuth('/api/users');
    users = await res.json();

    tbody.innerHTML = users.map(u => `
      <tr>
        <td>${u.name || ''} ${u.lastName || ''}</td>
        <td>${u.email}</td>
        <td>${u.phoneNumber || '-'}</td>
        <td>${(u.roles || []).join(', ')}</td>
        <td>${u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}</td>
        <td><a class="btn-small waves-effect waves-light view-user" data-id="${u.id}">Ver</a></td>
      </tr>
    `).join('');

    tbody.querySelectorAll('.view-user').forEach(btn => {
      btn.addEventListener('click', () => {
        const user = users.find(u => u.id === btn.dataset.id);
        showUserModal(user);
      });
    });
  } catch (err) {
    console.error(err);
  }

  function showUserModal(user) {
    document.getElementById('modal-user-name').textContent = `${user.name || ''} ${user.lastName || ''}`;
    document.getElementById('modal-user-email').textContent = user.email;
    document.getElementById('modal-user-phone').textContent = user.phoneNumber || '-';
    document.getElementById('modal-user-birthdate').textContent = user.birthdate ? new Date(user.birthdate).toLocaleDateString() : '-';
    document.getElementById('modal-user-age').textContent = user.age != null ? user.age : '-';
    document.getElementById('modal-user-address').textContent = user.address || '-';
    document.getElementById('modal-user-roles').textContent = (user.roles || []).join(', ');

    const modalEl = document.getElementById('user-modal');
    const instance = M.Modal.getInstance(modalEl) || M.Modal.init(modalEl);
    instance.open();
  }
})();
