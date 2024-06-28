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
    document.getElementById('fake_spotify_status').remove()
    await loadData()
  })

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
