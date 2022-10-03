<template>
  <div>
		<v-card :class="roleID == 2 && 'mt-2 mb-2 pa-1'" :outlined="roleID == 2" elevation="0">
			<h1 class="subheading grey--text">Panel Tenant Mall</h1>
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
					:items="DataTenantMall"
					:single-expand="singleExpand"
					:expanded.sync="expanded"
					show-expand
					item-key="id_tenant_mall"
					hide-default-footer
					class="elevation-1"
					:page.sync="page"
					:items-per-page="itemsPerPage"
					@page-count="pageCount = $event"
				>
					<template #[`item.number`]="{ item }">
						{{ DataTenantMall.indexOf(item) + 1 }}
					</template>
					<template #[`item.kategori_tenant`]="{ item }">
						<span v-html="item.data_kategori_tenant.kategori_tenant" /> 
					</template>
					<template #[`item.mall`]="{ item }">
						<span v-html="item.data_mall.nama_mall" /> 
					</template>
					<template #[`item.status_aktif`]="{ item }">
						<v-icon small v-if="item.status_aktif == 1" color="green">check</v-icon>
						<v-icon small v-else-if="item.status_aktif == 0" color="red">clear</v-icon>
						<br>
						<span v-html="item.status_aktif == 1 ? 'Active' : 'Non Active'" /> 
					</template>
					<template #expanded-item="{ headers, item }">
						<td :colspan="headers.length" class="white">
							<v-btn
								:value="item.id_tenant_mall"
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
								v-if="item.status_aktif == 0"
								:value="item.id_tenant_mall"
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
								v-else-if="item.status_aktif == 1"
								:value="item.id_tenant_mall"
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
								:value="item.id_tenant_mall"
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
							<v-btn
                :value="item.id_tenant_mall"
                color="#04f7f7"
                small
                dense
                depressed
                class="ma-2 white--text text--darken-2"
                @click="bukaDialog(item, 2)"
              >
                <v-icon small>info</v-icon>	Detail
              </v-btn>
							<v-btn
                :value="item.id_tenant_mall"
                color="#0bd369"
                small
                dense
                depressed
                class="ma-2 white--text text--darken-2"
                :disabled="item.status_aktif == 0"
                @click="() => {
									inputTenantMall.UnixText = item.UnixText; 
                  inputTenantMall.id_tenant_mall = item.id_tenant_mall; 
                  inputTenantMall.nama_tenant_mall = item.nama_tenant_mall;
                  DialogUploadMultipleTenantMall = true; 
                }"
              >
                <v-icon small>upload</v-icon>	Upload Foto
              </v-btn>
							<v-divider />
						</td>
					</template>
				</v-data-table>
			</div>
			<v-row>
				<v-col cols="12" class="mt-2 pa-2 px-5">
					<v-pagination
						v-if="DataTenantMall.length > 0"
						v-model="page"
						:length="pageCount"
						:total-visible="10"
					/>
				</v-col>
			</v-row>
		</v-card>

		<v-dialog
      v-model="DialogTenantMall"
      max-width="800px"
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="light-blue darken-3"
        >
          <v-toolbar-title>{{editedIndex == 0 ? 'Tambah' : 'Ubah'}} Data Tenant Mall</v-toolbar-title>
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
										v-model="inputTenantMall.id_admin"
										:items="AdminOptions"
										item-text="nama"
										item-value="id_admin"
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
									Tenant Kategori
								</v-col>
								<v-col
									cols="12"
									md="8"
									class="pt-3"
								>
									<v-autocomplete
										v-model="inputTenantMall.id_kategori_tenant"
										:items="TenantOptions"
										item-text="kategori_tenant"
										item-value="id_kategori_tenant"
										placeholder="Tenant Kategori"
										label="Tenant Kategori"
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
									Mall
								</v-col>
								<v-col
									cols="12"
									md="8"
									class="pt-3"
								>
									<v-autocomplete
										v-model="inputTenantMall.id_mall"
										:items="MallOptions"
										item-text="nama_mall"
										item-value="id_mall"
										placeholder="Mall"
										label="Mall"
										outlined
										dense
										hide-details
										:clearable="editedIndex != 2"
										:readonly="editedIndex == 2"
									>
										<template v-slot:selection="{ item }">
											{{item.nama_mall}} {{roleID == 1 ? ' | '+item.data_admin.nama : ''}} 
										</template>
										<template v-slot:item="{ item }">
											{{item.nama_mall}} {{roleID == 1 ? ' | '+item.data_admin.nama : ''}}
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
									Nama Tenant Mall
								</v-col>
								<v-col
									cols="12"
									md="8"
									class="pt-3"
								>
									<v-text-field
										v-model="inputTenantMall.nama_tenant_mall"
										placeholder="Nama Tenant Mall"
										outlined
										dense
										label="Nama Tenant Mall"
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
										v-model="inputTenantMall.deskripsi"
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
										v-model="inputTenantMall.alamat"
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
										v-model="inputTenantMall.provinsi"
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
							<v-row v-if="inputTenantMall.provinsi" no-gutters>
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
										v-model="inputTenantMall.kota"
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
                    v-model="inputTenantMall.no_whatsapp"
                    placeholder="No Whatsapp"
                    outlined
                    dense
                    label="No Whatsapp"
                    color="light-blue darken-3"
                    @keypress.native="onlyNumber($event, 15, inputTenantMall.no_whatsapp)"
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
										v-model="inputTenantMall.filelogo"
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
									<span v-if="this.inputTenantMall.filelogo != ''">
										<strong>nama file :</strong> <i>{{this.inputTenantMall.filelogo}}</i> {{editedIndex == 0 ? '('+(this.FileLOGO.size / (1024*1024)).toFixed(2)+' MB)' : ''}}
										<v-icon small v-if="editedIndex != 2" color="red" @click="hapusFile()">delete</v-icon>
									</span>
                </v-col>
              </v-row>
							<div v-if="editedIndex == 2">
                <div class="mt-3 mb-3">
                  <v-divider />
                </div>
                <v-row v-if="MultilpeTenantMall.length > 0" no-gutters>
                  <v-col
                    class="ma-1 d-flex flex-column justify-space-between align-center"
                    v-for="(file,f) in MultilpeTenantMall" :key="f"
                  >
                    <img :ref="'file'" :src="imageMultiple[f].url" :title="file.gambar" width="300" />
                  </v-col>
                </v-row>
                <v-row v-else no-gutters>
                  <v-col class="ma-1 d-flex flex-column justify-space-between align-center">
                    <strong>Foto Tenant Mall tidak tersedia</strong>
                  </v-col>
                </v-row>
              </div>
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
      v-model="DialogViewLampiranTenantMall"
      width="600px"
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="light-blue darken-3"
        >
          <v-toolbar-title>View Lampiran Data Tenant Mall</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <v-btn
              icon
              dark
              @click="DialogViewLampiranTenantMall = false"
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
      v-model="DialogCropTenantMall"
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
		<v-dialog
      v-model="DialogUploadMultipleTenantMall"
      width="1000px"
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="light-blue darken-3"
        >
          <v-toolbar-title>Upload Foto Tenant Mall</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <v-btn
              icon
              dark
              @click="() => { imageMultiple = []; MultilpeTenantMall = []; inputTenantMall.UnixText = ''; DialogUploadMultipleTenantMall = false; }"
            >
              <v-icon>close</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card>
          <v-row no-gutters>
            <v-col cols="12">
              <div class="scrollText">
                <v-card tile class="pa-3">
                  <v-row no-gutters>
                    <v-col
                      cols="12"
                      class="pt-2 d-flex align-center"
                    >
                      <v-text-field
                        v-model="MultilpeTenantMall"
                        placeholder="Upload"
                        outlined
                        dense
                        style="display: none"
                      />
                      <input 
                        ref="inputMultipleFile"
                        :key="componentKey"
                        type="file"
                        multiple
                        style="display: none"
                        accept="image/x-png,image/jpg,image/jpeg"
                        @change="addFiles($event)"
                      >
                      <v-btn depressed small color="light-blue darken-3" dark @click="$refs.inputMultipleFile.click()">
                        <v-icon small left>upload</v-icon> Foto Tenant Mall
                      </v-btn>
                    </v-col>  
                  </v-row>
                  <v-row>
                    <v-col
                      class="ma-1 d-flex flex-column justify-space-between align-center"
                      v-for="(file,f) in MultilpeTenantMall" :key="f"
                    >
                      <img :ref="'file'" :src="imageMultiple[f].url" :title="file.name" width="200" />
                      <v-icon small color="red" @click="HapusMultiple(f)">delete</v-icon>
                    </v-col>
                  </v-row>
                </v-card>
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
                      class="mr-3 white--text text--darken-2"
                      small
                      dense
                      depressed
                      :disabled="imageMultiple.length && MultilpeTenantMall.length ? false : true"
                      @click="() => { imageMultiple = []; MultilpeTenantMall = []; }"
                    >
                      Batal
                    </v-btn>
                    <v-btn
                      color="light-blue darken-3"
                      class="white--text text--darken-2"
                      small
                      dense
                      depressed
                      :disabled="imageMultiple.length && MultilpeTenantMall.length ? false : true"
                      @click="SimpanFotoMultiple()"
                    >
                      Simpan Data Foto
                    </v-btn> 
                  </v-col>
                </v-row>
              </v-card-actions>
            </v-col>
          </v-row>
        </v-card>
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
  name: 'TenantMall',
	components: { PopUpNotifikasiVue, Cropper },
	data: () => ({
		isLoading: false,
		idLogin: '',
		roleID: '',
		DataTenantMall: [],
		AdminOptions: [],
		TenantOptions: [],
		MallOptions: [],
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
      { text: "Mall", value: "mall", sortable: false },
      { text: "Kategori Tenant", value: "kategori_tenant", sortable: false },
      { text: "Nama Tenant Mall", value: "nama_tenant_mall", sortable: false },
      { text: "Kabupaten / Kota", value: "kota", sortable: false },
      { text: "Provinsi", value: "provinsi", sortable: false },
      { text: "Status", value: "status_aktif", sortable: false },
    ],
    rowsPerPageItems: { "items-per-page-options": [5, 10, 25, 50] },
    totalItems: 0,
		DialogTenantMall: false,
		DialogViewLampiranTenantMall: false,
		DialogUploadMultipleTenantMall: false,
		DialogCropTenantMall: false,
		editedIndex: 3,
    kondisiTombol: true,
		inputTenantMall: {
			UnixText: '',
			id_admin: '',
			id_tenant_mall: '',
			id_mall: '',
			id_kategori_tenant: '',
			nama_tenant_mall: '',
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
		imageMultiple: [],
    MultilpeTenantMall: [],
    readers: [],
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
		title: "Mall (Tenant Mall) - WIN.ID",
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
		inputTenantMall: {
			deep: true,
			handler(value){
				if(value.id_admin == null){ this.inputTenantMall.id_admin = '' }
				if(value.id_kategori_tenant == null){ this.inputTenantMall.id_kategori_tenant = '' }
				if(value.id_mall == null){ this.inputTenantMall.id_mall = '' }
				if(value.nama_tenant_mall == null){ this.inputTenantMall.nama_tenant_mall = '' }
				if(value.deskripsi == null){ this.inputTenantMall.deskripsi = '' }
				if(value.alamat == null){ this.inputTenantMall.alamat = '' }
				if(value.provinsi == null){ this.inputTenantMall.provinsi = '' }
				if(value.kota == null){ this.inputTenantMall.kota = '' }
				if(value.no_whatsapp == null){ this.inputTenantMall.no_whatsapp = '' }

				if(this.inputTenantMall.provinsi != '') { 
					this.getWilayah('kabkota', value.provinsi)
				}

				if(value.id_admin != '' && value.id_kategori_tenant != '' && value.id_mall != '' && value.nama_tenant_mall != '' && value.deskripsi != '' && value.alamat != '' && 
				value.provinsi != '' && value.kota != '' && value.no_whatsapp != '' && value.filelogo != ''){
					this.kondisiTombol = false
				}else{
					this.kondisiTombol = true	
				}
			}
		}
	},
	updated(){
		// if(this.editedIndex == 0){ this.inputTenantMall.UnixText = `TenantMall${this.convertDate(new Date().toISOString().slice(0,10))}${this.makeRandom(8)}` }
	},
	mounted() {
		this.roleID = localStorage.getItem('roleID')
		this.idLogin = localStorage.getItem('idLogin')
		this.getTenantMall()
	},
	methods: {
		...mapActions({
      fetchData: "fetchData",
      uploadFiles: "upload/uploadFiles",
    }),
		getTenantMall() {
			this.isLoading = true
			let payload = {
				method: "get",
				url: `moduleMain/getAllTenantMall`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				let dataTenantMall = res.data.result;
				if(this.roleID == 1) {
					this.DataTenantMall = dataTenantMall
				}else{
					this.DataTenantMall = dataTenantMall.filter(val => val.data_mall.id_admin == this.idLogin)
				}
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
				url: `moduleMain/getAllAdmin?level=3&status_aktif=1`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				let dataAdminOptions = res.data.result;
				if (this.roleID == 1) {
					this.AdminOptions = dataAdminOptions
				}else{
					this.AdminOptions = dataAdminOptions.filter(val => val.downline_tenant == this.idLogin)
				}
				this.isLoading = false
			})
			.catch((err) => {
				this.isLoading = false
				this.notifikasi("error", err.response.data.message, "1")
			});
		},
		getKategoriTenantMall() {
			this.isLoading = true
			let payload = {
				method: "get",
				url: `moduleMain/getAllKategoriTenantMall?status_aktif=1`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				this.TenantOptions = res.data.result;
				this.isLoading = false
			})
			.catch((err) => {
				this.isLoading = false
				this.notifikasi("error", err.response.data.message, "1")
			});
		},
		getMall() {
			this.isLoading = true
			let link = this.roleID != 1 ? '?id_admin='+this.idLogin+'&status_aktif=1' : ''
			let payload = {
				method: "get",
				url: `moduleMain/getAllMall${link}`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				this.MallOptions = res.data.result;
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
				url: `moduleMain/getWilayah?KodeWilayah=${id}&bagian=${jenis}`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				if(jenis == 'provinsi'){
					this.provinsiOptions = res.data.result;
					if(kondisi) {
						let wilayahProvinsi = this.provinsiOptions.filter(wilayah => wilayah.text == item.provinsi)
        		this.inputTenantMall.provinsi = wilayahProvinsi.length ? wilayahProvinsi[0].value : ''
					}
				}else{
					this.kotaOptions = res.data.result;
				}
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
		},
		getFotoTenantMall(id) {
			let payload = {
				method: "get",
				url: `moduleMain/getAllFotoTenantMall/${id}`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				this.MultilpeTenantMall = res.data.result;
			  const API_URL = process.env.VUE_APP_NODE_ENV === "production" ? process.env.VUE_APP_VIEW_PROD_API_URL : process.env.VUE_APP_VIEW_DEV_API_URL
        this.MultilpeTenantMall.forEach((element) => {
          this.imageMultiple.push({ url: `${API_URL}image/mall/${element.gambar}` })
        })
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
		},
		bukaDialog(item, index){
			this.editedIndex = index
			this.getAllAdmin()
			this.getKategoriTenantMall()
			this.getMall()
			this.getWilayah('provinsi')
			if(index == 0){
				this.roleID = localStorage.getItem('roleID')
				this.clearForm()
				this.inputTenantMall.UnixText = `TenantMall${this.convertDate(new Date().toISOString().slice(0,10))}${this.makeRandom(8)}`
      }else{
				if(index == 2){ this.getFotoTenantMall(item.id_tenant_mall) }
				this.inputTenantMall.UnixText = item.UnixText ? item.UnixText : ''
				this.inputTenantMall.id_tenant_mall = item.id_tenant_mall ? item.id_tenant_mall : ''
				this.inputTenantMall.id_admin = item.id_admin ? item.id_admin : ''
				this.inputTenantMall.id_kategori_tenant = item.id_kategori_tenant ? item.id_kategori_tenant : ''
				this.inputTenantMall.id_mall = item.id_mall ? item.id_mall : ''
        this.inputTenantMall.nama_tenant_mall = item.nama_tenant_mall ? item.nama_tenant_mall : ''
        this.inputTenantMall.deskripsi = item.deskripsi ? item.deskripsi : ''
        this.inputTenantMall.alamat = item.alamat ? item.alamat : ''
        this.inputTenantMall.no_whatsapp = item.no_whatsapp ? item.no_whatsapp : ''
        this.inputTenantMall.filelogo = item.logo ? item.logo : ''
        this.getWilayah('provinsi', null, true, item)
        this.inputTenantMall.kota = item.kota ? item.kota : ''
			}
			this.DialogTenantMall = true
		},
		tutupDialog() {
      this.clearForm()
      this.DialogTenantMall = false
    },
		async SimpanForm(index, dataUpload, item) {
			let wilayahProvinsi = item.filter(wilayah => wilayah.value == this.inputTenantMall.provinsi)
			let nama_provinsi = wilayahProvinsi.length ? wilayahProvinsi[0].text : ''
      let bodyData = {
        jenis: index == 0 ? 'ADD' : 'EDIT',
        id_tenant_mall: index == 0 ? '' : this.inputTenantMall.id_tenant_mall,
        UnixText: this.inputTenantMall.UnixText,
        id_admin: this.inputTenantMall.id_admin,
        id_kategori_tenant: this.inputTenantMall.id_kategori_tenant,
        id_mall: this.inputTenantMall.id_mall,
        nama_tenant_mall: this.inputTenantMall.nama_tenant_mall,
        deskripsi: this.inputTenantMall.deskripsi,
        alamat: this.inputTenantMall.alamat,
        provinsi: nama_provinsi,
        kota: this.inputTenantMall.kota,
        no_whatsapp: this.inputTenantMall.no_whatsapp,
        logo: this.inputTenantMall.filelogo,
        create_update_by: localStorage.getItem('idLogin'),
      }
      let payload = {
				method: "post",
				url: `moduleMain/prosesTenantMall`,
        body: bodyData,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then(async (res) => {
				if(this.FileLOGO){
					let uploadLOGO = await this.uploadLampiran(index, dataUpload)
					if(uploadLOGO.data.kode == 200){
						this.notifikasi("success", res.data.message, "1")
					}else{
						this.notifikasi("error", 'Gagal proses data', "1")
					}
				}else{
					this.notifikasi("success", res.data.message, "1")
				}
				this.clearForm()
        this.DialogTenantMall = false
        this.getTenantMall()
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
    },
		async uploadLampiran(index, dataUpload) {
			if(dataUpload){
				const bodyData = {
					proses: index == 0 ? 'ADD' : 'EDIT',
					id: index == 0 ? null : this.inputTenantMall.id_tenant_mall,
					nama_tenant_mall: this.inputTenantMall.nama_tenant_mall,
					nama_folder: this.inputTenantMall.UnixText,
					nama_file: `TenantMall-${this.convertDate(new Date().toISOString().slice(0,10))}${this.makeRandom(8)}`,
					jenis: "images",
					bagian: "mall",
					table: "t_tenant_mall",
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
        id_tenant_mall: item.id_tenant_mall,
        nama_tenant_mall: item.nama_tenant_mall,
        delete_by: localStorage.getItem('idLogin'),
      }
      let payload = {
				method: "post",
				url: `moduleMain/prosesTenantMall`,
        body: bodyData,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
        this.DialogTenantMall = false
        this.getTenantMall()
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
    },
    StatusRecord(item, status_aktif) {
      let bodyData = {
        jenis: 'STATUSRECORD',
        id_tenant_mall: item.id_tenant_mall,
        nama_tenant_mall: item.nama_tenant_mall,
        status_aktif: status_aktif,
      }
      let payload = {
				method: "post",
				url: `moduleMain/prosesTenantMall`,
        body: bodyData,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
        this.DialogTenantMall = false
        this.getTenantMall()
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
    },
		clearForm() {
			this.inputTenantMall.UnixText = ''
			this.inputTenantMall.id_tenant_mall = ''
			this.inputTenantMall.id_admin = ''
			this.inputTenantMall.id_kategori_tenant = ''
			this.inputTenantMall.id_mall = ''
			this.inputTenantMall.nama_tenant_mall = ''
			this.inputTenantMall.deskripsi = ''
			this.inputTenantMall.alamat = ''
			this.inputTenantMall.kota = ''
			this.inputTenantMall.provinsi = ''
			this.inputTenantMall.no_whatsapp = ''
			this.inputTenantMall.filelogo = ''
			this.FileLOGO = ''
			this.MultilpeTenantMall = []
      this.imageMultiple = []
		},
		async uploadFile(e) {
			this.FileLOGO = await e.target.files[0];
			this.inputTenantMall.filelogo = this.FileLOGO.name;
			this.loadImage(this.FileLOGO)
    },
		loadImage(files) {
      this.DialogCropTenantMall = true
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
      this.DialogCropTenantMall = false
		},
		hapusFile(){
			this.FileLOGO = ''
			this.inputTenantMall.filelogo = '';
		},
		tutupDialogCrop(){
      this.hapusFile()
			this.editedIndex = 3
      this.DialogCropTenantMall = false
    },
		viewLampiran() {
			this.DialogViewLampiranTenantMall = true
			const API_URL = process.env.VUE_APP_NODE_ENV === "production" ? process.env.VUE_APP_VIEW_PROD_API_URL : process.env.VUE_APP_VIEW_DEV_API_URL
			const no_image = `${API_URL}No_Image_Available.jpg`
			this.urlView = this.inputTenantMall.filelogo ? `${API_URL}image/mall/${this.inputTenantMall.filelogo}` : no_image
		},
		addFiles(e) {
      let jml_files = e.target.files.length
      for(let i=0;i<jml_files;i++) {
        this.MultilpeTenantMall.push(e.target.files[i])
      }      
      this.MultilpeTenantMall.forEach((file, f) => {
        this.imageMultiple.push({ url: URL.createObjectURL(file) })
      })
    },
    HapusMultiple(index) {
      this.imageMultiple = []
      this.MultilpeTenantMall.splice(index, 1)
      this.MultilpeTenantMall.forEach((file, f) => {
        this.imageMultiple.push({ url: URL.createObjectURL(file) })
      })
    },
    async SimpanFotoMultiple() {
      let kirim = await Promise.all(this.MultilpeTenantMall.map(async (file, f) => {
        let status = []
        const bodyData = {
          id: this.inputTenantMall.id_tenant_mall,
					nama_tenant_mall: this.inputTenantMall.nama_tenant_mall,
					nama_folder: this.inputTenantMall.UnixText,
					nama_file: `FotoTenantMall-${this.convertDate(new Date().toISOString().slice(0,10))}_${this.makeRandom(8)}`,
					jenis: "images",
					bagian: "foto_tenant_mall",
					table: "m_foto_tenant_mall",
					files: file,
				};
				try {
					let response = await this.uploadFiles(bodyData);
          status.push(response.data.kode)
				} catch (err) {
          status.push(err.response.data.kode)
				}
        return status[0]
      }))
      if(kirim.filter(el => el == 200).length){
        this.notifikasi("success", 'Berhasil Upload Foto Tenant Mall', "1")
      }else{
        this.notifikasi("error", 'Gagal proses data', "1")
      }
      this.clearForm()
      this.DialogUploadMultipleTenantMall = false
      this.getTenantMall()
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
.v-list-item--dense, .v-list--dense .v-list-item {
	font-size: 0.8125rem !important;
	font-weight: 500 !important;
	line-height: 1rem !important;
}
</style>