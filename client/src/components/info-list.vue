<template>
  <div>
    <v-list-tile v-for="item in items">
      <v-list-tile-content v-bind:key="item.id">
        <v-list-tile-title> {{item.line}}</v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>
    <div class="text-xs-center">
      <v-pagination :length="pages" @input="changePage" v-model="page"></v-pagination>
    </div>
  </div>
</template>


<script>
import axios from 'axios'
import config from '../config_app'
let lo = console.log
export default {
  props: ['fileId'],
  data() {
    return {
      limit: 10,
      offset: 0,
      all: 0,
      pages: 0,
      page: 1,
      items: [

      ]
    }
  },
  created() {
    lo(this.fileId)
    this.getList(true)

  },
  methods: {
    getList(getCount = false) {
      let limit = this.limit
      let offset = this.offset
      let where = { file: this.fileId }
      let query = { offset, limit, where };
      let reqParams = config.urls.infoList;
      let { method, url } = reqParams;
      if (getCount) {
        query.count = true
      }
      axios[method](url, { params: { query } }).then(res => {
        let data = res.data;
        let { files, count } = data.response
        this.$set(this, 'items', files);
        if (count) {
          this.$set(this, 'all', count);
          this.updatePages()
        }
      }).catch(err => {

      })
    },
    updatePages() {
      let all = this.all;
      let limit = this.limit
      let pages = Math.ceil(all / limit);
      this.$set(this, 'pages', pages);
    },
    changePage() {
      let limit = this.limit
      let offset = limit * (this.page - 1)
      this.$set(this, 'offset', offset);
      this.getList()
    }
  }
}
</script>

<style >
.pagination__item--active {
  color: #fff !important;
  background: #2196f3 !important;
}
</style>