<template>
  <v-app id="inspire">
    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="8">
            <v-card class="elevation-12">
							<v-row>
								<v-col cols="12" md="12">
									<v-card-text class="mt-12">
										<h1 class="text-center display-2 teal--text text--accent-3 mb-3">Solusi <strong>WIN.ID</strong></h1>
										<div class="d-flex flex-column justify-space-between align-center">
											<v-img :aspect-ratio="16/9" width="300" src="../../public/undercontruction3.png"></v-img>
										</div> 
										<h1 class="text-center display-2 teal--text text--accent-3 mb-3"><strong>UNDER CONTRUCTION</strong></h1>
										<div class="text-center">halaman ini sedang dalam pembuatan</div> 
										<div class="text-center mt-3 mb-10">
											<v-btn color="teal accent-3" dark router to="/dashboard">Kembali ke Panel</v-btn>
										</div>
									</v-card-text>
								</v-col>
							</v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'UnderContructions',
  data: () => ({
    step: 1,
    passType: '',
    username: '',
    katasandi: '',
  }),
  props: {
    source: String
  },
  methods: {
    onClickVisible(d) {
      this[d] = !this[d]
    },
  }
};
</script>

<style>
.v-text-field .v-input__control {
  border-radius: 8px !important;
}
.v-btn {
  border-radius: 8px !important;
}
.tombolLupaPass {
  text-align: center;
  cursor: pointer;
}
a:link {
  text-decoration: none;
}
</style>