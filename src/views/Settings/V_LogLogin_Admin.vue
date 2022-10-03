<template>
  <div>
		<h1 class="subheading grey--text">Panel Log Login Admin</h1>
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
				loading-text="Loading... Please wait"
				:options.sync="query"
				:headers="headers"
				:search="searchData"
				:loading="isLoading"
				:items="DataLogLoginAdmin"
				item-key="id_log_login_admin"
				hide-default-footer
				class="elevation-1"
				:page.sync="page"
				:items-per-page="itemsPerPage"
				@page-count="pageCount = $event"
			>
				<template #[`item.number`]="{ item }">
					{{ DataLogLoginAdmin.indexOf(item) + 1 }}
				</template>
				<template #[`item.latlong`]="{ item }">
					<span v-html="item.latitude" />, <span v-html="item.longitude" /> 
				</template>
			</v-data-table>
		</div>
		<v-row>
			<v-col cols="12" class="mt-2 pa-2 px-5">
				<v-pagination
					v-if="DataLogLoginAdmin.length > 0"
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
  name: 'LogLoginAdmin',
	components: { PopUpNotifikasiVue },
  data: () => ({
    isLoading: false,
		DataLogLoginAdmin: [],
		page: 1,
    pageCount: 0,
    itemsPerPage: 10,
		searchData: "",
    query: {
      limit: 10,
      sort: ["-created_at"],
      page: 1,
      filter: "",
    },
		headers: [
      { text: "No", value: "number", sortable: false, width: "7%" },
      { text: "Nama Login", value: "nama", sortable: false },
      { text: "LatLong", value: "latlong", sortable: false },
      { text: "Provinsi", value: "provinsi", sortable: false },
      { text: "Kota", value: "kota", sortable: false },
      { text: "Date Login", value: "createdAt", sortable: false },
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
		title: "Settings (Log Login Admin) - WIN.ID",
		htmlAttrs: {
			lang: "id",
			amp: true,
		},
	},
	mounted() {
		this.getLogLoginAdmin();
	},
	methods: {
		...mapActions(["fetchData"]),
		getLogLoginAdmin() {
			this.isLoading = true
			let payload = {
				method: "get",
				url: `settings/getLoggerAdmin`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				this.DataLogLoginAdmin = res.data.result;
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