<template>
    <div>
        <v-list-tile>
            <v-list-tile-content>
                <v-list-tile-title> Загрузить файл</v-list-tile-title>
            </v-list-tile-content>
        </v-list-tile>
        <v-list-tile>
            <v-list-tile-content>
                <input type="file" ref="file">
            </v-list-tile-content>
            <v-list-tile-content>
                <v-btn light @click="fileUpload">Отправить</v-btn>
            </v-list-tile-content>
        </v-list-tile>
        <v-snackbar :timeout="3000" :success="snackbar.context === 'success'" :info="snackbar.context === 'info'" :warning="snackbar.context === 'warning'" :error="snackbar.context === 'error'" :primary="snackbar.context === 'primary'" v-model="snackbar.model">
            {{ snackbar.text }}
            <v-btn flat @click.native="snackbar.model = false">Закрыть</v-btn>
        </v-snackbar>
    </div>
</template>
<script>
import axios from 'axios'
import config from '../config_app'

let lo = console.log
export default {
    name: 'file-upload',
    data() {
        return {
            file: '',
            snackbar: {
                model: false,
                text: '123132',
                context: 'info'
            }
        }
    },
    methods: {
        fileUpload() {
            let fileEl = this.$refs.file;
            let fileBlob = fileEl.files[0];
            if (!fileBlob) {
                this.snackbarView('Файл не прикреплен', 'error')
                return;
            }
            let formData = new FormData();
            formData.append('fileToUpload', fileBlob);
            let reqParams = config.urls.fileUpload;
            let { method, url } = reqParams;
            axios[method](url, formData).then(res => {
                let data = res.data;
                let lines = data.response.lines;
                this.snackbarView(`Файл записан. Добавленно ${lines} строк`)
                this.$emit('upload');
                fileEl.value=''
            }).catch(err => {
                this.snackbarView(`Ошибка передачи`, 'error')
            })
        },
        snackbarView(text = '', context = 'info') {
            this.snackbar.model = false
            this.$nextTick(() => {
                this.snackbar.text = text
                this.snackbar.context = context
                this.snackbar.model = true
            })
        }
    }

}
</script>