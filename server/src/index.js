import express from "express";
import "./config/config.js";
import pool from "./db/pool.js";
import { checkRecords } from "./services/checkRecords.js";

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


app.get("/getTipiCubo", async (req, res) => {
  try {
    const result = await pool.query("SELECT * from tipicubo");
    console.log(result)
    res.json({status: 200, tipiCubo: result.rows});
  } catch (err) {
    console.error(err);
    res.status(500).send("Errore DB");
  }
})


app.post('/addSolve', async (req, res) => {

    /* =========================================
    // DATI RICEVUTI DAL CLIENT
    // =========================================
    // Il client deve inviare:
    //
    // {
    //   idUt: number
    //   idTipo: number
    //   tempo: number (ms)
    //   scramble: string
    //   falloIspezione: boolean
    //   falloMossa: boolean
    // }
    // Tutta la logica viene gestita dal server
    // ========================================= */

    const {
        idUt,
        idTipo,
        tempo,
        scramble,
        falloIspezione = false,
        falloMossa = false
    } = req.body;

    // =========================================
    // VALIDAZIONE BASE
    // =========================================

    if (!idUt || !idTipo || tempo == null || !scramble) {
        return res.status(400).json({ error: 'Parametri mancanti'});
    }

    const client = await pool.connect();

    try {

        // =========================================
        // APERTURA TRANSAZIONE
        // =========================================
        // Tutte le query devono essere atomiche: o vengono eseguite tutte o nessuna
        // =========================================

        await client.query('BEGIN');

        // =========================================
        // LOCK ANTI CONCORRENZA
        // =========================================
        // Evita che due solve simultanee:
        //
        // leggano lo stesso MAX(ordine)
        //
        // causando:
        // duplicate key value violates unique
        //
        // Il lock è:
        // specifico per utente + tipo cubo
        // =========================================

        await client.query(
            'SELECT pg_advisory_xact_lock($1, $2)',
            [idUt, idTipo]
        );

        // =========================================
        // RECUPERO ULTIMA SESSIONE
        // =========================================
        // Cerchiamo l'ultima sessione dell'utente
        //
        // NON usiamo la tabella solves
        // perché vogliamo considerare anche
        // sessioni senza solve
        // =========================================

        const sessioneResult = await client.query(
            `
            SELECT idsessione, dataora
            FROM sessioni
            WHERE idut = $1
            ORDER BY dataora DESC
            LIMIT 1
            `,
            [idUt]
        );

        let idSessione;

        // =========================================
        // CONTROLLO VALIDITÀ SESSIONE
        // =========================================
        // Una sessione dura 3 ore dalla creazione
        //
        // Possibili casi:
        //
        // 1. Nessuna sessione -> crea
        // 2. Sessione scaduta -> crea
        // 3. Sessione valida -> riusa
        // =========================================

        const ultimaSessione = sessioneResult.rows[0];

        const treOreFa = new Date( Date.now() - 3 * 60 * 60 * 1000 );

        const sessioneScaduta = !ultimaSessione || new Date(ultimaSessione.dataora) < treOreFa;

        // =========================================
        // CREAZIONE NUOVA SESSIONE
        // =========================================

        if (sessioneScaduta) {

            const nuovaSessioneResult = await client.query(
                `
                INSERT INTO sessioni (dataora, idut)
                VALUES ( NOW(), $1)
                RETURNING idsessione
                `,
                [idUt]
            );

            idSessione = nuovaSessioneResult.rows[0].idsessione;

        } else {
            // RIUTILIZZO SESSIONE ESISTENTE

            idSessione = ultimaSessione.idsessione;
        }

        // =========================================
        // CALCOLO ORDINE
        //
        // L'ordine è progressivo per:
        // utente + tipo cubo
        //
        // Esempio:
        // 3x3:
        // 1,2,3,4...
        //
        // 2x2:
        // 1,2,3...
        //
        // separatamente
        // =========================================

        const ordineResult = await client.query(
            `
            SELECT COALESCE(MAX(ordine), 0) + 1 AS ordine
            FROM solves
            WHERE idut = $1
              AND idtipo = $2
            `,
            [idUt, idTipo]
        );

        const ordine = ordineResult.rows[0].ordine;

        // INSERIMENTO SOLVE

        const solveResult = await client.query(
            `
            INSERT INTO solves (scramble, tempo, falloispezione, fallomossa, idsessione, idtipo, idut, ordine )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8 )

            RETURNING *
            `,
            [scramble, tempo, falloIspezione, falloMossa, idSessione, idTipo, idUt, ordine ]
        );

        const nuovaSolve = solveResult.rows[0];

        // Controlla single, ao5, ao12... usando lo stesso client/transazione.
        const nuoviRecord = await checkRecords({client: client, idUt: idUt, idTipo: idTipo, solve: nuovaSolve });

        // COMMIT FINALE

        await client.query('COMMIT');

        
        // RISPOSTA AL CLIENT
        res.status(201).json({
            solve: nuovaSolve,
            stats: nuoviRecord
        });

    } catch (err) {
        // ROLLBACK IN CASO DI ERRORE

        await client.query('ROLLBACK');

        console.error('Errore addSolve:', err );

        res.status(500).json({error: 'Errore server'});

    } finally {
        // RILASCIO CONNESSIONE

        client.release();
    }
});


app.post('/getSolves', async (req, res) => {

    // =========================================
    // PARAMETRI RICEVUTI DAL CLIENT
    // 
    // idUt:
    // utente di cui recuperare le solve
    //
    // idTipo:
    // tipo cubo (3x3, 2x2...)
    // =========================================

    const { idUt, idTipo } = req.body;

    // VALIDAZIONE BASE

    if (!idUt || !idTipo) {
        return res.status(400).json({error: 'Parametri mancanti'});
    }

    const client = await pool.connect();

    try {

        // =========================================
        // RECUPERO SOLVE
        // 
        // Ordinate per ordine crescente:
        // serve per:
        //
        // - progression
        // - best progressivi
        // - avg5 progressive
        // =========================================

        const solvesResult = await client.query(
            `
            SELECT
                idsolve,
                ordine,
                tempo,
                falloispezione,
                fallomossa
            FROM solves
            WHERE idut = $1
              AND idtipo = $2
            ORDER BY ordine ASC
            `,
            [idUt, idTipo]
        );

        const solves = solvesResult.rows;

        // =========================================
        // ARRAY RISULTATO FINALE
        // =========================================

        const result = [];

        // =========================================
        // BEST SINGLE PROGRESSIVO
        // 
        // Contiene il miglior single ottenuto FINO a quel momento
        // =========================================

        let bestSingleSoFar = null;

        // =========================================
        // BEST AVG5 PROGRESSIVA
        // 
        // Contiene la miglior avg5 ottenuta FINO a quel momento
        // =========================================

        let bestAvg5SoFar = null;

        // =========================================
        // CICLO SU TUTTE LE SOLVE
        // =========================================

        for (let i = 0; i < solves.length; i++) {

            const solve = solves[i];

            // =========================================
            // BEST SINGLE STORICO
            // 
            // true se questa solve:
            // nel momento in cui è stata fatta rappresentava il miglior single mai ottenuto fino a quel momento
            // =========================================

            let isBestSingle = false;

            if (bestSingleSoFar === null || solve.tempo < bestSingleSoFar)
            {
                isBestSingle = true;
                bestSingleSoFar = solve.tempo;
            }

            // =========================================
            // CALCOLO AVG5
            // =========================================
            // L'avg5 include:
            // - solve corrente
            // - 4 solve precedenti
            //
            // Quindi serve:
            // i >= 4
            // =========================================

            let avg5 = null;

            let isBestAvg5 = false;

            if (i >= 4) {
                // ULTIME 5 SOLVE
                const last5 = solves.slice(i - 4, i + 1);

                // ESTRAZIONE TEMP
                let tempi = last5.map(s => s.tempo);

                // ORDINAMENTO
                tempi.sort((a, b) => a - b);

                // RIMOZIONE BEST E WORST
                tempi.shift();
                tempi.pop();

                // MEDIA CENTRALE
                const somma = tempi.reduce((acc, val) => acc + val, 0);

                avg5 = Math.round(somma / tempi.length);

                // =========================================
                // BEST AVG5 STORICA
                // 
                // true se questa solve: ha creato una nuova miglior avg5
                // =========================================

                if (bestAvg5SoFar === null || avg5 < bestAvg5SoFar) {
                    isBestAvg5 = true;
                    bestAvg5SoFar = avg5;
                }
            }

            // =========================================
            // PROGRESSION
            //
            // 1  -> migliore della precedente
            // 0  -> uguale
            // -1 -> peggiore
            // ' ' -> prima solve
            // =========================================

            let progression = ' ';

            if (i > 0) {

                const previous = solves[i - 1];

                if (solve.tempo < previous.tempo) 
                    progression = 1;
                else if (solve.tempo > previous.tempo)
                    progression = -1;
                else 
                    progression = 0;
            }

            // FORMATO FINALE
            result.push({
                // Ordine progressivo solve
                nRecord: solve.ordine,
                // Tempo solve
                time: solve.tempo,
                // Nuovo best single storico
                isBestSingle,
                // Nuova best avg5 storica
                isBestAvg5,
                // Valore avg5 associato alla solve corrente
                avg5,
                // Miglioramento rispetto alla solve precedente
                progression
            });
        }

        // RISPOSTA FINALE
        res.status(200).json({solves: result});

    } catch (err) {

        console.error('Errore getSolves:', err);

        res.status(500).json({error: 'Errore server'});

    } finally {

        client.release();
    }
});

app.post('/getStats', async (req, res) => {
    // =========================================
    // PARAMETRI RICEVUTI DAL CLIENT
    //
    // idUt:
    // utente di cui recuperare le statistiche
    //
    // idTipo:
    // tipo cubo (3x3, 2x2...)
    // =========================================

    const { idUt, idTipo } = req.body;

    // VALIDAZIONE BASE

    if (!idUt || !idTipo) {
        return res.status(400).json({error: 'Parametri mancanti'});
    }

    const client = await pool.connect();

    try {

        // =========================================
        // RECUPERO TIPI RECORD
        //
        // Ogni riga descrive una statistica da mostrare
        // (single, ao3, ao5, ao12...)
        // =========================================

        const recordsResult = await client.query(
            `
            SELECT
                idtiporecord,
                descrecord,
                nsolve
            FROM record
            WHERE idtipo = $1
            ORDER BY nsolve ASC
            `,
            [idTipo]
        );

        const result = [];

        for (const tipoRecord of recordsResult.rows) {
            let current = null;

            // =========================================
            // CURRENT
            //
            // Single: ultima solve.
            // Average: media delle ultime N solve.
            // Stessa regola usata da checkRecords:
            // per ao5/ao12/... togliamo best e worst,
            // per ao3 teniamo tutti e 3 i tempi.
            // =========================================

            const solvesStatsResult = await client.query(
                `
                SELECT tempo
                FROM solves
                WHERE idut = $1
                  AND idtipo = $2
                ORDER BY ordine DESC
                LIMIT $3
                `,
                [idUt, idTipo, tipoRecord.nsolve]
            );

            const solvesStats = solvesStatsResult.rows;

            if (solvesStats.length === tipoRecord.nsolve) {
                if (tipoRecord.nsolve === 1) {
                    current = solvesStats[0].tempo;
                } else {
                    const tempi = solvesStats
                        .map(s => s.tempo)
                        .sort((a, b) => a - b);

                    if (tipoRecord.nsolve !== 3) {
                        tempi.shift();
                        tempi.pop();
                    }

                    const somma = tempi.reduce((acc, val) => acc + val, 0);
                    current = Math.round(somma / tempi.length);
                }
            }

            // =========================================
            // STAT BEST
            //
            // Record migliore salvato per l'utente
            // e per il tipo record corrente.
            // =========================================

            const statBestResult = await client.query(
                `
                SELECT rr.tempo
                FROM regrecord rr
                JOIN solves s
                  ON s.idsolve = rr.idsolve
                WHERE rr.idtiporecord = $1
                  AND s.idut = $2
                  AND s.idtipo = $3
                LIMIT 1
                `,
                [tipoRecord.idtiporecord, idUt, idTipo]
            );

            result.push({
                idTipoRecord: tipoRecord.idtiporecord,
                descRecord: tipoRecord.descrecord,
                current,
                statBest: statBestResult.rows[0]?.tempo ?? null
            });
        }

        // RISPOSTA FINALE
        res.status(200).json({stats: result});

    } catch (err) {

        console.error('Errore getStats:', err);

        res.status(500).json({error: 'Errore server'});

    } finally {

        client.release();
    }

});
