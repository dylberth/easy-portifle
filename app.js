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
    const response = await fetch('/api/times', {
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

    const data = await response.json();

    if (response.ok) {
      alert(data.mensagem);
      // Limpar formulário
      document.querySelector('form').reset();
    } else {
      alert('Erro: ' + data.erro);
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
