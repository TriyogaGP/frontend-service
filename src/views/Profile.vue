<template>
  <div>
    <v-card class="ma-1" style="border: 1px solid #000; border-radius: 5px;">
      <v-row class="ma-1">
        <v-col cols="8" class="kotakleft">
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center"
            >
              Nama Lengkap
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              <v-text-field
                v-model="dataProfile.nama"
                placeholder="Nama Lengkap"
                outlined
                dense
                label="Nama Lengkap"
                color="light-blue darken-3"
                hide-details
                :clearable="editedIndex != 2"
                :readonly="editedIndex == 2"
              />
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center"
            >
              Username
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              <v-text-field
                v-model="dataProfile.username"
                placeholder="Username"
                outlined
                dense
                label="Username"
                color="light-blue darken-3"
                hide-details
                :clearable="editedIndex != 2"
                :readonly="editedIndex == 2"
              />
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center"
            >
              Email
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              <v-text-field
                v-model="dataProfile.email"
                placeholder="Email"
                outlined
                dense
                label="Email"
                color="light-blue darken-3"
                :rules="this.dataProfile.email != '' ? [rules.emailRules] : []"
                hide-details="auto"
                :clearable="editedIndex != 2"
                :readonly="editedIndex == 2"
              />
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center"
            >
              Kata Sandi
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              <v-text-field
                v-model="dataProfile.password"
                placeholder="Kata Sandi"
                :type="passType ? 'text' : 'password'"
                outlined
                dense
                label="Kata Sandi"
                color="light-blue darken-3"
                hide-details
                :clearable="editedIndex != 2"
                :readonly="editedIndex == 2"
              >
                <template v-slot:append>
                  <v-icon
                    :class="editedIndex == 2 && `mr-1`"
                    color="light-blue darken-3"
                    tabindex="-1"
                    @click="onClickVisible('passType')"
                    >{{ passType ? 'visibility' : 'visibility_off' }}</v-icon
                  >
                  <v-icon
                    v-if="editedIndex == 2"
                    color="light-blue darken-3"
                    tabindex="-1"
                    @click="endecryptData('endecryptType')"
                    >{{ endecryptType ? 'lock' : 'lock_open' }}</v-icon
                  >
                </template>
              </v-text-field>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center"
            >
              Kabupaten / Kota
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              <v-autocomplete
                v-model="dataProfile.kota"
                :items="kotaOptions"
                item-text="text"
                item-value="text"
                placeholder="Kabupaten / Kota"
                label="Kabupaten / Kota"
                outlined
                dense
                hide-details
                :clearable="editedIndex != 2"
                :readonly="editedIndex == 2"
              />
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center"
            >
              No Handphone
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              <v-text-field
                v-model="dataProfile.noHP"
                placeholder="No Handphone"
                outlined
                dense
                label="No Handphone"
                color="light-blue darken-3"
                @keypress.native="onlyNumber($event, 15, dataProfile.noHP)"
                hide-details
                :clearable="editedIndex != 2"
                :readonly="editedIndex == 2"
              />
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center"
            >
              Alamat
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              <v-textarea
                v-model="dataProfile.alamat"
                placeholder="Alamat"
                outlined
                dense
                rows="4"
                label="Alamat"
                color="light-blue darken-3"
                hide-details
                :clearable="editedIndex != 2"
                :readonly="editedIndex == 2"
                no-resize
              />
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="4" class="light-blue darken-3 kotakright">
          <v-layout column align-center>
            <v-flex class="mt-5">
              <div class="d-flex flex-column justify-space-between align-center">
                <v-avatar size="100">
                  <v-img src="../../public/avatar.png"></v-img>
                </v-avatar>
              </div>
              <p class="white--text subheading mt-1 text-center"><strong>{{nama}}</strong></p>
              <p class="white--text text-center">{{namaRole}}</p>
            </v-flex>
          </v-layout>
          <v-divider style="border: 1px solid #FFF" />
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: 'Profile',
  data: () => ({
    nama: '',
    namaRole: '',
    dataProfile: {
      idAdmin: '',
      nama: '',
      username: '',
      email: '',
      password: '',
      kota: '',
      noHP: '',
      alamat: '',
    },
    editedIndex: 2,
    passType: '',
    endecryptType: '',
    kotaOptions: [],
    rules: {
			emailRules: value => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(value) || 'email tidak valid'
			},
		},
  }),
  mounted() {
    this.nama = localStorage.getItem("nama")
    this.namaRole = localStorage.getItem("nama_role")
    this.getProfile(localStorage.getItem("idLogin"), localStorage.getItem("siteLogin"))
    this.getKota()
    this.passType = true
  },
  methods: {
    ...mapActions(["fetchData"]),
		getProfile(id, by) {
			let payload = {
				method: "get",
				url: `auth/getProfile?id_login=${id}&by=${by}`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				let data = res.data.result;
        this.dataProfile = {
          idAdmin: data.idAdmin,
          nama: data.nama,
          username: data.username,
          email: data.email,
          password: data.kataSandi,
          kota: data.kota,
          noHP: data.noHP,
          alamat: data.alamat,
        }
			})
			.catch((err) => {
				console.log(err)
			});
		},
    getKota() {
			let payload = {
				method: "get",
				url: `settings/getWilayah?bagian=kabkotaOnly`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				this.kotaOptions = res.data.result;
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
		},
    onClickVisible(d) {
      this[d] = !this[d]
    },
    endecryptData(d) {
      this[d] = !this[d]
      let url = this[d] ? 'decryptPass' : 'encryptPass' 
      let payload = {
				method: "get",
				url: `settings/${url}?kata=${this.dataProfile.password}`,
				authToken: localStorage.getItem('user_token')
			};
      this.dataProfile.password = ''
			this.fetchData(payload)
			.then((res) => {
				this.dataProfile.password = res.data.result.hasil;
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
    },
  },
  metaInfo: {
		title: "Profile - WIN.ID",
		htmlAttrs: {
			lang: "id",
			amp: true,
		},
	},
}
</script>
<style>
.kotakleft {
	border-top-left-radius: 5px;
	border-bottom-left-radius: 5px;
  border-right: 2px solid #000;
}
.kotakright {
	border-top-right-radius: 5px;
	border-bottom-right-radius: 5px;
  padding: 10px;
}
</style>