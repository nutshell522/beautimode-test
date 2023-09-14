<template>
  <div class="tabs">
    <div class="tab" :class="{ active: currentComponent == 1 }" @click="renderComponent(1)">題目 1</div>
    <div class="tab" :class="{ active: currentComponent == 2 }" @click="renderComponent(2)">題目 2</div>
  </div>
  <ToDoList msg="ToDoList" v-if="currentComponent == 1"></ToDoList>
  <MealTime msg="MealTime" v-if="currentComponent == 2"></MealTime>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ToDoList from './components/ToDoList.vue';
import MealTime from './components/MealTime.vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
const currentComponent = ref<number>(1);
function renderComponent(componentNumber: number): void {
  currentComponent.value = componentNumber;
}
</script>

<style scoped lang="scss">
.tabs {
  border-bottom: 2px solid #333;
  display: flex;

  .tab {
    background-color: #ddd;
    color: #333;
    cursor: pointer;
    padding: 10px 20px;
    border-radius: 5px 5px 0 0;
    font-size: 20px;
    transition: 0.1s;
    margin: 0 2px;

    &:hover {
      background-color: #aaa;
    }

    &.active {
      background-color: #333;
      color: #eee;
    }
  }
}
</style>
