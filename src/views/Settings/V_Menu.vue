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
				<v-btn
					color="light-blue darken-3"
					small
					dense
					depressed
					class="ma-2 white--text text--darken-2"
					@click.stop="openDialog()"
				>
					<v-icon small>settings</v-icon>	Set Urutan Menu
				</v-btn>
			</v-col>
			<v-col cols="12" md="6">
				<v-row no-gutters>
					<v-col cols="12" md="9">
						<v-text-field
						v-model="searchData"
						append-icon="mdi-magnify"
						label="Pencarian..."
							single-line
							hide-details
							clearable
							solo
							color="light-blue darken-3"
							@keyup.enter="getMenu(1, limit, searchData)"
						/>
					</v-col>
					<v-col cols="12" md="3" class="pl-2 d-flex justify-end align-center">
						<v-autocomplete
							v-model="page"
							:items="pageOptions"
							item-text="value"
							item-value="value"
							label="Page"
							outlined
							dense
							hide-details
							:disabled="DataMenu.length ? false : true"
						/>
					</v-col>
				</v-row>
			</v-col>
    </v-row>
    <div class="px-1">
			<v-data-table
				loading-text="Sedang memuat... Harap tunggu"
				no-data-text="Tidak ada data yang tersedia"
				no-results-text="Tidak ada catatan yang cocok ditemukan"
				:headers="headers"
				:loading="isLoading"
				:items="DataMenu"
				:single-expand="singleExpand"
				:expanded.sync="expanded"
				show-expand
				:sort-by="sortBy"
				:sort-desc="sortDesc"
				multi-sort
				item-key="idMenu"
				hide-default-footer
				class="elevation-1"
				:header-props="{
					'sort-icon': 'mdi-navigation'
				}"
				:items-per-page="itemsPerPage"
				@page-count="pageCount = $event"
				@update:sort-by="updateSort('by', $event)"
				@update:sort-desc="updateSort('desc', $event)"
			>
				<!-- <template #[`item.number`]="{ item }">
					{{ DataMenu.indexOf(item) + 1 }}
				</template> -->
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
		<!-- <v-row>
			<v-col cols="12" class="mt-2 pa-2 px-5">
				<v-pagination
					v-if="DataMenu.length > 0"
					v-model="page"
					:length="pageCount"
					:total-visible="10"
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
						:disabled="DataMenu.length ? false : true"
					/>
					<v-icon
						style="cursor: pointer;"
						large
						:disabled="DataMenu.length ? pageSummary.page != 1 ? false : true : true"
						@click="() => { page = pageSummary.page - 1 }"
					>
						keyboard_arrow_left
					</v-icon>
					<v-icon
						style="cursor: pointer;"
						large
						:disabled="DataMenu.length ? pageSummary.page != pageSummary.totalPages ? false : true : true"
						@click="() => { page = pageSummary.page + 1 }"
					>
						keyboard_arrow_right
					</v-icon>
				</div>
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
      v-model="DialogSet"
      max-width="1000px"
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="light-blue darken-3"
        >
          <v-toolbar-title>Set Urutan Menu</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <v-btn
              icon
              dark
              @click="() => { DialogSet = false;  }"
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
              <v-tabs
							 	v-model="tab"
								fixed-tabs
								background-color="light-blue darken-3"
								dark
							>
								<v-tab v-for="v in menuSequence" :key="v.namaRole">
									{{ v.namaRole }}
								</v-tab>
							</v-tabs>
							<v-tabs-items v-model="tab">
								<v-tab-item v-for="v in menuSequence" :key="v.namaRole">
									<v-card class="pa-1" elevation="0">
                    <v-container>
                      <v-flex>
                        <v-toolbar color="light-blue darken-3" dark>
                          <v-toolbar-title>Menu {{ v.namaRole }}</v-toolbar-title>
                          <v-spacer></v-spacer>
                          <v-btn icon @click="actionEditing('edit', v.idRole)" v-if="!editing">
                            <v-icon>sort</v-icon>
                          </v-btn>
                          <v-btn icon @click="actionEditing('done', v.idRole)" v-if="editing">
                            <v-icon>done</v-icon>
                          </v-btn>
                          <v-btn icon @click="actionEditing('undo', v.idRole)" v-if="editing">
                            <v-icon>close</v-icon>
                          </v-btn>
                        </v-toolbar>
                        <v-list two-line>
                          <draggable v-bind="options" v-model="v.dataMenu" class="kotakDrag">
                            <v-list-item v-for="str in v.dataMenu" :key="str.idMenu" class="kotak">
                              <v-list-item-avatar color="white">
                                <v-icon small>{{ str.menuIcon }}</v-icon>
                              </v-list-item-avatar>
                              <v-list-item-content>
                                <v-list-item-title v-html="str.menuText"></v-list-item-title>
                                <v-list-item-subtitle style="color: white !important;" v-html="str.menuRoute"></v-list-item-subtitle>
                              </v-list-item-content>
															<v-icon small v-if="str.status == true" color="green">check</v-icon>
															<v-icon small v-else-if="str.status == false" color="red">clear</v-icon>
															&nbsp;
															<span v-html="str.status == true ? 'Active' : 'Non Active'" />
                            </v-list-item>
                          </draggable>
                        </v-list>
                      </v-flex>
                    </v-container>
                  </v-card>
                </v-tab-item>
              </v-tabs-items>
            </v-card-text>
          </div>
          <v-divider />
          <v-card-actions class="pa-5"/>
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
import draggable from "vuedraggable";
export default {
  name: 'HakAkses',
	components: { PopUpNotifikasiVue, draggable },
  data: () => ({
		tab: "",
    isLoading: false,
		DataMenu: [],
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
    pageOptions: [
      { value: 1 }
    ],
		pageSummary: {
			page: '',
			limit: '',
			total: '',
			totalPages: ''
		},
		headers: [
      // { text: "No", value: "number", sortable: false, width: "7%" },
      { text: "#", value: "data-table-expand", sortable: false, width: "5%" },
      { text: "Role", value: "namaRole", sortable: true },
      { text: "Title Text", value: "menuText", sortable: true },
      { text: "Icon", value: "menuIcon", sortable: false },
      { text: "Route", value: "menuRoute", sortable: false },
      { text: "Position", value: "position", sortable: true },
      { text: "Status", value: "status", sortable: true },
    ],
    rowsPerPageItems: { "items-per-page-options": [5, 10, 25, 50] },
    totalItems: 0,
		sortBy: [],
    sortDesc: [],
    kumpulSort: '',
		before: null,
		editing: false,
		menuSequence: [],
		DataHakAkses: [],
		DialogMenu: false,
		DialogSet: false,
		editedIndex: 0,
    kondisiTombol: true,
		inputMenu: {
			id_menu: '',
			id_role: '',
			menu_text: '',
			menu_route: '',
			menu_icon: '',
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
	computed: {
		options () {
			return {
				disabled: !this.editing
			}
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

				if(value.id_role != '' && value.menu_text != '' && value.menu_route != '' && value.menu_icon != ''){
					this.kondisiTombol = false
				}else{
					this.kondisiTombol = true	
				}
			}
		},
		page: {
			deep: true,
			handler(value) {
				this.getMenu(value, this.limit, this.searchData)
			}
		},
    limit: {
			deep: true,
			handler(value) {
				this.getMenu(1, value, this.searchData)
			}
		},
    searchData: {
			deep: true,
			handler(value) {
        if (value == null) {
          this.getMenu(1, this.limit, this.searchData)
        }
			}
		},
    sortDesc: {
			deep: true,
			handler(value) {
        this.getMenu(1, this.limit, this.searchData)
			}
		},
	},
	mounted() {
		this.getMenu(1, this.limit, this.searchData);
	},
	methods: {
		...mapActions(["fetchData"]),
		getMenu(page = 1, limit, keyword) {
      this.itemsPerPage = limit
      this.page = page
      this.pageSummary = {
				page: '',
				limit: '',
				total: '',
				totalPages: ''
			}
			this.DataMenu = []
			this.pageOptions = [{ value: 1 }]
			this.isLoading = true
			let payload = {
				method: "get",
				url: `settings/getMenu?page=${page}&limit=${limit}${keyword ? `&keyword=${keyword}` : ''}&sort=${this.kumpulSort}`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				let resdata = res.data.result;
        this.DataMenu = resdata.records
        this.pageSummary = {
					page: resdata.pageSummary.page,
					limit: resdata.pageSummary.limit,
					total: resdata.pageSummary.total,
					totalPages: resdata.pageSummary.totalPages
				}
        for (let index = 1; index <= this.pageSummary.totalPages; index++) {
          this.pageOptions.push({ value: index })
        }
				this.isLoading = false
			})
			.catch((err) => {
				this.itemsPerPage = limit
				this.page = page
				this.pageSummary = {
					page: '',
					limit: '',
					total: '',
					totalPages: ''
				}
				this.DataMenu = []
				this.pageOptions = [{ value: 1 }]
				this.isLoading = false
				this.notifikasi("error", err.response.data.message, "1")
			});
		},
		getHakAkses() {
			this.isLoading = true
			let payload = {
				method: "get",
				url: `settings/optionRole`,
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
		getMenuSequence(tab = 0) {
			this.menuSequence = []
			this.isLoading = true
			let payload = {
				method: "get",
				url: `settings/getMenuSequence`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				this.tab = tab
				this.menuSequence = res.data.result;
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
			}
			this.DialogMenu = true
		},
		tutupDialog() {
      this.clearForm()
      this.DialogMenu = false
    },
		openDialog(){
			this.getMenuSequence()
			this.DialogSet = true
		},
		actionEditing (e, idRole) {
			let dataKumpul = this.menuSequence.filter(str => str.idRole === idRole)[0].dataMenu
      if (e === 'edit') {
        this.before = Object.assign([],dataKumpul)
				console.log('edit')
      }      
      if (e === 'undo') {
				this.tab = idRole - 1
        this.before = null
        this.getMenuSequence(this.tab)
				console.log('undo')
      }
      if (e === 'done') {
				this.SimpanSequenceMenu(dataKumpul, idRole)
        this.before = null
				console.log('done')
      }
			console.log('BEFORE', this.before);
			console.log('TAB', this.tab);
      this.editing = !this.editing
    },
		SimpanSequenceMenu(dataKumpul, idRole) {
			console.log(dataKumpul, idRole)
      let payload = {
				method: "post",
				url: `settings/postSequenceMenu`,
        body: {
          Menu : dataKumpul
        },
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				this.getMenu(1, this.limit, this.searchData);
        this.tab = idRole - 1
				this.getMenuSequence(this.tab)
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
    },
		SimpanForm(index) {
      let bodyData = {
        jenis: index == 0 ? 'ADD' : 'EDIT',
        id_menu: index == 0 ? '' : this.inputMenu.id_menu,
        id_role: this.inputMenu.id_role,
        menu_text: this.inputMenu.menu_text,
        menu_route: this.inputMenu.menu_route,
        menu_icon: this.inputMenu.menu_icon,
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
        this.getMenu(1, this.limit, this.searchData)
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
        this.getMenu(1, this.limit, this.searchData)
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
        this.getMenu(1, this.limit, this.searchData)
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
		},
		updateSort(kondisi, data){
      if(kondisi === 'by'){
        this.sortBy = data
      }else if(kondisi === 'desc'){
        this.sortDesc = data
      }
      this.kumpulSort = this.sortBy.map((val, i) => {
        return `${val}-${this.sortDesc[i] === false ? 'ASC' : 'DESC'}`
      }).join(',')
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
.v-data-table-header__icon {
  opacity: 10;
}
.kotak {
	border: 2px dashed #000;
	border-radius: 10px;
	text-align: justify;
	background: rgb(98, 97, 97);
	color: rgb(255, 255, 255) !important;
	margin: 2px;
  /* padding: 2px; */
  font-size: 12pt;
}
.kotakDrag {
	border: 2px solid #000;
	border-radius: 10px;
	background: #FFF;
	margin: 2px;
  font-size: 12pt;
}
</style>