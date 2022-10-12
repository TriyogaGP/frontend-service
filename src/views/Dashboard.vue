<template>
  <div>
    <h1 class="subheading grey--text">Dashboard</h1>
    <v-container v-if="roleID == 1">
      <v-layout row wrap>
        <v-flex sm6 xs12 md6 lg3>
          <v-card class="ma-3">
            <v-list-item>
              <v-list-item-avatar tile class="mt-n15">
                <v-sheet color="green" width="40" height="40" elevation="6">
                  <v-icon dark large>person</v-icon>
                </v-sheet>
              </v-list-item-avatar>
              <v-list-item-content>
                <div class="overline text-right">Admin</div>
                <v-list-item-title class="headline mb-1 text-right">{{ dataDashboard.jmlAdmin }} Orang</v-list-item-title>
                <div><v-divider /></div>
              </v-list-item-content>
            </v-list-item>
            <!-- <v-card-actions>
              <v-btn color="#4ba75e" dark small>
                <v-icon text class="ma-2">read_more</v-icon>
                <div class="overline">Selengkapnya</div>
              </v-btn>
            </v-card-actions> -->
          </v-card>
        </v-flex>
        <v-flex sm6 xs12 md6 lg3>
          <v-card class="ma-3">
            <v-list-item>
              <v-list-item-avatar tile class="mt-n15">
                <v-sheet color="green" width="40" height="40" elevation="10">
                  <v-icon dark large>person</v-icon>
                </v-sheet>
              </v-list-item-avatar>
              <v-list-item-content>
                <div class="overline text-right">Peserta</div>
                <v-list-item-title class="headline mb-1 text-right">{{ dataDashboard.jmlPeserta }} Orang</v-list-item-title>
                <div><v-divider /></div>
              </v-list-item-content>
            </v-list-item>
            <!-- <v-card-actions>
              <v-btn color="#4ba75e" dark small>
                <v-icon text class="ma-2">read_more</v-icon>
                <div class="overline">Selengkapnya</div>
              </v-btn>
            </v-card-actions> -->
          </v-card>
        </v-flex>
        <v-flex sm6 xs12 md6 lg3>
          <v-card class="ma-3">
            <v-list-item>
              <v-list-item-avatar tile class="mt-n15">
                <v-sheet color="green" width="40" height="40" elevation="10">
                  <v-icon dark large>event</v-icon>
                </v-sheet>
              </v-list-item-avatar>
              <v-list-item-content>
                <div class="overline text-right">Event</div>
                <v-list-item-title class="headline mb-1 text-right">{{ dataDashboard.jmlEvent }} Event</v-list-item-title>
                <div><v-divider /></div>
              </v-list-item-content>
            </v-list-item>
            <!-- <v-card-actions>
              <v-btn color="#4ba75e" dark small>
                <v-icon text class="ma-2">read_more</v-icon>
                <div class="overline">Selengkapnya</div>
              </v-btn>
            </v-card-actions> -->
          </v-card>
        </v-flex>
        <v-flex sm6 xs12 md6 lg3>
          <v-card class="ma-3">
            <v-list-item>
              <v-list-item-avatar tile class="mt-n15">
                <v-sheet color="green" width="40" height="40" elevation="10">
                  <v-icon dark large>collections</v-icon>
                </v-sheet>
              </v-list-item-avatar>
              <v-list-item-content>
                <div class="overline text-right">Barang Lelang</div>
                <v-list-item-title class="headline mb-1 text-right">{{ dataDashboard.jmlBarangLelang }} Unit</v-list-item-title>
                <div><v-divider /></div>
              </v-list-item-content>
            </v-list-item>
            <!-- <v-card-actions>
              <v-btn color="#4ba75e" dark small>
                <v-icon text class="ma-2">read_more</v-icon>
                <div class="overline">Selengkapnya</div>
              </v-btn>
            </v-card-actions> -->
          </v-card>
        </v-flex>
        <v-flex sm6 xs12 md6 lg3>
          <v-card class="ma-3">
            <v-list-item>
              <v-list-item-avatar tile class="mt-n15">
                <v-sheet color="green" width="40" height="40" elevation="10">
                  <v-icon dark large>how_to_vote</v-icon>
                </v-sheet>
              </v-list-item-avatar>
              <v-list-item-content>
                <div class="overline text-right">Lot</div>
                <v-list-item-title class="headline mb-1 text-right">{{ dataDashboard.jmlLot }} Lot</v-list-item-title>
                <div><v-divider /></div>
              </v-list-item-content>
            </v-list-item>
            <!-- <v-card-actions>
              <v-btn color="#4ba75e" dark small>
                <v-icon text class="ma-2">read_more</v-icon>
                <div class="overline">Selengkapnya</div>
              </v-btn>
            </v-card-actions> -->
          </v-card>
        </v-flex>
        <v-flex sm6 xs12 md6 lg3>
          <v-card class="ma-3">
            <v-list-item>
              <v-list-item-avatar tile class="mt-n15">
                <v-sheet color="green" width="40" height="40" elevation="10">
                  <v-icon dark large>paid</v-icon>
                </v-sheet>
              </v-list-item-avatar>
              <v-list-item-content>
                <div class="overline text-right">Pembelian NPL</div>
                <v-list-item-title class="headline mb-1 text-right">{{ dataDashboard.jmlPembelianNPL }} Pembelian</v-list-item-title>
                <div><v-divider /></div>
              </v-list-item-content>
            </v-list-item>
            <!-- <v-card-actions>
              <v-btn color="#4ba75e" dark small>
                <v-icon text class="ma-2">read_more</v-icon>
                <div class="overline">Selengkapnya</div>
              </v-btn>
            </v-card-actions> -->
          </v-card>
        </v-flex>
        <v-flex sm6 xs12 md6 lg3>
          <v-card class="ma-3">
            <v-list-item>
              <v-list-item-avatar tile class="mt-n15">
                <v-sheet color="green" width="40" height="40" elevation="10">
                  <v-icon dark large>inventory_2</v-icon>
                </v-sheet>
              </v-list-item-avatar>
              <v-list-item-content>
                <div class="overline text-right">Produk</div>
                <v-list-item-title class="headline mb-1 text-right">{{ dataDashboard.jmlProduk }} Produk</v-list-item-title>
                <div><v-divider /></div>
              </v-list-item-content>
            </v-list-item>
            <!-- <v-card-actions>
              <v-btn color="#4ba75e" dark small>
                <v-icon text class="ma-2">read_more</v-icon>
                <div class="overline">Selengkapnya</div>
              </v-btn>
            </v-card-actions> -->
          </v-card>
        </v-flex>
        <v-flex sm6 xs12 md6 lg3>
          <v-card class="ma-3">
            <v-list-item>
              <v-list-item-avatar tile class="mt-n15">
                <v-sheet color="green" width="40" height="40" elevation="10">
                  <v-icon dark large>fas fa-percent</v-icon>
                </v-sheet>
              </v-list-item-avatar>
              <v-list-item-content>
                <div class="overline text-right">Promo Produk</div>
                <v-list-item-title class="headline mb-1 text-right">{{ dataDashboard.jmlPromosi }} Promo</v-list-item-title>
                <div><v-divider /></div>
              </v-list-item-content>
            </v-list-item>
            <!-- <v-card-actions>
              <v-btn color="#4ba75e" dark small>
                <v-icon text class="ma-2">read_more</v-icon>
                <div class="overline">Selengkapnya</div>
              </v-btn>
            </v-card-actions> -->
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <v-container v-if="siteLogin == 'Peserta'">
			<v-layout row wrap>
        <v-flex sm6 xs12 md6 lg3 v-for="(item, i) in DataEventActive" :key="i">
					<v-card class="ma-3" height="420">
						<v-list-item>
							<v-list-item-content>
                <img :src="item.gambar ? `${API_URL}image/event/${item.gambar}` : `${API_URL}No_Image_Available.jpg`" width="200" height="150"/>
								<div class="mt-1"><v-divider /></div>
								<div class="overline text-right"><strong>{{ item.namaEvent }}</strong></div>
								<div class="text-right">{{ item.kodeEvent }}</div>
								<div class="text-right">{{ item.tanggalEvent }}</div>
								<div class="text-right">kata sandi : {{ item.kataSandiEvent }}</div>
                <v-text-field
                  v-model="dataPass[i].katasandi"
                  placeholder="Kata Sandi Event"
                  :type="dataPass[i].passType ? 'text' : 'password'"
                  outlined
                  dense
                  label="Kata Sandi Event"
                  color="light-blue darken-3"
                  class="mb-2"
                  hide-details
                  clearable
                >
                  <template v-slot:append>
                    <v-icon
                      color="light-blue darken-3"
                      tabindex="-1"
                      @click="onClickVisible(i)"
                      >{{ dataPass[i].passType ? 'visibility' : 'visibility_off' }}</v-icon
                    >
                  </template>
                </v-text-field>
                <v-autocomplete
                  v-model="dataPass[i].no_npl"
                  :items="DataNPL.filter((el) => el.id_event == item.idEvent)"
                  item-text="no_npl"
                  item-value="no_npl"
                  placeholder="No. NPL"
                  label="No. NPL"
                  class="mb-2"
                  outlined
                  dense
                  hide-details
                  no-data-text="Tidak ada data yang tersedia"
                  clearable
                />
							</v-list-item-content>
						</v-list-item>
            <div class="text-right">
              <v-btn
                color="light-blue darken-3"
                small
                dense
                depressed
                class="ma-2 white--text text--darken-2"
                @click="enterRoom(item)"
              >
                <v-icon small>exit_to_app</v-icon> Masuk Room
              </v-btn>
            </div>
					</v-card>
				</v-flex>
      </v-layout>
    </v-container>
    <div v-for="(item, i) in DataEventActive" :key="i">
      <div v-if="dataPass[i].panel">    
        <v-divider style="border: 1px solid #000" />
        <h1 class="subheading grey--text">Panel Bidding</h1>
        <v-card class="ma-3 pa-1" style="border: 5px solid #000; border-radius: 5px;">
          <v-row class="ma-1">
            <v-col cols="3" class="light-blue darken-3 kotakleft">
              <h4 class="text-center white--text text--darken-2"><u>Bid Terakhir</u></h4>
              <div class="kotakBid">
                <h4 class="text-center"><u>HARGA AWAL</u></h4>
                Rp. {{ currencyDotFormat(dataRoom.hargaAwal) }}
              </div>
              <div class="kotakBid">
                <h4 class="text-center"><u>HARGA SEKARANG</u></h4>
                Rp. {{ currencyDotFormat(dataBidding.harga.toString()) }}
              </div>
              <h4 class="text-center white--text text--darken-2"><u>NAMA</u></h4>
              <div class="kotakBid">
                <h6 class="text-center" style="font-size: 8pt">{{ dataBidding.nama }} ({{ dataBidding.no_npl }})</h6>
              </div>
              <h4 class="text-center white--text text--darken-2"><u>PEMENANG</u></h4>
              <div class="kotakBid">
                <h4 class="text-center"><u>PEMENANG</u></h4>
                <h6 class="text-center" style="font-size: 8pt">{{ dataPemenang.nama }} ({{ dataPemenang.no_npl }})</h6>
                Rp. {{ currencyDotFormat(dataPemenang.harga.toString()) }}
              </div>
              <div class="d-flex justify-center mt-5">
                <v-btn
                  color="lime accent-3"
                  large
                  dense
                  depressed
                  class="black--text text--darken-2"
                  :disabled="tombolBid"
                  @click="BidLelang()"
                >
                  <v-icon small>fas fa-bullhorn</v-icon> Bid Lelang
                </v-btn>
              </div>
            </v-col>
            <v-col cols="9" class="lime accent-3 kotakright scrollTextUser">
              <div class="kotakjoinleave" :hidden="hiddenLog">{{ joinPesan }}</div>
              <div class="text-center">
                <v-carousel v-if="fotoArray.length" :v-model="0" height="auto" hide-delimiters>
                  <v-carousel-item
                    v-for="(pic, i) in fotoArray"
                    :key="i"
                  >
                    <v-row class="ma-1" align="center" justify="center">
                      <img :src="pic ? `${API_URL}image/kelengkapan-barang-lelang/${pic}` : `${API_URL}No_Image_Available.jpg`" width="450" height="250"/>
                    </v-row>
                  </v-carousel-item>
                </v-carousel>
                <img v-else :src="`${API_URL}No_Image_Available.jpg`" width="450" height="250"/>
              </div>
              <h4><u>Kelengkapan Barang Lelang</u></h4>
              <v-row no-gutters>
                <v-col cols="12" class="text-center">
                  <img :src="data_barang_lelang.ktpPemilik ? `${API_URL}image/kelengkapan-barang-lelang/${data_barang_lelang.ktpPemilik}` : `${API_URL}No_Image_Available.jpg`" title="BERKAS KTP" width="120" height="90" class="ma-2"/>
                  <img :src="data_barang_lelang.stnk ? `${API_URL}image/kelengkapan-barang-lelang/${data_barang_lelang.stnk}` : `${API_URL}No_Image_Available.jpg`" title="BERKAS STNK" width="120" height="90" class="ma-2"/>
                  <img :src="data_barang_lelang.bpkb ? `${API_URL}image/kelengkapan-barang-lelang/${data_barang_lelang.bpkb}` : `${API_URL}No_Image_Available.jpg`" title="BERKAS BPKB" width="120" height="90" class="ma-2"/>
                  <img :src="data_barang_lelang.faktur ? `${API_URL}image/kelengkapan-barang-lelang/${data_barang_lelang.faktur}` : `${API_URL}No_Image_Available.jpg`" title="BERKAS FAKTUR" width="120" height="90" class="ma-2"/>
                  <img :src="data_barang_lelang.kwitansi ? `${API_URL}image/kelengkapan-barang-lelang/${data_barang_lelang.kwitansi}` : `${API_URL}No_Image_Available.jpg`" title="BERKAS KWITANSI" width="120" height="90" class="ma-2"/>
                </v-col>
              </v-row>
              <v-row no-gutters class="font-weight-bold">
                <v-col cols="3">Nama Barang Lelang<span style="float: right;">:</span></v-col>
                <v-col cols="8">&nbsp;{{ data_barang_lelang.namaBarangLelang }}</v-col>
              </v-row>
              <v-row no-gutters class="font-weight-bold">
                <v-col cols="3">Tahun<span style="float: right;">:</span></v-col>
                <v-col cols="8">&nbsp;{{ data_barang_lelang.tahun }}</v-col>
              </v-row>
              <v-row no-gutters class="font-weight-bold">
                <v-col cols="3">Lokasi<span style="float: right;">:</span></v-col>
                <v-col cols="8">&nbsp;{{ data_barang_lelang.lokasiBarang }}</v-col>
              </v-row>
              <v-row no-gutters class="font-weight-bold">
                <v-col cols="3">Grade Barang<span style="float: right;">:</span></v-col>
                <v-col cols="8">&nbsp;{{ data_barang_lelang.grade }}</v-col>
              </v-row>
              <v-row no-gutters class="font-weight-bold">
                <v-col cols="3">Deskripsi<span style="float: right;">:</span></v-col>
                <v-col cols="8">&nbsp;{{ data_barang_lelang.deskripsi }}</v-col>
              </v-row>
              <v-row>
                <v-col cols="6">
                  <v-btn
                    style="float: left;"
                    color="green darken-3"
                    small
                    dense
                    depressed
                    class="mt-2 mr-2 white--text text--darken-2"
                    :disabled="tombolJoin"
                    @click="JoinBidding()"
                  >
                    <v-icon small>play_arrow</v-icon> Join Lelang
                  </v-btn>
                </v-col>
                <v-col cols="6">
                  <!-- <v-btn
                    v-if="noLOT.length"
                    style="float: right;"
                    color="light-blue darken-3"
                    small
                    dense
                    depressed
                    class="mt-2 white--text text--darken-2"
                    :disabled="tombolLanjut"
                    @click="nextRoom(noLOT[0])"
                  >
                    <v-icon small>arrow_forward</v-icon> Lanjut Bid
                  </v-btn> -->
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card>
      </div>
    </div>
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
        @cancel="dialogNotifikasi = false"
      />
				<!-- @proses="goToProses" -->
    </v-dialog>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import PopUpNotifikasiVue from "./Layout/PopUpNotifikasi.vue";
import io from 'socket.io-client'
export default {
  name: 'Dashboard',
  components: { PopUpNotifikasiVue },
  data: () => ({
    API_URL: '',
    roleID: '',
    siteLogin: '',
    dataDashboard: {},
    DataPembelianNPL: [],
    DataEventActive: [],
    DataNPL: [],
    joinPesan: '',
    hiddenLog: true,
    tombolBid: true,
    tombolJoin: true,
    tombolStop: true,
    tombolLanjut: true,
    dataPass: [{
      id_event: '',
      katasandi: '', 
      passType: '', 
      panel: false, 
    }],
    dataBidding: {
      harga: 0,
      nama: '',
      no_npl: '',
      id_bidding: '',
    },
    dataPemenang: {
      harga: 0,
      nama: '',
      no_npl: '',
    },
    currentLOT: '',
    currentNPL: '',
    currentIDNPL: '',
    dataRoom: {},
    noLOT: [],
    fotoArray: [],
    dataEvent: '',
    data_barang_lelang: '',

    //notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
  }),
  metaInfo: {
		title: "Dashboard - WIN.ID",
		htmlAttrs: {
			lang: "id",
			amp: true,
		},
	},
  created() {
    this.siteLogin = localStorage.getItem('siteLogin')
    if(this.siteLogin == 'Peserta') {
      this.API_URL = process.env.VUE_APP_NODE_ENV === "production" ? process.env.VUE_APP_VIEW_PROD_API_URL : process.env.VUE_APP_VIEW_DEV_API_URL
      const socket = io(this.API_URL);
      socket.on("tombolJoin", (tombol) => {
        this.tombolJoin = tombol
      });
      socket.on("done-bidding", (pesan) => {
        this.tombolBid = true
        this.tombolJoin = true
        this.getBidLelang()
        this.notifikasi("success", pesan, "1")
      });
    }
  },
  mounted() {
    // if(!localStorage.getItem('user_token')) return this.$router.push({name: "Login"});
    this.API_URL = process.env.VUE_APP_NODE_ENV === "production" ? process.env.VUE_APP_VIEW_PROD_API_URL : process.env.VUE_APP_VIEW_DEV_API_URL
    this.roleID = localStorage.getItem('roleID')
		this.siteLogin = localStorage.getItem('siteLogin')
    this.siteLogin == 'Admin' ? this.getDataDashboard() : this.getBidLelang();
	},
	methods: {
		...mapActions(["fetchData"]),
		getDataDashboard() {
			let payload = {
				method: "get",
				url: `auth/getDashboard?id_role=${this.roleID}&by=${this.siteLogin}`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				this.dataDashboard = res.data.result;
			})
			.catch((err) => {
				console.log(err)
			});
		},
		getBidLelang() {
      this.DataEventActive = []
			let payload = {
				method: "get",
				url: `lelang/getBidLelang?id_peserta=${localStorage.getItem('idLogin')}`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				this.DataPembelianNPL = res.data.result;
        this.dataPass = []
        this.DataPembelianNPL.map((val) => {
          this.DataEventActive.push(val.Event)
          val.NPL.map((valNPL) => {
            this.DataNPL.push({ 
              id_event: valNPL.idEvent,
              no_npl: valNPL.noNpl,
              npl: valNPL.npl,
              status_npl: valNPL.statusNPL,
            })
          })
        })
        this.DataEventActive.map((val) => {
          const emit = {
            id_event: val.idEvent,
            no_npl: '',
            katasandi: '',
            passType: '',
            panel: false,
          }
          this.dataPass.push(emit)
        })
			})
			.catch((err) => {
        // this.notifikasi("warning", err.response.data.message, "2")
				console.log(err)
			});
		},
    getEvent(nolot) {
      this.fotoArray = []
			let payload = {
				method: "get",
				url: `lelang/getRoomEvent?no_lot=${nolot}`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
        this.noLOT.splice(0, 1);
        this.currentLOT = nolot
				this.dataRoom = res.data.result;
				this.dataEvent = this.dataRoom.Event
				this.data_barang_lelang = this.dataRoom.BarangLelang
        this.dataRoom.dataFotoBarangLelang.map((el) => {
          this.fotoArray.push(el.gambar)
        })
        // console.log(this.fotoArray)
			})
			.catch((err) => {
        console.log(err)
			});
		},
    enterRoom(item) {
      let data = this.dataPass.filter((val) => val.id_event == item.idEvent)
      const dataNPL = this.DataNPL.filter((val) => val.no_npl == data[0].no_npl)

      if(!data[0].katasandi){
        data[0].katasandi = ''
        data[0].no_npl = ''
        data[0].panel = false
        return this.notifikasi("warning", "Masukan Kata Sandi Event !", "1")
      }else if(!data[0].no_npl){
        data[0].katasandi = ''
        data[0].no_npl = ''
        data[0].panel = false
        return this.notifikasi("warning", "Pilih No. NPL anda !", "1")
      }else if(dataNPL[0].status_npl != 0){
        data[0].katasandi = ''
        data[0].no_npl = ''
        data[0].panel = false
        return this.notifikasi("warning", "No. NPL anda sudah digunakan !", "1")
      }else if(data[0].katasandi == item.kataSandiEvent){
        if(!item.LOT.length){
          data[0].katasandi = ''
          data[0].no_npl = ''
          data[0].panel = false
          return this.notifikasi("warning", "Event ini Belum siap !", "1")
        }else{
          item.LOT.map((el) => {
            this.noLOT.push(el.noLot)
          })
          data[0].katasandi = ''
          this.currentNPL = data[0].no_npl
          data[0].no_npl = ''
          data[0].panel = true
          this.getEvent(item.LOT[0].noLot)
        }
      }else{
        data[0].katasandi = ''
        data[0].no_npl = ''
        data[0].panel = false
        return this.notifikasi("warning", "Kata Sandi Event tidak cocok !", "1")
      }
    },
    JoinBidding() {
      this.DataPembelianNPL.map((val) => {
        val.NPL.map((valNPL) => {
          if(valNPL.noNpl == this.currentNPL){
            this.currentIDNPL = valNPL.idNpl
          }  
        })
      })
      // console.log(this.currentNPL, this.currentIDNPL)
      this.tombolBid = false
      this.tombolJoin = true
      const socket = io(this.API_URL);
      socket.emit("join-bidding", { 
        room: this.currentLOT + "_" + this.dataEvent.namaEvent, 
        id_peserta: localStorage.getItem('idLogin'), 
        id_event: this.dataEvent.idEvent, 
        id_npl: this.currentIDNPL, 
        id_lot: this.dataRoom.idLot, 
        device: "laptop", 
        is_admin: 0
      });
			socket.on("join-message", (pesan) => {
        this.joinPesan = pesan;
				this.hiddenLog = false
				setTimeout(() => {
          this.joinPesan = '';
          this.hiddenLog = true
				}, 5000);
			});
			socket.on("bid", ({ dataBid }) => {
        if(dataBid.totalUserBid > 0) {
          this.dataBidding = {
            harga: parseInt(dataBid.nilaiAkhir) + parseInt(this.dataRoom.harga_awal),
            nama: dataBid.dataBidding.nama,
            no_npl: dataBid.dataBidding.no_npl,
            id_bidding: dataBid.dataBidding.id_bidding,
          }
          if(this.dataBidding.nama != localStorage.getItem('nama') && this.dataRoom.id_lot == dataBid.dataBidding.id_lot) return this.tombolBid = false
          this.tombolBid = true
        }else{
          this.dataBidding = {
            harga: 0,
            nama: '',
            no_npl: '',
            id_bidding: '',
          }
        } 
      });
    },
    BidLelang() {
      this.tombolBid = true
      const socket = io(this.API_URL);
      socket.emit("bid", { 
        room: this.currentLOT + "_" + this.dataEvent.namaEvent, 
        id_npl: this.currentIDNPL, 
        id_lot: this.dataRoom.idLot, 
        harga_bidding: this.dataEvent.kelipatanBid, 
        is_admin: 0
      });
    },
    sendMessage(item) {
      let data = this.dataPass.filter((val) => val.id_event == item.idEvent)
      const dataNPL = this.DataNPL.filter((val) => val.no_npl == data[0].no_npl)

      if(!data[0].katasandi){
        data[0].katasandi = ''
        data[0].no_npl = ''
        return this.notifikasi("warning", "Masukan Kata Sandi Event !", "1")
      }else if(!data[0].no_npl){
        data[0].katasandi = ''
        data[0].no_npl = ''
        return this.notifikasi("warning", "Pilih No. NPL anda !", "1")
      }else if(dataNPL[0].status_npl != 0){
        data[0].katasandi = ''
        data[0].no_npl = ''
        return this.notifikasi("warning", "No. NPL anda tidak bisa digunakan !", "1")
      }else if(data[0].katasandi == item.kataSandiEvent){
        if(!item.LOT.length){
          data[0].katasandi = ''
          data[0].no_npl = ''
          return this.notifikasi("warning", "Event ini Belum siap !", "1")
        }else{
          data[0].katasandi = ''
          data[0].no_npl = ''
          // let routeData = this.$router.resolve({name: 'Bidding', params: { no_lot: item.data_lot.no_lot, nama_event: item.nama_event, nama: localStorage.getItem('nama') }});
          // window.open(routeData.href, '_blank');
        }
      }else{
        data[0].katasandi = ''
        data[0].no_npl = ''
        return this.notifikasi("warning", "Kata Sandi Event tidak cocok !", "1")
      }

      // console.log(item)
    },
    onClickVisible(i) {
      this.dataPass[i].passType = !this.dataPass[i].passType
    },
    // goToProses(){
		// 	if(localStorage.getItem('siteLogin') == 'Admin') {
		// 		localStorage.removeItem('user_token');
		// 		localStorage.removeItem('nama');
		// 		localStorage.removeItem('nama_role');
		// 		localStorage.removeItem('roleID');
		// 		localStorage.removeItem('siteLogin');
		// 		this.$router.push({name: "Login"});
		// 	}else{
		// 		localStorage.removeItem('user_token');
		// 		localStorage.removeItem('nama');
		// 		localStorage.removeItem('siteLogin');
		// 		this.$router.push({name: "LoginUser"});
		// 	}
		// },
    notifikasi(kode, text, proses){
      this.dialogNotifikasi = true
      this.notifikasiKode = kode
      this.notifikasiText = text
      this.notifikasiButton = proses
    },
  }
}
</script>

<style>
img {
	border-style: solid !important;
	border-radius: 10px !important;
	padding: 2px !important;
}
.kotakjoinleave {
	border-radius: 5px;
	border: 2px solid #000;
	color: rgb(255, 255, 255);
	background: #626262;
	margin-bottom: 4px;
	text-align: center;
	font-size: 10pt;
}
.message {
	border-radius: 5px;
	border: 2px solid #000;
	color: rgb(0, 0, 0);
	margin-bottom: 4px;
	padding: 5px;
	text-align: left;
	font-size: 9pt;
	width: 350px;
	text-align: justify;
}
#kotakchatright {
	background: #f5a613;
	float: right;
}
#kotakchatleft {
	background: #13f553;
	float: left;
}
.kotakchatrightAdmin {
	border-radius: 5px;
	border: 2px solid #000;
	color: rgb(255, 255, 255);
	background: #4000ff;
	margin-bottom: 4px;
	padding: 5px;
	text-align: left;
	font-size: 9pt;
	width: 350px;
	text-align: justify;
	float: right;
}
.kotakchatleftAdmin {
	border-radius: 5px;
	border: 2px solid #000;
	color: rgb(255, 255, 255);
	background: #4000ff;
	margin-bottom: 4px;
	padding: 5px;
	text-align: left;
	font-size: 9pt;
	width: 350px;
	text-align: justify;
	float: left;
}
.kotakleft {
	border-top-left-radius: 5px;
	border-bottom-left-radius: 5px;
}
.kotakright {
	border-top-right-radius: 5px;
	border-bottom-right-radius: 5px;
  padding: 10px;
}
.kotakTengah {
	border-radius: 5px;
	border: 2px dotted #000;
  height: 300px !important;
}
.scrollTextUser{
  max-height: 470px !important;
  overflow-y: auto !important;
  overflow-x: hidden !important;
}
.scrollText{
  max-height: 300px !important;
  overflow-y: auto !important;
}
.tulisanNamaPeserta {
	color: #FFF;
	font-size: 8pt;
	font-weight: bold;
}
.tulisan {
	color: #FFF;
}
.tulisan2 {
	color: #FFF;
	font-size: 10pt;
}
.tulisanChat {
	color: #000;
	font-weight: bold;
	font-size: 10pt;
}
.tulisanChatAdmin {
	color: #000;
	font-weight: bold;
	font-size: 10pt;
}
/* .SelectedTile:hover {
	border-radius: 5px;
	background: #23b9ff;
	color: rgb(0, 0, 0);
}
.SelectedTile-active {
	border-radius: 5px;
	background: rgb(12, 85, 5);
	color: #FFF;
} */
.kotakBid {
	border: 2px dashed #000;
	border-radius: 5px;
	text-align: center;
	background: #FFF;
	color: #000;
	margin: 5px;
}
</style>