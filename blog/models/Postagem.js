const mongoose = require('mongoose');
const schema = mongoose.Schema;

const Postagem = new schema({

    titulo:{
        type:String,
        require:true
    },
    slug:{
        type:String,
        require:true
    },
    descricao:{
        type:String,
        require:true
    },
    conteudo:{
        type:String,
        require:true
    },
    categoria:{
        type:schema.Types.ObjectId,
        ref:"categorias",
        require:true
    },
    data:{
        type:Date,
        require:Date.now()
    }
});

mongoose.model("postagens",Postagem);