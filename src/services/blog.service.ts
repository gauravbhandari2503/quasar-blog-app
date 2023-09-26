import BaseService from './base';

export default class BlogService extends BaseService {
  static getUsers() {
    return super
      .getAxiosClient()
      .get('users')
      .then((response) => response.data)
      .catch((error) => error);
  }

  static getPosts() {
    return super
      .getAxiosClient()
      .get('posts')
      .then((response) => response.data)
      .catch((error) => error);
  }

  static deletePost(postId) {
    return super
      .getAxiosClient()
      .delete(`posts/${postId}`)
      .then((response) => response.data)
      .catch((error) => error);
  }

  static updatePost(data) {
    return super
      .getAxiosClient()
      .patch(`posts/${data.id}`, data)
      .then((response) => response.data)
      .catch((error) => error);
  }

  static createPost(data) {
    return super
      .getAxiosClient()
      .post('posts', data)
      .then((response) => response.data)
      .catch((error) => error);
  }

  static getComments() {
    return super
      .getAxiosClient()
      .get('comments')
      .then((response) => response.data)
      .catch((error) => error);
  }
}
