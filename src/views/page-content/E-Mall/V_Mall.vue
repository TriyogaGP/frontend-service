<template>
  <div>
		<v-card :class="roleID == 2 && 'mt-2 mb-2 pa-1'" :outlined="roleID == 2" elevation="0">
			<h1 class="subheading grey--text">Panel Mall</h1>
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
					:items="DataMall"
					:single-expand="singleExpand"
					:expanded.sync="expanded"
					show-expand
					item-key="idMall"
					hide-default-footer
					class="elevation-1"
					:page.sync="page"
					:items-per-page="itemsPerPage"
					@page-count="pageCount = $event"
				>
					<template #[`item.number`]="{ item }">
						{{ DataMall.indexOf(item) + 1 }}
					</template>
					<template #[`item.admin`]="{ item }">
						<span v-html="item.nama" /> 
					</template>
					<template #[`item.provinsi`]="{ item }">
						<span v-html="uppercaseLetterFirst(item.provinsi)" /> 
					</template>
					<template #[`item.kota`]="{ item }">
						<span v-html="uppercaseLetterFirst(item.kota)" /> 
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
								:value="item.idMall"
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
								:value="item.idMall"
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
								:value="item.idMall"
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
								:value="item.idMall"
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
                :value="item.idMall"
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
						v-if="DataMall.length > 0"
						v-model="page"
						:length="pageCount"
						:total-visible="10"
					/>
				</v-col>
			</v-row>
		</v-card>

		<v-dialog
      v-model="DialogMall"
      max-width="800px"
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="light-blue darken-3"
        >
          <v-toolbar-title>{{editedIndex == 0 ? 'Tambah' : 'Ubah'}} Data Mall</v-toolbar-title>
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
									Admin
								</v-col>
								<v-col
									cols="12"
									md="8"
									class="pt-3"
								>
									<v-autocomplete
										v-model="inputMall.id_admin"
										:items="AdminOptions"
										item-text="nama"
										item-value="idAdmin"
										placeholder="Admin"
										label="Admin"
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
									Nama Mall
								</v-col>
								<v-col
									cols="12"
									md="8"
									class="pt-3"
								>
									<v-text-field
										v-model="inputMall.nama_mall"
										placeholder="Nama Mall"
										outlined
										dense
										label="Nama Mall"
										color="light-blue darken-3"
										hide-details
										clearable
									/>
								</v-col>
							</v-row>
							<v-row no-gutters>
								<v-col
									cols="12"
									md="4"
									class="pt-2 d-flex align-center"
								>
									Deskripsi
								</v-col>
								<v-col
									cols="12"
									md="8"
									class="pt-3"
								>
									<v-textarea
										v-model="inputMall.deskripsi"
										placeholder="Deskripsi"
										outlined
										dense
										rows="4"
										label="Deskripsi"
										color="light-blue darken-3"
										hide-details
										:clearable="editedIndex != 2"
										:readonly="editedIndex == 2"
										no-resize
									/>
								</v-col>
							</v-row>
							<v-row no-gutters>
								<v-col
									cols="12"
									md="4"
									class="pt-2 d-flex align-center"
								>
									Alamat
								</v-col>
								<v-col
									cols="12"
									md="8"
									class="pt-3"
								>
									<v-textarea
										v-model="inputMall.alamat"
										placeholder="Alamat"
										outlined
										dense
										rows="4"
										label="Alamat"
										color="light-blue darken-3"
										hide-details
										:clearable="editedIndex != 2"
										:readonly="editedIndex == 2"
										no-resize
									/>
								</v-col>
							</v-row>
							<v-row no-gutters>
								<v-col
									cols="12"
									md="4"
									class="pt-2 d-flex align-center"
								>
									Provinsi
								</v-col>
								<v-col
									cols="12"
									md="8"
									class="pt-3"
								>
									<v-autocomplete
										v-model="inputMall.provinsi"
										:items="provinsiOptions"
										item-text="text"
										item-value="value"
										placeholder="Provinsi"
										label="Provinsi"
										outlined
										dense
										hide-details
										:clearable="editedIndex != 2"
										:readonly="editedIndex == 2"
									/>
								</v-col>
							</v-row>
							<v-row v-if="inputMall.provinsi" no-gutters>
								<v-col
									cols="12"
									md="4"
									class="pt-2 d-flex align-center"
								>
									Kabupaten / Kota
								</v-col>
								<v-col
									cols="12"
									md="8"
									class="pt-3"
								>
									<v-autocomplete
										v-model="inputMall.kota"
										:items="kotaOptions"
										item-text="text"
										item-value="text"
										placeholder="Kabupaten / Kota"
										label="Kabupaten / Kota"
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
                  No Whatsapp
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-text-field
                    v-model="inputMall.no_whatsapp"
                    placeholder="No Whatsapp"
                    outlined
                    dense
                    label="No Whatsapp"
                    color="light-blue darken-3"
                    @keypress.native="onlyNumber($event, 15, inputMall.no_whatsapp)"
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
                  Logo
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-text-field
										v-model="inputMall.filelogo"
										placeholder="Upload"
										outlined
										dense
                  	style="display: none"
									/>
									<input 
										ref="inputLOGOFile"
										:key="componentKey"
										type="file"
										accept="image/x-png,image/jpg,image/jpeg"
										style="display: none"
										@change="uploadFile($event)"
									>
									<v-btn v-if="editedIndex != 2" depressed small color="light-blue darken-3" dark @click="$refs.inputLOGOFile.click()">
										<v-icon small left>{{editedIndex == 0 ? 'add' : 'edit'}}</v-icon> {{editedIndex == 0 ? 'Tambah' : 'Ubah'}} Gambar
									</v-btn>
									<v-btn v-else-if="editedIndex == 2" depressed small color="light-blue darken-3" dark @click="viewLampiran()">
										<v-icon small left>pageview</v-icon> Lihat Gambar
									</v-btn>
									<br>
									<span v-if="this.inputMall.filelogo != ''">
										<strong>nama file :</strong> <i>{{this.inputMall.filelogo}}</i> {{editedIndex == 0 ? '('+(this.FileLOGO.size / (1024*1024)).toFixed(2)+' MB)' : ''}}
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
									@click="SimpanForm(0, FileLOGO, provinsiOptions)"
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
									@click="SimpanForm(1, FileLOGO, provinsiOptions)"
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
      v-model="DialogViewLampiranMall"
      width="600px"
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="light-blue darken-3"
        >
          <v-toolbar-title>View Lampiran Data Mall</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <v-btn
              icon
              dark
              @click="DialogViewLampiranMall = false"
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
      v-model="DialogCropTenantll"
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
          @click="tutupDialogCrop(image.jenis)"
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
  name: 'Mall',
	components: { PopUpNotifikasiVue, Cropper },
	data: () => ({
		isLoading: false,
		idLogin: '',
		roleID: '',
		DataMall: [],
		AdminOptions: [],
		provinsiOptions: [],
		kotaOptions: [],
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
      { text: "Admin", value: "admin", sortable: false },
      { text: "Nama Mall", value: "namaMall", sortable: false },
      { text: "Kabupaten / Kota", value: "kota", sortable: false },
      { text: "Provinsi", value: "provinsi", sortable: false },
      { text: "Status", value: "statusAktif", sortable: false },
    ],
    rowsPerPageItems: { "items-per-page-options": [5, 10, 25, 50] },
    totalItems: 0,
		DialogMall: false,
		DialogViewLampiranMall: false,
		DialogCropTenantll: false,
		editedIndex: 3,
    kondisiTombol: true,
		inputMall: {
			UnixText: '',
			id_mall: '',
			id_admin: '',
			nama_mall: '',
			deskripsi: '',
			alamat: '',
			kota: '',
			provinsi: '',
			no_whatsapp: '',
			filelogo: '',
		},
		image: {
      src: null,
      type: null,
    },
		FileLOGO: '',
		componentKey: 0,
		urlView: '',

		//notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
	}),
	metaInfo: {
		title: "E-Mall (Mall) - WIN.ID",
		htmlAttrs: {
			lang: "id",
			amp: true,
		},
	},
	watch:{
		FileLOGO(){
			if(this.FileLOGO == undefined){
				this.FileLOGO = ''
			}	
		},
		inputMall: {
			deep: true,
			handler(value){
				if(value.id_admin == null){ this.inputMall.id_admin = '' }
				if(value.nama_mall == null){ this.inputMall.nama_mall = '' }
				if(value.deskripsi == null){ this.inputMall.deskripsi = '' }
				if(value.alamat == null){ this.inputMall.alamat = '' }
				if(value.provinsi == null){ this.inputMall.provinsi = '' }
				if(value.kota == null){ this.inputMall.kota = '' }
				if(value.no_whatsapp == null){ this.inputMall.no_whatsapp = '' }

				if(this.inputMall.provinsi != '') { 
					this.getWilayah('kabkota', value.provinsi)
				}

				if(value.id_admin != '' && value.nama_mall != '' && value.deskripsi != '' && value.alamat != '' && value.provinsi != '' && value.kota != '' && 
				value.no_whatsapp != '' && value.filelogo != ''){
					this.kondisiTombol = false
				}else{
					this.kondisiTombol = true	
				}
			}
		}
	},
	updated(){
		// if(this.editedIndex == 0){ this.inputMall.UnixText = `Mall${this.convertDate(new Date().toISOString().slice(0,10))}${this.makeRandom(8)}` }
	},
	mounted() {
		this.roleID = localStorage.getItem('roleID')
		this.idLogin = localStorage.getItem('idLogin')
		this.getMall()
	},
	methods: {
		...mapActions({
      fetchData: "fetchData",
      uploadFiles: "upload/uploadFiles",
    }),
		getMall() {
			this.isLoading = true
			let link = this.roleID != 1 ? '?id_admin='+this.idLogin+'&status_aktif=1' : ''
			let payload = {
				method: "get",
				url: `emall/getMall${link}`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				this.DataMall = res.data.result;
				this.isLoading = false
			})
			.catch((err) => {
				this.isLoading = false
				this.notifikasi("error", err.response.data.message, "1")
			});
		},
		getAllAdmin() {
			this.isLoading = true
			let payload = {
				method: "get",
				url: `admin/getAdmin?level=2&status_aktif=1`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				let dataAdminOptions = res.data.result;
				if (this.roleID == 1) {
					this.AdminOptions = dataAdminOptions
				}else{
					this.AdminOptions = dataAdminOptions.filter(val => val.idAdmin == this.idLogin)
				}
				this.isLoading = false
			})
			.catch((err) => {
				this.isLoading = false
				this.notifikasi("error", err.response.data.message, "1")
			});
		},
		getWilayah(jenis, id = null, kondisi = false, item = null) {
			let payload = {
				method: "get",
				url: `settings/getWilayah?bagian=${jenis}&KodeWilayah=${id}`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				if(jenis == 'provinsi'){
					this.provinsiOptions = res.data.result;
					if(kondisi) {
						let wilayahProvinsi = this.provinsiOptions.filter(wilayah => wilayah.text == item.provinsi)
        		this.inputMall.provinsi = wilayahProvinsi.length ? wilayahProvinsi[0].value : ''
					}
				}else{
					this.kotaOptions = res.data.result;
				}
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
		},
		bukaDialog(item, index){
			this.editedIndex = index
			this.getAllAdmin()
			this.getWilayah('provinsi')
			if(index == 0){
				this.clearForm()
				this.inputMall.UnixText = `Mall${this.convertDate(new Date().toISOString().slice(0,10))}${this.makeRandom(8)}`
      }else{
				this.inputMall.UnixText = item.UnixText ? item.UnixText : ''
				this.inputMall.id_mall = item.idMall ? item.idMall : ''
				this.inputMall.id_admin = item.idAdmin ? item.idAdmin : ''
        this.inputMall.nama_mall = item.namaMall ? item.namaMall : ''
        this.inputMall.deskripsi = item.deskripsi ? item.deskripsi : ''
        this.inputMall.alamat = item.alamat ? item.alamat : ''
        this.inputMall.no_whatsapp = item.noWhatsapp ? item.noWhatsapp : ''
        this.inputMall.filelogo = item.logo ? item.logo : ''
				this.getWilayah('provinsi', null, true, item)
				this.inputMall.kota = item.kota ? item.kota : ''
			}
			this.DialogMall = true
		},
		tutupDialog() {
      this.clearForm()
      this.DialogMall = false
    },
		async SimpanForm(index, dataUpload, item) {
			let wilayahProvinsi = item.filter(wilayah => wilayah.value == this.inputMall.provinsi)
			let nama_provinsi = wilayahProvinsi.length ? wilayahProvinsi[0].text : ''
      let bodyData = {
        jenis: index == 0 ? 'ADD' : 'EDIT',
        id_mall: index == 0 ? '' : this.inputMall.id_mall,
				UnixText: this.inputMall.UnixText,
        id_admin: this.inputMall.id_admin,
        nama_mall: this.inputMall.nama_mall,
        deskripsi: this.inputMall.deskripsi,
        alamat: this.inputMall.alamat,
        provinsi: nama_provinsi,
        kota: this.inputMall.kota,
        no_whatsapp: this.inputMall.no_whatsapp,
        logo: this.inputMall.filelogo,
        create_update_by: localStorage.getItem('idLogin'),
      }
      let payload = {
				method: "post",
				url: `emall/postMall`,
        body: bodyData,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then(async (res) => {
				if(this.FileLOGO){
					let uploadLOGO = await this.uploadLampiran(index, dataUpload)
					if(uploadLOGO.data.status == 200){
						this.notifikasi("success", res.data.message, "1")
					}else{
						this.notifikasi("error", 'Gagal proses data', "1")
					}
				}else{
					this.notifikasi("success", res.data.message, "1")
				}
				this.clearForm()
        this.DialogMall = false
        this.getMall()
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
    },
		async uploadLampiran(index, dataUpload) {
			if(dataUpload){
				const bodyData = {
					proses: index == 0 ? 'ADD' : 'EDIT',
					id: index == 0 ? null : this.inputMall.id_mall,
					nama_mall: this.inputMall.nama_mall,
					nama_folder: this.inputMall.UnixText,
					nama_file: `Mall-${this.convertDate(new Date().toISOString().slice(0,10))}${this.makeRandom(8)}`,
					jenis: "images",
					bagian: "mall",
					table: "m_mall",
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
        id_mall: item.idMall,
        nama_mall: item.namaMall,
        delete_by: localStorage.getItem('idLogin'),
      }
      let payload = {
				method: "post",
				url: `emall/postMall`,
        body: bodyData,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
        this.DialogMall = false
        this.getMall()
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
    },
    StatusRecord(item, status_aktif) {
      let bodyData = {
        jenis: 'STATUSRECORD',
        id_mall: item.idMall,
        nama_mall: item.namaMall,
        status_aktif: status_aktif,
      }
      let payload = {
				method: "post",
				url: `emall/postMall`,
        body: bodyData,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
        this.DialogMall = false
        this.getMall()
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
    },
		clearForm() {
			this.inputMall.UnixText = ''
			this.inputMall.id_mall = ''
			this.inputMall.id_admin = ''
			this.inputMall.nama_mall = ''
			this.inputMall.deskripsi = ''
			this.inputMall.alamat = ''
			this.inputMall.kota = ''
			this.inputMall.provinsi = ''
			this.inputMall.no_whatsapp = ''
			this.inputMall.filelogo = ''
			this.FileLOGO = ''
		},
		async uploadFile(e) {
			this.FileLOGO = await e.target.files[0];
			this.inputMall.filelogo = this.FileLOGO.name;
			this.loadImage(this.FileLOGO)
    },
		loadImage(files) {
      this.DialogCropTenantll = true
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
				this.FileLOGO = blob
			}, this.image.type);
      this.DialogCropTenantll = false
		},
		hapusFile(){
			this.FileLOGO = ''
			this.inputMall.filelogo = '';
		},
		tutupDialogCrop(){
      this.hapusFile()
			this.editedIndex = 3
      this.DialogCropTenantll = false
    },
		viewLampiran() {
			this.DialogViewLampiranMall = true
			const API_URL = process.env.VUE_APP_NODE_ENV === "production" ? process.env.VUE_APP_VIEW_PROD_API_URL : process.env.VUE_APP_VIEW_DEV_API_URL
			const no_image = `${API_URL}No_Image_Available.jpg`
			this.urlView = this.inputMall.filelogo ? `${API_URL}image/mall/${this.inputMall.filelogo}` : no_image
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
img {
	border-style: solid !important;
	border-radius: 10px !important;
	padding: 2px !important;
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