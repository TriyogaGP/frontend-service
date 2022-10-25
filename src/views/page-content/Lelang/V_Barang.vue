<template>
  <div>
    <v-card :class="roleID == 5 && 'mt-2 mb-2 pa-1'" :outlined="roleID == 5" elevation="0">
      <h1 class="subheading grey--text">Panel Barang Lelang</h1>
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
          :items="DataBarangLelang"
          :single-expand="singleExpand"
          :expanded.sync="expanded"
          show-expand
          item-key="idBarangLelang"
          hide-default-footer
          class="elevation-1"
          :page.sync="page"
          :items-per-page="itemsPerPage"
          @page-count="pageCount = $event"
        >
          <template #[`item.number`]="{ item }">
            {{ DataBarangLelang.indexOf(item) + 1 }}
          </template>
          <template #[`item.kategori`]="{ item }">
            <span v-html="item.namaKategori" /><br> 
            <v-tooltip v-if="item.statusKategoriLelang == false" bottom>
              <template v-slot:activator="{ on, attrs }">
                <strong>(<span v-bind="attrs" v-on="on">Non Active</span>)</strong>
              </template>
              <span>Harus Diubah Kategori tidak aktif</span>
            </v-tooltip>
          </template>
          <template #[`item.no_kelengkapan`]="{ item }">
            <div v-if="item.namaKategori == 'Mobil' || item.namaKategori == 'Motor'">
              No. Polisi : <span v-html="item.noPolisi" /> <br> 
              No. Rangka : <span v-html="item.noRangka" /> <br>
              No. Mesin : <span v-html="item.noMesin" /> 
            </div>
            <div v-else>
              Spesifikasi : <br>
              <span v-html="item.deskripsi" /> 
            </div>
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
                :value="item.idBarangLelang"
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
                :value="item.idBarangLelang"
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
                :value="item.idBarangLelang"
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
                :value="item.idBarangLelang"
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
                :value="item.idBarangLelang"
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
                :value="item.idBarangLelang"
                color="#0bd369"
                small
                dense
                depressed
                class="ma-2 white--text text--darken-2"
                :disabled="item.statusAktif == false"
                @click="() => { 
                  inputBarangLelang.UnixText = item.UnixText; 
                  inputBarangLelang.id_barang_lelang = item.idBarangLelang; 
                  inputBarangLelang.nama_barang_lelang = item.namaBarangLelang; 
                  DialogUploadMultipleBarangLelang = true; 
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
            v-if="DataBarangLelang.length > 0"
            v-model="page"
            :length="pageCount"
            :total-visible="10"
          />
        </v-col>
      </v-row>
    </v-card>
		<v-dialog
      v-model="DialogBarangLelang"
      max-width="800px"
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="light-blue darken-3"
        >
          <v-toolbar-title>{{editedIndex == 0 ? 'Tambah' : editedIndex == 1 ? 'Ubah' : 'View'}} Data Barang Lelang</v-toolbar-title>
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
                  Kategori
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-autocomplete
                    v-model="inputBarangLelang.id_kategori"
                    :items="kategoriOptions"
                    item-text="kategori"
                    item-value="idKategori"
                    placeholder="Kategori"
                    label="Kategori"
                    outlined
                    dense
                    hide-details
                    :clearable="editedIndex != 2"
                    :readonly="editedIndex == 2"
                  />
                  <span v-html="editedIndex != 0 && inputBarangLelang.id_kategori == '' ? 'Kategori yang dipilih tidak aktif' : ''" class="red--text"></span>
                </v-col>
              </v-row>
							<v-row no-gutters>
                <v-col
                  cols="12"
                  md="4"
                  class="pt-2 d-flex align-center"
                >
                  Nama Barang Lelang
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-text-field
                    v-model="inputBarangLelang.nama_barang_lelang"
                    placeholder="Nama Barang Lelang"
                    outlined
                    dense
                    label="Nama Barang Lelang"
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
                  Nama Pemilik Barang Lelang
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-text-field
                    v-model="inputBarangLelang.nama_pemilik"
                    placeholder="Nama Pemilik Barang Lelang"
                    outlined
                    dense
                    label="Nama Pemilik Barang Lelang"
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
                  Brand
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-text-field
                    v-model="inputBarangLelang.brand"
                    placeholder="Brand"
                    outlined
                    dense
                    label="Brand"
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
                  Warna
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-text-field
                    v-model="inputBarangLelang.warna"
                    placeholder="Warna"
                    outlined
                    dense
                    label="Warna"
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
                  Tahun
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-autocomplete
                    v-model="inputBarangLelang.tahun"
                    :items="tahunOptions"
                    item-text="text"
                    item-value="text"
                    placeholder="Tahun"
                    label="Tahun"
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
                  Lokasi Barang Lelang
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-textarea
                    v-model="inputBarangLelang.lokasi_barang"
                    placeholder="Lokasi Barang Lelang"
                    outlined
                    dense
                    rows="4"
                    label="Lokasi Barang Lelang"
                    color="light-blue darken-3"
                    hide-details
                    :clearable="editedIndex != 2"
                    :readonly="editedIndex == 2"
                    no-resize
                  />
                </v-col>
              </v-row>
							<v-row v-if="namaKategori == 'Mobil' || namaKategori == 'Motor'" no-gutters>
                <v-col
                  cols="12"
                  md="4"
                  class="pt-2 d-flex align-center"
                >
                  No. Rangka
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-text-field
                    v-model="inputBarangLelang.no_rangka"
                    placeholder="No. Rangka"
                    outlined
                    dense
                    label="No. Rangka"
                    color="light-blue darken-3"
                    hide-details
                    :clearable="editedIndex != 2"
                    :readonly="editedIndex == 2"
                  />
                </v-col>
              </v-row>
							<v-row v-if="namaKategori == 'Mobil' || namaKategori == 'Motor'" no-gutters>
                <v-col
                  cols="12"
                  md="4"
                  class="pt-2 d-flex align-center"
                >
                  No. Mesin
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-text-field
                    v-model="inputBarangLelang.no_mesin"
                    placeholder="No. Mesin"
                    outlined
                    dense
                    label="No. Mesin"
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
                  Tipe Model
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-text-field
                    v-model="inputBarangLelang.tipe_model"
                    placeholder="Tipe Model"
                    outlined
                    dense
                    label="Tipe Model"
                    color="light-blue darken-3"
                    hide-details
                    :clearable="editedIndex != 2"
                    :readonly="editedIndex == 2"
                  />
                </v-col>
              </v-row>
              <v-row v-if="namaKategori == 'Mobil' || namaKategori == 'Motor'" no-gutters>
                <v-col
                  cols="12"
                  md="4"
                  class="pt-2 d-flex align-center"
                >
                  Transmisi
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-autocomplete
                    v-model="inputBarangLelang.transmisi"
                    :items="transmisiOptions"
                    item-text="text"
                    item-value="value"
                    placeholder="Transmisi"
                    label="Transmisi"
                    outlined
                    dense
                    hide-details
                    :clearable="editedIndex != 2"
                    :readonly="editedIndex == 2"
                  />
                </v-col>
              </v-row>
              <v-row v-if="namaKategori == 'Mobil' || namaKategori == 'Motor'" no-gutters>
                <v-col
                  cols="12"
                  md="4"
                  class="pt-2 d-flex align-center"
                >
                  Bahan Bakar
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-autocomplete
                    v-model="inputBarangLelang.bahan_bakar"
                    :items="bahanbakarOptions"
                    item-text="text"
                    item-value="value"
                    placeholder="Bahan Bakar"
                    label="Bahan Bakar"
                    outlined
                    dense
                    hide-details
                    :clearable="editedIndex != 2"
                    :readonly="editedIndex == 2"
                  />
                </v-col>
              </v-row>
							<v-row v-if="namaKategori == 'Mobil' || namaKategori == 'Motor'" no-gutters>
                <v-col
                  cols="12"
                  md="4"
                  class="pt-2 d-flex align-center"
                >
                  Odometer (Jarak Tempuh)
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-text-field
                    v-model="inputBarangLelang.odometer"
                    placeholder="Odometer (Jarak Tempuh)"
                    outlined
                    dense
                    label="Odometer (Jarak Tempuh)"
                    color="light-blue darken-3"
                    @keypress.native="onlyNumber($event, 15, inputBarangLelang.odometer)"
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
                  Grade Utama
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-text-field
                    v-model="inputBarangLelang.grade"
                    placeholder="Grade Utama"
                    outlined
                    dense
                    label="Grade Utama"
                    color="light-blue darken-3"
                    hide-details
                    :clearable="editedIndex != 2"
                    :readonly="editedIndex == 2"
                  />
                </v-col>
              </v-row>
							<v-row v-if="namaKategori == 'Mobil' || namaKategori == 'Motor'" no-gutters>
                <v-col
                  cols="12"
                  md="4"
                  class="pt-2 d-flex align-center"
                >
                  Grade Interior
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-text-field
                    v-model="inputBarangLelang.grade_interior"
                    placeholder="Grade Interior"
                    outlined
                    dense
                    label="Grade Interior"
                    color="light-blue darken-3"
                    hide-details
                    :clearable="editedIndex != 2"
                    :readonly="editedIndex == 2"
                  />
                </v-col>
              </v-row>
							<v-row v-if="namaKategori == 'Mobil' || namaKategori == 'Motor'" no-gutters>
                <v-col
                  cols="12"
                  md="4"
                  class="pt-2 d-flex align-center"
                >
                  Grade Eksterior
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-text-field
                    v-model="inputBarangLelang.grade_eksterior"
                    placeholder="Grade Eksterior"
                    outlined
                    dense
                    label="Grade Eksterior"
                    color="light-blue darken-3"
                    hide-details
                    :clearable="editedIndex != 2"
                    :readonly="editedIndex == 2"
                  />
                </v-col>
              </v-row>
							<v-row v-if="namaKategori == 'Mobil' || namaKategori == 'Motor'" no-gutters>
                <v-col
                  cols="12"
                  md="4"
                  class="pt-2 d-flex align-center"
                >
                  Grade Mesin
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-text-field
                    v-model="inputBarangLelang.grade_mesin"
                    placeholder="Grade Mesin"
                    outlined
                    dense
                    label="Grade Mesin"
                    color="light-blue darken-3"
                    hide-details
                    :clearable="editedIndex != 2"
                    :readonly="editedIndex == 2"
                  />
                </v-col>
              </v-row>
							<v-row v-if="namaKategori == 'Mobil' || namaKategori == 'Motor'" no-gutters>
                <v-col
                  cols="12"
                  md="4"
                  class="pt-2 d-flex align-center"
                >
                  No.Polisi
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-text-field
                    v-model="inputBarangLelang.no_polisi"
                    placeholder="No.Polisi"
                    outlined
                    dense
                    label="No.Polisi"
                    color="light-blue darken-3"
                    hide-details
                    :clearable="editedIndex != 2"
                    :readonly="editedIndex == 2"
                  />
                </v-col>
              </v-row>
							<v-row v-if="namaKategori == 'Mobil' || namaKategori == 'Motor'" no-gutters>
                <v-col
                  cols="12"
                  md="4"
                  class="pt-2 d-flex align-center"
                >
                  Valid STNK
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-menu
										v-model="menu"
										:close-on-content-click="false"
										:nudge-right="40"
										transition="scale-transition"
										offset-y
										min-width="290px"
										outlined
									>
										<template #activator="{ on, attrs }">
											<v-text-field
												v-model="inputBarangLelang.valid_stnk"
												:value="inputBarangLelang.valid_stnk"
												placeholder="Valid STNK"
												v-bind="attrs"
												v-on="on"
												outlined
												dense
												label="Valid STNK"
												color="light-blue darken-3"
												hide-details
												:clearable="editedIndex != 2"
												:readonly="editedIndex == 2"
											/>
										</template>
										<v-date-picker v-model="inputBarangLelang.valid_stnk" @input="menu = false" />
									</v-menu>
                </v-col>
              </v-row>
							<v-row v-if="namaKategori == 'Mobil' || namaKategori == 'Motor'" no-gutters>
                <v-col
                  cols="12"
                  md="4"
                  class="pt-2 d-flex align-center"
                >
                  SPH
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-text-field
										v-model="inputBarangLelang.sph"
										placeholder="Upload"
										outlined
										dense
                  	style="display: none"
									/>
									<input 
										ref="inputSPHFile"
										:key="componentKey"
										type="file"
										accept="application/pdf"
										style="display: none"
										@change="uploadFile($event, 'sph')"
									>
									<v-btn v-if="editedIndex != 2" depressed small color="light-blue darken-3" dark @click="pilihFile('sph')">
										<v-icon small left>{{editedIndex == 0 ? 'add' : 'edit'}}</v-icon> {{editedIndex == 0 ? 'Tambah' : 'Ubah'}} Lampiran
									</v-btn>
									<v-btn v-else-if="editedIndex == 2" depressed small color="light-blue darken-3" dark @click="lookPDF('sph')">
										<v-icon small left>pageview</v-icon> Lihat Lampiran
									</v-btn>
                  <br>
                  <span v-if="this.inputBarangLelang.sph != ''">
										<strong>nama file :</strong> <i>{{this.inputBarangLelang.sph}}</i> {{editedIndex == 0 ? '('+(this.FileSPH.size / (1024*1024)).toFixed(2)+' MB)' : ''}}
										<v-icon small v-if="editedIndex != 2" color="red" @click="hapusFile('sph')">delete</v-icon>
									</span>
                </v-col>
              </v-row>
							<v-row v-if="namaKategori == 'Mobil'" no-gutters>
                <v-col
                  cols="12"
                  md="4"
                  class="pt-2 d-flex align-center"
                >
                  KIR
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-text-field
										v-model="inputBarangLelang.kir"
										placeholder="Upload"
										outlined
										dense
                  	style="display: none"
									/>
									<input 
										ref="inputKIRFile"
										:key="componentKey"
										type="file"
										accept="application/pdf"
										style="display: none"
										@change="uploadFile($event, 'kir')"
									>
									<v-btn v-if="editedIndex != 2" depressed small color="light-blue darken-3" dark @click="pilihFile('kir')">
										<v-icon small left>{{editedIndex == 0 ? 'add' : 'edit'}}</v-icon> {{editedIndex == 0 ? 'Tambah' : 'Ubah'}} Lampiran
									</v-btn>
									<v-btn v-else-if="editedIndex == 2" depressed small color="light-blue darken-3" dark @click="lookPDF('kir')">
										<v-icon small left>pageview</v-icon> Lihat Lampiran
									</v-btn>
                  <br>
                  <span v-if="this.inputBarangLelang.kir != ''">
										<strong>nama file :</strong> <i>{{this.inputBarangLelang.kir}}</i> {{editedIndex == 0 ? '('+(this.FileKIR.size / (1024*1024)).toFixed(2)+' MB)' : ''}}
										<v-icon small v-if="editedIndex != 2" color="red" @click="hapusFile('kir')">delete</v-icon>
									</span>
                </v-col>
              </v-row>
							<v-row v-if="namaKategori == 'Mobil'" no-gutters>
                <v-col
                  cols="12"
                  md="4"
                  class="pt-2 d-flex align-center"
                >
                  Kapasitas Kendaraan
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-text-field
                    v-model="inputBarangLelang.kapasitas_kendaraan"
                    placeholder="Kapasitas Kendaraan"
                    outlined
                    dense
                    label="Kapasitas Kendaraan"
                    color="light-blue darken-3"
                    @keypress.native="onlyNumber($event, 2, inputBarangLelang.kapasitas_kendaraan)"
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
                  Deskripsi
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-textarea
                    v-model="inputBarangLelang.deskripsi"
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
              <div class="mt-3 mb-3">
                <v-divider />
              </div>
							<h2 v-if="namaKategori == 'Mobil' || namaKategori == 'Motor'">Kelengkapan Barang Lelang</h2>
              <div v-if="namaKategori == 'Mobil' || namaKategori == 'Motor'" class="mt-3 mb-3">
                <v-divider />
              </div>
							<v-row v-if="namaKategori == 'Mobil' || namaKategori == 'Motor'" no-gutters>
                <v-col
                  cols="12"
                  md="4"
                  class="pt-2 d-flex align-center"
                >
                  Lampiran STNK
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-text-field
										v-model="inputBarangLelang.filestnk"
										placeholder="Upload"
										outlined
										dense
                  	style="display: none"
									/>
									<input 
										ref="inputSTNKFile"
										:key="componentKey"
										type="file"
										accept="image/x-png,image/jpg,image/jpeg"
										style="display: none"
										@change="uploadFile($event, 'stnk')"
									>
									<v-btn v-if="editedIndex != 2" depressed small color="light-blue darken-3" dark @click="pilihFile('stnk')">
										<v-icon small left>{{editedIndex == 0 ? 'add' : 'edit'}}</v-icon> {{editedIndex == 0 ? 'Tambah' : 'Ubah'}} Lampiran
									</v-btn>
									<v-btn v-else-if="editedIndex == 2" depressed small color="light-blue darken-3" dark @click="viewLampiran('stnk')">
										<v-icon small left>pageview</v-icon> Lihat Lampiran
									</v-btn>
									<br>
									<span v-if="this.inputBarangLelang.filestnk != ''">
										<strong>nama file :</strong> <i>{{this.inputBarangLelang.filestnk}}</i> {{editedIndex == 0 ? '('+(this.FileSTNK.size / (1024*1024)).toFixed(2)+' MB)' : ''}}
										<v-icon small v-if="editedIndex != 2" color="red" @click="hapusFile('stnk')">delete</v-icon>
									</span>
                </v-col>
              </v-row>
							<v-row v-if="namaKategori == 'Mobil' || namaKategori == 'Motor'" no-gutters>
                <v-col
                  cols="12"
                  md="4"
                  class="pt-2 d-flex align-center"
                >
                  Lampiran BPKB
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-text-field
										v-model="inputBarangLelang.filebpkb"
										placeholder="Upload"
										outlined
										dense
                  	style="display: none"
									/>
									<input 
										ref="inputBPKBFile"
										:key="componentKey"
										type="file"
										accept="image/x-png,image/jpg,image/jpeg"
										style="display: none"
										@change="uploadFile($event, 'bpkb')"
									>
									<v-btn v-if="editedIndex != 2" depressed small color="light-blue darken-3" dark @click="pilihFile('bpkb')">
										<v-icon small left>{{editedIndex == 0 ? 'add' : 'edit'}}</v-icon> {{editedIndex == 0 ? 'Tambah' : 'Ubah'}} Lampiran
									</v-btn>
									<v-btn v-else-if="editedIndex == 2" depressed small color="light-blue darken-3" dark @click="viewLampiran('bpkb')">
										<v-icon small left>pageview</v-icon> Lihat Lampiran
									</v-btn>
									<br>
									<span v-if="this.inputBarangLelang.filebpkb != ''">
										<strong>nama file :</strong> <i>{{this.inputBarangLelang.filebpkb}}</i> {{editedIndex == 0 ? '('+(this.FileBPKB.size / (1024*1024)).toFixed(2)+' MB)' : ''}}
										<v-icon small v-if="editedIndex != 2" color="red" @click="hapusFile('bpkb')">delete</v-icon>
									</span>
                </v-col>
              </v-row>
							<v-row no-gutters>
                <v-col
                  cols="12"
                  md="4"
                  class="pt-2 d-flex align-center"
                >
                  Lampiran FAKTUR
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-text-field
										v-model="inputBarangLelang.filefaktur"
										placeholder="Upload"
										outlined
										dense
                  	style="display: none"
									/>
									<input 
										ref="inputFAKTURFile"
										:key="componentKey"
										type="file"
										accept="image/x-png,image/jpg,image/jpeg"
										style="display: none"
										@change="uploadFile($event, 'faktur')"
									>
									<v-btn v-if="editedIndex != 2" depressed small color="light-blue darken-3" dark @click="pilihFile('faktur')">
										<v-icon small left>{{editedIndex == 0 ? 'add' : 'edit'}}</v-icon> {{editedIndex == 0 ? 'Tambah' : 'Ubah'}} Lampiran
									</v-btn>
									<v-btn v-else-if="editedIndex == 2" depressed small color="light-blue darken-3" dark @click="viewLampiran('faktur')">
										<v-icon small left>pageview</v-icon> Lihat Lampiran
									</v-btn>
									<br>
									<span v-if="this.inputBarangLelang.filefaktur != ''">
										<strong>nama file :</strong> <i>{{this.inputBarangLelang.filefaktur}}</i> {{editedIndex == 0 ? '('+(this.FileFAKTUR.size / (1024*1024)).toFixed(2)+' MB)' : ''}}
										<v-icon small v-if="editedIndex != 2" color="red" @click="hapusFile('faktur')">delete</v-icon>
									</span>
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
										v-model="inputBarangLelang.filektp"
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
									<span v-if="this.inputBarangLelang.filektp != ''">
										<strong>nama file :</strong> <i>{{this.inputBarangLelang.filektp}}</i> {{editedIndex == 0 ? '('+(this.FileKTP.size / (1024*1024)).toFixed(2)+' MB)' : ''}}
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
                  Lampiran KWITANSI
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-text-field
										v-model="inputBarangLelang.filekwitansi"
										placeholder="Upload"
										outlined
										dense
                  	style="display: none"
									/>
									<input 
										ref="inputKWITANSIFile"
										:key="componentKey"
										type="file"
										accept="image/x-png,image/jpg,image/jpeg"
										style="display: none"
										@change="uploadFile($event, 'kwitansi')"
									>
									<v-btn v-if="editedIndex != 2" depressed small color="light-blue darken-3" dark @click="pilihFile('kwitansi')">
										<v-icon small left>{{editedIndex == 0 ? 'add' : 'edit'}}</v-icon> {{editedIndex == 0 ? 'Tambah' : 'Ubah'}} Lampiran
									</v-btn>
									<v-btn v-else-if="editedIndex == 2" depressed small color="light-blue darken-3" dark @click="viewLampiran('kwitansi')">
										<v-icon small left>pageview</v-icon> Lihat Lampiran
									</v-btn>
									<br>
									<span v-if="this.inputBarangLelang.filekwitansi != ''">
										<strong>nama file :</strong> <i>{{this.inputBarangLelang.filekwitansi}}</i> {{editedIndex == 0 ? '('+(this.FileKWITANSI.size / (1024*1024)).toFixed(2)+' MB)' : ''}}
										<v-icon small v-if="editedIndex != 2" color="red" @click="hapusFile('kwitansi')">delete</v-icon>
									</span>
                </v-col>
              </v-row>
              <div v-if="editedIndex == 2">
                <div class="mt-3 mb-3">
                  <v-divider />
                </div>
                <div v-if="MultilpeBarangLelangUtama.length > 0">
                  <h4 class="text-center">Gambar Utama Barang Lelang</h4>
                  <v-row no-gutters>
                    <v-col
                    class="ma-1 d-flex flex-column justify-space-between align-center"
                    v-for="(file,f) in MultilpeBarangLelangUtama" :key="f"
                    >
                      <img class="gambar" :ref="'file'" :src="imageMultipleUtama[f].url" :title="file.gambar" width="150" />
                      <p>{{ imageMultipleUtama[f].title }}</p>
                    </v-col>
                  </v-row>
                  <div class="mt-3 mb-3">
                    <v-divider />
                  </div>
                  <h4 class="text-center">Gambar Kondisi Barang Lelang</h4>
                  <v-row no-gutters>
                    <v-col
                    class="ma-1 d-flex flex-column justify-space-between align-center"
                    v-for="(file,f) in MultilpeBarangLelangKondisi" :key="f"
                    >
                      <img class="gambar" :ref="'file'" :src="imageMultipleKondisi[f].url" :title="file.gambar" width="150" />
                      <p>{{ imageMultipleKondisi[f].title }}</p>
                    </v-col>
                  </v-row>
                </div>
                <v-row v-else no-gutters>
                  <v-col class="ma-1 d-flex flex-column justify-space-between align-center">
                    <strong>Foto Barang Lelang tidak tersedia</strong>
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
      v-model="dialogViewer"
      transition="dialog-bottom-transition"
      persistent
      width="800px"
    >
      <PDFViewer
        :url-sk.sync="urlPDF"
        @cancel="dialogViewer = false"
      />
    </v-dialog>
		<v-dialog
      v-model="DialogViewLampiranBarangLelang"
      width="600px"
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="light-blue darken-3"
        >
          <v-toolbar-title>View Lampiran Data Barang Lelang</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <v-btn
              icon
              dark
              @click="DialogViewLampiranBarangLelang = false"
            >
              <v-icon>close</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card tile>
          <div class="scrollTextGBR">
            <v-card-text class="d-flex flex-column justify-space-between align-center">
              <img class="gambar" :src="this.urlView" width="400"/>
            </v-card-text>
          </div>
        </v-card>
      </v-card>
		</v-dialog>
		<v-dialog
      v-model="DialogCropBarangLelang"
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
      v-model="DialogUploadMultipleBarangLelang"
      width="1000px"
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="light-blue darken-3"
        >
          <v-toolbar-title>Upload Foto Barang Lelang</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <v-btn
              icon
              dark
              @click="() => { imageMultipleUtama = []; MultilpeBarangLelangUtama = []; inputBarangLelang.UnixText = ''; DialogUploadMultipleBarangLelang = false; }"
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
                        v-model="MultilpeBarangLelangUtama"
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
                        <v-icon small left>upload</v-icon> Foto Barang Lelang
                      </v-btn>
                    </v-col>  
                  </v-row>
                  <v-row>
                    <v-col
                      class="ma-1 d-flex flex-column justify-space-between align-center"
                      v-for="(file,f) in MultilpeBarangLelangUtama" :key="f"
                      >
                      <div>
                        <div class="kotakGambar">
                          <img :ref="'file'" :src="imageMultipleUtama[f].url" :title="file.name" width="250"/>
                          <v-icon small color="red" @click="HapusMultiple(f)">delete</v-icon>
                        </div>
                        <v-autocomplete
                          v-model="imageMultipleUtama[f].kategori"
                          :items="KategoriFotoOptions"
                          item-text="text"
                          item-value="value"
                          placeholder="Kategori Foto"
                          label="Kategori Foto"
                          class="mt-1"
                          outlined
                          dense
                          hide-details
                        />
                        <v-text-field
                          v-model="imageMultipleUtama[f].title"
                          placeholder="Title"
                          outlined
                          dense
                          label="Title"
                          color="light-blue darken-3"
                          class="mt-1"
                          hide-details
                          clearable
                        />
                      </div>
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
                      :disabled="imageMultipleUtama.length && MultilpeBarangLelangUtama.length ? false : true"
                      @click="() => { imageMultipleUtama = []; MultilpeBarangLelangUtama = []; }"
                    >
                      Batal
                    </v-btn>
                    <v-btn
                      color="light-blue darken-3"
                      class="white--text text--darken-2"
                      small
                      dense
                      depressed
                      :disabled="imageMultipleUtama.length && MultilpeBarangLelangUtama.length ? false : true"
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
import PDFViewer from "../../Layout/PDFViewer.vue";
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
  name: 'BarangLelang',
	components: { PopUpNotifikasiVue, PDFViewer, Cropper },
	data: () => ({
		isLoading: false,
    roleID: '',
		DataBarangLelang: [],
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
      { text: "Kategori", value: "kategori", sortable: false },
      { text: "Nama Barang", value: "namaBarangLelang", sortable: false },
      { text: "No. Kelengkapan", value: "no_kelengkapan", sortable: false },
      { text: "Status", value: "statusAktif", sortable: false },
    ],
    rowsPerPageItems: { "items-per-page-options": [5, 10, 25, 50] },
    totalItems: 0,
		kategoriOptions: [],
		transmisiOptions: [
			{value: 'Manual', text: 'Manual'},
			{value: 'Automatic', text: 'Automatic'},
		],
		bahanbakarOptions: [
			{value: 'Bensin', text: 'Bensin'},
			{value: 'Solar', text: 'Solar'},
		],
		KategoriFotoOptions: [
			{value: 'Utama', text: 'Foto Utama'},
			{value: 'Kondisi', text: 'Foto Kondisi'},
		],
		DialogBarangLelang: false,
		DialogViewLampiranBarangLelang: false,
		DialogUploadMultipleBarangLelang: false,
		DialogCropBarangLelang: false,
		dialogViewer: false,
		editedIndex: 3,
    kondisiTombol: true,
    namaKategori: '',
		inputBarangLelang: {
			UnixText: '',
			id_barang_lelang: '',
			id_kategori: '',
			nama_barang_lelang: '',
			nama_pemilik: '',
			brand: '',
			warna: '',
			tahun: '',
			lokasi_barang: '',
			no_rangka: '',
			no_mesin: '',
			tipe_model: '',
			transmisi: '',
			bahan_bakar: '',
			odometer: '',
			grade: '',
			grade_interior: '',
			grade_eksterior: '',
			grade_mesin: '',
			no_polisi: '',
			valid_stnk: '',
			sph: '',
			kir: '',
			kapasitas_kendaraan: '',
			deskripsi: '',
			filestnk: '',
			filebpkb: '',
			filefaktur: '',
			filektp: '',
			filekwitansi: '',
		},
    image: {
      src: null,
      type: null,
      jenis: null,
    },
    imageMultipleUtama: [],
    imageMultipleKondisi: [],
    MultilpeBarangLelangUtama: [],
    MultilpeBarangLelangKondisi: [],
		menu: false,
		componentKey: 0,
		FileSTNK: '',
		FileBPKB: '',
		FileFAKTUR: '',
		FileKTP: '',
		FileKWITANSI: '',
		FileSPH: '',
		FileKIR: '',
		urlView: '',
		KumpulFile: {
			fileSTNK: '',
			fileBPKB: '',
			fileFAKTUR: '',
			fileKTP: '',
			fileKWITANSI: '',
		},
    urlPDF: window.location.href,

		//notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
	}),
	metaInfo: {
		title: "Lelang (Barang) - WIN.ID",
		htmlAttrs: {
			lang: "id",
			amp: true,
		},
	},
	computed: {
		tahunOptions(){
			let date = new Date().toISOString().slice(0,10)
			const [tahun, bulan, hari] = date.split("-");
			let tahun_awal = parseInt(tahun) - 10
			let tahun_akhir = parseInt(tahun) + 10
			let result = []
			for(let i=tahun_awal; i<=tahun_akhir; i++){
				const parameters = {
					text: i
				}
				let objectBaru = Object.assign(parameters);
				result.push(objectBaru)
			}
			return result
		}
	},
	watch: {
    FileSTNK(){
			if(this.FileSTNK == undefined){
				this.FileSTNK = ''
			}	
		},
    FileBPKB(){
			if(this.FileBPKB == undefined){
				this.FileBPKB = ''
			}	
		},
    FileFAKTUR(){
			if(this.FileFAKTUR == undefined){
				this.FileFAKTUR = ''
			}	
		},
    FileKTP(){
			if(this.FileKTP == undefined){
				this.FileKTP = ''
			}	
		},
    FileKWITANSI(){
			if(this.FileKWITANSI == undefined){
				this.FileKWITANSI = ''
			}	
		},
    FileSPH(){
			if(this.FileSPH == undefined){
				this.FileSPH = ''
			}	
		},
    FileKIR(){
			if(this.FileKIR == undefined){
				this.FileKIR = ''
			}	
		},
		inputBarangLelang: {
			deep: true,
			handler(value) {
        if(value.id_kategori == null){ this.inputBarangLelang.id_kategori = '' }
        if(value.nama_barang_lelang == null){ this.inputBarangLelang.nama_barang_lelang = '' }
        if(value.nama_pemilik == null){ this.inputBarangLelang.nama_pemilik = '' }
        if(value.brand == null){ this.inputBarangLelang.brand = '' }
        if(value.warna == null){ this.inputBarangLelang.warna = '' }
				if(value.tahun == null){ this.inputBarangLelang.tahun = '' }
				if(value.lokasi_barang == null){ this.inputBarangLelang.lokasi_barang = '' }
				if(value.no_rangka == null){ this.inputBarangLelang.no_rangka = '' }
				value.no_rangka = this.UpperCaseLetter(value.no_rangka)
				if(value.no_mesin == null){ this.inputBarangLelang.no_mesin = '' }
				value.no_mesin = this.UpperCaseLetter(value.no_mesin)
				if(value.tipe_model == null){ this.inputBarangLelang.tipe_model = '' }
				if(value.transmisi == null){ this.inputBarangLelang.transmisi = '' }
				if(value.bahan_bakar == null){ this.inputBarangLelang.bahan_bakar = '' }
				if(value.odometer == null){ this.inputBarangLelang.odometer = '' }
				if(value.grade == null){ this.inputBarangLelang.grade = '' }
				if(value.grade_interior == null){ this.inputBarangLelang.grade_interior = '' }
				if(value.grade_eksterior == null){ this.inputBarangLelang.grade_eksterior = '' }
				if(value.grade_mesin == null){ this.inputBarangLelang.grade_mesin = '' }
				if(value.no_polisi == null){ this.inputBarangLelang.no_polisi = '' }
        value.no_polisi = this.UpperCaseLetter(value.no_polisi)
				// if(value.sph == null){ this.inputBarangLelang.sph = '' }
				// if(value.kir == null){ this.inputBarangLelang.kir = '' }
				if(value.kapasitas_kendaraan == null){ this.inputBarangLelang.kapasitas_kendaraan = '' }
				if(value.deskripsi == null){ this.inputBarangLelang.deskripsi = '' }

        this.kategoriOptions.filter(val => { 
          if (val.idKategori == value.id_kategori) {
            this.namaKategori = val.kategori ? val.kategori : '' 
          }
        })
        if(this.namaKategori == 'Mobil' || this.namaKategori == 'Motor'){
          if(value.id_kategori != '' && value.nama_barang_lelang != '' && value.nama_pemilik != '' && value.brand != '' && value.warna != '' && value.tahun != '' &&
            value.lokasi_barang != '' && value.no_rangka != '' && value.no_mesin != '' && value.tipe_model != '' && value.transmisi != '' && value.bahan_bakar != '' &&
            value.odometer != '' && value.grade != '' && value.grade_interior != '' && value.grade_eksterior != '' && value.grade_mesin != '' && value.no_polisi != '' &&
            value.sph != '' && value.kir != '' && value.kapasitas_kendaraan != '' && value.deskripsi != '' && value.filestnk != '' && value.filebpkb != '' &&
            value.filefaktur != '' && value.filektp != '' && value.filekwitansi != ''){
            this.kondisiTombol = false
          }else{
            this.kondisiTombol = true
          }
        }else{
          if(value.id_kategori != '' && value.nama_barang_lelang != '' && value.nama_pemilik != '' && value.brand != '' && value.warna != '' && value.tahun != '' && 
            value.lokasi_barang != '' && value.tipe_model != '' && value.grade != '' && value.deskripsi != '' && value.filefaktur != '' && value.filektp != '' &&
            value.filekwitansi != ''){
            this.kondisiTombol = false
          }else{
            this.kondisiTombol = true
          }
        }

			}
		}
	},
  updated(){
		// if(this.editedIndex == 0){ this.inputBarangLelang.UnixText = `BarangLelang${this.convertDate(new Date().toISOString().slice(0,10))}${this.makeRandom(8)}` }
	},
	mounted() {
    this.roleID = localStorage.getItem("roleID")
		this.getBarangLelang()
	},
	methods: {
		...mapActions({
      fetchData: "fetchData",
      uploadFiles: "upload/uploadFiles",
      uploadBerkas: "upload/uploadBerkas",
    }),
		getBarangLelang() {
      this.isLoading = true
			let payload = {
        method: "get",
				url: `lelang/getBarangLelang`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
        this.DataBarangLelang = res.data.result;
        this.isLoading = false
			})
			.catch((err) => {
        this.isLoading = false
        this.notifikasi("error", err.response.data.message, "1")
			});
		},
		getKategoriBarangLelang() {
			let payload = {
				method: "get",
				url: `lelang/getKategoriLelang?status_aktif=1`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				this.kategoriOptions = res.data.result;
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
		},
		getFotoBarangLelang(id) {
			let payload = {
				method: "get",
				url: `lelang/getFotoBarangLelang/${id}`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				this.MultilpeBarangLelangUtama = res.data.result.dataFotoBarangLelang.FotoMobil;
				this.MultilpeBarangLelangKondisi = res.data.result.dataFotoBarangLelang.FotoKondisiMobil;
			  const API_URL = process.env.VUE_APP_NODE_ENV === "production" ? process.env.VUE_APP_VIEW_PROD_API_URL : process.env.VUE_APP_VIEW_DEV_API_URL
        this.MultilpeBarangLelangUtama.forEach((element) => {
          this.imageMultipleUtama.push({ 
            title: element.title,
            kategori: element.kategori,
            url: `${API_URL}image/kelengkapan-barang-lelang/${element.gambar}`,
          })
        })
        this.MultilpeBarangLelangKondisi.forEach((element) => {
          this.imageMultipleKondisi.push({ 
            title: element.title,
            kategori: element.kategori,
            url: `${API_URL}image/kelengkapan-barang-lelang/${element.gambar}`,
          })
        })
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
		},
		bukaDialog(item, index){
      this.editedIndex = index
			this.getKategoriBarangLelang()
      if(index == 0){
        this.clearForm()
        this.namaKategori = ''
        this.inputBarangLelang.UnixText = `BarangLelang${this.convertDate(new Date().toISOString().slice(0,10))}${this.makeRandom(8)}`
      }else{
        if(index == 2){ this.getFotoBarangLelang(item.idBarangLelang) }
        this.namaKategori = item.namaKategori ? item.namaKategori : ''
        this.inputBarangLelang.UnixText = item.UnixText ? item.UnixText : ''
        this.inputBarangLelang.id_kategori = item.statusKategoriLelang == true ? item.idKategori ? item.idKategori : '' : ''
        this.inputBarangLelang.id_barang_lelang = item.idBarangLelang ? item.idBarangLelang : ''
        this.inputBarangLelang.nama_barang_lelang = item.namaBarangLelang ? item.namaBarangLelang : ''
        this.inputBarangLelang.nama_pemilik = item.namaPemilik ? item.namaPemilik : ''
				this.inputBarangLelang.brand = item.brand ? item.brand : ''
				this.inputBarangLelang.warna = item.warna ? item.warna : ''
				this.inputBarangLelang.tahun = item.tahun ? item.tahun : ''
				this.inputBarangLelang.lokasi_barang = item.lokasiBarang ? item.lokasiBarang : ''
				this.inputBarangLelang.no_rangka = item.noRangka ? item.noRangka : ''
				this.inputBarangLelang.no_mesin = item.noMesin ? item.noMesin : ''
				this.inputBarangLelang.tipe_model = item.tipeModel ? item.tipeModel : ''
				this.inputBarangLelang.transmisi = item.transmisi ? item.transmisi : ''
				this.inputBarangLelang.bahan_bakar = item.bahanBakar ? item.bahanBakar : ''
				this.inputBarangLelang.odometer = item.odometer ? item.odometer : ''
				this.inputBarangLelang.grade = item.grade ? item.grade : ''
				this.inputBarangLelang.grade_interior = item.gradeInterior ? item.gradeInterior : ''
				this.inputBarangLelang.grade_eksterior = item.gradeEksterior ? item.gradeEksterior : ''
				this.inputBarangLelang.grade_mesin = item.gradeMesin ? item.gradeMesin : ''
				this.inputBarangLelang.no_polisi = item.noPolisi ? item.noPolisi : ''
				this.inputBarangLelang.valid_stnk = item.validSTNK ? item.validSTNK : ''
				this.inputBarangLelang.sph = item.sph ? item.sph : ''
				this.inputBarangLelang.kir = item.kir ? item.kir : ''
				this.inputBarangLelang.kapasitas_kendaraan = item.kapasitasKendaraan ? item.kapasitasKendaraan : ''
				this.inputBarangLelang.deskripsi = item.deskripsi ? item.deskripsi : ''
				this.inputBarangLelang.filestnk = item.stnk ? item.stnk : ''
				this.inputBarangLelang.filebpkb = item.bpkb ? item.bpkb : ''
				this.inputBarangLelang.filefaktur = item.faktur ? item.faktur : ''
				this.inputBarangLelang.filektp = item.ktpPemilik ? item.ktpPemilik : ''
				this.inputBarangLelang.filekwitansi = item.kwitansi ? item.kwitansi : ''
      }
      this.DialogBarangLelang = true
    },
    tutupDialog() {
      this.clearForm()
      this.editedIndex = 3
      this.DialogBarangLelang = false
    },
		async SimpanForm(index, dataUpload) {
			let bodyData = {
				jenis: index == 0 ? 'ADD' : 'EDIT',
				UnixText: this.inputBarangLelang.UnixText,
        id_barang_lelang: index == 0 ? '' : this.inputBarangLelang.id_barang_lelang,
				id_kategori: this.inputBarangLelang.id_kategori,
				nama_barang_lelang: this.inputBarangLelang.nama_barang_lelang,
				nama_pemilik: this.inputBarangLelang.nama_pemilik,
				brand: this.inputBarangLelang.brand,
				warna: this.inputBarangLelang.warna,
				tahun: this.inputBarangLelang.tahun,
				lokasi_barang: this.inputBarangLelang.lokasi_barang,
				no_rangka: this.namaKategori == 'Mobil' || this.namaKategori == 'Motor' ? this.inputBarangLelang.no_rangka : null,
				no_mesin: this.namaKategori == 'Mobil' || this.namaKategori == 'Motor' ? this.inputBarangLelang.no_mesin : null,
				tipe_model: this.inputBarangLelang.tipe_model,
				transmisi: this.namaKategori == 'Mobil' || this.namaKategori == 'Motor' ? this.inputBarangLelang.transmisi : null,
				bahan_bakar: this.namaKategori == 'Mobil' || this.namaKategori == 'Motor' ? this.inputBarangLelang.bahan_bakar : null,
				odometer: this.namaKategori == 'Mobil' || this.namaKategori == 'Motor' ? this.inputBarangLelang.odometer : null,
				grade: this.inputBarangLelang.grade,
				grade_interior: this.namaKategori == 'Mobil' || this.namaKategori == 'Motor' ? this.inputBarangLelang.grade_interior : null,
				grade_eksterior: this.namaKategori == 'Mobil' || this.namaKategori == 'Motor' ? this.inputBarangLelang.grade_eksterior : null,
				grade_mesin: this.namaKategori == 'Mobil' || this.namaKategori == 'Motor' ? this.inputBarangLelang.grade_mesin : null,
				no_polisi: this.namaKategori == 'Mobil' || this.namaKategori == 'Motor' ? this.inputBarangLelang.no_polisi : null,
				valid_stnk: this.namaKategori == 'Mobil' || this.namaKategori == 'Motor' ? this.inputBarangLelang.valid_stnk : null,
				sph: this.namaKategori == 'Mobil' || this.namaKategori == 'Motor' ? this.inputBarangLelang.sph : null,
				kir: this.namaKategori == 'Mobil' ? this.inputBarangLelang.kir : null,
				kapasitas_kendaraan: this.namaKategori == 'Mobil' || this.namaKategori == 'Motor' ? this.inputBarangLelang.kapasitas_kendaraan : null,
				deskripsi: this.inputBarangLelang.deskripsi,
				filestnk: this.namaKategori == 'Mobil' || this.namaKategori == 'Motor' ? this.inputBarangLelang.filestnk : null,
				filebpkb: this.namaKategori == 'Mobil' || this.namaKategori == 'Motor' ? this.inputBarangLelang.filebpkb : null,
				filefaktur: this.inputBarangLelang.filefaktur,
				filektp: this.inputBarangLelang.filektp,
				filekwitansi: this.inputBarangLelang.filekwitansi,
				create_update_by: localStorage.getItem('idLogin'),
			}
      // return console.log(bodyData, dataUpload);
			let payload = {
				method: "post",
				url: `lelang/postBarangLelang`,
			  body: bodyData,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then(async (res) => {
				if(this.FileSTNK || this.FileBPKB || this.FileFAKTUR || this.FileKTP || this.FileKWITANSI || this.FileSPH || this.FileKIR){
					let uploadSTNK = await this.uploadLampiran(index, dataUpload.fileSTNK, 'stnk')
					let uploadBPKB = await this.uploadLampiran(index, dataUpload.fileBPKB, 'bpkb')
					let uploadFAKTUR = await this.uploadLampiran(index, dataUpload.fileFAKTUR, 'faktur')
					let uploadKTP = await this.uploadLampiran(index, dataUpload.fileKTP, 'ktp')
					let uploadKWITANSI = await this.uploadLampiran(index, dataUpload.fileKWITANSI, 'kwitansi')
					let uploadSPH = await this.uploadLampiranBerkas(index, this.FileSPH, 'sph')
					let uploadKIR = await this.uploadLampiranBerkas(index, this.FileKIR, 'kir')
          // console.log(uploadSPH, uploadKIR);
          let aksi = []
          if(uploadSTNK != undefined){ aksi.push('sukses') }else{ aksi.push('gagal') }
          if(uploadBPKB != undefined){ aksi.push('sukses') }else{ aksi.push('gagal') }
          if(uploadFAKTUR != undefined){ aksi.push('sukses') }else{ aksi.push('gagal') }
          if(uploadKTP != undefined){ aksi.push('sukses') }else{ aksi.push('gagal') }
          if(uploadKWITANSI != undefined){ aksi.push('sukses') }else{ aksi.push('gagal') }
          if(uploadSPH != undefined){ aksi.push('sukses') }else{ aksi.push('gagal') }
          if(uploadKIR != undefined){ aksi.push('sukses') }else{ aksi.push('gagal') }
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
				this.DialogBarangLelang = false
				this.getBarangLelang()
			})
			.catch((err) => {
				this.DialogBarangLelang = false
				this.getBarangLelang()
				this.notifikasi("error", err.response.data.message, "1")
			});
    },
		async uploadLampiran(index, dataUpload, part) {
			if(dataUpload){
				const bodyData = {
					proses: index == 0 ? 'ADD' : 'EDIT',
					id: index == 0 ? null : this.inputBarangLelang.id_barang_lelang,
					nama_barang_lelang: this.inputBarangLelang.nama_barang_lelang,
          nama_folder: this.inputBarangLelang.UnixText,
					nama_file: `BarangLelang-${part}-${this.convertDate(new Date().toISOString().slice(0,10))}${this.makeRandom(8)}`,
					jenis: "images",
					bagian: "barang_lelang",
					table: "m_barang_lelang",
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
		async uploadLampiranBerkas(index, dataUpload, part) {
			if(dataUpload){
				const bodyData = {
					proses: index == 0 ? 'ADD' : 'EDIT',
					id: index == 0 ? null : this.inputBarangLelang.id_barang_lelang,
					nama_barang_lelang: this.inputBarangLelang.nama_barang_lelang,
          nama_folder: this.inputBarangLelang.UnixText,
					nama_file: `BarangLelang-${part}-${this.convertDate(new Date().toISOString().slice(0,10))}${this.makeRandom(8)}`,
					jenis: "images",
					bagian: "barang_lelang",
					table: "m_barang_lelang",
					files: dataUpload,
				};
				try {
					let response = await this.uploadBerkas(bodyData);
          // console.log(response);
					return response
				} catch (err) {
					this.notifikasi("error", err.response.data.message, "1")
				}
			}
		},
    HapusRecord(item) {
      let bodyData = {
        jenis: 'DELETE',
        id_barang_lelang: item.idBarangLelang,
        id_kategori: item.idKategori,
        nama_barang_lelang: item.namaBarangLelang,
        delete_by: localStorage.getItem('idLogin'),
      }
      let payload = {
				method: "post",
				url: `lelang/postBarangLelang`,
        body: bodyData,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
        this.DialogBarangLelang = false
        this.getBarangLelang()
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
				this.DialogBarangLelang = false
				this.getBarangLelang()
				this.notifikasi("error", err.response.data.message, "1")
			});
    },
    StatusRecord(item, status_aktif) {
      let bodyData = {
        jenis: 'STATUSRECORD',
        id_barang_lelang: item.idBarangLelang,
        id_kategori: item.idKategori,
        nama_barang_lelang: item.namaBarangLelang,
        status_aktif: status_aktif,
      }
      let payload = {
				method: "post",
				url: `lelang/postBarangLelang`,
        body: bodyData,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
        this.DialogBarangLelang = false
        this.getBarangLelang()
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
				this.DialogBarangLelang = false
				this.getBarangLelang()
				this.notifikasi("error", err.response.data.message, "1")
			});
    },
		clearForm() {
      this.inputBarangLelang.UnixText = ''
      this.inputBarangLelang.id_barang_lelang = ''
      this.inputBarangLelang.id_kategori = ''
      this.inputBarangLelang.nama_barang_lelang = ''
			this.inputBarangLelang.brand = ''
			this.inputBarangLelang.warna = ''
			this.inputBarangLelang.tahun = ''
			this.inputBarangLelang.lokasi_barang = ''
			this.inputBarangLelang.no_rangka = ''
			this.inputBarangLelang.no_mesin = ''
			this.inputBarangLelang.tipe_model = ''
			this.inputBarangLelang.transmisi = ''
			this.inputBarangLelang.bahan_bakar = ''
			this.inputBarangLelang.odometer = ''
			this.inputBarangLelang.grade = ''
			this.inputBarangLelang.grade_interior = ''
			this.inputBarangLelang.grade_eksterior = ''
			this.inputBarangLelang.grade_mesin = ''
			this.inputBarangLelang.no_polisi = ''
			this.inputBarangLelang.valid_stnk = ''
			this.inputBarangLelang.sph = ''
			this.inputBarangLelang.kir = ''
			this.inputBarangLelang.kapasitas_kendaraan = ''
			this.inputBarangLelang.deskripsi = ''
			this.inputBarangLelang.filestnk = ''
			this.inputBarangLelang.filebpkb = ''
			this.inputBarangLelang.filefaktur = ''
			this.inputBarangLelang.filektp = ''
			this.inputBarangLelang.filekwitansi = ''
      this.FileSTNK = ''
      this.FileBPKB = ''
      this.FileFAKTUR = ''
      this.FileKTP = ''
      this.FileKWITANSI = ''
      this.FileSPH = ''
      this.FileKIR = ''
			this.KumpulFile = {
				fileSTNK: '',
				fileBPKB: '',
				fileFAKTUR: '',
				fileKTP: '',
				fileKWITANSI: '',
			}
      this.MultilpeBarangLelangUtama = []
      this.imageMultipleUtama = []
      this.namaKategori = ''
    },
		pilihFile(jenis) {
			if(jenis == 'stnk'){ this.$refs.inputSTNKFile.click() }
			else if(jenis == 'bpkb'){ this.$refs.inputBPKBFile.click(); }
			else if(jenis == 'faktur'){ this.$refs.inputFAKTURFile.click(); }
			else if(jenis == 'ktp'){ this.$refs.inputKTPFile.click(); }
			else if(jenis == 'kwitansi'){ this.$refs.inputKWITANSIFile.click(); }
			else if(jenis == 'sph'){ this.$refs.inputSPHFile.click(); }
			else if(jenis == 'kir'){ this.$refs.inputKIRFile.click(); }
    },
		async uploadFile(e, jenis) {
			if(jenis == 'stnk'){ 
				this.FileSTNK = await e.target.files[0];
				this.inputBarangLelang.filestnk = this.FileSTNK.name;
        this.loadImage(this.FileSTNK, jenis)
			}else if(jenis == 'bpkb'){ 
        this.FileBPKB = await e.target.files[0];
				this.inputBarangLelang.filebpkb = this.FileBPKB.name;
        this.loadImage(this.FileBPKB, jenis)
			}else if(jenis == 'faktur'){ 
        this.FileFAKTUR = await e.target.files[0];
				this.inputBarangLelang.filefaktur = this.FileFAKTUR.name;
        this.loadImage(this.FileFAKTUR, jenis)
			}else if(jenis == 'ktp'){ 
        this.FileKTP = await e.target.files[0];
				this.inputBarangLelang.filektp = this.FileKTP.name;
        this.loadImage(this.FileKTP, jenis)
			}else if(jenis == 'kwitansi'){ 
        this.FileKWITANSI = await e.target.files[0];
				this.inputBarangLelang.filekwitansi = this.FileKWITANSI.name;
        this.loadImage(this.FileKWITANSI, jenis)
			}else if(jenis == 'sph'){ 
        this.FileSPH = await e.target.files[0];
				this.inputBarangLelang.sph = this.FileSPH.name;
			}else if(jenis == 'kir'){ 
        this.FileKIR = await e.target.files[0];
				this.inputBarangLelang.kir = this.FileKIR.name;
        // console.log(this.FileKIR);
			}
    },
    lookPDF(jenis) {
      this.urlPDF = "";
      const API_URL = process.env.VUE_APP_NODE_ENV === "production" ? process.env.VUE_APP_VIEW_PROD_API_URL : process.env.VUE_APP_VIEW_DEV_API_URL
      let Link = "";
      if(jenis == 'sph'){
        Link = this.inputBarangLelang.sph
      }else if(jenis == 'kir'){
        Link = this.inputBarangLelang.kir
      }
      fetch(`${API_URL}pdf/kelengkapan-barang-lelang/${Link}`, {
        method: 'GET',
        dataType: "xml",
      })
      .then(response => response.arrayBuffer())
      .then(async response => {
        let blob = new Blob([response], { type: 'application/pdf' })
        this.urlPDF = window.URL.createObjectURL(blob)
      })
      setTimeout(() => {
        this.dialogViewer = true;
      }, 1500);
    },
    loadImage(files, jenis) {
      this.DialogCropBarangLelang = true
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
        if(this.image.jenis == 'stnk'){
          this.FileSTNK = blob
          this.KumpulFile = {
            fileSTNK: this.FileSTNK,
            fileBPKB: this.FileBPKB,
            fileFAKTUR: this.FileFAKTUR,
            fileKTP: this.FileKTP,
            fileKWITANSI: this.FileKWITANSI,
          }
        }else if(this.image.jenis == 'bpkb'){
          this.FileBPKB = blob
          this.KumpulFile = {
            fileSTNK: this.FileSTNK,
            fileBPKB: this.FileBPKB,
            fileFAKTUR: this.FileFAKTUR,
            fileKTP: this.FileKTP,
            fileKWITANSI: this.FileKWITANSI,
          }
        }else if(this.image.jenis == 'faktur'){
          this.FileFAKTUR = blob
          this.KumpulFile = {
            fileSTNK: this.FileSTNK,
            fileBPKB: this.FileBPKB,
            fileFAKTUR: this.FileFAKTUR,
            fileKTP: this.FileKTP,
            fileKWITANSI: this.FileKWITANSI,
          }
        }else if(this.image.jenis == 'ktp'){
          this.FileKTP = blob
          this.KumpulFile = {
            fileSTNK: this.FileSTNK,
            fileBPKB: this.FileBPKB,
            fileFAKTUR: this.FileFAKTUR,
            fileKTP: this.FileKTP,
            fileKWITANSI: this.FileKWITANSI,
          }
        }else if(this.image.jenis == 'kwitansi'){
          this.FileKWITANSI = blob
          this.KumpulFile = {
            fileSTNK: this.FileSTNK,
            fileBPKB: this.FileBPKB,
            fileFAKTUR: this.FileFAKTUR,
            fileKTP: this.FileKTP,
            fileKWITANSI: this.FileKWITANSI,
          }
        }
			}, this.image.type);
      this.DialogCropBarangLelang = false
		},
		hapusFile(jenis){
			if(jenis == 'stnk'){ 
				this.FileSTNK = ''
				this.inputBarangLelang.filestnk = '';
				this.KumpulFile.fileSTNK = ''
			}else if(jenis == 'bpkb'){ 
				this.FileBPKB = ''
				this.inputBarangLelang.filebpkb = '';
				this.KumpulFile.fileBPKB = ''
			}else if(jenis == 'faktur'){ 
				this.FileFAKTUR = ''
				this.inputBarangLelang.filefaktur = '';
				this.KumpulFile.fileFAKTUR = ''
			}else if(jenis == 'ktp'){ 
				this.FileKTP = ''
				this.inputBarangLelang.filektp = '';
				this.KumpulFile.fileKTP = ''
			}else if(jenis == 'kwitansi'){ 
				this.FileKWITANSI = '' 
				this.inputBarangLelang.filekwitansi = '';
				this.KumpulFile.fileKWITANSI = ''
			}else if(jenis == 'sph'){ 
				this.FileSPH = '' 
				this.inputBarangLelang.sph = '';
			}else if(jenis == 'kir'){ 
				this.FileKIR = '' 
				this.inputBarangLelang.kir = '';
			}
		},
    tutupDialogCrop(jenis){
      this.hapusFile(jenis)
      this.editedIndex = 3
      this.DialogCropBarangLelang = false
    },
		viewLampiran(lampiran) {
			this.DialogViewLampiranBarangLelang = true
			const API_URL = process.env.VUE_APP_NODE_ENV === "production" ? process.env.VUE_APP_VIEW_PROD_API_URL : process.env.VUE_APP_VIEW_DEV_API_URL
      const no_image = `${API_URL}No_Image_Available.jpg`
			if(lampiran == 'stnk'){
				this.urlView = this.inputBarangLelang.filestnk ? `${API_URL}image/kelengkapan-barang-lelang/${this.inputBarangLelang.filestnk}` : no_image
				// this.urlView = this.inputBarangLelang.filestnk ? `${API_URL}${this.inputBarangLelang.filestnk}` : no_image
			}else if(lampiran == 'bpkb'){
				this.urlView = this.inputBarangLelang.filebpkb ? `${API_URL}image/kelengkapan-barang-lelang/${this.inputBarangLelang.filebpkb}` : no_image
				// this.urlView = this.inputBarangLelang.filebpkb ? `${API_URL}${this.inputBarangLelang.filebpkb}` : no_image
			}else if(lampiran == 'faktur'){
				this.urlView = this.inputBarangLelang.filefaktur ? `${API_URL}image/kelengkapan-barang-lelang/${this.inputBarangLelang.filefaktur}` : no_image
				// this.urlView = this.inputBarangLelang.filefaktur ? `${API_URL}${this.inputBarangLelang.filefaktur}` : no_image
			}else if(lampiran == 'ktp'){
				this.urlView = this.inputBarangLelang.filektp ? `${API_URL}image/kelengkapan-barang-lelang/${this.inputBarangLelang.filektp}` : no_image
				// this.urlView = this.inputBarangLelang.filektp ? `${API_URL}${this.inputBarangLelang.filektp}` : no_image
			}else if(lampiran == 'kwitansi'){
				this.urlView = this.inputBarangLelang.filekwitansi ? `${API_URL}image/kelengkapan-barang-lelang/${this.inputBarangLelang.filekwitansi}` : no_image
				// this.urlView = this.inputBarangLelang.filekwitansi ? `${API_URL}${this.inputBarangLelang.filekwitansi}` : no_image
			}
		},
    addFiles(e) {
      let jml_files = e.target.files.length
      for(let i=0;i<jml_files;i++) {
        this.MultilpeBarangLelangUtama.push(e.target.files[i])
      } 
      this.imageMultipleUtama = []     
      this.MultilpeBarangLelangUtama.forEach((file, f) => {
        this.imageMultipleUtama.push(
          { 
            title: '',
            kategori: '',
            url: URL.createObjectURL(file),
            files: file
          }
        )
      })
    },
    HapusMultiple(index) {
      // this.imageMultipleUtama = []
      this.MultilpeBarangLelangUtama.splice(index, 1)
      this.imageMultipleUtama.splice(index, 1)
      // this.MultilpeBarangLelangUtama.forEach((file, f) => {
      //   this.imageMultipleUtama.push(
      //     { 
      //       title: '',
      //       kategori: 'Utama',
      //       url: URL.createObjectURL(file) 
      //     }
      //   )
      // })
    },
    async SimpanFotoMultiple() {
      let kirim = await Promise.all(this.imageMultipleUtama.map(async (value) => {
        let status = []
        const bodyData = {
          id: this.inputBarangLelang.id_barang_lelang,
					title: value.title,
					kategori: value.kategori,
					nama_barang_lelang: this.inputBarangLelang.nama_barang_lelang,
					nama_folder: this.inputBarangLelang.UnixText,
					nama_file: `FotoBarangLelang-${this.convertDate(new Date().toISOString().slice(0,10))}_${this.makeRandom(8)}`,
					jenis: "images",
					bagian: "foto_barang_lelang",
					table: "m_foto_barang_lelang",
					files: value.files,
				};
				try {
					let response = await this.uploadFiles(bodyData);
          status.push(response.data.status)
				} catch (err) {
          status.push(err.response.data.status)
				}
        return status[0]
      }))
      if(kirim.filter(el => el == 200).length){
        this.notifikasi("success", 'Berhasil Upload Foto Barang Lelang', "1")
      }else{
        this.notifikasi("error", 'Gagal proses data', "1")
      }
      this.clearForm()
      this.DialogUploadMultipleBarangLelang = false
      this.getBarangLelang()
    },
		UpperCaseLetter(str) {
			return str.toUpperCase()
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
.kotakGambar {
	border-radius: 10px !important;
	padding: 2px !important;
}
.gambar {
	border-style: solid !important;
	border-radius: 10px !important;
	padding: 2px !important;
}
.inner {
  background-color: #ff1414;
  width: 30px;
  height: 30px;
  border-radius: 100%;
  position: absolute;
  bottom: 0;
  right: 0;
}
.tombol-tutup{
  height: 30px !important;
  min-width: 90px !important;
  border-bottom-style: revert !important;
}
</style>