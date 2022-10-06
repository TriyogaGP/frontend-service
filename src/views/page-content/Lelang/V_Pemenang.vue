<template>
  <div>
		<v-card :class="roleID == 5 && 'mt-2 mb-2 pa-1'" :outlined="roleID == 5" elevation="0">
			<h1 class="subheading grey--text">Panel Pemenang Lelang</h1>
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
					:items="DataAllPemenang"
					:single-expand="singleExpand"
					:expanded.sync="expanded"
					show-expand
					item-key="idPemenangLelang"
					hide-default-footer
					class="elevation-1"
					:page.sync="page"
					:items-per-page="itemsPerPage"
					@page-count="pageCount = $event"
				>
					<template #[`item.number`]="{ item }">
						{{ DataAllPemenang.indexOf(item) + 1 }}
					</template>
					<template #[`item.nama_pemenang`]="{ item }">
						<span v-html="item.details.nama" /> 
					</template>
					<template #[`item.nominal`]="{ item }">
						Rp.<span v-html="currencyDotFormat(item.nominal)" /> 
					</template>
					<template #[`item.tipe_pelunasan`]="{ item }">
						<span v-html="item.tipePelunasan == null ? '-' : item.tipePelunasan == 1 ? 'Cash' : 'Transfer'" /> 
					</template>
					<template #[`item.status_pembayaran`]="{ item }">
						<v-icon small v-if="item.statusPembayaran == 2" color="green">check</v-icon>
						<v-icon small v-else-if="item.statusPembayaran == 1" color="red">clear</v-icon>
						<br>
						<span v-html="item.statusPembayaran == 2 ? 'Sudah Bayar' : 'Belum Bayar'" /> 
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
								:value="item.idPemenangLelang"
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
								:value="item.idPemenangLelang"
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
								:value="item.idPemenangLelang"
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
								:value="item.idPemenangLelang"
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
								:value="item.idPemenangLelang"
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
						v-if="DataAllPemenang.length > 0"
						v-model="page"
						:length="pageCount"
						:total-visible="10"
					/>
				</v-col>
			</v-row>
		</v-card>
		<v-dialog
      v-model="DialogPemenang"
      max-width="800px"
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="light-blue darken-3"
        >
          <v-toolbar-title>{{editedIndex == 0 ? 'Tambah' : 'Ubah'}} Data Pemenang</v-toolbar-title>
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
									No Rekening
								</v-col>
								<v-col
									cols="12"
									md="8"
									class="pt-3"
								>
									<v-text-field
										v-model="inputPemenang.no_rek"
										placeholder="No Rekening"
										outlined
										dense
										label="No Rekening"
										color="light-blue darken-3"
										hide-details
										@keypress.native="onlyNumber($event, null, inputPemenang.no_rek)"
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
									Nama Pemilik
								</v-col>
								<v-col
									cols="12"
									md="8"
									class="pt-3"
								>
									<v-text-field
										v-model="inputPemenang.nama_pemilik"
										placeholder="Nama Pemilik"
										outlined
										dense
										label="Nama Pemilik"
										color="light-blue darken-3"
										hide-details
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
									Nominal
								</v-col>
								<v-col
									cols="12"
									md="8"
									class="pt-3"
								>
									<vuetify-money
										v-model="inputPemenang.nominal"
										placeholder="Nominal"
										outlined
										dense
										label="Nominal"
										color="light-blue darken-3"
										hide-details
										readonly
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
									Tanggal Transfer
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
												v-model="inputPemenang.tanggal"
												:value="inputPemenang.tanggal"
												placeholder="Tanggal Transfer"
												v-bind="attrs"
												v-on="on"
												outlined
												dense
												label="Tanggal Transfer"
												color="light-blue darken-3"
												hide-details
												:clearable="editedIndex != 2"
												:readonly="editedIndex == 2"
											/>
										</template>
										<v-date-picker v-model="inputPemenang.tanggal" @input="menu1 = false" />
									</v-menu>
								</v-col>
							</v-row>
							<v-row no-gutters>
								<v-col
									cols="12"
									md="4"
									class="pt-2 d-flex align-center"
								>
									Waktu Transfer
								</v-col>
								<v-col
									cols="12"
									md="8"
									class="pt-3"
								>
									<v-menu
										ref="menu2"
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
												v-model="inputPemenang.waktu"
												:value="inputPemenang.waktu"
												placeholder="Waktu Transfer"
												v-bind="attrs"
												v-on="on"
												outlined
												dense
												label="Waktu Transfer"
												color="light-blue darken-3"
												hide-details
												:clearable="editedIndex != 2"
												:readonly="editedIndex == 2"
											/>
										</template>
										<v-time-picker v-model="inputPemenang.waktu" @click:second="$refs.menu2.save(inputPemenang.waktu)" use-seconds />
									</v-menu>
								</v-col>
							</v-row>
							<v-row no-gutters>
								<v-col
									cols="12"
									md="4"
									class="pt-2 d-flex align-center"
								>
									Tipe Pelunasan
								</v-col>
								<v-col
									cols="12"
									md="8"
									class="pt-3"
								>
									<v-autocomplete
										v-model="inputPemenang.tipe_pelunasan"
										:items="PelunasanOptions"
										item-text="text"
										item-value="value"
										placeholder="Tipe Pelunasan"
										label="Tipe Pelunasan"
										outlined
										dense
										hide-details
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
									Status Pembayaran
								</v-col>
								<v-col
									cols="12"
									md="8"
									class="pt-3"
								>
									<v-autocomplete
										v-model="inputPemenang.status_pembayaran"
										:items="PembayaranOptions"
										item-text="text"
										item-value="value"
										placeholder="Status Pembayaran"
										label="Status Pembayaran"
										outlined
										dense
										hide-details
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
                  Bukti Transfer
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-text-field
										v-model="inputPemenang.bukti"
										placeholder="Upload"
										outlined
										dense
                  	style="display: none"
									/>
									<input 
										ref="inputBUKTIFile"
										:key="componentKey"
										type="file"
										accept="image/x-png,image/jpg,image/jpeg"
										style="display: none"
										@change="uploadFile($event)"
									>
									<v-btn v-if="editedIndex != 2" depressed small color="light-blue darken-3" dark @click="$refs.inputBUKTIFile.click()">
										<v-icon small left>{{editedIndex == 0 ? 'add' : 'edit'}}</v-icon> {{editedIndex == 0 ? 'Tambah' : 'Ubah'}} Bukti
									</v-btn>
									<v-btn v-else-if="editedIndex == 2" depressed small color="light-blue darken-3" dark @click="viewLampiran()">
										<v-icon small left>pageview</v-icon> Lihat Bukti
									</v-btn>
									<br>
									<span v-if="this.inputPemenang.bukti != ''">
										<strong>nama file :</strong> <i>{{this.inputPemenang.bukti}}</i> {{editedIndex == 0 ? '('+(this.FileBUKTI.size / (1024*1024)).toFixed(2)+' MB)' : ''}}
										<v-icon small v-if="editedIndex != 2" color="red" @click="hapusFile()">delete</v-icon>
									</span>
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
									@click="SimpanForm(0, FileBUKTI)"
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
									@click="SimpanForm(1, FileBUKTI)"
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
      v-model="DialogViewLampiranPemenang"
      width="600px"
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="light-blue darken-3"
        >
          <v-toolbar-title>View Bukti Pemenang</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <v-btn
              icon
              dark
              @click="DialogViewLampiranPemenang = false"
            >
              <v-icon>close</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card tile>
          <div class="scrollTextGBR">
            <v-card-text class="d-flex flex-column justify-space-between align-center">
              <img :src="this.urlView" width="400"/>
            </v-card-text>
          </div>
        </v-card>
      </v-card>
		</v-dialog>
		<v-dialog
      v-model="DialogCropPemenang"
      width="700px"
      height="700px"
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card tile>
        <div class="scrollTextGBR">
          <v-card-text>
            <cropper
              ref="cropper"
              class="upload-example-cropper"
              :src="image.src"
            />
              <!-- :stencil-size="{
                width: 300,
                height: 300
              }"
              :stencil-props="{
                handlers: {},
                movable: false,
                resizable: false,
                aspectRatio: 1,
              }"
              image-restriction="stencil" -->
          </v-card-text>
        </div>
        <v-btn
          color="#e6e7e8"
          class="elevation-0 tombol-tutup ma-3"
          @click="tutupDialogCrop()"
        >
          Tutup
        </v-btn>
        <v-btn
          color="#e6e7e8"
          class="elevation-0 tombol-tutup ma-3"
          @click="crop"
        >
          Crop Lampiran
        </v-btn>
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
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css';

function getMimeType(file, fallback = null) {
	const byteArray = (new Uint8Array(file)).subarray(0, 4);
  let header = '';
  for (let i = 0; i < byteArray.length; i++) {
      header += byteArray[i].toString(16);
  }
	switch (header) {
    case "89504e47":
      return "image/png";
    case "47494638":
      return "image/gif";
    case "ffd8ffe0":
    case "ffd8ffe1":
    case "ffd8ffe2":
    case "ffd8ffe3":
    case "ffd8ffe8":
      return "image/jpeg";
    default:
      return fallback;
  }
}

export default {
  name: 'PemenangLelang',
	components: { PopUpNotifikasiVue, Cropper },
	data: () => ({
		isLoading: false,
		roleID: '',
		DataAllPemenang: [],
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
      { text: "Nama Pemenang", value: "nama_pemenang", sortable: false },
      { text: "Nominal", value: "nominal", sortable: false },
      { text: "Type Pelunasan", value: "tipe_pelunasan", sortable: false },
      { text: "Status Pembayaran", value: "status_pembayaran", sortable: false },
      { text: "Status", value: "statusAktif", sortable: false },
    ],
    rowsPerPageItems: { "items-per-page-options": [5, 10, 25, 50] },
    totalItems: 0,
		DialogPemenang: false,
		DialogViewLampiranPemenang: false,
		DialogCropPemenang: false,
		editedIndex: 0,
    kondisiTombol: true,
		image: {
      src: null,
      type: null,
    },
		inputPemenang: {
			id_pemenang_lelang: '',
			no_rek: '',
			nama_pemilik: '',
			nominal: '',
			tanggal_transfer: '',
			tanggal: '',
			waktu: '',
			tipe_pelunasan: '',
			status_pembayaran: '',
			bukti: '',
		},
		optionsUang: {
			locale: "pt-BR",
			prefix: "Rp.",
			suffix: "",
			length: 15,
			precision: 0
		},
		PelunasanOptions: [
			{ text: 'Cash', value: 1 },
			{ text: 'Transfer', value: 2 },
		],
		PembayaranOptions: [
			{ text: 'Belum Bayar', value: 1 },
			{ text: 'Sudah Bayar', value: 2 },
		],
		menu1: false,
		menu2: false,
		componentKey: 0,  
		FileBUKTI: '',
		urlView: '',

		//notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
	}),
	metaInfo: {
		title: "Lelang (Pemenang Lelang) - WIN.ID",
		htmlAttrs: {
			lang: "id",
			amp: true,
		},
	},
	watch:{
		inputPemenang: {
			deep: true,
			handler(value){
				if(value.no_rek == null){ this.inputPemenang.no_rek = '' }
				if(value.nama_pemilik == null){ this.inputPemenang.nama_pemilik = '' }
				if(value.tanggal == null){ this.inputPemenang.tanggal = '' }
				if(value.waktu == null){ this.inputPemenang.waktu = '' }
				if(value.tipe_pelunasan == null){ this.inputPemenang.tipe_pelunasan = '' }
				if(value.status_pembayaran == null){ this.inputPemenang.status_pembayaran = '' }

				this.inputPemenang.tanggal_transfer = `${value.tanggal} ${value.waktu}`

				if(value.no_rek != '' && value.nama_pemilik != '' && value.tanggal != '' && value.waktu != '' && value.tipe_pelunasan != '' && value.status_pembayaran != '' && 
				value.bukti != ''){
					this.kondisiTombol = false
				}else{
					this.kondisiTombol = true	
				}
			}
		}
	},
	mounted() {
		this.roleID = localStorage.getItem("roleID")
		this.getAllPemenang()
	},
	methods: {
		...mapActions({
      fetchData: "fetchData",
      uploadFiles: "upload/uploadFiles",
    }),
		getAllPemenang() {
			this.isLoading = true
			let payload = {
				method: "get",
				url: `lelang/getPemenang`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				this.DataAllPemenang = res.data.result;
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
				if(item.tanggalTransfer){
					let kumpultanggal = item.tanggalTransfer.split(' ')
					this.inputPemenang.tanggal = kumpultanggal[0]
					this.inputPemenang.waktu = kumpultanggal[1]
					this.inputPemenang.tanggal_transfer = `${kumpultanggal[0]} ${kumpultanggal[1]}`
				}else{
					this.inputPemenang.tanggal = ''
					this.inputPemenang.waktu = ''
					this.inputPemenang.tanggal_transfer = ''
				}
				this.inputPemenang.id_pemenang_lelang = item.idPemenangLelang ? item.idPemenangLelang : ''
        this.inputPemenang.no_rek = item.noRek ? item.noRek : ''
        this.inputPemenang.nama_pemilik = item.namaPemilik ? item.namaPemilik : ''
        this.inputPemenang.nominal = item.nominal ? item.nominal : ''
        this.inputPemenang.bukti = item.bukti
        this.inputPemenang.tipe_pelunasan = item.tipePelunasan
        this.inputPemenang.status_pembayaran = item.statusPembayaran
			}
			this.DialogPemenang = true
		},
		tutupDialog() {
      this.clearForm()
      this.DialogPemenang = false
    },
		SimpanForm(index, dataUpload) {
      let bodyData = {
        jenis: index == 0 ? 'ADD' : 'EDIT',
        id_pemenang_lelang: index == 0 ? '' : this.inputPemenang.id_pemenang_lelang,
        no_rek: this.inputPemenang.no_rek,
        nama_pemilik: this.inputPemenang.nama_pemilik,
        tanggal_transfer: this.inputPemenang.tanggal_transfer,
        tipe_pelunasan: this.inputPemenang.tipe_pelunasan,
        status_pembayaran: this.inputPemenang.status_pembayaran,
        bukti: this.inputPemenang.bukti,
        create_update_by: localStorage.getItem('idLogin'),
      }
      let payload = {
				method: "post",
				url: `lelang/postPemenang`,
        body: bodyData,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then(async (res) => {
				if(this.FileBUKTI){
					let uploadBUKTI = await this.uploadLampiran(index, dataUpload)
					if(uploadBUKTI.data.status == 200){
						this.notifikasi("success", res.data.message, "1")
					}else{
						this.notifikasi("error", 'Gagal proses data', "1")
					}
				}else{
					this.notifikasi("success", res.data.message, "1")
				}
        this.DialogPemenang = false
        this.getAllPemenang()
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
    },
		async uploadLampiran(index, dataUpload) {
			if(dataUpload){
				const bodyData = {
					proses: index == 0 ? 'ADD' : 'EDIT',
					id: index == 0 ? null : this.inputPemenang.id_pemenang_lelang,
					nama_folder: "bukti-pemenang",
					nama_file: `Bukti-${this.inputPemenang.nama_pemilik}-${this.convertDate(new Date().toISOString().slice(0,10))}${this.makeRandom(8)}`,
					jenis: "images",
					bagian: "bukti_pemenang",
					table: "t_pemenang_lelang",
					files: dataUpload,
				};
				try {
					let response = await this.uploadFiles(bodyData);
					return response
				} catch (err) {
					this.notifikasi("error", err.response.data.message, "1")
				}
			}
		},
    HapusRecord(item) {
      let bodyData = {
        jenis: 'DELETE',
        id_pemenang_lelang: item.idPemenangLelang,
        id_bidding: item.idBidding,
        delete_by: localStorage.getItem('idLogin'),
      }
      let payload = {
				method: "post",
				url: `lelang/postPemenang`,
        body: bodyData,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
        this.DialogPemenang = false
        this.getAllPemenang()
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
    },
    StatusRecord(item, status_aktif) {
      let bodyData = {
        jenis: 'STATUSRECORD',
        id_pemenang_lelang: item.idPemenangLelang,
        id_bidding: item.idBidding,
        status_aktif: status_aktif,
      }
      let payload = {
				method: "post",
				url: `lelang/postPemenang`,
        body: bodyData,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
        this.DialogPemenang = false
        this.getAllPemenang()
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
    },
		async uploadFile(e) {
			this.FileBUKTI = await e.target.files[0];
			this.inputPemenang.bukti = this.FileBUKTI.name;
			this.loadImage(this.FileBUKTI)
    },
		loadImage(files) {
      this.DialogCropPemenang = true
      const blob = URL.createObjectURL(files);
      const reader = new FileReader();
      reader.onload = (e) => {
        this.image = {
          src: blob,
          type: getMimeType(e.target.result, files.type),
        }
      }
      reader.readAsArrayBuffer(files);
    },
    crop() {
			const { canvas } = this.$refs.cropper.getResult();
			canvas.toBlob((blob) => {
				this.FileBUKTI = blob
			}, this.image.type);
      this.DialogCropPemenang = false
		},
		hapusFile(){
			this.FileBUKTI = ''
			this.inputPemenang.bukti = '';
			this.image = {
				src: null,
				type: null,
			}
		},
		tutupDialogCrop(){
      this.hapusFile()
      this.DialogCropPemenang = false
    },
		viewLampiran() {
			this.DialogViewLampiranPemenang = true
			const API_URL = process.env.VUE_APP_NODE_ENV === "production" ? process.env.VUE_APP_VIEW_PROD_API_URL : process.env.VUE_APP_VIEW_DEV_API_URL
			const no_image = `${API_URL}No_Image_Available.jpg`
			this.urlView = this.inputPemenang.bukti ? `${API_URL}image/bukti-pemenang/${this.inputPemenang.bukti}` : no_image
			// this.urlView = this.inputPemenang.bukti ? `${API_URL}${this.inputPemenang.bukti}` : no_image
		},
		clearForm() {
			this.inputPemenang.id_bidding = ''
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
.scrollTextGBR{
  max-height: 450px !important;
  overflow-y: auto !important;
}
</style>