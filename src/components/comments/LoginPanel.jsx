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
    let c = confirm('Are you sure?😯')
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
              class="border absolute w-[200px] px-2 py-2 rounded-[1rem] dark:bg-neutral-800 bg-white left-1/2 bottom-[37px] popup-border hover:shadow-xl transition-shadow"
              style={{
                transform: 'translateX(-50%)',
                animation: 'slideUp_offset .15s ease'
              }}
            >
              <button
                class="text-xs px-2 py-2 text-center dark:hover:bg-white/10 hover:bg-black/10 hover:shadow w-full rounded-[.5rem] flex items-center justify-center"
                onClick={goToUser}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="w-4 h-4 mr-2" fill="currentColor">
                  <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
                </svg>
                My GitHub Page
              </button>

              <button
                class="text-xs px-2 py-2 text-center hover:bg-red-500 hover:text-white hover:shadow focus:bg-red-500 focus:text-white w-full rounded-[.5rem] flex items-center justify-center"
                onClick={logout}>
                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-logout w-4 h-4 mr-2"
                     viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
                     stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                  <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2"/>
                  <path d="M9 12h12l-3 -3"/>
                  <path d="M18 15l3 -3"/>
                </svg>
                Logout
              </button>
            </div>
          }

          <div
            onMouseEnter={() => setStore('mouseIsInsideWindow', true)}
            onMouseLeave={() => setStore('mouseIsInsideWindow', false)}
            class="user-window dark:bg-neutral-800 bg-neutral-100 h-[32px] items-center inline-block border-none relative z-10 rounded-full hover:shadow-xl transition-all ">
            {store.isUserLoggedIn &&
              <button
                class="flex h-[32px] items-center border-none cursor-pointer select-none rounded-full"
                onClick={() => setUserActionWindow(!userActionWindow())}
                onFocus={() => setStore('mouseIsInsideWindow', true)}
                onBlur={() => setStore('mouseIsInsideWindow', false)}>

                <span class="w-[32px] h-[32px] overflow-hidden rounded-full">
                  <img
                    src={store.apiBase + '/cache/avatar/' + store.user.id}
                    alt="user avatar"
                    class="w-full h-full"/>
                </span>
                <span
                  class="text-sm pl-2 pr-2">
                  {store.user.login}
                </span>
                <span class="pr-2">
                  {
                    !userActionWindow() &&
                    <svg xmlns="http://www.w3.org/2000/svg"
                         class="icon icon-tabler icon-tabler-selector w-4 h-4" viewBox="0 0 24 24" stroke-width="2"
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
                         class="icon icon-tabler icon-tabler-x w-4 h-4" viewBox="0 0 24 24" stroke-width="2"
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
          <div class="text-center">
            <button onClick={login}
                    id={'loginWithGitHub'}
                    class="text-sm px-8 py-2 rounded-full dark:bg-white dark:text-black flex items-center mx-auto bg-neutral-800 text-white shadow-2xl">
              Login with
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 16" class="h-4 mx-1" fill="currentColor">
                <path
                  d="M8.81 7.35v5.74c0 .04-.01.11-.06.13 0 0-1.25.89-3.31.89-2.49 0-5.44-.78-5.44-5.92S2.58 1.99 5.1 2c2.18 0 3.06.49 3.2.58.04.05.06.09.06.14L7.94 4.5c0 .09-.09.2-.2.17-.36-.11-.9-.33-2.17-.33-1.47 0-3.05.42-3.05 3.73s1.5 3.7 2.58 3.7c.92 0 1.25-.11 1.25-.11v-2.3H4.88c-.11 0-.19-.08-.19-.17V7.35c0-.09.08-.17.19-.17h3.74c.11 0 .19.08.19.17Zm35.85 2.33c0 3.43-1.11 4.41-3.05 4.41-1.64 0-2.52-.83-2.52-.83s-.04.46-.09.52c-.03.06-.08.08-.14.08h-1.48c-.1 0-.19-.08-.19-.17l.02-11.11c0-.09.08-.17.17-.17h2.13c.09 0 .17.08.17.17v3.77s.82-.53 2.02-.53l-.01-.02c1.2 0 2.97.45 2.97 3.88ZM27.68 2.43c.09 0 .17.08.17.17v11.11c0 .09-.08.17-.17.17h-2.13c-.09 0-.17-.08-.17-.17l.02-4.75h-3.31v4.75c0 .09-.08.17-.17.17h-2.13c-.08 0-.17-.08-.17-.17V2.6c0-.09.08-.17.17-.17h2.13c.09 0 .17.08.17.17v4.09h3.31V2.6c0-.09.08-.17.17-.17Zm8.26 3.64c.11 0 .19.08.19.17l-.02 7.47c0 .09-.06.17-.17.17H34.6c-.07 0-.14-.04-.16-.09-.03-.06-.08-.45-.08-.45s-1.13.77-2.52.77c-1.69 0-2.92-.55-2.92-2.75V6.25c0-.09.08-.17.17-.17h2.14c.09 0 .17.08.17.17V11c0 .75.22 1.09.97 1.09s1.3-.39 1.3-.39V6.26c0-.11.06-.19.17-.19Zm-17.406 5.971h.005a.177.177 0 0 1 .141.179v1.5c0 .07-.03.14-.09.16-.1.05-.74.22-1.27.22-1.16 0-2.86-.25-2.86-2.69V8.13h-1.11c-.09 0-.17-.08-.17-.19V6.58c0-.08.05-.15.13-.17.07-.01 1.16-.28 1.16-.28V3.96c0-.08.05-.13.14-.13h2.16c.09 0 .14.05.14.13v2.11h1.59c.08 0 .16.08.16.17v1.7c0 .11-.07.19-.16.19h-1.59v3.131c0 .47.27.83 1.05.83.247 0 .481-.049.574-.05ZM12.24 6.06c.09 0 .17.08.17.17v7.37c0 .18-.05.27-.25.27h-1.92c-.17 0-.3-.07-.3-.27V6.26c0-.11.08-.2.17-.2Zm29.99 3.78c0-1.81-.73-2.05-1.5-1.97-.6.04-1.08.34-1.08.34v3.52s.49.34 1.22.36c1.03.03 1.36-.34 1.36-2.25ZM11.19 2.68c.75 0 1.36.61 1.36 1.38 0 .77-.61 1.38-1.36 1.38-.77 0-1.38-.61-1.38-1.38 0-.77.61-1.38 1.38-1.38Zm7.34 9.35v.001l.01.01h-.001l-.005-.001v.001c-.009-.001-.015-.011-.024-.011Z"></path>
              </svg>
            </button>
          </div>
        }

      </section>
    }
  </>
}

export default LoginPanel
