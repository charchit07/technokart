const express = require("express");
const { connection } = require("./Config/db");
const { invoiceRouter } = require("./Routes/Invoice.Routes");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Home PAge");
});

app.use("/", invoiceRouter);

app.listen(7500, async () => {
  try {
    await connection;
    console.log("Connected to DB");
  } catch (error) {
    console.log(" Cannot connected to DB");
    console.log(error);
  }
  console.log("Running the server at port 7500");
});
