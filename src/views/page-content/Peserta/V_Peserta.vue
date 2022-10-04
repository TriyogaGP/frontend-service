<template>
  <div>
    <h1 class="subheading grey--text">Data Peserta</h1>
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
          :items="DataPeserta"
          :single-expand="singleExpand"
          :expanded.sync="expanded"
          show-expand
          item-key="idPeserta"
          hide-default-footer
          class="elevation-1"
          :page.sync="page"
          :items-per-page="itemsPerPage"
          @page-count="pageCount = $event"
        >
          <template #[`item.number`]="{ item }">
            {{ DataPeserta.indexOf(item) + 1 }}
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
                :value="item.idPeserta"
                color="#0bd369"
                small
                dense
								depressed
                class="ma-2 white--text text--darken-2"
                :disabled="item.statusAktif == 0"
                @click="bukaDialog(item, 1)"
              >
                <v-icon small>edit</v-icon>	Ubah
              </v-btn> 
              <v-btn
                v-if="item.statusAktif == 0"
                :value="item.idPeserta"
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
                v-else-if="item.statusAktif == 1"
                :value="item.idPeserta"
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
                :value="item.idPeserta"
                color="#bd3a07"
                small
                dense
								depressed
                class="ma-2 white--text text--darken-2"
                :disabled="item.statusAktif == 0"
                @click="HapusRecord(item)"
              >
                <v-icon small>delete</v-icon>	Hapus
              </v-btn> 
              <v-btn
                :value="item.idPeserta"
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
            v-if="DataPeserta.length > 0"
            v-model="page"
            :length="pageCount"
            :total-visible="5"
          />
        </v-col>
      </v-row>
    </v-card>
    <v-dialog
      v-model="DialogPeserta"
      max-width="800px"
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="light-blue darken-3"
        >
          <v-toolbar-title>{{editedIndex == 0 ? 'Tambah' : editedIndex == 1 ? 'Ubah' : 'View'}} Data Peserta</v-toolbar-title>
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
                  NIK
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-text-field
                    v-model="inputDataPeserta.nik"
                    placeholder="Nomor Induk Kewarganegaraan"
                    outlined
                    dense
                    label="Nomor Induk Kewarganegaraan"
                    color="light-blue darken-3"
                    @keypress.native="onlyNumber($event, 16, inputDataPeserta.nik)"
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
                  Nama Lengkap
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-text-field
                    v-model="inputDataPeserta.nama_lengkap"
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
                  Email
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-text-field
                    v-model="inputDataPeserta.email"
                    placeholder="Email"
                    outlined
                    dense
                    label="Email"
                    color="light-blue darken-3"
                    :rules="this.inputDataPeserta.email != '' ? [rules.emailRules] : []"
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
                    v-model="inputDataPeserta.password"
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
                  No Handphone
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-text-field
                    v-model="inputDataPeserta.noHP"
                    placeholder="No Handphone"
                    outlined
                    dense
                    label="No Handphone"
                    color="light-blue darken-3"
                    @keypress.native="onlyNumber($event, 15, inputDataPeserta.noHP)"
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
                    v-model="inputDataPeserta.alamat"
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
                  Kode Pos
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-text-field
                    v-model="inputDataPeserta.kode_pos"
                    placeholder="Kode Pos"
                    outlined
                    dense
                    label="Kode Pos"
                    color="light-blue darken-3"
                    @keypress.native="onlyNumber($event, 5, inputDataPeserta.kode_pos)"
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
                  NPWP
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-text-field
                    v-model="inputDataPeserta.npwp"
                    placeholder="NPWP"
                    outlined
                    dense
                    label="NPWP"
                    color="light-blue darken-3"
										v-mask="'##.###.###.#-###.###'"
                    @keypress.native="onlyNumber($event, 20, inputDataPeserta.npwp)"
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
                  No Rekening
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-text-field
                    v-model="inputDataPeserta.no_rek"
                    placeholder="No Rekening"
                    outlined
                    dense
                    label="No Rekening"
                    color="light-blue darken-3"
                    @keypress.native="onlyNumber($event, 20, inputDataPeserta.no_rek)"
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
                  Nama Rekening
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-text-field
                    v-model="inputDataPeserta.nama_rek"
                    placeholder="Nama Rekening"
                    outlined
                    dense
                    label="Nama Rekening"
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
                  Bertindak Mewakili
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-autocomplete
                    v-model="inputDataPeserta.bertindak_mewakili"
                    :items="firstOptions"
                    item-text="text"
                    item-value="value"
                    placeholder="Bertindak Mewakili"
                    label="Bertindak Mewakili"
                    outlined
                    dense
                    hide-details
                    :clearable="editedIndex != 2"
                    :readonly="editedIndex == 2"
                  />
                </v-col>
              </v-row>
							<v-row no-gutters v-if="inputDataPeserta.bertindak_mewakili == 'Perusahaan'">
                <v-col
                  cols="12"
                  md="4"
                  class="pt-2 d-flex align-center"
                >
                  Nama Perusahaan
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-text-field
                    v-model="inputDataPeserta.nama_perusahaan"
                    placeholder="Nama Perusahaan"
                    outlined
                    dense
                    label="Nama Perusahaan"
                    color="light-blue darken-3"
                    hide-details
                    :clearable="editedIndex != 2"
                    :readonly="editedIndex == 2"
                  />
                </v-col>
              </v-row>
							<v-row no-gutters v-if="inputDataPeserta.bertindak_mewakili == 'Perusahaan'">
                <v-col
                  cols="12"
                  md="4"
                  class="pt-2 d-flex align-center"
                >
                  NPWP Perusahaan
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-text-field
                    v-model="inputDataPeserta.npwp_perusahaan"
                    placeholder="NPWP Perusahaan"
                    outlined
                    dense
                    label="NPWP Perusahaan"
                    color="light-blue darken-3"
										v-mask="'##.###.###.#-###.###'"
                    @keypress.native="onlyNumber($event, 20, inputDataPeserta.npwp_perusahaan)"
                    hide-details
                    :clearable="editedIndex != 2"
                    :readonly="editedIndex == 2"
                  />
                </v-col>
              </v-row>
							<v-row no-gutters v-if="inputDataPeserta.bertindak_mewakili == 'Perusahaan'">
                <v-col
                  cols="12"
                  md="4"
                  class="pt-2 d-flex align-center"
                >
                  Alamat Perusahaan
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-textarea
                    v-model="inputDataPeserta.alamat_perusahaan"
                    placeholder="Alamat Perusahaan"
                    outlined
                    dense
                    rows="4"
                    label="Alamat Perusahaan"
                    color="light-blue darken-3"
                    hide-details
                    :clearable="editedIndex != 2"
                    :readonly="editedIndex == 2"
                    no-resize
                  />
                </v-col>
              </v-row>
							<v-row no-gutters v-if="inputDataPeserta.bertindak_mewakili == 'Perusahaan'">
                <v-col
                  cols="12"
                  md="4"
                  class="pt-2 d-flex align-center"
                >
                  Email Kantor
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-text-field
                    v-model="inputDataPeserta.email_kantor"
                    placeholder="Email Kantor"
                    outlined
                    dense
                    label="Email Kantor"
                    color="light-blue darken-3"
                    :rules="[rules.emailRules]"
                    hide-details="auto"
                    :clearable="editedIndex != 2"
                    :readonly="editedIndex == 2"
                  />
                </v-col>
              </v-row>
							<v-row no-gutters v-if="inputDataPeserta.bertindak_mewakili == 'Perusahaan'">
                <v-col
                  cols="12"
                  md="4"
                  class="pt-2 d-flex align-center"
                >
                  Telepon Kantor
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-text-field
                    v-model="inputDataPeserta.telp_kantor"
                    placeholder="Telepon Kantor"
                    outlined
                    dense
                    label="Telepon Kantor"
                    color="light-blue darken-3"
                    @keypress.native="onlyNumber($event, 15, inputDataPeserta.telp_kantor)"
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
                  Sumber Dana
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-autocomplete
                    v-model="inputDataPeserta.sumber_dana"
                    :items="secondOptions"
                    item-text="text"
                    item-value="value"
                    placeholder="Sumber Dana"
                    label="Sumber Dana"
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
                  Lampiran KTP
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-text-field
										v-model="inputDataPeserta.filektp"
										placeholder="Upload"
										outlined
										dense
                  	style="display: none"
									/>
									<input 
										ref="inputKTPFile"
										:key="componentKey"
										type="file"
										accept="image/x-png,image/jpg,image/jpeg"
										style="display: none"
										@change="uploadFile($event, 'ktp')"
									>
									<v-btn v-if="editedIndex != 2" depressed small color="light-blue darken-3" dark @click="pilihFile('ktp')">
										<v-icon small left>{{editedIndex == 0 ? 'add' : 'edit'}}</v-icon> {{editedIndex == 0 ? 'Tambah' : 'Ubah'}} Lampiran
									</v-btn>
									<v-btn v-else-if="editedIndex == 2" depressed small color="light-blue darken-3" dark @click="viewLampiran('ktp')">
										<v-icon small left>pageview</v-icon> Lihat Lampiran
									</v-btn>
									<br>
									<span v-if="this.inputDataPeserta.filektp != ''">
										<strong>nama file :</strong> <i>{{this.inputDataPeserta.filektp}}</i> {{editedIndex == 0 ? '('+(this.FileKTP.size / (1024*1024)).toFixed(2)+' MB)' : ''}}
										<v-icon small v-if="editedIndex != 2" color="red" @click="hapusFile('ktp')">delete</v-icon>
									</span>
                </v-col>
              </v-row>
							<v-row no-gutters>
                <v-col
                  cols="12"
                  md="4"
                  class="pt-2 d-flex align-center"
                >
                  Lampiran NPWP
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-text-field
										v-model="inputDataPeserta.filenpwp"
										placeholder="Upload"
										outlined
										dense
                  	style="display: none"
									/>
									<input 
										ref="inputNPWPFile"
										:key="componentKey"
										type="file"
										accept="image/x-png,image/jpg,image/jpeg"
										style="display: none"
										@change="uploadFile($event, 'npwp')"
									>
									<v-btn v-if="editedIndex != 2" depressed small color="light-blue darken-3" dark @click="pilihFile('npwp')">
										<v-icon small left>{{editedIndex == 0 ? 'add' : 'edit'}}</v-icon> {{editedIndex == 0 ? 'Tambah' : 'Ubah'}} Lampiran
									</v-btn>
									<v-btn v-else-if="editedIndex == 2" depressed small color="light-blue darken-3" dark @click="viewLampiran('npwp')">
										<v-icon small left>pageview</v-icon> Lihat Lampiran
									</v-btn>
									<br>
									<span v-if="this.inputDataPeserta.filenpwp != ''">
										<strong>nama file :</strong> <i>{{this.inputDataPeserta.filenpwp}}</i> {{editedIndex == 0 ? '('+(this.FileKTP.size / (1024*1024)).toFixed(2)+' MB)' : ''}}
										<v-icon small v-if="editedIndex != 2" color="red" @click="hapusFile('npwp')">delete</v-icon>
									</span>
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col
                  cols="12"
                  md="4"
                  class="pt-2 d-flex align-center"
                >
                  Foto Peserta
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-text-field
										v-model="inputDataPeserta.foto_peserta"
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
										@change="uploadFile($event, 'foto_peserta')"
									>
									<v-btn v-if="editedIndex != 2" depressed small color="light-blue darken-3" dark @click="pilihFile('foto_peserta')">
										<v-icon small left>{{editedIndex == 0 ? 'add' : 'edit'}}</v-icon> {{editedIndex == 0 ? 'Tambah' : 'Ubah'}} Lampiran
									</v-btn>
									<v-btn v-else-if="editedIndex == 2" depressed small color="light-blue darken-3" dark @click="viewLampiran('foto_peserta')">
										<v-icon small left>pageview</v-icon> Lihat Lampiran
									</v-btn>
									<br>
									<span v-if="this.inputDataPeserta.foto_peserta != ''">
										<strong>nama file :</strong> <i>{{this.inputDataPeserta.foto_peserta}}</i> {{editedIndex == 0 ? '('+(this.FileFOTO.size / (1024*1024)).toFixed(2)+' MB)' : ''}}
										<v-icon small v-if="editedIndex != 2" color="red" @click="hapusFile('foto_peserta')">delete</v-icon>
									</span>
                </v-col>
              </v-row>
							<!-- <v-row no-gutters>
                <v-col
                  cols="12"
                  md="4"
                  class="pt-2 d-flex align-center"
                >
                  Diwakili
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-autocomplete
                    v-model="inputDataPeserta.diwakili"
                    :items="thirdOptions"
                    item-text="text"
                    item-value="value"
                    placeholder="Diwakili"
                    label="Diwakili"
                    outlined
                    dense
                    hide-details
                    :clearable="editedIndex != 2"
                    :readonly="editedIndex == 2"
                  />
                </v-col>
              </v-row> -->
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
                  @click="SimpanForm(0, KumpulFile)"
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
                  @click="SimpanForm(1, KumpulFile)"
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
      v-model="DialogViewLampiranPeserta"
      width="600px"
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="light-blue darken-3"
        >
          <v-toolbar-title>View Lampiran Data Peserta</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <v-btn
              icon
              dark
              @click="DialogViewLampiranPeserta = false"
            >
              <v-icon>close</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card tile>
          <div class="scrollTextGBR">
            <v-card-text class="d-flex flex-column justify-space-between align-center">
              <v-avatar v-if="jenisLampiran == 'foto_peserta'" size="400" style="border: 3px solid #000;">
                <v-img :src="this.urlView"/>
              </v-avatar>
              <img v-else :src="this.urlView" width="400"/>
            </v-card-text>
          </div>
        </v-card>
      </v-card>
		</v-dialog>
		<v-dialog
      v-model="DialogCropPeserta"
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
              :auto-zoom="true"
              :src="image.src"
              :stencil-component="image.jenis == 'foto_peserta' ? 'circle-stencil' : 'rectangle-stencil'"
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
import { Cropper, CircleStencil, RectangleStencil } from 'vue-advanced-cropper'
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
  name: 'DataPeserta',
  components: {
    PopUpNotifikasiVue, Cropper, CircleStencil, RectangleStencil
  },
  data: () => ({
    isLoading: false,
		DataPeserta: [],
		page: 1,
    pageCount: 0,
    itemsPerPage: 5,
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
      { text: "NIK", value: "nik", sortable: false },
      { text: "Nama", value: "nama", sortable: false },
      { text: "Email", value: "email", sortable: false },
      { text: "Status", value: "statusAktif", sortable: false },
    ],
    rowsPerPageItems: { "items-per-page-options": [5, 10, 25, 50] },
    totalItems: 0,
    idLog: '',
    DialogPeserta: false,
    DialogViewLampiranPeserta: false,
    DialogCropPeserta: false,
    inputDataPeserta: {
      UnixText: '',
      id_peserta: '',
      nik: '',
      nama_lengkap: '',
      email: '',
      password: '',
      noHP: '',
      alamat: '',
      kode_pos: '',
      npwp: '',
      no_rek: '',
      nama_rek: '',
      bertindak_mewakili: '',
      nama_perusahaan: '',
      npwp_perusahaan: '',
      alamat_perusahaan: '',
      telp_kantor: '',
      email_kantor: '',
      sumber_dana: '',
			filektp: '',
			filenpwp: '',
			foto_peserta: '',
    },
    image: {
      src: null,
      type: null,
      jenis: null,
    },
    firstOptions: [
			{value: 'Individu', text: 'Individu'},
			{value: 'Perusahaan', text: 'Perusahaan'},
		],
    secondOptions: [
			{value: 'Sendiri', text: 'Sendiri'},
			{value: 'Perusahaan', text: 'Perusahaan'},
		],
    thirdOptions: [
			{value: '0', text: 'Tidak Diwakili'},
			{value: '1', text: 'Diwakili'},
		],
    editedIndex: 3,
    kondisiTombol: true,
    passType: '',
    endecryptType: '',
		componentKey: 0,
		FileKTP: '',
		FileNPWP: '',
		FileFOTO: '',
		KumpulFile: {
			fileKTP: '',
			fileNPWP: '',
			fileFOTO: '',
		},
		urlView: '',
		jenisLampiran: '',
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
		title: "Data Peserta - WIN.ID",
		htmlAttrs: {
			lang: "id",
			amp: true,
		},
	},
  watch: {
		FileKTP(){
			if(this.FileKTP == undefined){
				this.FileKTP = ''
			}	
		},
		FileNPWP(){
			if(this.FileNPWP == undefined){
				this.FileNPWP = ''
			}
		},
    inputDataPeserta: {
      deep: true,
      handler(value){
				if(value.nik == null){ this.inputDataPeserta.nik = '' }
				if(value.nama_lengkap == null){ this.inputDataPeserta.nama_lengkap = '' }
				if(value.email == null){ this.inputDataPeserta.email = '' }
				if(value.password == null){ this.inputDataPeserta.password = '' }
				if(value.noHP == null){ this.inputDataPeserta.noHP = '' }
				if(value.alamat == null){ this.inputDataPeserta.alamat = '' }
				if(value.kode_pos == null){ this.inputDataPeserta.kode_pos = '' }
				if(value.npwp == null){ this.inputDataPeserta.npwp = '' }
				if(value.no_rek == null){ this.inputDataPeserta.no_rek = '' }
				if(value.nama_rek == null){ this.inputDataPeserta.nama_rek = '' }
				if(value.sumber_dana == null){ this.inputDataPeserta.sumber_dana = '' }
				if(value.bertindak_mewakili == null){ this.inputDataPeserta.bertindak_mewakili = '' }
				if(value.bertindak_mewakili == ''){ this.clearForm2() }
				if(value.nama_perusahaan == null){ this.inputDataPeserta.nama_perusahaan = '' }
				if(value.npwp_perusahaan == null){ this.inputDataPeserta.npwp_perusahaan = '' }
				if(value.alamat_perusahaan == null){ this.inputDataPeserta.alamat_perusahaan = '' }
				if(value.telp_kantor == null){ this.inputDataPeserta.telp_kantor = '' }
				if(value.email_kantor == null){ this.inputDataPeserta.email_kantor = '' }
        
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if(value.nik != '' && value.nama_lengkap != '' && value.email.match(pattern) && value.password != '' && value.noHP != '' && value.alamat != '' && 
				value.kode_pos != '' && value.npwp != '' && value.no_rek != '' && value.nama_rek != '' && value.sumber_dana != '' && value.bertindak_mewakili != '' &&
        value.filektp != '' && value.filenpwp != '' && value.foto_peserta != ''){
					if(value.bertindak_mewakili == 'Individu'){
						this.kondisiTombol = false
					}else if(value.bertindak_mewakili == 'Perusahaan'){
						if(value.nama_perusahaan != '' && value.npwp_perusahaan != '' && value.alamat_perusahaan != '' && value.telp_kantor != '' && value.email_kantor.match(pattern)){
							this.kondisiTombol = false
						}else{
							this.kondisiTombol = true
						}
					}
        }else{
          this.kondisiTombol = true
        }
      }
    },
  },
  updated(){
		// if(this.editedIndex == 0){ this.inputDataPeserta.UnixText = `Peserta${this.convertDate(new Date().toISOString().slice(0,10))}${this.makeRandom(8)}` }
	},
  mounted() {
    this.idLog = localStorage.getItem('idLogin')
		this.getPeserta();
	},
	methods: {
		...mapActions({
      fetchData: "fetchData",
      uploadFiles: "upload/uploadFiles",
    }),
		getPeserta() {
      this.isLoading = true
			let payload = {
        method: "get",
				url: `admin/getPeserta`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
        this.DataPeserta = res.data.result;
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
        this.clearForm2()
        this.inputDataPeserta.UnixText = `Peserta${this.convertDate(new Date().toISOString().slice(0,10))}${this.makeRandom(8)}`
      }else{
        this.inputDataPeserta.UnixText = item.UnixText ? item.UnixText : ''
        this.inputDataPeserta.id_peserta = item.idPeserta ? item.idPeserta : ''
        this.inputDataPeserta.nik = item.nik ? item.nik : ''
        this.inputDataPeserta.nama_lengkap = item.nama ? item.nama : ''
        this.inputDataPeserta.email = item.email ? item.email : ''
        this.inputDataPeserta.password = item.kataSandi ? item.kataSandi : ''
        this.inputDataPeserta.noHP = item.noHP ? item.noHP : ''
        this.inputDataPeserta.alamat = item.alamat ? item.alamat : ''
        this.inputDataPeserta.kode_pos = item.kodePos ? item.kodePos : ''
        this.inputDataPeserta.npwp = item.npwp ? this.npwpFormat(item.npwp) : ''
        this.inputDataPeserta.no_rek = item.noRek ? item.noRek : ''
        this.inputDataPeserta.nama_rek = item.namaRek ? item.namaRek : ''
        this.inputDataPeserta.bertindak_mewakili = item.bertindakMewakili ? item.bertindakMewakili : ''
        this.inputDataPeserta.sumber_dana = item.sumberDana ? item.sumberDana : ''
        this.inputDataPeserta.filektp = item.fotoKTP ? item.fotoKTP : ''
        this.inputDataPeserta.filenpwp = item.fotoNPWP ? item.fotoNPWP : ''
        this.inputDataPeserta.foto_peserta = item.fotoPeserta ? item.fotoPeserta : ''
				if(item.bertindakMewakili == 'Perusahaan'){
					this.inputDataPeserta.nama_perusahaan = item.namaPerusahaan ? item.namaPerusahaan : ''
					this.inputDataPeserta.npwp_perusahaan = item.npwpPerusahaan ? this.npwpFormat(item.npwpPerusahaan) : ''
					this.inputDataPeserta.alamat_perusahaan = item.alamatPerusahaan ? item.alamatPerusahaan : ''
					this.inputDataPeserta.telp_kantor = item.telpKantor ? item.telpKantor : ''
					this.inputDataPeserta.email_kantor = item.emailKantor ? item.emailKantor : ''
				}
      }
      this.DialogPeserta = true
    },
    tutupDialog() {
      this.clearForm()
      this.clearForm2()
      this.editedIndex = 3
      this.DialogPeserta = false
    },
    async SimpanForm(index, dataUpload) {
			let bodyData = {
				jenis: index == 0 ? 'ADD' : 'EDIT',
				id_peserta: index == 0 ? '' : this.inputDataPeserta.id_peserta,
				UnixText: this.inputDataPeserta.UnixText,
				nik: this.inputDataPeserta.nik,
				nama: this.inputDataPeserta.nama_lengkap,
				email: this.inputDataPeserta.email,
				password: this.inputDataPeserta.password,
				no_hp: this.inputDataPeserta.noHP,
				alamat: this.inputDataPeserta.alamat,
				kode_pos: this.inputDataPeserta.kode_pos,
				npwp: this.InvertnpwpFormat(this.inputDataPeserta.npwp),
				no_rek: this.inputDataPeserta.no_rek,
				nama_rek: this.inputDataPeserta.nama_rek,
				bertindak_mewakili: this.inputDataPeserta.bertindak_mewakili,
				nama_perusahaan: this.inputDataPeserta.bertindak_mewakili == 'Perusahaan' ? this.inputDataPeserta.nama_perusahaan : null,
				npwp_perusahaan: this.inputDataPeserta.bertindak_mewakili == 'Perusahaan' ? this.InvertnpwpFormat(this.inputDataPeserta.npwp_perusahaan) : null,
				alamat_perusahaan: this.inputDataPeserta.bertindak_mewakili == 'Perusahaan' ? this.inputDataPeserta.alamat_perusahaan : null,
				telp_kantor: this.inputDataPeserta.bertindak_mewakili == 'Perusahaan' ? this.inputDataPeserta.telp_kantor : null,
				email_kantor: this.inputDataPeserta.bertindak_mewakili == 'Perusahaan' ? this.inputDataPeserta.email_kantor : null,
				sumber_dana: this.inputDataPeserta.sumber_dana,
				foto_ktp: this.inputDataPeserta.filektp,
				foto_npwp: this.inputDataPeserta.filenpwp,
				foto_peserta: this.inputDataPeserta.foto_peserta,
				create_update_by: localStorage.getItem('idLogin'),
			}
			let payload = {
				method: "post",
				url: `admin/postPeserta`,
			  body: bodyData,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then(async (res) => {
				if(this.FileKTP || this.FileNPWP || this.FileFOTO){
					let uploadKTP = await this.uploadLampiran(index, dataUpload.fileKTP, 'ktp')
					let uploadNPWP = await this.uploadLampiran(index, dataUpload.fileNPWP, 'npwp')
					let uploadFOTO = await this.uploadLampiran(index, dataUpload.fileFOTO, 'foto_peserta')
          let aksi = []
					if(uploadKTP != undefined){ aksi.push('sukses') }else{ aksi.push('gagal') }
          if(uploadNPWP != undefined){ aksi.push('sukses') }else{ aksi.push('gagal') }
          if(uploadFOTO != undefined){ aksi.push('sukses') }else{ aksi.push('gagal') }
					if(aksi.filter(el => el == 'sukses').length){
						this.notifikasi("success", res.data.message, "1")
					}else{
						this.notifikasi("error", 'Gagal proses data', "1")
					}
				}else{
					this.notifikasi("success", res.data.message, "1")
				}
        // this.notifikasi("success", res.data.message, "1")
        this.clearForm()
        this.clearForm2()
				this.DialogPeserta = false
				this.getPeserta()
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
    },
		async uploadLampiran(index, dataUpload, part) {
			if(dataUpload){
				const bodyData = {
					proses: index == 0 ? 'ADD' : 'EDIT',
					id: index == 0 ? null : this.inputDataPeserta.id_peserta,
					nik: this.inputDataPeserta.nik,
					nama_folder: this.inputDataPeserta.UnixText,
					nama_file: `Peserta-${part}-${this.convertDate(new Date().toISOString().slice(0,10))}${this.makeRandom(8)}`,
					jenis: "images",
					bagian: "berkas",
					table: "m_peserta",
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
        id_peserta: item.idPeserta,
        nik: item.nik,
        email: item.email,
        delete_by: localStorage.getItem('idLogin'),
      }
      let payload = {
				method: "post",
				url: `admin/postPeserta`,
        body: bodyData,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
        this.DialogPeserta = false
        this.getPeserta()
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
    },
    StatusRecord(item, status_aktif) {
      let bodyData = {
        jenis: 'STATUSRECORD',
        id_peserta: item.idPeserta,
        nik: item.nik,
        email: item.email,
        status_aktif: status_aktif,
      }
      let payload = {
				method: "post",
				url: `admin/postPeserta`,
        body: bodyData,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
        this.DialogPeserta = false
        this.getPeserta()
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
    },
    clearForm() {
      this.inputDataPeserta.UnixText = ''
      this.inputDataPeserta.id_peserta = ''
      this.inputDataPeserta.nik = ''
      this.inputDataPeserta.nama_lengkap = ''
      this.inputDataPeserta.email = ''
      this.inputDataPeserta.password = ''
      this.inputDataPeserta.noHP = ''
      this.inputDataPeserta.alamat = ''
      this.inputDataPeserta.kode_pos = ''
      this.inputDataPeserta.npwp = ''
      this.inputDataPeserta.no_rek = ''
      this.inputDataPeserta.nama_rek = ''
      this.inputDataPeserta.bertindak_mewakili = ''
      this.inputDataPeserta.sumber_dana = ''
      this.inputDataPeserta.filektp = ''
      this.inputDataPeserta.filenpwp = ''
      this.inputDataPeserta.foto_peserta = ''
      this.FileKTP = ''
      this.FileNPWP = ''
      this.FileFOTO = ''
      this.KumpulFile = {
        fileKTP: '',
        fileNPWP: '',
        fileFOTO: '',
      }
    },
    clearForm2() {
      this.inputDataPeserta.nama_perusahaan = ''
      this.inputDataPeserta.npwp_perusahaan = ''
      this.inputDataPeserta.alamat_perusahaan = ''
      this.inputDataPeserta.telp_kantor = ''
      this.inputDataPeserta.email_kantor = ''
    },
		pilihFile(jenis) {
			if(jenis == 'ktp'){ this.$refs.inputKTPFile.click() }
			else if(jenis == 'npwp'){ this.$refs.inputNPWPFile.click(); }
			else if(jenis == 'foto_peserta'){ this.$refs.inputFOTOFile.click(); }
    },
		async uploadFile(e, jenis) {
			if(jenis == 'ktp'){ 
				this.FileKTP = await e.target.files[0];
				this.inputDataPeserta.filektp = this.FileKTP.name;
        this.loadImage(this.FileKTP, jenis)
			}else if(jenis == 'npwp'){ 
				this.FileNPWP = await e.target.files[0];
				this.inputDataPeserta.filenpwp = this.FileNPWP.name;
        this.loadImage(this.FileNPWP, jenis)
			}else if(jenis == 'foto_peserta'){ 
				this.FileFOTO = await e.target.files[0];
				this.inputDataPeserta.foto_peserta = this.FileFOTO.name;
        this.loadImage(this.FileFOTO, jenis)
			}
    },
    loadImage(files, jenis) {
      this.DialogCropPeserta = true
      const blob = URL.createObjectURL(files);
      const reader = new FileReader();
      reader.onload = (e) => {
        this.image = {
          src: blob,
          type: getMimeType(e.target.result, files.type),
          jenis: jenis,
        }
      }
      reader.readAsArrayBuffer(files);
    },
    crop() {
			const { canvas } = this.$refs.cropper.getResult();
			canvas.toBlob((blob) => {
        if(this.image.jenis == 'ktp'){
          this.FileKTP = blob
          this.KumpulFile = {
            fileKTP: this.FileKTP,
            fileNPWP: this.FileNPWP,
            fileFOTO: this.FileFOTO
          }
        }else if(this.image.jenis == 'npwp'){
          this.FileNPWP = blob
          this.KumpulFile = {
            fileKTP: this.FileKTP,
            fileNPWP: this.FileNPWP,
            fileFOTO: this.FileFOTO
          }
        }else if(this.image.jenis == 'foto_peserta'){
          this.FileFOTO = blob
          this.KumpulFile = {
            fileKTP: this.FileKTP,
            fileNPWP: this.FileFOTO,
            fileFOTO: this.FileFOTO
          }
        }
			}, this.image.type);
      this.DialogCropPeserta = false
		},
		hapusFile(jenis){
			if(jenis == 'ktp'){ 
				this.FileKTP = ''
				this.inputDataPeserta.filektp = '';
				this.KumpulFile.fileKTP = ''
			}else if(jenis == 'npwp'){ 
				this.FileNPWP = '' 
				this.inputDataPeserta.filenpwp = '';
				this.KumpulFile.fileNPWP = ''
			}else if(jenis == 'foto_peserta'){ 
				this.FileFOTO = '' 
				this.inputDataPeserta.foto_peserta = '';
				this.KumpulFile.fileFOTO = ''
			}
		},
    tutupDialogCrop(jenis){
      this.hapusFile(jenis)
      this.editedIndex = 3
      this.DialogCropPeserta = false
    },
		viewLampiran(lampiran) {
			this.DialogViewLampiranPeserta = true
			const API_URL = process.env.VUE_APP_NODE_ENV === "production" ? process.env.VUE_APP_VIEW_PROD_API_URL : process.env.VUE_APP_VIEW_DEV_API_URL
      const no_image = `${API_URL}No_Image_Available.jpg`
      this.jenisLampiran = lampiran
			if(lampiran == 'ktp'){
				this.urlView = this.inputDataPeserta.filektp ? `${API_URL}image/berkas/${this.inputDataPeserta.filektp}` : no_image
				// this.urlView = this.inputDataPeserta.filektp ? `${API_URL}${this.inputDataPeserta.filektp}` : no_image
			}else if(lampiran == 'npwp'){
				this.urlView = this.inputDataPeserta.filenpwp ? `${API_URL}image/berkas/${this.inputDataPeserta.filenpwp}` : no_image
				// this.urlView = this.inputDataPeserta.filenpwp ? `${API_URL}${this.inputDataPeserta.filenpwp}` : no_image
			}else if(lampiran == 'foto_peserta'){
				this.urlView = this.inputDataPeserta.foto_peserta ? `${API_URL}image/berkas/${this.inputDataPeserta.foto_peserta}` : no_image
				// this.urlView = this.inputDataPeserta.foto_peserta ? `${API_URL}${this.inputDataPeserta.foto_peserta}` : no_image
			}
		},
    onClickVisible(d) {
      this[d] = !this[d]
    },
    endecryptData(d) {
      this[d] = !this[d]
      let url = this[d] ? 'decryptPass' : 'encryptPass' 
      let payload = {
				method: "get",
				url: `settings/${url}?kata=${this.inputDataPeserta.password}`,
				authToken: localStorage.getItem('user_token')
			};
      this.inputDataPeserta.password = ''
			this.fetchData(payload)
			.then((res) => {
				this.inputDataPeserta.password = res.data.result.hasil;
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