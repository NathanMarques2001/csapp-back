const { enviarEmailNotificacao } = require("./servicoEmailNotificacoes");

// Simples fila em memória para envio de emails de notificação.
// Processamento em background com controle de concorrência.
const queue = [];
let active = 0;
const CONCURRENCY = 2;

async function worker(task) {
  try {
    await enviarEmailNotificacao(task);
  } catch (err) {
    console.error("[EMAIL_QUEUE] Erro no envio de email (task):", err);
  }
}

function processQueue() {
  if (active >= CONCURRENCY) return;
  const task = queue.shift();
  if (!task) return;
  active += 1;
  // roda sem bloquear o loop principal
  setImmediate(async () => {
    try {
      await worker(task);
    } finally {
      active -= 1;
      // continuar processando enquanto houver tarefas
      if (queue.length > 0) processQueue();
    }
  });
}

function enqueueEmailNotification(task) {
  queue.push(task);
  // dispara processamento
  processQueue();
}

module.exports = { enqueueEmailNotification };
