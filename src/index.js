import cron from 'node-cron';
import axios from 'axios';
import app from './app.js';
import config from './config.js';

const { port, deployUrl } = config;

app.get('/ping', (req, res) => {
  res.send('pong');
});

// Configurar el cron job para hacer ping a tu propia ruta cada 14 minutos
cron.schedule('*/14 * * * *', async () => {
  try {
    const response = await axios.get(`${deployUrl}/ping`);
    console.log(`Ping exitoso a ${deployUrl}: ${response.data}`);
  } catch (error) {
    console.error(`Error al hacer ping: ${error.message}`);
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
  console.log(`Cron job peticion a ${deployUrl}`)
  console.log('Cron job programado para hacer ping al servidor cada 15 minutos.');
});
