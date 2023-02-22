<template>
  <div>
		<h1 class="subheading grey--text">Panel Log Login Admin</h1>
		<v-row no-gutters class="pa-2">
			<v-col cols="12" md="6" />
			<v-col cols="12" md="6">
				<v-row no-gutters>
					<v-col cols="12" md="9">
						<v-text-field
						v-model="searchData"
						append-icon="mdi-magnify"
						label="Pencarian..."
							single-line
							hide-details
							clearable
							solo
							color="light-blue darken-3"
							@keyup.enter="getLogLoginAdmin(1, limit, searchData)"
						/>
					</v-col>
					<v-col cols="12" md="3" class="pl-2 d-flex justify-end align-center">
						<v-autocomplete
							v-model="page"
							:items="pageOptions"
							item-text="value"
							item-value="value"
							label="Page"
							outlined
							dense
							hide-details
							:disabled="DataLogLoginAdmin.length ? false : true"
						/>
					</v-col>
				</v-row>
			</v-col>
    </v-row>
    <div class="px-1">
			<v-data-table
				loading-text="Loading... Please wait"
				:headers="headers"
				:loading="isLoading"
				:items="DataLogLoginAdmin"
				item-key="id_log_login_admin"
				:sort-by="sortBy"
				:sort-desc="sortDesc"
				multi-sort
				hide-default-footer
				class="elevation-1"
				:header-props="{
					'sort-icon': 'mdi-navigation'
				}"
				:items-per-page="itemsPerPage"
				@page-count="pageCount = $event"
				@update:sort-by="updateSort('by', $event)"
				@update:sort-desc="updateSort('desc', $event)"
			>
				<!-- <template #[`item.number`]="{ item }">
					{{ DataLogLoginAdmin.indexOf(item) + 1 }}
				</template> -->
				<template #[`item.latlong`]="{ item }">
					<span v-html="item.latitude" />, <span v-html="item.longitude" /> 
				</template>
			</v-data-table>
		</div>
		<!-- <v-row>
			<v-col cols="12" class="mt-2 pa-2 px-5">
				<v-pagination
					v-if="DataLogLoginAdmin.length > 0"
					v-model="page"
					:length="pageCount"
					:total-visible="10"
				/>
			</v-col>
		</v-row> -->
		<v-row>
			<v-col cols="10" class="mt-2 d-flex justify-start align-center">
				<span>Halaman <strong>{{ pageSummary.page ? pageSummary.page : 0 }}</strong> dari Total Halaman <strong>{{ pageSummary.totalPages ? pageSummary.totalPages : 0 }}</strong> (Records {{ pageSummary.total ? pageSummary.total : 0 }})</span>
			</v-col>
			<v-col cols="2" class="mt-2 text-right">
				<div class="d-flex justify-end">
					<v-autocomplete
						v-model="limit"
						:items="limitPage"
						item-text="value"
						item-value="value"
						outlined
						dense
						hide-details
						:disabled="DataLogLoginAdmin.length ? false : true"
					/>
					<v-icon
						style="cursor: pointer;"
						large
						:disabled="DataLogLoginAdmin.length ? pageSummary.page != 1 ? false : true : true"
						@click="() => { page = pageSummary.page - 1 }"
					>
						keyboard_arrow_left
					</v-icon>
					<v-icon
						style="cursor: pointer;"
						large
						:disabled="DataLogLoginAdmin.length ? pageSummary.page != pageSummary.totalPages ? false : true : true"
						@click="() => { page = pageSummary.page + 1 }"
					>
						keyboard_arrow_right
					</v-icon>
				</div>
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
    itemsPerPage: 100,
    expanded: [],
    singleExpand: true,
		searchData: "",
    limit: 10,
		limitPage: [
			{ value: 5 },
			{ value: 10 },
			{ value: 20 },
			{ value: 50 },
			{ value: 100 },
		],
    pageOptions: [
      { value: 1 }
    ],
		pageSummary: {
			page: '',
			limit: '',
			total: '',
			totalPages: ''
		},
		headers: [
      // { text: "No", value: "number", sortable: false, width: "7%" },
      { text: "Nama Login", value: "nama", sortable: true },
      { text: "LatLong", value: "latlong", sortable: false },
      { text: "Provinsi", value: "provinsi", sortable: true },
      { text: "Kota", value: "kota", sortable: true },
      { text: "Date Login", value: "createdAt", sortable: true },
    ],
    rowsPerPageItems: { "items-per-page-options": [5, 10, 25, 50] },
    totalItems: 0,
		sortBy: [],
    sortDesc: [],
    kumpulSort: '',

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
	watch: {
		page: {
			deep: true,
			handler(value) {
				this.getLogLoginAdmin(value, this.limit, this.searchData)
			}
		},
    limit: {
			deep: true,
			handler(value) {
				this.getLogLoginAdmin(1, value, this.searchData)
			}
		},
    searchData: {
			deep: true,
			handler(value) {
        if (value == null) {
          this.getLogLoginAdmin(1, this.limit, this.searchData)
        }
			}
		},
    sortDesc: {
			deep: true,
			handler(value) {
        this.getLogLoginAdmin(1, this.limit, this.searchData)
			}
		},
	},
	mounted() {
		this.getLogLoginAdmin(1, this.limit, this.searchData);
	},
	methods: {
		...mapActions(["fetchData"]),
		getLogLoginAdmin(page = 1, limit, keyword) {
      this.itemsPerPage = limit
      this.page = page
      this.pageSummary = {
				page: '',
				limit: '',
				total: '',
				totalPages: ''
			}
			this.DataLogLoginAdmin = []
			this.pageOptions = [{ value: 1 }]
			this.isLoading = true
			let payload = {
				method: "get",
				url: `settings/getLoggerAdmin?page=${page}&limit=${limit}${keyword ? `&keyword=${keyword}` : ''}&sort=${this.kumpulSort}`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				let resdata = res.data.result;
        this.DataLogLoginAdmin = resdata.records
        this.pageSummary = {
					page: resdata.pageSummary.page,
					limit: resdata.pageSummary.limit,
					total: resdata.pageSummary.total,
					totalPages: resdata.pageSummary.totalPages
				}
        for (let index = 1; index <= this.pageSummary.totalPages; index++) {
          this.pageOptions.push({ value: index })
        }
				this.isLoading = false
			})
			.catch((err) => {
				this.itemsPerPage = limit
				this.page = page
				this.pageSummary = {
					page: '',
					limit: '',
					total: '',
					totalPages: ''
				}
				this.DataLogLoginAdmin = []
				this.pageOptions = [{ value: 1 }]
				this.isLoading = false
				this.notifikasi("error", err.response.data.message, "1")
			});
		},
		updateSort(kondisi, data){
      if(kondisi === 'by'){
        this.sortBy = data
      }else if(kondisi === 'desc'){
        this.sortDesc = data
      }
      this.kumpulSort = this.sortBy.map((val, i) => {
        return `${val}-${this.sortDesc[i] === false ? 'ASC' : 'DESC'}`
      }).join(',')
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
.v-data-table-header__icon {
  opacity: 10;
}
</style>