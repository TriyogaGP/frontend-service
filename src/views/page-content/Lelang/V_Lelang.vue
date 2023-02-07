<template>
	<div>
    <h1 class="subheading grey--text">Data Lelang</h1>
		<v-container>
			<v-layout row wrap>
        <v-flex sm6 xs12 md6 lg4>
					<v-card :class="cardActive.kategoribarang ? `ma-3 light-blue darken-3`: `ma-3`" height="100" @click="LinkRoute(1)">
						<v-list-item>
							<v-list-item-avatar tile class="mt-n7">
								<v-sheet color="green" width="40" height="40" elevation="6">
									<v-icon dark large>category</v-icon>
								</v-sheet>
							</v-list-item-avatar>
							<v-list-item-content>
								<div :class="cardActive.kategoribarang ? `overline text-right white--text` : `overline text-right`">Kategori Barang Lelang</div>
								<div><v-divider :class="cardActive.kategoribarang && `white`" /></div>
							</v-list-item-content>
						</v-list-item>
					</v-card>
				</v-flex>
        <v-flex sm6 xs12 md6 lg4>
					<v-card :class="cardActive.barang ? `ma-3 light-blue darken-3`: `ma-3`" height="100" @click="LinkRoute(2)">
						<v-list-item>
							<v-list-item-avatar tile class="mt-n7">
								<v-sheet color="green" width="40" height="40" elevation="6">
									<v-icon dark large>fab fa-product-hunt</v-icon>
								</v-sheet>
							</v-list-item-avatar>
							<v-list-item-content>
								<div :class="cardActive.barang ? `overline text-right white--text` : `overline text-right`">Barang Lelang</div>
								<div><v-divider :class="cardActive.barang && `white`" /></div>
							</v-list-item-content>
						</v-list-item>
					</v-card>
				</v-flex>
        <v-flex sm6 xs12 md6 lg4>
					<v-card :class="cardActive.event ? `ma-3 light-blue darken-3`: `ma-3`" height="100" @click="LinkRoute(3)">
						<v-list-item>
							<v-list-item-avatar tile class="mt-n7">
								<v-sheet color="green" width="40" height="40" elevation="6">
									<v-icon dark large>event</v-icon>
								</v-sheet>
							</v-list-item-avatar>
							<v-list-item-content>
								<div :class="cardActive.event ? `overline text-right white--text` : `overline text-right`">Event</div>
								<div><v-divider :class="cardActive.event && `white`" /></div>
							</v-list-item-content>
						</v-list-item>
					</v-card>
				</v-flex>
				<v-flex sm6 xs12 md6 lg4>
					<v-card :class="cardActive.lot ? `ma-3 light-blue darken-3`: `ma-3`" height="100" @click="LinkRoute(4)">
						<v-list-item>
							<v-list-item-avatar tile class="mt-n7">
								<v-sheet color="green" width="40" height="40" elevation="6">
									<v-icon dark large>how_to_vote</v-icon>
								</v-sheet>
							</v-list-item-avatar>
							<v-list-item-content>
								<div :class="cardActive.lot ? `overline text-right white--text` : `overline text-right`">Lot</div>
								<div><v-divider :class="cardActive.lot && `white`" /></div>
							</v-list-item-content>
						</v-list-item>
					</v-card>
				</v-flex>
        <v-flex sm6 xs12 md6 lg4>
					<v-card :class="cardActive.pembelian_npl ? `ma-3 light-blue darken-3`: `ma-3`" height="100" @click="LinkRoute(5)">
						<v-list-item>
							<v-list-item-avatar tile class="mt-n7">
								<v-sheet color="green" width="40" height="40" elevation="6">
									<v-icon dark large>paid</v-icon>
								</v-sheet>
							</v-list-item-avatar>
							<v-list-item-content>
								<div :class="cardActive.pembelian_npl ? `overline text-right white--text` : `overline text-right`">Pembelian NPL</div>
								<div><v-divider :class="cardActive.pembelian_npl && `white`" /></div>
							</v-list-item-content>
						</v-list-item>
					</v-card>
				</v-flex>
        <v-flex sm6 xs12 md6 lg4>
					<v-card :class="cardActive.npl ? `ma-3 light-blue darken-3`: `ma-3`" height="100" @click="LinkRoute(6)">
						<v-list-item>
							<v-list-item-avatar tile class="mt-n7">
								<v-sheet color="green" width="40" height="40" elevation="6">
									<v-icon dark large>pin</v-icon>
								</v-sheet>
							</v-list-item-avatar>
							<v-list-item-content>
								<div :class="cardActive.npl ? `overline text-right white--text` : `overline text-right`">Nomor Peserta lelang</div>
								<div><v-divider :class="cardActive.npl && `white`" /></div>
							</v-list-item-content>
						</v-list-item>
					</v-card>
				</v-flex>
        <v-flex sm6 xs12 md6 lg4>
					<v-card :class="cardActive.bidding ? `ma-3 light-blue darken-3`: `ma-3`" height="100" @click="LinkRoute(7)">
						<v-list-item>
							<v-list-item-avatar tile class="mt-n7">
								<v-sheet color="green" width="40" height="40" elevation="6">
									<v-icon dark large>local_offer</v-icon>
								</v-sheet>
							</v-list-item-avatar>
							<v-list-item-content>
								<div :class="cardActive.bidding ? `overline text-right white--text` : `overline text-right`">Penawaran (Bidding)</div>
								<div><v-divider :class="cardActive.bidding && `white`" /></div>
							</v-list-item-content>
						</v-list-item>
					</v-card>
				</v-flex>
        <v-flex sm6 xs12 md6 lg4>
					<v-card :class="cardActive.pemenang ? `ma-3 light-blue darken-3`: `ma-3`" height="100" @click="LinkRoute(8)">
						<v-list-item>
							<v-list-item-avatar tile class="mt-n7">
								<v-sheet color="green" width="40" height="40" elevation="6">
									<v-icon dark large>emoji_events</v-icon>
								</v-sheet>
							</v-list-item-avatar>
							<v-list-item-content>
								<div :class="cardActive.pemenang ? `overline text-right white--text` : `overline text-right`">Pemenang Lelang</div>
								<div><v-divider :class="cardActive.pemenang && `white`" /></div>
							</v-list-item-content>
						</v-list-item>
					</v-card>
				</v-flex>
			</v-layout>
		</v-container>
		<v-divider style="border: 1px solid #000" />
		<v-card v-if="LelangPanel != 0" class="mt-2 mb-2 pa-1" elevation="0">
			<V_KategoriBarang v-if="LelangPanel == 1" />
			<V_Barang v-else-if="LelangPanel == 2" />
			<V_Event v-else-if="LelangPanel == 3" />
			<V_Lot v-else-if="LelangPanel == 4" />
			<V_PembelianNPL v-else-if="LelangPanel == 5" />
			<V_NPL v-else-if="LelangPanel == 6" />
			<V_Bidding v-else-if="LelangPanel == 7" />
			<V_Pemenang v-else-if="LelangPanel == 8" />
		</v-card>
	</div>    
</template>

<script>
import V_KategoriBarang from './V_KategoriBarang.vue'
import V_Barang from './V_Barang.vue'
import V_Lot from './V_Lot.vue'
import V_Event from './V_Event.vue'
import V_PembelianNPL from './V_PembelianNPL.vue'
import V_NPL from './V_NPL.vue'
import V_Bidding from './V_Bidding.vue'
import V_Pemenang from './V_Pemenang.vue'
export default {
	name: "Lelang",
	components: { V_KategoriBarang, V_Barang, V_Lot, V_Event, V_PembelianNPL, V_NPL, V_Bidding, V_Pemenang },
	data: () => ({
		LelangPanel: 0,
		cardActive: {
			kategoribarang: false,
			barang: false,
			lot: false,
			event: false,
			pembelian_npl: false,
			npl: false,
			bidding: false,
			pemenang: false,
		},
	}),
	mounted() {
		this.LelangPanel = 0
	},
	metaInfo: {
		title: "Lelang - WIN.ID",
		htmlAttrs: {
			lang: "id",
			amp: true,
		},
	},
	methods:{
		LinkRoute(number){
			this.cardActive = {
				kategoribarang: false,
				barang: false,
				lot: false,
				event: false,
				pembelian_npl: false,
				npl: false,
				bidding: false,
				pemenang: false,
			}
			if(number == 1){ this.cardActive = { ...this.cardActive, kategoribarang: true } }
			if(number == 2){ this.cardActive = { ...this.cardActive, barang: true } }
			if(number == 3){ this.cardActive = { ...this.cardActive, event: true } }
			if(number == 4){ this.cardActive = { ...this.cardActive, lot: true } }
			if(number == 5){ this.cardActive = { ...this.cardActive, pembelian_npl: true } }
			if(number == 6){ this.cardActive = { ...this.cardActive, npl: true } }
			if(number == 7){ this.cardActive = { ...this.cardActive, bidding: true } }
			if(number == 8){ this.cardActive = { ...this.cardActive, pemenang: true } }
			this.LelangPanel = number
		}
	}
}
</script>

<style>

</style>