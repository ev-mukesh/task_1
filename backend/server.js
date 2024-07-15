const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const app = express();
const port = 5000; // Updated port to 5000

// Enable CORS
app.use(cors());

const db = new sqlite3.Database("./syntheticData.db");

app.get("/api/products", (req, res) => {
  db.all("SELECT * FROM products", [], (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    res.json(rows);
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
