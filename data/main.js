const fs = require("fs");
const axios = require("axios");

class Api {
  static baseUrl = "https://csapp.prolinx.com.br/api";
  //static baseUrl = "http://localhost:8080/api";
  constructor() {
    this.api = axios.create({
      baseURL: Api.baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para adicionar o token de autenticação
    this.api.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  async get(url) {
    try {
      const res = await this.api.get(url);
      return res.data;
    } catch (err) {
      console.error("Axios GET error:", err);
      throw err;
    }
  }

  async post(url, data) {
    try {
      const res = await this.api.post(url, data);
      return res.data;
    } catch (err) {
      console.error("Axios POST error:", err);
      throw err;
    }
  }

  async put(url, data) {
    try {
      const res = await this.api.put(url, data);
      return res.data;
    } catch (err) {
      console.error("Axios PUT error:", err);
      throw err;
    }
  }

  async delete(url) {
    try {
      const res = await this.api.delete(url);
      return res.data;
    } catch (err) {
      console.error("Axios DELETE error:", err);
      throw err;
    }
  }
}

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzQyMTY4MTkxLCJleHAiOjE3NDIyMDIwMDB9.HJdM6H2JbVpZbzPjTmCUH8_FINXgop9sy61DQQXTq5I";
const api = new Api();

// Função para fazer as requisições com intervalo
async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function insereVencimentos() {
  let contratos = await api.get("/contratos");
  contratos = contratos.contratos;
  for (let contrato of contratos) {
    if (!contrato.data_inicio) {
      console.warn(`Contrato ${contrato.id} não tem data_inicio! Pulando...`);
      continue;
    }

    const dt_inicio = new Date(contrato.data_inicio);
    const dt_vencimento = new Date(dt_inicio);
    dt_vencimento.setMonth(dt_vencimento.getMonth() + contrato.duracao);

    await api.post("/vencimento-contratos", {
      id_contrato: contrato.id,
      status: contrato.status,
      data_vencimento: dt_vencimento
    });

    // Aguardar 1,5 segundos antes da próxima requisição
    await delay(1500);
  }
  console.log("Vencimentos inseridos com sucesso!");
}

async function ajustaReajuste() {
  let contratos = await api.get("/contratos");
  contratos = contratos.contratos;
  for (let contrato of contratos) {
    console.log(`Contrato ${contrato.id} com índice de reajuste. Ajustando...`);
    await api.put(`/contratos/${contrato.id}`, { indice_reajuste: 0 });

    // Aguardar 1,5 segundos antes da próxima requisição
    await delay(1500);
  }
  console.log("Índices de reajuste ajustados com sucesso!");
}

function formatDateToMySQL(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

async function getContratosSemInicio() {
  let contratos = await api.get("/contratos");
  contratos = contratos.contratos;
  const contratosSemInicio = contratos.filter(contrato => !contrato.data_inicio);
  for (let contrato of contratosSemInicio) {
    if (!contrato.data_inicio) {
      contrato.data_inicio = formatDateToMySQL(new Date('1980-01-01T00:00:00Z'));
      await api.put(`/contratos/${contrato.id}`, { data_inicio: contrato.data_inicio });

      // Aguardar 1,5 segundos antes da próxima requisição
      await delay(1500);
    }
  }
}

async function ajustaBanco() {
  await getContratosSemInicio();
  await insereVencimentos();
  await ajustaReajuste();
  process.exit();
}

ajustaBanco().catch(console.error);
