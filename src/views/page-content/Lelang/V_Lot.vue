<template>
  <div>
		<v-card :class="roleID == 5 && 'mt-2 mb-2 pa-1'" :outlined="roleID == 5" elevation="0">
			<h1 class="subheading grey--text">Panel Lot</h1>
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
					:items="DataLot"
					:single-expand="singleExpand"
					:expanded.sync="expanded"
					show-expand
					item-key="idLot"
					hide-default-footer
					class="elevation-1"
					:page.sync="page"
					:items-per-page="itemsPerPage"
					@page-count="pageCount = $event"
				>
					<template #[`item.number`]="{ item }">
						{{ DataLot.indexOf(item) + 1 }}
					</template>
					<template #[`item.event`]="{ item }"> 
						<strong><span v-html="item.Event.namaEvent" /></strong>
						<v-tooltip top>
							<template v-slot:activator="{ on, attrs }">
								<v-icon small v-bind="attrs" v-on="on">info</v-icon>
							</template>
							Kode Event : <span v-html="item.Event.kodeEvent" /> <br>
							Nama Event : <strong><span v-html="item.Event.namaEvent" /></strong> <br>
							Tanggal Event : (<span v-html="item.Event.startEvent" />)
						</v-tooltip>
						<v-tooltip v-if="item.Event.statusAktif == false" bottom>
							<template v-slot:activator="{ on, attrs }">
								<strong>(<span v-bind="attrs" v-on="on">Non Active</span>)</strong>
							</template>
							<span>Harus Diubah Event tidak aktif</span>
						</v-tooltip>
					</template>
					<template #[`item.barang_lelang`]="{ item }">
						Kategori : <strong><span v-html="item.BarangLelang.KategoriLelang.namaKategori" /></strong> <br>
						Nama Barang Lelang : <strong><span v-html="item.BarangLelang.namaBarangLelang" /></strong> <br>
						<v-tooltip v-if="item.BarangLelang.KategoriLelang.statusKategoriLelang == false || item.BarangLelang.statusAktif == false" bottom>
							<template v-slot:activator="{ on, attrs }">
								<strong>(<span v-bind="attrs" v-on="on">Non Active</span>)</strong>
							</template>
							<span>Harus Diubah Kategori atau Barang Lelang tidak aktif</span>
						</v-tooltip>
					</template>
					<template #[`item.harga_awal`]="{ item }">
						Rp.<span v-html="currencyDotFormat(item.hargaAwal)" />
					</template>
					<template #[`item.status_lot`]="{ item }">
						<span v-html="item.statusLot == 1 ? 'Tidak Aktif' : item.statusLot == 2 ? 'Aktif' : item.statusLot == 3 ? 'Lelang' : 'Terjual'" /> 
					</template>
					<template #[`item.statusAktif`]="{ item }">
						<v-icon small v-if="item.statusAktif == true" color="green">check</v-icon>
						<v-icon small v-else-if="item.statusAktif == false" color="red">clear</v-icon>
						<br>
						<span v-html="item.statusAktif == true ? 'Active' : 'Non Active'" /> 
					</template>
					<template #expanded-item="{ headers, item }">
						<td :colspan="headers.length" class="white">
							<v-btn
								:value="item.idLot"
								color="#0bd369"
								small
								dense
								depressed
								class="ma-2 white--text text--darken-2"
								:disabled="item.statusAktif == false"
								@click="bukaDialog(item, 1)"
							>
							<v-icon small>edit</v-icon>	Ubah
							</v-btn> 
							<v-btn
								v-if="item.statusAktif == false"
								:value="item.idLot"
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
								v-else-if="item.statusAktif == true"
								:value="item.idLot"
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
								:value="item.idLot"
								color="#bd3a07"
								small
								dense
								depressed
								class="ma-2 white--text text--darken-2"
								:disabled="item.statusAktif == false"
								@click="HapusRecord(item)"
							>
							<v-icon small>delete</v-icon>	Hapus
							</v-btn> 
							<v-btn
								:value="item.idLot"
								color="#04f7f7"
								small
								dense
								depressed
								class="ma-2 white--text text--darken-2"
								@click="bukaDialog(item, 2)"
							>
								<v-icon small>info</v-icon>	Detail
							</v-btn> 
							<v-divider />
						</td>
					</template>
				</v-data-table>
			</div>
			<v-row>
				<v-col cols="12" class="mt-2 pa-2 px-5">
					<v-pagination
						v-if="DataLot.length > 0"
						v-model="page"
						:length="pageCount"
						:total-visible="5"
					/>
				</v-col>
			</v-row>
		</v-card>
		<v-dialog
      v-model="DialogLot"
      max-width="800px"
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="light-blue darken-3"
        >
          <v-toolbar-title>{{editedIndex == 0 ? 'Tambah' : editedIndex == 1 ? 'Ubah' : 'View'}} Data Lot</v-toolbar-title>
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
					<div class="scrollText">
            <div class="px-5">
              <v-divider />
            </div>
						<v-card-text>
							<v-row no-gutters>
                <v-col
                  cols="12"
                  md="4"
                  class="pt-2 d-flex align-center"
                >
                  Barang Lelang
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-autocomplete
                    v-model="inputLot.id_barang_lelang"
                    :items="DataBarangLelang"
                    item-text="namaBarangLelang"
                    item-value="idBarangLelang"
                    placeholder="Barang Lelang"
                    label="Barang Lelang"
                    outlined
                    dense
                    hide-details
                    :clearable="editedIndex != 2"
                    :readonly="editedIndex == 2"
                  >
										<template v-slot:selection="{ item }">
											{{item.namaBarangLelang}} ({{item.namaKategori}})
										</template>
										<template v-slot:item="{ item }">
											{{item.namaBarangLelang}} ({{item.namaKategori}})
										</template>
									</v-autocomplete>
                  <span v-html="editedIndex != 0 && inputLot.id_barang_lelang == '' ? 'Barang Lelang yang dipilih tidak aktif' : ''" class="red--text"></span>
                </v-col>
              </v-row>
							<v-row no-gutters>
                <v-col
                  cols="12"
                  md="4"
                  class="pt-2 d-flex align-center"
                >
                  Event
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-autocomplete
                    v-model="inputLot.id_event"
                    :items="DataEvent"
                    item-text="namaEvent"
                    item-value="idEvent"
                    placeholder="Event"
                    label="Event"
                    outlined
                    dense
                    hide-details
                    :clearable="editedIndex != 2"
                    :readonly="editedIndex == 2"
                  >
										<template v-slot:selection="{ item }">
											{{item.kodeEvent}} - {{item.namaEvent}} ({{item.startEvent}})
										</template>
										<template v-slot:item="{ item }">
											{{item.kodeEvent}} - {{item.namaEvent}} ({{item.startEvent}})
										</template>
									</v-autocomplete>
                  <span v-html="editedIndex != 0 && inputLot.id_event == '' ? 'Event yang dipilih tidak aktif' : ''" class="red--text"></span>
                </v-col>
              </v-row>
							<v-row no-gutters>
								<v-col
									cols="12"
									md="4"
									class="pt-2 d-flex align-center"
								>
									No. Lot
								</v-col>
								<v-col
									cols="12"
									md="8"
									class="pt-3"
								>
									<v-text-field
										v-model="inputLot.no_lot"
										placeholder="No. Lot"
										outlined
										dense
										label="No. Lot"
										color="light-blue darken-3"
										hide-details
										@keypress.native="onlyNumber($event, null, inputLot.no_lot)"
										:clearable="editedIndex != 2"
                    :readonly="editedIndex == 2"
									/>
								</v-col>
							</v-row>
							<v-row no-gutters>
								<v-col
									cols="12"
									md="4"
									class="pt-2 d-flex align-center"
								>
									Harga Awal
								</v-col>
								<v-col
									cols="12"
									md="8"
									class="pt-3"
								>
									<vuetify-money
										v-model="inputLot.harga_awal"
										placeholder="Harga Awal"
										outlined
										dense
										label="Harga Awal"
										color="light-blue darken-3"
										hide-details
										:clearable="editedIndex != 2"
                    :readonly="editedIndex == 2"
										:options="optionsUang"
									/>
								</v-col>
							</v-row>
							<v-row no-gutters>
                <v-col
                  cols="12"
                  md="4"
                  class="pt-2 d-flex align-center"
                >
                  Status Lot
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-autocomplete
                    v-model="inputLot.status_lot"
                    :items="statusLotOptions"
                    item-text="text"
                    item-value="value"
                    placeholder="Status Lot"
                    label="Status Lot"
                    outlined
                    dense
                    hide-details
                    :clearable="editedIndex != 2"
                    :readonly="editedIndex == 2"
                  />
                </v-col>
              </v-row>
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
	</div>
</template>

<script>
import { mapActions } from "vuex";
import PopUpNotifikasiVue from "../../Layout/PopUpNotifikasi.vue";

export default {
  name: 'LotLelang',
	components: { PopUpNotifikasiVue },
	data: () => ({
		isLoading: false,
		btnProses: false,
		roleID: '',
		DataLot: [],
		page: 1,
    pageCount: 0,
    itemsPerPage: 5,
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
      { text: "Event", value: "event", sortable: false },
      { text: "Barang Lelang", value: "barang_lelang", sortable: false },
      { text: "No. Lot", value: "noLot", sortable: false },
      { text: "harga Awal", value: "harga_awal", sortable: false },
      { text: "Status Lot", value: "status_lot", sortable: false },
      { text: "Status", value: "statusAktif", sortable: false },
    ],
    rowsPerPageItems: { "items-per-page-options": [5, 10, 25, 50] },
    totalItems: 0,
		DataBarangLelang: [],
		DataEvent: [],
		DialogLot: false,
		editedIndex: 3,
    kondisiTombol: true,
		statusLotOptions: [
			{text: 'Tidak Aktif', value: 1},
			{text: 'Aktif', value: 2},
			{text: 'Lelang', value: 3},
			{text: 'terjual', value: 4},
		],
		optionsUang: {
			locale: "pt-BR",
			prefix: "Rp.",
			suffix: "",
			length: 15,
			precision: 0
		},
		inputLot: {
			id_lot: '',
			id_barang_lelang: '',
			id_event: '',
			no_lot: '',
			harga_awal: '',
			status_lot: '',
		},

		//notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
	}),
	metaInfo: {
		title: "Lelang (Lot) - WIN.ID",
		htmlAttrs: {
			lang: "id",
			amp: true,
		},
	},
	watch:{
		inputLot: {
			deep: true,
			handler(value){
				if(value.id_barang_lelang == null){ this.inputLot.id_barang_lelang = '' }
				if(value.id_event == null){ this.inputLot.id_event = '' }
				if(value.no_lot == null){ this.inputLot.no_lot = '' }
				if(value.harga_awal == null){ this.inputLot.harga_awal = '' }
				if(value.status_lot == null){ this.inputLot.status_lot = '' }
				
				if(value.id_barang_lelang != '' && value.id_event != '' && value.no_lot != '' && value.harga_awal != '' && value.status_lot != ''){
					this.kondisiTombol = false
				}else{
					this.kondisiTombol = true	
				}
			}
		}
	},
	mounted() {
		this.roleID = localStorage.getItem("roleID")
		this.getLot()
	},
	methods: {
		...mapActions(["fetchData"]),
		getLot() {
			this.isLoading = true
			let payload = {
				method: "get",
				url: `lelang/getLot`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				this.DataLot = res.data.result;
				this.isLoading = false
			})
			.catch((err) => {
				this.isLoading = false
				this.notifikasi("error", err.response.data.message, "1")
			});
		},
		getBarangLelang() {
			this.DataBarangLelang = []
			let payload = {
				method: "get",
				url: `lelang/getBarangLelang?status_aktif=1`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				let data = res.data.result;
				let lot = []
				this.DataLot.map((el) => {
					lot.push(el.idBarangLelang)
				})
				// console.log(lot)
				if(lot.length){
					data.map((el) => {
						let result = lot.includes(el.idBarangLelang)
						if(!result) return this.DataBarangLelang.push(el);
						// if(result && lot.length){
						// 	console.log(el)
						// }
					})
				}else{
					return this.DataBarangLelang = data;
				}

			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
		},
		getEvent() {
			let payload = {
				method: "get",
				url: `lelang/getEvent?status_aktif=1`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				this.DataEvent = res.data.result;
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
		},
		bukaDialog(item, index){
			this.editedIndex = index
			this.getBarangLelang()
			this.getEvent()
			if(index == 0){
				this.clearForm()
      }else{
				this.inputLot.id_lot = item.idLot ? item.idLot : ''
				this.inputLot.id_barang_lelang = item.BarangLelang.KategoriLelang.statusKategoriLelang == false || item.BarangLelang.statusAktif == false ? '' : item.BarangLelang.idBarangLelang ? item.BarangLelang.idBarangLelang : ''
				this.inputLot.id_event = item.Event.statusAktif == true ? item.Event.idEvent ? item.Event.idEvent : '' : ''
				this.inputLot.no_lot = item.noLot ? item.noLot : ''
				this.inputLot.harga_awal = item.hargaAwal ? item.hargaAwal : ''
				this.inputLot.status_lot = item.statusLot ? item.statusLot : ''
			}
			this.DialogLot = true
		},
		tutupDialog() {
      this.clearForm()
			this.editedIndex = 3
      this.DialogLot = false
    },
		SimpanForm(index) {
			this.btnProses = true
      let bodyData = {
        jenis: index == 0 ? 'ADD' : 'EDIT',
        id_lot: index == 0 ? '' : this.inputLot.id_lot,
				id_barang_lelang: this.inputLot.id_barang_lelang,
				id_event: this.inputLot.id_event,
				no_lot: this.inputLot.no_lot,
				harga_awal: this.inputLot.harga_awal,
				status_lot: this.inputLot.status_lot,
        create_update_by: localStorage.getItem('idLogin'),
      }
      let payload = {
				method: "post",
				url: `lelang/postLot`,
        body: bodyData,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then(async (res) => {
				this.notifikasi("success", res.data.message, "1")
				this.clearForm()
        this.DialogLot = false
        this.btnProses = false
        this.getLot()
				this.getBarangLelang()
			})
			.catch((err) => {
				this.btnProses = false
				this.notifikasi("error", err.response.data.message, "1")
			});
    },
    HapusRecord(item) {
      let bodyData = {
        jenis: 'DELETE',
        id_lot: item.idLot,
        delete_by: localStorage.getItem('idLogin'),
      }
      let payload = {
				method: "post",
				url: `lelang/postLot`,
        body: bodyData,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
        this.DialogLot = false
        this.getLot()
				this.getBarangLelang()
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
    },
    StatusRecord(item, status_aktif) {
      let bodyData = {
        jenis: 'STATUSRECORD',
        id_lot: item.idLot,
        status_aktif: status_aktif,
      }
      let payload = {
				method: "post",
				url: `lelang/postLot`,
        body: bodyData,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
        this.DialogLot = false
        this.getLot()
				this.getBarangLelang()
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
    },
		clearForm() {
			this.inputLot.id_lot = ''
			this.inputLot.id_barang_lelang = ''
			this.inputLot.id_event = ''
			this.inputLot.no_lot = ''
			this.inputLot.harga_awal = ''
			this.inputLot.status_lot = ''
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
img {
	border-style: solid !important;
	border-radius: 10px !important;
	padding: 2px !important;
}
.tombol-tutup{
  height: 30px !important;
  min-width: 90px !important;
  border-bottom-style: revert !important;
}
.v-list-item--dense, .v-list--dense .v-list-item {
	font-size: 0.8125rem !important;
	font-weight: 500 !important;
	line-height: 1rem !important;
}
</style>