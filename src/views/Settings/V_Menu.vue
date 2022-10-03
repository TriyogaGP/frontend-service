<template>
  <div>
		<h1 class="subheading grey--text">Panel Menu</h1>
		<v-row no-gutters class="pa-2">
			<v-col cols="12" md="6" />
			<v-col cols="12" md="6">
				<v-text-field
					v-model="searchData"
					append-icon="mdi-magnify"
					label="Pencarian..."
					single-line
					hide-details
					solo
					color="light-blue darken-3"
					clearable
				/>
			</v-col>
    </v-row>
    <div class="px-1">
			<v-data-table
				loading-text="Sedang memuat... Harap tunggu"
				no-data-text="Tidak ada data yang tersedia"
				no-results-text="Tidak ada catatan yang cocok ditemukan"
				:options.sync="query"
				:headers="headers"
				:search="searchData"
				:loading="isLoading"
				:items="DataMenu"
				:single-expand="singleExpand"
				:expanded.sync="expanded"
				show-expand
				item-key="idMenu"
				hide-default-footer
				class="elevation-1"
				:page.sync="page"
				:items-per-page="itemsPerPage"
				@page-count="pageCount = $event"
			>
				<template #[`item.number`]="{ item }">
					{{ DataMenu.indexOf(item) + 1 }}
				</template>
				<template #[`item.menuIcon`]="{ item }">
					<v-icon>{{item.menuIcon}}</v-icon> 
				</template>
				<template #[`item.menuRouter`]="{ item }">
					<span v-html="item.menuRouter" /> 
				</template>
				<template #[`item.status`]="{ item }">
					<v-icon small v-if="item.status == true" color="green">check</v-icon>
					<v-icon small v-else-if="item.status == false" color="red">clear</v-icon>
					<br>
					<span v-html="item.status == true ? 'Active' : 'Non Active'" />  
				</template>
				<template #expanded-item="{ headers, item }">
					<td :colspan="headers.length" class="white">
						<v-btn
							:value="item.idMenu"
							color="#0bd369"
							small
							dark
							dense
							class="ma-2"
						>
						<v-icon>edit</v-icon>	Ubah
						</v-btn> 
						<v-btn
							v-if="item.status == 0"
							:value="item.idMenu"
							color="#0bd369"
							small
							dark
							dense
							class="ma-2"
						>
						<v-icon>visibility</v-icon>	Active
						</v-btn> 
						<v-btn
							v-else-if="item.status == 1"
							:value="item.idMenu"
							color="#0bd369"
							small
							dark
							dense
							class="ma-2"
						>
						<v-icon>visibility_off</v-icon>	Non Active
						</v-btn> 
						<v-btn
							:value="item.idMenu"
							color="#bd3a07"
							small
							dark
							dense
							class="ma-2"
						>
						<v-icon>delete</v-icon>	Hapus
						</v-btn> 
						<v-divider />
					</td>
				</template>
			</v-data-table>
		</div>
		<v-row>
			<v-col cols="12" class="mt-2 pa-2 px-5">
				<v-pagination
					v-if="DataMenu.length > 0"
					v-model="page"
					:length="pageCount"
					:total-visible="10"
				/>
			</v-col>
		</v-row>
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
import PopUpNotifikasiVue from "../Layout/PopUpNotifikasi.vue";
export default {
  name: 'HakAkses',
	components: { PopUpNotifikasiVue },
  data: () => ({
    isLoading: false,
		DataMenu: [],
		page: 1,
    pageCount: 0,
    itemsPerPage: 10,
    expanded: [],
    singleExpand: true,
		searchData: "",
    query: {
      limit: 10,
      sort: ["-created_at"],
      page: 1,
      filter: "",
    },
		headers: [
      { text: "No", value: "number", sortable: false, width: "7%" },
      { text: "", value: "data-table-expand", sortable: false, width: "5%" },
      { text: "Role", value: "namaRole", sortable: false },
      { text: "Title Text", value: "menuText", sortable: false },
      { text: "Icon", value: "menuIcon", sortable: false },
      { text: "Route", value: "menuRoute", sortable: false },
      { text: "Status", value: "status", sortable: false },
    ],
    rowsPerPageItems: { "items-per-page-options": [5, 10, 25, 50] },
    totalItems: 0,

		//notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
  }),
  metaInfo: {
		title: "Settings (Hak Akses) - WIN.ID",
		htmlAttrs: {
			lang: "id",
			amp: true,
		},
	},
	mounted() {
		this.getMenu();
	},
	methods: {
		...mapActions(["fetchData"]),
		getMenu() {
			this.isLoading = true
			let payload = {
				method: "get",
				url: `settings/getMenu`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				this.DataMenu = res.data.result;
				this.isLoading = false
			})
			.catch((err) => {
				this.isLoading = false
				this.notifikasi("error", err.response.data.message, "1")
			});
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
.v-pagination {
  justify-content: flex-end !important;
}
</style>