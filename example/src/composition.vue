<!--
 * @Autor: hui.wang
 * @Date: 2022-02-26 20:40:00
 * @LastEditors: hui.wang
 * @LastEditTime: 2022-02-26 20:44:05
 * @emial: hui.wang@bizfocus.cn
-->
<template>
  <p>Has published books:</p>
  <span>{{ publishedBooksMessage }}</span>
</template>

<script setup>
import { reactive, computed } from 'vue'

const author = reactive({
  name: 'John Doe',
  books: [
    'Vue 2 - Advanced Guide',
    'Vue 3 - Basic Guide',
    'Vue 4 - The Mystery'
  ]
})

// a computed ref
const publishedBooksMessage = computed(() => {
  return author.books.length > 0 ? 'Yes' : 'No'
})
</script>