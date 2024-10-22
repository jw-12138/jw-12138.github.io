import {Howl} from 'howler'
import {sec2time} from '../utils/audio.js'
import {createSignal, onMount, createEffect, untrack} from 'solid-js'
import './app-audio/style.scss'

export default function AppAudio (props) {
  let [loadStatus, setLoadStatus] = createSignal(0)
  let [duration, setDuration] = createSignal(0)
  let [currentTime, setCurrentTime] = createSignal(0)
  let [soundPlaying, setSoundPlaying] = createSignal(false)
  let [adjustingSeeking, setAdjustingSeeking] = createSignal(false)
  let [lastSeekingValue, setLastSeekingValue] = createSignal(0)

  let inputRangeScale = 10

  let sound = null

  onMount(() => {
    sound = new Howl({
      src: props.src,
      pool: 1,
      onplay: function () {
        setSoundPlaying(true)
      },
      onend: function () {
        setSoundPlaying(false)
      },
      onpause: function () {
        setSoundPlaying(false)
      },
      onstop: function () {
        setSoundPlaying(false)
      },
      onload: soundLoaded,
      onloaderror: function () {
        setLoadStatus(-1)
      }
    })
  })

  let play = function () {
    if (!sound.playing()) {
      sound.play()
    }
  }

  let stopPlaying = function () {
    sound.stop()
    sound.seek(0)
    setSoundPlaying(false)
  }

  let pause = function () {
    sound.pause()
  }

  function soundLoaded() {
    setDuration(sound.duration() * inputRangeScale)
    setLoadStatus(1)
  }

  // watch user seeking
  createEffect(() => {
    setLastSeekingValue(currentTime() / inputRangeScale)
  })

  createEffect(() => {
    if (!adjustingSeeking()) {
      let lastSeek = untrack(
        () => lastSeekingValue()
      )
      sound.seek(lastSeek)
    }
  })

  async function adjustProcessBar() {
    let ct = sound.seek() * inputRangeScale

    if (ct !== lastSeekingValue() && !adjustingSeeking()) {
      setLastSeekingValue(ct)
      setCurrentTime(ct)
    }

    await new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, 50)
    })

    window.requestAnimationFrame(async function () {
      try {
        await adjustProcessBar()
      } catch (e) {
        console.log(e)
      }
    })
  }

  window.requestAnimationFrame(async function () {
    try {
      await adjustProcessBar()
    } catch (e) {
      console.log(e)
    }
  })

  return <>
    <div
      class="dark:bg-gradient-to-br dark:from-neutral-800 dark:to-neutral-900 bg-gradient-to-bl from-white to-neutral-100 overflow-hidden rounded-2xl shadow mb-8 px-4 py-8 dark:bg-neutral-900 max-w-[300px]">
      {
        loadStatus() === 0 && <div class="mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-loader-2 animate-spin" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M12 3a9 9 0 1 0 9 9"/>
          </svg>
        </div>
      }

      {
        props.label && <div class="text-sm italic mb-4 font-black flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-headphones w-5 h-5 mr-1" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M4 13m0 2a2 2 0 0 1 2 -2h1a2 2 0 0 1 2 2v3a2 2 0 0 1 -2 2h-1a2 2 0 0 1 -2 -2z"/>
            <path d="M15 13m0 2a2 2 0 0 1 2 -2h1a2 2 0 0 1 2 2v3a2 2 0 0 1 -2 2h-1a2 2 0 0 1 -2 -2z"/>
            <path d="M4 15v-3a8 8 0 0 1 16 0v3"/>
          </svg>
          {props.label}
        </div>
      }

      <div>
        <div class="flex justify-between items-center">
          <div class="text-xs text-neutral-500 dark:text-neutral-300 font-mono">
            {sec2time(currentTime() / inputRangeScale)}
          </div>
          <div class="text-xs text-neutral-500 dark:text-neutral-300 font-mono">
            {sec2time(duration() / inputRangeScale)}
          </div>
        </div>
      </div>

      <input
        type="range"
        min={0}
        value={currentTime()}
        max={duration()}
        class="w-full mb-6"
        disabled={loadStatus() === 0}
        onInput={(e) => {
          let val = Number(e.target.value)
          setCurrentTime(val)
        }}
        onMouseDown={() => setAdjustingSeeking(true)}
        onTouchStart={() => setAdjustingSeeking(true)}
        onMouseUp={() => setAdjustingSeeking(false)}
        onTouchEnd={() => setAdjustingSeeking(false)}
      />

      <div class="flex">
        {
          !soundPlaying() &&
          <button
            aria-label={"Play"}
            onClick={play}
            disabled={loadStatus() === 0}
            class="w-[2rem] h-[2rem] flex justify-center items-center dark:bg-white/10 rounded-full hover:shadow-xl shadow bg-neutral-100 transition-all text-black dark:text-white mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-player-play w-5 h-5"
                 viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
                 stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path d="M7 4v16l13 -8z"/>
            </svg>
          </button>
        }

        {
          soundPlaying() &&
          <button
            aria-label={"Pause"}
            class="w-[2rem] h-[2rem] flex justify-center items-center dark:bg-white/10 rounded-full hover:shadow-xl shadow bg-neutral-100 transition-all text-black dark:text-white mr-2"
            onClick={pause}
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-player-pause w-5 h-5"
                 viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
                 stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path d="M6 5m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z"/>
              <path d="M14 5m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z"/>
            </svg>
          </button>
        }

        <button
          aria-label={"Stop"}
          onClick={stopPlaying} disabled={loadStatus() === 0}
          class="w-[2rem] h-[2rem] flex justify-center items-center dark:bg-white/10 rounded-full hover:shadow-xl shadow bg-neutral-100 transition-all text-black dark:text-white mr-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-player-stop w-5 h-5"
               viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
               stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M5 5m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z"/>
          </svg>
        </button>
      </div>
    </div>
  </>
}
