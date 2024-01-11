<template>
  <div
       class="dark:bg-gradient-to-br dark:from-neutral-800 dark:to-neutral-900 bg-gradient-to-bl from-white to-neutral-100 overflow-hidden rounded-2xl shadow-2xl mb-8 px-4 py-8 dark:bg-neutral-900">
    <div v-show="loadStatus === 0" class="mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-loader-2 animate-spin" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 3a9 9 0 1 0 9 9" /></svg>
    </div>
    <div class="text-base italic mb-4 font-black flex items-center" v-show="label">
      <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-headphones w-5 h-5 mr-1" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 13m0 2a2 2 0 0 1 2 -2h1a2 2 0 0 1 2 2v3a2 2 0 0 1 -2 2h-1a2 2 0 0 1 -2 -2z" /><path d="M15 13m0 2a2 2 0 0 1 2 -2h1a2 2 0 0 1 2 2v3a2 2 0 0 1 -2 2h-1a2 2 0 0 1 -2 -2z" /><path d="M4 15v-3a8 8 0 0 1 16 0v3" /></svg> {{ label }}
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
    <input type="range" min="0" v-model="currentTime" :max="duration" class="w-full mb-6" :disabled="loadStatus === 0"
           @mousedown="adjustingSeeking = true"
           @touchstart="adjustingSeeking = true"
           @mouseup="adjustingSeeking = false"
           @touchend="adjustingSeeking = false"
    >
    <div class="flex">
      <button v-show="!soundPlaying" @click="play" :disabled="loadStatus === 0"
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
      <button @click="stopPlaying" :disabled="loadStatus === 0"
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
  src: {
    type: String,
    required: true
  },
  label: {
    type: String,
    default: ''
  }
})

let adjustingSeeking = ref(false)

let sound = null

let play = function () {
  if (!sound.playing()) {
    sound.play()
  }
}

let stopPlaying = function () {
  sound.stop()
  sound.seek(0)
  soundPlaying.value = false
}

let pause = function () {
  sound.pause()
}

let currentTime = ref(0)
let loadStatus = ref(0)
let duration = ref(0)
let inputRangeScale = 10

let soundLoaded = function () {
  duration.value = sound.duration() * inputRangeScale
  loadStatus.value = 1
}

let lastSeekingValue = ref(0)
watch(currentTime, (val) => {
  lastSeekingValue.value = Number(val)  / inputRangeScale
})

watch(adjustingSeeking, (val) => {
  if (!val) {
    sound.seek(lastSeekingValue.value)
  }
})

async function adjustProcessBar() {
  let ct = sound.seek() * inputRangeScale

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

let soundPlaying = ref(false)
onMounted(() => {
  sound = new Howl({
    src: props.src,
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
    onload: soundLoaded,
    onloaderror: function () {
      loadStatus.value = -1
    }
  })
})
</script>
