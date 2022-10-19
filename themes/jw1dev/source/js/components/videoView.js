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
    <div>
    <video playsinline autoplay muted controls loop :src="src" preload="metadata" style="max-width: 100%; width: auto;display: block;"></video>
    <noscript>请开启JS功能以查看视频</noscript>
    </div>
  `
}