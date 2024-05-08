class Fabricante {
  constructor(id, nome) {
    this._id = id;
    this._nome = nome;
  }

  get id() {
    return this._id;
  }

  get nome() {
    return this._nome;
  }

  set nome(nome) {
    this._nome = nome;
  }
}