import useStore from './Store.jsx'
import {createSignal} from 'solid-js'
import {auth_api, client_id} from './utils.jsx'

const [store, setStore] = useStore()

const authUrl = `${auth_api}?client_id=${client_id}&redirect_uri=https://blog-api-cf-worker.jw1.dev/gh/cb?r=${location.href}`

function LoginPanel() {
  // popup
  let [userActionWindow, setUserActionWindow] = createSignal(false)

  window.addEventListener('click', function () {
    if (store.mouseIsInsideWindow === false) {
      setUserActionWindow(false)
    }
  })

  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (userActionWindow()) {
        setUserActionWindow(false)
      }
    }
  })

  /**
   * go to user GitHub page
   */
  function goToUser() {
    location.href = store.user.html_url
  }

  /**
   * go to log in
   */
  function login() {
    location.href = authUrl
  }

  /**
   * log out
   * @returns {boolean}
   */
  function logout() {
    let c = confirm('确定要退出登录吗？😯')
    if (!c) {
      return false
    }

    localStorage.clear()
    setStore('isUserLoggedIn', false)
    setStore('user', {})
    setStore('sending_comment', false)
    setUserActionWindow(false)
    setStore('mouseIsInsideWindow', false)
    setStore('reactingCommentID', [])
    setStore('listingReactionCommentId', null)
  }

  return <>
    {
      !store.gettingUser &&
      <section data-name="login">
        <div class="text-center relative h-[32px]">
          {userActionWindow() &&
            <div
              onMouseEnter={() => setStore('mouseIsInsideWindow', true)}
              onMouseLeave={() => setStore('mouseIsInsideWindow', false)}
              className="border absolute w-[200px] px-2 py-2 rounded-[1rem] dark:bg-neutral-800 bg-white left-1/2 bottom-[37px] popup-border"
              style={{
                transform: 'translateX(-50%)',
                animation: 'slideUp_offset .15s ease'
              }}
            >
              <button
                className="text-xs px-2 py-2 text-center dark:hover:bg-white/10 hover:bg-black/10 w-full rounded-[.5rem] flex items-center justify-center"
                onClick={goToUser}>
                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-brand-github w-4 h-4 mr-2"
                     viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
                     stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                  <path
                    d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5"/>
                </svg>
                我的 GitHub 主页
              </button>

              <button
                className="text-xs px-2 py-2 text-center hover:bg-red-500 hover:text-white focus:bg-red-500 focus:text-white w-full rounded-[.5rem] flex items-center justify-center"
                onClick={logout}>
                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-logout w-4 h-4 mr-2"
                     viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
                     stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                  <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2"/>
                  <path d="M9 12h12l-3 -3"/>
                  <path d="M18 15l3 -3"/>
                </svg>
                退出登录
              </button>
            </div>
          }

          <div
            onMouseEnter={() => setStore('mouseIsInsideWindow', true)}
            onMouseLeave={() => setStore('mouseIsInsideWindow', false)}
            className="user-window dark:bg-neutral-800 bg-neutral-100 h-[32px] items-center inline-block border-none relative z-10 rounded-full hover:shadow-xl transition-all ">
            {store.isUserLoggedIn &&
              <button
                className="flex h-[32px] items-center border-none cursor-pointer select-none rounded-full"
                onClick={() => setUserActionWindow(!userActionWindow())}
                onFocus={() => setStore('mouseIsInsideWindow', true)}
                onBlur={() => setStore('mouseIsInsideWindow', false)}>

                <span className="w-[32px] h-[32px] overflow-hidden rounded-full">
                  <img
                    src={store.user.avatar_url ? (store.user.avatar_url + '&s=64') : ''}
                    alt="user avatar"
                    className="w-full h-full"/>
                </span>
                <span
                  className="text-sm pl-2 pr-2">
                  {store.user.login}
                </span>
                <span className="pr-2">
                  {
                    !userActionWindow() &&
                    <svg xmlns="http://www.w3.org/2000/svg"
                         className="icon icon-tabler icon-tabler-selector w-4 h-4" viewBox="0 0 24 24" stroke-width="2"
                         stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                      <path stroke="none"
                            d="M0 0h24v24H0z"
                            fill="none"/>
                      <path
                        d="M8 9l4 -4l4 4"/>
                      <path d="M16 15l-4 4l-4 -4"/>
                    </svg>
                  }

                  {
                    userActionWindow() &&
                    <svg xmlns="http://www.w3.org/2000/svg"
                         className="icon icon-tabler icon-tabler-x w-4 h-4" viewBox="0 0 24 24" stroke-width="2"
                         stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                      <path stroke="none"
                            d="M0 0h24v24H0z"
                            fill="none"/>
                      <path
                        d="M18 6l-12 12"/>
                      <path d="M6 6l12 12"/>
                    </svg>
                  }
                </span>
              </button>}
          </div>
        </div>

        {!store.isUserLoggedIn &&
          <button onClick={login}
                  className="text-sm px-8 py-2 rounded-full dark:bg-white dark:text-black flex items-center mx-auto bg-neutral-800 text-white shadow-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mr-2" viewBox="0 0 24 24" stroke-width="2"
                 stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path
                d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5"/>
            </svg>
            登录以发表评论
          </button>
        }

      </section>
    }
  </>
}

export default LoginPanel
