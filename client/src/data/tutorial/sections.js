const trainingTargets = {
    oll: { label: 'Apri trainer OLL', typeQuery: ['OLL'] },
    twoLookOll1: { label: 'Apri trainer 2-look OLL', typeQuery: ['2 STEP OLL - FASE 1'] },
    twoLookOll2: { label: 'Apri trainer 2-look OLL', typeQuery: ['2 STEP OLL - FASE 2'] },
    pll: { label: 'Apri trainer PLL', typeQuery: ['PLL'] },
    twoLookPll1: { label: 'Apri trainer 2-look PLL', typeQuery: ['2 STEP PLL - FASE 1'] },
    twoLookPll2: { label: 'Apri trainer 2-look PLL', typeQuery: ['2 STEP PLL - FASE 2'] }
}

export const tutorialSections = [
    {
        id: 'layers-cross',
        categoryId: 'layers',
        title: 'Croce bianca',
        description: 'Costruisci la base della soluzione allineando gli spigoli bianchi ai rispettivi centri.',
        steps: [
            {
                id: 'cross-goal',
                title: 'Obiettivo della croce',
                description: 'La croce non è solo bianca sopra: ogni spigolo deve combaciare anche con il centro laterale.',
                imagePath: '/cube image/TUTORIAL STRATI/Cross.png',
                cubeState: null,
                algorithm: '',
                tips: [
                    'Lavora su uno spigolo alla volta e controlla sempre il colore laterale.',
                    'Tieni la croce sul lato inferiore quando inizi a sentirti più sicuro.'
                ],
                contentNotes: [
                    'ATTENZIONE, la croce deve essere allineata correttamente'
                ],
                trainingLink: ''
            }
        ]
    },
    {
        id: 'layers-first-corners',
        categoryId: 'layers',
        title: 'Angoli primo strato',
        description: 'Inserisci gli angoli bianchi senza rompere gli spigoli già risolti.',
        steps: [
            {
                id: 'first-corners-insert',
                title: 'Inserimento base',
                description: 'Porta l’angolo sopra la sua posizione e ripeti il trigger finché entra orientato correttamente.',
                imagePath: '',
                cubeState: 'FFUUUUUURDRRFRRFRRLLFFFUFFUDDLDDDDDDUBBLLLLLLBRRBBBBBB',
                algorithm: "R U R'",
                tips: [
                    'Controlla i tre colori dell’angolo prima di inserirlo.',
                    'Se l’angolo è bloccato sotto, estrailo con lo stesso trigger e riprova.'
                ],
                contentNotes: [
                    
                ],
                trainingLink: ''
            }
        ]
    },
    {
        id: 'layers-second-layer',
        categoryId: 'layers',
        title: 'Secondo strato',
        description: 'Sposta gli spigoli senza giallo nel livello centrale.',
        steps: [
            {
                id: 'second-layer-right-left',
                title: 'Inserimenti a destra e sinistra',
                description: 'Usa i trigger per inserire lo spigolo nella direzione corretta mantenendo il primo strato.',
                imagePath: '',
                cubeState: 'UUFUULBRURUUBRRRRRUFFFFUFFFDDDDDDDDDBFLLLLLLLLRRBBBBBB',
                algorithm: "U R U' R' U' F' U F",
                tips: [
                    'Prima allinea il colore frontale dello spigolo con il centro.',
                    'Se lo spigolo deve andare a sinistra, usa il caso specchiato.'
                ],
                contentNotes: [
                    'Potrebbe capitare anche un inserimento sul lato sinistro, ripete le mosse in modo specchiato'
                ],
                trainingLink: ''
            }
        ]
    },
    {
        id: 'layers-yellow-cross',
        categoryId: 'layers',
        title: 'Croce gialla',
        description: 'Orienta gli spigoli gialli dell’ultimo strato.',
        steps: [
            {
                id: 'yellow-cross-shapes',
                title: 'Linea, L e punto',
                description: 'Riconosci la forma gialla e applica il setup corretto prima dell’algoritmo.',
                imagePath: '/cube image/2OLL/Dot Shape.png',
                cubeState: null,
                algorithm: 'F R U R\' U\' F\'',
                tips: [
                    'Con la L, metti i due spigoli gialli in alto e a sinistra.',
                    'Con la linea, tienila orizzontale.'
                ],
                contentNotes: [
                    
                ],
                trainingLink: trainingTargets.twoLookOll1
            }
        ]
    },
    {
        id: 'layers-oll',
        categoryId: 'layers',
        title: 'Orientamento ultimo strato',
        description: 'Completa la faccia gialla orientando tutti gli angoli.',
        steps: [
            {
                id: 'oll-sune',
                title: 'Caso Sune',
                description: 'Uno dei primi casi utili per orientare gli angoli gialli.',
                imagePath: '/cube image/OLL/27.png',
                cubeState: 'RUFUUUUULBBURRRRRRBFUFFFFFFDDDDDDDDDFRRLLLLLLLLUBBBBBB',
                algorithm: "R U R' U R U2 R'",
                tips: [
                    'Riconosci il faro giallo laterale prima di partire.',
                    'Mantieni il ritmo del trigger R U R\'.'
                ],
                contentNotes: [
                    'Potrebbe capitare anche un inserimento sul lato sinistro, ripete le mosse in modo specchiato'
                ],
                trainingLink: trainingTargets.twoLookOll2
            }
        ]
    },
    {
        id: 'layers-pll1',
        categoryId: 'layers',
        title: 'Permutazione ultimo strato',
        description: 'Sposta pezzi già orientati fino a completare il cubo.',
        steps: [
            {
                id: 'pll-tperm',
                title: 'T-Perm',
                description: 'Permutazione molto frequente per scambiare una coppia di angoli e una coppia di spigoli.',
                imagePath: '/cube image/PLL/TPerm.png',
                cubeState: null,
                algorithm: "R U R' U' R' F R2 U' R' U' R U R' F'",
                tips: [
                    'È un ottimo algoritmo per allenare fingertricks R/U/F.',
                    'Cerca i due blocchi già risolti per orientare il caso.'
                ],
                contentNotes: [
                    "Questo non è l'unico caso possibile, apri la sezione trainer per impararli tutti!"
                ],
                trainingLink: trainingTargets.twoLookPll1
            }
        ]
    },
        {
        id: 'layers-pll2',
        categoryId: 'layers',
        title: 'Permutazione ultimo strato',
        description: 'Sposta spigoli già orientati fino a completare il cubo.',
        steps: [
            {
                id: 'pll-tperm',
                title: 'T-Perm',
                description: 'Permutazione utilizzata per ruotare 3 spigoli.',
                imagePath: '/cube image/PLL/UaPerm.png',
                cubeState: null,
                algorithm: "R U R' U' R' F R2 U' R' U' R U R' F'",
                tips: [
                    
                ],
                contentNotes: [
                    'ATTENZIONE, il cubo deve essere orientato correttamente',
                    'In alcuni casi potrebbe essere necessario eseguire più volte questo passaggio'
                ],
                trainingLink: trainingTargets.twoLookPll2
            }
        ]
    },
    {
        id: 'cfop-cross',
        categoryId: 'cfop',
        title: 'Cross',
        description: 'Pianifica la croce in ispezione e risolvila preferibilmente sul fondo.',
        steps: [
            {
                id: 'cfop-cross-planning',
                title: 'Pianificazione in ispezione',
                description: 'Individua gli spigoli, scegli un ordine semplice e prova a prevedere almeno i primi movimenti.',
                imagePath: '/cube image/TUTORIAL STRATI/Cross.png',
                cubeState: null,
                algorithm: '',
                tips: [
                    'Parti da soluzioni corte e leggibili, non dalla soluzione perfetta.',
                    'Conta le mosse solo dopo aver capito il percorso dei pezzi.'
                ],
                contentNotes: [
                    'Inserire esempi di scramble con soluzione cross commentata.',
                    'Aggiungere immagini delle quattro posizioni iniziali più comuni.'
                ],
                trainingLink: trainingTargets.cross
            }
        ]
    },
    {
        id: 'cfop-f2l',
        categoryId: 'cfop',
        title: 'F2L',
        description: 'Accoppia angolo e spigolo, poi inserisci la coppia nello slot corretto.',
        steps: [
            {
                id: 'cfop-f2l-pair',
                title: 'Coppia base',
                description: 'Cerca angolo e spigolo, separali se sono attaccati male e inserisci la coppia pronta.',
                imagePath: '',
                cubeState: 'UULUUFUUFRRUBRRURRFFDFFUFFFDDRDDDDDDBLLLLLLLLBRRBBBBBB',
                algorithm: "U R U' R'",
                tips: [
                    'Rallenta e guarda avanti: il vantaggio del F2L nasce dal riconoscimento.',
                    'Allenati prima con slot frontali, poi passa agli slot posteriori.'
                ],
                contentNotes: [
                    'Caso di esempio, potrebbero capitare anche altre situazioni'                    
                ],
                trainingLink: trainingTargets.f2l
            }
        ]
    },
    {
        id: 'cfop-oll',
        categoryId: 'cfop',
        title: 'OLL e 2-look OLL',
        description: 'Orienta l’ultimo strato: prima con due passaggi, poi con i casi completi.',
        steps: [
            {
                id: 'cfop-2look-oll',
                title: '2-look OLL',
                description: 'Prima crea la croce gialla, poi orienta gli angoli con pochi casi fondamentali.',
                imagePath: '/cube image/2OLL/I-Shape.png',
                cubeState: null,
                algorithm: 'F R U R\' U\' F\'',
                tips: [
                    'Impara bene i setup: riducono il numero di algoritmi da ricordare.',
                    'Quando i casi sono automatici, passa gradualmente agli OLL completi.'
                ],
                contentNotes: [
                    'Inserire tutte le immagini 2-look OLL già presenti in public.',
                    'Preparare tabella per espandere ai 57 OLL.'
                ],
                trainingLink: trainingTargets.oll
            }
        ]
    },
    {
        id: 'cfop-pll',
        categoryId: 'cfop',
        title: 'PLL e 2-look PLL',
        description: 'Permuta l’ultimo strato con approccio semplificato o completo.',
        steps: [
            {
                id: 'cfop-2look-pll',
                title: '2-look PLL',
                description: 'Risolvi prima angoli o spigoli, poi completa con il secondo algoritmo.',
                imagePath: '/cube image/2PLL/Headlights.png',
                cubeState: null,
                algorithm: "R U R' U' R' F R2 U' R' U' R U R' F'",
                tips: [
                    'Riconosci fari, diagonale e cicli degli spigoli.',
                    'Usa il 2-look come ponte prima dei 21 PLL completi.'
                ],
                contentNotes: [
                    'Inserire immagini Headlights e Diagonale.',
                    'Collegare i casi completi PLL alle immagini già presenti.'
                ],
                trainingLink: trainingTargets.pll
            }
        ]
    }
]
