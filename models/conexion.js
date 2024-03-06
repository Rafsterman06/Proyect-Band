require('dotenv').config(); //Obtiene las variables de entorno
const { json } = require('express'); //Ayuda a manejar los archivos JSON
const { MongoClient, ServerApiVersion } = require('mongodb'); //Libreria para usar los metodos y funciones de mongodb
const uri = "mongodb+srv://al21311231:QWERTY@cluster0.7hwrvoe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
class Conexion{ //Clase crea la conexion y la retorna
    conexion(){ //Abre la conexion con mongodb
        // Create a MongoClient with a MongoClientOptions object to set the Stable API version
        const client = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });
        return client; //Retorna la conexion abierta
    }
}
module.exports=Conexion;