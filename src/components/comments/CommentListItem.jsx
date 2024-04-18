import dayjs from 'dayjs'
import useStore from './Store.jsx'
import CommentActionPanel from './CommentActionPanel.jsx'
import CommentEditingArea from './CommentEditingArea.jsx'
import CommentReactions from './CommentReactions.jsx'

const [store, setStore] = useStore()

function CommentListItem(props) {
  let comment = store.comments[props.index]

  function toggleCommentActionDropdown(id) {
    if (store.commentActionDropdown) {
      setStore('commentActionDropdown', '')
    } else {
      setStore('commentActionDropdown', id)
    }
  }

  /**
   * mention a user
   * @param username
   */
  function mention(username) {
    let space = ' '

    if (store.userComment[store.userComment.length - 1] === ' ' || store.userComment.length === 0) {
      space = ''
    }

    if (store.editingCommentId) {
      setStore('editingCommentContent', store.editingCommentContent + `${space}@${username} `)
      document.getElementById('comment_editing_textarea').focus()
      return
    }

    setStore('userComment', store.userComment + `${space}@${username} `)
    document.getElementById('comment_textarea').focus()
  }

  return <>
    <div className="item pt-8 py-8" id={comment.id} style={{
      opacity: store.deletingId === comment.id ? '.3' : '1'
    }}>
      <div className="user flex mt-2 w-full relative">
        <div className="outer-box flex justify-between w-full">
          <a href={comment.user.html_url} target="_blank" class="user-info flex items-center content-center text-sm">
            <img src={comment.user.avatar_url + '&s=64'} alt="用户头像" class="w-8 h-8 rounded-full mb-0 mr-2"/>
            <div>
              <span className="flex items-center">
                {comment.user.login}
                {
                  comment.author_association === 'OWNER' &&
                  <span
                    className="author-tag px-2 text-xs rounded-xl relative scale-90 dark:bg-neutral-700 bg-neutral-200 dark:text-neutral-200 text-neutral-800 top-[-.03rem] ml-1"
                  >作者</span>
                }
              </span>
              <div className="datetime text-[10px] opacity-70">
                {dayjs(comment.created_at).format('YYYY-MM-DD HH:mm')}
              </div>
            </div>
          </a>

          {
            (store.isUserLoggedIn && store.editingCommentId !== comment.id) &&
            <div className="comment-actions flex-shrink-0">
              <button
                classList={{
                  hidden: store.user.login !== comment.user.login
                }}
                aria-label="更多操作"
                class="dark:bg-neutral-800 bg-neutral-200 rounded-full w-8 h-8 overflow-hidden flex items-center justify-center"
                onclick={() => toggleCommentActionDropdown(comment.id)}
                onmouseenter={() => setStore('mouseIsInActionWindow', true)}
                onmouseleave={() => setStore('mouseIsInActionWindow', false)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-x w-4 h-4"
                  classList={{
                    'hidden': store.commentActionDropdown !== comment.id
                  }}
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                  <path
                    d="M18 6l-12 12"/>
                  <path d="M6 6l12 12"/>
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-dots w-4 h-4"
                  classList={{
                    hidden: store.commentActionDropdown === comment.id
                  }}
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                  <path
                    d="M5 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"/>
                  <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"/>
                  <path
                    d="M19 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"/>
                </svg>
              </button>
              <button
                aria-label={'提及这个用户'}
                class="h-[30px] leading-[28px] px-2 rounded-full bg-neutral-100 hover:bg-neutral-800 hover:text-white dark:bg-neutral-800 dark:text-white dark:hover:text-black dark:hover:bg-neutral-200 text-xs"
                onClick={() => mention(comment.user.login)}
                classList={{
                  hidden: store.user.login === comment.user.login
                }}>
                <svg xmlns="http://www.w3.org/2000/svg"
                     className="icon icon-tabler icon-tabler-at w-4 h-4" viewBox="0 0 24 24"
                     stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
                     stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                  <path
                    d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"/>
                  <path
                    d="M16 12v1.5a2.5 2.5 0 0 0 5 0v-1.5a9 9 0 1 0 -5.5 8.28"/>
                </svg>
              </button>
            </div>
          }
        </div>
        <CommentActionPanel comment={comment}></CommentActionPanel>
      </div>

      <div className="mt-2 flex items-center pb-8" classList={{
        hidden: comment.bodyHTML
      }}>
        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-loader-2 animate-spin"
             width="24"
             height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
             stroke-linecap="round"
             stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <path d="M12 3a9 9 0 1 0 9 9"/>
        </svg>
      </div>

      <div className="mt-2 page-content comment-content" style="padding-bottom: 0"
           innerHTML={comment.bodyHTML ? comment.bodyHTML : ''}
           classList={{
             hidden: store.editingCommentId === comment.id || !comment.bodyHTML
           }}>
      </div>
      <CommentEditingArea comment={comment}></CommentEditingArea>
      <CommentReactions comment={comment}></CommentReactions>
    </div>
  </>
}

export default CommentListItem
