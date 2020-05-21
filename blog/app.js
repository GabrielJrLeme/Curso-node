// Carregando módulos
    const express = require('express');
    const handlebars = require('express-handlebars');
    const bodyParser = require('body-parser');
    const app = express();
    const admin = require('./routes/admin');
    const web = require('./routes/web');
    const usuarios = require('./routes/usuario');
    const path = require('path');
    const mongoose = require('mongoose');
    const session = require('express-session');
    const flash = require('connect-flash');

    const passport = require('passport')
    require('./config/auth')(passport)

    require('./models/Categoria');
    const Categoria = mongoose.model('categorias');

    require('./models/Postagem');
    const Postagem = mongoose.model('postagens');

//configurações
    //Sessão
        app.use(session({
            secret: "sursonode",
            resave:true,
            saveUninitialized:true
        }));

        app.use(passport.initialize())
        app.use(passport.session())
        
        app.use(flash());

    //Middleware
        app.use((req,res,next) => {
            //Variaveis Globais
            res.locals.success_msg = req.flash("success_msg");
            res.locals.error_msg = req.flash("error_msg");
            res.locals.error = req.flash('error')
            res.locals.user = req.user || null
            next();
        })

    //Bodyparser
        app.use(bodyParser.urlencoded({extended:true}));
        app.use(bodyParser.json());

    //Handlebars
        app.engine('handlebars',handlebars({defaultLayout:'main'}));
        app.set('view engeni','handlebars');

    //Public
        app.use(express.static(__dirname + '/public'));
        app.use('/js', express.static(path.join(__dirname + '/node_modules/jquery/dist/'))); // redirect JS jQuery
        app.use('/js', express.static(path.join(__dirname + '/node_modules/popper.js/dist/umd/'))); // redirect JS jQuery        
        app.use('/js', express.static(path.join(__dirname + '/node_modules/bootstrap/dist/js'))); // redirect bootstrap JS
        app.use('/css', express.static(path.join(__dirname + '/node_modules/bootstrap/dist/css'))); // redirect CSS bootstrap


    //Mongoose
        //Corrigir erros do mongo
        mongoose.Promise = global.Promise;
        //Connect do mongo
        mongoose.connect("mongodb://localhost/blogapp",{
            useNewUrlParser:true,
            useUnifiedTopology:true

        }).then(() => {
            console.log("Banco de dados conectado...");

        }).catch((err) => {
            console.log("Erro de conexão => "+err);
            
        });


//rotas
    
    app.use('/',web);
    app.use('/admin',admin);
    app.use('/usuarios',usuarios);
//outros

    //porta
        const port = 8080;

    //escutando a porta
        app.listen(port,() => {
            console.log("Conectado...");
            console.log("http://localhost:"+port);
        });
        