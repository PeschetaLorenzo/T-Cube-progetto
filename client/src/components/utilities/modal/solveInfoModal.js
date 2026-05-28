import { reactive } from 'vue'
import { getFullSolveData } from '@/js/controller'

export const demoSolveInfo = {
  order: 42,
  scramble: "R U R' F2 D L2 U' B R2 F' U2 L",
  time: 12834,
  sessionTime: '2026-05-11T10:12:00',
  penalties: {
    inspection: false,
    move: false
  },
  cubeType: {
    id: 1,
    name: '3x3'
  },
  averages: {
    avg3: {
      contributes: true,
      value: 13012,
      position: '2/3'
    },
    avg5: {
      contributes: true,
      value: 13190,
      position: '4/5'
    },
    avg12: {
      contributes: false,
      value: null,
      position: null
    }
  },
  user: {
    id: 7,
    username: 'demo_user',
    mail: 'demo@example.com'
  }
}

export const solveInfoModalState = reactive({
  visible: false,
  solve: demoSolveInfo
})

export async function openSolveInfoModal(solveOrOrder = demoSolveInfo) {
  if (typeof solveOrOrder === 'number' || typeof solveOrOrder === 'string') {
    try {
      solveInfoModalState.solve = await getFullSolveData(solveOrOrder)
      solveInfoModalState.user = JSON.parse(sessionStorage.getItem('utente'))
    } catch (err) {
      console.error('Errore apertura dettaglio solve:', err)
      solveInfoModalState.solve = {
        ...demoSolveInfo,
        order: solveOrOrder
      }
    }

    solveInfoModalState.visible = true
    return
  }


  solveInfoModalState.solve = solveOrOrder ?? demoSolveInfo
  solveInfoModalState.visible = true
}

export function closeSolveInfoModal() {
  solveInfoModalState.visible = false
}
