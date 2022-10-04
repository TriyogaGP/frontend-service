<template>
	<nav>
		<v-app-bar color="light-blue darken-3" dark app>
			<v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
			<v-spacer />
			<v-badge
				content="6"
				value="6"
				color="green"
				overlap
				class="badgeNotif"
			>
				<v-icon medium>notifications</v-icon>
			</v-badge>
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
							<v-img src="../../public/avatar.png"></v-img>
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
							<v-img src="../../public/avatar.png"></v-img>
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
			</v-list>
		</v-navigation-drawer>
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
		roleID: '',
		nama: '',
		Token: '',

		//notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
	}),
	mounted() {
		if(!localStorage.getItem('user_token')) return this.$router.push({name: `${localStorage.getItem('siteLogin') == 'Admin' ? 'Login' : 'LoginUser'}`});
		this.nama = localStorage.getItem('nama')
		this.roleID = localStorage.getItem('roleID')
		this.Token = localStorage.getItem('user_token')
		this.getMenu(this.roleID)
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
				url: `settings/getMenu?idRole=${roleID}`,
				authToken: this.Token
			};
			this.fetchData(payload)
			.then((response) => {
				this.menuNav = response.data.result;
			})
			.catch((err) => {
				this.notifikasi("warning", err.response.data.message, "2")
				// console.log(err);
			});
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
.badgeNotif {
	cursor: pointer;
}
.UserPanel {
	cursor: pointer;
}
</style>