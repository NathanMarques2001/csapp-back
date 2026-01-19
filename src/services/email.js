const axios = require("axios");

class Email {
  // PRD
  static baseUrl = "https://csapp.prolinx.com.br/email";
  // DEV
  // static baseUrl = "http://localhost:9090/email";
  constructor() {
    this.email = axios.create({
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });
  }

  async sendEmail(data) {
    try {
      const res = await this.email.post(Email.baseUrl + "/send", data);
      return res.data;
    } catch (err) {
      throw err || "Erro ao enviar email";
    }
  }
}

module.exports = Email;
