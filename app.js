const API_BASE = location.protocol === 'file:' ? 'http://localhost:3000' : window.location.origin;

async function parseJsonResponse(response) {
  try {
    return await response.json();
  } catch (err) {
    return null;
  }
}

// Função para cadastrar um novo time
async function cadastrarTime() {
  const nome = document.querySelector('input[placeholder="Seu nome"]').value;
  const email = document.querySelector('input[placeholder="Email"]').value;
  const nomeTime = document.querySelector('input[placeholder="Nome do Time"]').value;

  if (!nome || !email || !nomeTime) {
    alert('Por favor, preencha todos os campos!');
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/api/times`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nome_pessoa: nome,
        email: email,
        nome_time: nomeTime
      })
    });

    const data = await parseJsonResponse(response);

    if (response.ok) {
      window.location.href = 'cadastro-sucesso.html';
    } else {
      alert('Erro: ' + (data?.erro || response.statusText || 'Erro desconhecido'));
    }
  } catch (error) {
    console.error('Erro ao cadastrar:', error);
    alert('Erro ao conectar com o servidor');
  }
}

// Adicionar listener ao botão de cadastro
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  if (form) {
    const button = form.querySelector('button');
    button.type = 'button';
    button.onclick = cadastrarTime;
  }
});
