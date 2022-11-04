<template>
	<div>
		<v-card class="mt-2 mb-2 pa-1" outlined elevation="0">
			<h1 class="subheading grey--text">Panel Notifikasi</h1>
			<v-card>
				<v-tabs
					v-model="tab"
					fixed-tabs
					background-color="light-blue darken-3"
					dark
				>
					<v-tab v-for="(item, i) in itemsTab" :key="i">
						{{ item.text }} {{ i == 0 ? `(${jmlNotif.All})` : i == 1 ? `(${jmlNotif.Read})` : `(${jmlNotif.unRead})` }}
					</v-tab>
				</v-tabs>

				<v-tabs-items v-model="tab">
					<v-tab-item v-for="(item, i) in itemsTab" :key="i">
						<v-card class="pa-3 scrollText">
							<!-- <v-expansion-panels v-if="dataNotif.length" focusable multiple>
								<v-expansion-panel
									v-for="(item,i) in dataNotif"
									:key="i"
								>
									<v-expansion-panel-header @click="tester()"><b>{{ item.judul }} <span style="font-size: 9px">({{ item.createdAt }})</span> <v-icon small v-if="index == 0" :color="item.isRead == true ? 'green' : 'red'">{{ item.isRead == true ? 'check' : 'clear' }}</v-icon> </b></v-expansion-panel-header>
									<v-expansion-panel-content>
										{{ item.pesan }}
									</v-expansion-panel-content>
								</v-expansion-panel>
							</v-expansion-panels> -->
							<v-list v-if="dataNotif.length" dense>
								<div
									v-for="(notif, index) in dataNotif"
									:key="index"
								>
									
									<div @click="() => { Hasil(notif); }" class="SelectedMenuNotif pa-2" active-class="SelectedMenuNotif-active">
										<p v-if="i == 0" class="kondisiNotif">{{notif.isRead ? 'sudah dibaca' : 'belum dibaca' }} <v-icon small :color="notif.isRead == true ? 'green' : 'red'">{{ notif.isRead == true ? 'check' : 'clear' }}</v-icon></p>
										<p class="judulNotif">{{notif.judul}}</p>
										<p class="pesanNotif">{{(notif.pesan || '').length > 60 ? `${notif.pesan.substring(0, 60)}...` : notif.pesan}}</p>
										<p class="tanggalNotif">{{notif.createdAt}}</p>
									</div>
									<div class="mt-2 mb-2"><v-divider /></div>
								</div>
							</v-list>
							<span v-else class="text-center"><b>Tidak ada notifikasi</b></span>
						</v-card>
					</v-tab-item>
				</v-tabs-items>
			</v-card>
		</v-card>
		<v-bottom-sheet
      v-model="DialogDetailNotifikasi"
      persistent
			inset
    >
      <v-sheet
        height="150px"
				style="border-top-left-radius: 10px; border-top-right-radius: 10px;"
      >	
				<div class="text-right">
					<v-btn
						class="ma-2"
						text
						color="error"
						@click="() => { DialogDetailNotifikasi = false; Notifikasi = { idNotification: '', idPeserta: '', judul: '', pesan: '', isRead: '', createdAt: '' } }"
					>
						Keluar
					</v-btn>
				</div>
        <div class="pa-5">
          <!-- <p class="kondisiNotif">{{Notifikasi.isRead ? 'sudah dibaca' : 'belum dibaca' }} <v-icon small :color="Notifikasi.isRead == true ? 'green' : 'red'">{{ Notifikasi.isRead == true ? 'check' : 'clear' }}</v-icon></p> -->
					<p class="judulNotif">{{Notifikasi.judul}}</p>
					<p class="pesanNotif">{{(Notifikasi.pesan || '').length > 60 ? `${Notifikasi.pesan.substring(0, 60)}...` : Notifikasi.pesan}}</p>
					<p class="tanggalNotif">{{Notifikasi.createdAt}}</p>
        </div>
      </v-sheet>
    </v-bottom-sheet>
	</div>
</template>

<script>
import { mapActions } from "vuex";
import io from 'socket.io-client'
export default {
	name: 'Notifikasi',
  data: () => ({
		itemsTab: [
			{code: '0', text: 'ALL Notifikasi'},
			{code: '1', text: 'Notifikasi Dibaca'},
			{code: '2', text: 'Notifikasi Belum Dibaca'}
		],
		tab: '',
		dataNotif: [],
		jmlNotif: {
			All: 0,
			Read: 0,
			unRead: 0,
		},
		DialogDetailNotifikasi: false,
		Notifikasi: {
			idNotification: '',
			idPeserta: '',
			judul: '',
			pesan: '',
			isRead: '',
			createdAt: '',
    },
	}),
	metaInfo: {
		title: "Notifikasi - WIN.ID",
		htmlAttrs: {
			lang: "id",
			amp: true,
		},
	},
	watch:{
		tab:{
			deep: true,
			handler(value){
				this.getNotification(localStorage.getItem("idLogin"), value)
			}
		}
	},
	mounted() {
		localStorage.getItem("siteLogin") == 'Peserta' && this.getNotification(localStorage.getItem("idLogin"), '0')
	},
	methods: {
		...mapActions(["fetchData"]),
		getNotification(id, look) {
			this.dataNotif = []
			this.jmlNotif = {
				All: 0,
				Read: 0,
				unRead: 0,
			}
			let payload = {
				method: "get",
				url: `settings/getNotification?id_peserta=${id}&look=ALL`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				let datanotif = res.data.result;
				this.jmlNotif = {
					All: datanotif.All,
					Read: datanotif.Read,
					unRead: datanotif.unRead,
				}
				if(look == '1') {
					this.dataNotif = datanotif.data.filter(val => val.isRead == true)
				}else if(look == '2') {
					this.dataNotif = datanotif.data.filter(val => val.isRead == false)
				}else{
					this.dataNotif = datanotif.data
				}
			})
			.catch((err) => {
				console.log(err)
			});
		},
		UbahNotifikasi() {
      let bodyData = {
        id_notification: this.Notifikasi.idNotification,
        id_peserta: this.Notifikasi.idPeserta,
      }
      let payload = {
				method: "post",
				url: `settings/postNotification`,
        body: bodyData,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				this.getNotification(localStorage.getItem("idLogin"), '0')
				this.API_URL = process.env.VUE_APP_NODE_ENV === "production" ? process.env.VUE_APP_VIEW_PROD_API_URL : process.env.VUE_APP_VIEW_DEV_API_URL
      	const socket = io(this.API_URL);
				socket.emit("notifikasi", true);
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
    },
		Hasil(item) {
			// console.log(item);
			this.Notifikasi = {
				idNotification: item.idNotification,
				idPeserta: item.idPeserta,
				judul: item.judul,
				pesan: item.pesan,
				isRead: item.isRead,
				createdAt: item.createdAt,
			}
			this.DialogDetailNotifikasi = true
			this.UbahNotifikasi()
		},
		tester() {
			console.log('ahha');
		}
	}
}
</script>

<style>
.scrollText{
  max-height: 600px !important;
  overflow-y: auto !important;
}
.v-tab {
	font-size: 8pt !important;
	font-weight: bold !important;
}
.v-expansion-panel-content__wrap {
	padding: 10px !important;
	font-size: 13px !important;
}
.v-expansion-panel-header {
	font-size: 12px !important;
	padding: 10px !important;
}
.v-expansion-panel--active > .v-expansion-panel-header {
	min-height: 0px;
}
</style>