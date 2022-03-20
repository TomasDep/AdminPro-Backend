require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { dbConnection } = require('./database/config')

// Crear servidor de express
const app = express();

// Configurar CORS
app.use(cors());

// Base de datos
dbConnection();

// usuario: hospital_user
// password: 8lqpLvmBY0Yj4zzd

// Rutas
app.get('/', (request, response) => {
  response.json({
    ok: true,
    message: 'Hola Mundo'
  });
});

app.listen(process.env.PORT, () => {
  console.log('Servidor corriendo en el puerto ' + process.env.PORT);
});