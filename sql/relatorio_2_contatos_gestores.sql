-- ========================================================================================
-- RELATÓRIO 2: CONTATOS DOS GESTORES E ANIVERSARIANTES (BASE COMPLETA: ATIVOS E INATIVOS)
-- ========================================================================================
-- Descrição:
--   Consulta dados de contato e aniversário de todos os gestores (Contrato, Financeiro,
--   Chamados) para todos os clientes da base (ativos e inativos).
--
-- Fornecemos 3 opções de visualização para atender a qualquer necessidade:
--   - OPÇÃO 1 (Recomendada): 1 linha por gestor cadastrado (Unpivot via UNION ALL).
--     Compatível com qualquer versão do MySQL. Ideal para CRM, envio de comunicações,
--     mensagens de aniversário e exportação.
--   - OPÇÃO 2: Formato horizontal consolidado (1 linha por cliente com todas as colunas
--     de todos os gestores abertas lado a lado).
--   - OPÇÃO 3: Estrutura estrita conforme a ordem exata solicitada (traz os contatos do
--     Gestor de Contrato principal e os nomes dos demais gestores).
-- ========================================================================================


-- ----------------------------------------------------------------------------------------
-- OPÇÃO 1 (RECOMENDADA): 1 LINHA POR GESTOR CADASTRADO (COM E-MAIL, TELEFONES E ANIVERSÁRIO)
-- ----------------------------------------------------------------------------------------
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


-- ----------------------------------------------------------------------------------------
-- OPÇÃO 2: 1 LINHA POR CLIENTE (TODOS OS DADOS DOS 3 GESTORES LADO A LADO)
-- ----------------------------------------------------------------------------------------
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


-- ----------------------------------------------------------------------------------------
-- OPÇÃO 3: FORMATO LITERAL DO ENUNCIADO (CONTATOS VINCULADOS AO GESTOR PRINCIPAL DE CONTRATOS)
-- ----------------------------------------------------------------------------------------
/*
SELECT 
    cli.cpf_cnpj                                            AS "CNPJ",
    cli.razao_social                                        AS "Nome do Cliente (Razão social)",
    cli.gestor_contratos_nome                               AS "Nome do Gestor de Contrato",
    cli.gestor_financeiro_nome                              AS "Nome do Gestor Financeiro",
    cli.gestor_chamados_nome                                AS "Nome do Gestor de Chamados",
    cli.gestor_contratos_email                              AS "E-mail",
    cli.gestor_contratos_telefone_1                         AS "Telefone 1",
    cli.gestor_contratos_telefone_2                         AS "Telefone 2",
    cli.gestor_contratos_nascimento                         AS "Data de aniversário"
FROM clientes cli
ORDER BY 
    cli.status ASC,
    cli.razao_social ASC;
*/
