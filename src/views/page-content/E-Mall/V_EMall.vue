<template>
	<div>
    <h1 class="subheading grey--text">Data Mall</h1>
		<v-container>
			<v-layout row wrap>
        <v-flex sm6 xs12 md6 lg4>
					<v-card :class="cardActive.mall ? `ma-3 light-blue darken-3`: `ma-3`" height="100" @click="LinkRoute(1)">
						<v-list-item>
							<v-list-item-avatar tile class="mt-n7">
								<v-sheet color="green" width="40" height="40" elevation="6">
									<v-icon dark large>store</v-icon>
								</v-sheet>
							</v-list-item-avatar>
							<v-list-item-content>
								<div :class="cardActive.mall ? `overline text-right white--text` : `overline text-right`">Mall</div>
								<div><v-divider :class="cardActive.mall && `white`" /></div>
							</v-list-item-content>
						</v-list-item>
					</v-card>
				</v-flex>
        <v-flex sm6 xs12 md6 lg4>
					<v-card :class="cardActive.fasilitasmall ? `ma-3 light-blue darken-3`: `ma-3`" height="100" @click="LinkRoute(2)">
						<v-list-item>
							<v-list-item-avatar tile class="mt-n7">
								<v-sheet color="green" width="40" height="40" elevation="6">
									<v-icon dark large>store</v-icon>
								</v-sheet>
							</v-list-item-avatar>
							<v-list-item-content>
								<div :class="cardActive.fasilitasmall ? `overline text-right white--text` : `overline text-right`">Fasilitas Mall</div>
								<div><v-divider :class="cardActive.fasilitasmall && `white`" /></div>
							</v-list-item-content>
						</v-list-item>
					</v-card>
				</v-flex>
        <v-flex sm6 xs12 md6 lg4>
					<v-card :class="cardActive.kategoritenantmall ? `ma-3 light-blue darken-3`: `ma-3`" height="100" @click="LinkRoute(3)">
						<v-list-item>
							<v-list-item-avatar tile class="mt-n7">
								<v-sheet color="green" width="40" height="40" elevation="6">
									<v-icon dark large>category</v-icon>
								</v-sheet>
							</v-list-item-avatar>
							<v-list-item-content>
								<div :class="cardActive.kategoritenantmall ? `overline text-right white--text` : `overline text-right`">Kategori Tenant Mall</div>
								<div><v-divider :class="cardActive.kategoritenantmall && `white`" /></div>
							</v-list-item-content>
						</v-list-item>
					</v-card>
				</v-flex>
				<v-flex sm6 xs12 md6 lg4>
					<v-card :class="cardActive.kategoricontent ? `ma-3 light-blue darken-3`: `ma-3`" height="100" @click="LinkRoute(4)">
						<v-list-item>
							<v-list-item-avatar tile class="mt-n7">
								<v-sheet color="green" width="40" height="40" elevation="6">
									<v-icon dark large>category</v-icon>
								</v-sheet>
							</v-list-item-avatar>
							<v-list-item-content>
								<div :class="cardActive.kategoricontent ? `overline text-right white--text` : `overline text-right`">Kategori Content</div>
								<div><v-divider :class="cardActive.kategoricontent && `white`" /></div>
							</v-list-item-content>
						</v-list-item>
					</v-card>
				</v-flex>
        <v-flex sm6 xs12 md6 lg4>
					<v-card :class="cardActive.tenantmall ? `ma-3 light-blue darken-3`: `ma-3`" height="100" @click="LinkRoute(5)">
						<v-list-item>
							<v-list-item-avatar tile class="mt-n7">
								<v-sheet color="green" width="40" height="40" elevation="6">
									<v-icon dark large>inventory_2</v-icon>
								</v-sheet>
							</v-list-item-avatar>
							<v-list-item-content>
								<div :class="cardActive.tenantmall ? `overline text-right white--text` : `overline text-right`">Tenant Mall</div>
								<div><v-divider :class="cardActive.tenantmall && `white`" /></div>
							</v-list-item-content>
						</v-list-item>
					</v-card>
				</v-flex>
        <v-flex sm6 xs12 md6 lg4>
					<v-card :class="cardActive.contentmall ? `ma-3 light-blue darken-3`: `ma-3`" height="100" @click="LinkRoute(6)">
						<v-list-item>
							<v-list-item-avatar tile class="mt-n7">
								<v-sheet color="green" width="40" height="40" elevation="6">
									<v-icon dark medium>fas fa-receipt</v-icon>
								</v-sheet>
							</v-list-item-avatar>
							<v-list-item-content>
								<div :class="cardActive.contentmall ? `overline text-right white--text` : `overline text-right`">Content Mall</div>
								<div><v-divider :class="cardActive.contentmall && `white`" /></div>
							</v-list-item-content>
						</v-list-item>
					</v-card>
				</v-flex>
        <v-flex sm6 xs12 md6 lg4>
					<v-card :class="cardActive.contenttenantmall ? `ma-3 light-blue darken-3`: `ma-3`" height="100" @click="LinkRoute(7)">
						<v-list-item>
							<v-list-item-avatar tile class="mt-n7">
								<v-sheet color="green" width="40" height="40" elevation="6">
									<v-icon dark medium>fas fa-receipt</v-icon>
								</v-sheet>
							</v-list-item-avatar>
							<v-list-item-content>
								<div :class="cardActive.contenttenantmall ? `overline text-right white--text` : `overline text-right`">Content Tenant Mall</div>
								<div><v-divider :class="cardActive.contenttenantmall && `white`" /></div>
							</v-list-item-content>
						</v-list-item>
					</v-card>
				</v-flex>
			</v-layout>
		</v-container>
		<v-divider style="border: 1px solid #000" />
		<v-card v-if="MallPanel != 0" class="mt-2 mb-2 pa-1" outlined elevation="0">
			<V_Mall v-if="MallPanel == 1" />
			<V_FasilitasMall v-if="MallPanel == 2" />
			<V_KategoriTenantMall v-else-if="MallPanel == 3" />
			<V_KategoriContent v-else-if="MallPanel == 4" />
			<V_TenantMall v-else-if="MallPanel == 5" />
			<V_ContentMall v-else-if="MallPanel == 6" />
			<V_ContentTenantMall v-else-if="MallPanel == 7" />
		</v-card>
	</div>    
</template>

<script>
import V_Mall from './V_Mall.vue'
import V_FasilitasMall from './V_FasilitasMall.vue'
import V_KategoriTenantMall from './V_KategoriTenantMall.vue'
import V_TenantMall from './V_TenantMall.vue'
import V_KategoriContent from './V_KategoriContent.vue'
import V_ContentMall from './V_ContentMall.vue'
import V_ContentTenantMall from './V_ContentTenantMall.vue'
export default {
	name: "EMall",
	components: { V_FasilitasMall, V_Mall, V_KategoriTenantMall, V_TenantMall, V_KategoriContent, V_ContentMall, V_ContentTenantMall },
	data: () => ({
		MallPanel: 0,
		cardActive: {
			mall: false,
			fasilitasmall: false,
			kategoritenantmall: false,
			kategoricontent: false,
			tenantmall: false,
			contentmall: false,
			contenttenantmall: false,
		},
	}),
	mounted() {
		this.MallPanel = 0
	},
	metaInfo: {
		title: "Mall - WIN.ID",
		htmlAttrs: {
			lang: "id",
			amp: true,
		},
	},
	methods:{
		LinkRoute(number){
			this.cardActive = {
				mall: false,
				fasilitasmall: false,
				kategoritenantmall: false,
				kategoricontent: false,
				tenantmall: false,
				contentmall: false,
				contenttenantmall: false,
			}
			if(number == 1){ this.cardActive = { ...this.cardActive, mall: true } }
			if(number == 2){ this.cardActive = { ...this.cardActive, fasilitasmall: true } }
			if(number == 3){ this.cardActive = { ...this.cardActive, kategoritenantmall: true } }
			if(number == 4){ this.cardActive = { ...this.cardActive, kategoricontent: true } }
			if(number == 5){ this.cardActive = { ...this.cardActive, tenantmall: true } }
			if(number == 6){ this.cardActive = { ...this.cardActive, contentmall: true } }
			if(number == 7){ this.cardActive = { ...this.cardActive, contenttenantmall: true } }
			this.MallPanel = number
		}
	}
}
</script>

<style>

</style>