<template>
  <div>
		<h1 class="subheading grey--text">Panel Kategori Barang Lelang</h1>
		<v-card class="mt-2 mb-2 pa-1" outlined elevation="0">
			<v-row no-gutters class="pa-2">
				<v-col cols="12" md="6">
					<v-btn
						color="light-blue darken-3"
						small
						dense
						depressed
						class="ma-2 white--text text--darken-2"
						@click.stop="bukaDialog(null, 0)"
					>
						<v-icon small>add</v-icon>	Tambah
					</v-btn>
				</v-col>
				<v-col cols="12" md="6">
					<v-text-field
            v-model="searchData"
            append-icon="mdi-magnify"
            label="Pencarian..."
            single-line
            hide-details
						clearable
            solo
            color="light-blue darken-3"
            @keyup.enter="getKategoriBarangLelang(1, limit, searchData)"
          />
				</v-col>
			</v-row>
			<div class="px-1">
				<v-data-table
					loading-text="Sedang memuat... Harap tunggu"
					no-data-text="Tidak ada data yang tersedia"
					no-results-text="Tidak ada catatan yang cocok ditemukan"
					:headers="headers"
					:loading="isLoading"
					:items="DataKategoriBarangLelang"
					:single-expand="singleExpand"
					:expanded.sync="expanded"
					show-expand
					item-key="idKategori"
					hide-default-footer
					class="elevation-1"
					:header-props="{
						'sort-icon': 'mdi-navigation'
					}"
					:items-per-page="itemsPerPage"
					@page-count="pageCount = $event"
				>
					<!-- <template #[`item.number`]="{ item }">
						{{ DataKategoriBarangLelang.indexOf(item) + 1 }}
					</template> -->
					<template #[`item.statusAktif`]="{ item }">
						<v-icon small v-if="item.statusAktif == true" color="green">check</v-icon>
						<v-icon small v-else-if="item.statusAktif == false" color="red">clear</v-icon>
						<br>
						<span v-html="item.statusAktif == true ? 'Active' : 'Non Active'" /> 
					</template>
					<template #expanded-item="{ headers, item }">
						<td :colspan="headers.length" class="white">
							<v-btn
								:value="item.idKategori"
								color="#0bd369"
								small
								dense
								depressed
								class="ma-2 white--text text--darken-2"
								:disabled="item.statusAktif == 0"
								@click="bukaDialog(item, 1)"
							>
							<v-icon small>edit</v-icon>	Ubah
							</v-btn> 
							<v-btn
								v-if="item.statusAktif == 0"
								:value="item.idKategori"
								color="#0bd369"
								small
								dense
								depressed
								class="ma-2 white--text text--darken-2"
								@click="StatusRecord(item, 1)"
							>
							<v-icon small>visibility</v-icon>	Active
							</v-btn> 
							<v-btn
								v-else-if="item.statusAktif == 1"
								:value="item.idKategori"
								color="#0bd369"
								small
								dense
								depressed
								class="ma-2 white--text text--darken-2"
								@click="StatusRecord(item, 0)"
							>
							<v-icon small>visibility_off</v-icon>	Non Active
							</v-btn> 
							<v-btn
								:value="item.idKategori"
								color="#bd3a07"
								small
								dense
								depressed
								class="ma-2 white--text text--darken-2"
								:disabled="item.statusAktif == 0"
								@click="HapusRecord(item)"
							>
							<v-icon small>delete</v-icon>	Hapus
							</v-btn> 
							<v-divider />
						</td>
					</template>
				</v-data-table>
			</div>
			<!-- <v-row>
				<v-col cols="12" class="mt-2 pa-2 px-5">
					<v-pagination
						v-if="DataKategoriBarangLelang.length > 0"
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
							:disabled="DataKategoriBarangLelang.length ? false : true"
						/>
						<v-icon
							style="cursor: pointer;"
							large
							:disabled="DataKategoriBarangLelang.length ? pageSummary.page != 1 ? false : true : true"
							@click="() => { page = pageSummary.page - 1 }"
						>
							keyboard_arrow_left
						</v-icon>
						<v-icon
							style="cursor: pointer;"
							large
							:disabled="DataKategoriBarangLelang.length ? pageSummary.page != pageSummary.totalPages ? false : true : true"
							@click="() => { page = pageSummary.page + 1 }"
						>
							keyboard_arrow_right
						</v-icon>
					</div>
				</v-col>
			</v-row>
		</v-card>
		<v-dialog
      v-model="DialogKategoriLelang"
      max-width="800px"
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="light-blue darken-3"
        >
          <v-toolbar-title>{{editedIndex == 0 ? 'Tambah' : 'Ubah'}} Data Kategori Barang Lelang</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <v-btn
              icon
              dark
              @click="tutupDialog"
            >
              <v-icon>close</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card>
					<v-card-text>
						<v-row no-gutters>
							<v-col
								cols="12"
								md="4"
								class="pt-2 d-flex align-center"
							>
								Kategori
							</v-col>
							<v-col
								cols="12"
								md="8"
								class="pt-3"
							>
								<v-text-field
									v-model="inputKategoriBarang.kategori"
									placeholder="Kategori"
									outlined
									dense
									label="Kategori"
									color="light-blue darken-3"
									hide-details
									clearable
								/>
							</v-col>
						</v-row>
					</v-card-text>
					<v-divider />
					<v-card-actions>
						<v-row 
							no-gutters
							class="mt-1 mr-3"
						>
							<v-col
								class="text-end"
								cols="12"
							>
								<v-btn
									v-if="editedIndex == 0"
									color="light-blue darken-3"
									class="white--text text--darken-2"
									small
									dense
									depressed
									:loading="btnProses"
									:disabled="kondisiTombol"
									@click="SimpanForm(0)"
								>
									Simpan Data
								</v-btn> 
								<v-btn
									v-else-if="editedIndex == 1"
									color="light-blue darken-3"
									class="white--text text--darken-2"
									small
									dense
									depressed
									:loading="btnProses"
									:disabled="kondisiTombol"
									@click="SimpanForm(1)"
								>
									Ubah Data
								</v-btn>
							</v-col>
						</v-row>
					</v-card-actions>
				</v-card>
			</v-card>
		</v-dialog>
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
import PopUpNotifikasiVue from "../../Layout/PopUpNotifikasi.vue";
export default {
  name: 'KategoriBarangLelang',
	components: { PopUpNotifikasiVue },
	data: () => ({
		isLoading: false,
		btnProses: false,
		roleID: '',
		DataKategoriBarangLelang: [],
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
		pageSummary: {
			page: '',
			limit: '',
			total: '',
			totalPages: ''
		},
		headers: [
      // { text: "No", value: "number", sortable: false, width: "7%" },
      { text: "#", value: "data-table-expand", sortable: false, width: "5%" },
      { text: "Kategori", value: "kategori", sortable: true },
      { text: "Status", value: "statusAktif", sortable: true },
    ],
    rowsPerPageItems: { "items-per-page-options": [5, 10, 25, 50] },
    totalItems: 0,
		DialogKategoriLelang: false,
		editedIndex: 0,
    kondisiTombol: true,
		inputKategoriBarang: {
			id_kategori: '',
			kategori: '',
		},

		//notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
	}),
	metaInfo: {
		title: "Lelang (Kategori Barang) - WIN.ID",
		htmlAttrs: {
			lang: "id",
			amp: true,
		},
	},
	watch:{
		inputKategoriBarang: {
			deep: true,
			handler(value){
				if(value.kategori == null){ this.inputKategoriBarang.kategori = '' }

				if(value.kategori != ''){
					this.kondisiTombol = false
				}else{
					this.kondisiTombol = true	
				}
			}
		},
		limit: {
			deep: true,
			handler(value) {
				this.getKategoriBarangLelang(1, value, this.searchData)
			}
		},
    searchData: {
			deep: true,
			handler(value) {
        if (value == null) {
          this.getKategoriBarangLelang(1, this.limit, this.searchData)
        }
			}
		}
	},
	mounted() {
		this.roleID = localStorage.getItem("roleID")
		this.getKategoriBarangLelang(1, this.limit, this.searchData)
	},
	methods: {
		...mapActions(["fetchData"]),
		getKategoriBarangLelang(page = 1, limit, keyword) {
			this.pageSummary = {
				page: '',
				limit: '',
				total: '',
				totalPages: ''
			}
      this.DataKategoriBarangLelang = []
			this.isLoading = true
			let payload = {
				method: "get",
				url: `lelang/getKategoriLelang?page=${page}&limit=${limit}&sort=DESC${keyword ? `&keyword=${keyword}` : ''}`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				let resdata = res.data.result;
				this.DataKategoriBarangLelang = resdata.records;
				this.pageSummary = {
					page: resdata.pageSummary.page,
					limit: resdata.pageSummary.limit,
					total: resdata.pageSummary.total,
					totalPages: resdata.pageSummary.totalPages
				}
				this.isLoading = false
			})
			.catch((err) => {
				this.isLoading = false
				this.notifikasi("error", err.response.data.message, "1")
			});
		},
		bukaDialog(item, index){
			this.editedIndex = index
			if(index == 0){
				this.clearForm()
      }else{
				this.inputKategoriBarang.id_kategori = item.idKategori
        this.inputKategoriBarang.kategori = item.kategori
			}
			this.DialogKategoriLelang = true
		},
		tutupDialog() {
      this.clearForm()
      this.DialogKategoriLelang = false
    },
		SimpanForm(index) {
			this.btnProses = true
      let bodyData = {
        jenis: index == 0 ? 'ADD' : 'EDIT',
        id_kategori: index == 0 ? '' : this.inputKategoriBarang.id_kategori,
        kategori: this.inputKategoriBarang.kategori,
        create_update_by: localStorage.getItem('idLogin'),
      }
      let payload = {
				method: "post",
				url: `lelang/postKategoriLelang`,
        body: bodyData,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
        this.DialogKategoriLelang = false
        this.btnProses = false
        this.getKategoriBarangLelang(1, this.limit, this.searchData)
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
				this.btnProses = false
				this.notifikasi("error", err.response.data.message, "1")
			});
    },
    HapusRecord(item) {
      let bodyData = {
        jenis: 'DELETE',
        id_kategori: item.idKategori,
        kategori: item.kategori,
        delete_by: localStorage.getItem('idLogin'),
      }
      let payload = {
				method: "post",
				url: `lelang/postKategoriLelang`,
        body: bodyData,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
        this.DialogKategoriLelang = false
        this.getKategoriBarangLelang(1, this.limit, this.searchData)
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
    },
    StatusRecord(item, status_aktif) {
      let bodyData = {
        jenis: 'STATUSRECORD',
        id_kategori: item.idKategori,
        kategori: item.kategori,
        status_aktif: status_aktif,
      }
      let payload = {
				method: "post",
				url: `lelang/postKategoriLelang`,
        body: bodyData,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
        this.DialogKategoriLelang = false
        this.getKategoriBarangLelang(1, this.limit, this.searchData)
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
    },
		clearForm() {
			this.inputKategoriBarang.id_kategori = ''
			this.inputKategoriBarang.kategori = ''
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
.v-input .v-label {
  font-size: 11pt !important;
}
.v-text-field.v-input--dense {
  font-size: 13px !important;
}
</style>