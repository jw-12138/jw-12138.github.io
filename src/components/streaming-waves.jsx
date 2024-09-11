import { createSignal, onMount } from 'solid-js'

export default function StreamingWaves(props) {
  const { url } = props
  const svgWidth = 24
  const svgHeight = 12

  if (!url) {
    return <></>
  }

  const [d, setD] = createSignal('')
  const [rd, setRD] = createSignal('')
  const [allTimeData, setAllTimeData] = createSignal([])

  function makePath(data) {
    let path = 'M0 ' + (svgHeight / 2)
    const step = Math.ceil(data.length / svgWidth)
    for (let i = 0; i < svgWidth; i++) {
      let x = i
      let y = (svgHeight / 2) + data[i * step] * (svgHeight / 2) // Scale the data to fit in our SVG
      path += ` L${x} ${y}`
    }
    path += ` L${svgWidth} ${svgHeight / 2}`
    return path
  }

  onMount(async () => {
    try {
      const response = await fetch(url)
      const arrayBuffer = await response.arrayBuffer()

      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)

      const leftChannelData = audioBuffer.getChannelData(0)
      const rightChannelData = audioBuffer.getChannelData(1)
      const sampleRate = audioBuffer.sampleRate

      setAllTimeData(Array.from(leftChannelData))

      // Initial render
      setD(makePath(leftChannelData))
      setRD(makePath(rightChannelData))

      // Animate the waveform
      let currentIndex = 0
      const samplesPerFrame = sampleRate / 60
      setInterval(() => {
        const start = currentIndex
        const end = start + samplesPerFrame
        setD(makePath(leftChannelData.subarray(start, end)))
        setRD(makePath(rightChannelData.subarray(start, end)))
        currentIndex = (currentIndex + samplesPerFrame) % leftChannelData.length
      }, 1000 / 60) // 60 fps
    } catch (error) {
      console.error('Error processing audio:', error)
    }
  })

  return (
    <div class="overflow-hidden transition-[width,margin] duration-[1200ms]" style={{
      height: `${svgHeight}px`,
      width: allTimeData().length ? `${svgWidth}px`: 0,
      'margin-left': allTimeData().length ? '.25rem' : 0,
    }}>
      <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{
        width: svgWidth + 'px'
      }}>
        <path d={d()} stroke-width={.8} stroke={'currentColor'} stroke-opacity={.8} fill="none" stroke-linejoin="round" stroke-linecap={'round'}></path>
        <path d={rd()} stroke-width={.8} stroke={'currentColor'} stroke-opacity={.5} fill="none" stroke-linejoin="round" stroke-linecap={'round'}></path>
      </svg>
    </div>
  )
}
