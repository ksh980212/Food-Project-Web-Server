//* module import*/
const express = require("express");
const ip = require("ip");
const cors = require("cors");

/** USE ENV (dotenv module) CONFIG */
require("dotenv").config();

const app = express();
/** SET LISTEN Port */
const PORT = process.env.port || 8000;

/** USE CORS, JSON */
app.use(cors());
app.use(express.json());


/** URL /api/v1/auth/...
*/
const auth = require("./router/auth");
app.use("/api/v1/auth", auth);


/** URL /api/v1/food/...
*/
const api = require("./router/food");
app.use("/api/v1/food", api);



/**
 * LISTEN 8000 PORT
 */

app.listen(PORT, () => {
  console.log("Server is running at https://"+ip.address()+":"+PORT+"/");
});
