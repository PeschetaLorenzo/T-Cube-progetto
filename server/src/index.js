import express from "express";
import "./config/config.js";
import pool from "./db/pool.js";
import { checkRecords } from "./services/checkRecords.js";
import { calculateRecordValue, getSolveTimeWithPenalties, isSolveDnf } from "./services/recordStats.js";

import bcrypt from "bcrypt";


const app = express();
app.use(express.json());

function formatRecordValue(value) {
    return Number.isFinite(value) ? value : null;
}

function formatSolveTime(solve) {
    return isSolveDnf(solve) ? solve.tempo : getSolveTimeWithPenalties(solve);
}

function getDateKey(value) {
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) {
        return value.slice(0, 10);
    }

    return new Date(value).toISOString().slice(0, 10);
}

function getBestAverageForSolves(solves, size) {
    if (!Array.isArray(solves) || solves.length < size) {
        return null;
    }

    let best = null;

    for (let start = 0; start <= solves.length - size; start++) {
        const value = calculateRecordValue(solves.slice(start, start + size), size);

        if (Number.isFinite(value) && (best === null || value < best)) {
            best = value;
        }
    }

    return best;
}

function buildCalendarMonthPayload({ year, month, solves, records }) {
    const firstDay = new Date(Date.UTC(year, month - 1, 1));
    const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
    const daysByDate = new Map();

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(Date.UTC(year, month - 1, day)).toISOString().slice(0, 10);
        daysByDate.set(date, {
            date,
            solveCount: 0,
            average: null,
            bestTime: null,
            bestAvg5: null,
            bestAvg12: null,
            records: []
        });
    }

    for (const solve of solves) {
        const date = getDateKey(solve.data ?? solve.dataora);
        const day = daysByDate.get(date);

        if (!day) {
            continue;
        }

        if (!day.solves) {
            day.solves = [];
        }

        day.solves.push(solve);
    }

    for (const record of records) {
        const date = getDateKey(record.data ?? record.dataora);
        const day = daysByDate.get(date);

        if (!day) {
            continue;
        }

        day.records.push({
            idRecordEntry: record.idrecordentry,
            idTipoRecord: record.idtiporecord,
            description: record.descrecord,
            time: formatRecordValue(Number(record.tempo)),
            solveOrder: record.ordine
        });
    }

    for (const day of daysByDate.values()) {
        const daySolves = day.solves ?? [];
        const validTimes = daySolves
            .map(solve => getSolveTimeWithPenalties(solve))
            .filter(Number.isFinite);

        day.solveCount = daySolves.length;
        day.average = validTimes.length === 0
            ? null
            : Math.round(validTimes.reduce((sum, time) => sum + time, 0) / validTimes.length);
        day.bestTime = validTimes.length === 0 ? null : Math.min(...validTimes);
        day.bestAvg5 = getBestAverageForSolves(daySolves, 5);
        day.bestAvg12 = getBestAverageForSolves(daySolves, 12);
        delete day.solves;
    }

    return {
        year,
        month,
        startsOn: firstDay.getUTCDay(),
        days: [...daysByDate.values()]
    };
}

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
    res.json({status: 200, tipiCubo: result.rows});
  } catch (err) {
    console.error(err);
    res.status(500).send("Errore DB");
  }
})

app.get("/tipi-algoritmo", async (req, res) => {
  try {
    const result = await pool.query("SELECT * from tipoalgoritmo");
    res.json({status: 200, tipiAlgoritmo: result.rows});
  } catch (err) {
    console.error(err);
    res.status(500).send("Errore DB");
  }
})

app.post("/getAlgoritmi", async (req, res) => {
    const {idTipoAlg} = req.body
    try
    {
        const result = await pool.query("SELECT * FROM algoritmo WHERE idtipoalg = $1", [idTipoAlg])
        res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Errore DB");
  }
})

app.post("/getAllenamento", async (req, res) => {
    const {idTipoAlg, idUt} = req.body

    if(!idTipoAlg || !idUt)
        return res.status(400).send("Parametri mancanti")

    try
    {
        const result = await pool.query("SELECT * FROM allenamento WHERE idut = $1 AND idalg IN (SELECT idalg FROM algoritmo WHERE idtipoalg = $2)", [idUt, idTipoAlg])
        res.json(result.rows);
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
    const isDnf = Boolean(req.body.isdnf ?? req.body.isDnf ?? req.body.isDNF ?? req.body.penalties?.dnf ?? false);

    // =========================================
    // VALIDAZIONE BASE
    // =========================================

    if (!idUt || !idTipo || tempo == null || scramble == null) {
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
            INSERT INTO solves (scramble, tempo, falloispezione, fallomossa, isdnf, idsessione, idtipo, idut, ordine )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9 )

            RETURNING *
            `,
            [scramble, tempo, falloIspezione, falloMossa, isDnf, idSessione, idTipo, idUt, ordine ]
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
                fallomossa,
                isdnf,
                scramble
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
            const solveTime = getSolveTimeWithPenalties(solve);

            // =========================================
            // BEST SINGLE STORICO
            // 
            // true se questa solve:
            // nel momento in cui è stata fatta rappresentava il miglior single mai ottenuto fino a quel momento
            // =========================================

            let isBestSingle = false;

            if (Number.isFinite(solveTime) && (bestSingleSoFar === null || solveTime < bestSingleSoFar))
            {
                isBestSingle = true;
                bestSingleSoFar = solveTime;
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
                const last5 = solves.slice(i - 4, i + 1);
                avg5 = calculateRecordValue(last5, 5);

                // =========================================
                // BEST AVG5 STORICA
                // 
                // true se questa solve: ha creato una nuova miglior avg5
                // =========================================

                if (Number.isFinite(avg5) && (bestAvg5SoFar === null || avg5 < bestAvg5SoFar)) {
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
                const previousTime = getSolveTimeWithPenalties(previous);

                if (solveTime < previousTime) 
                    progression = 1;
                else if (solveTime > previousTime)
                    progression = -1;
                else 
                    progression = 0;
            }

            // FORMATO FINALE
            result.push({
                // Ordine progressivo solve
                nRecord: solve.ordine,
                // Tempo solve con eventuali penalita
                time: formatSolveTime(solve),
                scramble: solve.scramble,
                baseTime: solve.tempo,
                // Falli associati alla solve
                falloIspezione: solve.falloispezione,
                falloMossa: solve.fallomossa,
                isdnf: solve.isdnf,
                isDnf: solve.isdnf,
                penalties: {
                    inspection: solve.falloispezione,
                    move: solve.fallomossa,
                    dnf: solve.isdnf
                },
                // Nuovo best single storico
                isBestSingle,
                // Nuova best avg5 storica
                isBestAvg5,
                // Valore avg5 associato alla solve corrente
                avg5: formatRecordValue(avg5),
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

        const allSolvesResult = await client.query(
            `
            SELECT
                tempo,
                falloispezione,
                fallomossa,
                isdnf
            FROM solves
            WHERE idut = $1
              AND idtipo = $2
            ORDER BY ordine ASC
            `,
            [idUt, idTipo]
        );

        const allSolves = allSolvesResult.rows;
        const result = [];

        function getCurrentRecordValue(nsolve) {
            if (allSolves.length < nsolve) {
                return {
                    value: null,
                    isDnf: false,
                    isAvailable: false
                };
            }

            const value = calculateRecordValue(
                allSolves.slice(-nsolve).reverse(),
                nsolve
            );

            return {
                value: formatRecordValue(value),
                isDnf: !Number.isFinite(value),
                isAvailable: true
            };
        }

        function getBestRecordValue(nsolve) {
            if (allSolves.length < nsolve) {
                return {
                    value: null,
                    isDnf: false,
                    isAvailable: false
                };
            }

            let best = null;

            for (let start = 0; start <= allSolves.length - nsolve; start++) {
                const value = calculateRecordValue(
                    allSolves.slice(start, start + nsolve),
                    nsolve
                );

                if (Number.isFinite(value) && (best === null || value < best)) {
                    best = value;
                }
            }

            return {
                value: best,
                isDnf: best === null,
                isAvailable: true
            };
        }

        for (const tipoRecord of recordsResult.rows) {
            // =========================================
            // CURRENT
            //
            // Single: ultima solve.
            // Average: media delle ultime N solve.
            // Stessa regola usata da checkRecords:
            // per ao5/ao12/... togliamo best e worst,
            // per ao3 teniamo tutti e 3 i tempi.
            // =========================================

            const currentRecord = getCurrentRecordValue(tipoRecord.nsolve);

            // =========================================
            // STAT BEST
            //
            // Record migliore ricalcolato sulle solve,
            // considerando anche le penalita dei falli.
            // =========================================

            const bestRecord = getBestRecordValue(tipoRecord.nsolve);

            result.push({
                idTipoRecord: tipoRecord.idtiporecord,
                descRecord: tipoRecord.descrecord,
                current: currentRecord.value,
                currentIsDnf: currentRecord.isDnf,
                currentAvailable: currentRecord.isAvailable,
                statBest: bestRecord.value,
                statBestIsDnf: bestRecord.isDnf,
                statBestAvailable: bestRecord.isAvailable
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

app.post('/getCalendarMonth', async (req, res) => {
    const { idUt, idTipo, year, month } = req.body;
    const selectedYear = Number(year);
    const selectedMonth = Number(month);

    if (!idUt || !idTipo || !Number.isInteger(selectedYear) || !Number.isInteger(selectedMonth) || selectedMonth < 1 || selectedMonth > 12) {
        return res.status(400).json({ error: 'Parametri mancanti o non validi' });
    }

    const monthStart = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-01`;
    const nextMonthDate = new Date(Date.UTC(selectedYear, selectedMonth, 1));
    const nextMonthStart = `${nextMonthDate.getUTCFullYear()}-${String(nextMonthDate.getUTCMonth() + 1).padStart(2, '0')}-01`;
    const client = await pool.connect();

    try {
        const solvesResult = await client.query(
            `
            SELECT
                s.idsolve,
                s.ordine,
                s.tempo,
                s.falloispezione,
                s.fallomossa,
                s.isdnf,
                se.dataora,
                to_char(se.dataora, 'YYYY-MM-DD') AS data
            FROM solves s
            JOIN sessioni se
              ON se.idsessione = s.idsessione
            WHERE s.idut = $1
              AND s.idtipo = $2
              AND se.dataora >= $3::date
              AND se.dataora < $4::date
            ORDER BY se.dataora ASC, s.ordine ASC
            `,
            [idUt, idTipo, monthStart, nextMonthStart]
        );

        const recordsResult = await client.query(
            `
            SELECT
                rr.idrecordentry,
                rr.idtiporecord,
                rr.tempo,
                r.descrecord,
                s.ordine,
                se.dataora,
                to_char(se.dataora, 'YYYY-MM-DD') AS data
            FROM regrecord rr
            JOIN record r
              ON r.idtiporecord = rr.idtiporecord
            JOIN solves s
              ON s.idsolve = rr.idsolve
            JOIN sessioni se
              ON se.idsessione = s.idsessione
            WHERE s.idut = $1
              AND s.idtipo = $2
              AND se.dataora >= $3::date
              AND se.dataora < $4::date
            ORDER BY se.dataora ASC, r.nsolve ASC
            `,
            [idUt, idTipo, monthStart, nextMonthStart]
        );

        res.status(200).json({
            calendar: buildCalendarMonthPayload({
                year: selectedYear,
                month: selectedMonth,
                solves: solvesResult.rows,
                records: recordsResult.rows
            })
        });
    } catch (err) {
        console.error('Errore getCalendarMonth:', err);
        res.status(500).json({ error: 'Errore server' });
    } finally {
        client.release();
    }
});

app.post('/getFullSolveData', async (req, res) => {
    const { idUt, idTipo, ordine } = req.body;

    // VALIDAZIONE

    if (!idUt || !idTipo || !ordine) 
        return res.status(400).json({ error: 'Parametri mancanti'});

    const client = await pool.connect();

    try {
        // RECUPERO SOLVE

        const solveResult = await client.query(
            `
            SELECT
                s.*,
                se.dataora,
                tc.desctipo AS nomecubo
            FROM solves s
            JOIN sessioni se
              ON se.idsessione = s.idsessione
            JOIN tipicubo tc
              ON tc.idtipo = s.idtipo
            WHERE s.idut = $1
              AND s.idtipo = $2
              AND s.ordine = $3
            `,
            [idUt, idTipo, ordine]
        );

        const solve = solveResult.rows[0];

        if (!solve) 
          return res.status(404).json({error: 'Solve non trovata'});
        

        // =========================================
        // RECUPERO TUTTE LE SOLVE
        // 
        // Servono per calcolare: avg3, avg5, avg12
        // =========================================

        const solvesResult = await client.query(
            `
            SELECT
                ordine,
                tempo,
                scramble,
                falloispezione,
                fallomossa,
                isdnf
            FROM solves
            WHERE idut = $1
              AND idtipo = $2
            ORDER BY ordine ASC
            `,
            [idUt, idTipo]
        );

        const solves = solvesResult.rows;

        // INDEX DELLA SOLVE

        const currentIndex = solves.findIndex(s => s.ordine == ordine);

        function formatSolveWithPenalties(solve) {
            return {
                ordine: solve.ordine,
                scramble: solve.scramble,
                tempo: formatSolveTime(solve),
                baseTempo: solve.tempo,
                falloIspezione: solve.falloispezione,
                falloMossa: solve.fallomossa,
                isdnf: solve.isdnf,
                isDnf: solve.isdnf,
                penalties: {
                    inspection: solve.falloispezione,
                    move: solve.fallomossa,
                    dnf: solve.isdnf
                }
            };
        }

        // FUNZIONE GENERICA MEDIA

        function calculateAverage(windowSolves) {
            return calculateRecordValue(windowSolves, windowSolves.length);
        }

        // =========================================
        // FUNZIONE GENERICA
        // 
        // Trova:
        // - miglior media
        // - che contiene la solve
        // =========================================

        function getBestAverage(size) {

            const windows = [];
            // SCORRIAMO TUTTE LE FINESTRE

            for (let start = 0; start <= solves.length - size; start++) {
                const end = start + size - 1;

                // CONTROLLA SE LA SOLVE È DENTRO LA FINESTRA
                if (currentIndex >= start && currentIndex <= end) {
                    const windowSolves = solves.slice(start, end + 1);
                    const avg = calculateAverage(windowSolves);

                    windows.push({
                        value: avg,
                        position: `${currentIndex - start + 1}/${size}`,
                        solves: windowSolves
                    });
                }
            }

            // NESSUNA MEDIA DISPONIBILE
            if (windows.length === 0) {
                return {
                    contributes: false,
                    value: null,
                    position: null,
                    solves: []
                };
            }

            // TROVA MEDIA MIGLIORE

            let best = windows[0];

            for (const w of windows) 
              if (w.value < best.value) 
                  best = w;
            
            // FORMATTA OUTPUT
            return {
                contributes: true,
                value: formatRecordValue(best.value),
                position: best.position,
                solves: best.solves.map(formatSolveWithPenalties)
            };
        }
        
        // RISPOSTA FINALE
        const response = {
            order: solve.ordine,
            scramble: solve.scramble,
            time: formatSolveTime(solve),
            baseTime: solve.tempo,
            sessionTime: solve.dataora,
            falloIspezione: solve.falloispezione,
            falloMossa: solve.fallomossa,
            isdnf: solve.isdnf,
            isDnf: solve.isdnf,
            penalties: {
                inspection: solve.falloispezione,
                move: solve.fallomossa,
                dnf: solve.isdnf
            },
            cubeType: {
                id: solve.idtipo,
                name: solve.nomecubo
            },
            averages: {
                avg3: getBestAverage(3),
                avg5: getBestAverage(5),
                avg12: getBestAverage(12)
            }
        };

        res.status(200).json(response);

    } catch (err) {
        console.error('Errore getFullSolveData:', err );

        res.status(500).json({ error: 'Errore server'});

    } finally {
        client.release();
    }
});


app.post('/changeSolve', async (req, res) => {
    const { idUt, idTipo, ordine, campo, valore } = req.body;
    if (!idUt || !idTipo || !ordine) {
        return res.status(400).send("Impossibile ottenere la solve");
    }
    
  if(campo.toLowerCase() != 'fallomossa' && campo.toLowerCase() != 'isdnf')
    return res.status(406).send("Campo non valido")

  if(typeof valore !== "boolean")
    return res.status(400).send("Valore non valido")

  try {
    const field = campo.toLowerCase()
    const values = [idUt, idTipo, ordine, valore]
    console.log(field)
    console.log(values)
    const query = `
      UPDATE solves
      SET ${field} = $4
      WHERE idut = $1 AND idtipo = $2 AND ordine = $3
      RETURNING *;
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).send("Solve non trovata");
    }

    const solve = result.rows[0];
    console.log(solve);
    res.status(200).json(solve);

  } catch (err) {
    console.error(err);
    res.status(500).send("Errore server");
  }
})


app.post('/deleteSolve', async (req, res) => {
    const { idUt, idTipo, ordine } = req.body;
    if (!idUt || !idTipo || !ordine) {
        return res.status(400).send("Impossibile ottenere la solve");
    }
    
  try {
    const values = [idUt, idTipo, ordine]

    const query = `
      DELETE FROM solves
      WHERE idut = $1 AND idtipo = $2 AND ordine = $3
      RETURNING *;
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).send("Solve non trovata");
    }

    
    res.status(200).json({message: "Solve eliminata con successo"});
  } catch (err) {
    console.error(err);
    res.status(500).send("Errore server");
  }
})

app.post('/allenamento/solve', async (req, res) => {

    /* =========================================
    // DATI RICEVUTI DAL CLIENT
    // 
    // {
    //   idUt: number
    //   idAlg: number
    //   tempo: number
    //   best: number
    //   media: number
    //   nSolves: number
    // }
    // ========================================= */

    const {idUt, idAlg, tempo, best, media, nSolves} = req.body;

    // VALIDAZIONE BASE
    if ( !idUt || !idAlg || best == null || media == null || nSolves == null) 
        return res.status(400).json({ error: 'Parametri mancanti'});
    

    const client = await pool.connect();

    try {
        // APERTURA TRANSAZIONE

        await client.query('BEGIN');

        // LOCK ANTI CONCORRENZA

        await client.query( 'SELECT pg_advisory_xact_lock($1, $2)', [idUt, idAlg]);

        // CONTROLLO ESISTENZA RECORD
        const trainingResult = await client.query(
            `
            SELECT *
            FROM allenamento
            WHERE idut = $1
              AND idalg = $2
            `,
            [idUt, idAlg]
        );

        let training;

        // UPDATE RECORD ESISTENTE
        if (trainingResult.rows.length > 0) {

            const updateResult = await client.query(
                `
                UPDATE allenamento
                SET
                    best = $1,
                    media = $2,
                    nsolves = $3
                WHERE idut = $4
                  AND idalg = $5

                RETURNING *
                `,
                [best, media, nSolves, idUt, idAlg]
            );

            training = updateResult.rows[0];
        } else {

            // INSERT NUOVO RECORD
            const insertResult = await client.query(
                `
                INSERT INTO allenamento
                (idut, idalg, best, media, nsolves)
                VALUES ( $1, $2, $3, $4, $5)
                RETURNING *
                `,
                [idUt, idAlg, best, media, nSolves ]
            );

            training = insertResult.rows[0];
        }

        // COMMIT FINALE
        await client.query('COMMIT');

        // RISPOSTA
        res.status(200).json({ training });

    } catch (err) {

        // ROLLBACK
        await client.query('ROLLBACK');

        console.error('Errore saveTraining:', err);
        res.status(500).json({ error: 'Errore server' });

    } finally {
        // RILASCIO CONNESSIONE
        client.release();
    }
});