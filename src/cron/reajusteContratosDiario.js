const cron = require("node-cron");
const {
  ajustaIndice,
  ajustaValorMensal,
  reprocessaContratosErro,
  ajustaNovaData,
} = require("../controllers/ReajustaContratosController");

// Horário de execução: todos os dias às 03:00 da manhã
cron.schedule("0 3 * * *", async () => {
  console.log("[CRON] Iniciando rotina de reajuste de contratos...");

  try {
    await ajustaValorMensal();
    await ajustaIndice();
    await reprocessaContratosErro();
    await ajustaNovaData();

    console.log("[CRON] Reajuste de contratos concluído com sucesso.");
  } catch (err) {
    console.error(`[CRON] Erro ao reajustar contratos: ${err.message}`);
  }
});
