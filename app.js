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
      carregarTimes();
    } else {
      alert('Erro: ' + data.erro);
    }
  } catch (error) {
    console.error('Erro ao cadastrar:', error);
    alert('Erro ao conectar com o servidor');
  }
}

// Função para carregar e exibir todos os times
async function carregarTimes() {
  try {
    const response = await fetch('/api/times');
    const times = await response.json();

    const timesList = document.getElementById('times-list');
    if (!timesList) return;

    if (times.length === 0) {
      timesList.innerHTML = '<p>Nenhum time cadastrado ainda.</p>';
      return;
    }

    timesList.innerHTML = '';
    times.forEach(time => {
      const div = document.createElement('div');
      div.className = 'time-item';
      div.innerHTML = `
        <h3>${time.nome_time}</h3>
        <p><strong>Responsável:</strong> ${time.nome_pessoa}</p>
        <p><strong>Email:</strong> ${time.email}</p>
        <p><small>Cadastrado em: ${new Date(time.data_cadastro).toLocaleDateString('pt-BR')}</small></p>
      `;
      timesList.appendChild(div);
    });
  } catch (error) {
    console.error('Erro ao carregar times:', error);
  }
}

// Carregar times quando a página carregar
document.addEventListener('DOMContentLoaded', carregarTimes);

// Adicionar listener ao botão de cadastro
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  if (form) {
    const button = form.querySelector('button');
    button.type = 'button';
    button.onclick = cadastrarTime;
  }
});
