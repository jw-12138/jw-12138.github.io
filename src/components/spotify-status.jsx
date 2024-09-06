import {createSignal, Show, onMount} from 'solid-js'
import StreamingIcon from './streaming-icon.jsx'
import SpotifyIcon from './spotify-icon.jsx'
import {nanoid} from 'nanoid'

function TextSlide(props) {
  if (!props.speed) {
    props.speed = 0.2
  }

  if (!props.classList) {
    props.classList = ''
  }

  let id = nanoid()

  onMount(() => {
    const element = document.getElementById(id)
    if (!element) return

    const [scrollWidth] = createSignal(element.scrollWidth)
    const spanElement = element.querySelector('span')
    const boxWidth = element.clientWidth

    if (scrollWidth() > boxWidth) {
      let [maxLeft] = createSignal(-(scrollWidth() - boxWidth))
      let direction = 'left'
      let freeze = true
      let [left, setLeft] = createSignal(0)

      setTimeout(() => {
        freeze = false
      }, 2000)

      setInterval(() => {
        if (!freeze) {
          if (direction === 'left') {
            setLeft(left() - props.speed)
          } else {
            setLeft(left() + props.speed)
          }

          if (left() <= maxLeft()) {
            freeze = true
            setTimeout(() => {
              freeze = false
            }, 3000)
            direction = 'right'
          } else if (left() >= 0) {
            freeze = true
            setTimeout(() => {
              freeze = false
            }, 3000)
            direction = 'left'
          }

          spanElement.style.transform = `translateX(${left()}px)`
        }
      }, 1000 / 60)
    }
  })

  return (
    <div id={id} class={'text-center whitespace-nowrap overflow-hidden ' + props.classList}>
      <span class="block">{props.text}</span>
    </div>
  )
}

export default function SpotifyStatus() {
  let [isPlaying, setIsPlaying] = createSignal(false)
  let [isLoading, setIsLoading] = createSignal(true)
  let [songData, setSongData] = createSignal({})

  async function loadData() {
    let endpoint = 'https://spotify-status.jw1.dev/status?t=' + Date.now()

    let resp
    let json
    let start = Date.now()
    let end

    try {
      resp = await fetch(endpoint)
    } catch (e) {
      console.log(e)
    } finally {
      // prevent flickering
      end = Date.now()
      let offset = end - start

      if (offset < 500) {
        setTimeout(function () {
          setIsLoading(false)
          document.getElementById('fake_spotify_status').style.display = 'none'
        }, 500 - offset)
      } else {
        setIsLoading(false)
        document.getElementById('fake_spotify_status').style.display = 'none'
      }
    }

    if (!resp.ok) {
      console.log(resp.status, resp.statusText)
      json = {}
    } else {
      try {
        json = await resp.json()
      } catch (e) {
        json = {}
      }
    }

    if (json.songName) {
      setIsPlaying(true)
    }

    setSongData(json)
  }

  onMount(async () => {
    await loadData()
  })

  const [showDisc, setShowDisc] = createSignal(true)
  const [albumGoDown, setAlbumGoDown] = createSignal(false)

  const [switching, setSwitching] = createSignal(false)
  const [smallDisc, setSmallDisc] = createSignal(false)
  const [displaySequence, setDisplaySequence] = createSignal(0)

  function switchDisplay() {
    if (switching()) {
      return false
    }

    if (displaySequence() === 2) {
      setDisplaySequence(0)
    }

    setSwitching(true)

    // show album
    if (displaySequence() === 0) {
      setSmallDisc(true)

      setTimeout(() => {
        setShowDisc(false)
      }, 50)

      setTimeout(() => {
        setAlbumGoDown(true)
      }, 300)
    }

    // reset
    if (displaySequence() === 1) {
      setAlbumGoDown(false)

      setTimeout(() => {
        setShowDisc(true)
      }, 200)

      setTimeout(() => {
        setSmallDisc(false)
      }, 250)
    }

    setTimeout(() => {
      setSwitching(false)
    }, 650)

    setDisplaySequence(displaySequence() + 1)
  }

  return <>
    <Show when={!isLoading() && isPlaying()}>
      <div class="shadow rounded-[36px] w-[200px] aspect-square h-[200px] bg-white dark:bg-gradient-to-b from-neutral-900 to-neutral-800 mx-auto overflow-hidden relative box-border border border-white dark:border-neutral-700 hover:shadow-xl transition-all duration-300">

        {/*album*/}
        <div class="z-[50] flex w-[150px] h-[145px] left-[25px] transition-all duration-[600ms] absolute cursor-pointer shadow-2xl overflow-hidden"
             style={{
               bottom: albumGoDown() ? '23px' : '-255px',
               transform: `rotate(${albumGoDown() ? '5deg' : '-17deg'})`
             }}
             onclick={switchDisplay}
        >
          {/*border*/}
          <div class="w-[5px] border dark:border-neutral-600 border-neutral-200">

          </div>
          <div class="w-[145px] h-[145px] shrink-0" style={{
            'background-image': `url(${songData().albumArt ? songData().albumArt[0].url : ''})`,
            'background-size': 'cover',
            'background-repeat': 'no-repeat'
          }}>

          </div>
        </div>

        <div class="aspect-square w-[200px] h-[200px] absolute transition-all duration-[600ms] group" style={{
          transform: smallDisc() ? 'scale(.3)' : 'scale(1)',
          bottom: showDisc() ? '-95px' : '-255px'
        }} onclick={switchDisplay}>
          {/* disc shadow */}
          <div class="z-[51] rounded-full aspect-square w-[200px] cursor-pointer h-[200px] absolute left-[-1px] rotate-180 shadow-xl group-hover:shadow-lg transition-all duration-500 opacity-60">
          </div>

          {/*disc*/}
          <div class="rounded-full aspect-square w-[200px] h-[200px] absolute z-[50] left-[-1px] animate-spin overflow-hidden border border-neutral-300 dark:border-neutral-700 flex items-center justify-center" style={{
            'animation-duration': '20s',
            transition: 'top 0.5s ease'
          }}>
            <div class="z-[1] w-full h-full absolute left-0 top-0" style={{
              'background-image': `url(${songData().albumArt ? songData().albumArt[0].url : ''})`,
              'background-size': 'cover',
              'background-repeat': 'no-repeat'
            }}>

            </div>
            {/* glow */}
            <div class="absolute w-full h-full left-0 top-0 z-[2] rounded-full overflow-hidden blur-[36px] rotate-90">
              <div class="w-full h-full absolute left-0 top-0 z-[1]">
                <div class="h-[100px] flex justify-center">
                  <div class="w-[3px] bg-red-400 h-[100px]">
                  </div>
                  <div class="w-[2px] bg-orange-400 h-[100px]">
                  </div>
                </div>
                <div class="h-[100px] flex justify-center">
                  <div class="w-[2px] bg-blue-400 h-[100px]">
                  </div>
                  <div class="w-[3px] bg-purple-400 h-[100px]">
                  </div>
                </div>
              </div>
              <div class="opacity-25 w-full h-full scale-125" style={{
                border: '100px solid transparent',
                'border-left': '100px solid #A2A2A2',
                'border-right': '100px solid #A2A2A2'
              }}>
              </div>
            </div>
            <div class="w-[48px] h-[48px] aspect-square border border-neutral-300 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-700 z-10 flex justify-center items-center rounded-full transition-all">
              <div class="w-[26px] h-[26px] aspect-square bg-white/50 dark:bg-neutral-800/50 z-20 rounded-full">
                <div class="w-full aspect-square h-full border rounded-full border-neutral-300 dark:border-neutral-400 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.1)]">

                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="absolute w-full bottom-[120px] z-[10] transition-all duration-[.8s]" style={{
          filter: albumGoDown() ? 'blur(16px)' : 'blur(0px)'
        }}>
          <div class="flex justify-center items-center">
            <div class="w-4 h-4 text-[#1CD155] mr-1">
              <SpotifyIcon/>
            </div>
            <StreamingIcon/>
          </div>

          {songData().songName && songData().artists &&
            <div class="mt-3">
              <div class="whitespace-nowrap px-6 overflow-hidden text-center" title={songData().songName}>
                <TextSlide text={songData().songName} classList={'text-xs font-mono'}/>
              </div>
              <div class="whitespace-nowrap px-6 overflow-hidden text-xs opacity-45 text-center mt-1" title={songData().artists}>
                <TextSlide text={songData().artists} classList={'text-xs'} speed={0.15}/>
              </div>
            </div>
          }
        </div>
      </div>
    </Show>

    <Show when={!isLoading() && !isPlaying()}>
      <div class="rounded-[36px] shadow w-[200px] aspect-square h-[200px] bg-white dark:bg-neutral-800 mx-auto overflow-hidden relative box-border border border-white dark:border-neutral-700">

        {/* disc shadow */}
        <div class="z-20 rounded-full aspect-square w-[200px] h-[200px] absolute bottom-[-95px] left-[-1px] shadow-xl rotate-180 opacity-30">
        </div>
        <div data-name={'disc'} class="rounded-full aspect-square w-[200px] h-[200px] absolute bottom-[-95px] left-[-1px] overflow-hidden border border-neutral-300 dark:border-neutral-700 flex justify-center items-center">
          {/* glow */}
          <div class="absolute w-full h-full left-0 top-0 z-[1] rounded-full overflow-hidden blur-[36px] rotate-90">
            <div class="w-full h-full absolute left-0 top-0 z-[1]">
              <div class="h-[100px] flex justify-center">
                <div class="w-[3px] bg-red-400 h-[100px]">
                </div>
                <div class="w-[2px] bg-orange-400 h-[100px]">
                </div>
              </div>
              <div class="h-[100px] flex justify-center">
                <div class="w-[2px] bg-blue-400 h-[100px]">
                </div>
                <div class="w-[3px] bg-purple-400 h-[100px]">
                </div>
              </div>
            </div>
            <div class="opacity-25 w-full h-full scale-125" style={{
              border: '100px solid transparent',
              'border-left': '100px solid #A2A2A2',
              'border-right': '100px solid #A2A2A2'
            }}>
            </div>
          </div>
          <div class="w-[48px] h-[48px] aspect-square border border-neutral-300 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-700 z-20 flex justify-center items-center rounded-full">
            <div class="w-[26px] h-[26px] aspect-square bg-white dark:bg-neutral-800 z-20 left-[80px] top-[80px] rounded-full">
              <div class="w-full aspect-square h-full border-2 rounded-full border-neutral-300 dark:border-neutral-400 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.1)]">

              </div>
            </div>
          </div>
        </div>

        <div class="absolute w-full top-[30px] z-[10] transition-all">
          <div class="flex justify-center items-center">
            <div class="w-4 h-4 opacity-50">
              <SpotifyIcon/>
            </div>
          </div>

          <div class="mt-2">
            <div class="whitespace-nowrap px-3 overflow-hidden text-ellipsis text-xs opacity-45 text-center">
              <span style={{
                animation: 'fadeIn .3s ease forwards'
              }}>Not listening now</span>
            </div>
          </div>
        </div>
      </div>
    </Show>
  </>
}
