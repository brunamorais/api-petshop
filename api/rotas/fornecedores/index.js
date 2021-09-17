const roteador = require("express").Router();
const TabelaFornecedor = require("./TabelaFornecedor");
const Fornecedor = require("./Fornecedor");
const SerializadorFornecedor = require("../../Serializador").SerializadorFornecedor;

roteador.get("/", async (requisicao, resposta) => {
  //vai esperar esse \/ metodo executar para pegar os dados p enviar no send
  const resultados = await TabelaFornecedor.listar();
  resposta.status(200);
  const serializador = new SerializadorFornecedor(
    resposta.getHeader("Content-Type")
  );

  resposta.send(serializador.serializar(resultados));
});

roteador.post("/", async (requisicao, resposta, proximo) => {
  try {
    const dadosRecebidos = requisicao.body;
    const fornecedor = new Fornecedor(dadosRecebidos);
    await fornecedor.criar();
    resposta.status(201);
    const serializador = new SerializadorFornecedor(
      resposta.getHeader("Content-Type")
    );
    resposta.send(serializador.serializar(fornecedor));
  } catch (erro) {
    proximo(erro);
  }
});

roteador.get("/:idFornecedor", async (requisicao, resposta, proximo) => {
  //tratamento caso o id do fornecedor nao seja encontrado
  try {
    const id = requisicao.params.idFornecedor;
    const fornecedor = new Fornecedor({ id: id });
    await fornecedor.carregar();
    resposta.status(200);
    const serializador = new SerializadorFornecedor(
      resposta.getHeader("Content-Type"),
      ['email', 'dataCriacao', 'dataAtualizacao', 'versao']

    );
    resposta.send(serializador.serializar(fornecedor));
  } catch (erro) {
    proximo(erro);
  }
});

//atualizar os dados
roteador.put("/:idFornecedor", async (requisicao, resposta, proximo) => {
  try {
    const id = requisicao.params.idFornecedor;
    const dadosRecebidos = requisicao.body;
    //função js q junta 2 variaveis diferentes em um objeto só
    //1° passar um objeto raiz, pode ser um objeto vazio
    const dados = Object.assign({}, dadosRecebidos, { id: id });
    const fornecedor = new Fornecedor(dados);

    await fornecedor.atualizar();

    resposta.status(204);
    resposta.end();
  } catch (erro) {
    proximo(erro);
  }
});

roteador.delete("/:idFornecedor", async (requisicao, resposta, proximo) => {
  try {
    const id = requisicao.params.idFornecedor;
    const fornecedor = new Fornecedor({ id: id });
    await fornecedor.carregar();
    await fornecedor.remover();
    resposta.status(204);
    resposta.end();
  } catch (erro) {
    proximo(erro);
  }
});

module.exports = roteador;
