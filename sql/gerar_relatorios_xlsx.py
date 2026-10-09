#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
========================================================================================
CSAPP - GERADOR DE RELATÓRIOS EXCEL (.XLSX) A PARTIR DOS SCRIPTS .SQL
========================================================================================
Este script executa as consultas SQL dos relatórios pontuais e gera um arquivo
Excel (.xlsx) profissional e formatado, com abas separadas para cada relatório.

Relatórios gerados:
  1. Relatório 1 - Contratos (Ativos e Inativos)
  2. Relatório 2 - Gestores e Contatos (Ativos e Inativos)
  3. Relatório 3 - Clientes e Segmentos (Ativos e Inativos)
  4. (Opcional) Relatório 2 - Visão Horizontal Consolidada

Como usar:
  python gerar_relatorios_xlsx.py

Opções extras via linha de comando (sobrescrevem o .env):
  python gerar_relatorios_xlsx.py --host 127.0.0.1 --port 3306 --user root --password senha
  python gerar_relatorios_xlsx.py --output meu_relatorio.xlsx
  python gerar_relatorios_xlsx.py --individual   (gera também 1 arquivo .xlsx para cada relatório)
  python gerar_relatorios_xlsx.py --ajuda
========================================================================================
"""

import os
import sys
import re
import argparse
from pathlib import Path
import pymysql
import pandas as pd
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

# Tenta carregar variáveis do .env se dotenv estiver instalado
try:
    from dotenv import load_dotenv
    # Procura .env na pasta atual (sql) ou na pasta pai (csapp-back)
    diretorio_atual = Path(__file__).resolve().parent
    env_local = diretorio_atual / ".env"
    env_pai = diretorio_atual.parent / ".env"
    if env_local.exists():
        load_dotenv(env_local)
    elif env_pai.exists():
        load_dotenv(env_pai)
except ImportError:
    pass


def extrair_query_ativa(sql_texto: str) -> str:
    """
    Remove blocos de comentários e extrai a primeira query SELECT ativa.
    """
    # Remove comentários de bloco /* ... */
    sem_bloco = re.sub(r'/\*.*?\*/', '', sql_texto, flags=re.DOTALL)
    
    # Processa linha por linha para remover comentários --
    linhas = []
    for linha in sem_bloco.splitlines():
        linha_strip = linha.strip()
        if linha_strip.startswith('--'):
            continue
        # Remove comentário inline se houver (mas não dentro de strings)
        if '--' in linha:
            linha = linha.split('--')[0]
        linhas.append(linha)
    
    sql_limpo = '\n'.join(linhas).strip()
    
    # Se houver ponto e vírgula, pega até o primeiro ';'
    if ';' in sql_limpo:
        sql_limpo = sql_limpo.split(';')[0].strip()
        
    return sql_limpo


def carregar_query_do_arquivo(caminho_arquivo: Path) -> str:
    if not caminho_arquivo.exists():
        raise FileNotFoundError(f"Arquivo SQL não encontrado: {caminho_arquivo}")
    with open(caminho_arquivo, 'r', encoding='utf-8') as f:
        conteudo = f.read()
    return extrair_query_ativa(conteudo)


def query_relatorio_2_horizontal() -> str:
    """Query alternativa para o Relatório 2 com todos os gestores lado a lado"""
    return """
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
    """


def estilizar_planilha(wb: openpyxl.Workbook):
    """
    Aplica formatação executiva profissional às abas do Excel:
    - Cabeçalho em azul escuro (#1F4E79), fonte branca, negrito.
    - Congelamento da linha de cabeçalho (painel congelado).
    - Auto-filtro em todas as colunas.
    - Ajuste automático de largura de coluna.
    - Formatação numérica (moeda e decimais).
    """
    cor_cabecalho = "1F4E79"
    fonte_cabecalho = Font(name="Segoe UI", size=11, bold=True, color="FFFFFF")
    preenchimento_cabecalho = PatternFill(start_color=cor_cabecalho, end_color=cor_cabecalho, fill_type="solid")
    alinhamento_cabecalho = Alignment(horizontal="center", vertical="center", wrap_text=True)

    fonte_dados = Font(name="Segoe UI", size=10)
    alinhamento_padrao = Alignment(vertical="center")
    
    borda_fina = Side(style='thin', color='D9D9D9')
    estilo_borda = Border(left=borda_fina, right=borda_fina, top=borda_fina, bottom=borda_fina)

    for nome_aba in wb.sheetnames:
        ws = wb[nome_aba]
        
        # Garante linhas de grade visíveis
        ws.views.sheetView[0].showGridLines = True
        
        # Congela a primeira linha
        ws.freeze_panes = "A2"
        
        # Ativa o autofiltro na tabela
        if ws.max_column > 0 and ws.max_row > 0:
            ws.auto_filter.ref = ws.dimensions

        # Altura do cabeçalho
        ws.row_dimensions[1].height = 28

        # Identifica colunas financeiras ou especiais
        col_valor_indices = set()
        col_data_indices = set()
        
        for col_idx in range(1, ws.max_column + 1):
            cell = ws.cell(row=1, column=col_idx)
            cell.font = fonte_cabecalho
            cell.fill = preenchimento_cabecalho
            cell.alignment = alinhamento_cabecalho
            cell.border = estilo_borda

            nome_coluna = str(cell.value or "").strip().lower()
            if "valor" in nome_coluna and "antigo" not in nome_coluna:
                col_valor_indices.add(col_idx)
            if "data" in nome_coluna or "vencimento" in nome_coluna or "reajuste" in nome_coluna:
                col_data_indices.add(col_idx)

        # Formata linhas de dados e calcula largura
        col_larguras = {}
        for row_idx in range(2, ws.max_row + 1):
            ws.row_dimensions[row_idx].height = 20
            for col_idx in range(1, ws.max_column + 1):
                cell = ws.cell(row=row_idx, column=col_idx)
                cell.font = fonte_dados
                cell.border = estilo_borda
                
                # Se for valor monetário e numérico
                if col_idx in col_valor_indices and isinstance(cell.value, (int, float)):
                    cell.number_format = 'R$ #,##0.00'
                    cell.alignment = Alignment(horizontal="right", vertical="center")
                else:
                    cell.alignment = alinhamento_padrao

                # Cálculo de largura
                valor_str = str(cell.value or '')
                tam = len(valor_str)
                col_larguras[col_idx] = max(col_larguras.get(col_idx, 0), tam)

        # Ajusta largura das colunas
        for col_idx in range(1, ws.max_column + 1):
            cabecalho_tam = len(str(ws.cell(row=1, column=col_idx).value or ''))
            maior_tam = max(col_larguras.get(col_idx, 0), cabecalho_tam)
            largura_final = max(min(maior_tam + 4, 60), 12)
            col_letter = get_column_letter(col_idx)
            ws.column_dimensions[col_letter].width = largura_final


def main():
    parser = argparse.ArgumentParser(
        description="Gera arquivos Excel (.xlsx) a partir das consultas SQL do CSApp.",
        add_help=False
    )
    parser.add_argument('--help', '-h', '--ajuda', action='help', help="Exibe esta mensagem de ajuda")
    parser.add_argument('--host', default=os.getenv('DB_HOST', 'localhost'), help="Host do banco MySQL (padrão: DB_HOST do .env ou localhost)")
    parser.add_argument('--port', type=int, default=int(os.getenv('DB_PORT', 3306)), help="Porta do MySQL (padrão: 3306)")
    parser.add_argument('--user', '-u', default=os.getenv('DB_USER', 'root'), help="Usuário do MySQL (padrão: DB_USER do .env)")
    parser.add_argument('--password', '-p', '--pass', default=os.getenv('DB_PASS', ''), help="Senha do MySQL (padrão: DB_PASS do .env)")
    parser.add_argument('--database', '-d', '--db', default=os.getenv('DB_NAME', 'sistema_gerenciamento_contratos'), help="Nome do banco de dados (padrão: DB_NAME do .env)")
    parser.add_argument('--output', '-o', default='relatorios_pontuais.xlsx', help="Nome do arquivo Excel consolidado de saída (padrão: relatorios_pontuais.xlsx)")
    parser.add_argument('--individual', action='store_true', help="Gera também arquivos .xlsx separados para cada relatório")
    parser.add_argument('--horizontal', action='store_true', help="Inclui também uma aba com a Opção 2 do Relatório 2 (visão horizontal lado a lado)")

    args = parser.parse_args()

    diretorio_sql = Path(__file__).resolve().parent
    caminho_r1 = diretorio_sql / "relatorio_1_contratos.sql"
    caminho_r2 = diretorio_sql / "relatorio_2_contatos_gestores.sql"
    caminho_r3 = diretorio_sql / "relatorio_3_clientes_segmentos.sql"

    print("=" * 80)
    print(" 📊 CSAPP - EXPORTADOR DE RELATÓRIOS PARA EXCEL (.XLSX)")
    print("=" * 80)
    print(f" Conectando ao MySQL em: {args.user}@{args.host}:{args.port}/{args.database}")
    print(" Modo de execução: Leitura estrita (SELECT READ-ONLY)")
    print("-" * 80)

    try:
        # Conexão com o banco de dados MySQL
        conexao = pymysql.connect(
            host=args.host,
            port=args.port,
            user=args.user,
            password=args.password,
            database=args.database,
            charset='utf8mb4',
            cursorclass=pymysql.cursors.DictCursor,
            connect_timeout=10,
            autocommit=True
        )

        with conexao.cursor() as cursor:
            # Garante que a sessão seja apenas leitura (proteção adicional para prod)
            try:
                cursor.execute("SET SESSION TRANSACTION READ ONLY;")
            except Exception:
                pass

        print(" Conexão estabelecida com sucesso!")
        print("-" * 80)

        # 1. Carrega e executa Relatório 1
        print("▶ Executando Relatório 1 (Contratos)...")
        query_r1 = carregar_query_do_arquivo(caminho_r1)
        df_r1 = pd.read_sql(query_r1, conexao)
        print(f"   ✔ {len(df_r1)} contratos carregados.")

        # 2. Carrega e executa Relatório 2
        print("▶ Executando Relatório 2 (Gestores e Contatos - Visão por Gestor)...")
        query_r2 = carregar_query_do_arquivo(caminho_r2)
        df_r2 = pd.read_sql(query_r2, conexao)
        print(f"   ✔ {len(df_r2)} contatos de gestores carregados.")

        df_r2_horizontal = None
        if args.horizontal:
            print("▶ Executando Relatório 2 (Visão Horizontal Consolidada)...")
            query_r2_h = query_relatorio_2_horizontal()
            df_r2_horizontal = pd.read_sql(query_r2_h, conexao)
            print(f"   ✔ {len(df_r2_horizontal)} clientes consolidados carregados.")

        # 3. Carrega e executa Relatório 3
        print("▶ Executando Relatório 3 (Clientes e Segmentos)...")
        query_r3 = carregar_query_do_arquivo(caminho_r3)
        df_r3 = pd.read_sql(query_r3, conexao)
        print(f"   ✔ {len(df_r3)} clientes carregados.")

        conexao.close()
        print("-" * 80)

        # Geração do arquivo Excel consolidado
        caminho_saida = diretorio_sql / args.output
        print(f"▶ Gerando pasta de trabalho Excel: {caminho_saida.name} ...")

        with pd.ExcelWriter(caminho_saida, engine='openpyxl') as writer:
            df_r1.to_excel(writer, sheet_name="1 - Contratos", index=False)
            df_r2.to_excel(writer, sheet_name="2 - Gestores", index=False)
            if df_r2_horizontal is not None:
                df_r2_horizontal.to_excel(writer, sheet_name="2 - Gestores (Horizontal)", index=False)
            df_r3.to_excel(writer, sheet_name="3 - Clientes e Segmentos", index=False)

        # Aplica estilos executivos via openpyxl
        wb = openpyxl.load_workbook(caminho_saida)
        estilizar_planilha(wb)
        wb.save(caminho_saida)
        print(f" ✔ Arquivo consolidado salvo com sucesso em:")
        print(f"   👉 {caminho_saida}")

        # Se solicitado, gera também os arquivos individuais
        if args.individual:
            print("-" * 80)
            print("▶ Gerando arquivos individuais...")
            
            arquivos_individuais = [
                ("relatorio_1_contratos.xlsx", "Contratos", df_r1),
                ("relatorio_2_contatos_gestores.xlsx", "Gestores", df_r2),
                ("relatorio_3_clientes_segmentos.xlsx", "Clientes e Segmentos", df_r3),
            ]
            
            for nome_arq, nome_aba, df_ind in arquivos_individuais:
                caminho_ind = diretorio_sql / nome_arq
                with pd.ExcelWriter(caminho_ind, engine='openpyxl') as writer:
                    df_ind.to_excel(writer, sheet_name=nome_aba, index=False)
                wb_ind = openpyxl.load_workbook(caminho_ind)
                estilizar_planilha(wb_ind)
                wb_ind.save(caminho_ind)
                print(f"   ✔ Salvo: {caminho_ind.name} ({len(df_ind)} linhas)")

        print("=" * 80)
        print(" 🎉 PROCESSO CONCLUÍDO COM SUCESSO!")
        print("=" * 80)

    except pymysql.MySQLError as err:
        print("\n❌ ERRO DE CONEXÃO OU EXECUÇÃO NO MYSQL:")
        print(f"   Código: {err.args[0] if len(err.args) > 0 else 'Desconhecido'}")
        print(f"   Mensagem: {err}")
        print("\n💡 DICA:")
        print("   Se o banco estiver em um servidor remoto ou exigir túnel SSH:")
        print(f"   1. Abra o túnel (ex: ssh -L 3306:localhost:3306 usuario@servidor)")
        print(f"   2. Ou passe os parâmetros diretamente:")
        print(f"      python sql/gerar_relatorios_xlsx.py --host SEU_HOST --port 3306 --user SEU_USUARIO --password SUA_SENHA --database {args.database}")
        sys.exit(1)
    except Exception as ex:
        print(f"\n❌ ERRO INESPERADO: {type(ex).__name__} - {ex}")
        sys.exit(1)


if __name__ == '__main__':
    main()
