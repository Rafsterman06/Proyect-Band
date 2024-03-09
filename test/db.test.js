
const { MongoClient } = require('mongodb'); //Libreria para usar los metodos y funciones de mongodb
const uri = "mongodb+srv://al21311231:QWERTY@cluster0.7hwrvoe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const dbname = "Banda";
describe('Prueba de conexion',()=>{

    let conexion;
    let db;

    beforeAll(async ()=>{
        conexion = await MongoClient.connect(globalThis.uri,{
            userNewUrlParser: true, 
            useUnifiedTopology: true,
        });
        db = await conexion.db(globalThis.dbname);
    });

    afterAll(async ()=>{
        await conexion.close();
    });
    it('Se deberia realizar la conexión y deberia insertar un documento...', async ()=>{
        const Banda = client.db("Banda");
        const collection = await db.collections();
        expect(collection).to.be.an('array');
    });
});

