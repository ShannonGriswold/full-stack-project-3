<script setup>
import PostComponent from './components/PostComponent.vue'

</script>

<template>
  <div id = "app">
    <img alt="Vue logo" src="./assets/logo.png">
    <Suspense>
      <PostComponent />
    </Suspense>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
