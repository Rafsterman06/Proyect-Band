
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

        this.app.get('/prueba', async (req, res) => { //Solo es para probar algunos aspectos que se compliquen durante el desarrollo
            let command={ide:'Tom'};

        });

        this.app.get('/gogira', (req, res) => { //Redirecciona a la pagina gira
            res.render('gira');
        });

        this.app.get('/gomapa', (req, res) => { //Redirecciona a la pagina mapa
            res.render('mapa');
        });

        this.app.get('/govideos', (req, res) => { //Redirecciona a la pagina videos
            if(req.session.user){
                res.render('videoapi');

            }else{res.render('login');}
            
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
            let id=nombre+password;
            //Termina la referenciacion de la parte de la visa hacia las variables

            nombre=Sha1(nombre); //Ayuda a encriptar los datos
            password=Sha1(password); //Ayuda a encriptar los datos
            phone=Sha1(phone); //Ayuda a encriptar los datos
            email=Sha1(email); //Ayuda a encriptar los datos
            id=Sha1(id);


            let conn=conexion.conexion(); //Se crea instancia de la clase conexion que abre la conexion con el servidor mongodb
            try{
                await conn.connect(); //Abre la conexion con mongodb
                await conn.db("Banda").collection("Usuarios").insertOne({"ide":id,"nombre":nombre,"password":password,"phone":phone,"email":email}); //Agrega un usuario con los datos de las variables anteriores
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
        
        this.app.get("/login", (req,res)=>{ //Logea al usuario

            //Inicia la referenciacion de la parte de la vista hacia variables
            let usuar=req.query.username;//Hace referencia al usuario
            let passw=req.query.password;//Hace referencia al password
            //Termina la referenciacion de la parte de la visa hacia las variables
            
            if(usuar!=null && passw!=null){ //Compara los datos de la consulta con los datos que proporciono el usuario
                let user={ //Almacena los datos en una cookie xd
                    usr:usuar,
                    psw:passw
                };
                req.session.user=user; //Guarda la cookie
                
                req.session.save(); //Guarda los datos
                
                 res.redirect('/perfil'); //Redirige a la pagina del perfil del usuario
            }else{ //Redirige al inicio del sitio web
                res.render('login')
            }
            
        });

        this.app.get('/perfil', async (req, res) => {
            if(req.session.user){
                let x;
                let pass=req.session.user.psw;
                let usu=req.session.user.usr;
                pass=Sha1(pass);
                usu=Sha1(usu);
                let conn=conexion.conexion(); //Se crea instancia de la clase conexion que abre la conexion con el servidor mongodb
                try{
                    await conn.connect(); //Abre la conexion con mongodb
                    let read=await conn.db("Banda").collection("Usuarios").findOne({"nombre":usu,"password":pass},{"ide":1,"nombre":1,"password":1}); //REaliza la consulta con la base de datos
                    x=read; //Me permite manipular la consulta
                }finally {
                    // Ensures that the client will close when you finish/error
                    await conn.close(); //Cierra la conexion con el servidor
                }

                if(x!=null){
                    console.log(x.ide+", "+x.nombre+", "+x.password);
                    let user={
                        ide:x.ide,
                        usr:x.nombre,
                        psw:x.password
                    }
                    req.session.user=user;
                    req.session.save();
                    res.render('perfil');
                }else{ res.redirect('login');}
            }else{res.render('login');}
        });

        this.app.get('/goconfiguracion', (req, res) => { //Redirecciona a la pagina de configuracion
            if(req.session.user){
                res.render('configuracion');
            }else{ res.redirect('login');}

        });
        
        this.app.get('/update', async (req, res) => {
            if(req.session.user){

                let nombre=req.query.username;
                let password=req.query.password;
                let phone=req.query.phone;
                let email=req.query.email;
                
                nombre=Sha1(nombre);
                password=Sha1(password);
                phone=Sha1(phone);
                email=Sha1(email);
                
                let conn=conexion.conexion();
                try{

                    let command={ide:req.session.user.ide};
                    await conn.connect();
                    await conn.db("Banda").collection("Usuarios").updateOne(command,{"$set":{"nombre":nombre,"password":password,"phone":phone,"email":email}});
                    

                }finally{
                    // Ensures that the client will close when you finish/error
                    await conn.close();
                }
                res.redirect('/perfil');
            }else{res.redirect('login');}
        });

        this.app.get('/delete', async (req, res) => {
            
            if(req.session.user){

                let conn=conexion.conexion();
                try{
                    let command={ide:req.session.user.ide};
                    console.log(req.session.user.ide);
                    await conn.connect();
                    await conn.db("Banda").collection("Usuarios").deleteOne(command);
                    console.log("Eliminado!!! ");
                    
                }finally{
                    // Ensures that the client will close when you finish/error
                    await conn.close();
                }
                res.redirect('/');
            }else{res.redirect('/login');}
        });
        
    }
    
    listen(){
        //en que puerto se va a configurar
        this.app.listen(this.port,()=>{
            console.log("http://127.0.0.1:"+this.port);
        });
    }
}

module.exports = Server;