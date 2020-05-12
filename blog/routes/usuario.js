const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');

require('../models/Usuario');
const Usuario = mongoose.model('usuarios');

router.get('/registro', (req,res) => {
    res.render('usuarios/registro.handlebars');
});

router.post('/registro',(req,res) => {
    var erro = [];

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erro.push({texto:"Nome inválido"});
    }

    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        erro.push({texto:"Email inválido"});
    }

    if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){
        erro.push({texto:"Senha inválido"});
    }

    if(!req.body.senha2 || typeof req.body.senha2 == undefined || req.body.senha2 == null){
        erro.push({texto:"Campo 2 de senha inválido"});
    }

    if(req.body.senha.lenght < 4){
        erro.push({texto:"Senha muito curta"});
    }

    if(req.body.senha != req.body.senha2){
        erro.push({texto:"Senhas não coincidem"});
    }

    if(erro.length > 0){

        res.render('usuarios/registro.handlebars',{erro:erro});

    }else{

        console.log("else")
        Usuario.findOne({email:req.body.email}).lean().then((usuario) => {

            console.log(usuario)

            if(usuario){
                
                req.flash('error_msg',"Já existe uma conta com este email");
                res.redirect("http://localhost:8080/usuarios/registro/");

            }else{

                console.log("novo usuario")

                const newUser = new Usuario({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha
                });

                //encriptando senha
                bcrypt.genSalt(10,(erro,salt) => {

                    bcrypt.hash(newUser.senha,salt,(erro,hash) => {

                        if(erro){
                            console.log(erro)
                            req.flash('error_msg',"Houve um erro durante o salvamento")
                            res.redirect("http://localhost:8080/");
                        }else{
                            newUser.senha = hash;

                            newUser.save().then(() => {
                                console.log("ok")
                                req.flash('success_msg',"Usuario registrado com sucesso")
                                res.redirect("http://localhost:8080/");
                            }).catch((err) => {

                                console.log(err)

                                req.flash('error_msg',"Houve um erro durante o salvamento")
                                res.redirect("http://localhost:8080/usuarios/registro/");
                            });
                        }

                    });

                });

            }

        }).catch((err) => {
            req.flash('error_msg',"Houve um erro interno");
            res.redirect("http://localhost:8080/");
        })

    }

});

router.get('/login',(req,res) => {
    res.render('usuarios/login.handlebars');
})


router.post('/login',(req,res,next) => {


    passport.authenticate("local", {

        successRedirect: "/",
        failureRedirect:"/usuarios/login",
        failureFlash:true

    })(req,res,next);

});


router.get('/logout',(req,res) => {
    req.logout()
    req.flash('success_msg',"Deslogado com sucesso")
    res.redirect("/")
})

module.exports = router;