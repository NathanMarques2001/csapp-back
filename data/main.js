const fs = require("fs");
const axios = require("axios");

class Api {
  //static baseUrl = "http://20.186.19.140/api";
  static baseUrl = "http://localhost:8080/api";
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

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzQxNTY3ODA2LCJleHAiOjE3NDE1OTcyMDB9.XDByKiwHMZQxvISZWa03RpsQDoOkS0_CCDKB3DXQizw";
const api = new Api();

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
  }
  console.log("Vencimentos inseridos com sucesso!");
}

async function ajustaReajuste(){
  let contratos = await api.get("/contratos");
  contratos = contratos.contratos;
  for (let contrato of contratos) {
    if (contrato.indice_reajuste) {
      console.log(`Contrato ${contrato.id} com índice de reajuste. Ajustando...`);
      await api.put(`/contratos/${contrato.id}`, { indice_reajuste: 0 });
    }
  }
  console.log("Índices de reajuste ajustados com sucesso!");
}

async function ajustaBanco() {
  await insereVencimentos();
  await ajustaReajuste();
  process.exit();
}

ajustaBanco().catch(console.error);
/*
uploadData();

function uploadData() {
  const api = new Api();

  uploadSegments(api);
  uploadFab(api);
  uploadProducts(api);
  uploadFaturados(api);
  uploadClients(api);
}

function uploadFab(api) {
  fs.readFile('./json/fabricantes.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Erro ao ler o arquivo:', err);
      return;
    }

    const fabricantes = JSON.parse(data);

    // Manipule os dados aqui
    fabricantes.forEach(async fabricante => {
      await api.post("/fabricantes", fabricante);
    });
  });
}

function uploadProducts(api) {
  fs.readFile('./json/produtos.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Erro ao ler o arquivo:', err);
      return;
    }

    const produtos = JSON.parse(data);

    // Manipule os dados aqui
    produtos.forEach(async produto => {
      await api.post("/produtos", produto);
    });
  });
}

function uploadFaturados(api) {
  fs.readFile('./json/faturados.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Erro ao ler o arquivo:', err);
      return;
    }

    const faturados = JSON.parse(data);

    // Manipule os dados aqui
    faturados.forEach(async faturado => {
      await api.post("/faturados", faturado);
    });
  });
}

function uploadSegments(api) {
  fs.readFile('./json/segmentos.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Erro ao ler o arquivo:', err);
      return;
    }

    const segmentos = JSON.parse(data);

    // Manipule os dados aqui
    segmentos.forEach(async segmento => {
      await api.post("/segmentos", segmento);
    });
  });
}

function uploadClients(api) {
  fs.readFile('./json/clientes.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Erro ao ler o arquivo:', err);
      return;
    }

    const clientes = JSON.parse(data);

    // Manipule os dados aqui
    clientes.forEach(async cliente => {
      await api.post("/clientes", cliente);
    });
  });
}
  */