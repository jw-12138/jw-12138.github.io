import useStore from './Store.jsx'
import {createEffect, Index, on, onMount} from 'solid-js'
import CommentListItem from './CommentListItem.jsx'
import {githubApi, owner, renderMarkdown, repo} from './utils.jsx'

const [store, setStore] = useStore()

function CommentList() {

  async function getComments(update_id) {
    if (store.gettingUser) {
      return <></>
    }

    setStore('gettingComments', true)

    let resp = await githubApi(`/repos/${owner}/${repo}/issues/${store.githubIssueId}/comments`)

    let remoteComments = await resp.json()

    setStore('gettingComments', false)

    if (!update_id) {
      setStore('comments', remoteComments)
    } else {
      // update only one comment

      let theCommentIndex = store.comments.findIndex(c => c.id === update_id)

      console.log(theCommentIndex)

      if (theCommentIndex !== -1) {
        let html = await renderMarkdown(store.comments[theCommentIndex].body, store.comments[theCommentIndex].id, store.comments[theCommentIndex].updated_at)

        setStore('comments', theCommentIndex, 'bodyHTML', html)
      }

      // TODO: list reactions
      // listReactionsForComment(update_id)

      return false
    }

    // get all reactions here
    for (let i = 0; i < store.comments.length; i++) {
      // don't go with await here
      // listReactionsForComment(comments.value[i].id)

      if (store.comments[i].body) {
        let html = await renderMarkdown(store.comments[i].body, store.comments[i].id, store.comments[i].updated_at)
        setStore('comments', i, 'bodyHTML', html)
      }
    }
  }

  onMount(async () => {
    await new Promise(r => setTimeout(r, 50))
    await getComments()
  })

  createEffect(on(() => store.shouldUpdateCommentId, async (id) => {
    if (id) {
      await getComments(id)
      setStore('shouldUpdateCommentId', 0)
    }
  }))

  return <>
    {store.gettingComments && <section data-name="loading screen" className="pt-8">
      <div className="flex text-sm justify-center items-center">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-loader-2 animate-spin" width="24"
               height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
               stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M12 3a9 9 0 1 0 9 9"/>
          </svg>
        </div>
      </div>
    </section>}

    <section data-name="comments" class="pt-8">
      <div className="text-center text-base font-black italic" classList={{
        hidden: store.gettingComments
      }}>
        <span classList={{
          hidden: store.comments.length === 0
        }}>
          <span>{store.comments.length}</span> 条评论
        </span>
        <span classList={{
          hidden: store.comments.length !== 0
        }} className="font-normal text-sm opacity-80 not-italic">
          目前还没有评论～
        </span>
      </div>

      {
        store.comments.length > 0 &&
        <div class="comments-list">
          <Index each={store.comments}>
            {(c, index) => <CommentListItem index={index}></CommentListItem>}
          </Index>
        </div>
      }
    </section>
  </>
}

export default CommentList
