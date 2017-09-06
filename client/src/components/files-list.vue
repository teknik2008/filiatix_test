<template>
  <v-layout row>
    <v-flex xs12 sm6 offset-sm3>
      <v-card>
        <v-toolbar class="cyan" dark>
          <v-toolbar-title>Файлы</v-toolbar-title>
        </v-toolbar>
        <v-list>
          <v-list-group @input="changeSlide($event,item.id)" v-for="item in items" v-bind:key="item.id" :class="show==item.id?'list--group__header--active':''">
            <v-list-tile slot="item">
              <v-list-tile-content>
                <v-list-tile-title>{{ item.name }} </v-list-tile-title>
                <v-list-tile-title>{{ dateFormat(item.created_at*1000) }} </v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-icon>keyboard_arrow_down </v-icon>
              </v-list-tile-action>
            </v-list-tile>
            <info-list v-if="isShow(item.id)" :file-id="item.id" class="info__show"></info-list>
          </v-list-group>
        </v-list>
        <div class="text-xs-center">
          <v-pagination :length="pages" @input="changePage" v-model="page"></v-pagination>
        </div>
        <v-list>
        <file-upload @upload="getList(true)"> </file-upload>
        </v-list>
      </v-card>
    </v-flex>
  </v-layout>
</template>


<script>
import axios from 'axios'
import config from '../config_app'
import infoList from './info-list'
import fileUpload from './file-upload'
import dateFormat from 'date-format'
let lo = console.log
export default {
  data() {
    return {
      limit: 10,
      offset: 0,
      all: 0,
      pages: 0,
      page: 1,
      items: [

      ],
      show:[],
      listClose: false
    }
  },
  created() {
    this.getList(true)

  },
  components:{
    infoList,
    fileUpload
  },
  methods: {
    getList(getCount = false) {
      let limit = this.limit
      let offset = this.offset
      let query = { offset, limit };
      let reqParams = config.urls.filesList;
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
      this.$set(this,'show',[])
      this.getList()
    },
    isShow(id){
      return this.show.indexOf(id)>-1
    },
    changeSlide(e,itemId){
      if(e){
        this.show.push(itemId);
      }else{
        let i=this.show.indexOf(itemId)
        this.show.splice(i,1)
      }
    },
    dateFormat(dateInt,template='dd/MM/yy hh:mm'){
      let date=new  Date(dateInt);
      return dateFormat(template,date)
    }
  }
}
</script>

<style >
.pagination__item--active {
  color: #fff !important; 
  background: #2196f3 !important;
}

.info__show .list__tile {
    background-color: #fff !important;
}
</style>