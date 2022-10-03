<template>
  <div>
		<v-card :class="roleID == 4 && 'mt-2 mb-2 pa-1'" :outlined="roleID == 4" elevation="0">
			<h1 class="subheading grey--text">Panel Order</h1>
			<v-card>
				<v-tabs
					v-model="tab"
					fixed-tabs
					background-color="light-blue darken-3"
					dark
				>
					<v-tab v-for="(item, i) in itemsTab" :key="i">
						{{ item.text }}
					</v-tab>
				</v-tabs>

				<v-tabs-items v-model="tab">
					<v-tab-item v-for="(item, i) in itemsTab" :key="i">
						<v-card class="pa-3">
							<v-row no-gutters class="pa-2">
								<v-col cols="12" md="6">
									<!-- <v-btn
										color="light-blue darken-3"
										small
										dense
										depressed
										class="ma-2 white--text text--darken-2"
										@click.stop="bukaDialog(null, 0)"
									>
										<v-icon small>add</v-icon>	Tambah
									</v-btn> -->
								</v-col>
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
									:items="DataOrders"
									:single-expand="singleExpand"
									:expanded.sync="expanded"
									show-expand
									item-key="id_order"
									hide-default-footer
									class="elevation-1"
									:page.sync="page"
									:items-per-page="itemsPerPage"
									@page-count="pageCount = $event"
								>
									<template #[`item.number`]="{ item }">
										{{ DataOrders.indexOf(item) + 1 }}
									</template>
									<template #[`item.no_order`]="{ item }">
										<strong><span v-html="item.no_order" /></strong>
									</template>
									<template #[`item.no_resi`]="{ item }">
										<strong><span v-html="item.no_resi ? item.no_resi : '-'" /></strong>
									</template>
									<template #[`item.produk`]="{ item }">
										<v-btn
											:value="item.id_order"
											color="#04f7f7"
											small
											dense
											depressed
											class="ma-2 white--text text--darken-2"
											@click="ListProduk(item)"
										>
										<v-icon small>info</v-icon>	Detail
										</v-btn>
									</template>
									<template #[`item.pembeli`]="{ item }">
										<strong><span v-html="item.data_peserta.nama" /></strong>
										<v-tooltip top>
											<template v-slot:activator="{ on, attrs }">
												<v-icon small v-bind="attrs" v-on="on">info</v-icon>
											</template>
											NIK : <strong><span v-html="item.data_peserta.nik" /></strong> <br>
											Nama : <strong><span v-html="item.data_peserta.nama" /></strong> <br>
											Email : <strong><span v-html="item.data_peserta.email" /></strong>
										</v-tooltip>
										<v-tooltip v-if="item.data_peserta.status_aktif == 0" bottom>
											<template v-slot:activator="{ on, attrs }">
												<strong>(<span v-bind="attrs" v-on="on">Non Active</span>)</strong>
											</template>
											<span>Harus Diubah Peserta tidak aktif</span>
										</v-tooltip>
									</template>
									<template #expanded-item="{ headers, item }">
										<td :colspan="headers.length" class="white">
											<v-btn
												:value="item.id_order"
												color="#0bd369"
												small
												dense
												depressed
												class="ma-2 white--text text--darken-2"
												:disabled="item.status_aktif == 0"
												@click="bukaDialog(item, 1)"
											>
											<v-icon small>edit</v-icon>	Ubah
											</v-btn>
											<v-btn
												:value="item.id_order"
												color="#bd3a07"
												small
												dense
												depressed
												class="ma-2 white--text text--darken-2"
												:disabled="item.status_aktif == 0"
												@click="HapusRecord(item)"
											>
											<v-icon small>delete</v-icon>	Hapus
											</v-btn> 
											<v-divider />
										</td>
									</template>
								</v-data-table>
							</div>
							<v-row>
								<v-col cols="12" class="mt-2 pa-2 px-5">
									<v-pagination
										v-if="DataOrders.length > 0"
										v-model="page"
										:length="pageCount"
										:total-visible="10"
									/>
								</v-col>
							</v-row>
						</v-card>
					</v-tab-item>
				</v-tabs-items>
			</v-card>
		</v-card>
		<v-dialog
      v-model="DialogOrderProduk"
      max-width="800px"
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="light-blue darken-3"
        >
          <v-toolbar-title>{{editedIndex == 0 ? 'Tambah' : 'Ubah'}} Data Kategori Produk</v-toolbar-title>
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
								Kategori Produk
							</v-col>
							<v-col
								cols="12"
								md="8"
								class="pt-3"
							>
								<v-text-field
									v-model="inputOrderProduk.kategori_produk"
									placeholder="Kategori Produk"
									outlined
									dense
									label="Kategori Produk"
									color="light-blue darken-3"
									hide-details
									clearable
								/>
							</v-col>
						</v-row>
					</v-card-text>
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
		<v-dialog
      v-model="DialogProduk"
      max-width="1000px"
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="light-blue darken-3"
        >
          <v-toolbar-title>Detail Produk</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <v-btn
              icon
              dark
              @click="() => { DialogProduk = false; detailProduk = ''; dataProduk = []; }"
            >
              <v-icon>close</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card>
					<div class="scrollText">
            <div class="px-5">
              <v-divider />
            </div>
						<v-card-text>
							<h3><u>DATA ORDER PRODUK</u></h3>
							<v-row no-gutters>
								<v-col
									cols="12"
									md="2"
									class="font-weight-bold"
								>
									No. Order
								</v-col>
								<v-col
									cols="12"
									md="10"
									class="font-weight-bold"
								>
									: {{ detailProduk ? detailProduk.no_order : '' }}
								</v-col>
							</v-row>
							<v-row no-gutters>
								<v-col
									cols="12"
									md="2"
									class="font-weight-bold"
								>
									No. resi
								</v-col>
								<v-col
									cols="12"
									md="10"
									class="font-weight-bold"
								>
									: {{ detailProduk ? detailProduk.no_resi ? detailProduk.no_resi : '-' : '' }}
								</v-col>
							</v-row>
							<v-row no-gutters>
								<v-col
									cols="12"
									md="2"
									class="font-weight-bold"
								>
									Order dibuat
								</v-col>
								<v-col
									cols="12"
									md="10"
									class="font-weight-bold"
								>
									: {{ detailProduk ? detailProduk.order_dibuat : '' }}
								</v-col>
							</v-row>
							<v-row no-gutters>
								<v-col
									cols="12"
									md="2"
									class="font-weight-bold"
								>
									Status Terakhir
								</v-col>
								<v-col
									cols="12"
									md="10"
									class="font-weight-bold"
								>
									: {{ detailProduk ? detailProduk.status_latest : '' }}
								</v-col>
							</v-row>
							<h3><u>DATA PENERIMA</u></h3>
							<v-row no-gutters>
								<v-col
									cols="12"
									md="2"
									class="font-weight-bold"
								>
									Nama Penerima
								</v-col>
								<v-col
									cols="12"
									md="10"
									class="font-weight-bold"
								>
									: {{ detailProduk ? detailProduk.data_penerima.nama_penerima : '' }}
								</v-col>
							</v-row>
							<v-row no-gutters>
								<v-col
									cols="12"
									md="2"
									class="font-weight-bold"
								>
									No. Telp Penerima
								</v-col>
								<v-col
									cols="12"
									md="10"
									class="font-weight-bold"
								>
									: {{ detailProduk ? detailProduk.data_penerima.telp_penerima : '' }}
								</v-col>
							</v-row>
							<v-row no-gutters>
								<v-col
									cols="12"
									md="2"
									class="font-weight-bold"
								>
									Alamat Penerima
								</v-col>
								<v-col
									cols="12"
									md="10"
									class="font-weight-bold"
								>
									: {{ detailProduk ? detailProduk.data_penerima.alamat_penerima : '' }}
								</v-col>
							</v-row>
							<v-data-table
								loading-text="Sedang memuat... Harap tunggu"
								no-data-text="Tidak ada data yang tersedia"
								no-results-text="Tidak ada catatan yang cocok ditemukan"
								:options.sync="query"
								:headers="headersProduk"
								:loading="isLoading"
								:items="dataProduk"
								item-key="id_produk"
								hide-default-footer
								class="elevation-1"
							>
								<template #[`item.number`]="{ item }">
									{{ dataProduk.indexOf(item) + 1 }}
								</template>
								<template #[`item.kode_produk`]="{ item }">
									<span v-html="item.data_produk.kode_produk" />
								</template>
								<template #[`item.nama_produk`]="{ item }">
									<span v-html="item.data_produk.nama_produk" />
								</template>
								<template #[`item.harga`]="{ item }">
									Rp.<span v-html="currencyDotFormatNumber(item.harga)" />
								</template>
								<template #footer>
									<v-divider />
									<div
										class="pa-2"
										color="white"
										flat
									>	
										<strong><span class="d-flex justify-end mr-15">Total Harga Rp.{{ currencyDotFormatNumber(detailProduk.total) }}</span></strong>
									</div>
								</template>
							</v-data-table>
						</v-card-text>
					</div>
					<v-card-actions>
						<v-row 
							no-gutters
							class="mt-1 mr-3"
						>
							<v-col
								class="text-end"
								cols="12"
							/>
						</v-row>
					</v-card-actions>
				</v-card>
			</v-card>
		</v-dialog>
	</div>
</template>

<script>
import { mapActions } from "vuex";
import PopUpNotifikasiVue from "../../Layout/PopUpNotifikasi.vue";
export default {
  name: 'OrderProduk',
	components: { PopUpNotifikasiVue },
	data: () => ({
		isLoading: false,
		roleID: '',
		DataOrders: [],
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
      { text: "No Order", value: "no_order", sortable: false },
      { text: "No Resi", value: "no_resi", sortable: false },
      { text: "Produk", value: "produk", sortable: false },
      { text: "Pembeli", value: "pembeli", sortable: false },
      { text: "Status Terakhir", value: "status_latest", sortable: false },
    ],
		headersProduk: [
      { text: "No", value: "number", sortable: false, width: "7%" },
      { text: "Kode Produk", value: "kode_produk", sortable: false },
      { text: "Produk", value: "nama_produk", sortable: false },
      { text: "Qty", value: "jumlah_produk", sortable: false },
      { text: "Harga", value: "harga", sortable: false },
    ],
    rowsPerPageItems: { "items-per-page-options": [5, 10, 25, 50] },
    totalItems: 0,
		DialogOrderProduk: false,
		DialogProduk: false,
		detailProduk: '',
		dataProduk: [],
		editedIndex: 0,
    kondisiTombol: true,
		itemsTab: [
			{code: '1', text: 'Menunggu Konfirmasi'},
			{code: '2', text: 'Diproses - Siap Dikirim'},
			{code: '3', text: 'Dikirim'},
			{code: '4', text: 'Tiba Ditujuan'},
			{code: '5', text: 'Transaksi Selesai'},
			{code: '6', text: 'Transaksi batal'}
		],
		tab: '',
		inputOrderProduk: {
			id_order: '',
			kategori_produk: '',
		},

		//notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
	}),
	metaInfo: {
		title: "E-Commerce (Order Produk) - WIN.ID",
		htmlAttrs: {
			lang: "id",
			amp: true,
		},
	},
	watch:{
		inputOrderProduk: {
			deep: true,
			handler(value){
				if(value.kategori_produk == null){ this.inputProduk.kategori_produk = '' }

				if(value.kategori_produk != ''){
					this.kondisiTombol = false
				}else{
					this.kondisiTombol = true	
				}
			}
		},
		tab:{
			handler(value){
				this.getOrders(value)
			}
		}
	},
	mounted() {
		this.roleID = localStorage.getItem("roleID")
		// this.getOrders('0')
	},
	methods: {
		...mapActions(["fetchData"]),
		getOrders(code) {
			this.isLoading = true
			let payload = {
				method: "get",
				url: `moduleMain/getAllOrder?code_status=${code}`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				this.DataOrders = res.data.result;
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
				this.inputOrderProduk.id_order = item.id_order
        this.inputOrderProduk.kategori_produk = item.kategori_produk
			}
			this.DialogOrderProduk = true
		},
		tutupDialog() {
      this.clearForm()
      this.DialogOrderProduk = false
    },
		SimpanForm(index) {
      let bodyData = {
        jenis: index == 0 ? 'ADD' : 'EDIT',
        id_order: index == 0 ? '' : this.inputOrderProduk.id_order,
        kategori_produk: this.inputOrderProduk.kategori_produk,
        create_update_by: localStorage.getItem('idLogin'),
      }
      let payload = {
				method: "post",
				url: `moduleMain/prosesOrderProduk`,
        body: bodyData,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
        this.DialogOrderProduk = false
        this.getOrders()
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
    },
    HapusRecord(item) {
      let bodyData = {
        jenis: 'DELETE',
        id_order: item.id_order,
        kategori_produk: item.kategori_produk,
        delete_by: localStorage.getItem('idLogin'),
      }
      let payload = {
				method: "post",
				url: `moduleMain/prosesOrderProduk`,
        body: bodyData,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
        this.DialogOrderProduk = false
        this.getOrders()
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
    },
    StatusRecord(item, status_aktif) {
      let bodyData = {
        jenis: 'STATUSRECORD',
        id_order: item.id_order,
        kategori_produk: item.kategori_produk,
        status_aktif: status_aktif,
      }
      let payload = {
				method: "post",
				url: `moduleMain/prosesOrderProduk`,
        body: bodyData,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
        this.DialogOrderProduk = false
        this.getOrders()
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
    },
		clearForm() {
			this.inputOrderProduk.kategori_produk = ''
		},
		ListProduk(item) {
			console.log(item)
			this.detailProduk = item
			this.dataProduk = item.data_order_detail
			this.DialogProduk = true
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
.scrollText{
  max-height: 450px !important;
  overflow-y: auto !important;
}
.v-pagination {
  justify-content: flex-end !important;
}
.v-input .v-label {
  font-size: 11pt !important;
}
.v-text-field.v-input--dense {
  font-size: 13px !important;
}
.v-tab {
	font-size: 8pt !important;
	font-weight: bold !important;
}
</style>