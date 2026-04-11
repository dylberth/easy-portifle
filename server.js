const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 3000;

// Configurar nodemailer para Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'seu_email@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'sua_senha_app'
  }
});

// Email para receber notificações
const emailAdmin = 'josecarlos.futebol@gmail.com';

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// Inicializar banco de dados
const db = new sqlite3.Database('./banco_dados.db', (err) => {
  if (err) {
    console.error('Erro ao conectar no banco de dados:', err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite');
    criarTabela();
  }
});

// Criar tabela se não existir
function criarTabela() {
  db.run(`
    CREATE TABLE IF NOT EXISTS times (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome_pessoa TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      nome_time TEXT NOT NULL UNIQUE,
      data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

// ROTAS

// GET - Listar todos os times
app.get('/api/times', (req, res) => {
  db.all('SELECT * FROM times ORDER BY data_cadastro DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ erro: err.message });
    } else {
      res.json(rows);
    }
  });
});

// GET - Obter um time por ID
app.get('/api/times/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM times WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ erro: err.message });
    } else if (!row) {
      res.status(404).json({ erro: 'Time não encontrado' });
    } else {
      res.json(row);
    }
  });
});

// Função para enviar email
async function enviarEmailNotificacao(nome_pessoa, email, nome_time) {
  try {
    // Email para o admin
    const mailOptions = {
      from: process.env.EMAIL_USER || 'seu_email@gmail.com',
      to: emailAdmin,
      subject: '🏆 Novo Time Cadastrado - Guega Esportes',
      html: `
        <h2 style="color: #0716e6;">Novo Time Cadastrado!</h2>
        <p><strong>Nome do Responsável:</strong> ${nome_pessoa}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Nome do Time:</strong> ${nome_time}</p>
        <p><strong>Data:</strong> ${new Date().toLocaleString('pt-BR')}</p>
        <hr>
        <p style="color: #666; font-size: 12px;">Mensagem enviada automaticamente pelo sistema Guega Esportes</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Email enviado com sucesso para:', emailAdmin);

    // Email de confirmação para o time
    const mailConfirmacao = {
      from: process.env.EMAIL_USER || 'seu_email@gmail.com',
      to: email,
      subject: '✅ Cadastro Confirmado - Guega Esportes',
      html: `
        <h2 style="color: #0716e6;">Bem-vindo à Guega Esportes!</h2>
        <p>Olá <strong>${nome_pessoa}</strong>,</p>
        <p>Seu time <strong>${nome_time}</strong> foi cadastrado com sucesso!</p>
        <p>Em breve você receberá mais informações sobre o campeonato.</p>
        <hr>
        <p><strong>Contato Guega Esportes:</strong></p>
        <p>📱 WhatsApp: <a href="https://wa.me/5511983155581">+55 11 98315-5581</a></p>
        <p>📷 Instagram: <a href="https://www.instagram.com/_guegaesportes/">@_guegaesportes</a></p>
        <p style="color: #666; font-size: 12px;">Mensagem enviada automaticamente. Não responda este email.</p>
      `
    };

    await transporter.sendMail(mailConfirmacao);
    console.log('Email de confirmação enviado para:', email);
  } catch (error) {
    console.error('Erro ao enviar email:', error.message);
  }
}

// POST - Cadastrar novo time
app.post('/api/times', (req, res) => {
  const { nome_pessoa, email, nome_time } = req.body;

  // Validações
  if (!nome_pessoa || !email || !nome_time) {
    return res.status(400).json({ erro: 'Todos os campos são obrigatórios' });
  }

  const stmt = db.prepare('INSERT INTO times (nome_pessoa, email, nome_time) VALUES (?, ?, ?)');
  stmt.run([nome_pessoa, email, nome_time], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        res.status(400).json({ erro: 'Email ou nome do time já cadastrado' });
      } else {
        res.status(500).json({ erro: err.message });
      }
    } else {
      // Enviar emails de notificação
      enviarEmailNotificacao(nome_pessoa, email, nome_time);

      res.status(201).json({
        mensagem: 'Time cadastrado com sucesso!',
        id: this.lastID
      });
    }
  });
  stmt.finalize();
});

// PUT - Atualizar um time
app.put('/api/times/:id', (req, res) => {
  const { id } = req.params;
  const { nome_pessoa, email, nome_time } = req.body;

  const stmt = db.prepare('UPDATE times SET nome_pessoa = ?, email = ?, nome_time = ? WHERE id = ?');
  stmt.run([nome_pessoa, email, nome_time, id], function(err) {
    if (err) {
      res.status(500).json({ erro: err.message });
    } else if (this.changes === 0) {
      res.status(404).json({ erro: 'Time não encontrado' });
    } else {
      res.json({ mensagem: 'Time atualizado com sucesso!' });
    }
  });
  stmt.finalize();
});

// DELETE - Deletar um time
app.delete('/api/times/:id', (req, res) => {
  const { id } = req.params;
  const stmt = db.prepare('DELETE FROM times WHERE id = ?');
  stmt.run([id], function(err) {
    if (err) {
      res.status(500).json({ erro: err.message });
    } else if (this.changes === 0) {
      res.status(404).json({ erro: 'Time não encontrado' });
    } else {
      res.json({ mensagem: 'Time deletado com sucesso!' });
    }
  });
  stmt.finalize();
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

// Fechar conexão com banco quando encerrar
process.on('SIGINT', () => {
  db.close();
  process.exit();
});
