const ModeloTabela = require('../rotas/fornecedores/ModeloTabelaFornecedor')


ModeloTabela
    .sync()//sincroniza as configurações
    //trata a promessa q é retornada
    .then(()=> console.log('Tabela criada com sucesso'))
    .catch(console.log)