// biblioteca p criar api
const express = require('express')
const app = express()
//p poder usar o json
const bodyParser = require('body-parser')
//p usar default.json
const config = require('config')
const roteador = require('./rotas/fornecedores')
//tratamento de erro
const NaoEncontrado = require('./erros/NaoEncontrado')
const CampoInvalido = require('./erros/CampoInvalido')
const DadosNaoFornecidos = require('./erros/DadosNaoFornecidos')
const ValorNaoSuportado = require('./erros/ValorNaoSuportado')
const SerializadorErro = require('./Serializador').SerializadorErro

const formatosAceitos = require('./Serializador').formatosAceitos

app.use(bodyParser.json())

app.use((requisicao, resposta, proximo)=>{
  //verifica se o contentType é json
  let formatoRequisitado = requisicao.header('Accept')

  //quando o client nao especificar o formato q aceita na resposta
  //será "forçado" q resposda em formato json
  if(formatoRequisitado === '*/*'){
    formatoRequisitado = 'application/json'
  }

  //se o resultado da função indexOf for -1 é pq o formatoRequisitado não está dentro do array de formatosAceitos
  if(formatosAceitos.indexOf(formatoRequisitado) === -1){
    resposta.status(406)
    resposta.end()
    return
  }
  resposta.setHeader('Content-Type', formatoRequisitado)
  proximo()
})

app.use('/api/fornecedores', roteador)

//tratamento de erros p usar em varias rotas
app.use((erro, requisicao, resposta, proximo)=>{
    let status = 500
    //verifica se o erro é do NaoEncontrado ou de uma variavel de erro comum
    if(erro instanceof NaoEncontrado){
        status = 404
      }
      if(erro instanceof CampoInvalido || erro instanceof DadosNaoFornecidos){
        status = 400
      }
      if(erro instanceof ValorNaoSuportado){
        status = 406
      }
      const serializador = new SerializadorErro(
        resposta.getHeader('Content-Type')
      )
      resposta.status(status)
      resposta.send(
        serializador.serializar({
          mensagem: erro.message,
          id: erro.idErro
        })
      )
})



app.listen(config.get('api.porta'), ()=> console.log('API funcionando'))

