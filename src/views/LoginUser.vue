<template>
  <v-app id="inspire">
    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="8">
            <v-card class="elevation-12">
              <v-window v-model="step">
                <v-window-item :value="1">
                  <v-row>
                    <v-col cols="12" md="8">
                      <v-card-text class="mt-12">
                        <h1 class="text-center display-2 light-blue--text mb-3">Login Solusi <strong>WIN.ID</strong></h1>
                        <v-form>
                          <v-col cols="12" class="py-0 px-0 mb-3">
                            <v-text-field
                              v-model="email"
                              placeholder="user@mail.com"
                              type="text"
                              color="light-blue darken-3"
                              outlined
                              hide-details
                              @keyup.enter="AutentificationLogin"
                            >
                            <template v-slot:prepend-inner>
                              <v-icon color="light-blue darken-3">email</v-icon>
                            </template>
                          </v-text-field>

                          </v-col>
                          <v-col cols="12" class="py-0 px-0 mb-3">
                            <v-text-field
                              v-model="katasandi"
                              placeholder="Kata Sandi"
                              :type="passType ? 'text' : 'password'"
                              color="light-blue darken-3"
                              outlined
                              hide-details
                              @keyup.enter="AutentificationLogin"
                            >
                                <!-- label="Kata Sandi" -->
                              <template v-slot:prepend-inner>
                                <v-icon color="light-blue darken-3">lock</v-icon>
                              </template>
                              <template v-slot:append>
                                <v-icon
                                  color="light-blue darken-3"
                                  tabindex="-1"
                                  @click="onClickVisible('passType')"
                                  >{{ passType ? 'visibility' : 'visibility_off' }}</v-icon
                                >
                              </template>
                            </v-text-field>
                          </v-col>
                        </v-form>
                        <h3 class="tombolLupaPass">
                          <router-link :to="{name: 'ForgotPass'}">Lupa Kata Sandi ?</router-link>
                        </h3>
                      </v-card-text>
                      <div class="text-center mt-3 mb-10">
                        <v-btn color="light-blue darken-3" dark @click="AutentificationLogin">Login</v-btn>
                      </div>
                    </v-col>
                    <v-col cols="12" md="4" class="light-blue darken-3 pt-15">
                      <div class="d-flex flex-column justify-space-between align-center">
                        <v-img src="../../public/logo.png" width="200" />
                      </div>
                    </v-col>
                  </v-row>
                </v-window-item>
                <v-window-item :value="2">
                  <v-row class="fill-height">
                    <v-col cols="12" md="4" class="teal accent-3">
                      <v-card-text class="white--text mt-12">
                        <h1 class="text-center display-1">Welcome Back!</h1>
                        <h5
                          class="text-center"
                        >To Keep connected with us please login with your personnel info</h5>
                      </v-card-text>
                      <div class="text-center">
                        <v-btn rounded outlined dark @click="step--">Sign in</v-btn>
                      </div>
                    </v-col>

                    <v-col cols="12" md="8">
                      <v-card-text class="mt-12">
                        <h1 class="text-center display-2 teal--text text--accent-3">Create Account</h1>
                        <div class="text-center mt-4">
                          <v-btn class="mx-2" fab color="black" outlined>
                            <v-icon>fab fa-facebook-f</v-icon>
                          </v-btn>

                          <v-btn class="mx-2" fab color="black" outlined>
                            <v-icon>fab fa-google-plus-g</v-icon>
                          </v-btn>
                          <v-btn class="mx-2" fab color="black" outlined>
                            <v-icon>fab fa-linkedin-in</v-icon>
                          </v-btn>
                        </div>
                        <h4 class="text-center mt-4">Ensure your email for registration</h4>
                        <v-form>
                          <v-text-field
                            label="Name"
                            name="Name"
                            prepend-icon="person"
                            type="text"
                            color="teal accent-3"
                          />
                          <v-text-field
                            label="Email"
                            name="Email"
                            prepend-icon="email"
                            type="text"
                            color="teal accent-3"
                          />

                          <v-text-field
                            id="password"
                            label="Password"
                            name="password"
                            prepend-icon="lock"
                            type="password"
                            color="teal accent-3"
                          />
                        </v-form>
                      </v-card-text>
                      <div class="text-center mt-n5">
                        <v-btn rounded color="teal accent-3" dark>SIGN UP</v-btn>
                      </div>
                    </v-col>
                  </v-row>
                </v-window-item>
              </v-window>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <v-dialog
        v-model="dialogNotifikasi"
        transition="dialog-bottom-transition"
        persistent
        width="500px"
      >
        <PopUpNotifikasiVue
          :notifikasi-kode.sync="notifikasiKode"
          :notifikasi-text.sync="notifikasiText"
          :notifikasi-button.sync="notifikasiButton"
          @proses="goToProses"
          @cancel="dialogNotifikasi = false"
        />
      </v-dialog>
    </v-main>
  </v-app>
</template>

<script>
import { mapActions } from "vuex";
import PopUpNotifikasiVue from "./Layout/PopUpNotifikasi.vue";
import axios from "axios";
export default {
  name: 'Login',
  components: {
    PopUpNotifikasiVue
  },
  data: () => ({
    step: 1,
    passType: '',
    email: '',
    katasandi: '',
    latitude: '',
    longitude: '',
    ip: '',

    //notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
  }),
  props: {
    source: String
  },
  mounted() {
    if(localStorage.getItem('user_token')) return this.$router.push({name: "Dashboard"});
    // this.$getLocation({
    //   enableHighAccuracy: false, //defaults to false
    //   timeout: Infinity, //defaults to Infinity
    //   maximumAge: 1000 //defaults to 0
      
    // }).then(coordinates => {
    //   this.latitude = coordinates.lat;
    //   this.longitude = coordinates.lng;
    // });
    axios
      .get('https://api.ipify.org?format=json')
      .then(response => (this.ip = response.data.ip))
    axios
      .get(`http://ip-api.com/json/${this.ip}`)
      .then(response => {
        this.latitude = response.data.lat;
        this.longitude = response.data.lon;
      })
  },
  methods: {
    ...mapActions({
      fetchData: "fetchData",
      AuthLoginUser: "authUser/AuthLoginUser",
    }),
    async AutentificationLogin(){
      const payload = {
        email: this.email,
        password: this.katasandi,
        lat: this.latitude,
        long: this.longitude
      }
      await this.AuthLoginUser(payload)
      .then((res) => {
        // console.log(res.data)
        localStorage.setItem('user_token', res.data.result.accessToken);
        localStorage.setItem('nama', res.data.result.nama);
        localStorage.setItem('siteLogin', "Peserta");
        localStorage.setItem('idLogin', res.data.result.idPeserta);
        this.notifikasi("success", res.data.message, "2")
      }).catch((err) => {
        this.notifikasi("error", err.response.data.message, "1")
      })
    },
    goToProses() {
      this.dialogNotifikasi = false
      this.$router.push({name: "Dashboard"});
    },
    onClickVisible(d) {
      this[d] = !this[d]
    },
    notifikasi(kode, text, proses){
      this.dialogNotifikasi = true
      this.notifikasiKode = kode
      this.notifikasiText = text
      this.notifikasiButton = proses
    },
  }
};
</script>

<style>
.v-text-field--outlined {
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