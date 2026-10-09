-- ========================================================================================
-- CSAPP - SCRIPTS SQL PARA GERAÇÃO DE RELATÓRIOS
-- AMBIENTE: BACKEND (MYSQL)
-- OBSERVAÇÃO: CONSIDERA TODA A BASE (ATIVOS E INATIVOS)
-- ========================================================================================


-- ========================================================================================
-- 1. RELATÓRIO 1: GESTÃO DE CONTRATOS (TODOS: ATIVOS E INATIVOS)
-- ========================================================================================
-- Colunas solicitadas:
--   CNPJ | Cliente | Data de Vencimento/Data Final | Valor | Prazo/ Expiração do Contrato |
--   Índice de Reajuste | Data do Reajuste | Status | Faturamento/ Periodicidade |
--   Solução ofertada/produto | Vendedor | BDM | Pertence a um grupo Econômico | Grupo Econômico
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

    -- Data de Início original
    DATE_FORMAT(con.data_inicio, '%d/%m/%Y')                AS "Data de Início",

    -- Data de Vencimento / Data Final do Contrato (vigência calculada)
    CASE 
        WHEN con.duracao = 12000 THEN 'Indeterminado'
        WHEN con.data_inicio IS NULL THEN 'Não informada'
        ELSE DATE_FORMAT(DATE_ADD(con.data_inicio, INTERVAL con.duracao MONTH), '%d/%m/%Y')
    END                                                     AS "Data de Vencimento/Data Final",

    -- Índice de Reajuste e Percentual
    UPPER(COALESCE(NULLIF(con.nome_indice, ''), 'NÃO INFORMADO')) AS "Índice de Reajuste",
    con.indice_reajuste                                     AS "Percentual Reajuste (%)",
    
    -- Data do Reajuste
    DATE_FORMAT(con.proximo_reajuste, '%d/%m/%Y')           AS "Data do Reajuste",

    -- Vendedor e BDM (VP no banco)
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



-- ========================================================================================
-- 2. RELATÓRIO 2: CONTATOS DOS GESTORES E ANIVERSARIANTES (TODOS: ATIVOS E INATIVOS)
-- ========================================================================================
-- Colunas solicitadas:
--   CNPJ | Nome do Cliente (Razão social) | Nome do Gestor de Contrato |
--   Nome do Gestor Financeiro | Nome do Gestor de Chamados | E-mail |
--   Telefone 1 | Telefone 2 | Data de aniversário
-- ========================================================================================

-- OPÇÃO 2.1 (RECOMENDADA): 1 LINHA POR GESTOR (UNPIVOT) - PERFEITO PARA DISPARO E CONTATOS
SELECT 
    cli.cpf_cnpj                                            AS "CNPJ",
    cli.razao_social                                        AS "Nome do Cliente (Razão social)",
    cli.nome_fantasia                                       AS "Nome Fantasia",
    cli.status                                              AS "Status do Cliente",
    'Gestor de Contrato'                                    AS "Tipo de Gestor",
    cli.gestor_contratos_nome                               AS "Nome do Gestor",
    cli.gestor_contratos_email                              AS "E-mail",
    cli.gestor_contratos_telefone_1                         AS "Telefone 1",
    cli.gestor_contratos_telefone_2                         AS "Telefone 2",
    cli.gestor_contratos_nascimento                         AS "Data de aniversário"
FROM clientes cli
WHERE cli.gestor_contratos_nome IS NOT NULL AND TRIM(cli.gestor_contratos_nome) <> ''

UNION ALL

SELECT 
    cli.cpf_cnpj                                            AS "CNPJ",
    cli.razao_social                                        AS "Nome do Cliente (Razão social)",
    cli.nome_fantasia                                       AS "Nome Fantasia",
    cli.status                                              AS "Status do Cliente",
    'Gestor Financeiro'                                     AS "Tipo de Gestor",
    cli.gestor_financeiro_nome                              AS "Nome do Gestor",
    cli.gestor_financeiro_email                             AS "E-mail",
    cli.gestor_financeiro_telefone_1                        AS "Telefone 1",
    cli.gestor_financeiro_telefone_2                        AS "Telefone 2",
    cli.gestor_financeiro_nascimento                        AS "Data de aniversário"
FROM clientes cli
WHERE cli.gestor_financeiro_nome IS NOT NULL AND TRIM(cli.gestor_financeiro_nome) <> ''

UNION ALL

SELECT 
    cli.cpf_cnpj                                            AS "CNPJ",
    cli.razao_social                                        AS "Nome do Cliente (Razão social)",
    cli.nome_fantasia                                       AS "Nome Fantasia",
    cli.status                                              AS "Status do Cliente",
    'Gestor de Chamados'                                    AS "Tipo de Gestor",
    cli.gestor_chamados_nome                                AS "Nome do Gestor",
    cli.gestor_chamados_email                               AS "E-mail",
    cli.gestor_chamados_telefone_1                          AS "Telefone 1",
    cli.gestor_chamados_telefone_2                          AS "Telefone 2",
    cli.gestor_chamados_nascimento                          AS "Data de aniversário"
FROM clientes cli
WHERE cli.gestor_chamados_nome IS NOT NULL AND TRIM(cli.gestor_chamados_nome) <> ''

ORDER BY 
    `Nome do Cliente (Razão social)` ASC,
    `Tipo de Gestor` ASC;


-- OPÇÃO 2.2: 1 LINHA POR CLIENTE (TODOS OS GESTORES E SEUS RESPECTIVOS CONTATOS LADO A LADO)
/*
SELECT 
    cli.cpf_cnpj                                            AS "CNPJ",
    cli.razao_social                                        AS "Nome do Cliente (Razão social)",
    cli.nome_fantasia                                       AS "Nome Fantasia",
    cli.status                                              AS "Status do Cliente",

    -- Gestor de Contrato
    cli.gestor_contratos_nome                               AS "Nome do Gestor de Contrato",
    cli.gestor_contratos_email                              AS "E-mail (Contrato)",
    cli.gestor_contratos_telefone_1                         AS "Telefone 1 (Contrato)",
    cli.gestor_contratos_telefone_2                         AS "Telefone 2 (Contrato)",
    cli.gestor_contratos_nascimento                         AS "Data de Aniversário (Contrato)",

    -- Gestor Financeiro
    cli.gestor_financeiro_nome                              AS "Nome do Gestor Financeiro",
    cli.gestor_financeiro_email                             AS "E-mail (Financeiro)",
    cli.gestor_financeiro_telefone_1                        AS "Telefone 1 (Financeiro)",
    cli.gestor_financeiro_telefone_2                        AS "Telefone 2 (Financeiro)",
    cli.gestor_financeiro_nascimento                        AS "Data de Aniversário (Financeiro)",

    -- Gestor de Chamados
    cli.gestor_chamados_nome                                AS "Nome do Gestor de Chamados",
    cli.gestor_chamados_email                               AS "E-mail (Chamados)",
    cli.gestor_chamados_telefone_1                          AS "Telefone 1 (Chamados)",
    cli.gestor_chamados_telefone_2                          AS "Telefone 2 (Chamados)",
    cli.gestor_chamados_nascimento                          AS "Data de Aniversário (Chamados)"

FROM clientes cli
ORDER BY 
    cli.status ASC,
    cli.razao_social ASC;
*/



-- ========================================================================================
-- 3. RELATÓRIO 3: BASE GERAL DE CLIENTES E SEGMENTOS (TODOS: ATIVOS E INATIVOS)
-- ========================================================================================
-- Colunas solicitadas:
--   Razão Social | Nome Fantasia | CNPJ | Segmento | Status | Vendedor | VP |
--   Pertence a um grupo econômico? (sim/não) | Grupo Econômico (nome do grupo econômico)
-- ========================================================================================

SELECT 
    cli.razao_social                                        AS "Razão Social",
    cli.nome_fantasia                                       AS "Nome Fantasia",
    cli.cpf_cnpj                                            AS "CNPJ",
    COALESCE(seg.nome, 'Não informado')                     AS "Segmento",
    cli.status                                              AS "Status",
    COALESCE(usu.nome, 'Não informado')                     AS "Vendedor",
    COALESCE(vp_usu.nome, 'Não informado')                  AS "VP",
    CASE 
        WHEN cli.id_grupo_economico IS NOT NULL AND ge.id IS NOT NULL THEN 'sim' 
        ELSE 'não' 
    END                                                     AS "Pertence a um grupo econômico? (sim/não)",
    COALESCE(ge.nome, 'Não possui')                         AS "Grupo Econômico (nome do grupo econômico)"

FROM clientes cli
LEFT JOIN segmentos seg          ON cli.id_segmento = seg.id
LEFT JOIN usuarios usu           ON cli.id_usuario = usu.id
LEFT JOIN usuarios vp_usu        ON cli.vp = vp_usu.id
LEFT JOIN grupos_economicos ge   ON cli.id_grupo_economico = ge.id

ORDER BY 
    cli.status ASC,
    cli.razao_social ASC;
