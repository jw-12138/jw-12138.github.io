---
layout: ../../layouts/post-layout.astro
title: 简单对比一下Bun与NodeJs的性能
date: 2023-09-11
issue: 97
tags:
  - JavaScript
  - Runtime
  - NodeJs
  - Bun
---

2023 年 9 月 8 日，Bun.js 发出了第一个稳定版本：Bun 1.0

> Bun 1.0 is finally here.
>
> Bun is a fast, all-in-one toolkit for running, building, testing, and debugging JavaScript and TypeScript, from a single file to a full-stack application. Today, Bun is stable and production-ready.
>
> …
>
> Bun is a drop-in replacement for Node.js. That means existing Node.js applications and npm packages _just work_ in Bun.

根据官网的描述来看，Bun 是一个多合一的 JS 工具箱，其中包括运行、构建和调试 JS 和 TS 代码，也就是和 NodeJS、Deno 一样，同样属于 JS 的运行时，不过 NodeJS 已称霸江湖多时，而 Deno 却一直不温不火，就在我们以为 NodeJs 将会一直稳坐王位的时候，前几天这个突然印入眼帘的家伙，Bun，貌似在圈中产生了巨大的讨论，目前看下来，究其原因，一个是基本完全兼容 NodeJs，官方用词为“drop-in”，我在这里翻译为“无脑”，是的，无脑替换 NodeJs。还有一个就是讨论声最大的——性能。

### API Serving 性能对比

首先我能想到最常见的场景就是 API serving，通过 NodeJs 的 http 模块和 Bun 的 Serve 模块，我做了两个功能一摸一样的 API，GET 的时候返回“Hello World”：

```js
// NodeJS
import http from 'http'

const server = http.createServer((req, res) => {
  res.end('Hello World')
})

server.listen(7900, 'localhost', () => {
  console.log('NodeJs server started at http://localhost:7900')
})
```

```js
// Bun
Bun.serve({
  fetch(req) {
    return new Response('Hello world')
  },
  port: 7901
})

console.log('Bun server started at http://localhost:7901')
```

两边写法不是很一样，但是基本上都用很短的代码就完成了一个简单的 API，那么测试的代码我们这样写：

```js
let test_subject = 'Node.js' // 或 Bun
let endpoint = 'http://localhost:7900' // 或 7901

// 两次测试以下代码完全一样
let count = 1000
let start = Date.now()
let err_count = 0

console.log('\n========')
console.log(`${count} hello-world api running through ${test_subject}`)

while (count > 0) {
  let res = await fetch(endpoint)
  await res.text()
  count--
}

let end = Date.now()

console.log(`Took ${end - start}ms.`)
console.log(`Got ${err_count} errors.`)
console.log('========\n')
```

![NodeJs API response speed test](https://r2-api-blog.jw1dev.workers.dev/c324dc23fd78447185d7744f95d0f32a/Untitled.png)

NodeJs 这边三次测试，每次调用 1000 次 API，平均大概在 300ms 左右。再来看看 Bun 这边：

![Bun API response speed test](https://r2-api-blog.jw1dev.workers.dev/c324dc23fd78447185d7744f95d0f32a/Untitled_1.png)

基本维持在 80ms 左右，也就是说，在这个测试中，Bun 的速度比 NodeJS 快大概 3.75 倍。

### 加密性能测试

在 API 测试中我们看到，Bun 的速度确实是要比 NodeJs 快的，现在我们再来看看加密的速度是不是有区别：

```js
import AES from 'crypto-js/aes.js'

let test_subject = 'Bun.js' // 或 NodeJs

// 两次测试以下代码完全一样
let count = 10000
let start = Date.now()
console.log('\n========')
console.log(`${count} AES encryptions running through ${test_subject}`)

while (count > 0) {
  let ciphertext = AES.encrypt('my message', 'secret key 123').toString()
  count--
}

let end = Date.now()

console.log(`Took ${end - start}ms.`)
console.log('========\n')
```

![NodeJs Encryption speed test](https://r2-api-blog.jw1dev.workers.dev/c324dc23fd78447185d7744f95d0f32a/Untitled_2.png)

NodeJs 这边 1 万次 AES 加密消耗时间大约在 650ms，再来看看 Bun 这边：

![Bun Encryption speed test](https://r2-api-blog.jw1dev.workers.dev/c324dc23fd78447185d7744f95d0f32a/Untitled_3.png)

基本在 140ms 左右，在以上测试中我们也看到了，Bun 的速度确实是比 NodeJS 要快的，难道 NodeJs 真的就是被完爆吗？

只能说，不完全是。

### 算数性能测试

我们使用程序随机生成两个数字 a 和 b，再去计算 a 的 b 平方，分别计算 1 亿次。

```js
let a = Math.random()
let b = Math.random()

let start = Date.now()
let count = 100000000

console.log('\n========')
console.log(`${count} Math.pow() running through NodeJs`)

while (count > 0) {
  Math.pow(a, b)
  count--
}

let end = Date.now()

console.log(`Took ${end - start}ms.`)
console.log('========\n')
```

运行之后来看看 NodeJs 这边的结果：

![NodeJs Math speed test](https://r2-api-blog.jw1dev.workers.dev/c324dc23fd78447185d7744f95d0f32a/Untitled_4.png)

基本维持在 60ms，再来看看 Bun：

![Bun Math speed test](https://r2-api-blog.jw1dev.workers.dev/c324dc23fd78447185d7744f95d0f32a/Untitled_5.png)

Bun 居然还比 NodeJs 慢了 40ms。

🥲

怎么说呢，以我的智商想要给你们解释这件事情……还是太难为我了，我猜大概率还是因为底层 JS 引擎不同导致的（Bun 使用 Safari 的 Js core，NodeJs 使用 Chrome 的 V8），不过 1 亿次计算，40ms 的差距貌似在生产环境中看起来也不是那么明显，毕竟是第一个稳定版本嘛，相信后面 Bun 团队应该会解决的！

### 我的想法

就在我基本拥抱 Serverless 的时候，Bun 出现了，一开始我会觉得它的出现有点不是时候，但是亲自上手之后，可以说 Bun 又激起了我写 Server-ful App 的兴趣，不仅仅因为性能，更加是因为 Bun 的开发体验，很多经过重构的 API 简直美的不像话！

<br>

**读取文件**：

```js
const file = Bun.file('package.json')
const contents = await file.text()
```

<br>

**WebSocket**：

```js
Bun.serve({
  fetch() { ...
  },
  websocket: {
    open(ws) { ...
    },
    message(ws, data) { ...
    },
    close(ws, code, reason) { ...
    },
  },
});
```

综合来看，Bun 确实是比 NodeJs 要快的，而且是呈倍数的那种快，再加上几乎完美继承 NodeJs 的生态，真的非常看好这个运行时，期待 Bun 团队后面再整大活！
