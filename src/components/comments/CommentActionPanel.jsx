import useStore from './Store.jsx'
import {githubApi, owner, repo} from './utils.jsx'

const [store, setStore] = useStore()

async function deleteComment(id) {
  let c = confirm('Are you sure to delete this comment? 😯')
  if (!c) {
    return
  }

  setStore('deletingId', id)

  let resp

  try {
    resp = await githubApi(`/repos/${owner}/${repo}/issues/comments/${id}`, {
      method: 'DELETE'
    })
  } catch (e) {
    alert('failed, please try again later')
    console.log(e)
    return false
  } finally {
    setStore('deletingId', '')
  }

  if (resp.ok || resp.status === 404) {

    let el_height = document.getElementById(id).offsetHeight
    let animationTag = `<style id="${'del_' + id}">
@keyframes comment_delete_${id} {
  from {
    height: ${el_height}px;
    padding: 2rem 0;
    opacity: 0.3;
  }
  
  to {
    height: 0;
    padding: 0;
    opacity: 0.3;
  }
}
</style>`

    document.head.insertAdjacentHTML('beforeend', animationTag)

    let deleteIndex = store.comments.findIndex(c => c.id === id)
    setStore('comments', deleteIndex, 'aboutToGetDeleted', true)

    setTimeout(function () {
      setStore('comments', store.comments.filter(c => c.id !== id))
      document.getElementById('del_' + id).remove()
    }, 300)
  }
}

function CommentActionPanel(props) {
  let {comment} = props
  return <>
    {
      store.commentActionDropdown === comment.id &&
      <div
        data-name="more actions"
        class="absolute z-[500] top-[2.25rem] right-0 rounded-[1rem] dark:bg-neutral-800 px-2 py-2 bg-neutral-100 border-[1px] shadow-xl popup-border"
        style={{
          animation: '0.15s ease 0s 1 normal none running slideUp'
        }}
      >
        <button
          onClick={() => {
            setStore('editingCommentId', comment.id)
            setStore('editingCommentContent', comment.body)
            setStore('commentActionDropdown', '')
          }}
          disabled={store.deletingId === comment.id}
          class="py-2 px-4 rounded-[.5rem] w-full text-xs flex transition-all dark:hover:bg-white/10 hover:bg-black/10">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-edit-circle w-4 h-4 mr-1"
               viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
               stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M12 15l8.385 -8.415a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3z"/>
            <path d="M16 5l3 3"/>
            <path d="M9 7.07a7 7 0 0 0 1 13.93a7 7 0 0 0 6.929 -6"/>
          </svg>
          Edit
        </button>

        <button
          onClick={() => deleteComment(comment.id)}
          disabled={store.deletingId === comment.id}
          classList={{
            'bg-red-500 text-white dark:bg-red-500 dark:text-white': store.deletingId === comment.id
          }}
          class="py-2 px-4 rounded-[.5rem] w-full hover:bg-red-500 hover:text-white dark:bg-neutral-800 dark:text-white text-xs flex transition-all">
          <svg
            classList={{
              'hidden': store.deletingId === comment.id
            }}
            xmlns="http://www.w3.org/2000/svg"
            class="icon icon-tabler icon-tabler-trash w-4 h-4 mr-1" viewBox="0 0 24 24" stroke-width="2"
            stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path
              stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M4 7l16 0"/>
            <path d="M10 11l0 6"/>
            <path
              d="M14 11l0 6"/>
            <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"/>
            <path
              d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"/>
          </svg>
          <svg
            classList={{
              'hidden': store.deletingId !== comment.id
            }}
            xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1 animate-spin icon icon-tabler icons-tabler-outline icon-tabler-loader-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M12 3a9 9 0 1 0 9 9"/>
          </svg>
          Delete
        </button>
      </div>
    }

  </>
}

export default CommentActionPanel
