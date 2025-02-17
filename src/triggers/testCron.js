const fs = require('fs');

const fileName = './triggers/arquivo.txt';
const content = 'Olá, este é um arquivo criado com Node.js!';

fs.writeFile(fileName, content, (err) => {
    if (err) {
        console.error('Erro ao criar o arquivo:', err);
        return;
    }
    console.log(`Arquivo "${fileName}" criado com sucesso!`);
});
