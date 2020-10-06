const express = require("express");
const { port } = require("./config/app.config");

const routes = require("./routes");
const app = express();
app.use(express.json());
routes(app);

app.listen(port, () => {
  console.log("Api stated on port ", port);
});
