# Documentazione del progetto di esame: T-Cube

> Documentazione Tecnica  
> Versione: 1.0.0  
> Stato: Bozza  
> Ultimo aggiornamento: 2026-03-13  
> Autore/i: Pescheta Lorenzo

---

# Indice

1. [Abstract](#1-abstract)
2. [Introduzione](#2-introduzione)
3. [Panoramica del Sistema](#3-panoramica-del-sistema)
4. [Data Flow Diagram (DFD)](#4-data-flow-diagram-dfd)
5. [Requisiti di Sistema](#5-requisiti-di-sistema)
6. [Schema Entità-Relazione (E/R)](#6-schema-entità-relazione-er)
7. [Struttura dell’Interfaccia (Markup)](#7-struttura-dellinterfaccia-markup)
8. [Strategia di Test](#8-strategia-di-test)
9. [Evoluzioni Future](#9-evoluzioni-future)
10. [Glossario](#10-glossario)

---

# 1. Abstract

Questo progetto ha l’obiettivo di creare una piattaforma dedicata al mondo del **cubo di Rubik**: permetterà agli utenti di allenarsi, migliorare e monitorare i propri progressi nel tempo. 

---

# 2. Introduzione

Il progetto nasce da un’idea personale, sviluppata a partire dalla mia esperienza come appassionato di cubo di Rubik. Nel cercare strumenti utili per allenarmi e migliorare, non ho trovato applicazioni o siti che offrissero tutte le funzionalità di cui avevo bisogno in un unico ambiente semplice e organizzato. Per questo motivo ho deciso di progettare e sviluppare personalmente una piattaforma che riunisca questi strumenti e renda più facile allenarsi, imparare e monitorare i propri progressi nel mondo del cubing.

Il sito è strutturato attorno a tre funzionalità principali, riassumibili nelle **“3T”**. 

La prima è **Timer**, dedicata alla registrazione e all’analisi dei tempi di risoluzione del cubo, permettendo agli utenti di cronometrare le proprie *"solves"*96 e osservare i miglioramenti nel tempo. 

La seconda è **Training**, pensata per allenarsi su specifiche fasi della risoluzione, in modo da migliorare velocità concentrandosi su ogni dettaglio della risoluzione. 

Infine, la sezione **Tutorial** è rivolta ai principianti e offre guide passo passo per imparare a risolvere il cubo di Rubik ed entrare nel mondo del cubing.


# 3. Panoramica del Sistema

## 3.1 Architettura Generale

Descrivere l'architettura complessiva in modo tenico indicando il tipo di sistema, la gestione del server e l'accesso ai dati e le API. 

---

## 3.2 Stack Tecnologico

| Livello | Tecnologia |
|----------|-----------|
| Frontend | Vue |
| Backend | Express |
| Database | PostgresSQL |
| Autenticazione | |
| Infrastruttura | |

---

# 4. Data Flow Diagram (DFD)

## 4.1 Diagramma di Contesto (Livello 0)

Descrivere:

- Entità esterne  
- Processo principale del sistema  
- Flussi di dati primari  

Inserire il diagramma qui:

![DFD](image/DFD%20-%20T-cube.svg)


---

## 4.2 DFD Livello 1

Elencare i processi principali:

| ID Processo | Nome Processo | Descrizione |
|------------|--------------|------------|
| P1 | Login/registrazione | Salvataggio dati utente |
| P2 | Nuovo tempo - prova | Aggiunta di un nuovo tempo |
| P3 | Nuovo tempo - allenamento | Aggiunta di un nuovo tempo |

Spiegare come i dati si muovono tra processi e archivi dati.

---

# 5. Requisiti di Sistema

## 5.1 Requisiti Funzionali

I requisiti funzionali descrivono ciò che il sistema deve fare.

| ID | Descrizione del Requisito | Priorità |
|----|--------------------------|----------|
| RF-01 | Consentire il salvaggio dei tempi | Alta |
| RF-02 | Generare automaticamente nuovi scramble | Alta |
| RF-03 | Riconoscimento automatico di uno scramble | Media |
| RF-04 | Visualizzazione dei tempi precedenti in diverse modalità | Alta |
| RF-05 | Mostrare un tutorial | Alta |
| RF-06 | Risolvere automaticamente da uno scramble | Media |
| RF-07 | Download/Upload dei propri tempi | Media |

Esempio:

- RF-01: Il sistema deve consentire la registrazione degli utenti.  
- RF-02: Il sistema deve validare le credenziali prima di concedere l’accesso.  

---

## 5.2 Requisiti Non Funzionali

I requisiti non funzionali definiscono attributi di qualità.

### Prestazioni
- Tempo massimo di risposta:  
- Numero di utenti concorrenti supportati:  
- Throughput:  

### Sicurezza
- Metodo di autenticazione:  
- Modello di autorizzazione:  
- Crittografia dei dati:  
- Logging e audit:  

### Affidabilità
- Strategia di backup:  
- RTO (Recovery Time Objective):  
- RPO (Recovery Point Objective):  

### Scalabilità
- Scalabilità orizzontale:  
- Scalabilità verticale:  

### Usabilità
- Conformità accessibilità:  
- Browser supportati:  
- Responsive design:  

---

## 5.3 Requisiti Hardware

| Componente | Requisito Minimo |
|------------|-----------------|
| CPU | |
| RAM | |
| Storage | |

---

## 5.4 Requisiti Software

| Componente | Versione |
|------------|---------|
| Sistema Operativo | |
| Database | |
| Runtime | |
| Browser | |

---

# 6. Schema Entità-Relazione (E/R)

*(Da completare nelle versioni future)*

## 6.1 Entità

| Entità | Descrizione |
|--------|------------|
| | |

## 6.2 Relazioni

| Relazione | Entità Coinvolte | Cardinalità |
|-----------|-----------------|-------------|
| | | |

Inserire il diagramma E/R qui.

![SchemaE/R](image/Schema%20E%20R.svg)

---

# 7. Struttura dell’Interfaccia (Markup)

*(Da completare nelle versioni future)*

## 7.1 Struttura delle Pagine

| Pagina | Descrizione | Livello di Accesso |
|--------|------------|-------------------|
| | | |

## 7.2 Componenti Principali

- Navigazione  
- Form  
- Tabelle dati  
- Dashboard  
- Notifiche  

---

# 8. Strategia di Test

## 8.1 Approccio ai Test

- Test Unitari  
- Test di Integrazione  
- Test di Sistema  
- Test di Accettazione Utente (UAT)  

---

## 8.2 Casi di Test

| ID Test | Descrizione | Input | Output Atteso | Stato |
|---------|------------|-------|--------------|--------|
| TC-01 | | | | |

---

## 8.3 Tracciamento Difetti

| ID Issue | Descrizione | Gravità | Stato |
|----------|------------|----------|--------|
| | | | |

---

# 9. Evoluzioni Future

- Miglioramenti pianificati  
- Refactoring architetturale  
- Ottimizzazione delle performance  
- Estensione funzionalità  

---

# 10. Glossario

| Termine | Definizione |
|----------|------------|
| | |

---