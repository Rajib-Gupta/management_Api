module.exports = {
  mysql: {
    PORT: process.env.MYSQL_PORT,
    HOST: process.env.MYSQL_HOST,
    USER: process.env.MYSQL_USER,
    DB: process.env.MYSQL_DB,
    PASSWORD: process.env.MYSQL_PASSWORD
  },
  app: {
    PORT: process.env.NODE_ENV!=="production"? process.env.PORT:process.env.SERVER_PORT,
    HOST: process.env.HOST
  }

}