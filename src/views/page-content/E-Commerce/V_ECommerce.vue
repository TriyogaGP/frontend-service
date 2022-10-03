<template>
	<div>
    <h1 class="subheading grey--text">Data E-Commerce</h1>
		<v-container>
			<v-layout row wrap>
        <v-flex sm6 xs12 md6 lg4>
					<v-card :class="cardActive.kategoriproduk ? `ma-3 light-blue darken-3`: `ma-3`" height="100" @click="LinkRoute(1)">
						<v-list-item>
							<v-list-item-avatar tile class="mt-n7">
								<v-sheet color="green" width="40" height="40" elevation="6">
									<v-icon dark large>category</v-icon>
								</v-sheet>
							</v-list-item-avatar>
							<v-list-item-content>
								<div :class="cardActive.kategoriproduk ? `overline text-right white--text` : `overline text-right`">Kategori Produk</div>
								<div><v-divider :class="cardActive.kategoriproduk && `white`" /></div>
							</v-list-item-content>
						</v-list-item>
					</v-card>
				</v-flex>
        <v-flex sm6 xs12 md6 lg4>
					<v-card :class="cardActive.produk ? `ma-3 light-blue darken-3`: `ma-3`" height="100" @click="LinkRoute(2)">
						<v-list-item>
							<v-list-item-avatar tile class="mt-n7">
								<v-sheet color="green" width="40" height="40" elevation="6">
									<v-icon dark large>inventory_2</v-icon>
								</v-sheet>
							</v-list-item-avatar>
							<v-list-item-content>
								<div :class="cardActive.produk ? `overline text-right white--text` : `overline text-right`">Produk</div>
								<div><v-divider :class="cardActive.produk && `white`" /></div>
							</v-list-item-content>
						</v-list-item>
					</v-card>
				</v-flex>
        <v-flex sm6 xs12 md6 lg4>
					<v-card :class="cardActive.promosiproduk ? `ma-3 light-blue darken-3`: `ma-3`" height="100" @click="LinkRoute(3)">
						<v-list-item>
							<v-list-item-avatar tile class="mt-n7">
								<v-sheet color="green" width="40" height="40" elevation="6">
									<v-icon dark large>fas fa-percent</v-icon>
								</v-sheet>
							</v-list-item-avatar>
							<v-list-item-content>
								<div :class="cardActive.promosiproduk ? `overline text-right white--text` : `overline text-right`">Promo Produk</div>
								<div><v-divider :class="cardActive.promosiproduk && `white`" /></div>
							</v-list-item-content>
						</v-list-item>
					</v-card>
				</v-flex>
        <v-flex sm6 xs12 md6 lg4>
					<v-card :class="cardActive.orderproduk ? `ma-3 light-blue darken-3`: `ma-3`" height="100" @click="LinkRoute(4)">
						<v-list-item>
							<v-list-item-avatar tile class="mt-n7">
								<v-sheet color="green" width="40" height="40" elevation="6">
									<v-icon dark medium>fas fa-receipt</v-icon>
								</v-sheet>
							</v-list-item-avatar>
							<v-list-item-content>
								<div :class="cardActive.orderproduk ? `overline text-right white--text` : `overline text-right`">Order</div>
								<div><v-divider :class="cardActive.orderproduk && `white`" /></div>
							</v-list-item-content>
						</v-list-item>
					</v-card>
				</v-flex>
        <v-flex sm6 xs12 md6 lg4>
					<v-card :class="cardActive.pembayaran ? `ma-3 light-blue darken-3`: `ma-3`" height="100" @click="LinkRoute(5)">
						<v-list-item>
							<v-list-item-avatar tile class="mt-n7">
								<v-sheet color="green" width="40" height="40" elevation="6">
									<v-icon dark medium>fas fa-money-check</v-icon>
								</v-sheet>
							</v-list-item-avatar>
							<v-list-item-content>
								<div :class="cardActive.pembayaran ? `overline text-right white--text` : `overline text-right`">Pembayaran</div>
								<div><v-divider :class="cardActive.pembayaran && `white`" /></div>
							</v-list-item-content>
						</v-list-item>
					</v-card>
				</v-flex>
        <v-flex sm6 xs12 md6 lg4>
					<v-card :class="cardActive.pengiriman ? `ma-3 light-blue darken-3`: `ma-3`" height="100" @click="LinkRoute(6)">
						<v-list-item>
							<v-list-item-avatar tile class="mt-n7">
								<v-sheet color="green" width="40" height="40" elevation="6">
									<v-icon dark medium>fas fa-truck</v-icon>
								</v-sheet>
							</v-list-item-avatar>
							<v-list-item-content>
								<div :class="cardActive.pengiriman ? `overline text-right white--text` : `overline text-right`">Pengiriman</div>
								<div><v-divider :class="cardActive.pengiriman && `white`" /></div>
							</v-list-item-content>
						</v-list-item>
					</v-card>
				</v-flex>
			</v-layout>
		</v-container>
		<v-divider style="border: 1px solid #000" />
		<v-card v-if="ECommercePanel != 0" class="mt-2 mb-2 pa-1" outlined elevation="0">
			<V_KategoriProduk v-if="ECommercePanel == 1" />
			<V_Produk v-else-if="ECommercePanel == 2" />
			<V_PromosiProduk v-else-if="ECommercePanel == 3" />
			<V_OrderProduk v-else-if="ECommercePanel == 4" />
			<V_Pembayaran v-else-if="ECommercePanel == 5" />
			<V_Pengiriman v-else-if="ECommercePanel == 6" />
		</v-card>
	</div>    
</template>

<script>
import V_KategoriProduk from './V_KategoriProduk.vue'
import V_OrderProduk from './V_OrderProduk.vue'
import V_Pembayaran from './V_Pembayaran.vue'
import V_Pengiriman from './V_Pengiriman.vue'
import V_Produk from './V_Produk.vue'
import V_PromosiProduk from './V_PromosiProduk.vue'
export default {
	name: "ECommerce",
	components: { V_KategoriProduk, V_Produk, V_PromosiProduk, V_OrderProduk, V_Pembayaran, V_Pengiriman },
	data: () => ({
		ECommercePanel: 0,
		cardActive: {
			kategoriproduk: false,
			produk: false,
			promosiproduk: false,
			orderproduk: false,
			pembayaran: false,
			pengiriman: false,
		},
	}),
	mounted() {
		this.ECommercePanel = 0
	},
	metaInfo: {
		title: "E - Commerce - WIN.ID",
		htmlAttrs: {
			lang: "id",
			amp: true,
		},
	},
	methods:{
		LinkRoute(number){
			this.cardActive = {
				kategoriproduk: false,
				produk: false,
				promosiproduk: false,
				orderproduk: false,
				pembayaran: false,
				pengiriman: false,
			}
			if(number == 1){ this.cardActive = { ...this.cardActive, kategoriproduk: true } }
			if(number == 2){ this.cardActive = { ...this.cardActive, produk: true } }
			if(number == 3){ this.cardActive = { ...this.cardActive, promosiproduk: true } }
			if(number == 4){ this.cardActive = { ...this.cardActive, orderproduk: true } }
			if(number == 5){ this.cardActive = { ...this.cardActive, pembayaran: true } }
			if(number == 6){ this.cardActive = { ...this.cardActive, pengiriman: true } }
			this.ECommercePanel = number
		}
	}
}
</script>

<style>

</style>