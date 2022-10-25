<template>
  <div>
    <v-card :class="roleID == 4 && 'mt-2 mb-2 pa-1'" :outlined="roleID == 4" elevation="0">
      <h1 class="subheading grey--text">Panel Produk</h1>
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
          :items="DataProduk"
          :single-expand="singleExpand"
          :expanded.sync="expanded"
          show-expand
          item-key="idProduk"
          hide-default-footer
          class="elevation-1"
          :page.sync="page"
          :items-per-page="itemsPerPage"
          @page-count="pageCount = $event"
        >
          <template #[`item.number`]="{ item }">
            {{ DataProduk.indexOf(item) + 1 }}
          </template>
          <template #[`item.kategori`]="{ item }">
            <span v-html="item.kategoriProduk" /><br> 
            <v-tooltip v-if="item.statusKategoriProduk == false" bottom>
              <template v-slot:activator="{ on, attrs }">
                <strong>(<span v-bind="attrs" v-on="on">Non Active</span>)</strong>
              </template>
              <span>Harus Diubah Kategori tidak aktif</span>
            </v-tooltip>
          </template>
          <template #[`item.stok`]="{ item }">
            Stok Awal : <span v-html="item.stok" /><br> 
            Stok Akhir : <span v-html="item.sisaStok"/> 
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
                :value="item.idProduk"
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
                :value="item.idProduk"
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
                :value="item.idProduk"
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
                :value="item.idProduk"
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
                :value="item.idProduk"
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
                :value="item.idProduk"
                color="#0bd369"
                small
                dense
                depressed
                class="ma-2 white--text text--darken-2"
                :disabled="item.statusAktif == false"
                @click="() => { 
                  inputProduk.UnixText = item.UnixText; 
                  inputProduk.id_produk = item.idProduk; 
                  inputProduk.nama_produk = item.namaProduk; 
                  DialogUploadMultipleProduk = true; 
                }"
              >
                <v-icon small>upload</v-icon>	Upload Foto
              </v-btn>
              <v-btn
                :value="item.idProduk"
                color="#0bd369"
                small
                dense
                depressed
                class="ma-2 white--text text--darken-2"
                @click="bukaDialogHistoryStok(item)"
              >
                <v-icon small>history</v-icon>	History Stok
              </v-btn>
              <v-divider />
            </td>
          </template>
        </v-data-table>
      </div>
      <v-row>
        <v-col cols="12" class="mt-2 pa-2 px-5">
          <v-pagination
            v-if="DataProduk.length > 0"
            v-model="page"
            :length="pageCount"
            :total-visible="10"
          />
        </v-col>
      </v-row>
    </v-card>
		<v-dialog
      v-model="DialogProduk"
      max-width="800px"
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="light-blue darken-3"
        >
          <v-toolbar-title>{{editedIndex == 0 ? 'Tambah' : editedIndex == 1 ? 'Ubah' : 'View'}} Data Produk</v-toolbar-title>
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
                  Kategori Produk
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-autocomplete
                    v-model="inputProduk.id_kategori_produk"
                    :items="kategoriOptions"
                    item-text="kategoriProduk"
                    item-value="idKategoriProduk"
                    placeholder="Kategori Produk"
                    label="Kategori Produk"
                    outlined
                    dense
                    hide-details
                    :clearable="editedIndex != 2"
                    :readonly="editedIndex == 2"
                  />
                  <span v-html="editedIndex != 0 && inputProduk.id_kategori_produk == '' ? 'Kategori yang dipilih tidak aktif' : ''" class="red--text"></span>
                </v-col>
              </v-row>
							<v-row no-gutters>
                <v-col
                  cols="12"
                  md="4"
                  class="pt-2 d-flex align-center"
                >
                  Measurement
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-autocomplete
                    v-model="inputProduk.id_measurement"
                    :items="MeasurementOptions"
                    item-text="deskripsi"
                    item-value="idMeasurement"
                    placeholder="Measurement"
                    label="Measurement"
                    outlined
                    dense
                    hide-details
                    :clearable="editedIndex != 2"
                    :readonly="editedIndex == 2"
                  />
                  <span v-html="editedIndex != 0 && inputProduk.id_measurement == '' ? 'Measurement yang dipilih tidak aktif' : ''" class="red--text"></span>
                </v-col>
              </v-row>
							<v-row no-gutters>
                <v-col
                  cols="12"
                  md="4"
                  class="pt-2 d-flex align-center"
                >
                  Nama Produk
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-text-field
                    v-model="inputProduk.nama_produk"
                    placeholder="Nama Produk"
                    outlined
                    dense
                    label="Nama Produk"
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
                  Merek Produk
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-text-field
                    v-model="inputProduk.merek_produk"
                    placeholder="Merek Produk"
                    outlined
                    dense
                    label="Merek Produk"
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
									Harga
								</v-col>
								<v-col
									cols="12"
									md="8"
									class="pt-3"
								>
									<vuetify-money
										v-model="inputProduk.harga"
										placeholder="Harga"
										outlined
										dense
										label="Harga"
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
                  Stok
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-text-field
                    v-model="inputProduk.stok"
                    placeholder="Stok"
                    outlined
                    dense
                    label="Stok"
                    color="light-blue darken-3"
                    @keypress.native="onlyNumber($event, 5, inputProduk.stok)"
                    hide-details
                    :clearable="editedIndex == 0"
                    :readonly="editedIndex != 0"
                  />
                </v-col>
              </v-row>
							<v-row no-gutters>
                <v-col
                  cols="12"
                  md="4"
                  class="pt-2 d-flex align-center"
                >
                  Berat
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-text-field
                    v-model="inputProduk.berat"
                    placeholder="Berat"
                    outlined
                    dense
                    label="Berat"
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
                  Deskripsi
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-textarea
                    v-model="inputProduk.deskripsi"
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
							<div v-if="editedIndex == 2">
								<div class="mt-3 mb-3">
									<v-divider />
								</div>
								<v-row v-if="MultilpeProduk.length > 0" no-gutters>
									<v-col
										class="ma-1 d-flex flex-column justify-space-between align-center"
										v-for="(file,f) in MultilpeProduk" :key="f"
									>
										<img :ref="'file'" :src="imageMultiple[f].url" :title="file.gambar" width="300" />
									</v-col>
								</v-row>
								<v-row v-else no-gutters>
									<v-col class="ma-1 d-flex flex-column justify-space-between align-center">
										<strong>Foto Produk tidak tersedia</strong>
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
		<v-dialog
      v-model="DialogViewLampiranProduk"
      width="600px"
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="light-blue darken-3"
        >
          <v-toolbar-title>View Lampiran Data Produk</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <v-btn
              icon
              dark
              @click="DialogViewLampiranProduk = false"
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
      v-model="DialogUploadMultipleProduk"
      width="1000px"
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="light-blue darken-3"
        >
          <v-toolbar-title>Upload Foto Produk</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <v-btn
              icon
              dark
              @click="() => { imageMultiple = []; MultilpeProduk = []; inputProduk.UnixText = ''; DialogUploadMultipleProduk = false; }"
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
                        v-model="MultilpeProduk"
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
                        <v-icon left>upload</v-icon> Foto Produk
                      </v-btn>
                    </v-col>  
                  </v-row>
                  <v-row>
                    <v-col
                      class="ma-1 d-flex flex-column justify-space-between align-center"
                      v-for="(file,f) in MultilpeProduk" :key="f"
                    >
                      <img :ref="'file'" :src="imageMultiple[f].url" :title="file.name" width="200" />
                      <v-icon color="red" @click="HapusMultiple(f)">delete</v-icon>
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
                      :disabled="imageMultiple.length && MultilpeProduk.length ? false : true"
                      @click="() => { imageMultiple = []; MultilpeProduk = []; }"
                    >
                      Batal
                    </v-btn>
                    <v-btn
                      color="light-blue darken-3"
                      class="white--text text--darken-2"
                      small
                      dense
                      depressed
                      :disabled="imageMultiple.length && MultilpeProduk.length ? false : true"
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
    <v-dialog
      v-model="DialogHistoryStok"
      width="800px"
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="light-blue darken-3"
        >
          <v-toolbar-title>History Stok Produk <strong>({{ inputProduk.nama_produk }})</strong></v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <v-btn
              icon
              dark
              @click="() => { DialogHistoryStok = false; inputProduk.nama_produk = ''; inputProduk.id_produk = ''; }"
            >
              <v-icon>close</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card tile>
          <div class="scrollText">
            <v-card-text>
              <v-row no-gutters>
                <v-col cols="12" md="6">
                  <v-btn
                    color="light-blue darken-3"
                    small
                    dense
                    depressed
                    class="ma-2 white--text text--darken-2"
                    @click.stop="bukaDialogStok(null, 0)"
                  >
                    <v-icon small>add</v-icon>	Tambah
                  </v-btn>
                </v-col>
                <v-col cols="12" md="6" />
              </v-row>
              <div class="px-1">
                <v-data-table
                  loading-text="Sedang memuat... Harap tunggu"
                  no-data-text="Tidak ada data yang tersedia"
                  no-results-text="Tidak ada catatan yang cocok ditemukan"
                  :options.sync="query"
                  :headers="headersHistoryStok"
                  :loading="isLoadingHistoryStok"
                  :items="DataHistoryStok"
                  :single-expand="singleExpandHistoryStok"
                  :expanded.sync="expandedHistoryStok"
                  show-expand
                  item-key="idUpdateStok"
                  hide-default-footer
                  class="elevation-1"
                  :page.sync="pageHistoryStok"
                  :items-per-page="itemsPerPageHistoryStok"
                  @page-count="pageCountHistoryStok = $event"
                >
                  <template #[`item.number`]="{ item }">
                    {{ DataHistoryStok.indexOf(item) + 1 }}
                  </template>
                  <template #[`item.tambah_stok`]="{ item }">
                    <v-edit-dialog
                      :return-value.sync="item.tambahStok"
                      persistent
                      @open="() => { inputTemp[item.idUpdateStok] = item.tambahStok; }"
                      @save="simpanPerubahan(item, 'tambah')"
                      @cancel="() => { inputTemp[item.idUpdateStok] = ''; }"
                    >
                      <span class="stokPlus" v-html="item.tambahStok ? `+${item.tambahStok}` : 0" /> <v-icon small>edit</v-icon>
                      <template v-slot:input>
                        <v-text-field
                          class="ma-3"
                          v-model="inputTemp[item.idUpdateStok]"
                          placeholder="Ubah Stok Masuk"
                          label="Ubah Stok Masuk"
                          outlined
                          dense
                          hint="untuk batal klik ESC"
                          persistent-hint
                          color="light-blue darken-3"
                          @keypress.native="onlyNumber($event, 5, inputTemp[item.idUpdateStok])"                          
                        />
                      </template>
                    </v-edit-dialog>
                  </template>
                  <template #[`item.kurang_stok`]="{ item }">
                    <v-edit-dialog
                      :return-value.sync="item.kurangStok"
                      persistent
                      @open="() => { inputTemp[item.idUpdateStok] = item.kurangStok; }"
                      @save="simpanPerubahan(item, 'kurang')"
                      @cancel="() => { inputTemp[item.idUpdateStok] = ''; }"
                    >
                      <span class="stokMin" v-html="item.kurangStok ? `+${item.kurangStok}` : 0" /> <v-icon small>edit</v-icon>
                      <template v-slot:input>
                        <v-text-field
                          class="ma-3"
                          v-model="inputTemp[item.idUpdateStok]"
                          placeholder="Ubah Stok Keluar"
                          label="Ubah Stok Keluar"
                          outlined
                          dense
                          hint="untuk batal klik ESC"
                          persistent-hint
                          color="light-blue darken-3"
                          @keypress.native="onlyNumber($event, 5, inputTemp[item.idUpdateStok])"                          
                        />
                      </template>
                    </v-edit-dialog>
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
                        :value="item.idUpdateStok"
                        color="#0bd369"
                        small
                        dense
                        depressed
                        class="ma-2 white--text text--darken-2"
                        :disabled="item.statusAktif == false"
                        @click="bukaDialogStok(item, 1)"
                      >
                        <v-icon small>edit</v-icon>	Ubah
                      </v-btn> 
                      <v-btn
                        v-if="item.statusAktif == false"
                        :value="item.idUpdateStok"
                        color="#0bd369"
                        small
                        dense
                        depressed
                        class="ma-2 white--text text--darken-2"
                        @click="StatusRecordStok(item, 1)"
                      >
                        <v-icon small>visibility</v-icon>	Active
                      </v-btn> 
                      <v-btn
                        v-else-if="item.statusAktif == true"
                        :value="item.idUpdateStok"
                        color="#0bd369"
                        small
                        dense
                        depressed
                        class="ma-2 white--text text--darken-2"
                        @click="StatusRecordStok(item, 0)"
                      >
                        <v-icon small>visibility_off</v-icon>	Non Active
                      </v-btn> 
                      <v-btn
                        :value="item.idUpdateStok"
                        color="#bd3a07"
                        small
                        dense
                        depressed
                        class="ma-2 white--text text--darken-2"
                        :disabled="item.statusAktif == false"
                        @click="HapusRecordStok(item)"
                      >
                        <v-icon small>delete</v-icon>	Hapus
                      </v-btn>
                      <v-divider />
                    </td>
                  </template>
                </v-data-table>
              </div>
              <v-row no-gutters class="mt-2 pa-2">
                <v-col md="6">
                  <strong>
                    Jumlah Stok Masuk : {{ StokMasuk }} <br>
                    Jumlah Stok Keluar : {{ StokKeluar }}
                  </strong>
                </v-col>
                <v-col md="6">
                  <v-pagination
                    v-if="DataHistoryStok.length > 0"
                    v-model="pageHistoryStok"
                    :length="pageCountHistoryStok"
                    :total-visible="10"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </div>
        </v-card>
      </v-card>
		</v-dialog>
    <v-dialog
      v-model="DialogStok"
      width="800px"
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="light-blue darken-3"
        >
          <v-toolbar-title>{{editedIndex == 0 ? 'Tambah' : 'Ubah'}} Data Stok</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <v-btn
              icon
              dark
              @click="tutupDialogStok"
            >
              <v-icon>close</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card tile>
          <div class="scrollText">
            <v-card-text>
              <v-row no-gutters>
                <v-col
                  cols="12"
                  md="4"
                  class="pt-2 d-flex align-center"
                >
                  Tanggal
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
												v-model="inputHistory.tanggal"
												:value="inputHistory.tanggal"
												placeholder="Tanggal"
												v-bind="attrs"
												v-on="on"
												outlined
												dense
												label="Tanggal"
												color="light-blue darken-3"
												hide-details
												:clearable="editedIndex != 2"
												:readonly="editedIndex == 2"
											/>
										</template>
										<v-date-picker v-model="inputHistory.tanggal" @input="menu = false" />
									</v-menu>
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col
                  cols="12"
                  md="4"
                  class="pt-2 d-flex align-center"
                >
                  Stok Masuk
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-text-field
                    v-model="inputHistory.tambah_stok"
                    placeholder="Stok Masuk"
                    outlined
                    dense
                    label="Stok Masuk"
                    color="light-blue darken-3"
                    @keypress.native="onlyNumber($event, 5, inputHistory.tambah_stok)"
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
                  Stok Keluar
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-text-field
                    v-model="inputHistory.kurang_stok"
                    placeholder="Stok Keluar"
                    outlined
                    dense
                    label="Stok Keluar"
                    color="light-blue darken-3"
                    @keypress.native="onlyNumber($event, 5, inputHistory.kurang_stok)"
                    hide-details
                    :clearable="editedIndex != 2"
                    :readonly="editedIndex == 2"
                  />
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
                  @click="SimpanFormStok(0)"
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
                  @click="SimpanFormStok(1)"
                >
                  Ubah Data
                </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-card>
		</v-dialog>
	</div>
</template>

<script>
import { mapActions } from "vuex";
import PopUpNotifikasiVue from "../../Layout/PopUpNotifikasi.vue";

export default {
  name: 'Produk',
	components: { PopUpNotifikasiVue },
	data: () => ({
		isLoading: false,
    roleID: '',
		DataProduk: [],
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
      { text: "Kode", value: "kodeProduk", sortable: false },
      { text: "Nama", value: "namaProduk", sortable: false },
      { text: "Merek", value: "merekProduk", sortable: false },
      { text: "Stok", value: "stok", sortable: false },
      { text: "Status", value: "statusAktif", sortable: false },
    ],
    rowsPerPageItems: { "items-per-page-options": [5, 10, 25, 50] },
    totalItems: 0,
		kategoriOptions: [],
		MeasurementOptions: [],
		DialogProduk: false,
		DialogViewLampiranProduk: false,
		DialogUploadMultipleProduk: false,
		DialogHistoryStok: false,
    DialogStok: false,
    isLoadingHistoryStok: false,
		DataHistoryStok: [],
		StokMasuk: '',
		StokKeluar: '',
		pageHistoryStok: 1,
    pageCountHistoryStok: 0,
    itemsPerPageHistoryStok: 10,
    expandedHistoryStok: [],
    singleExpandHistoryStok: true,
    headersHistoryStok: [
      { text: "No", value: "number", sortable: false, width: "7%" },
      { text: "", value: "data-table-expand", sortable: false, width: "5%" },
      { text: "Tanggal", value: "tanggalstok", sortable: false },
      { text: "Stok Masuk", value: "tambah_stok", sortable: false },
      { text: "Stok Keluar", value: "kurang_stok", sortable: false },
      { text: "Status", value: "statusAktif", sortable: false },
    ],
    inputTemp: [],
		menu: false,
		editedIndex: 3,
    kondisiTombol: true,
		optionsUang: {
			locale: "pt-BR",
			prefix: "Rp.",
			suffix: "",
			length: 15,
			precision: 0
		},
		inputProduk: {
			UnixText: '',
			id_produk: '',
			id_kategori_produk: '',
			id_measurement: '',
			kode_produk: '',
			nama_produk: '',
			merek_produk: '',
			harga: '',
			stok: '',
			berat: '',
			deskripsi: '',
		},
    inputHistory: {
      id_update_stok: '',
      tanggal: '',
      tambah_stok: '',
      kurang_stok: '',
    },
    image: {
      src: null,
      type: null,
      jenis: null,
    },
    imageMultiple: [],
    MultilpeProduk: [],
    readers: [],
		componentKey: 0,
		urlView: '',

		//notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
	}),
	metaInfo: {
		title: "E-Commerce (Produk) - WIN.ID",
		htmlAttrs: {
			lang: "id",
			amp: true,
		},
	},
	watch: {
		inputProduk: {
			deep: true,
			handler(value) {
        if(value.id_kategori_produk == null){ this.inputProduk.id_kategori_produk = '' }
        if(value.id_measurement == null){ this.inputProduk.id_measurement = '' }
        if(value.nama_produk == null){ this.inputProduk.nama_produk = '' }
        if(value.merek_produk == null){ this.inputProduk.merek_produk = '' }
        if(value.harga == null){ this.inputProduk.harga = '' }
        if(value.stok == null){ this.inputProduk.stok = '' }
        if(value.berat == null){ this.inputProduk.berat = '' }
				if(value.deskripsi == null){ this.inputProduk.deskripsi = '' }

				if(value.id_kategori_produk != '' && value.id_measurement != '' && value.nama_produk != '' && value.merek_produk != '' && value.harga != '' && value.stok != '' && 
        value.berat != '' && value.deskripsi != ''){
					this.kondisiTombol = false
				}else{
					this.kondisiTombol = true
				}
			}
		}
	},
  updated(){
		// if(this.editedIndex == 0){ 
		// 	this.inputProduk.kode_produk = `PRD-${this.convertDate(new Date().toISOString().slice(0,10))}${this.makeRandomAngka(8)}` 
		// 	this.inputProduk.UnixText = `Produk${this.convertDate(new Date().toISOString().slice(0,10))}${this.makeRandom(8)}` 
		// }
	},
	mounted() {
    this.roleID = localStorage.getItem("roleID")
		this.getProduk()
	},
	methods: {
		...mapActions({
      fetchData: "fetchData",
      uploadFiles: "upload/uploadFiles",
    }),
		getProduk() {
      this.isLoading = true
			let payload = {
        method: "get",
				url: `ecommerce/getProduk`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
        this.DataProduk = res.data.result;
        this.isLoading = false
			})
			.catch((err) => {
        this.isLoading = false
				this.notifikasi("error", err.response.data.message, "1")
			});
		},
		getKategoriProduk() {
			let payload = {
				method: "get",
				url: `ecommerce/getKategoriProduk?status_aktif=1`,
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
		getMeasurement() {
			let payload = {
				method: "get",
				url: `settings/getMeasurement?status_aktif=1`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				this.MeasurementOptions = res.data.result;
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
		},
		getFotoProduk(id) {
			let payload = {
				method: "get",
				url: `ecommerce/getFotoProduk/${id}`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				this.MultilpeProduk = res.data.result;
			  const API_URL = process.env.VUE_APP_NODE_ENV === "production" ? process.env.VUE_APP_VIEW_PROD_API_URL : process.env.VUE_APP_VIEW_DEV_API_URL
        this.MultilpeProduk.forEach((element) => {
          this.imageMultiple.push({ url: `${API_URL}image/produk/${element.gambar}` })
        })
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
		},
		bukaDialog(item, index){
      this.editedIndex = index
			this.getKategoriProduk()
			this.getMeasurement()
      if(index == 0){
        this.clearForm()
        this.inputProduk.kode_produk = `PRD-${this.convertDate(new Date().toISOString().slice(0,10))}${this.makeRandomAngka(8)}` 
			  this.inputProduk.UnixText = `Produk${this.convertDate(new Date().toISOString().slice(0,10))}${this.makeRandom(8)}`
      }else{
        if(index == 2){ this.getFotoProduk(item.idProduk) }
        this.inputProduk.UnixText = item.UnixText ? item.UnixText : ''
        this.inputProduk.id_kategori_produk = item.statuskategoriProduk == 1 ? item.idKategoriProduk ? item.idKategoriProduk : '' : ''
        this.inputProduk.id_produk = item.idProduk ? item.idProduk : ''
        this.inputProduk.id_measurement = item.idMeasurement ? item.idMeasurement : ''
        this.inputProduk.kode_produk = item.kodeProduk ? item.kodeProduk : ''
        this.inputProduk.nama_produk = item.namaProduk ? item.namaProduk : ''
				this.inputProduk.merek_produk = item.merekProduk ? item.merekProduk : ''
				this.inputProduk.harga = item.harga ? item.harga : ''
				this.inputProduk.stok = item.stok ? item.stok : ''
				this.inputProduk.berat = item.berat ? item.berat : ''
				this.inputProduk.deskripsi = item.deskripsi ? item.deskripsi : ''
      }
      this.DialogProduk = true
    },
    tutupDialog() {
      this.clearForm()
      this.editedIndex = 3
      this.DialogProduk = false
    },
		SimpanForm(index) {
			let bodyData = {
				jenis: index == 0 ? 'ADD' : 'EDIT',
				UnixText: this.inputProduk.UnixText,
				id_produk: index == 0 ? '' : this.inputProduk.id_produk,
				id_kategori_produk: this.inputProduk.id_kategori_produk,
				id_measurement: this.inputProduk.id_measurement,
				kode_produk: this.inputProduk.kode_produk,
				nama_produk: this.inputProduk.nama_produk,
				merek_produk: this.inputProduk.merek_produk,
				harga: this.inputProduk.harga,
				stok: this.inputProduk.stok,
				berat: this.inputProduk.berat,
				deskripsi: this.inputProduk.deskripsi,
				create_update_by: localStorage.getItem('idLogin'),
			}
			let payload = {
				method: "post",
				url: `ecommerce/postProduk`,
			  body: bodyData,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then(async (res) => {
				this.notifikasi("success", res.data.message, "1")
        this.clearForm()
				this.DialogProduk = false
				this.getProduk()
			})
			.catch((err) => {
				this.DialogProduk = false
				this.getProduk()
				this.notifikasi("error", err.response.data.message, "1")
			});
    },
    HapusRecord(item) {
      let bodyData = {
        jenis: 'DELETE',
        id_produk: item.idProduk,
        id_kategori_produk: item.idKategoriProduk,
        nama_produk: item.namaProduk,
        kode_produk: item.kodeProduk,
        delete_by: localStorage.getItem('idLogin'),
      }
      let payload = {
				method: "post",
				url: `ecommerce/postProduk`,
        body: bodyData,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
        this.getProduk()
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
				this.getProduk()
				this.notifikasi("error", err.response.data.message, "1")
			});
    },
    StatusRecord(item, status_aktif) {
      let bodyData = {
        jenis: 'STATUSRECORD',
        id_produk: item.idProduk,
        id_kategori_produk: item.idKategoriProduk,
        nama_produk: item.namaProduk,
        kode_produk: item.kodeProduk,
        status_aktif: status_aktif,
      }
      let payload = {
				method: "post",
				url: `ecommerce/postProduk`,
        body: bodyData,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
        this.getProduk()
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
        this.getProduk()
				this.notifikasi("error", err.response.data.message, "1")
			});
    },
		clearForm() {
      this.inputProduk.UnixText = ''
      this.inputProduk.id_produk = ''
      this.inputProduk.id_kategori_produk = ''
      this.inputProduk.kode_produk = ''
      this.inputProduk.nama_produk = ''
			this.inputProduk.merek_produk = ''
			this.inputProduk.harga = ''
			this.inputProduk.stok = ''
			this.inputProduk.berat = ''
			this.inputProduk.deskripsi = ''
      this.MultilpeProduk = []
      this.imageMultiple = []
    },
    addFiles(e) {
      let jml_files = e.target.files.length
      for(let i=0;i<jml_files;i++) {
        this.MultilpeProduk.push(e.target.files[i])
      }      
      this.MultilpeProduk.forEach((file, f) => {
        this.imageMultiple.push({ url: URL.createObjectURL(file) })
      })
    },
    HapusMultiple(index) {
      this.imageMultiple = []
      this.MultilpeProduk.splice(index, 1)
      this.MultilpeProduk.forEach((file, f) => {
        this.imageMultiple.push({ url: URL.createObjectURL(file) })
      })
    },
    async SimpanFotoMultiple() {
      let kirim = await Promise.all(this.MultilpeProduk.map(async (file, f) => {
        let status = []
        const bodyData = {
          id: this.inputProduk.id_produk,
					kode_produk: this.inputProduk.kode_produk,
					kode_produk: this.inputProduk.nama_produk,
					nama_folder: this.inputProduk.UnixText,
					nama_file: `FotoProduk-${this.convertDate(new Date().toISOString().slice(0,10))}_${this.makeRandom(8)}`,
					jenis: "images",
					bagian: "foto_produk",
					table: "m_foto_produk",
					files: file,
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
        this.notifikasi("success", 'Berhasil Upload Foto Produk', "1")
      }else{
        this.notifikasi("error", 'Gagal proses data', "1")
      }
      this.clearForm()
      this.DialogUploadMultipleProduk = false
      this.getProduk()
    },
    getHistoryStok(id) {
			let payload = {
				method: "get",
				url: `ecommerce/getHistoryStock/${id}`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				this.DataHistoryStok = res.data.result.dataStok;
				this.StokMasuk = res.data.result.stokMasuk;
				this.StokKeluar = res.data.result.stokKeluar;
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
		},
    bukaDialogHistoryStok(item) {
      this.DialogHistoryStok = true
      this.getHistoryStok(item.idProduk)
      this.inputProduk.id_produk = item.idProduk
      this.inputProduk.nama_produk = item.namaProduk
    },
    SimpanFormStok(index) {
			let bodyData = {
				jenis: index == 0 ? 'ADDSTOK' : 'EDITSTOK',
				id_update_stok: this.inputHistory.id_update_stok,
				id_produk: this.inputProduk.id_produk,
				tanggal: this.inputHistory.tanggal,
				tambah_stok: this.inputHistory.tambah_stok ? this.inputHistory.tambah_stok : 0,
				kurang_stok: this.inputHistory.kurang_stok ? this.inputHistory.kurang_stok : 0,
				create_update_by: localStorage.getItem('idLogin'),
			}
			let payload = {
				method: "post",
				url: `ecommerce/postProduk`,
			  body: bodyData,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then(async (res) => {
        this.notifikasi("success", res.data.message, "1")
        this.getHistoryStok(this.inputProduk.id_produk)
				this.getProduk()
        this.inputHistory.id_update_stok = ''
        this.inputHistory.tambah_stok = ''
        this.inputHistory.kurang_stok = ''
        this.inputHistory.tanggal = ''
				this.DialogStok = false
			})
			.catch((err) => {
        this.DialogStok = false
        this.getHistoryStok(this.inputProduk.id_produk)
				this.getProduk()
				this.notifikasi("error", err.response.data.message, "1")
			});
    },
    HapusRecordStok(item) {
      let bodyData = {
        jenis: 'DELETESTOK',
        id_update_stok: item.idUpdateStok,
        delete_by: localStorage.getItem('idLogin'),
      }
      let payload = {
				method: "post",
				url: `ecommerce/postProduk`,
        body: bodyData,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				this.getHistoryStok(item.idProduk)
        this.getProduk()
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
				this.getHistoryStok(item.idProduk)
				this.getProduk()
				this.notifikasi("error", err.response.data.message, "1")
			});
    },
    StatusRecordStok(item, status_aktif) {
      let bodyData = {
        jenis: 'STATUSRECORDSTOK',
        id_update_stok: item.idUpdateStok,
        status_aktif: status_aktif,
      }
      let payload = {
				method: "post",
				url: `ecommerce/postProduk`,
        body: bodyData,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				this.getHistoryStok(item.idProduk)
        this.getProduk()
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
				this.getHistoryStok(item.idProduk)
				this.getProduk()
				this.notifikasi("error", err.response.data.message, "1")
			});
    },
    simpanPerubahan(item, bagian){
      let bodyData = {
        jenis: 'EDITSTOKONE',
        bagian: bagian,
        id_update_stok: item.idUpdateStok,
        inputTemp: this.inputTemp[item.idUpdateStok],
        create_update_by: localStorage.getItem('idLogin'),
      }
      // console.log(bodyData)
      let payload = {
				method: "post",
				url: `ecommerce/postProduk`,
        body: bodyData,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				this.getHistoryStok(item.idProduk)
        this.getProduk()
        this.inputTemp[item.idUpdateStok] = ''
        this.notifikasi("success", res.data.message, "1")
			})
      .catch((err) => {
				this.getHistoryStok(item.idProduk)
				this.getProduk()
				this.notifikasi("error", err.response.data.message, "1")
			});
    },
    bukaDialogStok(item, index){
      // console.log(item)
      this.editedIndex = index
      this.getProduk()
      if(index == 0){
        this.inputHistory.id_update_stok = ''
        this.inputHistory.tambah_stok = ''
        this.inputHistory.kurang_stok = ''
        this.inputHistory.tanggal = ''
      }else{
        this.inputHistory.id_update_stok = item.idUpdateStok ? item.idUpdateStok : ''
        this.inputHistory.tambah_stok = item.tambahStok ? item.tambahStok : ''
        this.inputHistory.kurang_stok = item.kurangStok ? item.kurangStok : ''
        this.inputHistory.tanggal = item.tanggal ? item.tanggal : ''
      }
      this.DialogStok = true
    },
    tutupDialogStok(){
      this.DialogStok = false
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
.stokPlus {
  color: #00FF00;
  font-weight: bold;
}
.stokMin {
  color: #FF0000;
  font-weight: bold;
}
</style>