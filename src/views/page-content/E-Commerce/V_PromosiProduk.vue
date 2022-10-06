<template>
  <div>
		<v-card :class="roleID == 4 && 'mt-2 mb-2 pa-1'" :outlined="roleID == 4" elevation="0">
			<h1 class="subheading grey--text">Panel Promosi Produk</h1>
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
					:items="DataPromosiProduk"
					:single-expand="singleExpand"
					:expanded.sync="expanded"
					show-expand
					item-key="idPromosi"
					hide-default-footer
					class="elevation-1"
					:page.sync="page"
					:items-per-page="itemsPerPage"
					@page-count="pageCount = $event"
				>
					<template #[`item.number`]="{ item }">
						{{ DataPromosiProduk.indexOf(item) + 1 }}
					</template>
					<template #[`item.produk`]="{ item }">
						<v-btn
							:value="item.idPromosi"
							color="#04f7f7"
							small
							dense
							depressed
							class="ma-2 white--text text--darken-2"
							@click="ListProduk(item)"
						>
						<v-icon small>info</v-icon>	List Produk
						</v-btn>
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
								:value="item.idPromosi"
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
								:value="item.idPromosi"
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
								:value="item.idPromosi"
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
								:value="item.idPromosi"
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
								:value="item.idPromosi"
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
						v-if="DataPromosiProduk.length > 0"
						v-model="page"
						:length="pageCount"
						:total-visible="10"
					/>
				</v-col>
			</v-row>
		</v-card>
		<v-dialog
      v-model="DialogPromosiProduk"
      max-width="800px"
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="light-blue darken-3"
        >
          <v-toolbar-title>{{editedIndex == 0 ? 'Tambah' : 'Ubah'}} Data Promosi Produk</v-toolbar-title>
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
								Promosi Produk
							</v-col>
							<v-col
								cols="12"
								md="8"
								class="pt-3"
							>
								<v-text-field
									v-model="inputPromosiProduk.nama_promo"
									placeholder="Promosi Produk"
									outlined
									dense
									label="Promosi Produk"
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
								Produk
							</v-col>
							<v-col
								cols="12"
								md="8"
								class="pt-3"
							>
								<v-autocomplete
                  v-model="inputPromosiProduk.id_produk"
                  :items="DataProduk"
                  placeholder="Pilih Produk"
									label="Pilih Produk"
                  item-text="namaProduk"
                  item-value="idProduk"
                  multiple
                  outlined
                  hide-details
                  dense
									:clearable="editedIndex != 2"
									:readonly="editedIndex == 2"
                >
                  <template #selection="data">
                    <v-chip
                      v-bind="data.attrs"
                      :input-value="data.selected"
                      :close="editedIndex != 2"
											small
  										outlined
											color="light-blue darken-3"
                      @click="data.select"
                      @click:close="remove(data.item)"
                    >
                      {{ data.item.namaProduk }}
                    </v-chip>
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
								Deskripsi Produk
							</v-col>
							<v-col
								cols="12"
								md="8"
								class="pt-3"
							>
								<v-textarea
									v-model="inputPromosiProduk.deskripsi"
									placeholder="Deskripsi Produk"
									outlined
									dense
									rows="4"
									label="Deskripsi Produk"
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
								Gambar Promo
							</v-col>
							<v-col
								cols="12"
								md="8"
								class="pt-3"
							>
								<v-text-field
									v-model="inputPromosiProduk.gambar"
									placeholder="Upload"
									outlined
									dense
									style="display: none"
								/>
								<input 
									ref="inputGAMBARFile"
									:key="componentKey"
									type="file"
									accept="image/x-png,image/jpg,image/jpeg"
									style="display: none"
									@change="uploadFile($event)"
								>
								<v-btn v-if="editedIndex != 2" depressed small color="light-blue darken-3" dark @click="$refs.inputGAMBARFile.click()">
									<v-icon small left>{{editedIndex == 0 ? 'add' : 'edit'}}</v-icon> {{editedIndex == 0 ? 'Tambah' : 'Ubah'}} Gambar
								</v-btn>
								<v-btn v-else-if="editedIndex == 2" depressed small color="light-blue darken-3" dark @click="viewLampiran()">
									<v-icon small left>pageview</v-icon> Lihat Gambar
								</v-btn>
								<br>
								<span v-if="this.inputPromosiProduk.gambar != ''">
									<strong>nama file :</strong> <i>{{this.inputPromosiProduk.gambar}}</i> {{editedIndex == 0 ? '('+(this.FileGAMBAR.size / (1024*1024)).toFixed(2)+' MB)' : ''}}
									<v-icon small v-if="editedIndex != 2" color="red" @click="hapusFile()">delete</v-icon>
								</span>
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
									@click="SimpanForm(0, FileGAMBAR)"
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
									@click="SimpanForm(1, FileGAMBAR)"
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
          <v-toolbar-title>List Produk</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <v-btn
              icon
              dark
              @click="() => { DialogProduk = false; ProdukPromosi = [] }"
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
									<v-flex 
										sm6 xs12 md6 lg6
										v-for="(item, i) in ProdukPromosi"
										:key="i"
									>
										<v-card class="ma-3">
											<v-list-item>
												<v-list-item-content>
													<v-carousel v-if="item.dataFotoProduk.length" :v-model="0" height="auto" hide-delimiters>
														<v-carousel-item
															v-for="(pic, i) in item.dataFotoProduk"
															:key="i"
														>
															<v-row class="ma-1" align="center" justify="center">
																<img :src="pic.gambar ? `${API_URL}image/produk/${pic.gambar}` : `${API_URL}No_Image_Available.jpg`" width="420"/>
															</v-row>
														</v-carousel-item>
													</v-carousel>
														<img v-else :src="`${API_URL}No_Image_Available.jpg`" width="180"/>
													<div class="overline text-center"><strong>{{item.namaProduk}}</strong></div>
													<div><v-divider /></div>
													<div class="overline text-center">{{item.merekProduk}}</div>
												</v-list-item-content>
											</v-list-item>
										</v-card>
									</v-flex>
								</v-layout>
							</v-container>
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
		<v-dialog
      v-model="DialogViewLampiranPromo"
      width="600px"
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="light-blue darken-3"
        >
          <v-toolbar-title>View Gambar Promo</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <v-btn
              icon
              dark
              @click="DialogViewLampiranPromo = false"
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
      v-model="DialogCropPromo"
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
  name: 'PromosiProduk',
	components: { PopUpNotifikasiVue, Cropper },
	data: () => ({
		isLoading: false,
		roleID: '',
		DataPromosiProduk: [],
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
      { text: "Promo Produk", value: "namaPromo", sortable: false },
      { text: "Produk", value: "produk", sortable: false },
      { text: "Status", value: "statusAktif", sortable: false },
    ],
    rowsPerPageItems: { "items-per-page-options": [5, 10, 25, 50] },
    totalItems: 0,
		DialogPromosiProduk: false,
		DialogProduk: false,
		DialogViewLampiranPromo: false,
		DialogCropPromo: false,
		editedIndex: 3,
    kondisiTombol: true,
		DataProduk: [],
		ProdukPromosi: [],
		inputPromosiProduk: {
			UnixText: '',
			id_promosi: '',
			id_produk: '',
			nama_promo: '',
			gambar: '',
			deskripsi: '',
		},
		image: {
      src: null,
      type: null,
    },
		componentKey: 0,
		FileGAMBAR: '',
		urlView: '',
		API_URL: '',

		//notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
	}),
	metaInfo: {
		title: "E-Commerce (Promosi Produk) - WIN.ID",
		htmlAttrs: {
			lang: "id",
			amp: true,
		},
	},
	watch:{
		inputPromosiProduk: {
			deep: true,
			handler(value){
				if(value.nama_promo == null){ this.inputPromosiProduk.nama_promo = '' }
				if(value.deskripsi == null){ this.inputPromosiProduk.deskripsi = '' }

				if(value.nama_promo != '' && value.deskripsi != '' && value.gambar != ''){
					this.kondisiTombol = false
				}else{
					this.kondisiTombol = true	
				}
			}
		}
	},
	updated(){
		// if(this.editedIndex == 0){ this.inputPromosiProduk.UnixText = `Promo${this.convertDate(new Date().toISOString().slice(0,10))}${this.makeRandom(8)}` }
	},
	mounted() {
		this.roleID = localStorage.getItem("roleID")
		this.API_URL = process.env.VUE_APP_NODE_ENV === "production" ? process.env.VUE_APP_VIEW_PROD_API_URL : process.env.VUE_APP_VIEW_DEV_API_URL
		this.getPromosiProduk()
	},
	methods: {
		...mapActions({
      fetchData: "fetchData",
      uploadFiles: "upload/uploadFiles",
    }),
		getPromosiProduk() {
			this.isLoading = true
			let payload = {
				method: "get",
				url: `ecommerce/getPromosi`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				this.DataPromosiProduk = res.data.result;
				this.isLoading = false
			})
			.catch((err) => {
				this.isLoading = false
				this.notifikasi("error", err.response.data.message, "1")
			});
		},
		getProduk(item) {
			let payload = {
				method: "get",
				url: `ecommerce/getProduk`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				this.DataProduk = res.data.result;
				if(item){
					item.idProduk.map(el => {
						let obj = this.DataProduk.filter(val => val.idProduk == el.id_produk)
						this.ProdukPromosi.push(obj[0])
					})
				}
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
		},
		bukaDialog(item, index){
			this.editedIndex = index
			this.getProduk(null)
			if(index == 0){
				this.clearForm()
				this.inputPromosiProduk.UnixText = `Promo${this.convertDate(new Date().toISOString().slice(0,10))}${this.makeRandom(8)}`
      }else{
        this.inputPromosiProduk.UnixText = item.UnixText
				this.inputPromosiProduk.id_promosi = item.idPromosi
        this.inputPromosiProduk.nama_promo = item.namaPromo
        this.inputPromosiProduk.deskripsi = item.deskripsi
        this.inputPromosiProduk.gambar = item.gambar
				let kumpul = []
				item.idProduk.map(el => {
					kumpul.push(el.id_produk)
				})
				this.inputPromosiProduk.id_produk = kumpul
			}
			this.DialogPromosiProduk = true
		},
		tutupDialog() {
      this.clearForm()
      this.DialogPromosiProduk = false
    },
		remove(item) {
      this.inputPromosiProduk.id_produk.splice(this.inputPromosiProduk.id_produk.indexOf(item.id_produk), 1);
    },
		SimpanForm(index, dataUpload) {
			const produk = [];
      for (let i = 0; i < this.inputPromosiProduk.id_produk.length; i++) {
        produk.push({ id_produk: this.inputPromosiProduk.id_produk[i] });
      }
      let bodyData = {
        jenis: index == 0 ? 'ADD' : 'EDIT',
        id_promosi: index == 0 ? '' : this.inputPromosiProduk.id_promosi,
        id_produk: produk,
        nama_promo: this.inputPromosiProduk.nama_promo,
        deskripsi: this.inputPromosiProduk.deskripsi,
        gambar: this.inputPromosiProduk.gambar,
        create_update_by: localStorage.getItem('idLogin'),
      }
      let payload = {
				method: "post",
				url: `ecommerce/postPromosi`,
        body: bodyData,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then(async (res) => {
				if(this.FileGAMBAR){
					let uploadGAMBAR = await this.uploadLampiran(index, dataUpload)
					if(uploadGAMBAR.data.status == 200){
						this.notifikasi("success", res.data.message, "1")
					}else{
						this.notifikasi("error", 'Gagal proses data', "1")
					}
				}else{
					this.notifikasi("success", res.data.message, "1")
				}
				// this.notifikasi("success", res.data.message, "1")
				this.DialogPromosiProduk = false
        this.getPromosiProduk()
				this.clearForm()
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
    },
		async uploadLampiran(index, dataUpload) {
			if(dataUpload){
				const bodyData = {
					proses: index == 0 ? 'ADD' : 'EDIT',
					id: index == 0 ? null : this.inputPromosiProduk.id_promosi,
					nama_promo: this.inputPromosiProduk.nama_promo,
					nama_folder: this.inputPromosiProduk.UnixText,
					nama_file: `PromoProduk-${this.convertDate(new Date().toISOString().slice(0,10))}${this.makeRandom(8)}`,
					jenis: "images",
					bagian: "promo",
					table: "t_promosi",
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
        id_promosi: item.idPromosi,
        delete_by: localStorage.getItem('idLogin'),
      }
      let payload = {
				method: "post",
				url: `ecommerce/postPromosi`,
        body: bodyData,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
        this.DialogPromosiProduk = false
        this.getPromosiProduk()
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
    },
    StatusRecord(item, status_aktif) {
      let bodyData = {
        jenis: 'STATUSRECORD',
        id_promosi: item.idPromosi,
        status_aktif: status_aktif,
      }
      let payload = {
				method: "post",
				url: `ecommerce/postPromosi`,
        body: bodyData,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
        this.DialogPromosiProduk = false
        this.getPromosiProduk()
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
    },
		ListProduk(item){
			this.DialogProduk = true
			this.getProduk(item)
		},
		clearForm() {
			this.inputPromosiProduk.UnixText = ''
			this.inputPromosiProduk.id_promosi = ''
			this.inputPromosiProduk.nama_promo = ''
			this.inputPromosiProduk.id_produk = ''
			this.inputPromosiProduk.deskripsi = ''
			this.inputPromosiProduk.gambar = ''
			this.FileGAMBAR
		},
		async uploadFile(e) {
			this.FileGAMBAR = await e.target.files[0];
			this.inputPromosiProduk.gambar = this.FileGAMBAR.name;
			this.loadImage(this.FileGAMBAR)
    },
		loadImage(files) {
      this.DialogCropPromo = true
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
				this.FileGAMBAR = blob
			}, this.image.type);
      this.DialogCropPromo = false
		},
		hapusFile(){
			this.FileGAMBAR = ''
			this.inputPromosiProduk.gambar = '';
		},
		tutupDialogCrop(){
      this.hapusFile()
			this.editedIndex = 3
      this.DialogCropPromo = false
    },
		viewLampiran() {
			this.DialogViewLampiranPromo = true
			const API_URL = process.env.VUE_APP_NODE_ENV === "production" ? process.env.VUE_APP_VIEW_PROD_API_URL : process.env.VUE_APP_VIEW_DEV_API_URL
			const no_image = `${API_URL}No_Image_Available.jpg`
			this.urlView = this.inputPromosiProduk.gambar ? `${API_URL}image/promo/${this.inputPromosiProduk.gambar}` : no_image
			// this.urlView = this.inputPromosiProduk.gambar ? `${API_URL}${this.inputPromosiProduk.gambar}` : no_image
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
img {
	border-style: solid !important;
	border-radius: 10px !important;
	padding: 2px !important;
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