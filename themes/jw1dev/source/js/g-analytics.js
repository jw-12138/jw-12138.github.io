(function () {
  let url = 'https://www.googletagmanager.com/gtag/js?id=G-1H0PBGR814'
  let userNotified = localStorage.getItem('userNotified')
  let userDenied = document.getElementById('userDenied')
  let userPermitted = document.getElementById('userPermitted')
  
  let insertScript = function () {
    markClickable()
    let box = document.querySelector('.analytics-note-box')
    setTimeout(function () {
      box.style.display = 'none'
    }, 3000)
    let script = document.createElement('script')
    script.src = url
    script.async = 'async'
    document.body.appendChild(script)
    
    script.addEventListener('load', function () {
      window.dataLayer = window.dataLayer || []
      
      function gtag() {
        dataLayer.push(arguments)
      }
      
      gtag('js', new Date())
      gtag('config', 'G-1H0PBGR814')
      console.log('Google Analytics Enabled, Thank you!')
    })
  }
  
  let markClickable = function () {
    userPermitted.setAttribute('disabled', 'disabled')
    userDenied.setAttribute('disabled', 'disabled')
  }
  
  if (userNotified) {
    insertScript()
  } else {
    userPermitted.addEventListener('click', function () {
      if(userPermitted.hasAttribute('disabled') || userDenied.hasAttribute('disabled')){
        return false
      }
      insertScript()
      localStorage.setItem('userNotified', '1')
      userPermitted.innerHTML = '🥰'
      setTimeout(function () {
        document.body.classList.remove('show-analytics-notification')
      }, 1500)
    })
    
    userDenied.addEventListener('click', function () {
      if(userPermitted.hasAttribute('disabled') || userDenied.hasAttribute('disabled')){
        return false
      }
      userDenied.innerHTML = '🥲'
      markClickable()
      setTimeout(function () {
        document.body.classList.remove('show-analytics-notification')
      }, 1500)
    })
    
    setTimeout(function () {
      document.body.classList.add('show-analytics-notification')
    }, 1000)
  }
})()