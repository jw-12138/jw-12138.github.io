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
  0: 'Sun',
  1: 'Mon',
  2: 'Tue',
  3: 'Wed',
  4: 'Thu',
  5: 'Fri',
  6: 'Sat'
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
  let padding = 30
  let segmentWidth = (670 - (padding * 2)) / 7
  let bottom = 670 / 2 - 40

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

        _bs.push(_b)
      })

      setDotsBottom(_bs)
    }

    let frames = 0
    let totalFrames = 60 // one second

    while(!animationExecuted() && !isInViewport(document.getElementById('waka_scroll_content'))) {
      await new Promise(r => setTimeout(r, 100))
      if(isInViewport(document.getElementById('waka_scroll_content'))){
        setAnimationExecuted(true)
      }
    }

    try {
      let scroll_content = document.getElementById('waka_scroll_content')
      if (scroll_content.scrollWidth > scroll_content.clientWidth) {
        await new Promise(r => setTimeout(r, 300))
        scroll_content.scroll({
          left: scroll_content.scrollWidth - scroll_content.clientWidth,
          behavior: 'smooth'
        })
      }
    } catch (e) {

    }

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
        let roundX = 0.35 * segmentWidth + ((.26 * segmentWidth) * (offsetY / bottom))
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
      <h2>
        Coding activity
      </h2>

      <div class="w-full overflow-x-auto" id="waka_scroll_content">
        <svg class="aspect-[2/1] w-full min-w-[650px]" viewBox="0 0 670 335">
          {
            // tick line
            Array.from({length: 7}).map((_, index) => <line stroke-width={1} x1={index * segmentWidth + segmentWidth / 2 + padding} x2={index * segmentWidth + segmentWidth / 2 + padding} y1={0} y2={bottom} stroke="currentColor" stroke-opacity="0.1"></line>)
          }

          {
            // dots
            Array.from({length: 7}).map((_, index) => <circle cx={index * segmentWidth + segmentWidth / 2 + padding} r={3} cy={dotsBottom()[index]} class="" fill={'currentColor'}></circle>)
          }

          {
            data().length &&
            <path d={pathGen(data())} stroke="currentColor" stroke-opacity="0.3" stroke-width={2} fill="transparent"/>
          }


          {
            // dots label
            data().length && data().map((el, index) => {
              return <text aria-label={parseTime(el.grand_total.total_seconds)} dominant-baseline="middle" text-anchor="middle" fill="currentColor" font-size="12" font-family="monospace" x={index * segmentWidth + segmentWidth / 2 + padding} y={dotsBottom()[index] - 15}>
                {parseTime(el.grand_total.total_seconds)}
              </text>
            })
          }

          {
            // label
            data().length && data().map((el, index) => {
              return <text aria-label={parseDate(el.range.date)} dominant-baseline="middle" text-anchor="middle" fill="currentColor" font-size="12" font-family="monospace" x={index * segmentWidth + segmentWidth / 2 + padding} y={bottom + 35}>
                {parseDate(el.range.date)}
              </text>
            })
          }
        </svg>
      </div>
    </Show>
  </>
}
