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

function parseDate(dateText) {
  let _t = dateText.split('-')
  return _t[1] + '-' + _t[2]
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

  return `${hours}hr ${remainingMinutes}min`
}

export default function Wakatime() {
  let padding = 30
  let segmentWidth = (670 - (padding * 2)) / 7
  let bottom = 670 / 2 - 40

  let [data, setData] = createSignal([])
  let [totalSeconds, setTotalSeconds] = createSignal(0)
  let [maxSeconds, setMaxSeconds] = createSignal(0)
  let [dotsBottom, setDotsBottom] = createSignal([
    bottom,
    bottom,
    bottom,
    bottom,
    bottom,
    bottom,
    bottom
  ])

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

    data().map(el => {
      setTotalSeconds(totalSeconds() + el.grand_total.total_seconds)
      if (el.grand_total.total_seconds > maxSeconds()) {
        setMaxSeconds(el.grand_total.total_seconds)
      }
    })

    let _bs = []
    data().forEach((el, index) => {
      // update dots position
      let _b = (1 - el.grand_total.total_seconds / (maxSeconds() * 1.2)) * bottom
      _bs.push(_b)
    })

    setDotsBottom(_bs)
  })

  return <>
    <Show when={!loading()}>
      <h2>
        Coding activities
      </h2>

      <svg class="aspect-[2/1] w-full" viewBox="0 0 670 335">
        {
          // tick line
          Array.from({length: 7}).map((_, index) => <line stroke-width={1} x1={index * segmentWidth + segmentWidth / 2 + padding} x2={index * segmentWidth + segmentWidth / 2 + padding} y1={0} y2={bottom} stroke="currentColor" stroke-opacity="0.1"></line>)
        }


        {
          // connection line
          Array.from({length: 6}).map((_, index) => <line stroke-width={1.5} x1={index * segmentWidth + segmentWidth / 2 + padding} x2={(index + 1) * segmentWidth + segmentWidth / 2 + padding} y1={dotsBottom()[index]} y2={dotsBottom()[index + 1]} stroke="currentColor" stroke-opacity="0.3" class="z-10 relative"></line>)
        }

        {
          // dots
          Array.from({length: 7}).map((_, index) => <circle cx={index * segmentWidth + segmentWidth / 2 + padding} r={3} cy={dotsBottom()[index]} class="z-20 relative" fill={'currentColor'}></circle>)
        }

        {
          // dots label
          data().length && data().map((el, index) => {
            return <text fill="currentColor" font-size="12" font-family="monospace" x={index * segmentWidth + segmentWidth / 2 + padding - 4} y={dotsBottom()[index] - 10}>
              {parseTime(el.grand_total.total_seconds)}
            </text>
          })
        }

        {
          // label
          data().length && data().map((el, index) => {
            return <text fill="currentColor" font-size="12" font-family="monospace" x={index * segmentWidth + segmentWidth / 2 + padding - 18} y={bottom + 35}>
              {parseDate(el.range.date)}
            </text>
          })
        }
      </svg>
    </Show>
  </>
}
