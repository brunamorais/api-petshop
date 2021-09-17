class NaoEncontrado extends Error{
    constructor(){
        //chama o construtor da class Error
        super('Fornecedor não foi encontrado!')
        this.name = 'NaoEncontrado'
        this.idErro = 0
    }
}

module.exports = NaoEncontrado