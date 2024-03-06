require('dotenv').config(); //Creo que ni se usa aqui xd

const Server=require('./models/server');

const server = new Server();

server.listen();