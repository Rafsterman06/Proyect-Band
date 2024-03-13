
//const { MongoClient } = require('mongodb'); //Libreria para usar los metodos y funciones de mongodb
//const uri = "mongodb+srv://al21311231:QWERTY@cluster0.7hwrvoe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
//const dbname = "Banda";

let Conexion=require("../models/conexion");
let conexion=new Conexion();
describe('Prueba de conexion',()=>{

    let conn=conexion.conexion();
    let db;

    beforeAll(async ()=>{
    
        await conn.connect();
        db = await conn.db("Banda");
    });

    afterAll(async ()=>{
        await conn.close();
    });
    it('Se deberia realizar la conexión y deberia insertar un documento...', async ()=>{
        const users = db.collection('Usuarios');

        const mockUser = {_id: 'some-user-id', name: 'John'};
        await users.insertOne(mockUser);

        const insertedUser = await users.findOne({_id: 'some-user-id'});
        expect(insertedUser).toEqual(mockUser);
        await conn.db("Banda").collection("Usuarios").findOneAndDelete({_id: 'some-user-id'});
    });
});

