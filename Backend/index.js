const express = require('express');
const WebSocket = require('ws');
const app = express();
const PORT = 3000;

app.use(express.json());

let decibelData = 0;

// Configurar WebSocket
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', ws => {
  console.log('Cliente conectado');
  ws.send(JSON.stringify({ decibels: decibelData }));

  ws.on('close', () => {
    console.log('Cliente desconectado');
  });
});

// Recibir datos del ESP32 vía HTTP POST
app.post('/', (req, res) => {
  decibelData = req.body.decibels;
  console.log(`Decibeles recibidos: ${decibelData}`);

  // Enviar datos a todos los clientes conectados vía WebSocket
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ decibels: decibelData }));
    }
  });

  res.send('Datos recibidos');
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
