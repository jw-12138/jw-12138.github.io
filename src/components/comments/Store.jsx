import {createStore} from 'solid-js/store'

let apiBase = 'https://blog-api-cf-worker.jw1.dev'

// if(location.hostname === 'localhost'){
//   apiBase = 'http://localhost:4009'
// }

let proxy = apiBase + '/proxy'

const [store, setStore] = createStore({
  apiBase,
  mouseIsInsideWindow: false,
  mouseIsInActionWindow: false,
  sending_comment: false,
  gettingComments: false,
  userComment: '',
  user: {},
  gettingUser: false,
  githubIssueId: '',
  comments: [],
  isUserLoggedIn: false,
  proxy: proxy,
  reactingCommentID: [],
  listingReactionCommentIds: [],
  accessToken: '',
  deletingId: '',
  editingCommentId: '',
  editingCommentContent: '',
  commentActionDropdown: '',
  submittingEditedComment: false,
  shouldUpdateCommentId: 0,
  commentReactionMap: {},
  reactingIds: [],
  shouldListReactionsForCommentId: 0
})

export default function useStore() {
  return [store, setStore]
}
