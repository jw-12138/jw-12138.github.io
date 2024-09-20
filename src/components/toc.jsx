import {createSignal, For, onMount} from 'solid-js'

function TOC(props) {
  const {headings} = props

  let [maxDepth, setMaxDepth] = createSignal(6)
  let [slugPositionMap, setSlugPositionMap] = createSignal({})

  function findMaxDepth() {
    if (headings.length === 0) {
      return 0
    }

    headings.map(el => {
      if (el.depth < maxDepth()) {
        setMaxDepth(el.depth)
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
        top: dom.offsetTop - 20,
        behavior: 'smooth'
      })
    }
  }

  function getPositionForEachSlug() {
    let windowScrollTop = document.documentElement.scrollTop || document.body.scrollTop
    let windowHeight = document.documentElement.clientHeight || document.body.clientHeight
    headings.map((el, index) => {
      const slug = el.slug
      try {
        const dom = document.getElementById(slug)
        const top = dom.offsetTop
        let nextHeadingTop
        if (headings[index + 1]) {
          nextHeadingTop = document.getElementById(headings[index + 1].slug).offsetTop
        } else {
          nextHeadingTop = document.querySelector('.page-content').offsetHeight + 156
        }

        let range = [top - windowScrollTop, nextHeadingTop - windowScrollTop]
        let isInView = range[0] < windowHeight && range[1] > 0
        let sectionHeight = range[1] - range[0]
        let progress = (windowHeight - range[0]) / sectionHeight

        if (progress < 0) {
          progress = 0
        }

        if (progress > 1) {
          progress = 1
        }

        let obj = {
          isInView,
          progress
        }

        setSlugPositionMap({
          ...slugPositionMap(),
          [slug]: obj
        })
      } catch (e) {

      }
    })
  }

  onMount(async () => {
    try {
      document.getElementById('fake_toc').remove()
    } catch (e) {
      console.log(e)
    }

    await new Promise(resolve => setTimeout(resolve, 100))
    findMaxDepth()
    getPositionForEachSlug()

    setInterval(() => {
      getPositionForEachSlug()
    }, 1000 / 10)

    window.addEventListener('scroll', getPositionForEachSlug)
  })

  return (<>
      <div class="lg:block hidden relative left-[-.5rem]">
        <button aria-label="返回顶部"
                class="px-2 py-1 rounded-xl hover:bg-black/15 dark:hover:bg-white/15 transition-all w-8 h-8 flex justify-center items-center mb-1 cursor-pointer opacity-70 hover:opacity-100"
                onClick={goBackToTop}
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-navigation-up" width="24" height="24"
               viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
               stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path
              d="M16.54 12.843l-4.54 -9.843l-7.97 17.275c-.07 .2 -.017 .424 .135 .572c.15 .148 .374 .193 .57 .116l7.265 -2.463"/>
            <path d="M19 22v-6"/>
            <path d="M22 19l-3 -3l-3 3"/>
          </svg>
        </button>
        <For each={headings}>
          {(heading, index) => {
            return <button
              onClick={() => scrollToSlug(heading.slug)}
              title={heading.text}
              class="text-xs max-w-full cursor-pointer hover:bg-black/15 dark:hover:bg-white/15 px-2 transition-all duration-300 w-full text-left relative border flex border-none items-center"
              data-is-in-view={slugPositionMap()[heading.slug]?.isInView}
              classList={{
                'rounded-t-2xl hover:rounded-b-0 pt-[0rem]': (!headings[index() - 1]) || (headings[index() - 1] && !slugPositionMap()[headings[index() - 1].slug]?.isInView),
                'rounded-b-2xl hover:rounded-t-0 pb-[0rem]': (!headings[index() + 1]) || (headings[index() + 1] && !slugPositionMap()[headings[index() + 1].slug]?.isInView),
                'text-black dark:text-white opacity-1 bg-black/10 dark:bg-white/10': slugPositionMap()[heading.slug]?.isInView,
                'opacity-70 hover:rounded-2xl pt-[0] pb-[0]': !slugPositionMap()[heading.slug]?.isInView
              }}
            >
            <span class="overflow-hidden py-[.2rem] flex items-center h-7">
              <For each={Array.from({
                length: heading.depth - maxDepth()
              })}>
                {(_, i) => {
                  return <span
                    class="w-[0rem] h-[2.5rem] flex-shrink-0 block dark:border-l-white/20 border-l-black/20 transition-all pointer-events-none"
                    style={{
                      'animation-delay': `${i() * 75}ms`,
                      'border-left-width': '1px',
                      'animation-name': 'widthExpand',
                      'animation-duration': 'var(--spring-duration)',
                      'animation-fill-mode': 'forwards',
                      'animation-timing-function': 'var(--spring-easing)'
                    }}
                  ></span>
                }}
              </For>

              <span class="block text-ellipsis whitespace-nowrap overflow-hidden">
                {heading.text}
              </span>
            </span>

              <span class="block absolute left-[-.5rem] w-[2px] dark:bg-white bg-neutral-900 top-[5%] rounded" style={
                {
                  height: slugPositionMap()[heading.slug]?.progress * 90 + '%',
                  opacity: slugPositionMap()[heading.slug]?.isInView ? 1 : 0.5
                }
              }>

            </span>
            </button>
          }}
        </For>
      </div>
    </>
  )
}

export default TOC
