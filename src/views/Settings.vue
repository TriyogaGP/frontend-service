<template>
  <div>
    <h1 class="subheading grey--text">Settings</h1>
    <v-container>
			<v-layout row wrap>
        <v-flex sm6 xs12 md6 lg3>
					<v-card class="ma-3" height="100" @click="LinkRoute(1)">
						<v-list-item>
							<v-list-item-avatar tile class="mt-n7">
								<v-sheet color="green" width="40" height="40" elevation="6">
									<v-icon dark large>admin_panel_settings</v-icon>
								</v-sheet>
							</v-list-item-avatar>
							<v-list-item-content>
								<div class="overline text-right">Hak Akses</div>
								<div><v-divider /></div>
							</v-list-item-content>
						</v-list-item>
					</v-card>
				</v-flex>
        <v-flex sm6 xs12 md6 lg3>
					<v-card class="ma-3" height="100" @click="LinkRoute(2)">
						<v-list-item>
							<v-list-item-avatar tile class="mt-n7">
								<v-sheet color="green" width="40" height="40" elevation="6">
									<v-icon dark large>list</v-icon>
								</v-sheet>
							</v-list-item-avatar>
							<v-list-item-content>
								<div class="overline text-right">Menu</div>
								<div><v-divider /></div>
							</v-list-item-content>
						</v-list-item>
					</v-card>
				</v-flex>
        <v-flex sm6 xs12 md6 lg3>
					<v-card class="ma-3" height="100" @click="LinkRoute(3)">
						<v-list-item>
							<v-list-item-avatar tile class="mt-n7">
								<v-sheet color="green" width="40" height="40" elevation="6">
									<v-icon dark large>list</v-icon>
								</v-sheet>
							</v-list-item-avatar>
							<v-list-item-content>
								<div class="overline text-right">Log Admin</div>
								<div><v-divider /></div>
							</v-list-item-content>
						</v-list-item>
					</v-card>
				</v-flex>
        <v-flex sm6 xs12 md6 lg3>
					<v-card class="ma-3" height="100" @click="LinkRoute(4)">
						<v-list-item>
							<v-list-item-avatar tile class="mt-n7">
								<v-sheet color="green" width="40" height="40" elevation="6">
									<v-icon dark large>list</v-icon>
								</v-sheet>
							</v-list-item-avatar>
							<v-list-item-content>
								<div class="overline text-right">Log Peserta</div>
								<div><v-divider /></div>
							</v-list-item-content>
						</v-list-item>
					</v-card>
				</v-flex>
        <v-flex sm6 xs12 md6 lg3>
					<v-card class="ma-3" height="100" @click="LinkRoute(5)">
						<v-list-item>
							<v-list-item-avatar tile class="mt-n7">
								<v-sheet color="green" width="40" height="40" elevation="6">
									<v-icon dark large>local_shipping</v-icon>
								</v-sheet>
							</v-list-item-avatar>
							<v-list-item-content>
								<div class="overline text-right">Kurir</div>
								<div><v-divider /></div>
							</v-list-item-content>
						</v-list-item>
					</v-card>
				</v-flex>
        <v-flex sm6 xs12 md6 lg3>
					<v-card class="ma-3" height="100" @click="LinkRoute(6)">
						<v-list-item>
							<v-list-item-avatar tile class="mt-n7">
								<v-sheet color="green" width="40" height="40" elevation="6">
									<v-icon dark large>account_balance</v-icon>
								</v-sheet>
							</v-list-item-avatar>
							<v-list-item-content>
								<div class="overline text-right">Metode Pembayaran</div>
								<div><v-divider /></div>
							</v-list-item-content>
						</v-list-item>
					</v-card>
				</v-flex>
			</v-layout>
		</v-container>
		<v-divider />
		<v-card v-if="settingPanel != 0" class="mt-2 mb-2 pa-1" outlined elevation="0">
			<V_HakAkses v-if="settingPanel == 1" />
			<V_Menu v-else-if="settingPanel == 2" />
			<V_LogLogin_Admin v-else-if="settingPanel == 3" />
			<V_LogLogin_Peserta v-else-if="settingPanel == 4" />
			<V_Kurir v-else-if="settingPanel == 5" />
			<V_MetodePembayaran v-else-if="settingPanel == 6" />
		</v-card>
  </div>
</template>

<script>
import V_HakAkses from './Settings/V_HakAkses.vue'
import V_Menu from './Settings/V_Menu.vue'
import V_LogLogin_Admin from './Settings/V_LogLogin_Admin.vue'
import V_LogLogin_Peserta from './Settings/V_LogLogin_Peserta.vue'
import V_Kurir from './Settings/V_Kurir.vue'
import V_MetodePembayaran from './Settings/V_MetodePembayaran.vue'

export default {
	name: "Settings",
	components: { V_HakAkses, V_Menu, V_LogLogin_Admin, V_LogLogin_Peserta, V_Kurir, V_MetodePembayaran },
	data: () => ({
		settingPanel: 0,
	}),
	mounted() {
		this.settingPanel = 0
	},
	metaInfo: {
		title: "Settings - WIN.ID",
		htmlAttrs: {
			lang: "id",
			amp: true,
		},
	},
	methods:{
		LinkRoute(number){
			this.settingPanel = number
		}
	}
}
</script>
