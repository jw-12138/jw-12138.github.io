import useStore from './comments/Store.jsx'

const [store, setStore] = useStore()

export default function PhotoCommentButton(props) {
  const {url, alt} = props
  return <>
    <div className="flex pb-2 w-full justify-center items-center flex-wrap mt-0 lg:mt-[-6rem]">
      <button
        className="flex items-center text-sm dark:bg-white bg-black text-white rounded-3xl dark:text-black px-4 py-1 transition-opacity lg:opacity-0 lg:group-hover:opacity-100 opacity-100 backdrop-blur"
        data-role="addComment"
        data-url={url}
        data-alt={alt}
        onClick={() => handleCommentButtonClick(url, alt)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-message-plus mr-1">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <path d="M8 9h8"/>
          <path d="M8 13h6"/>
          <path d="M12.01 18.594l-4.01 2.406v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v5.5"/>
          <path d="M16 19h6"/>
          <path d="M19 16v6"/>
        </svg>
        添加评论
      </button>
    </div>
  </>
}

function handleCommentButtonClick(url, alt) {
  if (!store.isUserLoggedIn) {
    document.querySelector('#loginWithGitHub').scrollIntoView()
    alert('请先登录哦')
    return false
  }

  setStore('userComment', store.userComment + `> ![${alt}](${url})\n\n`)
  document.querySelector('#comment_textarea').focus()
}
