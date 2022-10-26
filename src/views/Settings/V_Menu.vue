<template>
  <div>
		<h1 class="subheading grey--text">Panel Menu</h1>
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
				:items="DataMenu"
				:single-expand="singleExpand"
				:expanded.sync="expanded"
				show-expand
				item-key="idMenu"
				hide-default-footer
				class="elevation-1"
				:page.sync="page"
				:items-per-page="itemsPerPage"
				@page-count="pageCount = $event"
			>
				<template #[`item.number`]="{ item }">
					{{ DataMenu.indexOf(item) + 1 }}
				</template>
				<template #[`item.menuIcon`]="{ item }">
					<v-icon>{{item.menuIcon}}</v-icon> 
				</template>
				<template #[`item.menuRouter`]="{ item }">
					<span v-html="item.menuRouter" /> 
				</template>
				<template #[`item.status`]="{ item }">
					<v-icon small v-if="item.status == true" color="green">check</v-icon>
					<v-icon small v-else-if="item.status == false" color="red">clear</v-icon>
					<br>
					<span v-html="item.status == true ? 'Active' : 'Non Active'" />  
				</template>
				<template #expanded-item="{ headers, item }">
					<td :colspan="headers.length" class="white">
						<v-btn
							:value="item.idMenu"
							color="#0bd369"
							small
							dense
							class="ma-2 white--text text--darken-2"
							:disabled="item.status == 0"
							@click="bukaDialog(item, 1)"
						>
						<v-icon>edit</v-icon>	Ubah
						</v-btn> 
						<v-btn
							v-if="item.status == 0"
							:value="item.idMenu"
							color="#0bd369"
							small
							dense
							class="ma-2 white--text text--darken-2"
							@click="StatusRecord(item, 1)"
						>
						<v-icon>visibility</v-icon>	Active
						</v-btn> 
						<v-btn
							v-else-if="item.status == 1"
							:value="item.idMenu"
							color="#0bd369"
							small
							dense
							class="ma-2 white--text text--darken-2"
							@click="StatusRecord(item, 0)"
						>
						<v-icon>visibility_off</v-icon>	Non Active
						</v-btn> 
						<v-btn
							:value="item.idMenu"
							color="#bd3a07"
							small
							dense
							class="ma-2 white--text text--darken-2"
							:disabled="item.status == 0"
							@click="HapusRecord(item)"
						>
						<v-icon>delete</v-icon>	Hapus
						</v-btn> 
						<v-divider />
					</td>
				</template>
			</v-data-table>
		</div>
		<v-row>
			<v-col cols="12" class="mt-2 pa-2 px-5">
				<v-pagination
					v-if="DataMenu.length > 0"
					v-model="page"
					:length="pageCount"
					:total-visible="10"
				/>
			</v-col>
		</v-row>
		<v-dialog
      v-model="DialogMenu"
      max-width="800px"
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="light-blue darken-3"
        >
          <v-toolbar-title>{{editedIndex == 0 ? 'Tambah' : 'Ubah'}} Data Menu</v-toolbar-title>
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
								Role ID
							</v-col>
							<v-col
								cols="12"
								md="8"
								class="pt-3"
							>
								<v-autocomplete
									v-model="inputMenu.id_role"
									:items="DataHakAkses"
									item-text="namaRole"
									item-value="idRole"
									placeholder="Role ID"
									label="Role ID"
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
								Menu Label
							</v-col>
							<v-col
								cols="12"
								md="8"
								class="pt-3"
							>
								<v-text-field
									v-model="inputMenu.menu_text"
									placeholder="Menu Label"
									outlined
									dense
									label="Menu Label"
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
								Menu Routing
							</v-col>
							<v-col
								cols="12"
								md="8"
								class="pt-3"
							>
								<v-text-field
									v-model="inputMenu.menu_route"
									placeholder="Menu Routing"
									outlined
									dense
									label="Menu Routing"
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
								Menu Icon
							</v-col>
							<v-col
								cols="12"
								md="8"
								class="pt-3"
							>
								<v-text-field
									v-model="inputMenu.menu_icon"
									placeholder="Menu Icon"
									outlined
									dense
									label="Menu Icon"
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
								Position Menu
							</v-col>
							<v-col
								cols="12"
								md="8"
								class="pt-3"
							>
								<v-text-field
									v-model="inputMenu.position"
									placeholder="Position Menu"
									outlined
									dense
									label="Position Menu"
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
import PopUpNotifikasiVue from "../Layout/PopUpNotifikasi.vue";
export default {
  name: 'HakAkses',
	components: { PopUpNotifikasiVue },
  data: () => ({
    isLoading: false,
		DataMenu: [],
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
      { text: "Role", value: "namaRole", sortable: false },
      { text: "Title Text", value: "menuText", sortable: false },
      { text: "Icon", value: "menuIcon", sortable: false },
      { text: "Route", value: "menuRoute", sortable: false },
      { text: "Position", value: "position", sortable: false },
      { text: "Status", value: "status", sortable: false },
    ],
    rowsPerPageItems: { "items-per-page-options": [5, 10, 25, 50] },
    totalItems: 0,
		DataHakAkses: [],
		DialogMenu: false,
		editedIndex: 0,
    kondisiTombol: true,
		inputMenu: {
			id_menu: '',
			id_role: '',
			menu_text: '',
			menu_route: '',
			menu_icon: '',
			position: '',
		},

		//notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
  }),
  metaInfo: {
		title: "Settings (Menu) - WIN.ID",
		htmlAttrs: {
			lang: "id",
			amp: true,
		},
	},
	watch:{
		inputMenu: {
			deep: true,
			handler(value){
				if(value.id_role == null){ this.inputMenu.id_role = '' }
				if(value.menu_text == null){ this.inputMenu.menu_text = '' }
				if(value.menu_route == null){ this.inputMenu.menu_route = '' }
				if(value.menu_icon == null){ this.inputMenu.menu_icon = '' }
				if(value.position == null){ this.inputMenu.position = '' }

				if(value.id_role != '' && value.menu_text != '' && value.menu_route != '' && value.menu_icon != '' && value.position != ''){
					this.kondisiTombol = false
				}else{
					this.kondisiTombol = true	
				}
			}
		}
	},
	mounted() {
		this.getMenu();
	},
	methods: {
		...mapActions(["fetchData"]),
		getMenu() {
			this.isLoading = true
			let payload = {
				method: "get",
				url: `settings/getMenu`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				this.DataMenu = res.data.result;
				this.isLoading = false
			})
			.catch((err) => {
				this.isLoading = false
				this.notifikasi("error", err.response.data.message, "1")
			});
		},
		getHakAkses() {
			this.isLoading = true
			let payload = {
				method: "get",
				url: `settings/getRole`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				this.DataHakAkses = res.data.result;
				this.isLoading = false
			})
			.catch((err) => {
				this.isLoading = false
				this.notifikasi("error", err.response.data.message, "1")
			});
		},
		bukaDialog(item, index){
			this.editedIndex = index
			this.getHakAkses()
			if(index == 0){
				this.clearForm()
      }else{
				this.inputMenu.id_menu = item.idMenu
				this.inputMenu.id_role = item.idRole
        this.inputMenu.menu_text = item.menuText
        this.inputMenu.menu_route = item.menuRoute
        this.inputMenu.menu_icon = item.menuIcon
        this.inputMenu.position = item.position
			}
			this.DialogMenu = true
		},
		tutupDialog() {
      this.clearForm()
      this.DialogMenu = false
    },
		SimpanForm(index) {
      let bodyData = {
        jenis: index == 0 ? 'ADD' : 'EDIT',
        id_menu: index == 0 ? '' : this.inputMenu.id_menu,
        id_role: this.inputMenu.id_role,
        nama_text: this.inputMenu.nama_text,
        nama_route: this.inputMenu.nama_route,
        nama_icon: this.inputMenu.nama_icon,
        position: this.inputMenu.position,
      }
      let payload = {
				method: "post",
				url: `settings/postMenu`,
        body: bodyData,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
        this.DialogMenu = false
        this.getMenu()
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
    },
    HapusRecord(item) {
      let bodyData = {
        jenis: 'DELETE',
        id_menu: item.idMenu,
      }
      let payload = {
				method: "post",
				url: `settings/postMenu`,
        body: bodyData,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
        this.DialogMenu = false
        this.getMenu()
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
    },
    StatusRecord(item, status) {
      let bodyData = {
        jenis: 'STATUSRECORD',
        id_menu: item.idMenu,
        status: status,
      }
      let payload = {
				method: "post",
				url: `settings/postMenu`,
        body: bodyData,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
        this.DialogMenu = false
        this.getMenu()
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
    },
		clearForm() {
			this.inputMenu.id_menu = ''
			this.inputMenu.id_role = ''
			this.inputMenu.menu_text = ''
			this.inputMenu.menu_route = ''
			this.inputMenu.menu_icon = ''
			this.inputMenu.position = ''
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
</style>