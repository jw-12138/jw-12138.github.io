import {createSignal, Show, onMount} from 'solid-js'
import StreamingIcon from '../streaming-icon.jsx'
import SpotifyIcon from './spotify-icon.jsx'

export default function SpotifyStatus() {
  let [isPlaying, setIsPlaying] = createSignal(false)
  let [isLoading, setIsLoading] = createSignal(true)
  let [songData, setSongData] = createSignal({})

  // spotify may return multiple album arts
  // we need to select the most suitable one
  function albumSelection(albums) {
    if (albums.length === 1) {
      return albums[0]
    }

    // sort
    albums.sort((a, b) => a.width - b.width)

    let selected = albums[0]

    for (let i = 0; i < albums.length; i++) {
      if (albums[i].width > 160) {
        selected = albums[i]
        break
      }
    }

    return selected
  }

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

  const [showDisc, setShowDisc] = createSignal(false)

  return <>
    <Show when={!isLoading() && isPlaying()}>
      <div class="shadow w-[200px] aspect-square h-[200px] bg-white dark:bg-neutral-800 mx-auto overflow-hidden relative box-border border border-white dark:border-neutral-700 hover:shadow-xl transition-all duration-300" style={{
        'border-radius': showDisc() ? '100px' : '36px'
      }}>

        {/* disc shadow */}
        <div class="z-[51] rounded-full aspect-square w-[200px] cursor-pointer h-[200px] absolute left-0 shadow-xl" style={{
          top: showDisc() ? '0' : '-95px',
          transition: 'top 0.3s ease'
        }} onclick={() => {
          setShowDisc(!showDisc())
        }}>
        </div>
        <div data-name={'disc'} class="rounded-full aspect-square w-[200px] h-[200px] absolute z-[50] left-[-1px] animate-spin overflow-hidden border border-neutral-300 dark:border-neutral-700" style={{
          'animation-duration': '20s',
          top: showDisc() ? '-1px' : '-95px',
          transition: 'top 0.3s ease',
          'background-image': `url(${songData().albumArt ? songData().albumArt[0].url : ''})`,
          'background-size': 'cover',
          'background-repeat': 'no-repeat'
        }}>
          {/* glow */}
          <div class="absolute w-full h-full left-0 top-0 z-[1] rounded-full overflow-hidden blur-2xl">
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
          <div class="w-[52px] h-[52px] aspect-square border border-neutral-300 dark:border-neutral-800 absolute bg-neutral-100 dark:bg-neutral-700 z-20 left-[70px] top-[70px] flex justify-center items-center rounded-full">
            <div class="w-[32px] h-[32px] aspect-square bg-white dark:bg-neutral-800 z-20 left-[80px] top-[80px] rounded-full">
              <div class="w-full aspect-square h-full border-2 rounded-full border-neutral-300 dark:border-neutral-400 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.1)]">

              </div>
            </div>
          </div>
        </div>
        <div class="absolute w-full top-[120px] z-[10] transition-all" style={{
          filter: showDisc() ? 'blur(6px)' : 'blur(0px)'
        }}>
          <div class="flex justify-center items-center">
            <div class="w-4 h-4 text-[#1CD155] mr-1">
              <SpotifyIcon/>
            </div>
            <StreamingIcon/>
          </div>

          <div class="mt-3">
            <div class="whitespace-nowrap px-3 overflow-hidden text-ellipsis text-xs opacity-45 text-center" title={songData().artists}>
              {songData().artists}
            </div>
            <div class="whitespace-nowrap px-3 overflow-hidden text-ellipsis text-xs text-center" title={songData().songName}>
              {songData().songName}
            </div>
          </div>
        </div>
      </div>
    </Show>

    <Show when={!isLoading() && !isPlaying()}>
      <div class="rounded-[36px] shadow w-[200px] aspect-square h-[200px] bg-white dark:bg-neutral-800 mx-auto overflow-hidden relative box-border border border-white dark:border-neutral-700">

        {/* disc shadow */}
        <div class="z-20 rounded-full aspect-square w-[200px] h-[200px] absolute top-[-95px] left-0 shadow-xl">
        </div>
        <div data-name={'disc'} class="rounded-full aspect-square w-[200px] h-[200px] absolute top-[-95px] left-0 overflow-hidden border border-neutral-300 dark:border-neutral-700">
          {/* glow */}
          <div class="absolute w-full h-full left-0 top-0 z-[1] rounded-full overflow-hidden blur-2xl">
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
          <div class="w-[60px] h-[60px] aspect-square border border-neutral-300 dark:border-neutral-800 absolute bg-neutral-100 dark:bg-neutral-700 z-20 left-[70px] top-[70px] flex justify-center items-center rounded-full">
            <div class="w-[40px] h-[40px] aspect-square bg-white dark:bg-neutral-800 z-20 left-[80px] top-[80px] rounded-full">
              <div class="w-full aspect-square h-full border-2 rounded-full border-neutral-300 dark:border-neutral-400 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.1)]">

              </div>
            </div>
          </div>
        </div>

        <div class="pt-[120px]">
          <div class="flex justify-center items-center">
            <div class="w-4 h-4 opacity-50">
              <SpotifyIcon/>
            </div>
          </div>

          <div class="mt-6">
            <div class="whitespace-nowrap px-3 overflow-hidden text-ellipsis text-xs opacity-45 text-center">
              Not listening now
            </div>
          </div>
        </div>
      </div>
    </Show>
  </>
}
