const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

require('../models/Categoria');
const Categoria = mongoose.model('categorias');

require('../models/Postagem');
const Postagem = mongoose.model('postagens');

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








router.get('/postagens', (req,res) => {
    
    Postagem.find().populate('categoria').lean().sort({data:"desc"}).then((postagens) => {

        res.render('admin/postagens.handlebars',{postagens:postagens});

    }).catch((err) =>{
        
        req.flash('error_msg',"Erro! Não foi posssivel listar as postagens");
        res.redirect('http://localhost:8080/admin');
    });

});


router.get('/postagens/add', (req,res) => {

    Categoria.find({}).sort({date:'desc'}).lean().then((categorias) => {

        res.render('admin/addPostagem.handlebars',{categorias:categorias});

    }).catch((err) => {

        req.flash('error_msg',"Houve um erro ao carregar o formulario."+err);
        res.redirect('http://localhost:8080/admin');
        
    });
    
});


router.post('/postagens/nova', (req,res) => {

    let erro = [];

    if(req.body.categoria == 0){
        erro.push({text:"Categoria invalida"});
    }

    if(erro.length > 0){
        res.render('admin/addPostagem.handlebars',{erro:erro});
    }else{


        const novaPostagem = {

            titulo:req.body.titulo,
            slug:req.body.slug,
            descricao:req.body.descricao,
            conteudo:req.body.conteudo,
            categoria:req.body.categoria

        };

        new Postagem(novaPostagem).save().then(() => {

            req.flash('success_msg',"Postagem criada com sucesso");
            res.redirect('http://localhost:8080/admin/postagens');

        }).catch((err) => {

            req.flash('error_msg',"Erro! Não foi posssivel salvar a nova postagem");
            res.redirect('http://localhost:8080/admin/postagens');

        });

    }
    
});


router.get('/postagem/edit/:id',(req,res) => {

    Postagem.findOne({_id:req.params.id}).lean().then((postagem) => {

        Categoria.find({}).lean().then((categorias) => {

            res.render('admin/editPostagem.handlebars',{categorias:categorias,postagem:postagem});        
    
        }).catch((err) => {

            req.flash('error_msg',"Houve ao buscar as categorias");
            res.redirect('http://localhost:8080/admin/postagens');
    
        });
    

    }).catch((err) => {
        req.flash('error_msg',"Houve ao buscar a Postagem");
        res.redirect('http://localhost:8080/admin/postagens');

    });
    
});



router.post('/postagem/edit', (req,res) => {

    let erro = [];

    if(req.body.categoria == 0){
        erro.push({text:"Categoria invalida"});
    }

    if(erro.length > 0){
        res.render('admin/addPostagem.handlebars',{erro:erro});
    }else{

        console.log("oi")

        Postagem.findOne({_id:req.body.id}).then((postagem) => {

            postagem.titulo = req.body.titulo;
            postagem.slug = req.body.slug;
            postagem.descricao = req.body.descricao;
            postagem.conteudo = req.body.conteudo;
            postagem.categoria = req.body.categoria;

            postagem.save().then(() => {

                req.flash('success_msg',"Postagem editada com sucesso.");
                res.redirect('http://localhost:8080/admin/postagens');
                
            }).catch((err) => {

                req.flash('error_msg',"Houve um erro ao tentar editar a postagem."+err);
                res.redirect('http://localhost:8080/admin/postagens');
                
            });

        }).catch((err) => {

            req.flash('error_msg',"Houve um erro ao tentar editar a postagem."+err);
            res.redirect('http://localhost:8080/admin/postagens');
            
        });

    }
    
});


router.post('/postagem/deletar',(req,res) =>{

    Postagem.deleteOne({_id:req.body.id}).then(() => {

        req.flash('success_msg',"Postagem deletada com sucesso.");
        res.redirect('http://localhost:8080/admin/postagens');

    }).catch((err) => {

        req.flash('error_msg',"Houve um erro ao tentar deletar."+err);
        res.redirect('http://localhost:8080/admin/postagens');
        
    });


});

module.exports = router;