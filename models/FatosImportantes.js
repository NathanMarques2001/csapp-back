class FatosImportantes {
  constructor(id, id_contrato, conteudo, data_criacao) {
    this._id = id;
    this._id_contrato = id_contrato;
    this._conteudo = conteudo;
    this._data_criacao = data_criacao;
  }

  get id() {
    return this._id;
  }

  get id_contrato() {
    return this._id_contrato;
  }

  get conteudo() {
    return this._conteudo;
  }

  get data_criacao() {
    return this._data_criacao;
  }

  set conteudo(conteudo) {
    this._conteudo = conteudo;
  }
}