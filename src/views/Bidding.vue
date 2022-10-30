<template>
  <div>
		<v-container>
			<v-layout row wrap>
        <v-flex sm12 xs12 md12 lg12>
					<v-card class="ma-3 pa-1" style="border: 5px solid #000;">
						<v-row class="ma-1">
							<v-col cols="3" class="light-blue darken-3 kotak">
								<div class="scrollTextUser">
									<v-list dense class="light-blue darken-3">
										<v-list-item v-for="(item, i) in dataUser" :key="i" class="SelectedTile">
											<v-icon left v-if="item.isAdmin == 0">person</v-icon>
											<v-icon left v-else>admin_panel_settings</v-icon>
											<v-list-item-title>
												<span class="tulisanNamaPeserta">{{ item.nama }}</span>
											</v-list-item-title>
										</v-list-item>
									</v-list>
								</div>
							</v-col>
							<v-col cols="6" class="white">
								<div class="kotakjoinleave" :hidden="hiddenLog">{{ joinPesan }}</div>
								<div class="scrollText kotakTengah pa-1" ref="scrollText">
									<div v-for="(item, i) in dataMessageRoom" :key="i">
										<div class="message" :id="item.nama != namaPeserta ? `kotakchatleft` : `kotakchatright`">
											<div class="tulisanChat">{{ item.nama }} {{ item.isAdmin == 1 && `(Admin Lelang)` }}</div>
											<span style="white-space: pre-line" v-html="item.pesan" />
											<div style="float: right; margin-top: 15px; font-size: 8pt; font-weight: bold;">{{ item.jam }}</div>
										</div>
									</div>
								</div>
								<span v-if="typingTrig">{{ `${typingName} sedang mengetik ...` }}</span>
								<div class="mt-2">
									<v-textarea
										v-model="pesan"
                    placeholder="Ketik sesuatu disini ..."
                    outlined
                    dense
                    rows="4"
                    label="Ketik sesuatu disini ..."
                    color="light-blue darken-3"
                    hide-details
                    no-resize
                  />
									<div class="text-right">
										<v-btn
											color="light-blue darken-3"
											small
											dense
											depressed
											class="mt-2 white--text text--darken-2"
											@click="sendMessage"
										>
											<v-icon small>messages</v-icon> Kirim Pesan
										</v-btn>
									</div>
								</div>
							</v-col>
							<v-col cols="3" class="light-blue darken-3 tulisan kotak">
								<h4 class="text-center"><u>Data Event</u></h4>
								<h5 class="tulisan2">Nama Event : {{ namaEvent }}</h5>
								<h5 class="tulisan2">No Lot : {{ noLot }}</h5>
								<h5 class="tulisan2">Harga Awal : Rp. {{ currencyDotFormat(dataRoom.hargaAwal) }}</h5>
								<h4 class="text-center"><u>Data Barang</u></h4>
								<h5 class="tulisan2">Kategori : <span v-html="data_barang_lelang.KategoriLelang.namaKategori"/></h5>
								<h5 class="tulisan2">Nama Barang : <span v-html="data_barang_lelang.namaBarangLelang"/></h5>
								<h5 class="tulisan2">Lokasi Barang : <span v-html="data_barang_lelang.lokasiBarang"/></h5>
								<h4 class="text-center"><u>Bid Terakhir</u></h4>
								<div class="kotakBid">
									<h4 class="text-center"><u>HARGA AWAL</u></h4>
									Rp. {{ currencyDotFormat(dataRoom.hargaAwal) }}
								</div>
								<div class="kotakBid">
									<h4 class="text-center"><u>HARGA TAWARAN</u></h4>
									Rp. {{ currencyDotFormat(dataRoom.hargaAwal) }}
								</div>
								<div class="kotakBid">
									<h4 class="text-center"><u>PEMENANG</u></h4>
									Rp. {{ currencyDotFormat(dataRoom.hargaAwal) }}
								</div>
							</v-col>
						</v-row>
					</v-card>
				</v-flex>
			</v-layout>
		</v-container>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import io from 'socket.io-client'
export default {
	name: "Bidding",
	data: () => ({
		url_socket: "",
		joinPesan: "",
		pesan: "",
		typingTrig: false,
		typingName: "",
		namaPeserta: "",
		namaEvent: "",
		noLot: "",
		dataUser: [],
		dataMessageRoom: [],
		dataRoom: {},
		dataEvent: '',
		data_barang_lelang: '',
		hiddenLog: true,
	}),
	watch: {
		pesan: {
			deep: true,
			handler(el) {
				const socket = io(this.url_socket);
				socket.emit("typing", {
					isTyping: el.length > 0,
					nama: this.namaPeserta,
					room: this.noLot + "_" + this.namaEvent,
				});	
			}
		}
	},
	created() {
		// const API_URL = process.env.VUE_APP_NODE_ENV === "production" ? process.env.VUE_APP_VIEW_PROD_API_URL : process.env.VUE_APP_VIEW_DEV_API_URL
		// const socket = io(API_URL);
		// socket.on("typing", (data) => {
		// 	const { isTyping, nama } = data;
		// 	this.typingTrig = true
		// 	this.typingName = nama
		// 	setTimeout(() => {
		// 		this.typingTrig = false
		// 	}, 2000);
		// });
	},
	updated() {
		this.scrollToEnd()
	},
	mounted() {
		const API_URL = process.env.VUE_APP_NODE_ENV === "production" ? process.env.VUE_APP_VIEW_PROD_API_URL : process.env.VUE_APP_VIEW_DEV_API_URL
		this.namaPeserta = this.$route.params.nama;
		this.namaEvent = this.$route.params.nama_event;
		this.noLot = this.$route.params.no_lot;
		this.url_socket = API_URL;
		this.getEvent(this.noLot);
	},
	methods: {
		...mapActions(["fetchData"]),
		getEvent(nolot) {
			let payload = {
				method: "get",
				url: `lelang/getRoomEvent?no_lot=${nolot}`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				this.dataRoom = res.data.result;
				this.dataEvent = this.dataRoom.Event
				this.data_barang_lelang = this.dataRoom.BarangLelang
				this.getMessage();
			})
			.catch((err) => {
        console.log(err)
			});
		},
		getMessage() {
			const socket = io(this.url_socket);
			// socket.emit("join", { name: localStorage.getItem('nama'), room: this.noLot + "_" + this.namaEvent, device: "laptop", is_admin: 1 });
			socket.emit("join", { room: this.noLot + "_" + this.namaEvent, id_peserta: localStorage.getItem('roleID') == 1 ? localStorage.getItem('idLogin') : 1, id_event: this.dataEvent.idEvent, device: "laptop", is_admin: 1 });
			socket.on("message", ({ pesan, id, data }) => {
				this.joinPesan = pesan;
				this.hiddenLog = false
				setTimeout(() => {
					this.hiddenLog = true
				}, 5000);
			});
			socket.on("UserAll", (user) => {
				this.dataUser = user
			});
			socket.on("MessageRoomAll", (value) => {
				this.dataMessageRoom = value
				this.scrollToEnd()
			});
			socket.on("kirimMessage", (value) => {
				this.dataMessageRoom = value
				this.scrollToEnd()
			});
		},
		sendMessage() {
			const socket = io(this.url_socket);
			socket.emit("kirimMessage", { room: this.noLot + "_" + this.namaEvent, id_peserta: localStorage.getItem('roleID') == 1 ? localStorage.getItem('idLogin') : 1, id_event: this.dataEvent.idEvent, is_admin: 1, pesan: this.pesan });
			this.pesan = ''
			this.scrollToEnd()
		},
		scrollToEnd() {
      var content = this.$refs.scrollText;
      content.scrollTop = content.scrollHeight;
    }
	},
};
</script>

<style>
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
.kotak {
	border-radius: 5px;
}
.kotakTengah {
	border-radius: 5px;
	border: 2px dotted #000;
  height: 300px !important;
}
.scrollTextUser{
  max-height: 470px !important;
  overflow-y: auto !important;
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
.SelectedTile:hover {
	border-radius: 5px;
	background: #23b9ff;
	color: rgb(0, 0, 0);
}
.SelectedTile-active {
	border-radius: 5px;
	background: rgb(12, 85, 5);
	color: #FFF;
}
.kotakBid {
	border: 2px dashed #000;
	border-radius: 5px;
	text-align: center;
	background: #FFF;
	color: #000;
	margin: 5px;
}
</style>