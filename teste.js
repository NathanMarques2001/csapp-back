const { execSync } = require("child_process");

try {
    const decrypted = execSync("gpg --decrypt /var/www/scrt/db.json.gpg", { encoding: "utf-8" });
    const secrets = JSON.parse(decrypted);

    console.log("Tudo:", secrets);
    console.log("Usuário do DB:", secrets.DB_USER);
    console.log("Senha do DB:", secrets.DB_PASSWORD);
} catch (err) {
    console.error("Erro ao ler os segredos:", err);
}
