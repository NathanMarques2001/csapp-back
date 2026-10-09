#!/usr/bin/env node
/**
 * ========================================================================================
 * CSAPP - GERADOR DE RELATÓRIOS EXCEL (.XLSX) EM NODE.JS
 * ========================================================================================
 * Alternativa em Node.js para gerar o arquivo Excel a partir dos scripts .SQL
 * usando as dependências já instaladas no csapp-back (mysql2, xlsx, dotenv).
 *
 * Como usar:
 *   node sql/gerar_relatorios_xlsx.js
 * ========================================================================================
 */

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const XLSX = require('xlsx');

// Carrega .env
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

function extrairQueryAtiva(sqlTexto) {
    // Remove blocos de comentário /* ... */
    let semBloco = sqlTexto.replace(/\/\*[\s\S]*?\*\//g, '');
    
    // Remove linhas que começam com --
    let linhas = semBloco
        .split('\n')
        .map(l => l.trim().startsWith('--') ? '' : l)
        .join('\n')
        .trim();

    // Pega até o primeiro ponto e vírgula
    if (linhas.includes(';')) {
        linhas = linhas.split(';')[0].trim();
    }
    return linhas;
}

async function main() {
    const config = {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASS || '',
        database: process.env.DB_NAME || 'sistema_gerenciamento_contratos',
    };

    console.log('='.repeat(80));
    console.log(' 📊 CSAPP - EXPORTADOR DE RELATÓRIOS EXCEL (NODE.JS)');
    console.log('='.repeat(80));
    console.log(` Conectando ao MySQL em: ${config.user}@${config.host}:${config.port}/${config.database}`);

    let connection;
    try {
        connection = await mysql.createConnection(config);
        console.log(' Conexão estabelecida com sucesso!');
        console.log('-'.repeat(80));

        // 1. Relatório 1
        console.log('▶ Executando Relatório 1 (Contratos)...');
        const sqlR1 = fs.readFileSync(path.join(__dirname, 'relatorio_1_contratos.sql'), 'utf-8');
        const [rowsR1] = await connection.query(extrairQueryAtiva(sqlR1));
        console.log(`   ✔ ${rowsR1.length} contratos carregados.`);

        // 2. Relatório 2
        console.log('▶ Executando Relatório 2 (Gestores e Contatos)...');
        const sqlR2 = fs.readFileSync(path.join(__dirname, 'relatorio_2_contatos_gestores.sql'), 'utf-8');
        const [rowsR2] = await connection.query(extrairQueryAtiva(sqlR2));
        console.log(`   ✔ ${rowsR2.length} contatos de gestores carregados.`);

        // 3. Relatório 3
        console.log('▶ Executando Relatório 3 (Clientes e Segmentos)...');
        const sqlR3 = fs.readFileSync(path.join(__dirname, 'relatorio_3_clientes_segmentos.sql'), 'utf-8');
        const [rowsR3] = await connection.query(extrairQueryAtiva(sqlR3));
        console.log(`   ✔ ${rowsR3.length} clientes carregados.`);

        await connection.end();
        console.log('-'.repeat(80));

        // Criar pasta de trabalho Excel
        const wb = XLSX.utils.book_new();

        const wsR1 = XLSX.utils.json_to_sheet(rowsR1);
        const wsR2 = XLSX.utils.json_to_sheet(rowsR2);
        const wsR3 = XLSX.utils.json_to_sheet(rowsR3);

        XLSX.utils.book_append_sheet(wb, wsR1, '1 - Contratos');
        XLSX.utils.book_append_sheet(wb, wsR2, '2 - Gestores');
        XLSX.utils.book_append_sheet(wb, wsR3, '3 - Clientes e Segmentos');

        const arquivoSaida = path.join(__dirname, 'relatorios_pontuais.xlsx');
        XLSX.writeFile(wb, arquivoSaida);

        console.log(` ✔ Arquivo Excel gerado com sucesso em:`);
        console.log(`   👉 ${arquivoSaida}`);
        console.log('='.repeat(80));
    } catch (err) {
        console.error('\n❌ Erro na execução:', err.message);
        if (connection) await connection.end();
        process.exit(1);
    }
}

main();
