interface POST {
  getAll: string;
  getById: string;
  create: string;
  delete: string;
  like: string;
  unLike: string;
}

interface NOTIFICATION {
  newPostsAvailable: string;
  errorToCreatePost: string;
  errorToDeletePost: string;
  errorGettingThePosts: string;
  errorJwtAuth: string;
}

interface SocketEvents {
  DISCONNECT: string;
  CONNECT: string;
  POST: POST;
  NOTIFICATION: NOTIFICATION;
}

export const socketEvents: SocketEvents = {
  DISCONNECT: "disconnect",
  CONNECT: "connect",
  POST: {
    getAll: "POSTS_GET_ALL",
    getById: "POSTS_GET_BY_ID",
    create: "POST_CREATE",
    delete: "POST_DELETE",
    like: "POST_LIKE",
    unLike: "POST_UNLIKE",
  },
  NOTIFICATION: {
    newPostsAvailable: "NEW_POSTS_ARE_AVAILABLE",
    errorToCreatePost: "ERROR_TO_CREATE_A_POST",
    errorToDeletePost: "ERROR_TO_DELETE_A_POST",
    errorGettingThePosts: "ERROR_GETTING_THE_POSTS",
    errorJwtAuth: "ERROR_JWT_AUTH",
  },
};
