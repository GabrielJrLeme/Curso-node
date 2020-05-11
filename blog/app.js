// Carregando módulos
    const express = require('express');
    const handlebars = require('express-handlebars');
    const bodyParser = require('body-parser');
    const app = express();
    const admin = require('./routes/admin');
    const path = require('path');
    const mongoose = require('mongoose');
    const session = require('express-session');
    const flash = require('connect-flash');

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
        app.use(flash());

    //Middleware
        app.use((req,res,next) => {
            //Variaveis Globais
            res.locals.success_msg = req.flash("succes_msg");
            res.locals.error_msg = req.flash("error_msg");
            next();
        })

    //Bodyparser
        app.use(bodyParser.urlencoded({extended:true}));
        app.use(bodyParser.json());

    //Handlebars
        app.engine('handlebars',handlebars({defaultLayout:'main'}));
        app.set('view engeni','handlebars');

    //Public
        app.use(express.static(path.join(__dirname,'public')));

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
    app.get('/',(req,res) => {

        Postagem.find().populate('categoria').lean().sort({data:"desc"}).then((postagens) => {

            res.render('index.handlebars',{postagens:postagens});

        }).catch((err) => {

            req.flash('error_msg',"Houve um erro au caregar as postagens");
            res.redirect("/404");

        });
        
    });


    app.get('/404',(req,res) => {
        res.send("/404");
    });


    app.get('/postagem/:slug',(req,res) => {

        Postagem.findOne({slug:req.params.slug}).lean().then((postagem) => {


            if(postagem){
                res.render('postagem/index.handlebars',{postagem:postagem});
            }else{
                req.flash('error_msg',"Erro ao renderizar a página");
                res.send("/404");
            }

        }).catch((err) => {
            req.flash('error_msg',"Houve um erro interno");
            res.send("/404");
        })

    });


    app.get('/categorias',(req,res) => {
        
        Categoria.find().lean().then((categorias) => {

            res.render('categoria/index.handlebars',{categorias:categorias});

        }).catch((err) => {

            req.flash('error_msg',"Houve um erro interno");
            res.redirect("/");

        });
    });

    app.get('/categorias/:slug',(req,res) => {

        Categoria.findOne({slug:req.params.slug}).lean().then((categoria) => {

            if(categoria){

                Postagem.find({categoria:categoria._id}).lean().then((postagens) => {

                    res.render('categoria/postagens.handlebars',{postagens:postagens,categoria:categoria});

                }).catch((err) => {

                    req.flash('error_msg',"Houve um erro interno");
                    res.redirect("/");
        
                });

                
            }else{
                req.flash('error_msg',"Categoria não existe");
                res.redirect("/");                
            }
            

        }).catch((err) => {

            req.flash('error_msg',"Houve um erro interno");
            res.redirect("/");

        });

    })

    app.use('/admin',admin);
//outros

    //porta
        const port = 8080;

    //escutando a porta
        app.listen(port,() => {
            console.log("Conectado...");
            console.log("http://localhost:"+port);
        });
        