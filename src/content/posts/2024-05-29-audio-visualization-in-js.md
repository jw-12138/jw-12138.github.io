---  
layout: ../../layouts/post-layout.astro  
title: 再谈Web音频可视化  
issue:  
date: 2024-05-29T07:57:27.687Z  
tags:

- 音频可视化

---

刚开始接触这个主题时基本什么都不懂，甚至天真的[认为 Analyzer 输出线性分布的频率是个问题](https://jw1.dev/2022/08/19/a01/)，后来又[深入了解了一下傅立叶变换](https://jw1.dev/2023/11/04/understanding-fourier-transform/)，才觉得[当时提的 Issue](https://github.com/WebAudio/web-audio-api/issues/2501)在那些大佬眼里有多可笑。我提这个 Issue 的初心非常简单，纯粹是因为搞不定频率展示时的性能问题（甚至也搞不定对数分布）。

经过两年的沉淀，今天打算根据自己的理解和实践，系统地写一下音频可视化中一些比较常见的问题。

## 如何获取音频数据

来看最小 demo：

```html
<audio src="test.mp3" id="audio">
<button id="play">play</button>
```

```javascript
function uint8ArrayToArray(uint8Array) {
  let array = [];

  for (let i = 0; i < uint8Array.byteLength; i++) {
    array[i] = uint8Array[i];
  }

  return array;
}

let audioContext = null;
let analyzer = null;
let audioSource = null;

let playBtn = document.getElementById('play');
let audioTag = document.getElementById('audio');

playBtn.addEventListener('click', function () {
  audioTag.play();

  audioContext = new AudioContext();

  // 创建音频节点
  audioSource = audioContext.createMediaElementSource(audioTag);

  analyzer = audioContext.createAnalyser();

  // 将音频源节点连接到分析器，再把分析器连接到输出
  audioSource.connect(analyzer);
  analyzer.connect(audioContext.destination);
});

function handleData() {
  if (!analyzer) {
    return false;
  }

  let bufferLength = analyzer.frequencyBinCount;
  let timeDomainRaw = new Uint8Array(bufferLength);
  let freqDomainRaw = new Uint8Array(bufferLength);

  analyzer.getByteTimeDomainData(timeDomainRaw);
  analyzer.getByteFrequencyData(freqDomainRaw);

  let timeDomain = uint8ArrayToArray(timeDomainRaw); // 时域
  let freqDomain = uint8ArrayToArray(freqDomainRaw); // 频域

  console.log(timeDomain, freqDomain);

  return {timeDomain, freqDomain}
}

setInterval(handleData, 1000 / 24); // 24fps
```

这段代码如果能够成功跑起来，点了播放按钮之后控制台应该就能打印出时域和频域数据，这时候你就可以根据自己的喜好随意折腾这些数据了，最简单的方法当然就是循环生成`<div>`并原样输出：

![video](https://blog-r2.jw1.dev/UmQvgJNRmmArMXnY.mp4)

这样确实不错，但是很快你会遇到一个新问题，`analyzer`默认的`fftSize`是 2048，也就是说，每次快速傅立叶变换给出的数据包含 1024 个时域和频域数据，如果我们需要调高`fftSize`，很快我们就会面临性能问题。

## 使用Canvas进行性能优化

![video](https://blog-r2.jw1.dev/M0H6h0qCEN-zKz8Z.mp4)

`fftSize`，快速傅立叶变换尺寸，也就是每次进行快速傅立叶变换的数据量，数据量越多，产出的频域数据越精确，但是同时延迟也越高。官方给出的数据规范为，该值必须为 2 的次方，不可小于 2^5，不可大于 2^15。

当我们把 fftSize 调整到 2^14 时，我们的可视化组件很明显开始变得不流畅了，我们需要一个更加高效的渲染方法：Canvas。

很多人看到这个词眼神就开始闪躲，比如我 🤡。我一直觉得这无异于一门新的学科，直到我试了[pixi.js](https://pixijs.com/) 之后才发现，原来 2D 图形绘制也挺简单的。

同样来看最小 demo：

```html
<div id="app" style="height: 80px; width: 600px">
</div>
```

```js
import {Application, Graphics} from 'pixi.js'

const app = new Application();

let frameHeight = 80
let frameWidth = 600

window.addEventListener('load', async function () {

  // 初始化音频代码同上

  await app.init({
    resizeTo: document.getElementById('app')
  })

  const timeDomainPath = new Graphics()
  const FreqDomainPath = new Graphics()

  app.stage.addChild(timeDomainPath)
  app.stage.addChild(FreqDomainPath)

  document.getElementById('app').appendChild(app.canvas)

  app.ticker.add((time) => {
    let {timeDomain, freqDomain} = handleData()

    timeDomain = timeDomain.map(el => {
      return el / 255 * frameHeight  // 适应画布高度
    })

    freqDomain = freqDomain.map(el => {
      return el / 255 * frameHeight  // 适应画布高度
    })

    drawTimePath(timeDomainPath, timeDomain)
    drawFreqPath(FreqDomainPath, freqDomain)
  })
})

function drawTimePath(path, data) {
  path.clear()
  path.moveTo(0, frameHeight + data[0])

  let cellSize = frameWidth / data.length

  for (let i = 1; i < data.length; i++) {
    path.lineTo(cellSize * i, frameHeight + data[i])
  }

  path.stroke({
    color: 0xffffff,
    width: 6
  })
}

function drawFreqPath(path, data) {
  path.clear()
  path.moveTo(0, frameHeight)

  let cellSize = frameWidth / data.length

  for (let i = 1; i < data.length; i++) {
    path.lineTo(cellSize * i, frameHeight - data[i])
  }

  path.stroke({
    color: 0xffffff,
    width: 1
  })
}
```

![video](https://blog-r2.jw1.dev/QVCl_4VBLpwQboRD.mp4)

性能问题完美解决，但是其他问题又出现了。

## 正确的频域数据分布

![频域数据左边大右边小](https://blog-r2.jw1.dev/BgQ27FXn61_jVFcn.webp)

这个频域数据好像不太对，为什么左边这么高右边却那么小，最右边甚至是没有数据的？

因为这里的频域数据是线性分布的，而大多数频谱显示软件或硬件都是对数分布的，那对数分布又是什么？

我们来看一些计算：

```js
Math.log(100) - Math.log(10) // = 2.302585092994046

Math.log(1000) - Math.log(100) // = 2.302585092994045

Math.log(10000) - Math.log(1000) // = 2.302585092994047
```

在线性分布中，10 与 100 的差距是 90，与 1000 的差距是 990，与 10000 的差距是 9990，而在对数分布中，他们之间的距离基本上是一致的（2.3左右），这是比较符合人耳对声音感受的一种分布方式，最直观的例子就是，你能很轻松的分辨出 100hz 和 200hz 的区别，却很难分辨 9500hz 和 9600hz 之间的区别，因为更低的频率范围可以包含更多个音阶。

![音高和频率的对应关系](https://blog-r2.jw1.dev/FHH13jbBhvfow66n.webp)

可以看到，当音阶（X轴）线性上升时，频率（Y轴）却是指数上升的，为了抵消听觉和视觉上的不匹配，我们需要对频率的分布做一些小小的修改，也就是从线性分布更换为对数分布：

```js
function drawFreqPath(path, data) {
  path.clear()
  path.moveTo(0, frameHeight)

  let cellSize = frameWidth / data.length

  let max = Math.log(data.length)

  for (let i = 1; i < data.length; i++) {
    let x = Math.log(i) / max * frameWidth
    path.lineTo(x, frameHeight - data[i])
  }

  path.stroke({
    color: 0xffffff,
    width: 1
  })
}
```

![video](https://blog-r2.jw1.dev/jE2q1hKKnOJ9S0vL.mp4)

看起来好很多了，但是对数分布貌似并没有解决最右侧没有数据的问题，这是什么原因呢？

## 采样率大小对傅立叶变换的影响

> Each item in the array represents the decibel value for a specific frequency. The frequencies are spread linearly from 0 to 1/2 of the sample rate. For example, for`48000`sample rate, the last item of the array will represent the decibel value for`24000`Hz.
> 
> [MDN](https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/getByteFrequencyData)

在这个例子中，如果我们打印`analyzer.context.sampleRate`的值，我们会看到控制输出了`48000`，这个数字的意义为：当前音频 1 秒钟的样本中有 48000 个数据点位。而根据 MDN 的介绍我们可以得知，频率样本数量为采样率的 1/2，也就是说最后一个频率样本对应的频率是 24000hz，这个频率人耳是听不到的，所以在现代音乐制作的过程中，20000hz 以上的频率基本都会被裁切掉。

现在我们把`analyzer.fftSize`调整到最大以观察最佳效果：

```js
analyzer.fftSize = Math.pow(2, 15) // 32768
```

如果我们不希望数据中出现空白，可以在算法中对频率数据进行适当的裁切：

```js
// ...
app.ticker.add((time) => {
  let {freqDomain} = handleData()

  // ...

  let maxFreq = analyzer.context.sampleRate / 2
  let freqPerBin = maxFreq / bufferLength

  freqDomain = freqDomain.slice(0, Math.floor(20000 / freqPerBin))
  freqDomain = freqDomain.slice(Math.floor(20 / freqPerBin))
})
// ...
```

裁切之前 20000hz 的位置：

![裁切之前 20000hz 的位置](https://blog-r2.jw1.dev/e8elncx0KDYwRyhe.webp)

裁切之后 20000hz 的位置：

![裁切之后 20000hz 的位置](https://blog-r2.jw1.dev/L_P7tFFZd1LvWQ_z.webp)

## `fftSize`对频域数据的影响

既然`fftSize`越小，延迟也越少，那性能是不是更好呢？我们来试试把`fftSize`调整到最小：

```js
analyzer.fftSize = Math.pow(2, 5) // 32
```

![video](https://blog-r2.jw1.dev/twEdODpufmJtzjaK.mp4)

采样率 48kHz 时，在这个设置下每次获取的频域数据会包含 16 个点位，而这 16 个点位对应的频率如下：

- 1500
- 3000
- 4500
- 6000
- 7500
- 9000
- ...
- 22500
- 24000

回过头来再看看这张图：

![音高和频率的对应关系](https://blog-r2.jw1.dev/FHH13jbBhvfow66n.webp)

前面说到，频率范围越低，包含的音阶却越多，也就是说我们能感知的音高变化基本都集中在中低频，大约 40hz 到 7000hz 左右，`fftSize`调小之后确实性能更好了，但是上面那些列出的频率不足以支撑我们作出合理的可视化图形。我的建议是把`fftSize`调整到`8192`，这样既能保证延迟在合理范围内，也能保证一定的分辨率和灵活性。

## 录音实时可视化

到这里关于音频可视化的一些常见问题我觉得算是基本上都覆盖了，最后一个问题，怎么在录音的时候做到可视化呢？其实也很简单：

```html
<div style="width: 100%">
  <button id="enable">Record</button>
</div>
```

```js
let audioContext = null
let analyzer = null
let streamSource = null

document.getElementById('enable').addEventListener('click', async function () {
  audioContext = new AudioContext()
  analyzer = audioContext.createAnalyser()

  // request permission to record audio
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia(
        {
          audio: true
        }
      )

      .then((stream) => {
        // 重点
        streamSource = audioContext.createMediaStreamSource(stream)

        streamSource.connect(analyzer)

        setInterval(function() {
          let data = handleData() // 和上面的 handleData 方法一样
        }, 1000 / 24)
      })

      .catch((err) => {
        // permission rejected
        console.error(`The following getUserMedia error occurred: ${err}`)
      })
  } else {
    console.error('getUserMedia not supported')
  }
})
```

---

好了，理解这些问题或者说要点之后，如何实现音频可视化基本上就靠你的想象力和创造力了，如果实在没有灵感可以看一下 `wave.js` 的[一些示例](https://foobar404.dev/wave.js/)。

感谢阅读！

👋
