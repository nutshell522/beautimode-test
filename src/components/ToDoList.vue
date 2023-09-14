<template>
  <h2>{{ msg }}</h2>
  <small class="user-card">user {{ userId }} 的代辦事項</small>
  <section>
    <div class="heading-box">
      <h2 class="status-title me-auto">代辦事項</h2>
      <button @click="editTitleEvent(0)" class="btn btn-primary"><i class="bi bi-plus-lg"></i> 新增</button>
    </div>
    <div v-for="(item, index) in todoList.filter((item) => !item.completed)" :key="item.id" class="todo-list-item">
      <input :id="`todo${index}`" type="checkbox" :data-id="item.id" v-model="item.completed" @change="updateTodoList(item.id)" />
      <label :for="`todo${index}`"> </label>
      <div class="itemTitle">{{ item.title }}</div>
      <div>
        <i class="bi bi-pencil-square" @click="editTitleEvent(item.id)"></i>
        <i class="bi bi-trash" @click="deleteTodoList(item.id)"></i>
      </div>
    </div>
  </section>
  <section class="complete">
    <h2 class="status-title">完成事項</h2>
    <div v-for="(item, index) in todoList.filter((item) => item.completed)" :key="item.id" class="todo-list-item">
      <input :id="`complete${index}`" type="checkbox" :data-id="item.id" v-model="item.completed" @change="updateTodoList(item.id)" />
      <label :for="`complete${index}`"> </label>
      <div class="itemTitle">{{ item.title }}</div>
      <div>
        <i class="bi bi-pencil-square" @click="editTitleEvent(item.id)"></i>
        <i class="bi bi-trash" @click="deleteTodoList(item.id)"></i>
      </div>
    </div>
  </section>
  <div class="edit-bg" :class="{ active: isOnEdit }" @click.self="isOnEdit = false">
    <div class="edit-aria">
      <h2 v-if="editId === 0" class="edit-aria-heading">請輸入標題</h2>
      <h2 v-else class="edit-aria-heading">修改標題</h2>
      <input type="text" v-model="editTitle" />
      <div class="danger-text">{{ errorInfo }}</div>
      <button @click="updateTitle">確認</button>
      <button @click="isOnEdit = false">取消</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TodoListItem } from '../type.ts';
import { ref } from 'vue';
defineProps<{ msg: string }>();
const userId = ref<number>(1);
const isOnEdit = ref<boolean>(false);
const editId = ref<number>(0);
const editTitle = ref<string>('');
const todoList = ref<TodoListItem[]>([]);
const errorInfo = ref<string>('');

const editTitleEvent = (todoId: number): void => {
  errorInfo.value = '';
  isOnEdit.value = true;
  editId.value = todoId;
  if (todoId !== 0) {
    editTitle.value = todoList.value.find((x) => x.id === todoId)!.title;
  } else {
    editTitle.value = '';
  }
};

const updateTitle = (): void => {
  if (editTitle.value === '') {
    errorInfo.value = '欄位不可為空';
    return;
  }
  isOnEdit.value = false;
  if (editId.value !== 0) {
    todoList.value.find((x) => x.id === editId.value)!.title = editTitle.value;
    updateTodoList(editId.value);
  } else {
    createTodoListItem();
  }
};

const fetchTodoList = (): void => {
  fetch(`https://jsonplaceholder.typicode.com/users/${userId.value}/todos`)
    .then((res) => res.json())
    .then((json) => {
      todoList.value = json;
    })
    .catch((err) => {
      console.error(err);
    });
};

const createTodoListItem = (): void => {
  fetch(`https://jsonplaceholder.typicode.com/todos`, {
    method: 'POST',
    body: JSON.stringify({
      title: editTitle.value,
      completed: false,
      userId: userId,
    }),
    headers: { 'Content-type': 'application/json; charset=UTF-8' },
  })
    .then((res) => res.json())
    .then((json) => {
      const todoItem: TodoListItem = json as TodoListItem;
      console.log(todoItem.userId);
      // 重新渲染畫面
      // fetchTodoList()
      todoList.value.push(todoItem);
    })
    .catch((err) => console.error(err));
};

const updateTodoList = (todoId: number): void => {
  let changedItem = todoList.value.find((item) => item.id === todoId);
  fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`, {
    method: 'PUT',
    body: JSON.stringify(changedItem),
    headers: { 'Content-type': 'application/json; charset=UTF-8' },
  })
    .then((res) => res.json())
    .then((json) => {
      const todoItem: TodoListItem = json as TodoListItem;
      // 重新渲染畫面
      changedItem = todoItem;
      // fetchTodoList()
    })
    .catch((err) => console.error(err));
};

const deleteTodoList = (todoId: number): void => {
  let changedItem = todoList.value.find((item) => item.id === todoId);
  let result = confirm(`是否刪除項目${changedItem?.title}`);
  if (result) {
    fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`, {
      method: 'DELETE',
    })
      .then((res) => {
        console.log(res);
        // 重新渲染畫面
        todoList.value = todoList.value.filter((item) => item.id !== todoId);
        // fetchTodoList()
      })
      .catch((err) => console.error(err));
  }
};

fetchTodoList();
</script>

<style scoped lang="scss">
.heading-box {
  display: flex;
}
.user-card {
  display: inline-block;
  padding: 3px 10px;
  margin: 0;
  border-radius: 5px;
  background-color: #ddd;
  cursor: default;
}
section {
  margin-top: 50px;
}
.complete {
  .todo-list-item {
    background-color: rgb(245, 233, 211);
    .itemTitle {
      color: #999;
      text-decoration: line-through;
    }
    i {
      color: #999;
    }
  }
}
.todo-list-item {
  display: flex;
  background-color: bisque;
  margin-top: 5px;
  padding: 10px 20px;
  border-radius: 5px;
  align-items: center;
  i {
    font-size: 18px;
    margin-left: 15px;
    cursor: pointer;
    &:hover {
      color: #777;
    }
  }

  .itemTitle {
    margin-right: auto;
    font-size: 18px;
  }
  /* 隱藏原始的 checkbox */
  input[type='checkbox'] {
    display: none;
  }

  /* 自訂圓形樣式的 label */
  label {
    display: inline-block;
    width: 20px;
    height: 20px;
    background-color: #f8f8f8;
    border: 1px #777 solid;
    border-radius: 50%;
    cursor: pointer;
    margin-right: 20px;
    &:hover {
      background-color: #ddd;
    }
  }

  /* 自訂選中時的樣式 */
  input[type='checkbox']:checked + label {
    background-color: #007bff; /* 選中時的背景顏色 */
  }
}

.edit-bg {
  $edit-aria-width: 400px;
  $edit-aria-height: 200px;
  visibility: hidden;
  opacity: 0;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba($color: #000000, $alpha: 0.3);
  width: 100vw;
  height: 100vh;

  &.active {
    transition: 0.3s;
    visibility: visible;
    opacity: 1;

    .edit-aria {
      top: calc((100% - $edit-aria-height) / 2);
    }
  }

  .edit-aria {
    transition: 0.3s;
    background-color: #fff;
    position: absolute;
    width: $edit-aria-width;
    height: $edit-aria-height;
    top: calc((100% - $edit-aria-height) / 2 - 5%);
    left: calc((100% - $edit-aria-width) / 2);
    text-align: center;
    padding: 15px;
    border-radius: 5px;

    .edit-aria-heading {
      font-size: 30px;
    }

    input {
      width: 100%;
      height: 40px;
      border-radius: 7px;
      margin-top: 5px;
      border: #999 2px solid;
      padding: 10px;
      font-size: 18px;
    }

    .danger-text {
      color: red;
      height: 25px;
      font-size: 18px;
      text-align: start;
      margin-top: 5px;
      margin-bottom: 10px;
    }
  }
}
</style>
