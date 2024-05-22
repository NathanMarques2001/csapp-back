const Cliente = require('../models/Cliente');

function Validate(cpf) {
  let cpfValido = 0;
  resto = 0;
  //Se os caracteres do cpf forem iguais incrementa
  for (let i = 0; i < cpf.length; i++) {
      if (cpf[i] === cpf[i + 1]) {
          cpfValido++;
      }
  }
  if (cpfValido === 10 || cpf.length > 11) {
      console.log("FORMATO DE CPF INVALIDO!");
      return false;
  } else {
      //Armazena o cpf no formato int
      const finalCpf = parseInt(cpf.join(''));
      let arrMult = [10, 9, 8, 7, 6, 5, 4, 3, 2];
      let digito;
      let soma = 0;

      //Retira os dois ultimos digitos
      cpf.pop();
      cpf.pop();

      //multiplica os valores de 10 a 2 pelos 9 primeiros digitos do cpf
      for (let i = 0; i < cpf.length; i++) {
          soma += arrMult[i] * cpf[i];
      }
      resto = soma % 11;

      if (resto >= 2) {
          digito = 11 - resto;
      } else {
          digito = 0;
      }

      //Adiciona os calculos no final do array do cpf
      cpf.push(digito);

      //Adiciona o valor 11 no começo do array de multiplicações
      arrMult.unshift(11);
      soma = 0;

      //A partir daqui faz a mesma coisa que anteriormente
      for (let i = 0; i < cpf.length; i++) {
          soma += arrMult[i] * cpf[i];
      }
      resto = soma % 11;

      if (resto >= 2) {
          digito = 11 - resto;
      } else {
          digito = 0;
      }

      cpf.push(digito);

      //Formata o array de cpf e salva na variavel como int
      const reformatCpf = parseInt(cpf.join(''));

      //Se o numero resultado de todas as operações anteriores
      //for igual ao cpf salvo no começo da função o cpf é valido
      if (reformatCpf === finalCpf) {
          return true;
      }
      return false;
  }
}

function validatCNPJ(cnpj) {
  const multiplyArray = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let resto = 0;

  if (cnpj.length == 14) {
      const finalCnpj = parseInt(cnpj.join(''));
      let digito;
      let soma = 0;

      cnpj.pop();
      cnpj.pop();

      for (let i = 0; i < cnpj.length; i++) {
          soma += multiplyArray[i] * cnpj[i];
      }
      resto = soma % 11;

      if (resto >= 2) {
          digito = 11 - resto;
      } else {
          digito = 0;
      }

      cnpj.push(digito);

      multiplyArray.unshift(6);
      soma = 0;

      for (let i = 0; i < cnpj.length; i++) {
          soma += multiplyArray[i] * cnpj[i];
      }
      resto = soma % 11;

      if (resto >= 2) {
          digito = 11 - resto;
      } else {
          digito = 0;
      }

      cnpj.push(digito);

      const reformatCnpj = parseInt(cnpj.join(''));

      if (reformatCnpj == finalCnpj) {
       
          return true;
      } else {
         return false
      }
  }
}

function validateCPFOrCNPJ(cpf_cnpj, res) {
  if (cpf_cnpj.length === 11) {
      // Se for CPF, valida
      if (!validateCPF(cpf_cnpj)) {
          return res.status(400).send({ message: 'CPF inválido!' });
      }
  } else if (cpf_cnpj.length === 14) {
      // Se for CNPJ, valida
      if (!validateCNPJ(cpf_cnpj)) {
          return res.status(400).send({ message: 'CNPJ inválido!' });
      }
  } else {
      // Se não for nem CPF nem CNPJ válido
      return res.status(400).send({ message: 'CPF/CNPJ inválido!' });
  }
}


module.exports = {
  async index(req, res) {
    
    try {
      const { id } = req.params;

      const cliente = await Cliente.findByPk(id);

      if (!cliente) {
        return res.status(404).send({ message: 'Cliente não encontrado!' });
      }

      return res.status(200).send({ cliente });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Erro ao buscar o cliente.' });
    }
  },

  async indexAll(req, res) {
    try {
      const clientes = await Cliente.findAll();

      if (clientes.length == 0) {
        return res.status(404).send({ message: 'Nenhum cliente cadastrado!' });
      }

      return res.status(200).send({ clientes });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Erro ao buscar os clientes.' });
    }
  },

  async store(req, res) {
    try {
      const { nome, cpf_cnpj, relacionamento, nps, seguimento, data_criacao, gestor_contratos_nome, gestor_contratos_email, gestor_contratos_nascimento, gestor_contratos_telefone_1, gestor_contratos_telefone_2, gestor_chamados_nome, gestor_chamados_email, gestor_chamados_nascimento, gestor_chamados_telefone_1, gestor_chamados_telefone_2, gestor_financeiro_nome, gestor_financeiro_email, gestor_financeiro_nascimento, gestor_financeiro_telefone_1, gestor_financeiro_telefone_2 } = req.body;

       // Chama a função para validar CPF ou CNPJ
       const validationError = validateCPFOrCNPJ(cpf_cnpj, res);
       if (validationError) return validationError;

      const cliente = await Cliente.create({ nome, cpf_cnpj, relacionamento, nps, seguimento, data_criacao, gestor_contratos_nome, gestor_contratos_email, gestor_contratos_nascimento, gestor_contratos_telefone_1, gestor_contratos_telefone_2, gestor_chamados_nome, gestor_chamados_email, gestor_chamados_nascimento, gestor_chamados_telefone_1, gestor_chamados_telefone_2, gestor_financeiro_nome, gestor_financeiro_email, gestor_financeiro_nascimento, gestor_financeiro_telefone_1, gestor_financeiro_telefone_2 });

      return res.status(201).send({
        message: 'Cliente criado com sucesso!',
        cliente
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Ocorreu um erro ao criar o cliente.' });
    }
  },

  async update(req, res) {
    try {
      const { nome, cpf_cnpj, relacionamento, nps, seguimento, data_criacao, gestor_contratos_nome, gestor_contratos_email, gestor_contratos_nascimento, gestor_contratos_telefone_1, gestor_contratos_telefone_2, gestor_chamados_nome, gestor_chamados_email, gestor_chamados_nascimento, gestor_chamados_telefone_1, gestor_chamados_telefone_2, gestor_financeiro_nome, gestor_financeiro_email, gestor_financeiro_nascimento, gestor_financeiro_telefone_1, gestor_financeiro_telefone_2 } = req.body;
      const { id } = req.params;

      const cliente = await Cliente.findByPk(id);

      if (!cliente) {
        return res.status(404).send({ message: 'Cliente não encontrado!' });
      }

      // Chama a função para validar CPF ou CNPJ
      const validationError = validateCPFOrCNPJ(cpf_cnpj, res);
       if (validationError) return validationError;

      // Continua com a atualização do cliente se o CPF/CNPJ for válido
      await Cliente.update({ nome, cpf_cnpj, relacionamento, nps, seguimento, data_criacao, gestor_contratos_nome, gestor_contratos_email, gestor_contratos_nascimento, gestor_contratos_telefone_1, gestor_contratos_telefone_2, gestor_chamados_nome, gestor_chamados_email, gestor_chamados_nascimento, gestor_chamados_telefone_1, gestor_chamados_telefone_2, gestor_financeiro_nome, gestor_financeiro_email, gestor_financeiro_nascimento, gestor_financeiro_telefone_1, gestor_financeiro_telefone_2 }, { where: { id: id } });

      return res.status(200).send({ message: 'Cliente atualizado com sucesso!' });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Ocorreu um erro ao atualizar o cliente.' });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;

      const cliente = await Cliente.findByPk(id);

      if (!cliente) {
        return res.status(404).send({ message: 'Cliente não encontrado!' });
      }

      Cliente.destroy({ where: { id: id } });

      return res.status(200).send({ message: 'Cliente deletado com sucesso!' });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Ocorreu um erro ao deletar o cliente.' });
    }
  }
}
