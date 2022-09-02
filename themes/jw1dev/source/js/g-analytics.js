(function () {
  let url = 'https://www.googletagmanager.com/gtag/js?id=G-1H0PBGR814'
  let userNotified = localStorage.getItem('userNotified')
  
  let insertScript = function () {
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
  
  if (userNotified) {
    insertScript()
  } else {
    let userDenied = document.getElementById('userDenied')
    let userPermitted = document.getElementById('userPermitted')
    
    userPermitted.addEventListener('click', function () {
      insertScript()
      localStorage.setItem('userNotified', '1')
      userPermitted.innerHTML = '🥰'
      userPermitted.setAttribute('disabled', 'disabled')
      setTimeout(function () {
        document.body.classList.remove('show-analytics-notification')
      }, 1500)
    })
    
    userDenied.addEventListener('click', function () {
      userDenied.innerHTML = '🥲'
      userDenied.setAttribute('disabled', 'disabled')
      setTimeout(function () {
        document.body.classList.remove('show-analytics-notification')
      }, 1500)
    })
    
    setTimeout(function () {
      document.body.classList.add('show-analytics-notification')
    }, 1000)
  }
})()