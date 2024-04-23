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

    if (store.commentActionDropdown && !store.deletingId) {
      setStore('commentActionDropdown', '')
    }
  })

  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (userActionWindow()) {
        setUserActionWindow(false)
      }

      if (store.commentActionDropdown && !store.deletingId) {
        setStore('commentActionDropdown', '')
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
              className="border absolute w-[200px] px-2 py-2 rounded-[1rem] dark:bg-neutral-800 bg-white left-1/2 bottom-[37px] popup-border hover:shadow-xl transition-shadow"
              style={{
                transform: 'translateX(-50%)',
                animation: 'slideUp_offset .15s ease'
              }}
            >
              <button
                className="text-xs px-2 py-2 text-center dark:hover:bg-white/10 hover:bg-black/10 hover:shadow w-full rounded-[.5rem] flex items-center justify-center"
                onClick={goToUser}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="w-4 h-4 mr-2" fill="currentColor">
                  <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
                </svg>
                我的 GitHub 主页
              </button>

              <button
                className="text-xs px-2 py-2 text-center hover:bg-red-500 hover:text-white hover:shadow focus:bg-red-500 focus:text-white w-full rounded-[.5rem] flex items-center justify-center"
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
                    src={store.apiBase + '/cache/avatar/' + store.user.id}
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
          <div className="text-center">
            <button onClick={login}
                    className="text-sm px-8 py-2 rounded-full dark:bg-white dark:text-black flex items-center mx-auto bg-neutral-800 text-white shadow-2xl">
              使用
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" className="w-4 h-4 mx-1" fill="currentColor" aria-label="GitHub">
                <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
              </svg>
              登录
            </button>
          </div>
        }

      </section>
    }
  </>
}

export default LoginPanel
