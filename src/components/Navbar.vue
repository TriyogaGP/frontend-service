<template>
	<nav>
		<v-app-bar color="light-blue darken-3" dark app>
			<v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
			<v-spacer />
			<v-menu
				v-if="siteLogin == 'Peserta'"
				open-on-hover
				rounded="t-xs b-lg"
				offset-y
				transition="slide-y-transition"
				bottom
			>
				<template v-slot:activator="{ attrs, on }">
					<span
						class="white--text ma-5"
						v-bind="attrs"
						v-on="on"
					>
						<v-badge
							:content="jumlahNotif"
							:value="jumlahNotif"
							color="green"
							overlap
							class="badgeNotif"
						>
							<v-icon medium>notifications</v-icon>
						</v-badge>
					</span>
					<!-- <v-badge
						content="6"
						value="6"
						color="green"
						overlap
						class="badgeNotif"
						v-bind="attrs"
						v-on="on"
					>
						<v-icon medium>notifications</v-icon>
					</v-badge> -->
				</template>

				<v-list dense style="width: 350px;">
					<div class="scrollNotif">
						<div
							v-for="(notif, index) in dataNotif"
							:key="index"
						>
							
							<div @click="() => { Hasil(notif.idNotification); }" class="SelectedMenuNotif pa-2" active-class="SelectedMenuNotif-active">
								<p class="kondisiNotif">{{notif.isRead ? 'sudah dibaca' : 'belum dibaca' }} <v-icon small :color="notif.isRead == true ? 'green' : 'red'">{{ notif.isRead == true ? 'check' : 'clear' }}</v-icon></p>
								<p class="judulNotif">{{notif.judul}}</p>
								<p class="pesanNotif">{{(notif.pesan || '').length > 60 ? `${notif.pesan.substring(0, 60)}...` : notif.pesan}}</p>
								<p class="tanggalNotif">{{notif.createdAt}}</p>
							</div>
							<div class="mt-2 mb-2"><v-divider /></div>
						</div>
					</div>
					<v-list-item
						router to="/Notifikasi"
						class="SelectedMenuNotif"
						active-class="SelectedMenuNotif-active"
					>
						<v-list-item-title>
							<span>Lihat Semua Notifikasi</span>
						</v-list-item-title>
						<v-icon right>arrow_forward</v-icon>
					</v-list-item>
				</v-list>
			</v-menu>
			<v-menu
				open-on-hover
				rounded="t-xs b-lg"
				offset-y
				transition="slide-y-transition"
				bottom
			>
				<template v-slot:activator="{ attrs, on }">
					<span
						class="white--text ma-5 UserPanel"
						v-bind="attrs"
						v-on="on"
					>
						{{nama}}
						<v-avatar size="35">
							<v-img v-if="siteLogin == 'Peserta'" :src="dataProfile.fotoPeserta ? `${API_URL}image/berkas/${dataProfile.fotoPeserta}` : `${API_URL}No_Image_Available.jpg`"></v-img>
							<v-img v-else src="../../public/avatar.png"></v-img>
						</v-avatar>
					</span>
				</template>

				<v-list dense>
					<v-list-item
						v-for="(link, index) in links"
						:key="index"
						router :to="link.route"
						class="SelectedMenu"
						active-class="SelectedMenu-active"
					>
						<v-list-item-title>
							<span>{{link.text}}</span>
						</v-list-item-title>
						<v-icon right>{{link.icon}}</v-icon>
					</v-list-item>
					<v-list-item
						@click="keluar"
						class="SelectedMenu"
						active-class="SelectedMenu-active"
					>
						<v-list-item-title>
							<span>Keluar</span>
						</v-list-item-title>
						<v-icon right>exit_to_app</v-icon>
					</v-list-item>
				</v-list>
			</v-menu>
		</v-app-bar>
		<v-navigation-drawer v-model="drawer" dark app class="light-blue darken-3">
			<v-layout column align-center>
				<v-flex class="mt-5">
					<v-toolbar-title class="white--text subheading mt-1 text-center text-uppercase">
						<span class="font-weight-light">{{ roleID == 1 ? 'Admin' : 'Peserta' }}</span>
						<span>&nbsp;WIN.ID</span>
					</v-toolbar-title>
					<div class="d-flex flex-column justify-space-between align-center">
						<v-avatar size="100">
							<v-img v-if="siteLogin == 'Peserta'" :src="dataProfile.fotoPeserta ? `${API_URL}image/berkas/${dataProfile.fotoPeserta}` : `${API_URL}No_Image_Available.jpg`"></v-img>
							<v-img v-else src="../../public/avatar.png"></v-img>
						</v-avatar>
					</div>
					<p class="white--text subheading mt-1 text-center">{{nama}}</p>
				</v-flex>
			</v-layout>
			<v-list dense>
				<v-list-item
					router to="/dashboard"
					class="SelectedTile"
					active-class="SelectedTile-active"
				>
					<v-list-item-title>
						<span>Dashboard</span>
					</v-list-item-title>
					<v-icon right>dashboard</v-icon>
				</v-list-item>
				<template>
					<v-list-item
						v-for="(link, index) in menuNav"
						:key="index"
						router :to="link.menuRoute"
						class="SelectedTile"
						active-class="SelectedTile-active"
					>
						<v-list-item-title>
							<span>{{link.menuText}}</span>
						</v-list-item-title>
						<v-icon right>{{link.menuIcon}}</v-icon>
					</v-list-item>
				</template>
				<v-list-item
					v-if="roleID == 1"
					router to="/settings"
					class="SelectedTile"
					active-class="SelectedTile-active"
				>
					<v-list-item-title>
						<span>Settings</span>
					</v-list-item-title>
					<v-icon right>settings</v-icon>
				</v-list-item>
				<!-- <v-list-item
					router to="/Testing"
					class="SelectedTile"
					active-class="SelectedTile-active"
				>
					<v-list-item-title>
						<span>Testing</span>
					</v-list-item-title>
					<v-icon right>settings</v-icon>
				</v-list-item> -->
			</v-list>
		</v-navigation-drawer>
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
	</nav>
</template>

<script>
import { mapActions } from "vuex";
import PopUpNotifikasiVue from "../views/Layout/PopUpNotifikasi.vue";
import io from 'socket.io-client'
export default {
	components: {
    PopUpNotifikasiVue
  },
	data: () => ({
		drawer: true,
		links: [
			{text: 'Profile', route: '/profile', icon: 'person'},
		],
		menuNav: [],
		API_URL: '',
		roleID: '',
		nama: '',
		Token: '',
		siteLogin: '',
		dataProfile: {
			fotoPeserta: '',
    },
		jumlahNotif: 0,
		dataNotif: [],
		DialogDetailNotifikasi: false,
		Notifikasi: {
			idNotification: '',
			idPeserta: '',
			judul: '',
			pesan: '',
			isRead: '',
			createdAt: '',
    },

		//notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
	}),
	created() {
    this.siteLogin = localStorage.getItem('siteLogin')
    if(this.siteLogin == 'Peserta') {
      this.API_URL = process.env.VUE_APP_NODE_ENV === "production" ? process.env.VUE_APP_VIEW_PROD_API_URL : process.env.VUE_APP_VIEW_DEV_API_URL
      const socket = io(this.API_URL);
      socket.on("notifikasi", (value) => {
				if(value) {
					this.getNotification(localStorage.getItem("idLogin"), '')
				}
      });
		}
	},
	mounted() {
		if(!localStorage.getItem('user_token')) return this.$router.push({name: `${localStorage.getItem('siteLogin') == 'Admin' ? 'Login' : 'LoginUser'}`});
		this.nama = localStorage.getItem('nama')
		this.roleID = localStorage.getItem('roleID')
		this.Token = localStorage.getItem('user_token')
		this.siteLogin = localStorage.getItem("siteLogin")
    this.API_URL = process.env.VUE_APP_NODE_ENV === "production" ? process.env.VUE_APP_VIEW_PROD_API_URL : process.env.VUE_APP_VIEW_DEV_API_URL
		this.getMenu(this.roleID)
		this.getProfile(localStorage.getItem("idLogin"), localStorage.getItem("siteLogin"))
		localStorage.getItem("siteLogin") == 'Peserta' && this.getNotification(localStorage.getItem("idLogin"), '')
		// this.$getLocation({
    //   enableHighAccuracy: false, //defaults to false
    //   timeout: Infinity, //defaults to Infinity
    //   maximumAge: 1000 //defaults to 0
      
    // }).then(coordinates => {
    //   console.log(coordinates)
    // });
	},
	methods: {
		...mapActions(["fetchData"]),
		getMenu(roleID) {
			let payload = {
				method: "get",
				url: `settings/getMenu?page=1&limit=100&idRole=${roleID}`,
				authToken: this.Token
			};
			this.fetchData(payload)
			.then((response) => {
				this.menuNav = response.data.result.records;
			})
			.catch((err) => {
				this.notifikasi("warning", err.response.data.message, "2")
				// console.log(err);
			});
		},
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
          fotoPeserta: data.fotoPeserta,
        }
			})
			.catch((err) => {
				console.log(err)
			});
		},
		getNotification(id, kondisi) {
			this.jumlahNotif = 0
			this.dataNotif = []
			let urlLink = kondisi == 'detail' ? `id_notifikasi=${id}` : `id_peserta=${id}&limit=5&is_read=0&look=ONE`
			let payload = {
				method: "get",
				url: `settings/getNotification?${urlLink}`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				if(kondisi == 'detail') {
					let data = res.data.result;
					this.Notifikasi = {
						idNotification: data.idNotification,
						idPeserta: data.idPeserta,
						judul: data.judul,
						pesan: data.pesan,
						isRead: data.isRead,
						createdAt: data.createdAt,
					}
					this.DialogDetailNotifikasi = true
					this.UbahNotifikasi()
				}else{
					this.dataNotif = res.data.result.data;
					this.jumlahNotif = res.data.result.count;
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
				this.getNotification(localStorage.getItem('idLogin'), '')
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
    },
		Hasil(idNotif) {
			this.getNotification(idNotif, 'detail')
			// console.log(idNotif);
		},
		keluar() {
			this.notifikasi("question", "Apakah anda yakin ingin keluar ?", "2")
		},
		goToProses(){
			if(localStorage.getItem('siteLogin') == 'Admin') {
				localStorage.removeItem('user_token');
				localStorage.removeItem('nama');
				localStorage.removeItem('nama_role');
				localStorage.removeItem('roleID');
				localStorage.removeItem('idLogin');
				// localStorage.removeItem('siteLogin');
				this.$router.push({name: "Login"});
			}else{
				localStorage.removeItem('user_token');
				localStorage.removeItem('nama');
				localStorage.removeItem('idLogin');
				// localStorage.removeItem('siteLogin');
				this.$router.push({name: "LoginUser"});
			}
		},
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
.SelectedTile:hover {
	border-radius: 2px;
	background: #455A64
}
.SelectedTile-active {
	border-radius: 2px;
	background: rgba(10, 204, 117, 0.19)
}
.SelectedMenu:hover {
	border-radius: 2px;
	background: #939494
}
.SelectedMenu-active {
	border-radius: 2px;
	background: rgba(132, 131, 195, 0.19)
}
.SelectedMenuNotif:hover {
	border-radius: 2px;
	background: #939494;
	cursor: pointer;
}
.SelectedMenuNotif-active {
	border-radius: 2px;
	background: rgba(132, 131, 195, 0.19);
	cursor: pointer;
}
.badgeNotif {
	cursor: pointer;
}
.UserPanel {
	cursor: pointer;
}
.scrollNotif{
  max-height: 500px !important;
  overflow-y: auto !important;
}
.judulNotif {
	margin-bottom: 2px !important;
	font-size: 14px;
	font-weight: bold;
}
.pesanNotif {
	margin-bottom: 2px !important;
	font-size: 12px;
	font-weight: 500;
	text-align: justify;
}
.tanggalNotif {
	margin-bottom: 1px !important;
	font-size: 10px;
	font-weight: 500;
	text-align: right;
	font-style: italic;
}
.kondisiNotif {
	margin-bottom: 1px !important;
	font-size: 10px;
	text-align: right;
	font-style: italic;
}
</style>