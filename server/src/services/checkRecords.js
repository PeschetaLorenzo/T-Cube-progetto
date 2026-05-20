/*
 * Controlla e aggiorna i record dell'utente per un tipo di cubo.
 *
 * La funzione NON apre e NON chiude una transazione: usa il client ricevuto.
 * In questo modo puo essere richiamata dentro addSolve, modifica solve,
 * eliminazione solve o altri servizi mantenendo tutte le query atomiche.
 *
 * Esempio di utilizzo con transazione:
 *
 * const client = await pool.connect();
 *
 * try {
 *   await client.query('BEGIN');
 *
 *   // query di inserimento / modifica / eliminazione solve...
 *
 *   const nuoviRecord = await checkRecords({
 *     client,
 *     idUt,
 *     idTipo,
 *     solve: solveDaControllare
 *   });
 *
 *   await client.query('COMMIT');
 * } catch (err) {
 *   await client.query('ROLLBACK');
 *   throw err;
 * } finally {
 *   client.release();
 * }
 */
import { calculateRecordValue } from "./recordStats.js";

export async function checkRecords({ client, idUt, idTipo, solve }) {
    if (!client || !idUt || !idTipo || !solve) {
        throw new Error('Parametri mancanti per checkRecords');
    }

    const idSolve = solve.idsolve;
    const tempoSolve = solve.tempo;

    if (!idSolve || tempoSolve == null) {
        throw new Error('La solve deve contenere idsolve e tempo');
    }

    // Recuperiamo solo i tipi di record collegati al cubo corrente.
    const recordsResult = await client.query(
        `
        SELECT *
        FROM record
        WHERE idtipo = $1
        `,
        [idTipo]
    );

    const nuoviRecord = [];

    // Per ogni tipo record (single, ao5, ao12...) calcoliamo il valore attuale.
    for (const tipoRecord of recordsResult.rows) {
        let valoreRecord = null;

        if (tipoRecord.nsolve === 1) {
            // Single: il record candidato e il tempo della solve corrente.
            valoreRecord = calculateRecordValue([solve], 1);
        } else {
            // Average: recuperiamo le ultime N solve dell'utente per questo cubo.
            const solvesStatsResult = await client.query(
                `
                SELECT
                    tempo,
                    falloispezione,
                    fallomossa,
                    isdnf
                FROM solves
                WHERE idut = $1
                  AND idtipo = $2
                ORDER BY ordine DESC
                LIMIT $3
                `,
                [idUt, idTipo, tipoRecord.nsolve]
            );

            const solvesStats = solvesStatsResult.rows;

            if (solvesStats.length < tipoRecord.nsolve) {
                continue;
            }

            valoreRecord = calculateRecordValue(solvesStats, tipoRecord.nsolve);
        }

        if (!Number.isFinite(valoreRecord)) {
            continue;
        }

        // Cerchiamo il record attuale dell'utente per il tipo record corrente.
        const recordEsistenteResult = await client.query(
            `
            SELECT
                rr.idrecordentry,
                rr.tempo
            FROM regrecord rr
            JOIN solves s
              ON s.idsolve = rr.idsolve
            WHERE rr.idtiporecord = $1
              AND s.idut = $2
            LIMIT 1
            `,
            [tipoRecord.idtiporecord, idUt]
        );

        const recordEsistente = recordEsistenteResult.rows[0];

        if (!recordEsistente) {
            // Primo record registrato dall'utente per questo tipo record.
            await client.query(
                `
                INSERT INTO regrecord (idtiporecord, tempo, idsolve)
                VALUES ($1, $2, $3)
                `,
                [tipoRecord.idtiporecord, valoreRecord, idSolve]
            );

            nuoviRecord.push(tipoRecord.descrecord);
        } else if (valoreRecord < recordEsistente.tempo) {
            // Nuovo record migliore: aggiorniamo tempo e solve associata.
            await client.query(
                `
                UPDATE regrecord
                SET
                    tempo = $1,
                    idsolve = $2
                WHERE idrecordentry = $3
                `,
                [valoreRecord, idSolve, recordEsistente.idrecordentry]
            );

            nuoviRecord.push(tipoRecord.descrecord);
        }
    }

    return nuoviRecord;
}
