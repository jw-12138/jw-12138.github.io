<template>
  <div class="lg:block hidden mt-8 relative left-[-.5rem]">
    <button aria-label="返回顶部" class="px-2 py-1 rounded-xl hover:bg-black/15 dark:hover:bg-white/15 transition-all w-8 h-8 flex justify-center items-center mb-1 cursor-pointer opacity-70 hover:opacity-100"
         @click="goBackToTop"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-navigation-top" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M16.54 19.977a.34 .34 0 0 0 .357 -.07a.33 .33 0 0 0 .084 -.35l-4.981 -10.557l-4.982 10.557a.33 .33 0 0 0 .084 .35a.34 .34 0 0 0 .357 .07l4.541 -1.477l4.54 1.477z" /><path d="M12 3v2" /></svg>
    </button>
    <button
      @click="scrollToSlug(heading.slug)"
      :title="heading.text"
      class="text-xs max-w-full cursor-pointer hover:bg-black/15 dark:hover:bg-white/15 px-2 transition-all duration-500 block w-full text-left"
      v-for="(heading, index) in data"
      :class="{
        'rounded-t-xl hover:rounded-b-0 pt-[.3rem]': (!data[index - 1]) || (data[index - 1] && !slugPositionMap[data[index - 1].slug]?.isInView),
        'rounded-b-xl hover:rounded-t-0 pb-[.25rem]': (!data[index + 1]) || (data[index + 1] && !slugPositionMap[data[index + 1].slug]?.isInView),
        'text-black dark:text-white opacity-1 bg-black/10 dark:bg-white/10': slugPositionMap[heading.slug]?.isInView,
        'opacity-70 hover:rounded-xl pt-[.15rem] pb-[.11rem]': !slugPositionMap[heading.slug]?.isInView
      }"
      :style="{
      paddingLeft: (heading.depth - maxDepth + 1) * .5 + 'rem'
    }">
      <span class="overflow-hidden text-ellipsis whitespace-nowrap py-[.2rem] block">
        - {{ heading.text }}
      </span>
    </button>
  </div>
</template>

<script setup>
import {onMounted, ref, reactive} from 'vue'

const slugPositionMap = reactive({})

const props = defineProps({
  data: {
    type: Object,
    default: () => []
  }
})

let maxDepth = ref(6)

function findMaxDepth() {
  if (props.data.length === 0) {
    return false
  }

  props.data.map(el => {
    if (el.depth < maxDepth.value) {
      maxDepth.value = el.depth
    }
  })
}

function goBackToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

function scrollToSlug(slug) {
  const dom = document.getElementById(slug)
  if (dom) {
    window.scroll({
      top: dom.offsetTop + 10,
      behavior: 'smooth'
    })
  }
}

function getPositionForEachSlug() {
  let windowScrollTop = document.documentElement.scrollTop || document.body.scrollTop
  let windowHeight = document.documentElement.clientHeight || document.body.clientHeight
  props.data.map((el, index) => {
    const slug = el.slug
    try {
      const dom = document.getElementById(slug)
      const top = dom.offsetTop
      let nextHeadingTop
      if (props.data[index + 1]) {
        nextHeadingTop = document.getElementById(props.data[index + 1].slug).offsetTop
      } else {
        nextHeadingTop = document.querySelector('.page-content').offsetHeight + 156
      }

      let range = [top - windowScrollTop, nextHeadingTop - windowScrollTop]
      let isInView = range[0] < windowHeight && range[1] > 0
      slugPositionMap[slug] = {
        isInView
      }
    } catch (e) {

    }
  })
}

onMounted(async () => {
  await new Promise(resolve => setTimeout(resolve, 100))
  findMaxDepth()
  getPositionForEachSlug()

  setInterval(() => {
    getPositionForEachSlug()
  }, 1000 / 24)
})
</script>
