const qs = sel => document.querySelector(sel);
const qsa = sel => Array.from(document.querySelectorAll(sel));

function showForm(id) {
  qsa('.form-box').forEach(el => el.classList.remove('active'));
  const el = qs(`#${id}`);
  if (el) el.classList.add('active');
  const firstInput = el.querySelector('input');
  if (firstInput) firstInput.focus();
}

function showMessage(containerSelector, text, type = '') {
  const el = qs(containerSelector);
  if (!el) return;
  el.textContent = text;
  el.classList.remove('error', 'success');
  if (type) el.classList.add(type);
}

// Mostrar/ocultar contraseña
function initPasswordToggles() {
  qsa('.password-box .toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.closest('.password-box').querySelector('input');
      const icon = btn.querySelector('i');
      if (!input || !icon) return;

      if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
      } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
      }
    });
  });
}

// Validaciones
function validateRegistration(data) {
  const errors = [];
  if (!data.nombre || data.nombre.trim().length < 2) errors.push('Ingrese un nombre válido.');
  if (!data.apellido || data.apellido.trim().length < 2) errors.push('Ingrese un apellido válido.');
  if (!/^\d+$/.test(data.cedula || '')) errors.push('Cédula debe ser numérica.');
  if (!data.nacimiento) errors.push('Ingrese fecha de nacimiento.');
  if (!data.usuario || data.usuario.trim().length < 3) errors.push('Usuario debe tener al menos 3 caracteres.');
  if (!data.password || data.password.length < 8) errors.push('Contraseña debe tener al menos 8 caracteres.');
  return errors;
}

// API: Registro
async function registerUser(data) {
  try {
    const res = await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        usuario: data.usuario,
        password: data.password
      })
    });

    const json = await res.json();

    if (!res.ok) return { ok: false, msg: json.message };
    return { ok: true, msg: json.message };

  } catch (error) {
    return { ok: false, msg: "Error al conectar con el servidor." };
  }
}

// API: Inicio de sesión
async function attemptLogin(usuario, password) {
  try {
    const res = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario, password })
    });

    const json = await res.json();

    if (!res.ok) return { ok: false, msg: json.message };
    return { ok: true, msg: json.message };

  } catch (error) {
    return { ok: false, msg: "Error al conectar con el servidor." };
  }
}

// FORMULARIOS
function initForms() {

  // Cambio de panel
  qs('#goRegister').addEventListener('click', e => { 
    e.preventDefault(); 
    showForm('register'); 
  });

  qs('#goLogin').addEventListener('click', e => { 
    e.preventDefault(); 
    showForm('login'); 
  });

  // REGISTRO
  const regForm = qs('#registerForm');

  regForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    showMessage('#registerMessage', '');

    const data = {
      nombre: regForm.nombre.value.trim(),
      apellido: regForm.apellido.value.trim(),
      cedula: regForm.cedula.value.trim(),
      nacimiento: regForm.nacimiento.value,
      usuario: regForm.regUser.value.trim(),
      password: regForm.regPass.value
    };

    const errors = validateRegistration(data);
    if (errors.length) {
      showMessage('#registerMessage', errors.join(' '), 'error');
      return;
    }

    const res = await registerUser(data);

    if (!res.ok) {
      showMessage('#registerMessage', res.msg, 'error');
      return;
    }

    showMessage('#registerMessage', "Registro exitoso. Ya puedes iniciar sesión.", "success");
    regForm.reset();

    setTimeout(() => {
      showForm('login');
      showMessage('#loginMessage', "Registro completado. Inicia sesión.", "success");
    }, 800);
  });

  // LOGIN
  const loginForm = qs('#loginForm');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    showMessage('#loginMessage', '');

    const usuario = loginForm.loginUser.value.trim();
    const password = loginForm.loginPass.value;

    if (!usuario || !password) {
      showMessage('#loginMessage', 'Complete usuario y contraseña.', 'error');
      return;
    }

    const res = await attemptLogin(usuario, password);

    if (!res.ok) {
      showMessage('#loginMessage', res.msg, 'error');
      return;
    }

    showMessage('#loginMessage', "Autenticación satisfactoria.", "success");
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initPasswordToggles();
  initForms();
});
