const connection = require("../database");
const { QueryTypes } = require("sequelize");

module.exports = {
    async getRelatorioGeral(req, res) {
        try {
            const query = `
        SELECT
          cli.razao_social,
          cli.nome_fantasia,
          cli.cpf_cnpj,
          sol.nome AS solucao,
          con.valor_mensal AS valor_contrato,
          usu.nome AS vendedor,
          cli.status,
          cli.gestor_chamados_nome,
          cli.gestor_chamados_email,
          cli.gestor_chamados_telefone_1,
          cli.gestor_chamados_telefone_2,
          cli.gestor_financeiro_nome,
          cli.gestor_financeiro_email,
          cli.gestor_financeiro_telefone_1,
          cli.gestor_financeiro_telefone_2,
          cli.gestor_contratos_nome,
          cli.gestor_contratos_email,
          cli.gestor_contratos_telefone_1,
          cli.gestor_contratos_telefone_2,
          cli.id as id_cliente,
          sol.id as id_produto,
          usu.id as id_vendedor,
          con.status as status_contrato
        FROM contratos con
        INNER JOIN clientes cli ON con.id_cliente = cli.id
        INNER JOIN produtos sol ON con.id_produto = sol.id
        INNER JOIN usuarios usu ON cli.id_usuario = usu.id;
      `;

            const resultados = await connection.query(query, {
                type: QueryTypes.SELECT,
            });

            res.status(200).json(resultados);
        } catch (error) {
            console.error("Erro ao gerar relatório geral:", error);
            res.status(500).json({ error: "Erro ao gerar relatório geral." });
        }
    },
};
