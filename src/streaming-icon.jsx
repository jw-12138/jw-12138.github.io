export default function StreamingIcon() {

  function randomAnimation(key){
    let animation = `@keyframes ${key} {
      ###ANIMATION###
    }`

    let frames = 100
    let animationFrames = []

    for (let i = 0; i < frames; i++) {
      let height = Math.floor(Math.random() * 10)

      if(height < 3){
        height = 3
      }

      animationFrames.push(`${i}% { height: ${height}px }`)
    }

    animation = animation.replace('###ANIMATION###', animationFrames.join('\n'))

    let style = document.createElement('style')
    style.id = key
    style.innerHTML = animation
    document.head.appendChild(style)
  }

  for (let i = 0; i < 5; i++) {
    randomAnimation(`streaming-icon-${i}`)
  }

  return <>
    <div class="w-6 h-4 flex items-center">
      {
        Array(5).fill(0).map((_, i) => {
          let animation = `streaming-icon-${i} linear 12s infinite`
          return <div class="w-[2px] bg-black/80 dark:bg-white/80 mr-[1px] rounded min-h-[3px]" style={`animation: ${animation}`}></div>
        })
      }
    </div>
  </>
}
