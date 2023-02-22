<template>
  <div>
    <h1 class="subheading grey--text">Data {{roleID == 1 ? 'Admin' : 'Admin Tenant Mall'}}</h1>
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
                @keyup.enter="getAdministrator(1, limit, searchData)"
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
                :disabled="DataAdmin.length ? false : true"
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
          :items="DataAdmin"
          :single-expand="singleExpand"
          :expanded.sync="expanded"
          show-expand
          :sort-by="sortBy"
          :sort-desc="sortDesc"
          item-key="idAdmin"
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
            {{ DataAdmin.indexOf(item) + 1 }}
          </template> -->
          <template #[`item.namaRole`]="{ item }">
            <span v-html="item.namaRole" /> 
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
                :value="item.idAdmin"
                color="#0bd369"
                small
                dense
                depressed
                class="ma-2 white--text text--darken-2"
                :disabled="item.idAdmin == idLog || item.statusAktif == false"
                @click="bukaDialog(item, 1)"
              >
                <v-icon small>edit</v-icon>	Ubah
              </v-btn> 
              <v-btn
                v-if="item.statusAktif == false"
                :value="item.idAdmin"
                color="#0bd369"
                small
                dense
                depressed
                class="ma-2 white--text text--darken-2"
                :disabled="item.idAdmin == idLog"
                @click="StatusRecord(item, 1)"
              >
                <v-icon small>visibility</v-icon>	Active
              </v-btn> 
              <v-btn
                v-else-if="item.statusAktif == true"
                :value="item.idAdmin"
                color="#0bd369"
                small
                dense
                depressed
                class="ma-2 white--text text--darken-2"
                :disabled="item.idAdmin == idLog"
                @click="StatusRecord(item, 0)"
              >
                <v-icon small>visibility_off</v-icon>	Non Active
              </v-btn> 
              <v-btn
                :value="item.idAdmin"
                color="#bd3a07"
                small
                dense
                depressed
                class="ma-2 white--text text--darken-2"
                :disabled="item.idAdmin == idLog || item.statusAktif == false"
                @click="HapusRecord(item)"
              >
                <v-icon small>delete</v-icon>	Hapus
              </v-btn> 
              <v-btn
                :value="item.idAdmin"
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
            v-if="DataAdmin.length > 0"
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
							:disabled="DataAdmin.length ? false : true"
						/>
						<v-icon
							style="cursor: pointer;"
							large
							:disabled="DataAdmin.length ? pageSummary.page != 1 ? false : true : true"
							@click="() => { page = pageSummary.page - 1 }"
						>
							keyboard_arrow_left
						</v-icon>
						<v-icon
							style="cursor: pointer;"
							large
							:disabled="DataAdmin.length ? pageSummary.page != pageSummary.totalPages ? false : true : true"
							@click="() => { page = pageSummary.page + 1 }"
						>
							keyboard_arrow_right
						</v-icon>
					</div>
				</v-col>
			</v-row>
    </v-card>
    <v-dialog
      v-model="DialogAdmin"
      max-width="800px"
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="light-blue darken-3"
        >
          <v-toolbar-title>{{editedIndex == 0 ? 'Tambah' : editedIndex == 1 ? 'Ubah' : 'View'}} Data Admin</v-toolbar-title>
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
                  Nama Lengkap
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-text-field
                    v-model="inputDataAdmin.nama_lengkap"
                    placeholder="Nama Lengkap"
                    outlined
                    dense
                    label="Nama Lengkap"
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
                  Level Role
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-autocomplete
                    v-model="inputDataAdmin.level"
                    :items="levelOptions"
                    item-text="namaRole"
                    item-value="idRole"
                    placeholder="Level Role"
                    label="Level Role"
                    outlined
                    dense
                    hide-details
                    :clearable="editedIndex != 2"
                    :readonly="editedIndex == 2"
                  />
                </v-col>
              </v-row>
              <v-row v-if="inputDataAdmin.level == 3 && roleID == 1" no-gutters>
								<v-col
									cols="12"
									md="4"
									class="pt-2 d-flex align-center"
								>
									Downline Admin Mall
								</v-col>
								<v-col
									cols="12"
									md="8"
									class="pt-3"
								>
									<v-autocomplete
										v-model="inputDataAdmin.downline_tenant"
										:items="AdminOptions"
										item-text="nama"
										item-value="idAdmin"
										placeholder="Downline Admin Mall"
										label="Downline Admin Mall"
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
                  Username
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-text-field
                    v-model="inputDataAdmin.username"
                    placeholder="Username"
                    outlined
                    dense
                    label="Username"
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
                  Email
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-text-field
                    v-model="inputDataAdmin.email"
                    placeholder="Email"
                    outlined
                    dense
                    label="Email"
                    color="light-blue darken-3"
                    :rules="this.inputDataAdmin.email != '' ? [rules.emailRules] : []"
                    hide-details="auto"
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
                  Kata Sandi
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-text-field
                    v-model="inputDataAdmin.password"
                    placeholder="Kata Sandi"
                    :type="passType ? 'text' : 'password'"
                    outlined
                    dense
                    label="Kata Sandi"
                    color="light-blue darken-3"
                    hide-details
                    :clearable="editedIndex != 2"
                    :readonly="editedIndex == 2"
                  >
                    <template v-slot:append>
                      <v-icon
                        :class="editedIndex == 2 && `mr-1`"
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
                  Kabupaten / Kota
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-autocomplete
                    v-model="inputDataAdmin.kota"
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
                  No Handphone
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-text-field
                    v-model="inputDataAdmin.noHP"
                    placeholder="No Handphone"
                    outlined
                    dense
                    label="No Handphone"
                    color="light-blue darken-3"
                    @keypress.native="onlyNumber($event, 15, inputDataAdmin.noHP)"
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
                  Alamat
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-textarea
                    v-model="inputDataAdmin.alamat"
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
                  :loading="btnProses"
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
  name: 'DataAdmin',
  components: {
    PopUpNotifikasiVue
  },
  data: () => ({
    isLoading: false,
    btnProses: false,
		DataAdmin: [],
		AdminOptions: [],
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
      { text: "Nama", value: "nama", sortable: true },
      { text: "Email", value: "email", sortable: false },
      { text: "Role", value: "namaRole", sortable: true },
      { text: "Status", value: "statusAktif", sortable: true },
    ],
    rowsPerPageItems: { "items-per-page-options": [5, 10, 25, 50] },
    totalItems: 0,
    sortBy: [],
    sortDesc: [],
    kumpulSort: '',
    roleID: '',
    idLog: '',
    DialogAdmin: false,
    inputDataAdmin: {
      id_admin: '',
      downline_tenant: '',
      nama_lengkap: '',
      username: '',
      email: '',
      password: '',
      kota: '',
      noHP: '',
      level: '',
      alamat: '',
    },
    kotaOptions: [],
    levelOptions: [],
    editedIndex: 0,
    kondisiTombol: true,
    passType: '',
    endecryptType: '',
    rules: {
			emailRules: value => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(value) || 'email tidak valid'
			},
		},

    //notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
  }),
  metaInfo: {
		title: "Data Administrator - WIN.ID",
		htmlAttrs: {
			lang: "id",
			amp: true,
		},
	},
  watch: {
    inputDataAdmin: {
      deep: true,
      handler(value){
				if(value.nama_lengkap == null){ this.inputDataAdmin.nama_lengkap = '' }
				if(value.username == null){ this.inputDataAdmin.username = '' }
				if(value.email == null){ this.inputDataAdmin.email = '' }
				if(value.password == null){ this.inputDataAdmin.password = '' }
				if(value.noHP == null){ this.inputDataAdmin.noHP = '' }
				if(value.kota == null){ this.inputDataAdmin.kota = '' }
				if(value.level == null){ this.inputDataAdmin.level = '' }
				if(value.alamat == null){ this.inputDataAdmin.alamat = '' }
        
        if(this.roleID == 1 && value.level == 3) {
          if (!this.inputDataAdmin.downline_tenant) return this.getAdminTenant()
        }else{
          this.inputDataAdmin.downline_tenant = ''
        }

        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if(value.nama_lengkap != '' && value.username != '' && value.email.match(pattern) && value.password != '' && value.noHP != '' && value.kota != '' && value.level != '' && value.alamat != ''){
          this.kondisiTombol = false
        }else{
          this.kondisiTombol = true
        }
      }
    },
    page: {
			deep: true,
			handler(value) {
				this.getAdministrator(value, this.limit, this.searchData)
			}
		},
    limit: {
			deep: true,
			handler(value) {
				this.getAdministrator(1, value, this.searchData)
			}
		},
    searchData: {
			deep: true,
			handler(value) {
        if (value == null) {
          this.getAdministrator(1, this.limit, this.searchData)
        }
			}
		},
    sortDesc: {
			deep: true,
			handler(value) {
        this.getAdministrator(1, this.limit, this.searchData)
			}
		},
  },
  mounted() {
    this.roleID = localStorage.getItem('roleID')
    this.idLog = localStorage.getItem('idLogin')
		this.getAdministrator(1, this.limit, this.searchData);
	},
	methods: {
		...mapActions(["fetchData"]),
		getAdministrator(page = 1, limit, keyword) {
      this.itemsPerPage = limit
      this.page = page
      this.pageSummary = {
				page: '',
				limit: '',
				total: '',
				totalPages: ''
			}
      this.DataAdmin = []
      this.pageOptions = [{ value: 1 }]
      this.isLoading = true
			let payload = {
        method: "get",
				url: `admin/getAdmin?page=${page}&limit=${limit}${keyword ? `&keyword=${keyword}` : ''}&sort=${this.kumpulSort}`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
        let resdata = res.data.result;
        let dataAdminOptions = resdata.records
				if (this.roleID == 1) {
					this.DataAdmin = dataAdminOptions
				}else{
					this.DataAdmin = dataAdminOptions.filter(val => val.downlineTenant == this.idLog)
				}
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
        this.DataAdmin = []
        this.pageOptions = [{ value: 1 }]
        this.pageSummary = {
          page: '',
          limit: '',
          total: '',
          totalPages: ''
        }
        this.isLoading = false
        this.notifikasi("error", err.response.data.message, "1")
			});
		},
		getKota() {
			let payload = {
				method: "get",
				url: `settings/getWilayah?bagian=kabkotaOnly`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				this.kotaOptions = res.data.result;
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
		},
		getLevel() {
			let payload = {
				method: "get",
				url: `settings/getRole`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				let dataroleOptions = res.data.result;
        if (this.roleID == 1) {
					this.levelOptions = dataroleOptions
				}else{
					this.levelOptions = dataroleOptions.filter(val => val.idRole == 3)
				}
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
		},
    getAdminTenant() {
			this.isLoading = true
			let payload = {
				method: "get",
				url: `admin/getAdmin?level=2`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				let dataAdminOptions = res.data.result;
				if (this.roleID == 1) {
					this.AdminOptions = dataAdminOptions
				}else{
					this.AdminOptions = dataAdminOptions.filter(val => val.downlineTenant == this.idLog)
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
      this.getKota()
      this.getLevel()
      if(index == 0){
        this.clearForm()
      }else{
        this.inputDataAdmin.id_admin = item.idAdmin
        this.inputDataAdmin.downline_tenant = item.downlineTenant
        this.inputDataAdmin.nama_lengkap = item.nama
        this.inputDataAdmin.username = item.username
        this.inputDataAdmin.email = item.email
        this.inputDataAdmin.password = item.kataSandi
        this.inputDataAdmin.kota = item.kota
        this.inputDataAdmin.noHP = item.noHP
        this.inputDataAdmin.level = item.level
        this.inputDataAdmin.alamat = item.alamat
      }
      this.DialogAdmin = true
    },
    tutupDialog() {
      this.clearForm()
      this.DialogAdmin = false
    },
    SimpanForm(index) {
      this.btnProses = true
      let bodyData = {
        jenis: index == 0 ? 'ADD' : 'EDIT',
        id_admin: index == 0 ? '' : this.inputDataAdmin.id_admin,
        downline_tenant: this.roleID == 1 ? this.inputDataAdmin.level == 3 ? this.inputDataAdmin.downline_tenant : 0 : localStorage.getItem('idLogin'),
        nama: this.inputDataAdmin.nama_lengkap,
        username: this.inputDataAdmin.username,
        email: this.inputDataAdmin.email,
        password: this.inputDataAdmin.password,
        kota: this.inputDataAdmin.kota,
        no_hp: this.inputDataAdmin.noHP,
        level: this.inputDataAdmin.level,
        alamat: this.inputDataAdmin.alamat,
        create_update_by: localStorage.getItem('idLogin'),
      }
      let payload = {
				method: "post",
				url: `admin/postAdmin`,
        body: bodyData,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
        this.DialogAdmin = false
        this.btnProses = false
        this.getAdministrator(1, this.limit, this.searchData)
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
        this.btnProses = false
				this.notifikasi("error", err.response.data.message, "1")
			});
    },
    HapusRecord(item) {
      let bodyData = {
        jenis: 'DELETE',
        id_admin: item.idAdmin,
        username: item.username,
        email: item.email,
        delete_by: localStorage.getItem('idLogin'),
      }
      let payload = {
				method: "post",
				url: `admin/postAdmin`,
        body: bodyData,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
        this.DialogAdmin = false
        this.getAdministrator(1, this.limit, this.searchData)
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
    },
    StatusRecord(item, status_aktif) {
      let bodyData = {
        jenis: 'STATUSRECORD',
        id_admin: item.idAdmin,
        username: item.username,
        email: item.email,
        status_aktif: status_aktif,
      }
      let payload = {
				method: "post",
				url: `admin/postAdmin`,
        body: bodyData,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
        this.DialogAdmin = false
        this.getAdministrator(1, this.limit, this.searchData)
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
    },
    clearForm() {
      this.inputDataAdmin.id_admin = ''
      this.inputDataAdmin.downline_tenant = ''
      this.inputDataAdmin.nama_lengkap = ''
      this.inputDataAdmin.username = ''
      this.inputDataAdmin.email = ''
      this.inputDataAdmin.password = ''
      this.inputDataAdmin.kota = ''
      this.inputDataAdmin.noHP = ''
      this.inputDataAdmin.level = ''
      this.inputDataAdmin.alamat = ''
    },
    onClickVisible(d) {
      this[d] = !this[d]
    },
    endecryptData(d) {
      this[d] = !this[d]
      let url = this[d] ? 'decryptPass' : 'encryptPass' 
      let payload = {
				method: "get",
				url: `settings/${url}?kata=${this.inputDataAdmin.password}`,
				authToken: localStorage.getItem('user_token')
			};
      this.inputDataAdmin.password = ''
			this.fetchData(payload)
			.then((res) => {
				this.inputDataAdmin.password = res.data.result.hasil;
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
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
.v-data-table-header__icon {
  opacity: 10;
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
</style>