require('dotenv').config();

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://al21311231:QWERTY@cluster0.7hwrvoe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
class Conexion{
    conexion(){

        // Create a MongoClient with a MongoClientOptions object to set the Stable API version
        const client = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });
        
        return client;
    }
}
module.exports=Conexion;