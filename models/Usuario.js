class Usuario {
  constructor(id, nome, email, tipo, senha) {
    this.id = id;
    this.nome = nome;
    this.email = email;
    this.tipo = tipo;
    this.senha = senha;
  }

  get id() {
    return this._id;
  }

  get nome() {
    return this._nome;
  }

  get email() {
    return this._email;
  }

  get tipo() {
    return this._tipo;
  }

  get senha() {
    return this._senha;
  }

  set nome(nome) {
    this._nome = nome;
  }

  set email(email) {
    this._email = email;
  }

  set tipo(tipo) {
    this._tipo = tipo;
  }

  set senha(senha) {
    this._senha = senha;
  }
}