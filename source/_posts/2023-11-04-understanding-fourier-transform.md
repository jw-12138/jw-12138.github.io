---
title: 从音乐制作认识傅里叶变换
issue: 100
date: 2023-11-04 10:48:46
tags:
  - 傅里叶变换
  - 数字信号处理
---

从 2016 年开始玩音乐以来，滤波器（EQ / Equalizer）这种东西对于我来讲可以说不能再熟悉了，什么样的音色应该使用是什么形式的滤波，是高通（high pass）还是高切（high cut），哪个区间的频率应该增幅又或是降幅，基本可以说是手到擒来，言出法随。可是这么多年过去了，我居然一次都没有考虑过，那些跳动的频谱图是怎么来的。

<video src="https://blog-r2.jw1.dev/3b8wzvg9E4_tDvUx.mp4" autoplay playsinline muted loop controls></video>

今天就来浅浅的认识一下傅里叶变换吧！（着实没想到本数学渣也会有今天）

---

注意，这篇博客不会深究傅里叶变换的具体细节，相反，我会用两种不同的方式试着去解释傅里叶变换在音频数据转换方面究竟做了什么事情。

按照维基百科的定义，傅里叶变换是一种线性积分变换，用于信号在时域和频域之间的变换。

线性积分变换我们先放一旁，不用着急去理解（着急也没用），我们可以把注意力放在「时域」和「频域」这两个词上面，翻译成英语的话，一个叫「Time Domain」，另一个叫「Frequency Domain」。作为一个音乐制作人，这两个东西在我们这里犹如吃饭和喝水，是的，时域所表达的数据就是声音本身，也就是「波形」：

<video src="https://blog-r2.jw1.dev/time_domain.mp4" autoplay playsinline muted loop controls></video>

而频域，相信你也猜到了，他所表达的数据，正是频率：

<video src="https://blog-r2.jw1.dev/lIBMdb_F5As3-nav.mp4" autoplay playsinline muted loop controls></video>

而我好奇的是，这两种数据，究竟是如何转换的呢？先来看看它们之间的关联，这是一个 440hz 的正弦波在时域和频域上的表现：

![](https://blog-r2.jw1.dev/gc8aiHkcszjQEIVn.png)

可以看到，时域数据由 440hz 的正弦波上下振动构成，我们将这个时间段内产生的振动想象成一个矩形。而频域数据则表现为一条有凸起的线，如果这时候我们再去加一个 2000hz 的正弦波，这时候再去看这两个数据，会是什么样的呢？

![](https://blog-r2.jw1.dev/pLKMREN6KxG83L93.png)

可以看到，时域数据得到了增益，我们可以认为先前想象的矩形的高度变大了，且产生的波形也不再是一个单一频率的正弦波，而是同时包含 2 个频率的波形。这时候再来看右侧频域数据，和我们期望的一样，一条线上有两个峰值，一个在 440hz，一个在 2000hz。

为了更加容易理解这种数据上的变化，我们可以想象一个三维空间，我们以频域这条线延伸出一个面，这样我们就得到了一张「纸」，一个时间单位内的信号变化会让这张纸同时在时域（X）轴和频域（Y）轴以及振幅（Z）轴产生变化，如果我们从 X 轴向原点看去，我们会看到纸张的一侧在二维平面投影出了一条线，也就是频域（Y 轴），如果我们从 Y 轴向原点看去，我们会看到纸张在二维平面投影出一个矩形，也就是时域（X 轴）。傅里叶变换所做的事情无异于改变了观看数据的视角，不过现实情况中，这种转换会稍微复杂那么 🤏 亿点点。

<video src="https://blog-r2.jw1.dev/neA4FgWFaGEolIIp.mp4" autoplay playsinline muted loop controls></video>

### 时域数据到频率数据的暴力拆解

抛开那些让人头疼的数学公式，我们先来捋一捋目前我们都知道些什么。

1. 时域数据一定包含频域数据  
   我们可以很轻易的计算出单位时间内某一固定振幅的波频率，举个例子：1 秒钟的正弦波时域数据中，如果我们能看到 100 个完整的正弦波，那么他的频率则为 100Hz。
2. 任何复杂信号都可以拆解为无数个单一频率的正弦波或余弦波
   同频的正弦波和余弦波波形完全一样，但是起始点（相位）不同，为了方便理解，这篇博客中只会使用正弦波。
3. 信号如果发生重叠，一定会发生增益或抵消反应  
   两条 100Hz 的能量为 1 的同相位正弦波如果发生重叠，则会组成一个 100Hz 能量为 2 的正弦波。

由此三条，我们不妨做出一个大胆的假设，我们使用与原始信号同样位数的 1Hz 到 20000Hz 的正弦波依次与原始数据相乘得到点积并计算出 Y 轴所有点积的平均值（相位）并记录，由于信号的重叠，一部分发生了增益反应，一部分发生了抵消反应，如果我们把记录下来的平均相位值进行记录，你会发现，我们得到了频域数据。

> 这里我多次提到了「相位」这个词，为了方便理解，我们可以认为在直角坐标系中的相位是一段波形在 X 轴上的起点，而在极坐标中，相位代表了起始角度，同样的两条波形发生重叠后，如果相位一致，那么合成的波形能量会乘 2，相位相反则能量互相抵消为 0 。

我们可以做一个小工具来验证这个猜想，先在 48KHz 的采样率下生成一段 512 位 440Hz 的正弦波。

![](https://blog-r2.jw1.dev/Z6XGJxtrP4h36M85.png)

先从 1Hz 的频率开始对比，直到 20000Hz，我们来看看记录下的图形：

<video src="https://blog-r2.jw1.dev/GJPt7TrezLFnTvRx.mp4" autoplay playsinline muted loop controls></video>

![](https://blog-r2.jw1.dev/C-Ld_yBkX6qEeeH6.png)

由此我们得到了一张频谱图，且有一个峰值，这个峰值所在的地方就是 440Hz 在 0 - 20000Hz 所处的位置，为了验证该想法的确实成立，我们试试看在同样的采样率下生成一段包含两个不同频率的正弦波形（1000 + 2000Hz），再放进图表中进行计算看看：

![1000Hz + 2000Hz的正弦波](https://blog-r2.jw1.dev/N5adueSJ7Rxoh74s.png)

![1000Hz + 2000Hz的正弦波频率拆解](https://blog-r2.jw1.dev/VtCfDi9ApekFOZ7e.png)

记录下的数据完美的展示出两个峰值，想法成立！计算峰值频率也很简单，哪个正弦波能触发最高相位，那么波形所在频率就一定是这个正弦波的频率，而且这个方法在理论上的分析精确度可以做到比傅里叶变换要高，但是缺点也是有的：

1. 计算效率；如果需要得到精确的频谱图，则需要大量的计算，在解析步长为 0.1 的时候，一次 0Hz 到 20000Hz 的扫描需要 200,000 次计算。
2. 解析步长小于（采样率 / 数据节点数）时无法准确还原时域数据；傅里叶变换可以在没有信息丢失的情况进行两种数据角度的转换。

### 使用自身数据进行扫描对比

我们再来想象另一种方法，假设目前给定的时域数据中包含 4 个完全一致且周期完整的正弦波，这时候的波形平均相位是 0，我们把最后一个正弦波拆解并放置在 X 轴的起始位，你会发现这时候的相位提升了一点点，因为有一个正弦波得到了增益，如果我们再拆一个正弦波出来放在 X 轴的起点，把之前拆出来正弦波向后移动一个周期，这时候你会发现总体相位平均值又上升了一级，如果我们把 4 个正弦波全部叠加在一起，至此，我们从原始波形中拆解出来的波形能够组成的最高相位出现了！

这样想象还不够直观，我们还是来做一个小工具，并且在上面的描述中做一个小改动，我们把之前使用的直角坐标系换成极坐标系，采样率 48Khz 的情况下生成一段 375Hz 的正弦波，放进图表里看看：

<video src="https://blog-r2.jw1.dev/Ie2Z3GTnFhXNyJoI.mp4" autoplay playsinline muted loop controls></video>

在极坐标中，X 轴由线变成了点，Y 轴也失去了负数象限，于是 4 个正弦波在极坐标上均匀的绘制出了 8 个叶片。想象这样一个图形有一定的质量，在我们将数据从尾部一点点提取到头部的时候，图形的质心一定会发生变化。

![](https://blog-r2.jw1.dev/0gzswHqlBfzp_Qx4.png)

如果我们在移动数据的时候监测质心的变化会发生什么呢？

<video src="https://blog-r2.jw1.dev/RVpGMhV8MD_KYlmb.mp4" autoplay playsinline muted loop controls></video>

可以看到，当线条在某一方向更加集中时，质心离原点距离越远，当所有的正弦波在某个方向上完全重叠时，记录表上会出现一个峰值，这就可以理解为是当前波形中最突出的频率。

如果我们需要计算峰值频率，则需要代入**采样率**和**数据节点长度**以及当前转动的**圈数**，最后我们对 X 轴数据进行重新分布，则会得到以下结果：

![](https://blog-r2.jw1.dev/6q9Eg9tWRvJNl5Sc.png)

<video src="https://blog-r2.jw1.dev/e5hcP5iopg1ozzAf.mp4" autoplay playsinline muted loop controls></video>

经过计算之后可得，峰值频率为 375Hz，与我们生成的正弦波频率完全一致！这个方法这么精确的吗？再生成一段 15017Hz 的正弦波试试：

![](https://blog-r2.jw1.dev/qVbKa1vSE0l0pDIL.png)

计算得出峰值频率为 16000Hz，误差还是有点大的，这是因为在对比中，样本数据的每一次提前操作，对比圈数都是指数递增的，这会导致我们在记录低频时的信息密度比高频的大很多，如果我们像之前正弦波扫描那样提升对比圈数的精度，那么最后我们也可以得到一幅非常精准的频谱图。

### 真正的傅里叶变换

真正的傅里叶变换其实可以想象为两个方法的结合，我们可以看下面的代码（[https://gist.github.com/anonymous/129d477ddb1c8025c9ac](https://gist.github.com/anonymous/129d477ddb1c8025c9ac)）：

```javascript
Fourier.Transform = function (data) {
  var N = data.length;
  var frequencies = [];

  // for every frequency...
  for (var freq = 0; freq < N; freq++) {
    var re = 0;
    var im = 0;

    // for every point in time...
    for (var t = 0; t < N; t++) {
      // Spin the signal _backwards_ at each frequency (as radians/s, not Hertz)
      var rate = -1 * (2 * Math.PI) * freq;

      // How far around the circle have we gone at time=t?
      var time = t / N;
      var distance = rate * time;

      // datapoint * e^(-i*2*pi*f) is complex, store each part
      var re_part = data[t] * Math.cos(distance);
      var im_part = data[t] * Math.sin(distance);

      // add this data point's contribution
      re += re_part;
      im += im_part;
    }

    // Close to zero? You're zero.
    if (Math.abs(re) < 1e-10) {
      re = 0;
    }
    if (Math.abs(im) < 1e-10) {
      im = 0;
    }

    // Average contribution at this frequency
    re = re / N;
    im = im / N;

    frequencies[freq] = {
      re: re,
      im: im,
      freq: freq,
      amp: Math.sqrt(re * re + im * im),
      phase: (Math.atan2(im, re) * 180) / Math.PI, // in degrees
    };
  }

  return frequencies;
};
```

第一次循环相当于是在生成整个频谱图上所需要的频率用于对比，第二次循环则是针对原始波形进行解构，只不过这种解构是在复数平面（由实数与虚数构成的坐标体系）完成的，而复数平面可以理解为极坐标与直角坐标的结合体。傅里叶变换还保留了声音信号的相位信息，这对于重构时域信息是非常重要的。我们来看看一个标准的傅里叶变换所产出的 440hz 频谱图吧！

![](https://blog-r2.jw1.dev/3AIwtfzVpA0SuU5p.png)

可以看到，这张图和我们使用正弦波扫描得到的图几乎一模一样！

### 意外收获

在理解傅里叶变换的同时，也有了一些意外收获：

1. 采样率的大小决定了音质，这一点搞音乐的都知道，但是它也同时决定了一段音频能记录的最高频率，或者说两个数据节点之间的最小距离，这也是为什么 44.1KHz 采样率成为了 CD 时代的标准采样率，因为它能记录最高 22050Hz 的频率，而一般认为人耳最高能捕捉的声音也差不多是在 20000Hz 左右。所以，发烧友圈内所说的音质也全都是在此范围内的音质，如果哪天有人告诉你他能听出 48KHz 和 44.1KHz 采样率的区别，他在骗你！
2. 傅里叶变换给出的频率信息过于平均，图像上表现出来的和人耳关注到的真实频率变化反而出入比较大，说人话就是：你对低频率的感知能力更强。在一些需要关注可视化的情况下我们需要改变数据分布模式或者针对人耳专门设计出一个频率分析算法，而不是死磕傅里叶变换。
3. ECharts 图表控件中，轴上的数据都支持对数分布。（😅 费老劲写的对数分布方法瞬间不香了）

---

好了，关于傅里叶变换就说到这里，再次感叹，学海无涯啊！

最后，感谢 3Blue1Brown 的视频和 Better Explained 的博客：

1. https://www.youtube.com/watch?v=spUNpyF58BY
2. https://betterexplained.com/articles/an-interactive-guide-to-the-fourier-transform/
