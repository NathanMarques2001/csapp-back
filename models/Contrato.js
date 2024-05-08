class Contrato {
  constructor(id, id_cliente, id_produto, faturado, dia_vencimento, indice_reajuste, proximo_reajuste, status, duracao, valor_mensal, quantidade, email_envio, descricao, data_criacao) {
    this._id = id;
    this._id_cliente = id_cliente;
    this._id_produto = id_produto;
    this._faturado = faturado;
    this._dia_vencimento = dia_vencimento;
    this._indice_reajuste = indice_reajuste;
    this._proximo_reajuste = proximo_reajuste;
    this._status = status;
    this._duracao = duracao;
    this._valor_mensal = valor_mensal;
    this._quantidade = quantidade;
    this._email_envio = email_envio;
    this._descricao = descricao;
    this._data_criacao = data_criacao;
  }

  get id() {
    return this._id;
  }

  get id_cliente() {
    return this._id_cliente;
  }

  get id_produto() {
    return this._id_produto;
  }

  get faturado() {
    return this._faturado;
  }

  get dia_vencimento() {
    return this._dia_vencimento;
  }

  get indice_reajuste() {
    return this._indice_reajuste;
  }

  get proximo_reajuste() {
    return this._proximo_reajuste;
  }

  get status() {
    return this._status;
  }

  get duracao() {
    return this._duracao;
  }

  get valor_mensal() {
    return this._valor_mensal;
  }

  get quantidade() {
    return this._quantidade;
  }

  get email_envio() {
    return this._email_envio;
  }

  get descricao() {
    return this._descricao;
  }

  get data_criacao() {
    return this._data_criacao;
  }

  set faturado(faturado) {
    this._faturado = faturado;
  }

  set dia_vencimento(dia_vencimento) {
    this._dia_vencimento = dia_vencimento;
  }

  set indice_reajuste(indice_reajuste) {
    this._indice_reajuste = indice_reajuste;
  }

  set proximo_reajuste(proximo_reajuste) {
    this._proximo_reajuste = proximo_reajuste;
  }

  set status(status) {
    this._status = status;
  }

  set duracao(duracao) {
    this._duracao = duracao;
  }

  set valor_mensal(valor_mensal) {
    this._valor_mensal = valor_mensal;
  }

  set quantidade(quantidade) {
    this._quantidade = quantidade;
  }

  set email_envio(email_envio) {
    this._email_envio = email_envio;
  }

  set descricao(descricao) {
    this._descricao = descricao;
  }
}