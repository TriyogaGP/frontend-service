<template>
  <div>
		<v-card :class="roleID == 2 && 'mt-2 mb-2 pa-1'" :outlined="roleID == 2" elevation="0">
			<h1 class="subheading grey--text">Panel Fasilitas Mall</h1>
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
					:items="DataFasilitasMall"
					:single-expand="singleExpand"
					:expanded.sync="expanded"
					show-expand
					item-key="idFasilitasMall"
					hide-default-footer
					class="elevation-1"
					:page.sync="page"
					:items-per-page="itemsPerPage"
					@page-count="pageCount = $event"
				>
					<template #[`item.number`]="{ item }">
						{{ DataFasilitasMall.indexOf(item) + 1 }}
					</template>
					<template #[`item.statusAktif`]="{ item }">
						<v-icon small v-if="item.statusAktif == true" color="green">check</v-icon>
						<v-icon small v-else-if="item.statusAktif == false" color="red">clear</v-icon>
						<br>
						<span v-html="item.statusAktif == true ? 'Active' : 'Non Active'" /> 
					</template>
					<template #[`item.mall`]="{ item }">
						<span v-html="item.namaMall" /> 
					</template>
					<template #expanded-item="{ headers, item }">
						<td :colspan="headers.length" class="white">
							<v-btn
								:value="item.idFasilitasMall"
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
								:value="item.idFasilitasMall"
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
								:value="item.idFasilitasMall"
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
								:value="item.idFasilitasMall"
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
							<v-divider />
						</td>
					</template>
				</v-data-table>
			</div>
			<v-row>
				<v-col cols="12" class="mt-2 pa-2 px-5">
					<v-pagination
						v-if="DataFasilitasMall.length > 0"
						v-model="page"
						:length="pageCount"
						:total-visible="10"
					/>
				</v-col>
			</v-row>
		</v-card>
		<v-dialog
      v-model="DialogFasilitasMall"
      max-width="800px"
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="light-blue darken-3"
        >
          <v-toolbar-title>{{editedIndex == 0 ? 'Tambah' : 'Ubah'}} Data Fasilitas Mall</v-toolbar-title>
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
								Mall
							</v-col>
							<v-col
								cols="12"
								md="8"
								class="pt-3"
							>
								<v-autocomplete
									v-model="inputFasilitasMall.id_mall"
									:items="MallOptions"
									item-text="namaMall"
									item-value="idMall"
									placeholder="Mall"
									label="Mall"
									outlined
									dense
									hide-details
									:clearable="editedIndex != 2"
									:readonly="editedIndex == 2"
								>
									<template v-slot:selection="{ item }">
										{{item.namaMall}} {{roleID == 1 ? ' | '+item.nama : ''}} 
									</template>
									<template v-slot:item="{ item }">
										{{item.namaMall}} {{roleID == 1 ? ' | '+item.nama : ''}}
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
								Fasilitas Mall
							</v-col>
							<v-col
								cols="12"
								md="8"
								class="pt-3"
							>
								<v-text-field
									v-model="inputFasilitasMall.fasilitas_mall"
									placeholder="Fasilitas Mall"
									outlined
									dense
									label="Fasilitas Mall"
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
  name: 'FasilitasMall',
	components: { PopUpNotifikasiVue },
	data: () => ({
		isLoading: false,
		idLogin: '',
		roleID: '',
		DataFasilitasMall: [],
		MallOptions: [],
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
      { text: "Kategori", value: "fasilitasMall", sortable: false },
      { text: "Status", value: "statusAktif", sortable: false },
    ],
    rowsPerPageItems: { "items-per-page-options": [5, 10, 25, 50] },
    totalItems: 0,
		DialogFasilitasMall: false,
		editedIndex: 0,
    kondisiTombol: true,
		inputFasilitasMall: {
			id_fasilitas_mall: '',
			id_mall: '',
			fasilitas_mall: '',
		},

		//notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
	}),
	metaInfo: {
		title: "E-Mall (Fasilitas Mall) - WIN.ID",
		htmlAttrs: {
			lang: "id",
			amp: true,
		},
	},
	watch:{
		inputFasilitasMall: {
			deep: true,
			handler(value){
				if(value.id_mall == null){ this.inputFasilitasMall.id_mall = '' }
				if(value.fasilitas_mall == null){ this.inputFasilitasMall.fasilitas_mall = '' }

				if(value.id_mall != '' && value.fasilitas_mall != ''){
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
		this.getFasilitasMall()
	},
	methods: {
		...mapActions(["fetchData"]),
		getFasilitasMall() {
			this.isLoading = true
			let payload = {
				method: "get",
				url: `emall/getFasilitasMall`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				let dataFasilitasMall = res.data.result;
				if(this.roleID == 1) {
					this.DataFasilitasMall = dataFasilitasMall
				}else{
					this.DataFasilitasMall = dataFasilitasMall.filter(val => val.idAdmin == this.idLogin)
				}
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
				url: `emall/getMall${link}`,
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
		bukaDialog(item, index){
			this.editedIndex = index
			this.getMall()
			if(index == 0){
				this.roleID = localStorage.getItem('roleID')
				this.clearForm()
      }else{
				this.inputFasilitasMall.id_fasilitas_mall = item.idFasilitasMall
				this.inputFasilitasMall.id_mall = item.idMall
        this.inputFasilitasMall.fasilitas_mall = item.fasilitasMall
			}
			this.DialogFasilitasMall = true
		},
		tutupDialog() {
      this.clearForm()
      this.DialogFasilitasMall = false
    },
		SimpanForm(index) {
      let bodyData = {
        jenis: index == 0 ? 'ADD' : 'EDIT',
        id_fasilitas_mall: index == 0 ? '' : this.inputFasilitasMall.id_fasilitas_mall,
        id_mall: this.inputFasilitasMall.id_mall,
        fasilitas_mall: this.inputFasilitasMall.fasilitas_mall,
        create_update_by: localStorage.getItem('idLogin'),
      }
      let payload = {
				method: "post",
				url: `emall/postFasilitasMall`,
        body: bodyData,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
        this.DialogFasilitasMall = false
        this.getFasilitasMall()
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
    },
    HapusRecord(item) {
      let bodyData = {
        jenis: 'DELETE',
        id_fasilitas_mall: item.idFasilitasMall,
        fasilitas_mall: item.fasilitasMall,
        delete_by: localStorage.getItem('idLogin'),
      }
      let payload = {
				method: "post",
				url: `emall/postFasilitasMall`,
        body: bodyData,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
        this.DialogFasilitasMall = false
        this.getFasilitasMall()
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
    },
    StatusRecord(item, status_aktif) {
      let bodyData = {
        jenis: 'STATUSRECORD',
        id_fasilitas_mall: item.idFasilitasMall,
        fasilitas_mall: item.fasilitasMall,
        status_aktif: status_aktif,
      }
      let payload = {
				method: "post",
				url: `emall/postFasilitasMall`,
        body: bodyData,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
        this.DialogFasilitasMall = false
        this.getFasilitasMall()
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
    },
		clearForm() {
			this.inputFasilitasMall.id_fasilitas_mall = ''
			this.inputFasilitasMall.id_mall = ''
			this.inputFasilitasMall.fasilitas_mall = ''
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
.v-list-item--dense, .v-list--dense .v-list-item {
	font-size: 0.8125rem !important;
	font-weight: 500 !important;
	line-height: 1rem !important;
}
</style>