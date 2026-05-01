const sqlite3 = require('sqlite3').verbose();
const nodemailer = require('nodemailer');
require('dotenv').config();

const db = new sqlite3.Database('./banco_dados.db');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

db.all('SELECT * FROM times ORDER BY data_cadastro DESC', (err, rows) => {
  if (err) {
    console.error('Erro ao consultar banco:', err);
    return;
  }

  let html = '<h2>Lista de Times Cadastrados</h2>';
  if (rows.length === 0) {
    html += '<p>Nenhum time cadastrado ainda.</p>';
  } else {
    rows.forEach(time => {
      html += `<p><strong>${time.nome_time}</strong> - Responsável: ${time.nome_pessoa} (${time.email}) - Cadastrado em: ${new Date(time.data_cadastro).toLocaleString('pt-BR')}</p>`;
    });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'josecarlos.futebol@gmail.com',
    subject: 'Lista Completa de Cadastros - Guega Esportes',
    html: html
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Erro ao enviar email:', error);
    } else {
      console.log('Email enviado com sucesso:', info.response);
    }
  });

  db.close();
});