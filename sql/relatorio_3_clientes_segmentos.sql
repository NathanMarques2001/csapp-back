-- ========================================================================================
-- RELATÓRIO 3: BASE GERAL DE CLIENTES E SEGMENTOS (BASE COMPLETA: ATIVOS E INATIVOS)
-- ========================================================================================
-- Descrição:
--   Lista todos os clientes da base (ativos e inativos), contendo Razão Social,
--   Nome Fantasia, CNPJ, Segmento de mercado, Status do cliente, Vendedor responsável,
--   VP (Vice-Presidente / BDM) e vínculo com Grupo Econômico.
--
-- Observação importante:
--   - Considera TODA a base (ativos e inativos), sem filtros restritivos no WHERE.
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
