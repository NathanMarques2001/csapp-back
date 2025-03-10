module.exports = {
  host: "localhost",
  dialect: 'mysql',
  username: "root",
  password: "admin",
  database: "sistema_gerenciamento_contratos",
  timezone: '-03:00',
  dialectOptions: {
    useUTC: false,
    timezone: 'America/Sao_Paulo',
  },
  define: {
    timestamps: true,
    underscored: true,
  },
}