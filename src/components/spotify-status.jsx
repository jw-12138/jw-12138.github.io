import {createSignal, Show, onMount} from 'solid-js'

let exampleResponse = {
  'songName': 'Do Ya Thing (feat. Young Dro)',
  'albumName': '25 To Life (83804/edited version)',
  'artists': 'P$C/Young Dro',
  'albumArt': [
    {
      'height': 640,
      'url': 'https://i.scdn.co/image/ab67616d0000b2738bc7980356fd59c34a4fd410',
      'width': 640
    },
    {
      'height': 300,
      'url': 'https://i.scdn.co/image/ab67616d00001e028bc7980356fd59c34a4fd410',
      'width': 300
    },
    {
      'height': 64,
      'url': 'https://i.scdn.co/image/ab67616d000048518bc7980356fd59c34a4fd410',
      'width': 64
    }
  ]
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
    let end = Date.now()

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

  function SpotifyIcon(props) {
    return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class={props.class || ''}>
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M17 3.34a10 10 0 1 1 -15 8.66l.005 -.324a10 10 0 0 1 14.995 -8.336m-2.168 11.605c-1.285 -1.927 -4.354 -2.132 -6.387 -.777a1 1 0 0 0 1.11 1.664c1.195 -.797 3.014 -.675 3.613 .223a1 1 0 1 0 1.664 -1.11m1.268 -3.245c-2.469 -1.852 -5.895 -2.187 -8.608 -.589a1 1 0 0 0 1.016 1.724c1.986 -1.171 4.544 -.92 6.392 .465a1 1 0 0 0 1.2 -1.6m1.43 -3.048c-3.677 -2.298 -7.766 -2.152 -10.977 -.546a1 1 0 0 0 .894 1.788c2.635 -1.317 5.997 -1.437 9.023 .454a1 1 0 1 0 1.06 -1.696"/>
    </svg>
  }

  return <>
    <div class="mb-4">
      Right now I'm listening to:
    </div>
    <Show when={isLoading()}>
      <div class="flex items-center">
        <div class="w-[80px] h-[80px] bg-gradient-to-br from-neutral-50 to-neutral-300 animate-pulse dark:from-neutral-600 dark:to-neutral-950 rounded flex-shrink-0 relative" data-name={'album placeholder'}>
          <SpotifyIcon class="absolute bottom-1 right-1 opacity-70 w-4 h-4"></SpotifyIcon>
        </div>
        <div class="flex flex-col justify-between ml-4">
          <div class="animate-pulse w-[120px] h-[26px] rounded dark:bg-white/10 bg-black/10 mb-2"></div>
          <div class="animate-pulse w-[80px] h-[16px] rounded dark:bg-white/10 bg-black/10"></div>
        </div>
      </div>
    </Show>

    <Show when={!isLoading() && isPlaying()}>
      <div class="flex items-center max-w-[260px] group">
        <div class="w-[80px] h-[80px] dark:bg-white/10 bg-black/10 overflow-hidden rounded flex-shrink-0 relative group-hover:shadow-xl transition duration-200">
          <SpotifyIcon class="absolute bottom-1 right-1 w-4 h-4 text-[#65D46E]"></SpotifyIcon>
          <img src={songData().albumArt ? songData().albumArt[0].url : ''} style="border-radius: 0" alt={songData().albumName || ''}/>
        </div>
        <div class="flex flex-col justify-between ml-4">
          <div class="mb-2 whitespace-nowrap text-ellipsis overflow-hidden max-w-full">
            {songData().songName || ''}
          </div>
          <div class="text-xs rounded opacity-70 whitespace-nowrap text-ellipsis overflow-hidden max-w-full">
            {songData().artists || ''}
          </div>
        </div>
      </div>
    </Show>

    <Show when={!isLoading() && !isPlaying()}>
      <div class="flex items-center">
        <div class="w-[80px] h-[80px] dark:bg-white/10 bg-black/10 overflow-hidden rounded flex-shrink-0 relative">
          <SpotifyIcon class="absolute bottom-1 right-1 opacity-70 w-4 h-4"></SpotifyIcon>
        </div>
        <div class="flex flex-col justify-between ml-4">
          <div class="rounded opacity-70 text-sm">
            Not playing anything
          </div>
        </div>
      </div>
    </Show>
  </>
}
