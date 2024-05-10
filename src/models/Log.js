class Log {
  constructor(id, id_usuario, id_contrato, data_criacao, alteracao) {
    this._id = id;
    this._id_usuario = id_usuario;
    this._id_contrato = id_contrato;
    this._data_criacao = data_criacao;
    this._alteracao = alteracao;
  }

  get id() {
    return this._id;
  }

  get id_usuario() {
    return this._id_usuario;
  }

  get id_contrato() {
    return this._id_contrato;
  }

  get data_criacao() {
    return this._data_criacao;
  }

  get alteracao() {
    return this._alteracao;
  }
}