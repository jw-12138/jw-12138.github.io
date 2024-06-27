import {createSignal, Show, onMount} from 'solid-js'
import StreamingIcon from '../streaming-icon.jsx'

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
        }, 500 - offset)
      } else {
        setIsLoading(false)
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

  function SpotifyIcon(props) {

    return <span class={props.class || ''}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill-rule="evenodd" fill="currentColor" clip-rule="evenodd" style={{
      width: '100%',
      height: '100%'
    }}><path d="M19.098 10.638c-3.868-2.297-10.248-2.508-13.941-1.387-.593.18-1.22-.155-1.399-.748-.18-.593.154-1.22.748-1.4 4.239-1.287 11.285-1.038 15.738 1.605.533.317.708 1.005.392 1.538-.316.533-1.005.709-1.538.392zm-.126 3.403c-.272.44-.847.578-1.287.308-3.225-1.982-8.142-2.557-11.958-1.399-.494.15-1.017-.129-1.167-.623-.149-.495.13-1.016.624-1.167 4.358-1.322 9.776-.682 13.48 1.595.44.27.578.847.308 1.286zm-1.469 3.267c-.215.354-.676.465-1.028.249-2.818-1.722-6.365-2.111-10.542-1.157-.402.092-.803-.16-.895-.562-.092-.403.159-.804.562-.896 4.571-1.045 8.492-.595 11.655 1.338.353.215.464.676.248 1.028zm-5.503-17.308c-6.627 0-12 5.373-12 12 0 6.628 5.373 12 12 12 6.628 0 12-5.372 12-12 0-6.627-5.372-12-12-12z"/></svg></span>
  }

  return <>
    <div class="mb-4">
      My mood now:
    </div>
    <Show when={isLoading()}>
      <div class="flex items-center">
        <div class="w-[80px] h-[80px] bg-gradient-to-br from-neutral-50 to-neutral-300 animate-pulse dark:from-neutral-600 dark:to-neutral-950 rounded flex-shrink-0 relative" data-name={'album placeholder'}>
          <SpotifyIcon class="absolute bottom-1 right-1 opacity-70 w-3 h-3"></SpotifyIcon>
        </div>
        <div class="flex flex-col justify-between ml-4">
          <div class="animate-pulse w-[24px] h-[16px] rounded dark:bg-white/10 bg-black/10 mb-2"></div>
          <div class="animate-pulse w-[180px] h-[26px] rounded dark:bg-white/10 bg-black/10 mb-2"></div>
          <div class="animate-pulse w-[80px] h-[16px] rounded dark:bg-white/10 bg-black/10"></div>
        </div>
      </div>
    </Show>

    <Show when={!isLoading() && isPlaying()}>
      <div class="flex items-center max-w-[260px] group">
        <div class="w-[80px] h-[80px] dark:bg-white/10 bg-black/10 overflow-hidden rounded flex-shrink-0 relative group-hover:shadow-xl transition duration-200 flex justify-center">
          <SpotifyIcon class="absolute bottom-1 right-1 w-3 h-3 text-[#65D46E]"></SpotifyIcon>
          <img src={songData().albumArt ? albumSelection(songData().albumArt).url : ''} style="border-radius: 0; margin: 0" class="w-full h-full ml-0 mr-0 mb-0" alt={songData().albumName || ''}/>
        </div>
        <div class="flex flex-col justify-between ml-4">
          <div class="mb-1 pl-[2px]">
            <StreamingIcon/>
          </div>
          <div class="mb-2 whitespace-nowrap text-ellipsis overflow-hidden max-w-[calc(100vw-130px)]">
            {songData().songName || ''}
          </div>
          <div class="text-xs rounded opacity-70 whitespace-nowrap text-ellipsis overflow-hidden max-w-[calc(100vw-130px)]">
            {songData().artists || ''}
          </div>
        </div>
      </div>
    </Show>

    <Show when={!isLoading() && !isPlaying()}>
      <div class="flex items-center">
        <div class="w-[80px] h-[80px] dark:bg-white/10 bg-black/10 overflow-hidden rounded flex-shrink-0 relative">
          <SpotifyIcon class="absolute bottom-1 right-1 opacity-70 w-3 h-3"></SpotifyIcon>
        </div>
        <div class="flex flex-col justify-between ml-4">
          <div class="rounded opacity-70 text-sm">
            Taking a break...
          </div>
        </div>
      </div>
    </Show>
  </>
}
