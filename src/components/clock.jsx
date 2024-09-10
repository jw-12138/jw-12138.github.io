import {createSignal, onMount} from 'solid-js'
import {isInViewport} from './wakatime.jsx'

function easeOutElastic(x) {
  const c4 = (2 * Math.PI) / 3

  return x === 0 ? 0 : x === 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1
}

function easeOutCubic(x) {
  return 1 - Math.pow(1 - x, 3)
}

export default function Clock(props) {
  let now = Date.now()
  let ticks = Array.from({length: 60}, (_, i) => i)

  const hourTickLength = 30
  const minuteTickLength = 43
  const secondTickLength = 65
  const center = [100, 100]

  let [hourPosition, setHourPosition] = createSignal([100, 100 - hourTickLength])
  let [minutePosition, setMinutePosition] = createSignal([100, 100 - minuteTickLength])
  let [secondPosition, setSecondPosition] = createSignal([100, 100 - secondTickLength])

  let [hourTailPosition, setHourTailPosition] = createSignal([100, 104])
  let [minuteTailPosition, setMinuteTailPosition] = createSignal([100, 104])
  let [secondTailPosition, setSecondTailPosition] = createSignal([100, 110])

  const [handsOpacity, setHandsOpacity] = createSignal(0)
  const [ticksOpacity, setTicksOpacity] = createSignal(Array.from({length: 60}, (_, i) => 0))

  function getHandAngle() {
    let seconds = new Date(now).getSeconds()
    let minutes = new Date(now).getMinutes()
    let hours = new Date(now).getHours()
    let hourAngle = (hours % 12 + minutes / 60) * 30
    let minuteAngle = minutes * 6
    let secondAngle = seconds * 6

    return {hourAngle, minuteAngle, secondAngle}
  }

  function setAngle() {
    now = Date.now()

    let {hourAngle, minuteAngle, secondAngle} = getHandAngle()

    setHourPosition([center[0] + hourTickLength * Math.cos((hourAngle - 90) * Math.PI / 180), center[1] + hourTickLength * Math.sin((hourAngle - 90) * Math.PI / 180)])

    setHourTailPosition([center[0] - 4 * Math.cos((hourAngle - 90) * Math.PI / 180), center[1] - 4 * Math.sin((hourAngle - 90) * Math.PI / 180)])

    setMinutePosition([center[0] + minuteTickLength * Math.cos((minuteAngle - 90) * Math.PI / 180), center[1] + minuteTickLength * Math.sin((minuteAngle - 90) * Math.PI / 180)])

    setMinuteTailPosition([center[0] - 4 * Math.cos((minuteAngle - 90) * Math.PI / 180), center[1] - 4 * Math.sin((minuteAngle - 90) * Math.PI / 180)])


    let frames = 0
    let totalFrames = 20
    let animationId = null

    function animateSecondHand(e) {
      if (frames === totalFrames) {
        cancelAnimationFrame(animationId)
      }

      let percent = easeOutElastic(frames / totalFrames)
      let additionalAngle = percent * 6

      setSecondPosition([center[0] + secondTickLength * Math.cos((secondAngle + additionalAngle - 90) * Math.PI / 180), center[1] + secondTickLength * Math.sin((secondAngle + additionalAngle - 90) * Math.PI / 180)])

      setSecondTailPosition([center[0] - 10 * Math.cos((secondAngle + additionalAngle - 90) * Math.PI / 180), center[1] - 10 * Math.sin((secondAngle + additionalAngle - 90) * Math.PI / 180)])

      frames++
      animationId = requestAnimationFrame(animateSecondHand)
    }

    animationId = requestAnimationFrame(animateSecondHand)
  }

  function initHands() {
    now = Date.now()
    let {hourAngle, minuteAngle, secondAngle} = getHandAngle()

    let totalFrames = 60
    let frames = 0
    let animationId = null

    function animate() {
      if (frames === totalFrames) {
        cancelAnimationFrame(animationId)
        return false
      }
      let percent = easeOutCubic(frames / totalFrames)

      setHourPosition([
        center[0] + hourTickLength * Math.cos((hourAngle - 90) * Math.PI / 180) * percent,
        center[1] + hourTickLength * Math.sin((hourAngle - 90) * Math.PI / 180) * percent
      ])

      setHourTailPosition([
        center[0] - 4 * Math.cos((hourAngle - 90) * Math.PI / 180) * percent,
        center[1] - 4 * Math.sin((hourAngle - 90) * Math.PI / 180) * percent
      ])

      setMinutePosition([
        center[0] + minuteTickLength * Math.cos((minuteAngle - 90) * Math.PI / 180) * percent,
        center[1] + minuteTickLength * Math.sin((minuteAngle - 90) * Math.PI / 180) * percent]
      )

      setMinuteTailPosition([
        center[0] - 4 * Math.cos((minuteAngle - 90) * Math.PI / 180) * percent,
        center[1] - 4 * Math.sin((minuteAngle - 90) * Math.PI / 180) * percent
      ])

      setSecondPosition([
        center[0] + secondTickLength * Math.cos((secondAngle - 90) * Math.PI / 180) * percent,
        center[1] + secondTickLength * Math.sin((secondAngle - 90) * Math.PI / 180) * percent
      ])

      setSecondTailPosition([
        center[0] - 10 * Math.cos((secondAngle - 90) * Math.PI / 180) * percent,
        center[1] - 10 * Math.sin((secondAngle - 90) * Math.PI / 180) * percent
      ])

      frames++
      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)
  }

  function showTicks() {
    let totalFrames = 90
    let frames = 0

    let animation = setInterval(() => {
      if (frames === totalFrames) {
        setTicksOpacity(ticksOpacity().map(() => 1))
        clearInterval(animation)
      }

      setTicksOpacity(ticksOpacity().map((opacity, i) => {
        let percent = easeOutCubic(frames / totalFrames)
        if (i / 60 > percent) {
          return 0
        }
        return 1
      }))

      frames++
    }, 1000 / 60)
  }

  function showHands() {
    let frames = 0
    let totalFrames = 60
    let animationId = null

    function animate() {
      if (frames === totalFrames) {
        cancelAnimationFrame(animationId)
        return false
      }

      setHandsOpacity(easeOutCubic(frames / totalFrames))

      frames++
      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)
  }

  onMount(async () => {
    document.getElementById('fake_clock').remove()

    while(!isInViewport(document.getElementById('clock_scroll'))) {
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    setTimeout(() => {
      showTicks()
      initHands()
      setInterval(setAngle, 1000)
      setTimeout(() => {
        showHands()
      }, 100)
    }, 100)
  })

  return <div class="shadow rounded-[36px] w-[200px] aspect-square h-[200px] bg-white dark:bg-gradient-to-b from-neutral-900 to-neutral-800 mx-auto overflow-hidden relative box-border border border-white dark:border-neutral-700" id="clock_scroll">
    <svg viewBox="0 0 200 200" class="w-full aspect-square dark:text-white text-neutral-700">
      {ticks.map((tick) => {
        let isMajor = tick % 5 === 0
        let angle = (tick / 60) * 2 * Math.PI
        let x1 = center[0] + (isMajor ? 80 : 82) * Math.cos(angle)
        let y1 = center[1] + (isMajor ? 80 : 82) * Math.sin(angle)
        let x2 = center[0] + 85 * Math.cos(angle)
        let y2 = center[1] + 85 * Math.sin(angle)
        return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={'currentColor'} stroke-width={isMajor ? 2 : 1} stroke-opacity={.8} stroke-linecap={'round'} style={{
          opacity: ticksOpacity()[tick]
        }}></line>
      })}

      <line x1={hourTailPosition()[0]} y1={hourTailPosition()[1]} x2={hourPosition()[0]} y2={hourPosition()[1]} stroke={'currentColor'} stroke-width={4} stroke-linecap={'round'} class="z-10 drop-shadow" style={{
        opacity: handsOpacity()
      }}></line>
      <line x1={minuteTailPosition()[0]} y1={minuteTailPosition()[1]} x2={minutePosition()[0]} y2={minutePosition()[1]} stroke={'currentColor'} stroke-width={4} stroke-linecap={'round'} class="z-20 drop-shadow" style={{
        opacity: handsOpacity()
      }}></line>
      <line x1={secondTailPosition()[0]} y1={secondTailPosition()[1]} x2={secondPosition()[0]} y2={secondPosition()[1]} stroke={'currentColor'} stroke-width={2} stroke-linecap={'round'} class="z-30 text-red-500" style={{
        opacity: handsOpacity()
      }}></line>
      <circle r={4} cx={100} cy={100} stroke={'white'} fill={'currentColor'} class="z-50 text-red-500 drop-shadow"></circle>
    </svg>
  </div>
}
