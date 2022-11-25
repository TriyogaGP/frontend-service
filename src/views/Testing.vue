<template>
	<div>
		<h4>Testing {{ siteLogin }}</h4>
		<v-btn
			color="lime accent-3"
			small
			dense
			depressed
			class="black--text text--darken-2"
			@click="tombolJoin()"
		>
			<v-icon small left>person</v-icon> Tombol {{ siteLogin }}
		</v-btn>
		<v-btn
			v-if="siteLogin == 'Admin'"
			color="lime accent-3"
			small
			dense
			depressed
			class="ml-2 black--text text--darken-2"
			@click="Clear()"
			>
			<v-icon small left>clear</v-icon> Clear
		</v-btn>
		<div class="mt-3" v-for="(data, index) in userData" :key="index">
			{{ data.nama }}<br>
		</div>

		<v-divider class="mt-3 mb-2" />
		<v-card class="mt-2 mb-2 pa-1" outlined elevation="0">
			<h4>HIT MANUAL</h4>
			<v-card-text>
				<v-row no-gutters>
					<v-col
						cols="12"
						md="4"
						class="pt-2 d-flex align-center"
					>
						No Invoice
					</v-col>
					<v-col
						cols="12"
						md="8"
						class="pt-3"
					>
						<v-text-field
							v-model="orderID"
							placeholder="No Invoice"
							outlined
							dense
							label="No Invoice"
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
							color="light-blue darken-3"
							class="white--text text--darken-2"
							small
							dense
							depressed
							@click="hitManual()"
						>
							Hit Manual
						</v-btn>
					</v-col>
				</v-row>
			</v-card-actions>
		</v-card>

		<v-divider class="mt-3 mb-2" />
		<v-card class="mt-2 mb-2 pa-1" outlined elevation="0">
			<h4>GET DATA HARIAN</h4>
			<v-card-text>
				<v-row no-gutters>
					<v-col
						cols="12"
						md="4"
						class="pt-2 d-flex align-center"
					>
						Start Date
					</v-col>
					<v-col
						cols="12"
						md="8"
						class="pt-3"
					>
						<v-menu
							v-model="menu1"
							:close-on-content-click="false"
							:nudge-right="40"
							transition="scale-transition"
							offset-y
							min-width="290px"
							outlined
						>
							<template #activator="{ on, attrs }">
								<v-text-field
									v-model="input.StartDate"
									:value="input.StartDate"
									placeholder="Start Date"
									v-bind="attrs"
									v-on="on"
									outlined
									dense
									label="Start Date"
									color="light-blue darken-3"
									hide-details
									clearable
								/>
							</template>
							<v-date-picker v-model="input.StartDate" :max="GetEndDate" @input="menu1 = false" />
						</v-menu>
					</v-col>
				</v-row>
				<v-row no-gutters>
					<v-col
						cols="12"
						md="4"
						class="pt-2 d-flex align-center"
					>
						End Date
					</v-col>
					<v-col
						cols="12"
						md="8"
						class="pt-3"
					>
						<v-menu
							v-model="menu2"
							:close-on-content-click="false"
							:nudge-right="40"
							transition="scale-transition"
							offset-y
							min-width="290px"
							outlined
						>
							<template #activator="{ on, attrs }">
								<v-text-field
									v-model="input.EndDate"
									:value="input.EndDate"
									placeholder="End Date"
									v-bind="attrs"
									v-on="on"
									outlined
									dense
									label="End Date"
									color="light-blue darken-3"
									hide-details
									clearable
								/>
							</template>
							<v-date-picker v-model="input.EndDate" :min="GetMinDate" :max="GetEndDate" @input="menu2 = false" />
						</v-menu>
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
							color="light-blue darken-3"
							class="white--text text--darken-2"
							small
							dense
							depressed
							:loading="loadingButtonDataHarian"
							@click="getData()"
						>
							Get Data
						</v-btn>
					</v-col>
				</v-row>
			</v-card-actions>

			<div class="px-1">
				<v-icon style="cursor: pointer;" large @click="exportexcel()">fas fa-file-excel</v-icon>
				<v-data-table
					loading-text="Sedang memuat... Harap tunggu"
					no-data-text="Tidak ada data yang tersedia"
					no-results-text="Tidak ada catatan yang cocok ditemukan"
					:options.sync="query"
					:headers="headersDataHarian"
					:loading="isLoadingDataHarian"
					:items="DataHarian"
					item-key="idKategori"
					hide-default-footer
					class="elevation-1"
					:page.sync="page"
					:items-per-page="itemsPerPage"
					@page-count="pageCount = $event"
				>
					<template #[`item.number`]="{ item }">
						{{ DataHarian.indexOf(item) + 1 }}
					</template>
					<template #[`item.createdAt`]="{ item }">
						<span v-html="convertDateTime(item.createdAt)" /> 
					</template>
					<template #[`item.product`]="{ item }">
						<v-tooltip bottom>
							<template v-slot:activator="{ on, attrs }">
                <v-icon small v-bind="attrs" v-on="on">info</v-icon>
              </template>
							<div v-for="(data, i) in item.productDetails" :key="i">
								<span v-html="data.name" /> (<span v-html="data.quantity" />)<br>
							</div>
            </v-tooltip>
          </template>
					<template #[`item.user`]="{ item }">
						<v-tooltip bottom>
							<template v-slot:activator="{ on, attrs }">
                <v-icon small v-bind="attrs" v-on="on">info</v-icon>
              </template>
							<div>
								Data User<br>
								fullname / devicenumber : <span v-html="item.dataUser.fullname" /> / <span v-html="item.dataUser.devicenumber" /><br>
								Member / Non Member : <span v-html="item.dataUser.consumerType" /><br>
								Customer Ref Code : <span v-html="item.dataUser.customerRegRefcode" /><br><br>
								Data Member<br>
								fullname / devicenumber : <span v-html="item.dataUser.consumerType != 'MEMBER' ? item.dataMember.fullname : item.dataUser.fullname" /> / <span v-html="item.dataUser.consumerType != 'MEMBER' ? item.dataMember.devicenumber : item.dataUser.devicenumber" /><br>
							</div>
            </v-tooltip>
          </template>
				</v-data-table>
			</div>
			<v-row>
				<v-col cols="12" class="mt-2 pa-2 px-5">
					<v-pagination
						v-if="DataHarian.length > 0"
						v-model="page"
						:length="pageCount"
						:total-visible="25"
					/>
				</v-col>
			</v-row>
		</v-card>

		<v-divider class="mt-3 mb-2" />
		<v-card class="mt-2 mb-2 pa-1" outlined elevation="0">
			<h4>GET DATA NON COD (Masih Proses)</h4>
			<v-card-text>
				<v-row no-gutters>
					<v-col
						cols="12"
						md="4"
						class="pt-2 d-flex align-center"
					>
						Invoice
					</v-col>
					<v-col
						cols="12"
						md="8"
						class="pt-3"
					>
					<v-textarea
						v-model="invoice"
						placeholder="Invoice"
						outlined
						dense
						rows="4"
						label="Invoice"
						color="light-blue darken-3"
						hide-details
						clearable
						no-resize
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
							color="light-blue darken-3"
							class="white--text text--darken-2"
							small
							dense
							depressed
							:loading="loadingButtonDataNonCod"
							@click="getData2()"
						>
							Get Data
						</v-btn>
					</v-col>
				</v-row>
			</v-card-actions>

			<div class="px-1">
				<v-data-table
					loading-text="Sedang memuat... Harap tunggu"
					no-data-text="Tidak ada data yang tersedia"
					no-results-text="Tidak ada catatan yang cocok ditemukan"
					:options.sync="query"
					:headers="headersDataNonCod"
					:loading="isLoadingDataNonCod"
					:items="DataNonCod"
					item-key="idKategori"
					hide-default-footer
					class="elevation-1"
					:page.sync="page"
					:items-per-page="itemsPerPage"
					@page-count="pageCount = $event"
				>
					<template #[`item.number`]="{ item }">
						{{ DataNonCod.indexOf(item) + 1 }}
					</template>
					<template #[`item.orderNumber`]="{ item }">
					<input type="hidden" id="testing-code" :value="item.orderNumber">
					 <span ref="myinput" v-html="item.orderNumber" /> <v-icon @click.stop.prevent="copy(item.orderNumber)" small>copy_all</v-icon>
					</template>
					<template #[`item.tracking`]="{ item }">
						<v-btn
							color="light-blue darken-3"
							class="white--text text--darken-2"
							:value="item.idOrder"
							small
							dense
							depressed
						>
							Tracking Order
						</v-btn>
					</template>
					<template #[`item.status_akhir`]="{ item }">
						<!-- {{ tracking.filter(val => val.idOrder == item.idOrder)[0].status_code }} -->
						<span v-if="tracking.filter(val => val.idOrder == item.idOrder)[0].status_code == '200' || tracking.filter(val => val.idOrder == item.idOrder)[0].status_code == 200">{{ tracking.filter(val => val.idOrder == item.idOrder)[0].status }}</span>
						<span v-else>Sedang Diproses</span>
					</template>
					<template #[`item.proses`]="{ item }">
						<v-btn
							v-if="tracking.filter(val => val.idOrder == item.idOrder)[0].status_code == '200' || tracking.filter(val => val.idOrder == item.idOrder)[0].status_code == 200"
							color="light-blue darken-3"
							class="white--text text--darken-2"
							:value="item.idOrder"
							small
							dense
							depressed
							@click="hitUpdate(item)"
						>
							hit!
						</v-btn>
					</template>
				</v-data-table>
			</div>
			<v-row>
				<v-col cols="12" class="mt-2 pa-2 px-5">
					<v-pagination
						v-if="DataNonCod.length > 0"
						v-model="page"
						:length="pageCount"
						:total-visible="25"
					/>
				</v-col>
			</v-row>
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
	</div>
</template>

<script>
import { mapActions } from "vuex";
import PopUpNotifikasiVue from "../views/Layout/PopUpNotifikasi.vue";
import io from 'socket.io-client'
export default {
	name: 'Testing',
  components: {
    PopUpNotifikasiVue
  },
	data: () => ({
		siteLogin: '',
		API_URL: '',
		userData: [],
		orderID: '',
		input: {
			StartDate: '',
			EndDate: ''
		},
		tracking: [{
			idOrder: '',
			status_code: '',
			status: ''
		}],
		invoice: '',
		menu1: false,
		menu2: false,
		nowDate: new Date().toISOString().slice(0,10),
		Hariini: new Date(),
		DataHarian: [],
		DataNonCod: [],
    loadingButtonDataHarian: false,
    loadingButtonDataNonCod: false,
    isLoadingDataHarian: false,
    isLoadingDataNonCod: false,
		page: 1,
    pageCount: 0,
    itemsPerPage: 25,
		query: {
      limit: 10,
      sort: ["-created_at"],
      page: 1,
      filter: "",
    },
		headersDataHarian: [
      { text: "No.", value: "number", sortable: false, width: "7%" },
      { text: "Invoice", value: "orderNumber", sortable: false },
      { text: "Tanggal Order", value: "createdAt", sortable: false },
      { text: "No.Resi", value: "shippingReceiptNumber", sortable: false },
      { text: "Kurir", value: "carrierName", sortable: false },
      { text: "Product", value: "product", sortable: false },
      { text: "Data User", value: "user", sortable: false },
      { text: "Order Type", value: "shippingType", sortable: false },
      { text: "Order Status", value: "orderStatusLatest", sortable: false },
    ],
		headersDataNonCod: [
      { text: "No.", value: "number", sortable: false, width: "7%" },
      { text: "Invoice", value: "orderNumber", sortable: false },
      { text: "No.Resi", value: "awb", sortable: false },
      { text: "Kurir", value: "ekspedisi", sortable: false },
      { text: "Tracking", value: "tracking", sortable: false },
      { text: "Status Akhir", value: "status_akhir", sortable: false },
      { text: "Proses", value: "proses", sortable: false },
    ],
    rowsPerPageItems: { "items-per-page-options": [5, 10, 25, 50] },
    totalItems: 0,

		//notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
	}),
	computed: {
    GetMinDate() {
      var awal = this.input.StartDate
      return awal
    },
    GetEndDate() {
      var endDate = new Date(this.Hariini.getFullYear(), this.Hariini.getMonth() + 1, null);
      return endDate.toISOString().slice(0,null)
    },
  },
	created() {
		this.API_URL = process.env.VUE_APP_NODE_ENV === "production" ? process.env.VUE_APP_VIEW_PROD_API_URL : process.env.VUE_APP_VIEW_DEV_API_URL
		const socket = io(this.API_URL);
		socket.on("clear", (data) => {
			this.userData = data
		});
	},
	mounted() {
		this.API_URL = process.env.VUE_APP_NODE_ENV === "production" ? process.env.VUE_APP_VIEW_PROD_API_URL : process.env.VUE_APP_VIEW_DEV_API_URL
		this.siteLogin = localStorage.getItem('siteLogin');
	},
	methods: {
		...mapActions(["fetchData"]),
		tombolJoin() {
			const socket = io(this.API_URL);
			socket.emit("join-testing", { 
        room: 'testing_room', 
        nama: localStorage.getItem('nama'), 
      });
			socket.on("UsersData", (data) => {
        this.userData = data
			});
		},
		Clear() {
			const socket = io(this.API_URL);
			socket.emit("clear", { room: 'testing_room' });
			socket.on("clear", (data) => {
        this.userData = data
			});
		},
		hitManual() {
			let bodyData = {
        orderID: this.orderID
      }
      let payload = {
				method: "post",
				url: `kmart/hitManualKMart`,
        body: bodyData,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
		},
		getData() {
			this.DataHarian = []
			this.loadingButtonDataHarian = true
			this.isLoadingDataHarian = true
      let payload = {
				method: "get",
				url: `kmart/getdataHarian?startdate=${this.input.StartDate}&enddate=${this.input.EndDate}`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				this.loadingButtonDataHarian = false
				this.isLoadingDataHarian = false
				let resdata = res.data.result
				this.DataHarian = resdata.data
				// this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
				this.DataHarian = []
				this.loadingButtonDataHarian = false
				this.isLoadingDataHarian = false
				this.notifikasi("error", err.response.data.message, "1")
			});
		},
		exportexcel() {
			let link = process.env.VUE_APP_NODE_ENV === "production" ? process.env.VUE_APP_PROD_API_URL : process.env.VUE_APP_DEV_API_URL
			fetch(`${link}kmart/exportExcel?startdate=${this.input.StartDate}&enddate=${this.input.EndDate}`, {
				method: 'GET',
				dataType: "xml",
			})
			.then(response => response.arrayBuffer())
			.then(async response => {
				// console.log(response)
				let blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
				this.downloadBlob(blob,`DataOrder_${this.convertDateToPicker2(new Date())}.xlsx`)
				this.notifikasi("success", 'Sukses Export Excel', "1")
			})
		},
		getData2() {
			this.DataNonCod = []
			this.loadingButtonDataNonCod = true
			this.isLoadingDataNonCod = true
      let payload = {
				method: "get",
				url: `kmart/getdataNonCod?inv=${this.invoice}`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				this.loadingButtonDataNonCod = false
				this.isLoadingDataNonCod = false
				this.DataNonCod = res.data.result
				let status_code = null
				let status = null
				this.tracking = []
				this.DataNonCod.map(val => {
					val.history.map(value => {
						if(value.status_code === '200' || value.status_code === 200) {
							status_code = value.status_code
							status = value.status
						}else{
							status_code = ''
							status = ''
						}
					})
					let emit = {
						idOrder: val.idOrder,
						status_code: status_code,
						status: status
					}
					this.tracking.push(emit)
				})
				// this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
				this.DataNonCod = []
				this.loadingButtonDataNonCod = false
				this.isLoadingDataNonCod = false
				this.notifikasi("error", err.response.data.message, "1")
			});
		},
		hitUpdate(item) {
			console.log(item);
			let payload = {
				method: "get",
				url: `kmart/hitUpdateStatus?idOrder=${item.idOrder}`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
		},
		copy(orderNumber) {
      let testingCodeToCopy = document.querySelector('#testing-code')
			let code = document.getElementById('testing-code').value = orderNumber
			testingCodeToCopy.setAttribute('type', 'text') 
			testingCodeToCopy.select()

			try {
				var successful = document.execCommand('copy');
				var msg = successful ? 'berhasil' : 'gagal';
				alert('Order Number '+ code + ' ' + msg +' disalin');
			} catch (err) {
				alert('Oops, tidak bisa disalin');
			}
			
			/* unselect the range */
			testingCodeToCopy.setAttribute('type', 'hidden')
			window.getSelection().removeAllRanges()
    },
		downloadBlob(blob, name = '') {
			const blobUrl = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = blobUrl;
			link.download = name;
			document.body.appendChild(link);
			link.dispatchEvent(
				new MouseEvent('click', { 
					bubbles: true, 
					cancelable: true, 
					view: window 
				})
			);
			document.body.removeChild(link);
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
.v-input .v-label {
  font-size: 11pt !important;
}
.v-text-field.v-input--dense {
  font-size: 13px !important;
}
</style>