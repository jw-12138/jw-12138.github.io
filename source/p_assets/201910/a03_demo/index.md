---
layout: demo
title: "使用JavaScript达成 background-size: cover 的效果"
---

<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  .test {
    height: 300px;
    padding: 30px 20px;
    overflow: hidden;
    max-width: 1000px;
    margin: 0 auto;
    color: #fff;
    background-color: #333;
  }
  
  .test .content {
    position: relative;
    z-index: 2;
  }
  
  .test._2 {
    background-size: cover;
    background-image: url(test.jfif);
    background-position: center center;
  }
  
  h4 {
    max-width: 1000px;
    margin: 0 auto;
    padding: 30px 0;
  }
</style>

<div class="test" id="test">
  <img src="/p_assets/201910/a03_demo/test.jfif" alt="" id="test_img">
  <div class="content">
    JavaScript cover
  </div>
</div>
<div class="test _2">
  CSS cover
</div>
<script type="text/javascript" src="/p_assets/201910/a03_demo/kkkover.dev.js"></script>
<script type="text/javascript">
  window.onload = function () {
    kkkover({
      wrapCell: document.getElementById('test'),
      img: document.getElementById('test_img')
    });
  }
</script>