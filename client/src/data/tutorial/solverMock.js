export const solverMockSolution = {
    inputState: 'UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB',
    scramble: "R U R' F2 D L2",
    summary: 'Soluzione dimostrativa pronta per collegare un solver reale.',
    moves: [
        { id: 'solve-1', move: "R'", label: 'Ripristina lo spigolo destro', phase: 'Cross' },
        { id: 'solve-2', move: 'U', label: 'Allinea lo slot superiore', phase: 'F2L' },
        { id: 'solve-3', move: 'F2', label: 'Chiudi la coppia frontale', phase: 'F2L' },
        { id: 'solve-4', move: "U'", label: 'Prepara ultimo strato', phase: 'OLL' },
        { id: 'solve-5', move: 'R', label: 'Permuta ultimo strato', phase: 'PLL' }
    ]
}
