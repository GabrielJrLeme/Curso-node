const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

require('../models/Categoria');
const Categoria = mongoose.model('categorias');

//Rotas

router.get('/', (req,res) => {
    res.render('admin/index.handlebars');
});



router.get('/posts', (req,res) => {
    res.send("Post")
});



router.get('/categorias', (req,res) => {

    Categoria.find({}).sort({date:'desc'}).lean().then((categorias) => {

        res.render('admin/categorias.handlebars',{categorias:categorias});

    }).catch((err) => {
        req.flash('error_msg',"Houve um erro ao listar as categorias"+err);
        res.redirect('http://localhost:8080/admin');

    });
    
});



router.get('/categorias/add', (req,res) => {
    res.render('admin/addCategorias.handlebars');
});



router.post('/categorias/nova',(req,res) => {

    //Validação de form

    let erros = [];

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto:"Nome inválido"});
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto:"Slug invalido"});
    }
        
    if(req.body.nome.length < 2){
        erros.push({texto:"Nome muito pequeno"});
    }

    if(erros.length > 0){
        res.render('admin/addCategorias.handlebars',{erros:erros});

    }else{
        //Recebendo dados do post
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        };
        //Criando nova categoria
        new Categoria(novaCategoria).save().then(() => {
            req.flash('success_msg',"Categoria criada com sucesso");
            res.redirect('http://localhost:8080/admin/categorias');

        }).catch((err) => {
            req.flash('error_msg',"Erro! Não foi posssivel salvar a nova categoria");
            res.redirect('http://localhost:8080/admin');

        });
    }

});



router.get('/categoria/edit/:id',(req,res) => {

    Categoria.findOne({_id:req.params.id}).lean().then((categoria) => {

        res.render('admin/editCategoria.handlebars',{categoria:categoria});

    }).catch((err) => {
        req.flash('error_msg',"Houve ao buscar a categoria");
        res.redirect('http://localhost:8080/admin/categorias');

    });
    
});



router.post('/categoria/edit',(req,res) => {

    //Validação de form

    let erros = [];

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto:"Nome inválido"});
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto:"Slug invalido"});
    }
        
    if(req.body.nome.length < 2){
        erros.push({texto:"Nome muito pequeno"});
    }

    if(erros.length > 0){
        res.render('admin/editCategorias.handlebars',{erros:erros});

    }else{


        Categoria.updateMany({_id:req.body.id}).then(() => {

            req.flash('success_msg',"Categoria editada com sucesso.");
            res.redirect('http://localhost:8080/admin/categorias');

        }).catch((err) => {

            req.flash('error_msg',"Houve um erro ao tentar editar."+err);
            res.redirect('http://localhost:8080/admin/categorias');
            
        });
       
    }

});


router.post('/categorias/deletar',(req,res) =>{

    Categoria.deleteOne({_id:req.body.id}).then(() => {

        req.flash('success_msg',"Categoria deletada com sucesso.");
        res.redirect('http://localhost:8080/admin/categorias');

    }).catch((err) => {

        req.flash('error_msg',"Houve um erro ao tentar deletar."+err);
        res.redirect('http://localhost:8080/admin/categorias');
        
    });


});

module.exports = router;