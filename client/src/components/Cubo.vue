<template>
  <div ref="rootRef" class="d-flex flex-column" :style="{ '--move-transition-time': moveTransitionTime() + 's' }">
    <div class="scene">
      <div class="cube">
        <!-- corners -->
        <div class="cube-layer">
          <div class="cubie cubie-corner-position-0">
            <div class="cubie cubie-corner-orientation-0">
              <div class="cubie-face face-u cubie-sticker sticker-u"></div>
              <div class="cubie-face face-f cubie-sticker sticker-f"></div>
              <div class="cubie-face face-r cubie-sticker sticker-r"></div>
              <div class="cubie-face face-l"></div>
              <div class="cubie-face face-b"></div>
              <div class="cubie-face face-d"></div>
            </div>
          </div>
        </div>
        <div class="cube-layer">
          <div class="cubie cubie-corner-position-1">
            <div class="cubie cubie-corner-orientation-0">
              <div class="cubie-face face-u cubie-sticker sticker-u"></div>
              <div class="cubie-face face-f cubie-sticker sticker-l"></div>
              <div class="cubie-face face-r cubie-sticker sticker-f"></div>
              <div class="cubie-face face-l"></div>
              <div class="cubie-face face-b"></div>
              <div class="cubie-face face-d"></div>
            </div>
          </div>
        </div>
        <div class="cube-layer">
          <div class="cubie cubie-corner-position-2">
            <div class="cubie cubie-corner-orientation-0">
              <div class="cubie-face face-u cubie-sticker sticker-u"></div>
              <div class="cubie-face face-f cubie-sticker sticker-r"></div>
              <div class="cubie-face face-r cubie-sticker sticker-b"></div>
              <div class="cubie-face face-l"></div>
              <div class="cubie-face face-b"></div>
              <div class="cubie-face face-d"></div>
            </div>
          </div>
        </div>
        <div class="cube-layer">
          <div class="cubie cubie-corner-position-3">
            <div class="cubie cubie-corner-orientation-0">
              <div class="cubie-face face-u cubie-sticker sticker-u"></div>
              <div class="cubie-face face-f cubie-sticker sticker-b"></div>
              <div class="cubie-face face-r cubie-sticker sticker-l"></div>
              <div class="cubie-face face-l"></div>
              <div class="cubie-face face-b"></div>
              <div class="cubie-face face-d"></div>
            </div>
          </div>
        </div>
        <div class="cube-layer">
          <div class="cubie cubie-corner-position-4">
            <div class="cubie cubie-corner-orientation-0">
              <div class="cubie-face face-u cubie-sticker sticker-d"></div>
              <div class="cubie-face face-f cubie-sticker sticker-r"></div>
              <div class="cubie-face face-r cubie-sticker sticker-f"></div>
              <div class="cubie-face face-l"></div>
              <div class="cubie-face face-b"></div>
              <div class="cubie-face face-d"></div>
            </div>
          </div>
        </div>
        <div class="cube-layer">
          <div class="cubie cubie-corner-position-5">
            <div class="cubie cubie-corner-orientation-0">
              <div class="cubie-face face-u cubie-sticker sticker-d"></div>
              <div class="cubie-face face-f cubie-sticker sticker-f"></div>
              <div class="cubie-face face-r cubie-sticker sticker-l"></div>
              <div class="cubie-face face-l"></div>
              <div class="cubie-face face-b"></div>
              <div class="cubie-face face-d"></div>
            </div>
          </div>
        </div>
        <div class="cube-layer">
          <div class="cubie cubie-corner-position-6">
            <div class="cubie cubie-corner-orientation-0">
              <div class="cubie-face face-u cubie-sticker sticker-d"></div>
              <div class="cubie-face face-f cubie-sticker sticker-b"></div>
              <div class="cubie-face face-r cubie-sticker sticker-r"></div>
              <div class="cubie-face face-l"></div>
              <div class="cubie-face face-b"></div>
              <div class="cubie-face face-d"></div>
            </div>
          </div>
        </div>
        <div class="cube-layer">
          <div class="cubie cubie-corner-position-7">
            <div class="cubie cubie-corner-orientation-0">
              <div class="cubie-face face-u cubie-sticker sticker-d"></div>
              <div class="cubie-face face-f cubie-sticker sticker-l"></div>
              <div class="cubie-face face-r cubie-sticker sticker-b"></div>
              <div class="cubie-face face-l"></div>
              <div class="cubie-face face-b"></div>
              <div class="cubie-face face-d"></div>
            </div>
          </div>
        </div>

        <!-- edges -->
        <div class="cube-layer">
          <div class="cubie cubie-edge-position-0">
            <div class="cubie cubie-edge-orientation-0">
              <div class="cubie-face face-u cubie-sticker sticker-u"></div>
              <div class="cubie-face face-f cubie-sticker sticker-f"></div>
              <div class="cubie-face face-r"></div>
              <div class="cubie-face face-l"></div>
              <div class="cubie-face face-b"></div>
              <div class="cubie-face face-d"></div>
            </div>
          </div>
        </div>
        <div class="cube-layer">
          <div class="cubie cubie-edge-position-1">
            <div class="cubie cubie-edge-orientation-0">
              <div class="cubie-face face-u cubie-sticker sticker-u"></div>
              <div class="cubie-face face-f cubie-sticker sticker-l"></div>
              <div class="cubie-face face-r"></div>
              <div class="cubie-face face-l"></div>
              <div class="cubie-face face-b"></div>
              <div class="cubie-face face-d"></div>
            </div>
          </div>
        </div>
        <div class="cube-layer">
          <div class="cubie cubie-edge-position-2">
            <div class="cubie cubie-edge-orientation-0">
              <div class="cubie-face face-u cubie-sticker sticker-u"></div>
              <div class="cubie-face face-f cubie-sticker sticker-r"></div>
              <div class="cubie-face face-r"></div>
              <div class="cubie-face face-l"></div>
              <div class="cubie-face face-b"></div>
              <div class="cubie-face face-d"></div>
            </div>
          </div>
        </div>
        <div class="cube-layer">
          <div class="cubie cubie-edge-position-3">
            <div class="cubie cubie-edge-orientation-0">
              <div class="cubie-face face-u cubie-sticker sticker-u"></div>
              <div class="cubie-face face-f cubie-sticker sticker-b"></div>
              <div class="cubie-face face-r"></div>
              <div class="cubie-face face-l"></div>
              <div class="cubie-face face-b"></div>
              <div class="cubie-face face-d"></div>
            </div>
          </div>
        </div>

        <div class="cube-layer">
          <div class="cubie cubie-edge-position-4">
            <div class="cubie cubie-edge-orientation-0">
              <div class="cubie-face face-u cubie-sticker sticker-d"></div>
              <div class="cubie-face face-f cubie-sticker sticker-f"></div>
              <div class="cubie-face face-r"></div>
              <div class="cubie-face face-l"></div>
              <div class="cubie-face face-b"></div>
              <div class="cubie-face face-d"></div>
            </div>
          </div>
        </div>
        <div class="cube-layer">
          <div class="cubie cubie-edge-position-5">
            <div class="cubie cubie-edge-orientation-0">
              <div class="cubie-face face-u cubie-sticker sticker-d"></div>
              <div class="cubie-face face-f cubie-sticker sticker-l"></div>
              <div class="cubie-face face-r"></div>
              <div class="cubie-face face-l"></div>
              <div class="cubie-face face-b"></div>
              <div class="cubie-face face-d"></div>
            </div>
          </div>
        </div>
        <div class="cube-layer">
          <div class="cubie cubie-edge-position-6">
            <div class="cubie cubie-edge-orientation-0">
              <div class="cubie-face face-u cubie-sticker sticker-d"></div>
              <div class="cubie-face face-f cubie-sticker sticker-r"></div>
              <div class="cubie-face face-r"></div>
              <div class="cubie-face face-l"></div>
              <div class="cubie-face face-b"></div>
              <div class="cubie-face face-d"></div>
            </div>
          </div>
        </div>
        <div class="cube-layer">
          <div class="cubie cubie-edge-position-7">
            <div class="cubie cubie-edge-orientation-0">
              <div class="cubie-face face-u cubie-sticker sticker-d"></div>
              <div class="cubie-face face-f cubie-sticker sticker-b"></div>
              <div class="cubie-face face-r"></div>
              <div class="cubie-face face-l"></div>
              <div class="cubie-face face-b"></div>
              <div class="cubie-face face-d"></div>
            </div>
          </div>
        </div>

        <div class="cube-layer">
          <div class="cubie cubie-edge-position-8">
            <div class="cubie cubie-edge-orientation-0">
              <div class="cubie-face face-u cubie-sticker sticker-f"></div>
              <div class="cubie-face face-f cubie-sticker sticker-r"></div>
              <div class="cubie-face face-r"></div>
              <div class="cubie-face face-l"></div>
              <div class="cubie-face face-b"></div>
              <div class="cubie-face face-d"></div>
            </div>
          </div>
        </div>
        <div class="cube-layer">
          <div class="cubie cubie-edge-position-9">
            <div class="cubie cubie-edge-orientation-0">
              <div class="cubie-face face-u cubie-sticker sticker-f"></div>
              <div class="cubie-face face-f cubie-sticker sticker-l"></div>
              <div class="cubie-face face-r"></div>
              <div class="cubie-face face-l"></div>
              <div class="cubie-face face-b"></div>
              <div class="cubie-face face-d"></div>
            </div>
          </div>
        </div>
        <div class="cube-layer">
          <div class="cubie cubie-edge-position-10">
            <div class="cubie cubie-edge-orientation-0">
              <div class="cubie-face face-u cubie-sticker sticker-b"></div>
              <div class="cubie-face face-f cubie-sticker sticker-r"></div>
              <div class="cubie-face face-r"></div>
              <div class="cubie-face face-l"></div>
              <div class="cubie-face face-b"></div>
              <div class="cubie-face face-d"></div>
            </div>
          </div>
        </div>
        <div class="cube-layer">
          <div class="cubie cubie-edge-position-11">
            <div class="cubie cubie-edge-orientation-0">
              <div class="cubie-face face-u cubie-sticker sticker-b"></div>
              <div class="cubie-face face-f cubie-sticker sticker-l"></div>
              <div class="cubie-face face-r"></div>
              <div class="cubie-face face-l"></div>
              <div class="cubie-face face-b"></div>
              <div class="cubie-face face-d"></div>
            </div>
          </div>
        </div>

        <!-- middles -->
        <div class="cube-layer">
          <div class="cubie cubie-middle-r">
            <div class="cubie-face face-r cubie-sticker sticker-r"></div>
            <div class="cubie-face face-l"></div>
            <div class="cubie-face face-f"></div>
            <div class="cubie-face face-b"></div>
            <div class="cubie-face face-u"></div>
            <div class="cubie-face face-d"></div>
          </div>
        </div>
        <div class="cube-layer">
          <div class="cubie cubie-middle-l">
            <div class="cubie-face face-r"></div>
            <div class="cubie-face face-l cubie-sticker sticker-l"></div>
            <div class="cubie-face face-f"></div>
            <div class="cubie-face face-b"></div>
            <div class="cubie-face face-u"></div>
            <div class="cubie-face face-d"></div>
          </div>
        </div>
        <div class="cube-layer">
          <div class="cubie cubie-middle-f">
            <div class="cubie-face face-r"></div>
            <div class="cubie-face face-l"></div>
            <div class="cubie-face face-f cubie-sticker sticker-f"></div>
            <div class="cubie-face face-b"></div>
            <div class="cubie-face face-u"></div>
            <div class="cubie-face face-d"></div>
          </div>
        </div>
        <div class="cube-layer">
          <div class="cubie cubie-middle-b">
            <div class="cubie-face face-r"></div>
            <div class="cubie-face face-l"></div>
            <div class="cubie-face face-f"></div>
            <div class="cubie-face face-b cubie-sticker sticker-b"></div>
            <div class="cubie-face face-u"></div>
            <div class="cubie-face face-d"></div>
          </div>
        </div>
        <div class="cube-layer">
          <div class="cubie cubie-middle-u">
            <div class="cubie-face face-r"></div>
            <div class="cubie-face face-l"></div>
            <div class="cubie-face face-f"></div>
            <div class="cubie-face face-b"></div>
            <div class="cubie-face face-u cubie-sticker sticker-u"></div>
            <div class="cubie-face face-d"></div>
          </div>
        </div>
        <div class="cube-layer">
          <div class="cubie cubie-middle-d">
            <div class="cubie-face face-r"></div>
            <div class="cubie-face face-l"></div>
            <div class="cubie-face face-f"></div>
            <div class="cubie-face face-b"></div>
            <div class="cubie-face face-u"></div>
            <div class="cubie-face face-d cubie-sticker sticker-d"></div>
          </div>
        </div>
      </div>
    </div>  
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue';

type BasicFace = 'u' | 'f' | 'r' | 'l' | 'b' | 'd';
type Face = BasicFace | 'm' | 'e' | 's';
type Turn = `${Face}${1 | 2 | 3}`;

interface FaceLayer {
  corners?: number[];
  edges: number[];
  middles?: BasicFace[];
}

type LayersMap = Record<Face, FaceLayer>;

const props = withDefaults(
  defineProps<{
    turns?: string[];
    autoPlayOnTurnsChange?: boolean;
    keyboardEnabled?: boolean;
    showControls?: boolean;
    animationSpeed?: number;
  }>(),
  {
    autoPlayOnTurnsChange: true,
    keyboardEnabled: false,
    showControls: true,
    animationSpeed: 1
  }
);

const emit = defineEmits<{
  (e: 'update:turns', value: string[]): void;
  (e: 'move', value: string): void;
  (e: 'scramble', value: string[]): void;
}>();

const animationSpeedRef = ref(props.animationSpeed ?? 1);

const moveTransitionTime = () => 1.2 * animationSpeedRef.value;
const rotationAnimationTime = () => 120 * animationSpeedRef.value;

const layers: LayersMap = {
  u: { corners: [0, 1, 3, 2], edges: [0, 1, 3, 2] },
  f: { corners: [1, 0, 4, 5], edges: [0, 8, 4, 9] },
  r: { corners: [0, 2, 6, 4], edges: [6, 8, 2, 10] },
  l: { corners: [3, 1, 5, 7], edges: [1, 9, 5, 11] },
  b: { corners: [2, 3, 7, 6], edges: [3, 11, 7, 10] },
  d: { corners: [4, 6, 7, 5], edges: [4, 6, 7, 5] },
  m: { edges: [0, 4, 7, 3], middles: ['u', 'f', 'd', 'b'] },
  e: { edges: [9, 8, 10, 11], middles: ['f', 'r', 'b', 'l'] },
  s: { edges: [1, 2, 6, 5], middles: ['u', 'r', 'd', 'l'] }
};

const rootRef = ref<HTMLElement | null>(null);
const turnQueue = ref<Turn[]>([]);
const nTurn = ref(0);

let isRotating = false;
let isKeyRotating = false;
let isDragging = false;
let moveInterval: number | null = null;
let nextMoveTimeout: number | null = null;
let lastMoveKey: string | null = null;
let keyRotationInterval: number | null = null;

let previousMousePosition = { x: 0, y: 0 };
let cubeRotation = { x: -20, y: -30, z: 9 };
const rotationSpeed = 2;

let sceneElement: HTMLElement | null = null;
let layerElements: HTMLElement[] = [];
let solvedCubeClasses: string[] = [];

function asTurn(face: Face, step: 1 | 2 | 3): Turn {
  return `${face}${step}` as Turn;
}

function queryElement<T extends Element = HTMLElement>(selector: string): T | null {
  return rootRef.value?.querySelector<T>(selector) ?? null;
}

function queryAllElements<T extends Element = HTMLElement>(selector: string): T[] {
  return rootRef.value ? Array.from(rootRef.value.querySelectorAll<T>(selector)) : [];
}

function getParentElement(selector: string): HTMLElement | null {
  return queryElement<HTMLElement>(selector)?.parentElement ?? null;
}

function getScene(): HTMLElement | null {
  return queryElement<HTMLElement>('.scene');
}

function getCube(): HTMLElement | null {
  return queryElement<HTMLElement>('.cube');
}

function normalizeTurn(rawTurn: string): Turn | null {
  const cleaned = rawTurn.trim().toLowerCase();
  let match = cleaned.match(/^([ufrlbdmes])([123])$/);

  if (match) {
    return asTurn(match[1] as Face, Number(match[2]) as 1 | 2 | 3);
  }

  match = cleaned.match(/^([ufrlbdmes])(2|')?$/);
  if (!match) return null;

  const face = match[1] as Face;
  const suffix = match[2] ?? '';

  if (suffix === '2') return asTurn(face, 2);
  if (suffix === "'") return asTurn(face, 3);

  return asTurn(face, 1);
}

function normalizeTurns(input: string[] | undefined): Turn[] {
  if (!input) return [];

  return input
    .map(normalizeTurn)
    .filter((turn): turn is Turn => turn !== null);
}

function sameTurns(a: Turn[], b: Turn[]): boolean {
  if (a.length !== b.length) return false;

  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }

  return true;
}

function setTurns(
  nextTurns: Turn[],
  options: { resetIndex?: boolean; emitUpdate?: boolean } = {}
): void {
  const { resetIndex = false, emitUpdate = true } = options;

  turnQueue.value = [...nextTurns];
  if (resetIndex) nTurn.value = 0;

  if (emitUpdate) {
    emit('update:turns', [...turnQueue.value]);
  }
}

function captureSolvedCubeState(): void {
  solvedCubeClasses = queryAllElements<HTMLElement>('.cube-layer, .cube-layer *').map((element) => element.className);
}

function restoreSolvedCubeState(): void {
  if (solvedCubeClasses.length === 0) return;

  const currentElements = queryAllElements<HTMLElement>('.cube-layer, .cube-layer *');
  if (currentElements.length !== solvedCubeClasses.length) return;

  for (let i = 0; i < currentElements.length; ++i) {
    currentElements[i].className = solvedCubeClasses[i];
  }
}

function resetCube(options: { emitUpdate?: boolean } = {}): void {
  const { emitUpdate = true } = options;

  if (nextMoveTimeout !== null) {
    clearTimeout(nextMoveTimeout);
    nextMoveTimeout = null;
  }

  setTurns([], { resetIndex: true, emitUpdate });
  restoreSolvedCubeState();
}

function move(turn: Turn): void {
  nTurn.value++;

  const side = turn[0] as Face;
  const layer = layers[side];
  const cubies: HTMLElement[] = [];

  if (['m', 'e', 's'].includes(side)) {
    for (let i = 0; i < layer.edges.length; ++i) {
      const edge = getParentElement('.cubie-edge-position-' + layer.edges[i]);
      if (edge) cubies.push(edge);
    }

    for (let i = 0; i < (layer.middles?.length ?? 0); ++i) {
      const middleFace = layer.middles?.[i];
      if (!middleFace) continue;

      const middle = getParentElement('.cubie-middle-' + middleFace);
      if (middle) cubies.push(middle);
    }
  } else {
    const middle = getParentElement('.cubie-middle-' + side);
    if (middle) cubies.push(middle);

    for (let i = 0; i < (layer.corners?.length ?? 0); ++i) {
      const corner = getParentElement('.cubie-corner-position-' + layer.corners![i]);
      if (corner) cubies.push(corner);
    }

    for (let i = 0; i < layer.edges.length; ++i) {
      const edge = getParentElement('.cubie-edge-position-' + layer.edges[i]);
      if (edge) cubies.push(edge);
    }
  }

  for (let i = 0; i < cubies.length; ++i) {
    cubies[i].classList.add('turn');
    cubies[i].classList.add('turn-' + turn);
  }

  emit('move', turn);
}

function updateCubie(this: HTMLElement): void {
  let match = this.className.match(/turn\-(..)/);
  if (!match) return;

  this.classList.remove('turn');
  this.classList.remove(match[0]);

  const step = Number(match[1][1]);
  const side = match[1][0] as Face;
  const layer = layers[side];
  let div = this.children[0] as HTMLElement | undefined;

  if (!div) return;

  if (['m', 'e', 's'].includes(side)) {
    let re = /(cubie-edge-position-)(\d+)/;
    if ((match = div.className.match(re))) {
      const idx = layer.edges.indexOf(Number(match[2]));
      const newVal = layer.edges[(idx + step) % 4];
      div.className = div.className.replace(re, '$1' + newVal);

      div = div.children[0] as HTMLElement | undefined;
      if (!div) return;

      re = /(cubie-edge-orientation-)(\d+)/;
      match = div.className.match(re);

      if (match) {
        const newOrientation = Number(match[2]) === 1 ? 0 : 1;
        div.className = div.className.replace(re, '$1' + newOrientation);
      }
    }
  } else {
    let re = /(cubie-corner-position-)(\d+)/;
    if ((match = div.className.match(re))) {
      const corners = layer.corners ?? [];
      const idx = corners.indexOf(Number(match[2]));
      const newVal = corners[(idx + step) & 3];
      div.className = div.className.replace(re, '$1' + newVal);

      div = div.children[0] as HTMLElement | undefined;
      if (!div) return;

      re = /(cubie-corner-orientation-)(\d+)/;
      match = div.className.match(re);

      if (match) {
        const newOrientation =
          (Number(match[2]) + Number(side !== 'u' && side !== 'd') * (step & 1) * (1 + (idx & 1))) % 3;
        div.className = div.className.replace(re, '$1' + newOrientation);
      }
    }

    re = /(cubie-edge-position-)(\d+)/;
    if ((match = div.className.match(re))) {
      const idx = layer.edges.indexOf(Number(match[2]));
      const newVal = layer.edges[(idx + step) & 3];
      div.className = div.className.replace(re, '$1' + newVal);

      div = div.children[0] as HTMLElement | undefined;
      if (!div) return;

      re = /(cubie-edge-orientation-)(\d+)/;
      match = div.className.match(re);

      if (match) {
        const newOrientation = (Number(match[2]) ^ ((side === 'f' || side === 'b' ? 1 : 0) & step)) & 1;
        div.className = div.className.replace(re, '$1' + newOrientation);
      }
    }
  }
}

function nextMove(): void {
  if (queryElement('.cube-layer.turn')) return;
  if (nextMoveTimeout !== null) return;

  if (nTurn.value < turnQueue.value.length) {
    nextMoveTimeout = window.setTimeout(() => {
      nextMoveTimeout = null;
      const next = turnQueue.value[nTurn.value % turnQueue.value.length];
      if (next) move(next);
    }, 10);
  }
  else {
    setTurns([], { resetIndex: true, emitUpdate: false });
  }
}

function zoom(e: WheelEvent): void {
  const scene = getScene();
  if (!scene) return;

  let scale = scene.style.scale ? parseFloat(scene.style.scale) * 100 : 100;

  if (e.deltaY > 0 && scale > 10) {
    scale -= 10;
  } else if (e.deltaY < 0 && scale < 200) {
    scale += 10;
  }

  scene.style.scale = `${scale}%`;
}
/*
function generateScramble(length: number): Turn[] {
  const turnPool: Turn[][] = [
    ['u1', 'u2', 'u3'],
    ['f1', 'f2', 'f3'],
    ['r1', 'r2', 'r3'],
    ['l1', 'l2', 'l3'],
    ['b1', 'b2', 'b3'],
    ['d1', 'd2', 'd3']
  ];

  const scramble: Turn[] = [];
  let prevFace = (Math.random() * 6) | 0;
  let t2 = prevFace + 1;

  scramble.push(turnPool[prevFace][(Math.random() * 3) | 0]);

  while (scramble.length < length) {
    let nextFace = (Math.random() * 6) | 0;

    while (nextFace === prevFace) {
      nextFace = (Math.random() * 6) | 0;
    }

    if (t2 === 0) {
      if (nextFace === 5 - prevFace) {
        while (nextFace === prevFace || nextFace === 5 - prevFace) {
          nextFace = (Math.random() * 6) | 0;
        }
      }
      t2 = nextFace + 1;
    } else if (t2 + nextFace === 6) {
      t2 = 0;
    } else {
      t2 = nextFace + 1;
    }

    scramble.push(turnPool[nextFace][(Math.random() * 3) | 0]);
    prevFace = nextFace;
  }

  return scramble;
}
*/
function toggleRotation(): void {
  const cube = getCube();
  if (!cube) return;

  isRotating = !isRotating;

  if (!isRotating) {
    const computedStyle = window.getComputedStyle(cube);
    const matrix = new DOMMatrix(computedStyle.transform);

    cubeRotation.y = Math.atan2(matrix.m13, matrix.m11) * (180 / Math.PI);
    cubeRotation.x = Math.atan2(-matrix.m23, matrix.m22) * (180 / Math.PI);

    cube.style.animation = 'none';
    cube.style.transform = `rotateX(${cubeRotation.x}deg) rotateY(${cubeRotation.y}deg) rotateZ(${cubeRotation.z}deg)`;
    cube.classList.add('paused');

    if (moveInterval !== null) {
      clearInterval(moveInterval);
      moveInterval = null;
    }
  } else {
    cube.style.animation = `rotate ${rotationAnimationTime()}s infinite linear`;
    cube.style.transform = '';
    cube.classList.remove('paused');

    if (!queryElement('.cube-layer.turn')) {
      nextMove();
    }
  }
}

function handleCubeMoves(e: KeyboardEvent): void {
  if (queryElement('.cube-layer.turn')) return;

  let moveToMake: Turn | '' = '';

  switch (e.key.toLowerCase()) {
    case 'u':
      moveToMake = e.shiftKey ? 'u3' : 'u1';
      break;
    case 'f':
      moveToMake = e.shiftKey ? 'f3' : 'f1';
      break;
    case 'r':
      moveToMake = e.shiftKey ? 'r3' : 'r1';
      break;
    case 'l':
      moveToMake = e.shiftKey ? 'l3' : 'l1';
      break;
    case 'b':
      moveToMake = e.shiftKey ? 'b3' : 'b1';
      break;
    case 'd':
      moveToMake = e.shiftKey ? 'd3' : 'd1';
      break;
    case 'm':
      moveToMake = e.shiftKey ? 'm3' : 'm1';
      break;
    case 'e':
      moveToMake = e.shiftKey ? 'e3' : 'e1';
      break;
    case 's':
      moveToMake = e.shiftKey ? 's3' : 's1';
      break;
    case '2':
      if (lastMoveKey && 'ufrlbdmes'.includes(lastMoveKey.toLowerCase())) {
        moveToMake = `${lastMoveKey.toLowerCase() as Face}2` as Turn;
      }
      break;
  }

  if (moveToMake) {
    if (isRotating) {
      toggleRotation();
    }

    setTurns([...turnQueue.value, moveToMake], { emitUpdate: true });
    move(moveToMake);
    lastMoveKey = e.key;
  }
}

function handleDragStart(e: MouseEvent | TouchEvent): void {
  isDragging = true;

  const isTouchEvent = 'touches' in e;
  const touch = isTouchEvent ? e.touches[0] : null;
  const clientX = isTouchEvent ? touch?.clientX ?? 0 : e.clientX;
  const clientY = isTouchEvent ? touch?.clientY ?? 0 : e.clientY;

  previousMousePosition = { x: clientX, y: clientY };

  if (isRotating || isKeyRotating) {
    if (keyRotationInterval !== null) {
      clearInterval(keyRotationInterval);
      keyRotationInterval = null;
    }

    if (isRotating) {
      toggleRotation();
    }
  }
}

function handleDragMove(e: MouseEvent | TouchEvent): void {
  if (!isDragging) return;

  e.preventDefault();

  const isTouchEvent = 'touches' in e;
  const touch = isTouchEvent ? e.touches[0] : null;
  const clientX = isTouchEvent ? touch?.clientX ?? previousMousePosition.x : e.clientX;
  const clientY = isTouchEvent ? touch?.clientY ?? previousMousePosition.y : e.clientY;

  const deltaX = clientX - previousMousePosition.x;
  const deltaY = clientY - previousMousePosition.y;

  cubeRotation.y += deltaX * 0.5;
  cubeRotation.x += deltaY * 0.5;

  const cube = getCube();
  if (cube) {
    cube.style.transform = `rotateX(${cubeRotation.x}deg) rotateY(${cubeRotation.y}deg) rotateZ(${cubeRotation.z}deg)`;
  }

  previousMousePosition = { x: clientX, y: clientY };
}

function handleDragEnd(): void {
  isDragging = false;
}

function handleKeydown(e: KeyboardEvent): void {
  if ('ufrlbdmes'.includes(e.key.toLowerCase())) {
    handleCubeMoves(e);
    return;
  }

  if (isRotating && !isKeyRotating) {
    toggleRotation();
  }

  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
    e.preventDefault();
  }

  if (!isKeyRotating) {
    isKeyRotating = true;

    keyRotationInterval = window.setInterval(() => {
      const cube = getCube();
      if (!cube) return;

      switch (e.key) {
        case 'ArrowLeft':
          cubeRotation.y -= rotationSpeed;
          break;
        case 'ArrowRight':
          cubeRotation.y += rotationSpeed;
          break;
        case 'ArrowUp':
          cubeRotation.x -= rotationSpeed;
          break;
        case 'ArrowDown':
          cubeRotation.x += rotationSpeed;
          break;
      }

      cube.style.transform = `rotateX(${cubeRotation.x}deg) rotateY(${cubeRotation.y}deg) rotateZ(${cubeRotation.z}deg)`;
    }, 16);
  }
}

function handleKeyup(e: KeyboardEvent): void {
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
    isKeyRotating = false;

    if (keyRotationInterval !== null) {
      clearInterval(keyRotationInterval);
      keyRotationInterval = null;
    }
  }
}

function onSceneMouseDown(e: MouseEvent): void {
  if (e.button === 0) {
    handleDragStart(e);
  }
}

function onSpaceKeydown(event: KeyboardEvent): void {
  if (event.code === 'Space') {
    event.preventDefault();
    toggleRotation();
  }
}

function onAuxClick(): void {
  const scene = getScene();
  if (scene) {
    scene.style.scale = '100%';
  }
}

function risolvi(): void {
  const reversed = [...turnQueue.value].reverse().map((turn) => {
    const reversedStep = (4 - Number(turn[1])) as 1 | 2 | 3;
    return `${turn[0]}${reversedStep}` as Turn;
  });

  setTurns(reversed, { resetIndex: true, emitUpdate: false });
  nextMove()
}

function applyNewScramble(scrambleMoves: string[]): void {
  // Always start from a true solved cube state.
  resetCube({ emitUpdate: false });

  // Apply the new scramble
  const normalized = normalizeTurns(scrambleMoves);
  setTurns(normalized, { resetIndex: true, emitUpdate: false });
  
  // Auto-play the scramble
  nextTick(() => nextMove());
  
  
}
/*
function scombina(): void {
  const scramble = generateScramble(18);
  setTurns(scramble, { resetIndex: true, emitUpdate: true });
  emit('scramble', [...scramble]);
  nextMove();
}
*/
watch(
  () => props.turns,
  (newTurns) => {
    if (newTurns === undefined) return;

    const normalized = normalizeTurns(newTurns);
    if (sameTurns(normalized, turnQueue.value)) return;

    setTurns(normalized, { resetIndex: true, emitUpdate: false });

    if (props.autoPlayOnTurnsChange) {
      nextTick(() => nextMove());
    }
  },
  { deep: true, immediate: true }
);

watch(
  () => props.animationSpeed,
  (newSpeed) => {
    if (newSpeed !== undefined) {
      animationSpeedRef.value = newSpeed;
    }
  }
);

onMounted(() => {
  /*
  if (props.turns === undefined) {
    const scramble = generateScramble(18);
    setTurns(scramble, { resetIndex: true, emitUpdate: true });
    emit('scramble', [...scramble]);
  }*/

  layerElements = queryAllElements<HTMLElement>('.cube-layer');
  for (let i = 0; i < layerElements.length; ++i) {
    layerElements[i].addEventListener('transitionend', updateCubie as EventListener, true);
    layerElements[i].addEventListener('transitionend', nextMove as EventListener, true);
  }

  const cube = getCube();
  if (cube) {
    cube.style.animation = 'none';
    cube.style.transform = `rotateX(${cubeRotation.x}deg) rotateY(${cubeRotation.y}deg) rotateZ(${cubeRotation.z}deg)`;
    cube.classList.add('paused');
  }

  sceneElement = getScene();
  if (sceneElement) {
    sceneElement.addEventListener('mousedown', onSceneMouseDown);
    sceneElement.addEventListener('touchstart', handleDragStart as EventListener, { passive: false });
  }

  rootRef.value?.addEventListener('wheel', zoom as EventListener);
  rootRef.value?.addEventListener('auxclick', onAuxClick);

  document.addEventListener('mousemove', handleDragMove as EventListener);
  document.addEventListener('mouseup', handleDragEnd);
  document.addEventListener('touchmove', handleDragMove as EventListener, { passive: false });
  document.addEventListener('touchend', handleDragEnd);

  if (props.keyboardEnabled) {
    document.addEventListener('keydown', onSpaceKeydown);
    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('keyup', handleKeyup);
  }

  captureSolvedCubeState();
  nextMove();
});

onUnmounted(() => {
  for (let i = 0; i < layerElements.length; ++i) {
    layerElements[i].removeEventListener('transitionend', updateCubie as EventListener, true);
    layerElements[i].removeEventListener('transitionend', nextMove as EventListener, true);
  }

  if (sceneElement) {
    sceneElement.removeEventListener('mousedown', onSceneMouseDown);
    sceneElement.removeEventListener('touchstart', handleDragStart as EventListener);
  }

  rootRef.value?.removeEventListener('wheel', zoom as EventListener);
  rootRef.value?.removeEventListener('auxclick', onAuxClick);

  document.removeEventListener('mousemove', handleDragMove as EventListener);
  document.removeEventListener('mouseup', handleDragEnd);
  document.removeEventListener('touchmove', handleDragMove as EventListener);
  document.removeEventListener('touchend', handleDragEnd);
  document.removeEventListener('keydown', onSpaceKeydown);
  document.removeEventListener('keydown', handleKeydown);
  document.removeEventListener('keyup', handleKeyup);

  if (keyRotationInterval !== null) {
    clearInterval(keyRotationInterval);
    keyRotationInterval = null;
  }

  if (moveInterval !== null) {
    clearInterval(moveInterval);
    moveInterval = null;
  }

  if (nextMoveTimeout !== null) {
    clearTimeout(nextMoveTimeout);
    nextMoveTimeout = null;
  }
});

function setSpeed(speed: number): void {
  if (speed <= 0) {
    console.warn('Animation speed must be greater than 0');
    return;
  }
  animationSpeedRef.value = speed;
}

function changeScramble(scramble: string[]): void {
  console.log(props.turns)
  setSpeed(10000);
  risolvi();
  emit('update:turns', normalizeTurns(scramble));
  console.log(props.turns)
  
  setSpeed(1);;
}

defineExpose({
  move,
  nextMove,
  resetCube,
  risolvi,
  setSpeed,
  changeScramble,
  applyNewScramble
  //scombina
});
</script>

<style scoped>
  .scene {
    margin: 230px auto;
    width: 100px;
    perspective: 1000px;
    perspective-origin: 50% 50%;
    scale: 1;
  }

  @media (max-width: 500px) {
    .scene {
      transform: scale(0.7);
    }
  }

  @media (max-width: 400px) {
    .scene {
      transform: scale(0.6);
    }
  }

  .cube {
    position: relative;
    transform-style: preserve-3d;
    transform-origin: 50px 50px;
    transform: rotateY(-30deg) rotateX(-20deg) rotateZ(9deg);
    background-color: black;
  }

  .cube-layer {
    transform-style: preserve-3d;
    transform-origin: 50px 50px;
  }

  .cube-layer.turn {
    transition: transform var(--move-transition-time) cubic-bezier(0.445, 0.05, 0.55, 0.95);
  }

  .cubie {
    transform-style: preserve-3d;
    transform-origin: 50px 50px;
  }

  .cubie-corner-position-0 {
    transform: translate3d(100px, -100px, 100px);
  }

  .cubie-corner-position-1 {
    transform: translate3d(-100px, -100px, 100px) rotateY(-90deg);
  }

  .cubie-corner-position-2 {
    transform: translate3d(100px, -100px, -100px) rotateY(90deg);
  }

  .cubie-corner-position-3 {
    transform: translate3d(-100px, -100px, -100px) rotateY(180deg);
  }

  .cubie-corner-position-4 {
    transform: translate3d(100px, 100px, 100px) rotateX(180deg) rotateY(90deg);
  }

  .cubie-corner-position-5 {
    transform: translate3d(-100px, 100px, 100px) rotateX(180deg) rotateY(180deg);
  }

  .cubie-corner-position-6 {
    transform: translate3d(100px, 100px, -100px) rotateX(180deg);
  }

  .cubie-corner-position-7 {
    transform: translate3d(-100px, 100px, -100px) rotateX(180deg) rotateY(-90deg);
  }

  .cubie-corner-orientation-0 {}

  .cubie-corner-orientation-1 {
    transform: rotateY(-90deg) rotateX(90deg);
  }

  .cubie-corner-orientation-2 {
    transform: rotateY(90deg) rotateZ(-90deg);
  }

  .cubie-edge-position-0 {
    transform: translate3d(0px, -100px, 100px);
  }

  .cubie-edge-position-1 {
    transform: translate3d(-100px, -100px, 0px) rotateY(-90deg);
  }

  .cubie-edge-position-2 {
    transform: translate3d(100px, -100px, 0px) rotateY(90deg);
  }

  .cubie-edge-position-3 {
    transform: translate3d(0px, -100px, -100px) rotateY(180deg);
  }

  .cubie-edge-position-4 {
    transform: translate3d(0px, 100px, 100px) rotateX(180deg) rotateY(180deg);
  }

  .cubie-edge-position-5 {
    transform: translate3d(-100px, 100px, 0px) rotateX(180deg) rotateY(-90deg);
  }

  .cubie-edge-position-6 {
    transform: translate3d(100px, 100px, 0px) rotateX(180deg) rotateY(90deg);
  }

  .cubie-edge-position-7 {
    transform: translate3d(0px, 100px, -100px) rotateX(180deg);
  }

  .cubie-edge-position-8 {
    transform: translate3d(100px, 0px, 100px) rotateX(-90deg) rotateY(90deg);
  }

  .cubie-edge-position-9 {
    transform: translate3d(-100px, 0px, 100px) rotateX(-90deg) rotateY(-90deg);
  }

  .cubie-edge-position-10 {
    transform: translate3d(100px, 0px, -100px) rotateX(90deg) rotateY(90deg);
  }

  .cubie-edge-position-11 {
    transform: translate3d(-100px, 0px, -100px) rotateX(90deg) rotateY(-90deg);
  }

  .cubie-edge-orientation-0 {}

  .cubie-edge-orientation-1 {
    transform: rotateX(-90deg) rotateY(180deg);
  }

  .cubie-middle-r {
    transform: translate3d(100px, 0px, 0px);
  }

  .cubie-middle-l {
    transform: translate3d(-100px, 0px, 0px);
  }

  .cubie-middle-f {
    transform: translate3d(0px, 0px, 100px);
  }

  .cubie-middle-b {
    transform: translate3d(0px, 0px, -100px);
  }

  .cubie-middle-u {
    transform: translate3d(0px, -100px, 0px);
  }

  .cubie-middle-d {
    transform: translate3d(0px, 100px, 0px);
  }

  .cubie-face {
    position: absolute;
    width: 100px;
    height: 100px;
    background-color: rgb(0, 30, 60);
    transform-style: preserve-3d;
  }

  .face-u {
    transform: rotateX(90deg) translateZ(50px);
  }

  .face-f {
    transform: translateZ(50px);
  }

  .face-r {
    transform: rotateY(90deg) translateZ(50px);
  }

  .face-l {
    transform: rotateY(-90deg) translateZ(50px);
  }

  .face-b {
    transform: rotateY(180deg) translateZ(50px);
  }

  .face-d {
    transform: rotateX(-90deg) translateZ(50px);
  }

  .cubie-sticker {
    background-image: url('./../assets/stickers.svg');
    background-size: 600px 100px;
  }

  .sticker-f {
    background-position-x: -100px;
  }

  .sticker-u {
    background-position-x: 0;
  }

  .sticker-r {
    background-position-x: -200px;
  }

  .sticker-l {
    background-position-x: -300px;
  }

  .sticker-b {
    background-position-x: -400px;
  }

  .sticker-d {
    background-position-x: -500px;
  }

  .turn-u1,
  .turn-d3 {
    transform: rotateY(-90deg);
  }

  .turn-f1,
  .turn-b3 {
    transform: rotateZ(90deg);
  }

  .turn-r1,
  .turn-l3 {
    transform: rotateX(90deg);
  }

  .turn-l1,
  .turn-r3 {
    transform: rotateX(-90deg);
  }

  .turn-b1,
  .turn-f3 {
    transform: rotateZ(-90deg);
  }

  .turn-d1,
  .turn-u3 {
    transform: rotateY(90deg);
  }

  .turn-u2 {
    transform: rotateY(-180deg);
  }

  .turn-f2 {
    transform: rotateZ(180deg);
  }

  .turn-r2 {
    transform: rotateX(180deg);
  }

  .turn-l2 {
    transform: rotateX(-180deg);
  }

  .turn-b2 {
    transform: rotateZ(-180deg);
  }

  .turn-d2 {
    transform: rotateY(180deg);
  }

  .turn-m1 {
    transform: rotateX(-90deg);
  }

  .turn-m3 {
    transform: rotateX(90deg);
  }

  .turn-e1 {
    transform: rotateY(90deg);
  }

  .turn-e3 {
    transform: rotateY(-90deg);
  }

  .turn-s1 {
    transform: rotateZ(90deg);
  }

  .turn-s3 {
    transform: rotateZ(-90deg);
  }

  @keyframes rotate {
    from {
      transform: rotateX(-30deg) rotateY(0deg);
    }

    to {
      transform: rotateX(330deg) rotateY(1800deg);
    }
  }
</style>
