console.log('Iniciando a API')
require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3030;

//Middleware
app.use(express.json());

const weatherRoutes = require('./routes/weather');
app.use('/api', weatherRoutes);

app.get('/', (req, res) => {
  res.send('API de alerta de clima funcionando! :D');
})

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

require('./jobs/weatherAlertJob.js');
