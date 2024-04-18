import {createStore} from 'solid-js/store'

const [store, setStore] = createStore({
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
  proxy: 'https://blog-api-cf-worker.jw1.dev/proxy',
  reactingCommentID: [],
  listingReactionCommentId: null,
  accessToken: '',
  deletingId: '',
  editingCommentId: '',
  editingCommentContent: '',
  commentActionDropdown: '',
  submittingEditedComment: false,
  shouldUpdateCommentId: 0
})

export default function useStore() {
  return [store, setStore]
}
