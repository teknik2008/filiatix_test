<template>
  <div id="app">
    <files-list></files-list>
  </div>
</template>

<script>
import filesList from './components/files-list'
export default {
  name: 'app',
  components:{
    filesList
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
