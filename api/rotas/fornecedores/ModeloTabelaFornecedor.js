const Sequelize = require('sequelize')
const instacia = require('../../banco-de-dados')

const colunas ={
    empresa:{
        type: Sequelize.STRING,
        allowNull: false
    },
    email:{
        type: Sequelize.STRING,
        allowNull: false
    },
    categoria:{
        type: Sequelize.ENUM('racao', 'brinquedos'),
        allowNull: false
    }
}

const opcoes = {
    freezeTableName: true,
    tableName: 'fornecedores',
    //sequeliza cria automaticamente as datas, so precisa ativar
    timestamps: true,
    //renomeando os campos de data
    createAt: 'dataCraicao',
    updateAt: 'dataAtualizacao',
    version: 'versao'

}

module.exports = instacia.define('fornecedor', colunas, opcoes)