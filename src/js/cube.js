export function generateScramble(length){
  let turnPull = [['u1', 'u2', 'u3'], ['f1', 'f2', 'f3'], ['r1', 'r2', 'r3'], ['l1', 'l2', 'l3'], ['b1', 'b2', 'b3'], ['d1', 'd2', 'd3']]

  let scramble = []
  let prevFace = Math.random()*6 | 0
  let t2 = prevFace +1
  scramble.push(turnPull[prevFace][Math.random()*3 | 0])

  while (scramble.length < length)
  {

    let nextFace = Math.random()*6 | 0

    while(nextFace == prevFace)
      nextFace = Math.random()*6 | 0


    if(t2 == 0)
    {
      if(nextFace == 5 - prevFace)
      {
        while(nextFace == prevFace || nextFace == 5 - prevFace)
          nextFace = Math.random()*6 | 0
      }
      t2 = nextFace + 1
    }
    else
    {
      if(t2 + nextFace == 6)
        t2 = 0
      else
        t2 = nextFace + 1
    }


    scramble.push(turnPull[nextFace][Math.random()*3 | 0])
    prevFace = nextFace
  }

  return scramble;
}

export function displayScramble(scramble)
{
    let visScramble = scramble
    for(let i = 0; i < scramble.length; i++)
    {
        visScramble[i] = scramble[i].toUpperCase()
        if(scramble[i][1] == '3')
            visScramble[i] = scramble[i][0] + '\''
        else if(scramble[i][1] == '1')
            visScramble[i] = scramble[i][0]
    }

    return visScramble
}