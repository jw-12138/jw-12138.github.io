import useStore from './Store.jsx'
import {githubApi, owner, repo} from './utils.jsx'

const [store, setStore] = useStore()

async function deleteComment(id) {
  let c = confirm('确定要删除这条评论吗？😯')
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
    alert('删除失败，请稍后再试')
    console.log(e)
    return false
  } finally {
    setStore('deletingId', '')
  }

  if (resp.ok) {
    setStore('comments', store.comments.filter(c => c.id !== id))
  }
}

function CommentActionPanel(props) {
  let {comment} = props
  return <>
    {
      store.commentActionDropdown === comment.id &&
      <div
        data-name="more actions"
        className="absolute z-[500] top-[2.25rem] right-0 rounded-[1rem] dark:bg-neutral-800 px-2 py-2 bg-neutral-100 border-[1px] shadow-xl popup-border"
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
          class="py-2 px-4 rounded-[.5rem] text-xs flex transition-all dark:hover:bg-white/10 hover:bg-black/10">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-edit-circle w-4 h-4 mr-1"
               viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
               stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M12 15l8.385 -8.415a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3z"/>
            <path d="M16 5l3 3"/>
            <path d="M9 7.07a7 7 0 0 0 1 13.93a7 7 0 0 0 6.929 -6"/>
          </svg>
          编辑
        </button>

        <button
          onClick={() => deleteComment(comment.id)}
          disabled={store.deletingId === comment.id}
          class="py-2 px-4 rounded-[.5rem] hover:bg-red-500 hover:text-white dark:bg-neutral-800 dark:text-white text-xs flex transition-all">
          <svg xmlns="http://www.w3.org/2000/svg"
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
          删除
        </button>
      </div>
    }

  </>
}

export default CommentActionPanel
