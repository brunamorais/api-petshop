const ValorNaoSuportado = require('./erros/ValorNaoSuportado')
const jsontoxml = require('jsontoxml')

class Serializador{
    json(dados){
        return JSON.stringify(dados)
    }
    xml(dados){
        let tag = this.tagSingular
                
        //agrupar os dados no xml
        if(Array.isArray(dados)){
            tag = this.tagPlural
            dados = dados.map((item) =>{
                return {
                    [this.tagSingular]:item
                }
            })
        }
        return jsontoxml({[tag]: dados})
    }
    serializar(dados){
        dados = this.filtrar(dados)
        if(this.contentType === 'application/json'){
            return this.json(dados)
        }
        if(this.contentType === 'application/xml'){
            return this.xml(dados)
        }

        throw new ValorNaoSuportado(this.contentType)
    }
    filtrarObjeto(dados){
        const novoObjeto = {}


        this.camposPublicos.forEach((campo)=>{
            //verifica se a propriedade dados contem o campo (camposPublicos)
            if(dados.hasOwnProperty(campo)){
                novoObjeto[campo] = dados[campo]
            }
        })

        return novoObjeto
    }

    //p poder exibir a lista de fornecedores
    filtrar(dados){
        if(Array.isArray(dados)){
            //se dados for um array, o filtrarObjeto irá passar p cada item da lista
            //e retornar uma nova lista
            dados = dados.map(item => {
                return this.filtrarObjeto(item)})
        }else{
            dados = this.filtrarObjeto(dados)
        }

        return dados
    }
}

class SerializadorFornecedor extends Serializador{
    constructor(contentType, camposExtras){
        super()
        this.contentType = contentType
        this.camposPublicos = [
            'id',
            'empresa',
            'categoria'
        ].concat(camposExtras || [])
        this.tagSingular = 'fornecedor'
        this.tagPlural = 'fornecedores'
    }
}

class SerializadorErro extends Serializador{
    constructor(contentType, camposExtras){
        super()
        this.contentType = contentType
        this.camposPublicos = [
            'id',
            'mensagem'
        ].concat(camposExtras || [])
        this.tagSingular = 'erro'
        this.tagPlural = 'erros'
    }
}

module.exports = {
    Serializador: Serializador,
    SerializadorFornecedor: SerializadorFornecedor,
    SerializadorErro: SerializadorErro,
    //se a aplicação crescer, basta adicionar outros formatos a serem aceitos
    formatosAceitos: ['application/json', 'application/xml']
}