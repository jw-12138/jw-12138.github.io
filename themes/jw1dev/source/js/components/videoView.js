export default {
  prop: {
    src: {
      default: '',
      type: String
    }
  },
  data: function () {
    return {
      src: ''
    }
  },
  template: `
    <template>
    <video playsinline autoplay muted controls loop :src="src" preload="metadata" style="max-width: 100%; width: auto;display: block;"></video>
    </template>
  `
}