//configuraciones del servidor

let express = require("express");

let Sha1=require('sha1');

let session=require('express-session');

let cookieParser=require('cookie-parser');

let Conexion=require("./conexion");
let conexion=new Conexion();



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

        this.app.get('/prueba', (req, res) => { //Solo es para probar algunos aspectos que se compliquen durante el desarrollo
            let nombre="hola";
            let contrasenia="hola";

            let login=conexion.conexion();

            if(login==true){
                console.log("se ha logeado!!!");
            }
            else{
                console.log(":(");

            }

            res.send("Fin!!");
        });

        this.app.get('/gogira', (req, res) => { //Redirecciona a la pagina gira
            res.render('gira');
        });

        this.app.get('/gomapa', (req, res) => { //Redirecciona a la pagina mapa
            res.render('mapa');
        });

        this.app.get('/govideos', (req, res) => { //Redirecciona a la pagina videos
            res.render('videoapi');
        });

        this.app.get('/goregistrar', (req, res) => { //Redirecciona a la pagina registrar
            res.render("registrar");
        });

        this.app.get('/createusuario', async (req, res) => { //Crea un usuario
            //Inicia la referenciacion de la parte de la vista hacia variables
            let nombre=req.query.username; //Hace referencia al nombre
            let password=req.query.password; //Hace referencia al password
            let phone=req.query.phone; //Hace referencia al phone
            let email=req.query.email; //Hace referencia al email
            //Termina la referenciacion de la parte de la visa hacia las variables

            //nombre=Sha1(nombre); //Ayuda a encriptar los datos (pendiente usar xd)
            //password=Sha1(password); //Ayuda a encriptar los datos (pendiente usar xd)
            //phone=Sha1(phone); //Ayuda a encriptar los datos (pendiente usar xd)
            //email=Sha1(email); //Ayuda a encriptar los datos (pendiente usar xd)

            let conn=conexion.conexion(); //Se crea instancia de la clase conexion que abre la conexion con el servidor mongodb
            try{
                await conn.connect(); //Abre la conexion con mongodb
                let insertar=await conn.db("Banda").collection("Usuarios").insertOne({"nombre":nombre,"password":password,"phone":phone,"email":email}); //Agrega un usuario con los datos de las variables anteriores
                console.log("Usuario Insertado!!!"); //Me indica que el usuario se agrego xd
            }finally {
                // Ensures that the client will close when you finish/error
                await conn.close(); //Cierra la conexion con el servidor
            }

            console.log(nombre+" "+password+" "+phone+" "+email); //Me indica que el usuario se agrego xd
            res.redirect('/'); //Redirecciona al inicio del sitio web
        });
        
        this.app.get('/gologin', (req, res) => { //Redirecciona a la pagina login
            res.render('login');
        });
        
        this.app.get("/login",async (req,res)=>{ //Logea al usuario

            //Inicia la referenciacion de la parte de la vista hacia variables
            let usuar=req.query.username;//Hace referencia al usuario
            let passw=req.query.password;//Hace referencia al password
            //Termina la referenciacion de la parte de la visa hacia las variables
            
            let x; //Me ayuda a manipular el archivo JSON de la consulta
            
            //usuar=Sha1(usuar); //Ayuda a encriptar los datos (pendiente usar xd)
            //passw=Sha1(passw); //Ayuda a encriptar los datos (pendiente usar xd)
            
            let conn=conexion.conexion(); //Se crea instancia de la clase conexion que abre la conexion con el servidor mongodb
            try{
                await conn.connect(); //Abre la conexion con mongodb
                let read=await conn.db("Banda").collection("Usuarios").findOne({"nombre":usuar,"password":passw}); //REaliza la consulta con la base de datos
                x=read; //Me permite manipular la consulta
            }finally {
                // Ensures that the client will close when you finish/error
                await conn.close(); //Cierra la conexion con el servidor
            }
            if(x!=null){ //Valida que la variable no este vacia despues de realizar la consulta
                if(x.nombre==usuar && x.password==passw){ //Compara los datos de la consulta con los datos que proporciono el usuario
                    let user={ //Almacena los datos en una cookie xd
                        usr:usuar,
                        psw:passw,
                    };

                    req.session.user=user; //Guarda la cookie
                    
                    req.session.save(); //Guarda los datos
                    
                    res.render('perfil'); //Redirige a la pagina del perfil del usuario
                }else{ //Redirige al inicio del sitio web
                    res.redirect('/');
                    
                    console.log("Salida");
                }
            }else{ //Redirige al inicio del sitio web
                res.redirect('/');

                console.log("Salida")
            }
        });

        this.app.get('/goconfiguracion', (req, res) => { //Redirecciona a la pagina de configuracion
            res.render('configuracion');
        });
        /*
        this.app.get('/update', async (req, res) => {
            let nombre=req.query.username;
            let password=req.query.password;
            let phone=req.query.phone;
            let email=req.query.email;
            let update;

            let conn=conexion.conexion();
            try{
                await conn.connect();
                update=conn.db("Banda").collection("Usuarios").updateOne((nombre+" "+password+" "+phone+" "+email));

            }finally{
                // Ensures that the client will close when you finish/error
                await conn.close();
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