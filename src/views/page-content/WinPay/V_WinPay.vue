<template>
	<div>
    <h1 class="subheading grey--text">Data Win Pay</h1>
		<v-container>
			<v-layout row wrap>
        <v-flex sm6 xs12 md6 lg4>
					<v-card :class="cardActive.point_in ? `ma-3 light-blue darken-3`: `ma-3`" @click="LinkRoute(1)">
						<v-list-item>
							<v-list-item-avatar tile class="mt-n7">
								<v-sheet color="green" width="40" height="40" elevation="6">
									<v-icon dark large>fas fa-award</v-icon>
								</v-sheet>
							</v-list-item-avatar>
							<v-list-item-content>
								<div :class="cardActive.point_in ? `overline text-right white--text` : `overline text-right`">Point Masuk</div>
								<div><v-divider :class="cardActive.point_in && `white`" /></div>
							</v-list-item-content>
						</v-list-item>
					</v-card>
				</v-flex>
        <v-flex sm6 xs12 md6 lg4>
					<v-card :class="cardActive.point_out ? `ma-3 light-blue darken-3`: `ma-3`" @click="LinkRoute(2)">
						<v-list-item>
							<v-list-item-avatar tile class="mt-n7">
								<v-sheet color="green" width="40" height="40" elevation="6">
									<v-icon dark large>fas fa-award</v-icon>
								</v-sheet>
							</v-list-item-avatar>
							<v-list-item-content>
								<div :class="cardActive.point_out ? `overline text-right white--text` : `overline text-right`">Point Keluar</div>
								<div><v-divider :class="cardActive.point_out && `white`" /></div>
							</v-list-item-content>
						</v-list-item>
					</v-card>
				</v-flex>
        <v-flex sm6 xs12 md6 lg4>
					<v-card :class="cardActive.winpay ? `ma-3 light-blue darken-3`: `ma-3`" @click="LinkRoute(3)">
						<v-list-item>
							<v-list-item-avatar tile class="mt-n7">
								<v-sheet color="green" width="40" height="40" elevation="6">
									<v-icon dark large>fas fa-award</v-icon>
								</v-sheet>
							</v-list-item-avatar>
							<v-list-item-content>
								<div :class="cardActive.winpay ? `overline text-right white--text` : `overline text-right`">Win Pay</div>
								<div><v-divider :class="cardActive.winpay && `white`" /></div>
							</v-list-item-content>
						</v-list-item>
					</v-card>
				</v-flex>
			</v-layout>
		</v-container>
		<v-divider style="border: 1px solid #000" />
		<v-card v-if="WinPayPanel != 0" class="mt-2 mb-2 pa-1" outlined elevation="0">
			<!-- <V_HakAkses v-if="WinPayPanel == 1" />
			<V_Menu v-else-if="WinPayPanel == 2" />
			<v_Log_Login_Admin v-else-if="WinPayPanel == 3" /> -->
		</v-card>
	</div>    
</template>

<script>
export default {
	name: "WinPay",
	// components: { V_HakAkses, V_Menu, v_Log_Login_Admin },
	data: () => ({
		WinPayPanel: 0,
		cardActive: {
			point_in: false,
			point_out: false,
			winpay: false,
		},
	}),
	mounted() {
		this.WinPayPanel = 0
	},
	metaInfo: {
		title: "Win Pay - WIN.ID",
		htmlAttrs: {
			lang: "id",
			amp: true,
		},
	},
	methods:{
		LinkRoute(number){
			this.cardActive = {
				point_in: false,
				point_out: false,
				winpay: false,
			}
			if(number == 1){ this.cardActive = { ...this.cardActive, point_in: true } }
			if(number == 2){ this.cardActive = { ...this.cardActive, point_out: true } }
			if(number == 3){ this.cardActive = { ...this.cardActive, winpay: true } }
			this.WinPayPanel = number
		}
	}
}
</script>

<style>

</style>