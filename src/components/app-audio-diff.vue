<template>
  <div
       class="dark:bg-gradient-to-br dark:from-neutral-800 dark:to-neutral-900 bg-gradient-to-bl from-white to-neutral-100 overflow-hidden rounded-2xl shadow-2xl mb-8 px-4 py-8 dark:bg-neutral-900">
    <div v-show="loadStatus_1 === 0 || loadStatus_2 === 0" class="mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-loader-2 animate-spin" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 3a9 9 0 1 0 9 9" /></svg>
    </div>
    <div class="text-base italic mb-4 font-black items-center flex">
      <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-headphones w-5 h-5 mr-1"
           viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
           stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M4 13m0 2a2 2 0 0 1 2 -2h1a2 2 0 0 1 2 2v3a2 2 0 0 1 -2 2h-1a2 2 0 0 1 -2 -2z"/>
        <path d="M15 13m0 2a2 2 0 0 1 2 -2h1a2 2 0 0 1 2 2v3a2 2 0 0 1 -2 2h-1a2 2 0 0 1 -2 -2z"/>
        <path d="M4 15v-3a8 8 0 0 1 16 0v3"/>
      </svg>
      {{ set[currentActiveTrack].label }}
    </div>

    <div>
      <div class="flex justify-between items-center">
        <div class="text-sm text-neutral-500 dark:text-neutral-300 font-mono">
          {{ sec2time(currentTime / inputRangeScale) }}
        </div>
        <div class="text-sm text-neutral-500 dark:text-neutral-300 font-mono">
          {{ sec2time(duration / inputRangeScale) }}
        </div>
      </div>
    </div>
    <input type="range" min="0" v-model="currentTime" :max="duration" class="w-full mb-6" :disabled="loadStatus_1 === 0 || loadStatus_2 === 0"
           @mousedown="adjustingSeeking = true"
           @touchstart="adjustingSeeking = true"
           @mouseup="adjustingSeeking = false"
           @touchend="adjustingSeeking = false"
    >
    <div class="flex">
      <button :disabled="loadStatus_1 === 0 || loadStatus_2 === 0" v-show="!soundPlaying" @click="play"
              class="w-[2rem] h-[2rem] flex justify-center items-center dark:bg-white/10 rounded-full hover:shadow-xl shadow bg-neutral-100 transition-all text-black dark:text-white mr-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-player-play w-5 h-5"
             viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
             stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <path d="M7 4v16l13 -8z"/>
        </svg>
      </button>
      <button v-show="soundPlaying" @click="pause"
              class="w-[2rem] h-[2rem] flex justify-center items-center dark:bg-white/10 rounded-full hover:shadow-xl shadow bg-neutral-100 transition-all text-black dark:text-white mr-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-player-pause w-5 h-5"
             viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
             stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <path d="M6 5m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z"/>
          <path d="M14 5m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z"/>
        </svg>
      </button>
      <button :disabled="loadStatus_1 === 0 || loadStatus_2 === 0" @click="stopPlaying"
              class="w-[2rem] h-[2rem] flex justify-center items-center dark:bg-white/10 rounded-full hover:shadow-xl shadow bg-neutral-100 transition-all text-black dark:text-white mr-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-player-stop w-5 h-5"
             viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
             stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <path d="M5 5m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z"/>
        </svg>
      </button>
      <button :disabled="loadStatus_1 === 0 || loadStatus_2 === 0" @click="switchSoundSource" class="w-[2rem] h-[2rem] flex justify-center items-center dark:bg-white/10 rounded-full shadow bg-neutral-100 transition-all text-black dark:text-white mr-2" :class="{
        'bg-blue-400 dark:bg-blue-500 shadow-inner': currentActiveTrack === 1
      }" :style="{
        'transform': currentActiveTrack === 0 ? 'rotate(0deg)' : 'rotate(180deg)'
      }"><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-toggle-left w-5 h-5" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M8 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M2 6m0 6a6 6 0 0 1 6 -6h8a6 6 0 0 1 6 6v0a6 6 0 0 1 -6 6h-8a6 6 0 0 1 -6 -6z" /></svg></button>
      <button :disabled="loadStatus_1 === 0 || loadStatus_2 === 0" @click="toggleLoop" class="w-[2rem] h-[2rem] flex justify-center items-center dark:bg-white/10 rounded-full shadow bg-neutral-100 transition-all text-black dark:text-white mr-2" :class="{
        'bg-orange-400 dark:bg-orange-500 shadow-inner': loopStatus === 1
      }">
        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-repeat w-5 h-5" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 12v-3a3 3 0 0 1 3 -3h13m-3 -3l3 3l-3 3" /><path d="M20 12v3a3 3 0 0 1 -3 3h-13m3 3l-3 -3l3 -3" /></svg>
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
input[type="range"] {
  width: 100%;
  -webkit-appearance: none;
  background-color: rgba(0, 0, 0, 0.05);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center center;
  border-radius: 6px;

  &:hover {
    @apply bg-black/10
  }

  &::-webkit-slider-runnable-track {
    -webkit-appearance: none;

    @apply h-[5px] cursor-pointer bg-neutral-200 dark:bg-neutral-700 border-none rounded-[6px];
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;

    @apply border-none w-[20px] relative top-[-8px] h-[20px] rounded-[20px] dark:bg-white shadow bg-neutral-800;
  }
}
</style>

<script setup>
import {onMounted, ref, watch} from 'vue'
import {Howl, Howler} from 'howler'
import {sec2time} from '../utils/audio.js'

const props = defineProps({
  set: {
    type: Array,
    required: true
  }
})

let adjustingSeeking = ref(false)

let sound_1 = null
let sound_2 = null

let play = function () {
  if (!soundPlaying.value) {
    sound_1.play()
    sound_2.play()
  }
}

let loopStatus = ref(0)
let toggleLoop = function () {
  if (loopStatus.value === 0) {
    loopStatus.value = 1
    sound_1.loop(true)
    sound_2.loop(true)
  } else {
    loopStatus.value = 0
    sound_1.loop(false)
    sound_2.loop(false)
  }
}

let stopPlaying = function () {
  sound_1.stop()
  sound_1.seek(0)
  sound_2.stop()
  sound_2.seek(0)
  sound_1.loop(false)
  sound_2.loop(false)
  loopStatus.value = 0
  soundPlaying.value = false
}

let pause = function () {
  sound_1.pause()
  sound_2.pause()
}

let currentTime = ref(0)
let loadStatus_1 = ref(0)
let loadStatus_2 = ref(0)
let duration = ref(0)
let inputRangeScale = 10
let currentActiveTrack = ref(0)

let soundLoaded_1 = function () {
  duration.value = sound_1.duration() * inputRangeScale
  loadStatus_1.value = 1
}

let soundLoaded_2 = function () {
  loadStatus_2.value = 1
  sound_2.volume(0)
}

watch(currentActiveTrack, val => {
  if (val === 0) {
    sound_2.volume(0)
    sound_1.volume(1)
  } else {
    sound_1.volume(0)
    sound_2.volume(1)
  }
})

let lastSeekingValue = ref(0)
watch(currentTime, (val) => {
  lastSeekingValue.value = Number(val) / inputRangeScale
})

watch(adjustingSeeking, (val) => {
  if (!val) {
    sound_1.seek(lastSeekingValue.value)
    sound_2.seek(lastSeekingValue.value)
  }
})

async function adjustProcessBar() {
  let ct = currentActiveTrack.value === 0 ? sound_1.seek() * inputRangeScale : sound_2.seek() * inputRangeScale

  if (ct !== lastSeekingValue.value && !adjustingSeeking.value) {
    lastSeekingValue.value = ct
    currentTime.value = ct
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
  if (currentActiveTrack.value === 0) {
    currentActiveTrack.value = 1
  } else {
    currentActiveTrack.value = 0
  }
}

let soundPlaying = ref(false)
onMounted(() => {
  sound_1 = new Howl({
    src: [
      props.set[0].src
    ],
    pool: 1,
    onplay: function () {
      soundPlaying.value = true
    },
    onend: function () {
      soundPlaying.value = false
    },
    onpause: function () {
      soundPlaying.value = false
    },
    onstop: function () {
      soundPlaying.value = false
    },
    onload: soundLoaded_1,
    onloaderror: function () {
      loadStatus_1.value = -1
    }
  })

  sound_2 = new Howl({
    src: [
      props.set[1].src
    ],
    pool: 1,
    onplay: function () {
      soundPlaying.value = true
    },
    onend: function () {
      soundPlaying.value = false
    },
    onpause: function () {
      soundPlaying.value = false
    },
    onstop: function () {
      soundPlaying.value = false
    },
    onload: soundLoaded_2,
    onloaderror: function () {
      loadStatus_2.value = -1
    }
  })
})
</script>
