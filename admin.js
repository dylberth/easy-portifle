function verificarAutenticacao() {
  const adminLogado = sessionStorage.getItem('adminLoggedIn');
  if (adminLogado !== 'true') {
    window.location.href = 'admin-login.html';
    return false;
  }
  return true;
}

async function excluirTime(id) {
  if (!confirm('Tem certeza que deseja excluir este cadastro? Esta ação não pode ser desfeita.')) {
    return;
  }

  try {
    const response = await fetch(`/api/times/${id}`, {
      method: 'DELETE'
    });

    const data = await response.json();

    if (response.ok) {
      alert('Cadastro excluído com sucesso!');
      carregarCadastros(); // Recarregar a lista
    } else {
      alert('Erro ao excluir: ' + data.erro);
    }
  } catch (error) {
    console.error('Erro ao excluir:', error);
    alert('Erro ao conectar com o servidor');
  }
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
          <th>Ações</th>
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
        <td><button class="btn-excluir" data-id="${time.id}">Excluir</button></td>
      `;
      tbody.appendChild(tr);
    });

    timesList.innerHTML = '';
    timesList.appendChild(tabela);

    // Adicionar event listeners aos botões de excluir
    document.querySelectorAll('.btn-excluir').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        excluirTime(id);
      });
    });
  } catch (error) {
    console.error('Erro ao carregar cadastros:', error);
    const timesList = document.getElementById('times-list');
    if (timesList) {
      timesList.innerHTML = '<p>Erro ao conectar com o servidor.</p>';
    }
  }
}

document.addEventListener('DOMContentLoaded', carregarCadastros);
