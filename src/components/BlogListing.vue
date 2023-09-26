<template>
  <div class="blog-filter">
    <select v-model="selectedFilter" @change.prevent="updatedFilter">
      <option value="" disabled selected hidden>Filter Blog's by User</option>
      <option :value="0">Show All</option>
      <option :key="user.id" v-for="user in users" :value="user.id">
        {{ user.name }}
      </option>
    </select>
  </div>
  <div class="blogs">
    <div v-for="blog in filteredBlogs" :key="blog.id" class="blog-card">
      <q-card class="my-card">
        <q-card-section>
          <div class="text-h6">{{ blog.title }}</div>
          <div class="text-subtitle2">By: {{ blogBy(blog.userId) }}</div>
        </q-card-section>

        <q-card-section>
          {{ blog.body }}
        </q-card-section>

        <q-separator dark></q-separator>
        <q-card-section>
          <div class="text-h6">Comments</div>
          <ul class="text-subtitle2">
            <li
              class="text-weight-regular"
              v-for="comment in blog.comments"
              :key="comment.id"
            >
              {{ comment.body }}
            </li>
          </ul>
        </q-card-section>
        <q-card-actions class="buttons-block">
          <q-btn class="bg-primary text-white" @click="editPost(blog)" flat
            >Edit</q-btn
          >
          <q-btn class="bg-primary text-white" @click="deletePost(blog)" flat
            >Delete</q-btn
          >
        </q-card-actions>
      </q-card>
    </div>
  </div>
  <Pagination
    v-if="renderRefresh"
    :pagination="pagination"
    @update-page="updatePaginationDetails"
  />
</template>
<script>
import { nextTick } from 'vue';
import Pagination from '../components/PageNavigation.vue';
export default {
  name: 'BlogListing',
  components: {
    Pagination,
  },
  props: {
    users: {
      type: Array,
      required: true,
    },
    blogs: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      selectedFilter: '',
      renderRefresh: true,
      pagination: null,
    };
  },
  created() {
    this.pagination = this.getPaginationInitials();
  },
  computed: {
    filteredBlogs() {
      //filter logic goes here
      let filteredData = this.blogs;
      if (this.selectedFilter)
        filteredData = this.blogs.filter(
          (blog) => blog.userId === this.selectedFilter
        );
      //pagination logic goes here
      filteredData = filteredData.slice(
        this.pagination.from - 1,
        this.pagination.to
      );
      return filteredData;
    },
  },
  emits: ['delete-post', 'edit-post'],
  methods: {
    editPost(post) {
      this.$emit('edit-post', post);
    },
    deletePost(post) {
      this.$emit('delete-post', post);
    },
    getPaginationInitials() {
      let blogLength = this.blogs.length;
      if (this.selectedFilter) {
        blogLength = this.blogs.filter(
          (blog) => blog.userId === this.selectedFilter
        ).length;
      }
      const perPageRecords = 10;
      return {
        totalPages: Math.ceil(blogLength / perPageRecords),
        perPageRecords,
        currentPage: 1,
        from: 1,
        to: 10,
      };
    },
    blogBy(userId) {
      return this.users.find((user) => user.id === userId).name;
    },
    updatePaginationDetails(pageNumber) {
      this.pagination.currentPage = pageNumber;
      this.pagination.to = pageNumber * this.pagination.perPageRecords;
      this.pagination.from =
        this.pagination.to - this.pagination.perPageRecords + 1;
    },
    updatedFilter() {
      this.pagination = this.getPaginationInitials();
      this.renderRefresh = false;
      nextTick(() => {
        this.renderRefresh = true;
      });
    },
  },
};
</script>
<style scoped>
.blog-card {
  margin: 10px 0px 5px 0px;
  background-color: #fff;
}

.blogs {
  padding-top: 20px;
}

ul.text-subtitle2 {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-left: 20px;
}

.buttons-block {
  margin-top: auto;
}
</style>
