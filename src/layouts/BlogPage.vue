<template>
  <div class="row justify-center spinner" v-if="loading">
    <q-spinner-ball color="primary" size="6em"></q-spinner-ball>
  </div>
  <div v-else>
    <div class="text-center blog-heading">
      <h1>Blog Page</h1>
    </div>
    <div class="container relative-postion">
      <q-btn class="float-right" color="primary" @click="createBlog">
        <div class="ellipsis">Create New Blog</div>
      </q-btn>
      <BlogListing
        v-if="users.length && blogs.length"
        :users="users"
        :blogs="blogs"
        @delete-post="deletePost"
        @edit-post="editPost"
      />
    </div>
  </div>
  <CreateEditBlog
    v-if="showAddEditModal"
    :users="users"
    :addEditModalData="addEditModalData"
    @close-modal="closeModal"
    @save-data="saveData"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BlogListing from 'components/BlogListing.vue';
import CreateEditBlog from 'components/CreateEditBlog.vue';
import BlogService from 'src/services/blog.service';
import { useQuasar } from 'quasar';

export default defineComponent({
  name: 'BlogPage',

  components: {
    BlogListing,
    CreateEditBlog,
  },

  data() {
    return {
      users: [],
      blogs: [],
      loading: true,
      showAddEditModal: false,
      addEditModalData: {},
    };
  },

  setup() {
    const $q = useQuasar();
    const toastNotification = function (type, message) {
      $q.notify({ type, message });
    };
    return {
      toastNotification,
    };
  },

  async created() {
    this.loading = true;
    const userRequest = BlogService.getUsers();
    const blogRequest = BlogService.getPosts();
    const commentRequest = BlogService.getComments();
    const [users, blogs, comments] = await Promise.all([
      userRequest,
      blogRequest,
      commentRequest,
    ]);
    this.loading = false;
    this.users = users;
    this.blogs = blogs.map((blog) => {
      blog.comments = comments.filter((comment) => comment.postId === blog.id);
      return blog;
    });
  },

  methods: {
    async saveData(isEdit, form) {
      delete form.comments;
      // There is a problem with the API, The Post/Patch request works but doesn't update anything in the server, please check that.
      if (isEdit) {
        this.blogs = this.blogs.map((blog) => {
          if (blog.id === form.id) {
            return form;
          }
          return blog;
        });
        // Call Patch
        await BlogService.updatePost(form)
          .then(() => {
            this.toastNotification('positive', 'Blog Updated Successfully');
          })
          .catch(() => {
            this.toastNotification('negative', 'Something went wrong');
          });
      } else {
        // generating random number as API is not returning the added post
        form.id = Math.floor(Math.random() * (500 - 100 + 1)) + 100;
        this.blogs.unshift(form);
        // Call Post
        await BlogService.createPost(form)
          .then(() => {
            this.toastNotification('positive', 'Blog Created Successfully');
          })
          .catch(() => {
            this.toastNotification('negative', 'Something went wrong');
          });
      }
    },
    closeModal() {
      this.showAddEditModal = false;
      this.addEditModalData = {};
    },
    createBlog() {
      this.showAddEditModal = true;
    },
    editPost(post) {
      this.addEditModalData = post;
      this.showAddEditModal = true;
    },
    async deletePost(post) {
      // There is a problem with the API, The delete request works but doesn't update anything in the server, please check that.
      this.blogs = this.blogs.filter((blog) => blog.id !== post.id);
      await BlogService.deletePost(post.id)
        .then(() => {
          this.toastNotification('positive', 'Blog Deleted Successfully');
        })
        .catch(() => {
          this.toastNotification('negative', 'Something went wrong !');
        });
    },
  },
});
</script>

<style scope>
.blog-heading h1 {
  font-size: 4.5rem;
  font-weight: 600;
}
.container {
  max-width: 1200px;
  width: 90%;
  margin: auto;
}
.spinner {
  height: 100vh;
  align-items: center;
}

.blog-filter select {
  display: block;
  padding: 0.375rem 2.25rem 0.375rem 0.75rem;
  -moz-padding-start: calc(0.75rem - 3px);
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #212529;
  background-color: #fff;
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 16px 12px;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.blogs {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.blogs .blog-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  padding: 20px 30px;
  display: flex;
}

.q-card {
  box-shadow: none;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.q-card__section--vert {
  padding: 0;
}

.text-h6 {
  text-transform: capitalize;
}
</style>
