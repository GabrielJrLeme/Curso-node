const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

require('../models/Categoria');
const Categoria = mongoose.model('categorias');

require('../models/Postagem');
const Postagem = mongoose.model('postagens');


router.get('/',(req,res) => {

    Postagem.find().populate('categoria').lean().sort({data:"desc"}).then((postagens) => {

        res.render('index.handlebars',{postagens:postagens});

    }).catch((err) => {

        req.flash('error_msg',"Houve um erro au caregar as postagens");
        res.redirect("/404");

    });
    
});


router.get('/404',(req,res) => {
    res.send("/404");
});


router.get('/postagem/:slug',(req,res) => {

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


router.get('/categorias',(req,res) => {
    
    Categoria.find().lean().then((categorias) => {

        res.render('categoria/index.handlebars',{categorias:categorias});

    }).catch((err) => {

        req.flash('error_msg',"Houve um erro interno");
        res.redirect("/");

    });
});

router.get('/categorias/:slug',(req,res) => {

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


module.exports = router;