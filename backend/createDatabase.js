const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const csv = require("csv-parser");

const db = new sqlite3.Database("./syntheticData.db");

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY, 
    name TEXT, 
    category TEXT, 
    processor_type TEXT,
    memory TEXT,
    storage TEXT
  )`);

  const insert = db.prepare(
    "INSERT INTO products (name, category, processor_type, memory, storage) VALUES (?, ?, ?, ?, ?)"
  );
  fs.createReadStream("./UITeam-SyntheticData.csv") // Updated path
    .pipe(csv())
    .on("data", (row) => {
      insert.run(
        row.name,
        row.category,
        row.processor_type,
        row.memory,
        row.storage
      );
    })
    .on("end", () => {
      insert.finalize();
      console.log("CSV file successfully processed and database populated.");
    });
});

db.close();
