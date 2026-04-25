import express from "express";
import "./config/config.js";
import pool from "./db/pool.js";

import bcrypt from "bcrypt";


const app = express();
app.use(express.json());


app.listen(3000, () => {
  console.log("Server avviato su porta 3000");
});


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-Type')
    res.header('Access-Control-Allow-Credentials', 'true')

    if (req.method === 'OPTIONS') {
        return res.sendStatus(200)
    }
    next()
})

// test connessione
app.get("/api/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Errore DB");
  }
});

app.post("/api/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Errore DB");
  }
});

app.post("/login", async (req, res) => {
  const { mail, pwd } = req.body;

  try {
    const query = "SELECT idUt, username, pwd FROM UTENTI WHERE mail = $1"

    const result = await pool.query(query, [mail]);

    if (result.rows.length === 0) {
      return res.status(401).send("Credenziali non valide");
    }

    const user = result.rows[0];
    console.log(user)

    //confronto password
    const valid = await bcrypt.compare(pwd, user.pwd);

    if (!valid) {
      return res.status(401).send("Credenziali non valide");
    }

    //login riuscito
    res.json({ status: 200, message: "Login OK", user: {id: user.idut, username: user.username } });

  } catch (err) {
    console.error(err);
    res.status(500).send("Errore server");
  }
});

app.post("/registrazione", async (req, res) => {
  const { username, mail, pwd } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(pwd, 10);

    const query = `
      INSERT INTO UTENTI (mail, pwd, username)
      VALUES ($1, $2, $3)
      RETURNING idUt, username;
    `;

    const values = [mail, hashedPassword, username];

    const result = await pool.query(query, values);

    res.json({status: 200, message: "Login OK", user:{ id: result.rows[0].idut, username: result.rows[0].username}});

  } catch (err) {
    console.error(err);
    if(err.code == '23505')
      res.status(401).send('Mail già esistente')
    res.status(500).send("Errore server");
  }
});

app.post("/changeAccount", async (req, res) => {
  const { id, newValues } = req.body;

  if (!id || !newValues || typeof newValues !== "object") {
    return res.status(400).send("Parametri non validi");
  }

  const { username, mail, pwd } = newValues;

  if (!username || !mail) {
    return res.status(400).send("Username e mail sono obbligatori");
  }

  try {
    const fields = ["username = $1", "mail = $2"];
    const values = [username, mail];
    let paramIndex = values.length + 1;

    if (pwd) {
      const hashedPassword = await bcrypt.hash(pwd, 10);
      fields.push(`pwd = $${paramIndex}`);
      values.push(hashedPassword);
      paramIndex++;
    }

    values.push(id);

    const query = `
      UPDATE UTENTI
      SET ${fields.join(", ")}
      WHERE idUt = $${paramIndex}
      RETURNING idUt, username, mail;
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).send("Utente non trovato");
    }

    const user = result.rows[0];
    res.json({
      status: 200,
      message: "Account aggiornato",
      user: {
        id: user.idut,
        username: user.username,
        mail: user.mail
      }
    });
  } catch (err) {
    console.error(err);
    if (err.code == "23505") {
      return res.status(401).send("Mail già esistente");
    }
    res.status(500).send("Errore server");
  }
})
  
/*
// login
app.post("/login", async (req, res) => {
  const user = await getUserFromDB();

  const valid = await bcrypt.compare(req.body.password, user.pwd);

  if (valid) res.send("OK");
  else res.send("NO");
});


*/
