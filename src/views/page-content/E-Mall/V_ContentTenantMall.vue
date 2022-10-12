<template>
	<div>
		<v-card :class="roleID == 3 && 'mt-2 mb-2 pa-1'" :outlined="roleID == 3" elevation="0">
			<h1 class="subheading grey--text">Panel Content Tenant Mall</h1>
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
									:items="DataContent"
									:single-expand="singleExpand"
									:expanded.sync="expanded"
									show-expand
									item-key="idContentTenantMall"
									hide-default-footer
									class="elevation-1"
									:page.sync="page"
									:items-per-page="itemsPerPage"
									@page-count="pageCount = $event"
								>
									<template #[`item.number`]="{ item }">
										{{ DataContent.indexOf(item) + 1 }}
									</template>
									<template #[`item.tenant_mall`]="{ item }">
										<span v-html="item.namaTenantMall" />
									</template>
									<template #[`item.statusAktif`]="{ item }">
										<v-icon small v-if="item.statusAktif == true" color="green">check</v-icon>
										<v-icon small v-else-if="item.statusAktif == false" color="red">clear</v-icon>
										<br>
										<span v-html="item.statusAktif == true ? 'Active' : 'Non Active'" /> 
									</template>
									<!-- <template #[`item.kategori`]="{ item }">
										<span v-html="item.data_kategori_content.kategori_content" />
									</template> -->
									<template #expanded-item="{ headers, item }">
										<td :colspan="headers.length" class="white">
											<v-btn
												:value="item.idContentTenantMall"
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
												:value="item.idContentTenantMall"
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
												:value="item.idContentTenantMall"
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
												:value="item.idContentTenantMall"
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
												:value="item.idContentTenantMall"
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
										v-if="DataContent.length > 0"
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
      v-model="DialogContent"
      max-width="800px"
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="light-blue darken-3"
        >
          <v-toolbar-title>{{editedIndex == 0 ? 'Tambah' : 'Ubah'}} Data Content Tenant Mall</v-toolbar-title>
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
									Tenant Mall
								</v-col>
								<v-col
									cols="12"
									md="8"
									class="pt-3"
								>
									<v-autocomplete
										v-model="inputContent.id_tenant_mall"
										:items="TenantMallOptions"
										item-text="namaTenantMall"
										item-value="idTenantMall"
										placeholder="Tenant Mall"
										label="Tenant Mall"
										outlined
										dense
										hide-details
										:clearable="editedIndex != 2"
										:readonly="editedIndex == 2"
									>
										<template v-slot:selection="{ item }">
											{{item.namaTenantMall}} | {{item.namaMall}} 
										</template>
										<template v-slot:item="{ item }">
											{{item.namaTenantMall}} | {{item.namaMall}}
										</template>
									</v-autocomplete>
								</v-col>
							</v-row>
							<v-row no-gutters>
								<v-col
									cols="12"
									md="4"
									class="pt-2 d-flex align-center"
								>
									Kategori Content
								</v-col>
								<v-col
									cols="12"
									md="8"
									class="pt-3"
								>
									<v-autocomplete
										v-model="inputContent.id_kategori_content"
										:items="KategoriContentOptions"
										item-text="text"
										item-value="value"
										placeholder="Kategori Content"
										label="Kategori Content"
										outlined
										dense
										hide-details
										readonly
									/>
								</v-col>
							</v-row>
							<v-row no-gutters>
								<v-col
									cols="12"
									md="4"
									class="pt-2 d-flex align-center"
								>
									Judul Content
								</v-col>
								<v-col
									cols="12"
									md="8"
									class="pt-3"
								>
									<v-text-field
										v-model="inputContent.judul_content"
										placeholder="Judul Content"
										outlined
										dense
										label="Judul Content"
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
									Link
								</v-col>
								<v-col
									cols="12"
									md="8"
									class="pt-3"
								>
									<v-textarea
										v-model="inputContent.link"
										placeholder="Link"
										outlined
										dense
										rows="4"
										label="Link"
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
									Deskripsi
								</v-col>
								<v-col
									cols="12"
									md="8"
									class="pt-3"
								>
									<v-textarea
										v-model="inputContent.deskripsi"
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
									Foto Content Tenant Mall
								</v-col>
								<v-col
									cols="12"
									md="8"
									class="pt-3"
								>
									<v-text-field
										v-model="inputContent.filefoto"
										placeholder="Upload"
										outlined
										dense
										style="display: none"
									/>
									<input 
										ref="inputFOTOFile"
										:key="componentKey"
										type="file"
										accept="image/x-png,image/jpg,image/jpeg"
										style="display: none"
										@change="uploadFile($event)"
									>
									<v-btn v-if="editedIndex != 2" depressed small color="light-blue darken-3" dark @click="$refs.inputFOTOFile.click()">
										<v-icon small left>{{editedIndex == 0 ? 'add' : 'edit'}}</v-icon> {{editedIndex == 0 ? 'Tambah' : 'Ubah'}} Foto
									</v-btn>
									<v-btn v-else-if="editedIndex == 2" depressed small color="light-blue darken-3" dark @click="viewLampiran()">
										<v-icon small left>pageview</v-icon> Lihat Foto
									</v-btn>
									<br>
									<span v-if="this.inputContent.filefoto != ''">
										<strong>nama file :</strong> <i>{{this.inputContent.filefoto}}</i> {{editedIndex == 0 ? '('+(this.FileFOTO.size / (1024*1024)).toFixed(2)+' MB)' : ''}}
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
									@click="SimpanForm(0, FileFOTO)"
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
									@click="SimpanForm(1, FileFOTO)"
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
      v-model="DialogViewLampiranContent"
      width="600px"
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="light-blue darken-3"
        >
          <v-toolbar-title>View Lampiran Data Content Tenant Mall</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <v-btn
              icon
              dark
              @click="DialogViewLampiranContent = false"
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
      v-model="DialogCropContent"
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
  name: 'ContentTenantMall',
	components: { PopUpNotifikasiVue, Cropper },
	data: () => ({
		isLoading: false,
		idLogin: '',
		roleID: '',
		DataContent: [],
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
      { text: "Tenant Mall", value: "tenant_mall", sortable: false },
      // { text: "Kategori Content", value: "kategori", sortable: false },
      { text: "Judul Content", value: "judulContent", sortable: false },
      { text: "Status", value: "statusAktif", sortable: false },
    ],
    rowsPerPageItems: { "items-per-page-options": [5, 10, 25, 50] },
    totalItems: 0,
		DialogContent: false,
		DialogViewLampiranContent: false,
		DialogCropContent: false,
		editedIndex: 3,
    kondisiTombol: true,
		TenantMallOptions: [],
		inputContent: {
			UnixText: '',
			id_content_tenant_mall: '',
			id_tenant_mall: '',
			id_kategori_content: '',
			judul_content: '',
			link: '',
			deskripsi: '',
			filefoto: '',
		},
		itemsTab: [
			{code: '1', text: 'Promosi'},
			{code: '2', text: 'Rewards'},
			{code: '3', text: 'Voucher'},
		],
		KategoriContentOptions: [
			{value: 1, text: 'Promosi'},
			{value: 2, text: 'Rewards'},
			{value: 3, text: 'Voucher'},
		],
		tab: '',
		codeActive: '',
		image: {
      src: null,
      type: null,
    },
		FileFOTO: '',
		componentKey: 0,
		urlView: '',

		//notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
	}),
	metaInfo: {
		title: "E-Mall (Content Tenant Mall) - WIN.ID",
		htmlAttrs: {
			lang: "id",
			amp: true,
		},
	},
	watch:{
		FileFOTO(){
			if(this.FileFOTO == undefined){
				this.FileFOTO = ''
			}	
		},
		tab:{
			handler(value){
				value = value + 1
				this.getContent(value)
			}
		},
		inputContent: {
			deep: true,
			handler(value){
				if(value.id_tenant_mall == null){ this.inputContent.id_tenant_mall = '' }
				if(value.id_kategori_content == null){ this.inputContent.id_kategori_content = '' }
				if(value.judul_content == null){ this.inputContent.judul_content = '' }
				if(value.link == null){ this.inputContent.link = '' }
				if(value.deskripsi == null){ this.inputContent.deskripsi = '' }

				if(this.editedIndex == 0 && !this.inputContent.UnixText) { this.getTenantMall(2, value.id_tenant_mall) }

				if(value.id_tenant_mall != '' && value.id_kategori_content != '' && value.judul_content != '' && value.link != '' && value.deskripsi != '' && 
					value.filefoto != ''){
					this.kondisiTombol = false
				}else{
					this.kondisiTombol = true	
				}
			}
		}
	},
	mounted() {
		this.roleID = localStorage.getItem("roleID")
		this.idLogin = localStorage.getItem("idLogin")
		// this.getContent('1')
	},
	methods: {
		...mapActions({
      fetchData: "fetchData",
      uploadFiles: "upload/uploadFiles",
    }),
		getContent(code) {
			this.codeActive = code
			this.isLoading = true
			let payload = {
				method: "get",
				url: `emall/getContent?kategori=tenantmall&id_kategori_content=${code}`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				let dataContent = res.data.result;
				if(this.roleID == 1) {
					this.DataContent = dataContent
				}else{
					this.DataContent = dataContent.filter(val => val.idAdmin == this.idLogin)
				}
				this.isLoading = false
			})
			.catch((err) => {
				this.isLoading = false
				this.notifikasi("error", err.response.data.message, "1")
			});
		},
		getTenantMall(index, value = null) {
			this.isLoading = true
			let link = this.roleID != 1 ? '?id_admin='+this.idLogin+'&status_aktif=1' : ''
			let payload = {
				method: "get",
				url: `emall/getTenantMall${link}`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				let dataKumpul = res.data.result;
				if(index == 1) {
					this.TenantMallOptions = dataKumpul
				}else{
					dataKumpul.map(val => {
						if(val.idTenantMall == value) {
							this.inputContent.UnixText = val.UnixText
						}
					})
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
			this.getTenantMall(1)
			if(index == 0){
				this.clearForm()
				this.inputContent.id_kategori_content = this.codeActive
      }else{
				this.inputContent.UnixText = item ? item.UnixText : ''
				this.inputContent.id_content_tenant_mall = item.idContentTenantMall ? item.idContentTenantMall : ''
				this.inputContent.id_tenant_mall = item.idTenantMall ? item.idTenantMall : ''
				this.inputContent.id_kategori_content = item.idKategoriContent ? item.idKategoriContent : ''
        this.inputContent.judul_content = item.judulContent ? item.judulContent : ''
        this.inputContent.link = item.link ? item.link : ''
        this.inputContent.deskripsi = item.deskripsi ? item.deskripsi : ''
        this.inputContent.filefoto = item.foto ? item.foto : ''
			}
			this.DialogContent = true
		},
		tutupDialog() {
      this.clearForm()
      this.DialogContent = false
    },
		async SimpanForm(index, dataUpload) {
      let bodyData = {
        jenis: index == 0 ? 'ADD' : 'EDIT',
				content: 'TenantMall',
        id_content_tenant_mall: index == 0 ? '' : this.inputContent.id_content_tenant_mall,
        id_tenant_mall: this.inputContent.id_tenant_mall,
        id_kategori_content: this.inputContent.id_kategori_content,
        judul_content: this.inputContent.judul_content,
        link: this.inputContent.link,
        deskripsi: this.inputContent.deskripsi,
        foto: this.inputContent.filefoto,
        create_update_by: localStorage.getItem('idLogin'),
      }
      let payload = {
				method: "post",
				url: `emall/postContent`,
        body: bodyData,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then(async (res) => {
				if(this.FileFOTO){
					let uploadFOTO = await this.uploadLampiran(index, dataUpload)
					if(uploadFOTO.data.status == 200){
						this.notifikasi("success", res.data.message, "1")
					}else{
						this.notifikasi("error", 'Gagal proses data', "1")
					}
				}else{
					this.notifikasi("success", res.data.message, "1")
				}
				this.clearForm()
        this.DialogContent = false
        this.getContent(this.codeActive)
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
    },
		async uploadLampiran(index, dataUpload) {
			if(dataUpload){
				const bodyData = {
					proses: index == 0 ? 'ADD' : 'EDIT',
					id: index == 0 ? null : this.inputContent.id_content_tenant_mall,
					judul_content: this.inputContent.judul_content,
					nama_folder: this.inputContent.UnixText,
					nama_file: `ContentTenantMall-${this.convertDate(new Date().toISOString().slice(0,10))}${this.makeRandom(8)}`,
					jenis: "images",
					bagian: "mall",
					table: "t_content_tenant_mall",
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
				content: 'TenantMall',
        id_content_tenant_mall: item.idContentTenantMall,
        judul_content: item.judulContent,
        delete_by: localStorage.getItem('idLogin'),
      }
      let payload = {
				method: "post",
				url: `emall/postContent`,
        body: bodyData,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
        this.DialogContent = false
        this.getContent(this.codeActive)
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
    },
    StatusRecord(item, status_aktif) {
      let bodyData = {
        jenis: 'STATUSRECORD',
				content: 'TenantMall',
        id_content_tenant_mall: item.idContentTenantMall,
        status_aktif: status_aktif,
      }
      let payload = {
				method: "post",
				url: `emall/postContent`,
        body: bodyData,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
        this.DialogContent = false
        this.getContent(this.codeActive)
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
    },
		async uploadFile(e) {
			this.FileFOTO = await e.target.files[0];
			this.inputContent.filefoto = this.FileFOTO.name;
			this.loadImage(this.FileFOTO)
    },
		loadImage(files) {
      this.DialogCropContent = true
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
				this.FileFOTO = blob
			}, this.image.type);
      this.DialogCropContent = false
		},
		hapusFile(){
			this.FileFOTO = ''
			this.inputContent.filefoto = '';
		},
		tutupDialogCrop(){
      this.hapusFile()
			this.editedIndex = 3
      this.DialogCropContent = false
    },
		viewLampiran() {
			this.DialogViewLampiranContent = true
			const API_URL = process.env.VUE_APP_NODE_ENV === "production" ? process.env.VUE_APP_VIEW_PROD_API_URL : process.env.VUE_APP_VIEW_DEV_API_URL
			const no_image = `${API_URL}No_Image_Available.jpg`
			this.urlView = this.inputContent.filefoto ? `${API_URL}image/mall/${this.inputContent.filefoto}` : no_image
		},
		clearForm() {
			this.inputContent.UnixText = ''
			this.inputContent.id_content_tenant_mall = ''
			this.inputContent.id_tenant_mall = ''
			this.inputContent.id_kategori_content = ''
			this.inputContent.judul_content = ''
			this.inputContent.link = ''
			this.inputContent.deskripsi = ''
			this.inputContent.filefoto = ''
			this.FileFOTO = ''
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
.scrollTextGBR{
  max-height: 450px !important;
  overflow-y: auto !important;
}
.v-list-item--dense, .v-list--dense .v-list-item {
	font-size: 0.8125rem !important;
	font-weight: 500 !important;
	line-height: 1rem !important;
}
</style>