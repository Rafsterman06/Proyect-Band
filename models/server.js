//configuraciones del servidor

let express = require("express");

let Sha1=require('sha1');

let session=require('express-session');

let cookieParser=require('cookie-parser');

let Conexion=require("./conexion");
let conexion=new Conexion();
let Prueba=require("./Prueba.js");
let prueba=new Prueba();

require('dotenv').config();
class Server{
    constructor(){
        //se agrega la funcion express a la variable app
        //se agrega el puerto al puerto xd
        //se invocan las funciones middleware y routes
        this.app=express();
        this.port=process.env.PORT;
        this.middlewares();
        this.routes();

    }
    
    middlewares(){
        // se agregan las paginas estaticas 
        this.app.use(express.static('public'));
        // exportas ejs para poderlo usar
        this.app.set('view engine', 'ejs');
        //para las cookies
        this.app.use(cookieParser());
        //para sesiones de usuarios
        this.app.use(session({
            secret: "amar",
            saveUninitialized: true,
            resave: true
        }));
    }

    routes(){
        //se agragan rutas
        /* request y responses*/

        this.app.get('/prueba', (req, res) => {
            let nombre="hola";
            let contrasenia="hola";

            let login=conexion.conexion(nombre, contrasenia);

            if(login==true){
                console.log("se ha logeado!!!");
            }
            else{
                console.log(":(");

            }

            res.send("Fin!!");
        });

        this.app.get('/goregistrar', (req, res) => {
            res.render("registrar");
        });

        this.app.get('/createusuario', async (req, res) => {
            let nombre=req.query.username;
            let password=req.query.password;
            let phone=req.query.phone;
            let email=req.query.email;

            let conn=conexion.conexion();
            try{
                await conn.connect();
                let insertar=await conn.db("Banda").collection("Usuarios").insertOne({"nombre":nombre,"password":password,"phone":phone,"email":email});
                console.log("Usuario Insertado!!!");
            }finally {
                // Ensures that the client will close when you finish/error
                await conn.close();
            }

            console.log(nombre+" "+password+" "+phone+" "+email);
            res.redirect('/');
        });
        
        this.app.get('/gologin', (req, res) => {
            res.render('login');
        });
        
        this.app.get("/login",async (req,res)=>{
            let usuar=req.query.username;
            let passw=req.query.password;
            let x;
            let confirmacion;
            //let passSha1=Sha1(passw);
            let conn=conexion.conexion();
            try{
                await conn.connect();
                let read=await conn.db("Banda").collection("Usuarios").findOne({"nombre":usuar,"password":passw});
                x=read;
            }finally {
                // Ensures that the client will close when you finish/error
                await conn.close();
            }
            if(x!=null){

                if(x.nombre==usuar && x.password==passw){
                    let user={
                        usr:usuar,
                        psw:passw,
                    };
                    req.session.user=user;
                    req.session.save();
                    res.render('perfil');
                }else{
                    res.redirect('/');
                    console.log("Salida");
                }
            }else{
                res.redirect('/');
            }
        });
        this.app.get('/goconfiguracion', (req, res) => {
            res.render('configuracion');
        });
        /*
        this.app.get('/update', (req, res) => {
            let nombre=req.query.username;
            let password=req.query.password;
            let phone=req.query.phone;
            let email=req.query.email;
            let update;

            let conn=conexion.conexion();
            try{
                await conn.connect();
                update=conn.db("Banda").collection("Usuarios").updateOne()

            }
        });
        */
    }
    
    listen(){
        //en que puerto se va a configurar
        this.app.listen(this.port,()=>{
            console.log("http://127.0.0.1:"+this.port);
        });
    }
}

module.exports = Server;