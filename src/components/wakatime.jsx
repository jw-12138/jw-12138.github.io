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

export function isInViewport(element) {
  if (!element) {
    return false
  }
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

    while (!isInViewport(document.getElementById('waka_scroll_content'))) {
      await new Promise(r => setTimeout(r, 100))
    }

    await new Promise(r => setTimeout(r, 300))

    let _s = setInterval(async function () {
      if (frames > totalFrames) {
        clearInterval(_s)
        return false
      }

      updateBottoms(frames / totalFrames)

      frames++
    }, 1000 / 55)
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
      <div class="w-[200px] shadow aspect-square h-[200px] rounded-[36px] bg-white dark:bg-gradient-to-b from-neutral-900 to-neutral-800 border border-white dark:border-neutral-700 relative overflow-hidden">
        <div class="w-full overflow-x-auto" id="waka_scroll_content">
          <div class="h-[68px] px-6 pt-4">
            <div class="opacity-50 text-[10px] mb-1 flex justify-between">
              <span>Weekly Coding Time:</span>
              <div class="w-[78px] aspect-square opacity-15 absolute top-[-10px] right-[-20px] pointer-events-none">
                <svg viewBox="0 0 340 340" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M170 20C87.156 20 20 87.156 20 170C20 252.844 87.156 320 170 320C252.844 320 320 252.844 320 170C320 87.156 252.844 20 170 20V20V20Z" stroke="currentColor" stroke-width="40"/>
                  <path
                    d="M190.183 213.541C188.74 215.443 186.576 216.667 184.151 216.667C183.913 216.667 183.677 216.651 183.443 216.627C183.042 216.579 182.823 216.545 182.606 216.497C182.337 216.434 182.137 216.375 181.94 216.308C181.561 216.176 181.392 216.109 181.228 216.035C180.843 215.849 180.707 215.778 180.572 215.701C180.205 215.478 180.109 215.412 180.014 215.345C179.856 215.233 179.698 215.117 179.547 214.992C179.251 214.746 179.147 214.65 179.044 214.552C178.731 214.241 178.531 214.018 178.341 213.785C177.982 213.331 177.69 212.888 177.438 212.415L168.6 198.214L159.766 212.415C158.38 214.939 155.874 216.667 152.995 216.667C150.106 216.667 147.588 214.926 146.243 212.346L107.607 156.061C106.337 154.529 105.556 152.499 105.556 150.258C105.556 145.514 109.043 141.665 113.344 141.665C116.127 141.665 118.564 143.282 119.942 145.708L152.555 193.9L161.735 178.952C163.058 176.288 165.626 174.478 168.575 174.478C171.273 174.478 173.652 175.996 175.049 178.298L184.517 193.839L235.684 120.583C237.075 118.226 239.475 116.667 242.213 116.667C246.514 116.667 250 120.514 250 125.258C250 127.332 249.337 129.232 248.23 130.715L190.183 213.541Z"
                    fill="currentColor" stroke="currentColor" stroke-width="10"/>
                </svg>

              </div>
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
