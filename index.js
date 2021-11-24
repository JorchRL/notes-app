const app = require("./app");
const config = require("./utils/config");
const logger = require("./utils/logger");
const http = require("http");

// // create and init server
const server = http.createServer(app);
// // Note: the app.listen() function is just a convenience function that creates a Node serever with app, and then calls its listen method. Also, express() returns just a function that needs to passed to Node's http server to handle requests. Check the docs: https://expressjs.com/en/5x/api.html#app.listen

// const server = http.createServer((request, response) => {
//   response.statusCode = 200;
//   response.statusMessage = "Hey";
// });

server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
