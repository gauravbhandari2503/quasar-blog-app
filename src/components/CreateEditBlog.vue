<template>
  <q-dialog v-model="showModal" persistent>
    <q-card>
      <q-card-section>
        <h2>{{ isEdit ? 'Edit Blog' : 'Create Blog' }}</h2>
        <div class="create-edit-modal">
          <div class="blog-user">
            <label>User </label>
            <select v-model="selectedUser" @change.prevent="updatedUser">
              <option :key="user.id" v-for="user in users" :value="user.id">
                {{ user.name }}
              </option>
            </select>
          </div>
          <div class="blog-title">
            <label>Title</label>
            <input
              type="text"
              v-model="this.form.title"
              @change="errors.clear('titleError')"
            />
            <span v-if="errors.has('titleError')" class="text-negative">{{
              errors.first('titleError')
            }}</span>
          </div>
          <div class="blog-body">
            <textarea
              placeholder="Write your blog here"
              v-model="this.form.body"
              @change="errors.clear('bodyError')"
            ></textarea>
            <span v-if="errors.has('bodyError')" class="text-negative">{{
              errors.first('bodyError')
            }}</span>
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          :label="isEdit ? 'Edit Post' : 'Create Post'"
          color="primary"
          @click="saveData"
        />
        <q-btn label="Close" color="primary" @click="closeModal" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import serverFormError from '../mixins/serverFormError.js';
export default {
  props: {
    users: Array,
    addEditModalData: {
      type: Object,
      default: () => null,
    },
  },
  mixins: [serverFormError],
  emits: ['close-modal', 'save-data'],
  data() {
    return {
      showModal: true,
      selectedUser: 1,
      form: {
        title: '',
        body: '',
        userId: 1,
      },
      isEdit: false,
    };
  },
  created() {
    if (this.addEditModalData && Object.keys(this.addEditModalData).length) {
      this.isEdit = true;
      this.selectedUser = this.addEditModalData.userId;
      this.form = cloneDeep(this.addEditModalData);
    }
  },
  methods: {
    updatedUser() {
      this.form.userId = this.selectedUser;
    },
    closeModal() {
      this.showModal = false;
      this.$emit('close-modal');
    },
    validate(form) {
      this.errors.clearAll();
      let formValidated = true;
      if (form.body.trim() === '') {
        formValidated = false;
        this.errors.set('bodyError', ['Blog Body cannot be empty']);
      }
      if (form.title.trim() === '') {
        formValidated = false;
        this.errors.set('titleError', ['Blog Title cannot be empty']);
      }
      return formValidated;
    },
    saveData() {
      if (this.validate(this.form)) {
        this.closeModal();
        this.$emit('save-data', this.isEdit, this.form);
      }
    },
  },
};
</script>
<style scoped>
.q-card {
  max-width: 500px;
  width: 100%;
  border-radius: 16px;
  padding: 30px;
}
.create-edit-modal select {
  display: block;
  width: 100%;
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

.create-edit-modal input {
  display: block;
  width: 100%;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #212529;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.create-edit-modal textarea {
  display: block;
  width: 100%;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #212529;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  resize: none;
}

.create-edit-modal label {
  font-weight: 600;
  color: rgba(128, 128, 128, 0.853);
}
.q-card__section h2 {
  margin: 20px 0;
  font-size: 3rem;
  font-weight: 600;
}

.create-edit-modal {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
