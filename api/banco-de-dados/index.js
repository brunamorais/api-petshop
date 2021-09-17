const Sequelize = require('sequelize')
//p usar os dados do default.json
const config = require('config')

const instancia= new Sequelize(
    //passando os dados no default.json
    config.get('mysql.banco-de-dados'),
    config.get('mysql.usuario'),
    config.get('mysql.senha'),
    {
        host: config.get('mysql.host'),
        dialect: 'mysql'
    }
)

module.exports = instancia