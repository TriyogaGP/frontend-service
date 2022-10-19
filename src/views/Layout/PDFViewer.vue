<template>
    <v-card>
      <v-toolbar
				dark
				color="light-blue darken-3"
      >
        <v-toolbar-title>Lampiran Berkas</v-toolbar-title>
        <v-spacer />
        <v-toolbar-items>
          <v-btn
            icon
            dark
            @click="cancel"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <div class="pa-2">
        <iframe
          class="mt-1"
          :src="urlSkVal"
          datatype="application/pdf"
          style="width: 100%; height: 500px"
          frameborder="0"
        />
      </div>
    </v-card>
  </template>
  
  <script>
  export default {
    props: {
      urlSk: {
        type: String,
        default: ""
      }
    },
    data() {
      return{
  
      }
    },
    computed: {
      urlSkVal() {
        return this.urlSk;
      }
    },
    methods:{
      cancel() {
        this.$emit("cancel");
      },
    },
  }
  </script>
  
  <style scoped>
  .v-toolbar{
    height: 50px !important;
  }
  .v-toolbar__items > .v-btn {
    border-radius: 0;
    height: 85% !important;
    max-height: none;
  }
  </style>