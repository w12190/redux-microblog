import {
  ADD_POST,
  DELETE_POST,
  EDIT_POST,
  GET_TITLES,
  GET_POST,
  ADD_COMMENT,
  DELETE_COMMENT,
  VOTE_POST
} from './actions.js'

// CR: Make a comment that shows what our state should look like.


const INITIAL_STATE = { posts: {}, titles: [] }

/** Reducer for updating Redux store */
function rootReducer(state = INITIAL_STATE, action) {
  switch (action.type) {

    /** Post related actions */
    case VOTE_POST: {
      const { postId, votes } = action.payload;
      const copyTitles = [...state.titles];

      const titleIdx = copyTitles.findIndex(title => title.id === postId);
      let targetTitle = copyTitles[titleIdx];
      copyTitles[titleIdx] = { ...targetTitle, votes };

      if (state.posts[postId]) {
        const updatedPosts = { ...state.posts, [postId]: { ...state.posts[postId], votes } };
        return { ...state, posts: updatedPosts, titles: copyTitles };
      }
      return { ...state, titles: copyTitles };
    }
    case GET_TITLES: {
      return { ...state, titles: action.payload }
    }
    case GET_POST: {
      const postCopy = { ...state.posts };
      const { title, description, body, id, votes, comments } = action.payload;
      postCopy[id] = { title, description, body, votes, comments };

      return { ...state, posts: postCopy }

    }
    case ADD_POST: {
      const postsCopy = { ...state.posts }
      const { title, description, body, id, votes } = action.payload
      postsCopy[id] = { title, description, body, votes, comments: [] }

      return { ...state, posts: postsCopy };
    }
    // CR: copyPost is excess. We can streamline this more.
    case EDIT_POST: {
      const { title, description, body, id, votes } = action.payload //new content
      const copyPost = { ...state.posts[id] } //got the exact post, then spread it to shallow copy
      const updatedPost = { title, description, body, votes, comments: copyPost.comments }
      const newPosts = { ...state.posts, [id]: updatedPost } //note: need to review this pattern

      return { ...state, posts: newPosts }
    }
    case DELETE_POST: {
      const id = action.payload;
      const postCopy = { ...state.posts };
      delete postCopy[id];
      return { ...state, posts: postCopy };
    }

    /** Comment-related actions */
    case ADD_COMMENT: {
      const { commentData, postId } = action.payload;
      const copyPost = { ...state.posts[postId] };
      const updatedPost = { ...copyPost, comments: [...copyPost.comments, commentData] };
      const newPosts = { ...state.posts, [postId]: updatedPost };

      return { ...state, posts: newPosts };
    }
    case DELETE_COMMENT: {
      const { postId, commentId } = action.payload
      const copyComments = [...state.posts[postId].comments]

      // Filter out the unwanted comment
      const filteredComments = copyComments.filter(comment => comment.id !== commentId)

      // De-structure every level then overwriting the key/value pair that leads to the removed comment
      return { ...state, posts: { ...state.posts, [postId]: { ...state.posts[postId], comments: filteredComments } } }
    }

    default:
      return state;
  }
}

export default rootReducer;