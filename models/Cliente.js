class Cliente {
  constructor(id, nome, cpf_cnpj, relacionamento, nps, seguimento, data_criacao, gestor_contratos_nome, gestor_contratos_email, gestor_contratos_nascimento, gestor_contratos_telefone1, gestor_contratos_telefone2, gestor_chamados_nome, gestor_chamados_email, gestor_chamados_nascimento, gestor_chamados_telefone1, gestor_chamados_telefone2, gestor_financeiro_nome, gestor_financeiro_email, gestor_financeiro_nascimento, gestor_financeiro_telefone1, gestor_financeiro_telefone2) {
    this._id = id;
    this._nome = nome;
    this._cpf_cnpj = cpf_cnpj;
    this._relacionamento = relacionamento;
    this._nps = nps;
    this._seguimento = seguimento;
    this._data_criacao = data_criacao;
    this._gestor_contratos_nome = gestor_contratos_nome;
    this._gestor_contratos_email = gestor_contratos_email;
    this._gestor_contratos_nascimento = gestor_contratos_nascimento;
    this._gestor_contratos_telefone1 = gestor_contratos_telefone1;
    this._gestor_contratos_telefone2 = gestor_contratos_telefone2;
    this._gestor_chamados_nome = gestor_chamados_nome;
    this._gestor_chamados_email = gestor_chamados_email;
    this._gestor_chamados_nascimento = gestor_chamados_nascimento;
    this._gestor_chamados_telefone1 = gestor_chamados_telefone1;
    this._gestor_chamados_telefone2 = gestor_chamados_telefone2;
    this._gestor_financeiro_nome = gestor_financeiro_nome;
    this._gestor_financeiro_email = gestor_financeiro_email;
    this._gestor_financeiro_nascimento = gestor_financeiro_nascimento;
    this._gestor_financeiro_telefone1 = gestor_financeiro_telefone1;
    this._gestor_financeiro_telefone2 = gestor_financeiro_telefone2;
  }

  validaCpfCnpj(cpf_cnpj) {

  }

  validaEmail(email) {

  }

  validaTelefone(telefone) {

  }

  validaTelefones(telefone1, telefone2) {

  }

  validaData(data) {

  }

  validaNome(nome) {

  }

  get id() {
    return this._id;
  }

  get nome() {
    return this._nome;
  }

  get cpfCnpj() {
    return this._cpf_cnpj;
  }

  get relacionamento() {
    return this._relacionamento;
  }

  get nps() {
    return this._nps;
  }

  get seguimento() {
    return this._seguimento;
  }

  get dataCriacao() {
    return this._data_criacao;
  }

  get gestorContratosNome() {
    return this._gestor_contratos_nome;
  }

  get gestorContratosEmail() {
    return this._gestor_contratos_email;
  }

  get gestorContratosNascimento() {
    return this._gestor_contratos_nascimento;
  }

  get gestorContratosTelefone1() {
    return this._gestor_contratos_telefone1;
  }

  get gestorContratosTelefone2() {
    return this._gestor_contratos_telefone2;
  }

  get gestorChamadosNome() {
    return this._gestor_chamados_nome;
  }

  get gestorChamadosEmail() {
    return this._gestor_chamados_email;
  }

  get gestorChamadosNascimento() {
    return this._gestor_chamados_nascimento;
  }

  get gestorChamadosTelefone1() {
    return this._gestor_chamados_telefone1;
  }

  get gestorChamadosTelefone2() {
    return this._gestor_chamados_telefone2;
  }

  get gestorFinanceiroNome() {
    return this._gestor_financeiro_nome;
  }

  get gestorFinanceiroEmail() {
    return this._gestor_financeiro_email;
  }

  get gestorFinanceiroNascimento() {
    return this._gestor_financeiro_nascimento;
  }

  get gestorFinanceiroTelefone1() {
    return this._gestor_financeiro_telefone1;
  }

  get gestorFinanceiroTelefone2() {
    return this._gestor_financeiro_telefone2;
  }

  set nome(nome) {
    this._nome = nome;
  }

  set cpfCnpj(cpf_cnpj) {
    this._cpf_cnpj = cpf_cnpj;
  }

  set relacionamento(relacionamento) {
    this._relacionamento = relacionamento;
  }

  set nps(nps) {
    this._nps = nps;
  }

  set seguimento(seguimento) {
    this._seguimento = seguimento;
  }

  set dataCriacao(data_criacao) {
    this._data_criacao = data_criacao;
  }

  set gestorContratosNome(gestor_contratos_nome) {
    this._gestor_contratos_nome = gestor_contratos_nome;
  }

  set gestorContratosEmail(gestor_contratos_email) {
    this._gestor_contratos_email = gestor_contratos_email;
  }

  set gestorContratosNascimento(gestor_contratos_nascimento) {
    this._gestor_contratos_nascimento = gestor_contratos_nascimento;
  }

  set gestorContratosTelefone1(gestor_contratos_telefone1) {
    this._gestor_contratos_telefone1 = gestor_contratos_telefone1;
  }

  set gestorContratosTelefone2(gestor_contratos_telefone2) {
    this._gestor_contratos_telefone2 = gestor_contratos_telefone2;
  }

  set gestorChamadosNome(gestor_chamados_nome) {
    this._gestor_chamados_nome = gestor_chamados_nome;
  }

  set gestorChamadosEmail(gestor_chamados_email) {
    this._gestor_chamados_email = gestor_chamados_email;
  }

  set gestorChamadosNascimento(gestor_chamados_nascimento) {
    this._gestor_chamados_nascimento = gestor_chamados_nascimento;
  }

  set gestorChamadosTelefone1(gestor_chamados_telefone1) {
    this._gestor_chamados_telefone1 = gestor_chamados_telefone1;
  }

  set gestorChamadosTelefone2(gestor_chamados_telefone2) {
    this._gestor_chamados_telefone2 = gestor_chamados_telefone2;
  }

  set gestorFinanceiroNome(gestor_financeiro_nome) {
    this._gestor_financeiro_nome = gestor_financeiro_nome;
  }

  set gestorFinanceiroEmail(gestor_financeiro_email) {
    this._gestor_financeiro_email = gestor_financeiro_email;
  }

  set gestorFinanceiroNascimento(gestor_financeiro_nascimento) {
    this._gestor_financeiro_nascimento = gestor_financeiro_nascimento;
  }

  set gestorFinanceiroTelefone1(gestor_financeiro_telefone1) {
    this._gestor_financeiro_telefone1 = gestor_financeiro_telefone1;
  }

  set gestorFinanceiroTelefone2(gestor_financeiro_telefone2) {
    this._gestor_financeiro_telefone2 = gestor_financeiro_telefone2;
  }
}
