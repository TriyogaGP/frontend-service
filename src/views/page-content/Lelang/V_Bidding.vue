<template>
  <div>
    <v-card :class="roleID == 5 && 'mt-2 mb-2 pa-1'" :outlined="roleID == 5" elevation="0">
      <h1 class="subheading grey--text">Data Event </h1>
      <v-container>
        <v-layout row wrap>
          <v-flex sm6 xs12 md6 lg3 v-for="(item, i) in DataEventActive" :key="i">
            <v-card class="ma-3" height="370">
              <v-list-item>
                <v-list-item-content>
                  <img :src="item.gambar ? `${API_URL}image/event/${item.gambar}` : `${API_URL}No_Image_Available.jpg`" width="200" height="150"/>
                  <div class="mt-1"><v-divider /></div>
                  <div class="overline text-right"><strong>{{ item.namaEvent }}</strong></div>
                  <div class="text-right">{{ item.kodeEvent }}</div>
                  <div class="text-right">{{ item.startEvent }}</div>
                  <div class="text-right">kata sandi : {{ item.kataSandiEvent }}</div>
                  <v-text-field
                    v-model="dataPass[i].katasandi"
                    placeholder="Kata Sandi Event"
                    :type="dataPass[i].passType ? 'text' : 'password'"
                    outlined
                    dense
                    label="Kata Sandi Event"
                    color="light-blue darken-3"
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
        <div v-if="dataPass[i].panel && EventPanel == true">    
          <v-divider style="border: 1px solid #000" />
          <h1 class="subheading grey--text">Panel Bidding</h1>
          <v-card class="ma-3 pa-1" style="border: 5px solid #000; border-radius: 5px;">
            <v-row class="ma-1">
              <v-col cols="3" class="light-blue darken-3 kotakleft">
                <h5 class="text-center white--text text--darken-2"><u>Bid Terakhir</u></h5>
                <div class="kotakBid">
                  <h5 class="text-center"><u>HARGA AWAL</u></h5>
                  Rp. {{ currencyDotFormat(dataRoom.hargaAwal) }}
                </div>
                <div class="kotakBid">
                  <h5 class="text-center"><u>HARGA SEKARANG</u></h5>
                  Rp. {{ currencyDotFormat(dataBidding.harga.toString()) }}
                </div>
                <h5 class="text-center white--text text--darken-2"><u>NAMA</u></h5>
                <div class="kotakBid">
                  <h6 class="text-center" style="font-size: 8pt">{{ dataBidding.nama }} ({{ dataBidding.no_npl }})</h6>
                </div>
                <h5 class="text-center white--text text--darken-2"><u>PEMENANG</u></h5>
                <div class="kotakBid">
                  <h5 class="text-center"><u>PEMENANG</u></h5>
                  <h6 class="text-center" style="font-size: 8pt">{{ dataPemenang.nama }} ({{ dataPemenang.no_npl }})</h6>
                  Rp. {{ currencyDotFormat(dataPemenang.harga.toString()) }}
                </div>
                <h5 class="text-center white--text text--darken-2"><u>Waktu Lelang</u></h5>
                <div class="timer">
                  <Countdown 
                    :starttime="starttime" 
                    :endtime="endtime"
                    :kondisi="timerKondisi" 
                    :selesaitombol="selesaiBid" 
                    trans='{  
                    "day":"Hari",
                    "hours":"Jam",
                    "minutes":"Menit",
                    "seconds":"Detik",
                    "expired":"Event has been expired.",
                    "running":"Till the end of event.",
                    "upcoming":"Till start of event.",
                    "status": {
                      "expired":"Expired",
                      "running":"Running",
                      "upcoming":"Future"
                    }}'
                    @selesaiwaktu="valuesData"
                    @selesaitrig="valuesData2"/>
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
                <h5><u>Kelengkapan Barang Lelang</u></h5>
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
                  <v-col cols="3"><h5>Nama Barang Lelang<span style="float: right;">:</span></h5></v-col>
                  <v-col cols="8"><h5>&nbsp;{{ data_barang_lelang.namaBarangLelang }}</h5></v-col>
                </v-row>
                <v-row no-gutters class="font-weight-bold">
                  <v-col cols="3"><h5>Tahun<span style="float: right;">:</span></h5></v-col>
                  <v-col cols="8"><h5>&nbsp;{{ data_barang_lelang.tahun }}</h5></v-col>
                </v-row>
                <v-row no-gutters class="font-weight-bold">
                  <v-col cols="3"><h5>Lokasi<span style="float: right;">:</span></h5></v-col>
                  <v-col cols="8"><h5>&nbsp;{{ data_barang_lelang.lokasiBarang }}</h5></v-col>
                </v-row>
                <v-row no-gutters class="font-weight-bold">
                  <v-col cols="3"><h5>Grade Barang<span style="float: right;">:</span></h5></v-col>
                  <v-col cols="8"><h5>&nbsp;{{ data_barang_lelang.grade }}</h5></v-col>
                </v-row>
                <v-row no-gutters class="font-weight-bold">
                  <v-col cols="3"><h5>Deskripsi<span style="float: right;">:</span></h5></v-col>
                  <v-col cols="8"><h5>&nbsp;{{ data_barang_lelang.deskripsi }}</h5></v-col>
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
                      :disabled="tombolStart"
                      @click="MulaiBidding()"
                    >
                      <v-icon small>play_arrow</v-icon> Start Lelang
                    </v-btn>
                    <v-btn
                      style="float: left;"
                      color="red darken-3"
                      small
                      dense
                      depressed
                      class="mt-2 white--text text--darken-2"
                      :disabled="tombolStop"
                      @click="SelesaiBidding(true)"
                      >
                      <v-icon small>block</v-icon> Stop Lelang
                    </v-btn>
                  </v-col>
                  <v-col cols="6">
                    <v-btn
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
                    </v-btn>
                    <v-btn
                      style="float: right; margin-right: 5px;"
                      color="light-blue darken-3"
                      small
                      dense
                      depressed
                      class="mt-2 white--text text--darken-2"
                      @click="() => { EventPanel = false }"
                    >
                      <v-icon small>exit_to_app</v-icon> Keluar Panel
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-card>
        </div>
      </div>
    </v-card>
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
    </v-dialog>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import PopUpNotifikasiVue from "../../Layout/PopUpNotifikasi.vue";
import Countdown from '../../Layout/CountDown.vue';
import io from 'socket.io-client'
export default {
  name: "Bidding",
  components: {
    PopUpNotifikasiVue,
    Countdown
  },  
  data() {  
    return {  
      DataEventActive: [],
      roleID: '',
      API_URL: '',
      url_socket: '',
      pesan: '',
      joinPesan: '',
      hiddenLog: true,
      tombolBid: true,
      tombolStart: false,
      tombolStop: true,
      tombolLanjut: true,
      kondisiTimer: true,
      selesaiBid: false,
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
      dataRoom: {},
      noLOT: [],
      fotoArray: [],
      dataEvent: '',
		  data_barang_lelang: '',

      starttime: new Date(), 
      endtime: "",
      EventPanel: false,

      //notifikasi
      dialogNotifikasi: false,
      notifikasiKode: '',
      notifikasiText: '',
      notifikasiButton: '',
    };  
  },
  computed:{
    timerKondisi() {
      return this.kondisiTimer
    },
  },
  mounted() {
    this.roleID = localStorage.getItem("roleID")
    this.API_URL = process.env.VUE_APP_NODE_ENV === "production" ? process.env.VUE_APP_VIEW_PROD_API_URL : process.env.VUE_APP_VIEW_DEV_API_URL
    this.getEventActive()
  },
  methods: {
    ...mapActions(["fetchData"]),
		getEventActive() {
      this.DataEventActive = []
			let payload = {
				method: "get",
				url: `lelang/getEventActive`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				this.DataEventActive = res.data.result;
        this.dataPass = []
        this.DataEventActive.map((val) => {
          const emit = {
            id_event: val.idEvent,
            katasandi: '',
            passType: '',
            panel: false,
          }
          this.dataPass.push(emit)
        })
			})
			.catch((err) => {
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
    nextRoom(nolot) {
      // console.log(nolot)
      this.tombolStart = false
      this.getEvent(nolot)
      this.dataBidding = {
        harga: 0,
        nama: '',
        no_npl: '',
        id_bidding: '',
      }
      this.dataPemenang = {
        harga: 0,
        nama: '',
        no_npl: '',
      }
    },
    enterRoom(item) {
      let data = this.dataPass.filter((val) => val.id_event == item.idEvent)
      if(!data[0].katasandi){
        data[0].katasandi = ''
        data[0].panel = false
        this.EventPanel = false
        return this.notifikasi("warning", "Masukan Kata Sandi Event !", "1")
      }else if(data[0].katasandi == item.kataSandiEvent){
        if(!item.LOT.length){
          data[0].katasandi = ''
          data[0].panel = false
          this.EventPanel = false
          return this.notifikasi("warning", "Event ini Belum siap !", "1")
        }else if(item.LOT.length){
          item.LOT.map((el) => {
            this.noLOT.push(el.noLot)
          })
          data[0].katasandi = ''
          data[0].panel = true
          this.EventPanel = true
          this.getEvent(item.LOT[0].noLot)
        }
      }else{
        data[0].katasandi = ''
        data[0].panel = false
        this.EventPanel = false
        return this.notifikasi("warning", "Kata Sandi Event tidak cocok !", "1")
      }
    },
    MulaiBidding() {
      this.tombolBid = false
      this.tombolStart = true
      this.tombolStop = false
      this.selesaiBid = false
      const socket = io(this.API_URL);
      socket.emit("join-bidding", { 
        room: this.currentLOT + "_" + this.dataEvent.namaEvent, 
        id_peserta: localStorage.getItem('idLogin'), 
        id_event: this.dataEvent.idEvent, 
        id_npl: 0, 
        id_lot: this.dataRoom.idLot, 
        device: "laptop", 
        is_admin: 1 
      });
      socket.emit("tombolJoin", false);
			socket.on("join-message", (pesan) => {
        this.joinPesan = pesan;
				this.hiddenLog = false
				setTimeout(() => {
          this.joinPesan = '';
          this.hiddenLog = true
				}, 5000);
			});
			socket.on("lot-data", (data) => {
        this.kondisiTimer = false
        this.endtime = data.expiredAt
			});
			socket.on("bid", ({ dataBid }) => {
        // console.log(dataBid);
        if(dataBid.totalUserBid > 0) {
          this.dataBidding = {
            harga: parseInt(dataBid.nilaiAkhir) + parseInt(this.dataRoom.hargaAwal),
            nama: dataBid.dataBidding.nama,
            no_npl: dataBid.dataBidding.no_npl,
            id_bidding: dataBid.dataBidding.idBidding,
          }
          if(this.dataBidding.nama != localStorage.getItem('nama') && this.dataRoom.idLot == dataBid.dataBidding.idLot) return this.tombolBid = false
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
      socket.on("send-pemenang", (dataPemenang) => {
        this.dataPemenang = {
          harga: parseInt(dataPemenang.nominal),
          nama: dataPemenang.nama,
          no_npl: dataPemenang.no_npl,
        }
      });
    },
    SelesaiBidding(done = false) {
      const socket = io(this.API_URL);
      socket.emit("tombolBid", true);
      socket.emit("done-bidding", `Lot dengan no ${this.currentLOT} telah berakhir, silahkan pindah ke Lot selanjutnya terimakasih !`);
      this.tombolLanjut = false
      this.tombolBid = true
      this.tombolStart = true
      this.tombolStop = true
      this.kondisiTimer = true
      this.selesaiBid = done
    },
    BidLelang() {
      this.tombolBid = true
      const socket = io(this.API_URL);
      socket.emit("bid", { 
        room: this.currentLOT + "_" + this.dataEvent.namaEvent, 
        id_npl: localStorage.getItem('idLogin'), 
        id_lot: this.dataRoom.idLot, 
        harga_bidding: this.dataEvent.kelipatanBid, 
        is_admin: 1 
      });
    },
    sendPemenang() {
      const socket = io(this.API_URL);
      socket.emit("send-pemenang", {
        create_by: localStorage.getItem('idLogin'),
        id_bidding: this.dataBidding.id_bidding,
        nominal: this.dataBidding.harga,
        nama: this.dataBidding.nama,
        no_npl: this.dataBidding.no_npl,
      });
    },
    valuesData(val) {
      if (val) {
        this.kondisiTimer = val
        this.SelesaiBidding(false)
        this.sendPemenang()
      }
    },
    valuesData2(val) {
      if (val) {
        this.kondisiTimer = val
        this.SelesaiBidding(true)
        this.sendPemenang()
      }
    },
    sendMessage(item) {
      let data = this.dataPass.filter((val) => val.id_event == item.id_event)
      if(!data[0].katasandi){
        data[0].katasandi = ''
        return this.notifikasi("warning", "Masukan Kata Sandi Event !", "1")
      }else if(data[0].katasandi == item.katasandi_event){
        if(!item.data_lot){
          data[0].katasandi = ''
          return this.notifikasi("warning", "Event ini Belum siap !", "1")
        }else if(item.data_lot){
          data[0].katasandi = ''
          let routeData = this.$router.resolve({name: 'Bidding', params: { no_lot: item.data_lot.no_lot, nama_event: item.nama_event, nama: localStorage.getItem('nama') }});
          window.open(routeData.href, '_blank');
        }
      }else{
        data[0].katasandi = ''
        return this.notifikasi("warning", "Kata Sandi Event tidak cocok !", "1")
      }

    },  
    onClickVisible(i) {
      this.dataPass[i].passType = !this.dataPass[i].passType
    },
    random() {
      return Math.floor(Math.random() * this.fotoArray.length);
    },
    notifikasi(kode, text, proses){
      this.dialogNotifikasi = true
      this.notifikasiKode = kode
      this.notifikasiText = text
      this.notifikasiButton = proses
    },
  },  
}
</script>

<style lang="scss">
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
.timer {
  font-size: 20px;
  color: #fff;
  text-align:center;
  margin-top: 5px;

  .day, .hour, .min, .sec {
    font-size: 15px;
    display: inline-block;
    font-weight: 500;
    text-align: center;
    margin: 0 2px;
    .format {
      font-weight: 300;
      font-size: 12px;
      //@include margin-start(5);
      //display: inline-block;
      opacity: 0.8;
      width: 60px;
    }
  }
  .number{
    background: rgba(51, 51, 51, 0.53);
    padding: 0 5px;
    border-radius: 5px;
    display: inline-block;
    width: 30px;
    text-align: center;
  }
  .message {
    font-size: 14px;
    font-weight: 400;
    margin-top: 5px;
  }
  .status-tag{
    width: 270px;
    margin: 10px auto;
    padding: 8px 0;
    font-weight: 500;
    color: #000;
    text-align: center;
    border-radius: 15px;
    &.upcoming{
      background-color: lightGreen;
    }
    &.running{
      background-color: gold;
    }
    &.expired{
      background-color: silver;
    }
  }
}
</style>