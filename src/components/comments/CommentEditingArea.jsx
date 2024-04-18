import {Show} from 'solid-js'
import useStore from './Store.jsx'
import {githubApi, owner, repo} from './utils.jsx'

const [store, setStore] = useStore()

function commentEditingArea(props) {
  const {comment} = props

  /**
 * confirm and submit edited comment
 * @returns {Promise<void>}
 */
async function confirmEditing() {
  let id = store.editingCommentId
  let content = store.editingCommentContent

  if (!id) {
    // reset
    setStore('editingCommentId', '')
    setStore('editingCommentContent', '')
    return
  }

  if (!content) {
    alert('评论内容不能为空哦')
    return
  }

  if (store.submittingEditedComment) {
    return
  }

  let endpoint = `/repos/${owner}/${repo}/issues/comments/${id}`

  let resp

  try {
    setStore('submittingEditedComment', true)
    resp = await githubApi(endpoint, {
      method: 'PATCH',
      body: JSON.stringify({
        body: content
      })
    })
  } catch (e) {
    console.log(e)
    alert('编辑失败，再试一次？')
  } finally {
    setStore('submittingEditedComment', false)
  }

  if (!resp.ok) {
    alert('编辑失败，再试一次？')
    return
  }

  if (resp.status === 200) {
    setStore('editingCommentId', '')
    setStore('editingCommentContent', '')
    setStore('shouldUpdateCommentId', id)
  }
}

  return <>
    <Show when={store.editingCommentId === comment.id}>
      <div class="mt-2" data-name="edit area">
        <form
          action="javascript:"
          onsubmit={confirmEditing}>
          <div>
        <textarea
          class="rounded-2xl block px-4 py-4 font-mono border-none focus:shadow-2xl dark:bg-neutral-800 bg-zinc-100 w-full resize-y min-h-[6rem] text-sm rounded-br-[6px]"
          required
          value={store.editingCommentContent}
          oninput={(e) => setStore('editingCommentContent', e.target.value)}
          id="comment_editing_textarea"
        ></textarea>
          </div>
          <div class="mt-2 flex">
            <button
              type="button"
              onclick={() => {
                setStore('editingCommentId', '')
                setStore('editingCommentContent', '')
              }}
              disabled={store.submittingEditedComment}
              class="rounded-full text-sm dark:bg-neutral-700 bg-neutral-200 px-4 py-2 flex items-center disabled:opacity-50">
              <svg
                xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-x w-4 h-4 mr-1"
                viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
                stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M18 6l-12 12"/>
                <path d="M6 6l12 12"/>
              </svg>
              取消
            </button>
            <button
              type="submit"
              disabled={store.submittingEditedComment}
              class="rounded-full text-sm dark:bg-white dark:text-black bg-neutral-800 text-white px-4 py-2 flex items-center ml-2 disabled:opacity-50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon icon-tabler icon-tabler-loader-2 animate-spin w-4 h-4 mr-1" classList={{
                'hidden': !store.submittingEditedComment,
                'block': store.submittingEditedComment
              }} viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
                stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M12 3a9 9 0 1 0 9 9"/>
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-check w-4 h-4 mr-1"
                   classList={{
                     'hidden': store.submittingEditedComment,
                     'block': !store.submittingEditedComment
                   }} viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
                   stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M5 12l5 5l10 -10"/>
              </svg>
              确认编辑
            </button>
          </div>
        </form>
      </div>

    </Show>

  </>
}

export default commentEditingArea
