<template>
  <div>
		<v-card :class="roleID == 5 && 'mt-2 mb-2 pa-1'" :outlined="roleID == 5" elevation="0">
			<h1 class="subheading grey--text">Panel Nomor Peserta Lelang</h1>
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
					:items="DataNPL"
					:single-expand="singleExpand"
					:expanded.sync="expanded"
					show-expand
					item-key="idPembelianNPL"
					hide-default-footer
					class="elevation-1"
					:page.sync="page"
					:items-per-page="itemsPerPage"
					@page-count="pageCount = $event"
				>
					<template #[`item.number`]="{ item }">
						{{ DataNPL.indexOf(item) + 1 }}
					</template>
					<template #[`item.event`]="{ item }"> 
						<strong><span v-html="item.namaEvent" /></strong>
						<v-tooltip top>
							<template v-slot:activator="{ on, attrs }">
								<v-icon small v-bind="attrs" v-on="on">info</v-icon>
							</template>
							Kode Event : <span v-html="item.kodeEvent" /> <br>
							Nama Event : <strong><span v-html="item.namaEvent" /></strong> <br>
							Tanggal Event : (<span v-html="item.tanggalEvent" />)
						</v-tooltip>
						<v-tooltip v-if="item.statusEvent == false" bottom>
							<template v-slot:activator="{ on, attrs }">
								<strong>(<span v-bind="attrs" v-on="on">Non Active</span>)</strong>
							</template>
							<span>Harus Diubah Event tidak aktif</span>
						</v-tooltip>
					</template>
					<template #[`item.peserta`]="{ item }">
						<strong><span v-html="item.nama" /></strong>
						<v-tooltip top>
							<template v-slot:activator="{ on, attrs }">
								<v-icon small v-bind="attrs" v-on="on">info</v-icon>
							</template>
							NIK : <strong><span v-html="item.nik" /></strong> <br>
							Nama : <strong><span v-html="item.nama" /></strong> <br>
							Email : <strong><span v-html="item.email" /></strong>
						</v-tooltip>
						<v-tooltip v-if="item.statusPeserta == false" bottom>
							<template v-slot:activator="{ on, attrs }">
								<strong>(<span v-bind="attrs" v-on="on">Non Active</span>)</strong>
							</template>
							<span>Harus Diubah Peserta tidak aktif</span>
						</v-tooltip>
					</template>
					<template #[`item.noNpl`]="{ item }">
						<v-row v-if="item.NPL.length" no-gutters>
							<v-col>
								<span v-for="(val, i) in item.NPL" :key="i" class="box fourcorners">
									<v-tooltip top>
										<template v-slot:activator="{ on, attrs }">
												<strong>
													<span v-if="val.statusNPL == 2 && !Object.entries(val.RefundNPL).length" style="cursor: pointer;" v-bind="attrs" v-on="on" v-html="val.noNpl" @click="bukaDialogBuktiRefund(val, item)" />
													<span v-else-if="val.statusNPL == 2 && Object.entries(val.RefundNPL).length" style="cursor: pointer;" v-bind="attrs" v-on="on" v-html="val.noNpl" @click="viewLampiran(val.RefundNPL.bukti)" />
													<span v-else style="cursor: pointer;" v-bind="attrs" v-on="on" v-html="val.noNpl" @click="() => { notifikasi('warning', 'Tidak bisa mengajukan refund karena status no npl bukan Refund Jaminan', '1') }"/>
												</strong>
										</template>
										<span>NPL : {{val.npl}}</span> <br>
										<span>Status : {{val.statusNPL == 0 ? 'Belum digunakan' : val.statusNPL == 1 ? 'Sudah digunakan' : 'Refund jaminan'}}</span>
									</v-tooltip>
								</span>
							</v-col>
						</v-row>
						<span v-else><strong>No NPL tidak tersedia</strong></span>
					</template>
					<!-- <template #[`item.status_aktif`]="{ item }">
						<v-icon v-if="item.status_aktif == 1" color="green">check</v-icon>
						<v-icon v-else-if="item.status_aktif == 0" color="red">clear</v-icon>
						<br>
						<span v-html="item.status_aktif == 1 ? 'Active' : 'Non Active'" /> 
					</template> -->
					<template #expanded-item="{ headers, item }">
						<td :colspan="headers.length" class="white">
							<v-btn
								:value="item.idPembelianNPL"
								color="#0bd369"
								small
								dense
								depressed
								class="ma-2 white--text text--darken-2"
								:disabled="!item.NPL.length"
								@click="bukaDialog(item)"
							>
							<v-icon small>edit</v-icon>	Ubah
							</v-btn>
							<v-divider />
						</td>
					</template>
				</v-data-table>
			</div>
			<v-row>
				<v-col cols="12" class="mt-2 pa-2 px-5">
					<v-pagination
						v-if="DataNPL.length > 0"
						v-model="page"
						:length="pageCount"
						:total-visible="10"
					/>
				</v-col>
			</v-row>
		</v-card>
		<v-dialog
      v-model="DialogNPL"
      max-width="800px"
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="light-blue darken-3"
        >
          <v-toolbar-title>Ubah Data Nomor Peserta Lelang</v-toolbar-title>
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
						<v-row v-for="(item, i) in NPLData" :key="i" no-gutters>
							<v-col
								cols="12"
								md="4"
								class="pt-2 d-flex align-center"
							>
								No. NPL {{i+1}} &nbsp;<strong>({{inputNPL.no_npl[i]}})</strong>
							</v-col>
							<v-col
								cols="12"
								md="8"
								class="pt-3"
							>
									<!-- v-if="inputNPL.status_npl[i] != 2" -->
								<v-autocomplete
									v-model="inputNPL.status_npl[i]"
									:items="statusNPLOptions"
									item-text="text"
									item-value="value"
									outlined
									dense
									hide-details
								/>
								<!-- <span v-else><strong>Status NPL : Refund Jaminan</strong></span> -->
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
									@click="SimpanForm()"
								>
									Ubah Status
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
      v-model="DialogBuktiRefund"
      max-width="800px"
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="light-blue darken-3"
        >
          <v-toolbar-title>Dialog Bukti Refund</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <v-btn
              icon
              dark
              @click="tutupDialogBuktiRefund"
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
                  Bukti Refund
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-text-field
										v-model="inputRefund.bukti"
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
									<v-btn depressed small color="light-blue darken-3" dark @click="$refs.inputBUKTIFile.click()">
										<v-icon small left>add</v-icon> Tambah Bukti
									</v-btn>
									<br>
									<span v-if="this.inputRefund.bukti != ''">
										<strong>nama file :</strong> <i>{{this.inputRefund.bukti}}</i> {{'('+(this.FileBUKTI.size / (1024*1024)).toFixed(2)+' MB)'}}
										<v-icon small color="red" @click="hapusFile()">delete</v-icon>
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
									color="light-blue darken-3"
									class="white--text text--darken-2"
									small
									dense
									depressed
									:disabled="kondisiTombol"
									@click="SimpanFormRefund(FileBUKTI)"
								>
									Upload Bukti Refund
								</v-btn>
							</v-col>
						</v-row>
					</v-card-actions>	
				</v-card>
			</v-card>
		</v-dialog>
		<v-dialog
      v-model="DialogViewLampiranNPL"
      width="600px"
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="light-blue darken-3"
        >
          <v-toolbar-title>View Bukti Refund</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <v-btn
              icon
              dark
              @click="DialogViewLampiranNPL = false"
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
      v-model="DialogCropNPL"
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
	</div>
</template>

<script>
import { mapActions } from "vuex";
import PopUpNotifikasiVue from "../../Layout/PopUpNotifikasi.vue";import { Cropper } from 'vue-advanced-cropper'
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
  name: 'NPL',
	components: { PopUpNotifikasiVue, Cropper },
	data: () => ({
		isLoading: false,
		roleID: '',
		DataNPL: [],
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
      { text: "Event", value: "event", sortable: false },
      { text: "Peserta", value: "peserta", sortable: false },
      { text: "No NPL", value: "noNpl", sortable: false },
      // { text: "Status", value: "status_aktif", sortable: false },
    ],
    rowsPerPageItems: { "items-per-page-options": [5, 10, 25, 50] },
    totalItems: 0,
		DialogNPL: false,
		DialogViewLampiranNPL: false,
		DialogCropNPL: false,
		DialogBuktiRefund: false,
    kondisiTombol: true,
		inputNPL: {
			id_npl: [],
			id_pembelian_npl: '',
			id_peserta: '',
			id_event: '',
			no_npl: [],
			npl: [],
			status_npl: [],
		},
		inputRefund: {
			id_npl: '',
			UnixText: '',
			bukti: '',
		},
		image: {
      src: null,
      type: null,
    },
		componentKey: 0,  
		FileBUKTI: '',
		urlView: '',
		NPLData: [],
		statusNPLOptions: [
			{value: 0, text: 'Belum Digunakan'},
			{value: 1, text: 'Sudah Digunakan'},
			{value: 2, text: 'Refund Jaminan'},
		],

		//notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
	}),
	metaInfo: {
		title: "Lelang (Nomor Peserta Lelang) - WIN.ID",
		htmlAttrs: {
			lang: "id",
			amp: true,
		},
	},
	watch:{
		FileBUKTI(){
			if(this.FileBUKTI == undefined){
				this.FileBUKTI = ''
			}	
		},
		inputRefund: {
			deep: true,
			handler(value){
				if(value.bukti != ''){
					this.kondisiTombol = false
				}else{
					this.kondisiTombol = true	
				}
			}
		},
	},
	mounted() {
		this.roleID = localStorage.getItem("roleID")
		this.getNPL()
	},
	methods: {
		...mapActions({
      fetchData: "fetchData",
      uploadFiles: "upload/uploadFiles",
    }),
		getNPL() {
			this.isLoading = true
			let payload = {
				method: "get",
				url: `lelang/getNPL?kategori=withNPL`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				this.DataNPL = res.data.result;
				this.isLoading = false
			})
			.catch((err) => {
				this.isLoading = false
				this.notifikasi("error", err.response.data.message, "1")
			});
		},
		bukaDialog(item){
			this.clearForm()
			this.inputNPL.id_pembelian_npl = item.idPembelianNPL
			this.inputNPL.id_peserta = item.idPeserta
			this.inputNPL.id_event = item.idEvent
			this.NPLData = item.NPL ? item.NPL : []
			this.NPLData.map((el, i) => {
				this.inputNPL.id_npl[i] = el.idNpl
				this.inputNPL.no_npl[i] = el.noNpl
				this.inputNPL.status_npl[i] = el.statusNPL
			})
			this.DialogNPL = true
		},
		tutupDialog() {
      this.clearForm()
      this.DialogNPL = false
    },
		async SimpanForm() {
			let kirim = await Promise.all(this.inputNPL.no_npl.map(async (el, i) => {
				let status = []
				let bodyData = {
					jenis: 'EDIT',
					id_npl: this.inputNPL.id_npl[i], 
					no_npl: this.inputNPL.no_npl[i], 
					status_npl: this.inputNPL.status_npl[i],
					create_update_by: localStorage.getItem('idLogin'),
				}
				let payload = {
					method: "post",
					url: `lelang/postNPL`,
					body: bodyData,
					authToken: localStorage.getItem('user_token')
				};
				try { 
					let response = await this.fetchData(payload)
					status.push(response.data.status)
				} catch(err) {
					status.push(err.response.data.status)
				}
				return status[0]
			}))
			if(kirim.filter(el => el == 200).length){
				this.notifikasi("success", 'berhasil mengubah data Nomor Peserta Lelang', "1")
			}else{
        this.notifikasi("error", 'Gagal proses data', "1")
			}
			this.clearForm()
			this.DialogNPL = false
			this.getNPL()
    },
		async SimpanFormRefund(dataUpload) {
			let uploadBUKTI = await this.uploadLampiran(dataUpload)
			if(uploadBUKTI.data.status == 200){
				this.notifikasi("success", 'Berhasil upload bukti refund', "1")
			}else{
				this.notifikasi("error", 'Gagal proses data', "1")
			}
			this.clearForm()
			this.DialogBuktiRefund = false
			this.getNPL()
    },
		async uploadLampiran(dataUpload) {
			if(dataUpload){
				const bodyData = {
					proses: 'ADD',
					id: this.inputRefund.id_npl,
					create_update_by: localStorage.getItem('idLogin'),
					nama_folder: this.inputRefund.UnixText,
					nama_file: `BuktiRefund-${this.convertDate(new Date().toISOString().slice(0,10))}${this.makeRandom(8)}`,
					jenis: "images",
					bagian: "berkas",
					table: "t_refund_npl",
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
		async uploadFile(e) {
			this.FileBUKTI = await e.target.files[0];
			this.inputRefund.bukti = this.FileBUKTI.name;
			this.loadImage(this.FileBUKTI)
    },
		loadImage(files) {
      this.DialogCropNPL = true
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
      this.DialogCropNPL = false
		},
		hapusFile(){
			this.FileBUKTI = ''
			this.inputRefund.bukti = '';
		},
		tutupDialogCrop(){
      this.hapusFile()
      this.DialogCropNPL = false
    },
		viewLampiran(path) {
			this.DialogViewLampiranNPL = true
			const API_URL = process.env.VUE_APP_NODE_ENV === "production" ? process.env.VUE_APP_VIEW_PROD_API_URL : process.env.VUE_APP_VIEW_DEV_API_URL
			const no_image = `${API_URL}No_Image_Available.jpg`
			this.urlView = path ? `${API_URL}image/berkas/${path}` : no_image
		},
		bukaDialogBuktiRefund(dataNPL, dataPeserta) {
			this.inputRefund.id_npl = dataNPL.idNpl
			this.inputRefund.UnixText = dataPeserta.UnixText
			console.log(this.inputRefund);
			this.DialogBuktiRefund = true
		},
		tutupDialogBuktiRefund() {
			this.inputRefund.bukti = ''
			this.FileBUKTI = ''
			this.DialogBuktiRefund = false
		},
		clearForm() {
			this.inputNPL.id_npl = []
			this.inputNPL.id_pembelian_npl = ''
			this.inputNPL.id_peserta = ''
			this.inputNPL.id_event = ''
			this.inputNPL.no_npl = []
			this.inputNPL.npl = []
			this.inputNPL.status_npl = []
			this.NPLData = []
			this.FileBUKTI = ''
			this.inputRefund.bukti = ''
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
.box{
	width: 75px;
	height: 40px;
  background-image:-moz-linear-gradient(top, #FAD502, #E89502);
	background-image: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#FAD502), to(#E89502), color-stop(1,#E89502));
	margin: 2px;
}
 
.fourcorners{
	-moz-border-radius: 10px;
	-webkit-border-radius: 10px;
	-khtml-border-radius: 10px; 
	border-radius: 10px;
	padding: 10px;
	text-align: center;
	font-size: 10px;
}
.scrollText{
  max-height: 450px !important;
  overflow-y: auto !important;
}
.scrollTextGBR{
  max-height: 450px !important;
  overflow-y: auto !important;
}
</style>