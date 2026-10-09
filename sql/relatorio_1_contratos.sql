-- ========================================================================================
-- RELATÓRIO 1: GESTÃO DE CONTRATOS (BASE COMPLETA: ATIVOS E INATIVOS)
-- ========================================================================================
-- Descrição:
--   Lista todos os contratos cadastrados no banco de dados (ativos e inativos),
--   contendo dados do cliente, datas de vigência, vencimento, valores, índices de
--   reajuste, produto/solução, vendedor, BDM (VP) e grupo econômico.
--
-- Observação importante:
--   - Considera TODA a base (ativos e inativos), sem filtros restritivos no WHERE.
--   - BDM refere-se ao campo 'vp' associado ao cliente (relacionamento com a tabela 'usuarios').
--   - Duração 12000 meses representa contrato por prazo 'Indeterminado'.
-- ========================================================================================

SELECT 
    cli.cpf_cnpj                                            AS "CNPJ",
    COALESCE(cli.nome_fantasia, cli.razao_social)           AS "Cliente",
    cli.razao_social                                        AS "Razão Social",
    sol.nome                                                AS "Solução ofertada/produto",
    con.valor_mensal                                        AS "Valor",
    con.tipo_faturamento                                    AS "Faturamento/ Periodicidade",
    con.status                                              AS "Status do Contrato",
    cli.status                                              AS "Status do Cliente",
    
    -- Prazo / Expiração do Contrato
    CASE 
        WHEN con.duracao = 12000 THEN 'Indeterminado'
        WHEN con.duracao IS NULL THEN 'Não informado'
        ELSE CONCAT(con.duracao, ' MESES')
    END                                                     AS "Prazo/ Expiração do Contrato",

    -- Data de Início do Contrato
    DATE_FORMAT(con.data_inicio, '%d/%m/%Y')                AS "Data de Início",

    -- Data de Vencimento / Data Final do Contrato
    CASE 
        WHEN con.duracao = 12000 THEN 'Indeterminado'
        WHEN con.data_inicio IS NULL THEN 'Não informada'
        ELSE DATE_FORMAT(DATE_ADD(con.data_inicio, INTERVAL con.duracao MONTH), '%d/%m/%Y')
    END                                                     AS "Data de Vencimento/Data Final",

    -- Índice de Reajuste
    UPPER(COALESCE(NULLIF(con.nome_indice, ''), 'NÃO INFORMADO')) AS "Índice de Reajuste",
    con.indice_reajuste                                     AS "Percentual Reajuste (%)",
    
    -- Data do Reajuste
    DATE_FORMAT(con.proximo_reajuste, '%d/%m/%Y')           AS "Data do Reajuste",

    -- Responsáveis Comerciais
    COALESCE(usu.nome, 'Não informado')                     AS "Vendedor",
    COALESCE(vp_usu.nome, 'Não informado')                  AS "BDM",

    -- Grupo Econômico
    CASE 
        WHEN cli.id_grupo_economico IS NOT NULL AND ge.id IS NOT NULL THEN 'sim' 
        ELSE 'não' 
    END                                                     AS "Pertence a um grupo Econômico (sim/não)",
    COALESCE(ge.nome, 'Não possui')                         AS "Grupo Econômico"

FROM contratos con
INNER JOIN clientes cli          ON con.id_cliente = cli.id
INNER JOIN produtos sol          ON con.id_produto = sol.id
LEFT JOIN usuarios usu           ON cli.id_usuario = usu.id
LEFT JOIN usuarios vp_usu        ON cli.vp = vp_usu.id
LEFT JOIN grupos_economicos ge   ON cli.id_grupo_economico = ge.id

ORDER BY 
    con.status ASC,
    cli.razao_social ASC;
