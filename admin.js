function verificarAutenticacao() {
  const adminLogado = sessionStorage.getItem('adminLoggedIn');
  if (adminLogado !== 'true') {
    window.location.href = 'admin-login.html';
    return false;
  }
  return true;
}

async function carregarCadastros() {
  if (!verificarAutenticacao()) return;

  try {
    const response = await fetch('/api/times');
    const times = await response.json();

    const timesList = document.getElementById('times-list');
    if (!timesList) return;

    if (!response.ok) {
      timesList.innerHTML = '<p>Erro ao carregar cadastros.</p>';
      console.error('Erro na resposta do servidor:', times);
      return;
    }

    if (times.length === 0) {
      timesList.innerHTML = '<p>Nenhum cadastro encontrado.</p>';
      return;
    }

    const tabela = document.createElement('table');
    tabela.className = 'admin-table';
    tabela.innerHTML = `
      <thead>
        <tr>
          <th>ID</th>
          <th>Nome</th>
          <th>Email</th>
          <th>Time</th>
          <th>Data de cadastro</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;

    const tbody = tabela.querySelector('tbody');

    times.forEach(time => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${time.id}</td>
        <td>${time.nome_pessoa}</td>
        <td>${time.email}</td>
        <td>${time.nome_time}</td>
        <td>${new Date(time.data_cadastro).toLocaleString('pt-BR')}</td>
      `;
      tbody.appendChild(tr);
    });

    timesList.innerHTML = '';
    timesList.appendChild(tabela);
  } catch (error) {
    console.error('Erro ao carregar cadastros:', error);
    const timesList = document.getElementById('times-list');
    if (timesList) {
      timesList.innerHTML = '<p>Erro ao conectar com o servidor.</p>';
    }
  }
}

document.addEventListener('DOMContentLoaded', carregarCadastros);
