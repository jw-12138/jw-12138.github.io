import useStore from './Store.jsx'
import {createEffect, For, on, onMount} from 'solid-js'
import CommentListItem from './CommentListItem.jsx'
import {githubApi, owner, renderMarkdown, repo} from './utils.jsx'

const [store, setStore] = useStore()

function CommentList() {

  createEffect(on(() => store.shouldListReactionsForCommentId, async (id) => {
    if (id) {
      await listReactionsForComment(id)
      setStore('shouldListReactionsForCommentId', 0)
    }
  }))

  /**
   * 获取评论点赞
   * @param comment_id
   * @param retryLeft
   * @returns {Promise<boolean>}
   */
  async function listReactionsForComment(comment_id, retryLeft = 3) {

    if (retryLeft === 0) {
      return false
    }

    let api = `https://api.github.com/repos/${owner}/${repo}/issues/comments/${comment_id}/reactions`

    let resp

    try {
      setStore('listingReactionCommentIds', [...store.listingReactionCommentIds, comment_id])
      resp = await githubApi(api)
    } catch (e) {
      console.log(e)
      await listReactionsForComment(comment_id, retryLeft - 1)
      return false
    } finally {
      setStore('listingReactionCommentIds', store.listingReactionCommentIds.filter(item => item !== comment_id))
    }

    if (!resp.ok) {
      console.log('failed to list reactions for comment')
      await listReactionsForComment(comment_id, retryLeft - 1)
      return false
    }

    try {
      let reactions = await resp.json()

      let contentBasedReactions = {}

      reactions.forEach(item => {
        if (!contentBasedReactions[item.content]) {
          contentBasedReactions[item.content] = [item]
        } else {
          contentBasedReactions[item.content].push(item)
        }
      })

      setStore('commentReactionMap', comment_id, contentBasedReactions)
    } catch (e) {
      console.log(e)
      await listReactionsForComment(comment_id, retryLeft - 1)
      return false
    }
  }

  async function getComments(update_id) {
    if (store.gettingUser) {
      return false
    }

    if(update_id){
      let theCommentIndex = store.comments.findIndex(c => c.id === update_id)

      if (theCommentIndex !== -1) {
        let html = await renderMarkdown(store.comments[theCommentIndex].body, store.comments[theCommentIndex].id, store.comments[theCommentIndex].updated_at)
        setStore('comments', theCommentIndex, 'bodyHTML', html)
      }

      return false
    }

    setStore('gettingComments', true)

    let resp = await githubApi(`https://api.github.com/repos/${owner}/${repo}/issues/${store.githubIssueId}/comments`)
    let remoteComments = await resp.json()
    setStore('gettingComments', false)
    setStore('comments', remoteComments)

    // get all reactions here
    for (let i = 0; i < store.comments.length; i++) {
      setStore('shouldListReactionsForCommentId', store.comments[i].id)

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
    {store.gettingComments && <section data-name="loading screen" class="pt-8">
      <div class="flex text-sm justify-center items-center">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-loader-2 animate-spin" width="24"
               height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
               stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M12 3a9 9 0 1 0 9 9"/>
          </svg>
        </div>
      </div>
    </section>}

    <section data-name="comments" class="pt-8">
      <div class="text-center text-base font-black italic" classList={{
        hidden: store.gettingComments
      }}>
        <span classList={{
          hidden: store.comments.length === 0
        }}>
          <span>{store.comments.length}</span> Comment{store.comments.length === 1 ? '' : 's'}
        </span>
        <span classList={{
          hidden: store.comments.length !== 0
        }} class="font-normal text-sm opacity-80 not-italic">
          No comments for now
        </span>
      </div>

      {
        <div class="comments-list">
          <For each={store.comments}>
            {(c, i) => <CommentListItem index={i}></CommentListItem>}
          </For>
        </div>
      }
    </section>
  </>
}

export default CommentList
