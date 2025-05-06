import express from "express";

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send(
    "Hello World!\nSe vedi questo messaggio, l'installazione è avvenuta con successo.",
  );
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  console.log(
    "\nSe vedi questo messaggio, l'installazione è avvenuta con successo.\n\nPress Ctrl+C to quit.",
  );
});
