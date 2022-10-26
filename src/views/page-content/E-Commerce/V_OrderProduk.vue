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
								<v-col cols="12" md="6"/>
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
									:show-expand=false
									item-key="idOrder"
									hide-default-footer
									class="elevation-1"
									:page.sync="page"
									:items-per-page="itemsPerPage"
									@page-count="pageCount = $event"
								>
									<template #[`item.number`]="{ item }">
										{{ DataOrders.indexOf(item) + 1 }}
									</template>
									<template #[`item.noOrder`]="{ item }">
										<strong>
											<span v-html="item.noOrder" />
										</strong>
										<v-icon medium color="#0277bd" @click="DetailsOrderProduk(item)">info</v-icon>
									</template>
									<template #[`item.noResi`]="{ item }">
										<strong><span v-html="item.dataShipping.noResi ? item.dataShipping.noResi : '-'" /></strong>
									</template>
									<template #[`item.pembeli`]="{ item }">
										<strong><span v-html="item.dataBuyer.nama" /></strong>
										<v-tooltip top>
											<template v-slot:activator="{ on, attrs }">
												<v-icon small v-bind="attrs" v-on="on">info</v-icon>
											</template>
											Nama : <strong><span v-html="item.dataBuyer.nama" /></strong> <br>
											Email : <strong><span v-html="item.dataBuyer.email" /></strong> <br>
											No HP : <strong><span v-html="item.dataBuyer.noHP" /></strong>
										</v-tooltip>
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
      v-model="DialogOrderProduk"
      max-width="1200px"
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="light-blue darken-3"
        >
          <v-toolbar-title>Detail Order Produk</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <v-btn
              icon
              dark
              @click="() => { DialogOrderProduk = false; detailProduk = ''; dataProduk = []; }"
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
							<v-container>
								<v-layout row wrap>
									<v-flex sm6 xs12 md6 lg4>
										<v-card class="pa-2 ma-2" height="140">
											<h4><u>Order Produk</u></h4>
											<v-row no-gutters>
												<v-col
													cols="12"
													md="4"
													class="font-weight-bold caption"
												>
													No. Order
												</v-col>
												<v-col
													cols="12"
													md="8"
													class="font-weight-bold caption"
												>
													: {{ detailProduk ? detailProduk.noOrder : '' }}
												</v-col>
											</v-row>
											<v-row no-gutters>
												<v-col
													cols="12"
													md="4"
													class="font-weight-bold caption"
												>
													No. resi
												</v-col>
												<v-col
													cols="12"
													md="8"
													class="font-weight-bold caption"
												>
													: {{ detailProduk ? detailProduk.dataShipping.noResi ? detailProduk.dataShipping.noResi : '-' : '' }}
												</v-col>
											</v-row>
											<v-row no-gutters>
												<v-col
													cols="12"
													md="4"
													class="font-weight-bold caption"
												>
													Order dibuat
												</v-col>
												<v-col
													cols="12"
													md="8"
													class="font-weight-bold caption"
												>
													: {{ detailProduk ? detailProduk.orderCreate : '' }}
												</v-col>
											</v-row>
											<v-row no-gutters>
												<v-col
													cols="12"
													md="4"
													class="font-weight-bold caption"
												>
													Status Terakhir
												</v-col>
												<v-col
													cols="12"
													md="8"
													class="font-weight-bold caption"
												>
													: {{ detailProduk ? detailProduk.statusLatest : '' }}
												</v-col>
											</v-row>
										</v-card>
									</v-flex>
									<v-flex sm6 xs12 md6 lg4>
										<v-card class="pa-2 ma-2" height="140">
											<h4><u>Pembeli Info</u></h4>
											<v-row no-gutters>
												<v-col
													cols="12"
													md="4"
													class="font-weight-bold caption"
												>
													Nama Pembeli
												</v-col>
												<v-col
													cols="12"
													md="8"
													class="font-weight-bold caption"
												>
													: {{ detailProduk ? detailProduk.dataBuyer.nama : '' }}
												</v-col>
											</v-row>
											<v-row no-gutters>
												<v-col
													cols="12"
													md="4"
													class="font-weight-bold caption"
												>
													Email Pembeli
												</v-col>
												<v-col
													cols="12"
													md="8"
													class="font-weight-bold caption"
												>
													: {{ detailProduk ? detailProduk.dataBuyer.email : '' }}
												</v-col>
											</v-row>
											<v-row no-gutters>
												<v-col
													cols="12"
													md="4"
													class="font-weight-bold caption"
												>
													No. Telp Pembeli
												</v-col>
												<v-col
													cols="12"
													md="8"
													class="font-weight-bold caption"
												>
													: {{ detailProduk ? detailProduk.dataBuyer.noHP : '' }}
												</v-col>
											</v-row>
											<v-row no-gutters class="mb-2">
												<v-col
													cols="12"
													md="4"
													class="font-weight-bold caption"
												>
													Alamat Pembeli
												</v-col>
												<v-col
													cols="12"
													md="8"
													class="font-weight-bold caption"
												>
													: {{ detailProduk ? detailProduk.dataBuyer.alamat : '' }}
												</v-col>
											</v-row>
										</v-card>
									</v-flex>
									<v-flex sm6 xs12 md6 lg4>
										<v-card class="pa-2 ma-2" height="140">
											<h4><u>Penerima Info</u></h4>
											<v-row no-gutters>
												<v-col
													cols="12"
													md="4"
													class="font-weight-bold caption"
												>
													Nama Penerima
												</v-col>
												<v-col
													cols="12"
													md="8"
													class="font-weight-bold caption"
												>
													: {{ detailProduk ? detailProduk.dataRecipient.namaPenerima : '' }}
												</v-col>
											</v-row>
											<v-row no-gutters>
												<v-col
													cols="12"
													md="4"
													class="font-weight-bold caption"
												>
													No. Telp Penerima
												</v-col>
												<v-col
													cols="12"
													md="8"
													class="font-weight-bold caption"
												>
													: {{ detailProduk ? detailProduk.dataRecipient.telpPenerima : '' }}
												</v-col>
											</v-row>
											<v-row no-gutters class="mb-2">
												<v-col
													cols="12"
													md="4"
													class="font-weight-bold caption"
												>
													Alamat Penerima
												</v-col>
												<v-col
													cols="12"
													md="8"
													class="font-weight-bold caption"
												>
													: {{ detailProduk ? detailProduk.dataShipping.alamatPenerima+' ('+detailProduk.dataShipping.alamatDetail+')' : '' }}
												</v-col>
											</v-row>
										</v-card>
									</v-flex>
								</v-layout>
							</v-container>
							<v-container>
								<v-layout row wrap>
									<v-flex sm6 xs12 md6 lg3>
										<v-card class="pa-2 ma-2" height="80">
											<div class="text-center">
												<span class="font-weight-bold body-2">Total Quantity</span><br>
												<span class="caption">{{detailProduk.berat}}</span><br>
												<span class="font-weight-bold caption">{{detailProduk.items}} item(s)</span>
											</div>
										</v-card>
									</v-flex>
									<v-flex sm6 xs12 md6 lg3>
										<v-card class="pa-2 ma-2" height="80">
											<div class="text-center">
												<span class="font-weight-bold body-2">Total Order Value</span><br>
												<span class="caption">{{detailProduk.paymentProvider}} - {{detailProduk.paymentMethod}}</span><br>
												<span class="font-weight-bold caption">Rp.{{ currencyDotFormatNumber(detailProduk.total+detailProduk.shippingPrice+detailProduk.adminFee) }}</span>
											</div>
										</v-card>
									</v-flex>
									<v-flex sm6 xs12 md6 lg3>
										<v-card class="pa-2 ma-2" height="80">
											<div class="text-center">
												<span class="font-weight-bold body-2">Total Point Order</span><br>
												<span class="caption">Pembeli: {{detailProduk ? detailProduk.dataBuyer.nama : ''}}</span><br>
												<span class="font-weight-bold caption">{{detailProduk.pointBelanja}}</span>
											</div>
										</v-card>
									</v-flex>
									<v-flex sm6 xs12 md6 lg3>
										<v-card class="pa-2 ma-2" height="80">
											<div class="text-center">
												<span class="font-weight-bold body-2">Total Point Keseluruhan</span><br>
												<span class="caption">Pembeli: {{detailProduk ? detailProduk.dataBuyer.nama : ''}}</span><br>
												<span class="font-weight-bold caption">isi point user</span>
											</div>
										</v-card>
									</v-flex>
								</v-layout>
							</v-container>
							<v-card class="pa-2 ma-2">
								<h4><u>Payment Details</u></h4>
								<v-data-table
									loading-text="Sedang memuat... Harap tunggu"
									no-data-text="Tidak ada data yang tersedia"
									no-results-text="Tidak ada catatan yang cocok ditemukan"
									:options.sync="query"
									:headers="headersPayment"
									:loading="isLoading"
									:items="dataPaymentDetails"
									item-key="idOrderPayment"
									hide-default-footer
									class="elevation-0"
								>
									<template #[`item.number`]="{ item }">
										{{ dataPaymentDetails.indexOf(item) + 1 }}
									</template>
									<template #[`item.payment`]="{ item }">
										<span>{{item.paymentProvider}} - {{item.paymentMethod}} ({{item.paymentAccountNo}})</span>
									</template>
									<template #[`item.harga`]="{ item }">
										Rp.<span v-html="currencyDotFormatNumber(item.harga)" />
									</template>
									<template #[`item.shippingFee`]="{ item }">
										Rp.<span v-html="currencyDotFormatNumber(item.shippingFee)" />
									</template>
									<template #[`item.adminFee`]="{ item }">
										Rp.<span v-html="currencyDotFormatNumber(item.adminFee)" />
									</template>
									<template #[`item.total`]="{ item }">
										Rp.<span v-html="currencyDotFormatNumber(item.total)" />
									</template>
								</v-data-table>
							</v-card>
							<v-card class="pa-2 ma-2">
								<h4><u>Tracking Status</u></h4>
								<v-data-table
									loading-text="Sedang memuat... Harap tunggu"
									no-data-text="Tidak ada data yang tersedia"
									no-results-text="Tidak ada catatan yang cocok ditemukan"
									:options.sync="query"
									:headers="headersStatus"
									:loading="isLoading"
									:items="dataOrderStatus"
									item-key="idOrderMoves"
									hide-default-footer
									class="elevation-0"
								>
									<template #[`item.number`]="{ item }">
										{{ dataOrderStatus.indexOf(item) + 1 }}
									</template>
								</v-data-table>
							</v-card>
							<v-card class="pa-2 ma-2">
								<h4><u>Produk</u></h4>
								<v-data-table
									loading-text="Sedang memuat... Harap tunggu"
									no-data-text="Tidak ada data yang tersedia"
									no-results-text="Tidak ada catatan yang cocok ditemukan"
									:options.sync="query"
									:headers="headersProduk"
									:loading="isLoading"
									:items="dataProduk"
									item-key="idProduk"
									hide-default-footer
									class="elevation-0"
								>
									<template #[`item.number`]="{ item }">
										{{ dataProduk.indexOf(item) + 1 }}
									</template>
									<template #[`item.cover`]="{ item }">
										<img :src="item.coverImage ? `${API_URL}image/produk/${item.coverImage}` : `${API_URL}No_Image_Available.jpg`" width="65"/>
									</template>
									<template #[`item.kodeProduk`]="{ item }">
										<span v-html="item.kodeProduk" />
									</template>
									<template #[`item.namaProduk`]="{ item }">
										<span v-html="item.namaProduk" />
									</template>
									<template #[`item.harga`]="{ item }">
										Rp.<span v-html="currencyDotFormatNumber(item.harga)" />
									</template>
									<template #[`item.subTotal`]="{ item }">
										Rp.<span v-html="currencyDotFormatNumber(item.subTotal)" />
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
							</v-card>
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
		API_URL: '',
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
      // { text: "", value: "data-table-expand", sortable: false, width: "5%" },
      { text: "No Order", value: "noOrder", sortable: false },
      { text: "No Resi", value: "noResi", sortable: false },
      // { text: "Produk", value: "produk", sortable: false },
      { text: "Pembeli", value: "pembeli", sortable: false },
      { text: "Status Terakhir", value: "statusLatest", sortable: false },
    ],
		headersProduk: [
      { text: "No", value: "number", sortable: false, width: "7%" },
      { text: "", value: "cover", sortable: false, width: "5%" },
      { text: "Kode Produk", value: "kodeProduk", sortable: false },
      { text: "Produk", value: "namaProduk", sortable: false },
      { text: "Qty", value: "jumlahProduk", sortable: false },
      { text: "Harga", value: "harga", sortable: false },
      { text: "SubTotal", value: "subTotal", sortable: false },
    ],
		headersPayment: [
      { text: "No", value: "number", sortable: false, width: "7%" },
      { text: "Payment Method", value: "payment", sortable: false },
      { text: "Date", value: "createdAt", sortable: false },
      { text: "SubTotal", value: "harga", sortable: false },
      { text: "Shipping Fee", value: "shippingFee", sortable: false },
      { text: "Admin Fee", value: "adminFee", sortable: false },
      { text: "Total", value: "total", sortable: false },
    ],
		headersStatus: [
      { text: "No", value: "number", sortable: false, width: "7%" },
      { text: "Date", value: "createdAt", sortable: false },
      { text: "Status", value: "statusLatest", sortable: false },
    ],
    rowsPerPageItems: { "items-per-page-options": [5, 10, 25, 50] },
    totalItems: 0,
		DialogOrderProduk: false,
		detailProduk: '',
		dataProduk: [],
		dataPaymentDetails: [],
		dataOrderStatus: [],
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
		tab:{
			handler(value){
				this.getOrders(value)
			}
		}
	},
	mounted() {
		this.API_URL = process.env.VUE_APP_NODE_ENV === "production" ? process.env.VUE_APP_VIEW_PROD_API_URL : process.env.VUE_APP_VIEW_DEV_API_URL
		this.roleID = localStorage.getItem("roleID")
		// this.getOrders('0')
	},
	methods: {
		...mapActions(["fetchData"]),
		getOrders(code) {
			this.isLoading = true
			let payload = {
				method: "get",
				url: `ecommerce/getOrder?code_status=${code}`,
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
		DetailsOrderProduk(item) {
			// console.log(item)
			this.detailProduk = item
			this.dataProduk = item.dataProduk
			this.dataPaymentDetails = item.dataPaymentDetails
			this.dataOrderStatus = item.dataOrderStatus
			this.DialogOrderProduk = true
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
img {
	border-style: solid !important;
	border-radius: 10px !important;
	padding: 2px !important;
}
</style>