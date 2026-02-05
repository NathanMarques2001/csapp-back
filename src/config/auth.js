require("dotenv").config();
const fs = require("fs");

let secret = process.env.JWT_SECRET;
let microsoft = {};

// Fallback logic for legacy file path
if (!secret) {
    try {
        const secretPath =
            "C:/Users/nathan.brandao/OneDrive - FUNDAFFEMG/Documentos/dev/scrts/secret.json";
        if (fs.existsSync(secretPath)) {
            const fileConfig = require(secretPath);
            secret = fileConfig.secret;
            microsoft = fileConfig.microsoft;
            console.log("[Auth Config] Loaded secret from file.");
        } else {
            console.warn(
                "[Auth Config] WARN: secret.json not found and JWT_SECRET not set. Using unsafe default."
            );
            secret = "default_secret_legacy_unsafe_for_production";
        }
    } catch (error) {
        console.error("[Auth Config] Error loading secret file:", error);
        secret = "default_secret_legacy_unsafe_for_production";
    }
}

module.exports = {
    secret,
    microsoft,
};
