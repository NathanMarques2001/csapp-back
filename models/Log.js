class Log {
  constructor(id, id_usuario, id_contrato, criacao) {
    this._id = id;
    this._id_usuario = id_usuario;
    this._id_contrato = id_contrato;
    this._criacao = criacao;
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

  get criacao() {
    return this._criacao;
  }
}