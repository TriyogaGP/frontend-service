<template>
  <div>
		<h1 class="subheading grey--text">Panel Event</h1>
		<v-card class="mt-2 mb-2 pa-1" outlined elevation="0">
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
						clearable
            solo
            color="light-blue darken-3"
            @keyup.enter="getEvent(1, limit, searchData)"
          />
				</v-col>
			</v-row>
			<div class="px-1">
				<v-data-table
					loading-text="Sedang memuat... Harap tunggu"
					no-data-text="Tidak ada data yang tersedia"
					no-results-text="Tidak ada catatan yang cocok ditemukan"
					:headers="headers"
					:loading="isLoading"
					:items="DataEvent"
					:single-expand="singleExpand"
					:expanded.sync="expanded"
					show-expand
					item-key="idEvent"
					hide-default-footer
					class="elevation-1"
					:items-per-page="itemsPerPage"
					@page-count="pageCount = $event"
				>
					<template #[`item.number`]="{ item }">
						{{ DataEvent.indexOf(item) + 1 }}
					</template>
					<template #[`item.tanggalevent`]="{ item }">
						<span v-html="item.startEvent" /> 
					</template>
					<template #[`item.kelipatan_bid`]="{ item }">
						Rp.<span v-html="currencyDotFormat(item.kelipatanBid)" />
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
								:value="item.idEvent"
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
								:value="item.idEvent"
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
								:value="item.idEvent"
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
								:value="item.idEvent"
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
								:value="item.idEvent"
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
			<!-- <v-row>
				<v-col cols="12" class="mt-2 pa-2 px-5">
					<v-pagination
						v-if="DataEvent.length > 0"
						v-model="page"
						:length="pageCount"
						:total-visible="5"
					/>
				</v-col>
			</v-row> -->
			<v-row>
				<v-col cols="10" class="mt-2 d-flex justify-start align-center">
					<span>Halaman <strong>{{ pageSummary.page ? pageSummary.page : 0 }}</strong> dari Total Halaman <strong>{{ pageSummary.totalPages ? pageSummary.totalPages : 0 }}</strong> (Records {{ pageSummary.total ? pageSummary.total : 0 }})</span>
				</v-col>
				<v-col cols="2" class="mt-2 text-right">
					<div class="d-flex justify-end">
						<v-autocomplete
							v-model="limit"
							:items="limitPage"
							item-text="value"
							item-value="value"
							outlined
							dense
							hide-details
							:disabled="DataEvent.length ? false : true"
						/>
						<v-icon
							style="cursor: pointer;"
							large
							:disabled="DataEvent.length ? pageSummary.page != 1 ? false : true : true"
							@click="getEvent(pageSummary.page - 1, limit, searchData)"
						>
							keyboard_arrow_left
						</v-icon>
						<v-icon
							style="cursor: pointer;"
							large
							:disabled="DataEvent.length ? pageSummary.page != pageSummary.totalPages ? false : true : true"
							@click="getEvent(pageSummary.page + 1, limit, searchData)"
						>
							keyboard_arrow_right
						</v-icon>
					</div>
				</v-col>
			</v-row>
		</v-card>
		<v-dialog
      v-model="DialogEvent"
      max-width="800px"
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="light-blue darken-3"
        >
          <v-toolbar-title>{{editedIndex == 0 ? 'Tambah' : editedIndex == 1 ? 'Ubah' : 'View'}} Data Event</v-toolbar-title>
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
									Kode Event
								</v-col>
								<v-col
									cols="12"
									md="8"
									class="pt-3"
								>
									<v-text-field
										v-model="inputEvent.kode_event"
										placeholder="Kode Event"
										outlined
										dense
										label="Kode Event"
										color="light-blue darken-3"
										hide-details
										@keypress.native="onlyNumber($event, 5, inputEvent.kode_event)"
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
                  Nama Event
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-text-field
                    v-model="inputEvent.nama_event"
                    placeholder="Nama Event"
                    outlined
                    dense
                    label="Nama Event"
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
                  Kata Sandi Event
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-text-field
                    v-model="inputEvent.pass_event"
                    placeholder="Kata Sandi Event"
                    :type="passType ? 'text' : 'password'"
                    outlined
                    dense
                    label="Kata Sandi Event"
                    color="light-blue darken-3"
                    hide-details
                    :clearable="editedIndex != 2"
                    :readonly="editedIndex == 2"
                  >
                    <template v-slot:append>
                      <v-icon
                        color="light-blue darken-3"
                        tabindex="-1"
                        @click="onClickVisible('passType')"
                        >{{ passType ? 'visibility' : 'visibility_off' }}</v-icon
                      >
											<v-icon
                        v-if="editedIndex == 2"
                        color="light-blue darken-3"
                        tabindex="-1"
                        @click="endecryptData('endecryptType')"
                        >{{ endecryptType ? 'lock' : 'lock_open' }}</v-icon
                      >
                    </template>
                  </v-text-field>
                </v-col>
              </v-row>
							<v-row no-gutters>
								<v-col
									cols="12"
									md="4"
									class="pt-2 d-flex align-center"
								>
									Kelipatan BID
								</v-col>
								<v-col
									cols="12"
									md="8"
									class="pt-3"
								>
									<vuetify-money
										v-model="inputEvent.kelipatan_bid"
										placeholder="Kelipatan BID"
										outlined
										dense
										label="Kelipatan BID"
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
                  Tanggal Event
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
												v-model="inputEvent.tanggal_event"
												:value="inputEvent.tanggal_event"
												placeholder="Tanggal Event"
												v-bind="attrs"
												v-on="on"
												outlined
												dense
												label="Tanggal Event"
												color="light-blue darken-3"
												hide-details
												:clearable="editedIndex != 2"
												:readonly="editedIndex == 2"
											/>
										</template>
										<v-date-picker v-model="inputEvent.tanggal_event" @input="menu1 = false" />
									</v-menu>
                </v-col>
              </v-row>
							<v-row no-gutters>
                <v-col
                  cols="12"
                  md="4"
                  class="pt-2 d-flex align-center"
                >
                  Waktu Event
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
												v-model="inputEvent.waktu_event"
												:value="inputEvent.waktu_event"
												placeholder="Waktu Event"
												v-bind="attrs"
												v-on="on"
												outlined
												dense
												label="Waktu Event"
												color="light-blue darken-3"
												hide-details
												:clearable="editedIndex != 2"
												:readonly="editedIndex == 2"
											/>
										</template>
										<v-time-picker v-model="inputEvent.waktu_event" @click:second="$refs.menu2.save(inputEvent.waktu_event)" use-seconds />
									</v-menu>
                </v-col>
              </v-row>
							<v-row no-gutters>
                <v-col
                  cols="12"
                  md="4"
                  class="pt-2 d-flex align-center"
                >
                  Deskripsi Event
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-textarea
                    v-model="inputEvent.deskripsi_event"
                    placeholder="Deskripsi Event"
                    outlined
                    dense
                    rows="4"
                    label="Deskripsi Event"
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
                  Alamat Event
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-textarea
                    v-model="inputEvent.alamat_event"
                    placeholder="Alamat Event"
                    outlined
                    dense
                    rows="4"
                    label="Alamat Event"
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
                  Link Maps
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-textarea
                    v-model="inputEvent.link_maps"
                    placeholder="Link Maps"
                    outlined
                    dense
                    rows="4"
                    label="Link Maps"
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
                  Gambar Event
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-text-field
										v-model="inputEvent.fileevent"
										placeholder="Upload"
										outlined
										dense
                  	style="display: none"
									/>
									<input 
										ref="inputEVENTFile"
										:key="componentKey"
										type="file"
										accept="image/x-png,image/jpg,image/jpeg"
										style="display: none"
										@change="uploadFile($event)"
									>
									<v-btn v-if="editedIndex != 2" depressed small color="light-blue darken-3" dark @click="$refs.inputEVENTFile.click()">
										<v-icon small left>{{editedIndex == 0 ? 'add' : 'edit'}}</v-icon> {{editedIndex == 0 ? 'Tambah' : 'Ubah'}} Gambar
									</v-btn>
									<v-btn v-else-if="editedIndex == 2" depressed small color="light-blue darken-3" dark @click="viewLampiran()">
										<v-icon small left>pageview</v-icon> Lihat Gambar
									</v-btn>
									<br>
									<span v-if="this.inputEvent.fileevent != ''">
										<strong>nama file :</strong> <i>{{this.inputEvent.fileevent}}</i> {{editedIndex == 0 ? '('+(this.FileEVENT.size / (1024*1024)).toFixed(2)+' MB)' : ''}}
										<v-icon small v-if="editedIndex != 2" color="red" @click="hapusFile()">delete</v-icon>
									</span>
                </v-col>
              </v-row>
						</v-card-text>
					</div>
					<v-divider />
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
									:loading="btnProses"
									:disabled="kondisiTombol"
									@click="SimpanForm(0, FileEVENT)"
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
									:loading="btnProses"
									:disabled="kondisiTombol"
									@click="SimpanForm(1, FileEVENT)"
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
      v-model="DialogViewLampiranEvent"
      width="600px"
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="light-blue darken-3"
        >
          <v-toolbar-title>View Gambar Event</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <v-btn
              icon
              dark
              @click="DialogViewLampiranEvent = false"
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
      v-model="DialogCropEvent"
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
  name: 'EventLelang',
	components: { PopUpNotifikasiVue, Cropper },
	data: () => ({
		isLoading: false,
		btnProses: false,
		roleID: '',
		DataEvent: [],
		page: 1,
    pageCount: 0,
    itemsPerPage: 100,
    expanded: [],
    singleExpand: true,
		searchData: "",
    limit: 10,
		limitPage: [
			{ value: 5 },
			{ value: 10 },
			{ value: 20 },
			{ value: 50 },
			{ value: 100 },
		],
		pageSummary: {
			page: '',
			limit: '',
			total: '',
			totalPages: ''
		},
		headers: [
      { text: "No", value: "number", sortable: false, width: "7%" },
      { text: "", value: "data-table-expand", sortable: false, width: "5%" },
      { text: "Kode", value: "kodeEvent", sortable: false },
      { text: "Nama", value: "namaEvent", sortable: false },
      { text: "Waktu", value: "tanggalevent", sortable: false },
      { text: "Deskripsi", value: "deskripsiEvent", sortable: false },
      { text: "Kelipatan BID", value: "kelipatan_bid", sortable: false },
      { text: "Status", value: "statusAktif", sortable: false },
    ],
    rowsPerPageItems: { "items-per-page-options": [5, 10, 25, 50] },
    totalItems: 0,
		DialogEvent: false,
		DialogViewLampiranEvent: false,
		DialogCropEvent: false,
		editedIndex: 3,
    kondisiTombol: true,
		inputEvent: {
			UnixText: '',
			id_event: '',
			kode_event: '',
			nama_event: '',
			pass_event: '',
			deskripsi_event: '',
			kelipatan_bid: '',
			tanggal_event: '',
			waktu_event: '',
			alamat_event: '',
			link_maps: '',
			fileevent: '',
		},
		image: {
      src: null,
      type: null,
    },
		optionsUang: {
			locale: "pt-BR",
			prefix: "Rp.",
			suffix: "",
			length: 15,
			precision: 0
		},
		menu1: false,
		menu2: false,
		passType: '',
		endecryptType: '',
		componentKey: 0,
		FileEVENT: '',
		urlView: '',

		//notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
	}),
	metaInfo: {
		title: "Lelang (Event) - WIN.ID",
		htmlAttrs: {
			lang: "id",
			amp: true,
		},
	},
	watch:{
		FileEVENT(){
			if(this.FileEVENT == undefined){
				this.FileEVENT = ''
			}	
		},
		inputEvent: {
			deep: true,
			handler(value){
				if(value.kode_event == null){ this.inputEvent.kode_event = '' }
				if(value.nama_event == null){ this.inputEvent.nama_event = '' }
				if(value.pass_event == null){ this.inputEvent.pass_event = '' }
				if(value.kelipatan_bid == null){ this.inputEvent.kelipatan_bid = '' }
				if(value.deskripsi_event == null){ this.inputEvent.deskripsi_event = '' }
				if(value.tanggal_event == null){ this.inputEvent.tanggal_event = '' }
				if(value.waktu_event == null){ this.inputEvent.waktu_event = '' }
				if(value.alamat_event == null){ this.inputEvent.alamat_event = '' }
				if(value.link_maps == null){ this.inputEvent.link_maps = '' }
				
				if(value.kode_event != '' && value.nama_event != '' && value.pass_event != '' && value.kelipatan_bid != '' && value.deskripsi_event != '' && value.tanggal_event != '' && value.waktu_event != '' && 
				value.alamat_event != '' && value.link_maps != '' && value.fileevent != ''){
					this.kondisiTombol = false
				}else{
					this.kondisiTombol = true	
				}
			}
		},
		limit: {
			deep: true,
			handler(value) {
				this.getEvent(1, value, this.searchData)
			}
		},
    searchData: {
			deep: true,
			handler(value) {
        if (value == null) {
          this.getEvent(1, this.limit, this.searchData)
        }
			}
		}
	},
	updated(){
		if(this.editedIndex == 0){ this.inputEvent.UnixText = `Event${this.convertDate(this.inputEvent.tanggal_event)}${this.makeRandom(8)}` }
	},
	mounted() {
		this.roleID = localStorage.getItem("roleID")
		this.getEvent(1, this.limit, this.searchData)
	},
	methods: {
		...mapActions({
      fetchData: "fetchData",
      uploadFiles: "upload/uploadFiles",
    }),
		getEvent(page = 1, limit, keyword) {
			this.pageSummary = {
				page: '',
				limit: '',
				total: '',
				totalPages: ''
			}
			this.DataEvent = []
			this.isLoading = true
			let payload = {
				method: "get",
				url: `lelang/getEvent?page=${page}&limit=${limit}&sort=DESC${keyword ? `&keyword=${keyword}` : ''}`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				let resdata = res.data.result;
				this.DataEvent = resdata.records;
				this.pageSummary = {
					page: resdata.pageSummary.page,
					limit: resdata.pageSummary.limit,
					total: resdata.pageSummary.total,
					totalPages: resdata.pageSummary.totalPages
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
			this.passType = false
      this.endecryptType = false
			if(index == 0){
				this.clearForm()
      }else{
				this.inputEvent.UnixText = item.UnixText ? item.UnixText : ''
				this.inputEvent.id_event = item.idEvent ? item.idEvent : ''
        this.inputEvent.kode_event = item.kodeevent_split ? item.kodeevent_split : ''
        this.inputEvent.nama_event = item.namaEvent ? item.namaEvent : ''
        this.inputEvent.pass_event = item.kataSandiEvent ? item.kataSandiEvent : ''
        this.inputEvent.kelipatan_bid = item.kelipatanBid ? item.kelipatanBid : ''
        this.inputEvent.tanggal_event = item.tanggalEvent ? item.tanggalEvent : ''
        this.inputEvent.waktu_event = item.waktuEvent ? item.waktuEvent : ''
        this.inputEvent.deskripsi_event = item.deskripsiEvent ? item.deskripsiEvent : ''
        this.inputEvent.alamat_event = item.alamatEvent ? item.alamatEvent : ''
        this.inputEvent.link_maps = item.linkMaps ? item.linkMaps : ''
        this.inputEvent.fileevent = item.gambar ? item.gambar : ''
			}
			this.DialogEvent = true
		},
		tutupDialog() {
      this.clearForm()
			this.editedIndex = 3
      this.DialogEvent = false
    },
		SimpanForm(index, dataUpload) {
			this.btnProses = true
      let bodyData = {
        jenis: index == 0 ? 'ADD' : 'EDIT',
        id_event: index == 0 ? '' : this.inputEvent.id_event,
        UnixText: this.inputEvent.UnixText,
        kode_event: `E-${this.convertDate(this.inputEvent.tanggal_event)}-${this.inputEvent.kode_event}`,
        // kode_event: `E-${this.convertDate(new Date().toISOString().slice(0,10))}-${this.inputEvent.kode_event}`,
				nama_event: this.inputEvent.nama_event,
				pass_event: this.inputEvent.pass_event,
				deskripsi_event: this.inputEvent.deskripsi_event,
				kelipatan_bid: this.inputEvent.kelipatan_bid,
				tanggal_event: this.inputEvent.tanggal_event,
				waktu_event: this.inputEvent.waktu_event,
				alamat_event: this.inputEvent.alamat_event,
				link_maps: this.inputEvent.link_maps,
				gambar: this.inputEvent.fileevent,
        create_update_by: localStorage.getItem('idLogin'),
      }
      let payload = {
				method: "post",
				url: `lelang/postEvent`,
        body: bodyData,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then(async (res) => {
				if(this.FileEVENT){
					let uploadEVENT = await this.uploadLampiran(index, dataUpload)
					if(uploadEVENT.data.status == 200){
						this.notifikasi("success", res.data.message, "1")
					}else{
						this.notifikasi("error", 'Gagal proses data', "1")
					}
				}else{
					this.notifikasi("success", res.data.message, "1")
				}
				// this.notifikasi("success", res.data.message, "1")
				this.clearForm()
        this.DialogEvent = false
        this.btnProses = false
        this.getEvent(1, this.limit, this.searchData)
			})
			.catch((err) => {
				this.btnProses = false
				this.notifikasi("error", err.response.data.message, "1")
			});
    },
		async uploadLampiran(index, dataUpload) {
			if(dataUpload){
				const bodyData = {
					proses: index == 0 ? 'ADD' : 'EDIT',
					id: index == 0 ? null : this.inputEvent.id_event,
					kode_event: `E-${this.convertDate(this.inputEvent.tanggal_event)}-${this.inputEvent.kode_event}`,
					nama_event: this.inputEvent.nama_event,
					nama_folder: this.inputEvent.UnixText,
					nama_file: `Event-${this.convertDate(this.inputEvent.tanggal_event)}${this.makeRandom(8)}`,
					jenis: "images",
					bagian: "event",
					table: "t_event",
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
        id_event: item.idEvent,
        kode_event: item.kodeEvent,
        nama_event: item.namaEvent,
        delete_by: localStorage.getItem('idLogin'),
      }
      let payload = {
				method: "post",
				url: `lelang/postEvent`,
        body: bodyData,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
        this.DialogEvent = false
        this.getEvent(1, this.limit, this.searchData)
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
    },
    StatusRecord(item, status_aktif) {
      let bodyData = {
        jenis: 'STATUSRECORD',
        id_event: item.idEvent,
        kode_event: item.kodeEvent,
        nama_event: item.namaEvent,
        status_aktif: status_aktif,
      }
      let payload = {
				method: "post",
				url: `lelang/postEvent`,
        body: bodyData,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
        this.DialogEvent = false
        this.getEvent(1, this.limit, this.searchData)
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
    },
		clearForm() {
			this.inputEvent.UnixText = ''
			this.inputEvent.id_event = ''
			this.inputEvent.kode_event = ''
			this.inputEvent.nama_event = ''
			this.inputEvent.pass_event = ''
			this.inputEvent.deskripsi_event = ''
			this.inputEvent.kelipatan_bid = ''
			this.inputEvent.tanggal_event = ''
			this.inputEvent.waktu_event = ''
			this.inputEvent.alamat_event = ''
			this.inputEvent.link_maps = ''
			this.inputEvent.fileevent = ''
			this.FileEVENT = ''
		},
		async uploadFile(e) {
			this.FileEVENT = await e.target.files[0];
			this.inputEvent.fileevent = this.FileEVENT.name;
			this.loadImage(this.FileEVENT)
    },
		loadImage(files) {
      this.DialogCropEvent = true
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
				this.FileEVENT = blob
			}, this.image.type);
      this.DialogCropEvent = false
		},
		hapusFile(){
			this.FileEVENT = ''
			this.inputEvent.fileevent = '';
			this.$refs.inputEVENTFile.value = null
		},
		tutupDialogCrop(){
      this.hapusFile()
			this.editedIndex = 3
      this.DialogCropEvent = false
    },
		viewLampiran() {
			this.DialogViewLampiranEvent = true
			const API_URL = process.env.VUE_APP_NODE_ENV === "production" ? process.env.VUE_APP_VIEW_PROD_API_URL : process.env.VUE_APP_VIEW_DEV_API_URL
			const no_image = `${API_URL}No_Image_Available.jpg`
			this.urlView = this.inputEvent.fileevent ? `${API_URL}image/event/${this.inputEvent.fileevent}` : no_image
			// this.urlView = this.inputEvent.fileevent ? `${API_URL}${this.inputEvent.fileevent}` : no_image
		},
		onClickVisible(d) {
      this[d] = !this[d]
    },
		endecryptData(d) {
      this[d] = !this[d]
      let url = this[d] ? 'decryptPass' : 'encryptPass' 
      let payload = {
				method: "get",
				url: `settings/${url}?kata=${this.inputEvent.pass_event}`,
				authToken: localStorage.getItem('user_token')
			};
      this.inputEvent.pass_event = ''
			this.fetchData(payload)
			.then((res) => {
				this.inputEvent.pass_event = res.data.result.hasil;
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
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
</style>