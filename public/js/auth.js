const Auth = (() => {
  function getToken() {
    return sessionStorage.getItem('token');
  }

  function decode(token) {
    try {
      const payload = token.split('.')[1];
      const json = decodeURIComponent(
        atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
          .split('')
          .map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
          .join('')
      );
      return JSON.parse(json);
    } catch (e) {
      return null;
    }
  }

  function isValid(token) {
    const payload = decode(token);
    if (!payload || !payload.exp) return false;
    return payload.exp * 1000 > Date.now();
  }

  function logout() {
    sessionStorage.removeItem('token');
    window.location.href = '/signin';
  }

  // Protege páginas que requieren sesión iniciada (y opcionalmente un rol)
  function guard(requiredRole) {
    const token = getToken();
    if (!token || !isValid(token)) {
      logout();
      return null;
    }
    const payload = decode(token);
    if (requiredRole && !(payload.roles || []).includes(requiredRole)) {
      window.location.href = '/403';
      return null;
    }
    return payload;
  }

  async function fetchWithAuth(url, options = {}) {
    const token = getToken();
    const res = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (res.status === 401) {
      logout();
      throw new Error('Sesión expirada');
    }
    return res;
  }

  function setupNav() {
    const token = getToken();
    if (!token) return;
    const payload = decode(token);
    const isAdmin = payload && (payload.roles || []).includes('admin');
    document.querySelectorAll('#nav-admin-link, #nav-admin-link-mobile').forEach(el => {
      el.style.display = isAdmin ? 'list-item' : 'none';
    });
    document.querySelectorAll('#logout-btn, .logout-btn').forEach(el => {
      el.addEventListener('click', (e) => { e.preventDefault(); logout(); });
    });
  }

  return { getToken, decode, isValid, logout, guard, fetchWithAuth, setupNav };
})();

document.addEventListener('DOMContentLoaded', () => {
  if (typeof M !== 'undefined') {
    M.AutoInit();
  }
  Auth.setupNav();
});
