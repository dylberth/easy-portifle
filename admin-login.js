const ADMIN_PASSWORD = 'Josec123';

function exibirErro(mensagem) {
  const erro = document.getElementById('login-error');
  if (erro) {
    erro.textContent = mensagem;
  }
}

function entrarComoAdmin(event) {
  event.preventDefault();

  const senhaInput = document.getElementById('admin-password');
  if (!senhaInput) return;

  const senha = senhaInput.value.trim();
  if (senha === ADMIN_PASSWORD) {
    sessionStorage.setItem('adminLoggedIn', 'true');
    window.location.href = 'admin.html';
  } else {
    exibirErro('Senha incorreta. Tente novamente.');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form');
  if (form) {
    form.addEventListener('submit', entrarComoAdmin);
  }
});
