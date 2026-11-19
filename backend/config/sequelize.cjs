const password = process.env.DB_PASSWORD;
if (!password) {
  throw new Error("DB_PASSWORD must be configured before running migrations.");
}

const config = {
  username: process.env.DB_USER || "postgres",
  password,
  database: process.env.DB_NAME || "vestaedu",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 5432),
  dialect: "postgres",
  logging: false,
};

module.exports = {
  development: config,
  test: config,
  production: config,
};
