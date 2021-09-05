module.exports = {
  mysql: {
    PORT: process.env.MYSQL_PORT,
    HOST: process.env.MYSQL_HOST,
    USER: process.env.MYSQL_USER,
    DB: process.env.MYSQL_DB,
    PASSWORD: process.env.MYSQL_PASSWORD
  },
  app: {
    PORT: process.env.PORT,
    HOST: process.env.HOST
  }

}