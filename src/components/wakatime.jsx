import {createSignal, onMount, Show} from 'solid-js'

async function getData() {
  let data

  try {
    data = await fetch('https://wakatime-api.jw1.dev')
    data = await data.json()
    return data.data
  } catch (e) {
    return []
  }
}

let dayMap = {
  0: 'S',
  1: 'M',
  2: 'T',
  3: 'W',
  4: 'T',
  5: 'F',
  6: 'S'
}

function parseDate(dateText) {
  let _date = new Date(dateText)
  return dayMap[_date.getDay()]
}

function parseTime(seconds) {
  if (seconds === 0) {
    return '0hr'
  }
  let hours = Math.floor(seconds / 3600)
  let remainingMinutes = Math.floor((seconds - hours * 3600) / 60)

  if (remainingMinutes === 0) {
    return `${hours}hr`
  }

  if (hours === 0 && remainingMinutes !== 0) {
    return `${remainingMinutes}min`
  }

  return `${hours}hr ${remainingMinutes}min`
}

function easeInOutQuint(x) {
  return x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2
}

function isInViewport(element) {
  const rect = element.getBoundingClientRect()
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}

export default function Wakatime() {
  let padding = 20
  let segmentWidth = (200 - (padding * 2)) / 7
  let bottom = 90

  let [data, setData] = createSignal([])
  let [totalSeconds, setTotalSeconds] = createSignal(0)
  let [maxSeconds, setMaxSeconds] = createSignal(0)
  let [dotsBottom, setDotsBottom] = createSignal(new Array(7).fill(bottom))
  let [animationExecuted, setAnimationExecuted] = createSignal(false)

  let [loading, setLoading] = createSignal(false)

  onMount(async () => {
    setLoading(true)
    let _data = await getData()
    setLoading(false)

    try {
      document.getElementById('fake_wakatime').remove()
    } catch (e) {
    }

    if (_data.length) {
      setData(_data)
    }

    // get max seconds and total seconds
    data().map(el => {
      setTotalSeconds(totalSeconds() + el.grand_total.total_seconds)

      if (el.grand_total.total_seconds > maxSeconds()) {
        setMaxSeconds(el.grand_total.total_seconds)
      }
    })

    function updateBottoms(_p) {
      let _bs = []
      data().forEach((el, index) => {
        // update dots position
        let max = maxSeconds() * 1.2
        let seconds = el.grand_total.total_seconds
        let percent = easeInOutQuint(_p)
        let _b = (seconds / max) * bottom
        _b = _b * percent
        _b = bottom - _b

        if (isNaN(_b)) {
          _bs.push(bottom)
        } else {
          _bs.push(_b)
        }
      })

      setDotsBottom(_bs)
    }

    let frames = 0
    let totalFrames = 60 // one second

    await new Promise(r => setTimeout(r, 300))

    let _s = setInterval(function () {
      if (frames > totalFrames) {
        clearInterval(_s)
        return false
      }

      updateBottoms(frames / totalFrames)

      frames++
    }, 1000 / 60)
  })

  function pathGen(data) {
    let path = 'M'

    data.forEach((el, index) => {
      let x = index * segmentWidth + segmentWidth / 2 + padding
      let y = dotsBottom()[index]

      let bez = ''

      try {
        let nextX = (index + 1) * segmentWidth + segmentWidth / 2 + padding
        let nextY = dotsBottom()[index + 1]
        let offsetY = Math.abs(y - nextY)
        let roundX = 0.5 * segmentWidth + ((.5 * segmentWidth) * (offsetY / bottom))
        if (nextX && nextY) {
          bez = `C ${x + roundX} ${y}, ${nextX - roundX} ${nextY},`
        }
      } catch (e) {
        bez = ''
      }

      if (index === data.length - 1) {
        bez = ''
      }

      let dot = `\n${x} ${y} ${bez}`

      path += dot
    })

    return path
  }

  return <>
    <Show when={!loading()}>
      <div class="w-[200px] shadow aspect-square h-[200px] rounded-[36px] bg-white dark:bg-gradient-to-b from-neutral-900 to-neutral-800 border border-white dark:border-neutral-700 hover:shadow-xl">
        <div class="w-full overflow-x-auto" id="waka_scroll_content">
          <div class="h-[60px] p-4">
            <div class="opacity-50 text-[10px] mb-1">
              Weekly Coding Time:
            </div>
            <div class="text-xs font-black italic">
              {parseTime(totalSeconds())}
            </div>
          </div>
          <svg class="w-full" viewBox="0 0 200 140">
            {
              data().length &&
              <path d={pathGen(data())} stroke="currentColor" stroke-opacity="1" stroke-width={2} fill="transparent" stroke-linecap="round"/>
            }

            {
              // label
              data().length && data().map((el, index) => {
                const isSunday = new Date(el.range.date).getDay() === 0
                return <text aria-label={parseDate(el.range.date)} dominant-baseline="middle" text-anchor="middle" font-size="12" font-family="monospace" x={index * segmentWidth + segmentWidth / 2 + padding} y={bottom + 20} fill={
                  isSunday ? '#ef4444' : 'currentColor'
                } text-decoration={
                  isSunday ? 'underline' : 'none'
                }>
                  {parseDate(el.range.date)}
                </text>
              })
            }
          </svg>
        </div>
      </div>
    </Show>
  </>
}
