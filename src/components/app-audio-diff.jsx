import {Howl} from 'howler'
import {sec2time} from '../utils/audio.js'
import {createSignal, onMount, createEffect, untrack} from 'solid-js'
import './app-audio/style.scss'

export default function appAudioDiff(props) {

  let [adjustingSeeking, setAdjustingSeeking] = createSignal(false)

  let sound_1 = null
  let sound_2 = null

  function play() {
    if (!soundPlaying()) {
      sound_1.play()
      sound_2.play()
    }
  }

  let [loopStatus, setLoopStatus] = createSignal(0)

  function toggleLoop() {
    if (loopStatus() === 0) {
      setLoopStatus(1)
      sound_1.loop(true)
      sound_2.loop(true)
    } else {
      setLoopStatus(0)
      sound_1.loop(false)
      sound_2.loop(false)
    }
  }

  function stopPlaying() {
    sound_1.stop()
    sound_1.seek(0)
    sound_2.stop()
    sound_2.seek(0)
    sound_1.loop(false)
    sound_2.loop(false)
    setLoopStatus(0)
    setSoundPlaying(false)
  }

  function pause() {
    sound_1.pause()
    sound_2.pause()
  }

  let [currentTime, setCurrentTime] = createSignal(0)
  let [loadStatus_1, setLoadStatus_1] = createSignal(0)
  let [loadStatus_2, setLoadStatus_2] = createSignal(0)
  let [duration, setDuration] = createSignal(0)
  let inputRangeScale = 10
  let [currentActiveTrack, setCurrentActiveTrack] = createSignal(0)

  let soundLoaded_1 = function () {
    setDuration(sound_1.duration() * inputRangeScale)
    setLoadStatus_1(1)
  }

  let soundLoaded_2 = function () {
    setDuration(sound_2.duration() * inputRangeScale)
    setLoadStatus_2(1)
    sound_2.volume(0)
  }

  createEffect(() => {
    let _activeTrack = currentActiveTrack()

    if (!sound_1 || !sound_2) {
      return false
    }

    if (_activeTrack === 0) {
      sound_2.volume(0)
      sound_1.volume(1)
    } else {
      sound_1.volume(0)
      sound_2.volume(1)
    }
  })

  let [lastSeekingValue, setLastSeekingValue] = createSignal(0)
  createEffect(() => {
    setLastSeekingValue(currentTime() / inputRangeScale)
  })

  createEffect(() => {

    if (!sound_1 || !sound_2) {
      return false
    }

    if (!adjustingSeeking()) {
      let lastSeek = untrack(
        () => lastSeekingValue()
      )
      sound_1.seek(lastSeek)
      sound_2.seek(lastSeek)
    }
  })

  async function adjustProcessBar() {
    let ct = currentActiveTrack() === 0 ? sound_1.seek() * inputRangeScale : sound_2.seek() * inputRangeScale

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

  function switchSoundSource() {
    if (currentActiveTrack() === 0) {
      setCurrentActiveTrack(1)
    } else {
      setCurrentActiveTrack(0)
    }
  }

  let [soundPlaying, setSoundPlaying] = createSignal(false)

  onMount(() => {
    sound_1 = new Howl({
      src: [
        props.set[0].src
      ],
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
      onload: soundLoaded_1,
      onloaderror: function () {
        setLoadStatus_1(-1)
      }
    })

    sound_2 = new Howl({
      src: [
        props.set[1].src
      ],
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
      onload: soundLoaded_2,
      onloaderror: function () {
        setLoadStatus_2(-1)
      }
    })
  })

  return <div class="dark:bg-gradient-to-br dark:from-neutral-800 dark:to-neutral-900 bg-gradient-to-bl from-white to-neutral-100 overflow-hidden rounded-2xl shadow-2xl mb-8 px-4 py-8 dark:bg-neutral-900">
    {
      (loadStatus_1() === 0 || loadStatus_2() === 0) && <div class="mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-loader-2 animate-spin" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <path d="M12 3a9 9 0 1 0 9 9"/>
        </svg>
      </div>
    }

    <div class="text-base italic mb-4 font-black items-center flex">
      <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-headphones w-5 h-5 mr-1"
           viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
           stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M4 13m0 2a2 2 0 0 1 2 -2h1a2 2 0 0 1 2 2v3a2 2 0 0 1 -2 2h-1a2 2 0 0 1 -2 -2z"/>
        <path d="M15 13m0 2a2 2 0 0 1 2 -2h1a2 2 0 0 1 2 2v3a2 2 0 0 1 -2 2h-1a2 2 0 0 1 -2 -2z"/>
        <path d="M4 15v-3a8 8 0 0 1 16 0v3"/>
      </svg>
      {props.set[currentActiveTrack()].label}
    </div>

    <div>
      <div class="flex justify-between items-center">
        <div class="text-sm text-neutral-500 dark:text-neutral-300 font-mono">
          {sec2time(currentTime() / inputRangeScale)}
        </div>
        <div class="text-sm text-neutral-500 dark:text-neutral-300 font-mono">
          {sec2time(duration() / inputRangeScale)}
        </div>
      </div>
    </div>

    <input
      type="range"
      min={0}
      max={duration()}
      class="w-full mb-6"
      disabled={loadStatus_1() === 0 || loadStatus_2() === 0}
      value={currentTime()}
      onInput={(e) => {
        setCurrentTime(Number(e.target.value))
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
          disabled={
            loadStatus_1() === 0 || loadStatus_2() === 0
          }
          onClick={play}
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
          disabled={
            loadStatus_1() === 0 || loadStatus_2() === 0
          }
          onClick={pause}
          class={`w-[2rem] h-[2rem] flex justify-center items-center dark:bg-white/10 rounded-full hover:shadow-xl shadow bg-neutral-100 transition-all text-black dark:text-white mr-2`}

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
        disabled={loadStatus_1() === 0 || loadStatus_2() === 0}
        onClick={stopPlaying}
        class={`w-[2rem] h-[2rem] flex justify-center items-center dark:bg-white/10 rounded-full hover:shadow-xl shadow bg-neutral-100 transition-all text-black dark:text-white mr-2`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-player-stop w-5 h-5"
             viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
             stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <path d="M5 5m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z"/>
        </svg>
      </button>

      <button
        aria-label={"Switch Sound Source"}
        disabled={loadStatus_1() === 0 || loadStatus_2() === 0}
        onClick={switchSoundSource}
        class="w-[2rem] h-[2rem] flex justify-center items-center rounded-full shadow transition-all text-black dark:text-white mr-2"
        classList={{
          'bg-blue-400 dark:bg-blue-500 shadow-inner': currentActiveTrack() === 1,
          'bg-neutral-100 dark:bg-white/10': currentActiveTrack() !== 1
        }}
        style={{
          'transform': currentActiveTrack() === 0 ? 'rotate(0deg)' : 'rotate(180deg)'
        }}>
        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-toggle-left w-5 h-5" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <path d="M8 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/>
          <path d="M2 6m0 6a6 6 0 0 1 6 -6h8a6 6 0 0 1 6 6v0a6 6 0 0 1 -6 6h-8a6 6 0 0 1 -6 -6z"/>
        </svg>
      </button>

      <button
        aria-label={"Loop"}
        disabled={
          loadStatus_1() === 0 || loadStatus_2() === 0
        }
        onclick={toggleLoop}
        class="w-[2rem] h-[2rem] flex justify-center items-center rounded-full shadow transition-all text-black dark:text-white mr-2"
        classList={{
          'bg-orange-400 dark:bg-orange-500 shadow-inner': loopStatus() === 1,
          'dark:bg-white/10 bg-neutral-100': loopStatus() !== 1
        }}>
        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-repeat w-5 h-5" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <path d="M4 12v-3a3 3 0 0 1 3 -3h13m-3 -3l3 3l-3 3"/>
          <path d="M20 12v3a3 3 0 0 1 -3 3h-13m3 3l-3 -3l3 -3"/>
        </svg>
      </button>
    </div>
  </div>
}
