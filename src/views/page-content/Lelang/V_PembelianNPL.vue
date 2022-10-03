<template>
  <div>
		<v-card :class="roleID == 5 && 'mt-2 mb-2 pa-1'" :outlined="roleID == 5" elevation="0">
			<h1 class="subheading grey--text">Panel Pembelian NPL</h1>
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
					:items="DataPembelianNPL"
					:single-expand="singleExpand"
					:expanded.sync="expanded"
					show-expand
					item-key="id_pembelian_npl"
					hide-default-footer
					class="elevation-1"
					:page.sync="page"
					:items-per-page="itemsPerPage"
					@page-count="pageCount = $event"
				>
					<template #[`item.number`]="{ item }">
						{{ DataPembelianNPL.indexOf(item) + 1 }}
					</template>
					<template #[`item.event`]="{ item }"> 
						<strong><span v-html="item.data_event.nama_event" /></strong>
						<v-tooltip top>
							<template v-slot:activator="{ on, attrs }">
								<v-icon small v-bind="attrs" v-on="on">info</v-icon>
							</template>
							Kode Event : <span v-html="item.data_event.kode_event" /> <br>
							Nama Event : <strong><span v-html="item.data_event.nama_event" /></strong> <br>
							Tanggal Event : (<span v-html="item.data_event.tanggalevent" /> <span v-html="item.data_event.waktu_event" />)
						</v-tooltip>
						<v-tooltip v-if="item.data_event.status_aktif == 0" bottom>
							<template v-slot:activator="{ on, attrs }">
								<strong>(<span v-bind="attrs" v-on="on">Non Active</span>)</strong>
							</template>
							<span>Harus Diubah Event tidak aktif</span>
						</v-tooltip>
					</template>
					<template #[`item.peserta`]="{ item }">
						<strong><span v-html="item.data_peserta.nama" /></strong>
						<v-tooltip top>
							<template v-slot:activator="{ on, attrs }">
								<v-icon small v-bind="attrs" v-on="on">info</v-icon>
							</template>
							NIK : <strong><span v-html="item.data_peserta.nik" /></strong> <br>
							Nama : <strong><span v-html="item.data_peserta.nama" /></strong> <br>
							Email : <strong><span v-html="item.data_peserta.email" /></strong>
						</v-tooltip>
						<v-tooltip v-if="item.data_peserta.status_aktif == 0" bottom>
							<template v-slot:activator="{ on, attrs }">
								<strong>(<span v-bind="attrs" v-on="on">Non Active</span>)</strong>
							</template>
							<span>Harus Diubah Peserta tidak aktif</span>
						</v-tooltip>
					</template>
					<template #[`item.nominal`]="{ item }">
						Rp.<span v-html="currencyDotFormat(item.nominal)" />
					</template>
					<template #[`item.verifikasi`]="{ item }">
						<v-icon small v-if="item.verifikasi == 1" color="green">check</v-icon>
						<v-icon small v-else-if="item.verifikasi == 0" color="red">clear</v-icon>
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
								:value="item.id_pembelian_npl"
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
								:value="item.id_pembelian_npl"
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
								:value="item.id_pembelian_npl"
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
								v-if="item.verifikasi == 0"
								:value="item.id_pembelian_npl"
								color="#0bd369"
								small
								dense
								depressed
								:disabled="item.status_aktif == 0"
								class="ma-2 white--text text--darken-2"
								@click="questionProses(item, 1)"
							>
								<v-icon small>verified_user</v-icon>	Verifikasi
							</v-btn> 
							<v-btn
								v-else-if="item.verifikasi == 1"
								:value="item.id_pembelian_npl"
								color="#0bd369"
								small
								dense
								depressed
								:disabled="item.status_aktif == 0"
								@click="questionProses(item, 0)"
								class="ma-2 white--text text--darken-2"
							>
								<v-icon small>gpp_bad</v-icon>	Tidak Verifikasi
							</v-btn> 
							<v-btn
								:value="item.id_pembelian_npl"
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
								:value="item.id_pembelian_npl"
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
						v-if="DataPembelianNPL.length > 0"
						v-model="page"
						:length="pageCount"
						:total-visible="5"
					/>
				</v-col>
			</v-row>
		</v-card>
		<v-dialog
      v-model="DialogPembelianNPL"
      max-width="800px"
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="light-blue darken-3"
        >
          <v-toolbar-title>{{editedIndex == 0 ? 'Tambah' : editedIndex == 1 ? 'Ubah' : 'View'}} Data PembelianNPL</v-toolbar-title>
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
                  Peserta
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-autocomplete
                    v-model="inputPembelianNPL.id_peserta"
                    :items="DataPeserta"
                    item-text="nama"
                    item-value="id_peserta"
                    placeholder="Peserta"
                    label="Peserta"
                    outlined
                    dense
                    hide-details
                    :clearable="editedIndex != 2"
                    :readonly="editedIndex == 2"
                  >
										<template v-slot:selection="{ item }">
											{{item.nama}} ({{item.nik}})
										</template>
										<template v-slot:item="{ item }">
											{{item.nama}} ({{item.nik}})
										</template>
									</v-autocomplete>
                  <span v-html="editedIndex != 0 && inputPembelianNPL.id_peserta == '' ? 'Peserta yang dipilih tidak aktif' : ''" class="red--text"></span>
                </v-col>
              </v-row>
							<v-row no-gutters>
                <v-col
                  cols="12"
                  md="4"
                  class="pt-2 d-flex align-center"
                >
                  Event
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-autocomplete
                    v-model="inputPembelianNPL.id_event"
                    :items="DataEvent"
                    item-text="nama_event"
                    item-value="id_event"
                    placeholder="Event"
                    label="Event"
                    outlined
                    dense
                    hide-details
                    :clearable="editedIndex != 2"
                    :readonly="editedIndex == 2"
                  >
										<template v-slot:selection="{ item }">
											{{item.kode_event}} - {{item.nama_event}} ({{item.tanggalevent}} {{item.waktu_event}})
										</template>
										<template v-slot:item="{ item }">
											{{item.kode_event}} - {{item.nama_event}} ({{item.tanggalevent}} {{item.waktu_event}})
										</template>
									</v-autocomplete>
                  <span v-html="editedIndex != 0 && inputPembelianNPL.id_event == '' ? 'Event yang dipilih tidak aktif' : ''" class="red--text"></span>
                </v-col>
              </v-row>
							<v-row no-gutters>
								<v-col
									cols="12"
									md="4"
									class="pt-2 d-flex align-center"
								>
									No. Pembelian
								</v-col>
								<v-col
									cols="12"
									md="8"
									class="pt-3"
								>
									<v-text-field
										v-model="tampungNoPembelian"
										placeholder="No. Pembelian"
										outlined
										dense
										label="No. Pembelian"
										color="light-blue darken-3"
										hide-details
                    readonly
									/>
										<!-- @keypress.native="onlyNumber($event, null, inputPembelianNPL.no_pembelian)" -->
								</v-col>
							</v-row>
							<v-row no-gutters>
                <v-col
                  cols="12"
                  md="4"
                  class="pt-2 d-flex align-center"
                >
                  Type Pembelian
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-autocomplete
                    v-model="inputPembelianNPL.type_pembelian"
                    :items="TypePembelianOptions"
                    item-text="text"
                    item-value="value"
                    placeholder="Type Pembelian"
                    label="Type Pembelian"
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
                  Type Transaksi
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-autocomplete
                    v-model="inputPembelianNPL.type_transaksi"
                    :items="TypeTransaksiOptions"
                    item-text="text"
                    item-value="value"
                    placeholder="Type Transaksi"
                    label="Type Transaksi"
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
									Nominal
								</v-col>
								<v-col
									cols="12"
									md="8"
									class="pt-3"
								>
									<vuetify-money
										v-model="inputPembelianNPL.nominal"
										placeholder="Nominal"
										outlined
										dense
										label="Nominal"
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
                  Tanggal Transfer
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
												v-model="inputPembelianNPL.tanggal_transfer"
												:value="inputPembelianNPL.tanggal_transfer"
												placeholder="Tanggal Transfer"
												v-bind="attrs"
												v-on="on"
												outlined
												dense
												label="Tanggal Transfer"
												color="light-blue darken-3"
												hide-details
												:clearable="editedIndex != 2"
												:readonly="editedIndex == 2"
											/>
										</template>
										<v-date-picker v-model="inputPembelianNPL.tanggal_transfer" @input="menu = false" />
									</v-menu>
                </v-col>
              </v-row>
							<v-row no-gutters v-if="editedIndex == 2">
                <v-col
                  cols="12"
                  md="4"
                  class="pt-2 d-flex align-center"
                >
                  Pesan Verifikasi
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-textarea
                    v-model="inputVerifikasi.pesan_verifikasi"
                    placeholder="Pesan Verifikasi"
                    outlined
                    dense
                    rows="4"
                    label="Pesan Verifikasi"
                    color="light-blue darken-3"
                    hide-details
                    readonly
                    no-resize
                  />
                </v-col>
              </v-row>
							<v-row no-gutters v-if="editedIndex == 2">
                <v-col
                  cols="12"
                  md="4"
                  class="pt-2 d-flex align-center"
                >
                  Bukti Transfer
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
									<v-btn depressed small color="light-blue darken-3" dark @click="viewLampiran()">
										<v-icon small left>pageview</v-icon> Lihat Bukti
									</v-btn>
									<br>
									<span v-if="this.inputVerifikasi.bukti != ''">
										<strong>nama file :</strong> <i>{{this.inputVerifikasi.bukti}}</i>
									</span>
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
				@tutup="dialogNotifikasi = false"
				@proses="bukaDialogVerifikasi()"
        @cancel="notifikasiKode != 'questionProses' ? dialogNotifikasi = false : StatusVerifikasi(inputVerifikasi.bukti)"
      />
    </v-dialog>
		<v-dialog
      v-model="DialogVerifikasi"
      max-width="800px"
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="light-blue darken-3"
        >
          <v-toolbar-title>Dialog Verifikasi</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <v-btn
              icon
              dark
              @click="tutupDialogVerifikasi"
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
                  Pesan Verifikasi
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-textarea
                    v-model="inputVerifikasi.pesan_verifikasi"
                    placeholder="Pesan Verifikasi"
                    outlined
                    dense
                    rows="4"
                    label="Pesan Verifikasi"
                    color="light-blue darken-3"
                    hide-details
                    clearable
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
                  Bukti Transfer
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-text-field
										v-model="inputVerifikasi.bukti"
										placeholder="Upload"
										outlined
										dense
                  	style="display: none"
									/>
									<input 
										ref="inputBUKTIFile"
										:key="componentKey"
										type="file"
										accept="image/x-png,image/jpg,image/jpeg"
										style="display: none"
										@change="uploadFile($event)"
									>
									<v-btn v-if="editedIndex != 2" depressed small color="light-blue darken-3" dark @click="$refs.inputBUKTIFile.click()">
										<v-icon small left>{{editedIndex == 0 ? 'add' : 'edit'}}</v-icon> {{editedIndex == 0 ? 'Tambah' : 'Ubah'}} Bukti
									</v-btn>
									<br>
									<span v-if="this.inputVerifikasi.bukti != ''">
										<strong>nama file :</strong> <i>{{this.inputVerifikasi.bukti}}</i> {{editedIndex == 0 ? '('+(this.FileBUKTI.size / (1024*1024)).toFixed(2)+' MB)' : ''}}
										<v-icon small v-if="editedIndex != 2" color="red" @click="hapusFile()">delete</v-icon>
									</span>
                </v-col>
              </v-row>
							<div class="mt-3 mb-3">
								<v-divider />
							</div>
							<v-row v-if="FileBUKTI != ''" no-gutters>
                <v-col
                  cols="12"
                  md="4"
                  class="pt-2 d-flex align-center"
                >
                  Jumlah No NPL (yang di pesan)
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-text-field
                    v-model="inputVerifikasi.jml_nonpl"
                    placeholder="Jumlah No NPL"
                    outlined
                    dense
                    label="Jumlah No NPL"
                    color="light-blue darken-3"
										@keypress.native="onlyNumber($event, 2, inputVerifikasi.jml_nonpl)"
                    hide-details
                    clearable
                  />
									Last No. NPL : <strong>{{lastNoNPL}}</strong> 
									<div v-if="inputVerifikasi.jml_nonpl != ''">
										No. NPL : 
										<strong>
											<span v-for="(item, i) in kumpulNoNpl" :key="i">
												{{item.no_npl}},
											</span>
										</strong>
									</div>
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
									color="light-blue darken-3"
									class="white--text text--darken-2"
									small
									dense
									depressed
									:disabled="kondisiTombol2"
									@click="SimpanFormVerifikasi(FileBUKTI)"
								>
									Verifikasi & Upload Bukti
								</v-btn>
							</v-col>
						</v-row>
					</v-card-actions>	
				</v-card>
			</v-card>
		</v-dialog>
		<v-dialog
      v-model="DialogViewLampiranPembelianNPL"
      width="600px"
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="light-blue darken-3"
        >
          <v-toolbar-title>View Bukti PembelianNPL</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <v-btn
              icon
              dark
              @click="DialogViewLampiranPembelianNPL = false"
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
      v-model="DialogCropPembelianNPL"
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
  name: 'PembelianNPLLelang',
	components: { PopUpNotifikasiVue, Cropper },
	data: () => ({
		isLoading: false,
		roleID: '',
		DataPembelianNPL: [],
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
      { text: "Event", value: "event", sortable: false },
      { text: "Peserta", value: "peserta", sortable: false },
      { text: "No. Pembelian", value: "no_pembelian", sortable: false },
      { text: "Nominal", value: "nominal", sortable: false },
      { text: "Verifikasi", value: "verifikasi", sortable: false },
      { text: "Status", value: "status_aktif", sortable: false },
    ],
    rowsPerPageItems: { "items-per-page-options": [5, 10, 25, 50] },
    totalItems: 0,
		DataPeserta: [],
		DataEvent: [],
		DialogPembelianNPL: false,
		DialogViewLampiranPembelianNPL: false,
		DialogCropPembelianNPL: false,
		DialogVerifikasi: false,
		editedIndex: 3,
    kondisiTombol: true,
    kondisiTombol2: true,
		tampungNoPembelian: '',
		TypePembelianOptions: [
			{text: 'Online', value: 1},
			{text: 'Offline', value: 2},
		],
		TypeTransaksiOptions: [
			{text: 'Cash', value: 1},
			{text: 'Transfer/EDC', value: 2},
		],
		optionsUang: {
			locale: "pt-BR",
			prefix: "Rp.",
			suffix: "",
			length: 15,
			precision: 0
		},
		inputPembelianNPL: {
			id_pembelian_npl: '',
			UnixTextPeserta: '',
			id_event: '',
			id_peserta: '',
			type_pembelian: '',
			type_transaksi: '',
			no_pembelian: '',
			verifikasi: '',
			nominal: '',
			tanggal_transfer: '',
		},
		inputVerifikasi: {
			pesan_verifikasi: '',
			bukti: '',
			jml_nonpl: '',
		},
		lastNoNPL: '',
		kumpulNoNpl: [],
		image: {
      src: null,
      type: null,
    },
		menu: false,
		componentKey: 0,  
		FileBUKTI: '',
		urlView: '',

		//notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
	}),
	metaInfo: {
		title: "Lelang (Pembelian NPL) - WIN.ID",
		htmlAttrs: {
			lang: "id",
			amp: true,
		},
	},
	watch:{
		FileBUKTI(){
			if(this.FileBUKTI == undefined){
				this.FileBUKTI = ''
			}	
		},
		inputPembelianNPL: {
			deep: true,
			handler(value){

				if(value.id_peserta == null){ this.inputPembelianNPL.id_peserta = '' }
				if(value.id_event == null){ this.inputPembelianNPL.id_event = '' }
				if(value.type_pembelian == null){ this.inputPembelianNPL.type_pembelian = '' }
				if(value.type_transaksi == null){ this.inputPembelianNPL.type_transaksi = '' }
				if(value.nominal == null){ this.inputPembelianNPL.nominal = '' }
				if(value.tanggal_transfer == null){ this.inputPembelianNPL.tanggal_transfer = '' }

				if(this.editedIndex == 0 && !this.tampungNoPembelian) { this.tampungNoPembelian = `${this.makeRandomAngka(10)}.${value.id_peserta}` }
				if(this.editedIndex == 1) {
					let split = this.tampungNoPembelian.split('.')
					this.tampungNoPembelian = `${split[0]}.${value.id_peserta}` 
				}
        
				if(value.id_peserta != '' && value.id_event != '' && value.type_pembelian != '' && value.type_transaksi != '' && value.nominal != '' && 
				value.tanggal_transfer != '' && this.tampungNoPembelian != ''){
					this.kondisiTombol = false
				}else{
					this.kondisiTombol = true	
				}
			}
		},
		inputVerifikasi: {
			deep: true,
			handler(value){
				if(value.pesan_verifikasi == null){ this.inputVerifikasi.pesan_verifikasi = '' }
				if(value.jml_nonpl == null){ this.inputVerifikasi.jml_nonpl = '' }
				if(value.jml_nonpl == '' || value.jml_nonpl.length){ this.kumpulNoNpl = [] }

				let result = []
				let lastHit = this.lastNoNPL
				for (let index = 0; index < value.jml_nonpl; index++) {
					let hasil = `NPL_${(parseInt(lastHit.substr(4))+1).toString().padStart(5, '0')}`
					lastHit = hasil
					result.push(lastHit)
				}
				let uniqNoNPL = [...new Set(result)]
				uniqNoNPL.map(el => {
					this.kumpulNoNpl.push({ no_npl: el, npl: this.makeRandom(50) })
				})

				if(value.pesan_verifikasi != '' && value.bukti != ''){
					this.kondisiTombol2 = false
				}else{
					if(value.jml_nonpl != ''){
						this.kondisiTombol2 = false
					}else{
						this.kondisiTombol2 = true	
					}
				}
			}
		},
	},
	mounted() {
		this.roleID = localStorage.getItem("roleID")
		this.getPembelianNPL()
	},
	methods: {
		...mapActions({
      fetchData: "fetchData",
      uploadFiles: "upload/uploadFiles",
    }),
		getPembelianNPL() {
			this.isLoading = true
			let payload = {
				method: "get",
				url: `moduleMain/getAllPembelianNPL`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				this.DataPembelianNPL = res.data.result;
				this.isLoading = false
			})
			.catch((err) => {
				this.isLoading = false
				this.notifikasi("error", err.response.data.message, "1")
			});
		},
		getPeserta() {
			let payload = {
				method: "get",
				url: `moduleMain/getAllPeserta?status_aktif=1`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				this.DataPeserta = res.data.result;
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
		},
		getEvent() {
			let payload = {
				method: "get",
				url: `moduleMain/getAllEvent?status_aktif=1`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				this.DataEvent = res.data.result;
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
		},
		getNoNPL(id) {
			let payload = {
				method: "get",
				url: `moduleMain/getAllNPLBy?id_event=${id}`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				if(Object.entries(res.data.result).length){
					this.lastNoNPL = res.data.result.no_npl;
				}else{
					this.lastNoNPL = 'NPL-00000';
				}
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
		},
		bukaDialog(item, index){
			this.editedIndex = index
			this.getEvent()
			this.getPeserta(null, false)
			if(index == 0){
				this.clearForm()
      }else{
				this.inputPembelianNPL.id_pembelian_npl = item.id_pembelian_npl ? item.id_pembelian_npl : ''
				this.inputPembelianNPL.id_peserta = item.id_peserta ? item.id_peserta : ''
				this.inputPembelianNPL.id_event = item.id_event ? item.id_event : ''
        this.inputPembelianNPL.type_pembelian = item.type_pembelian ? item.type_pembelian : ''
        this.inputPembelianNPL.type_transaksi = item.type_transaksi ? item.type_transaksi : ''
        this.inputPembelianNPL.verifikasi = item.verifikasi
        this.inputPembelianNPL.nominal = item.nominal ? item.nominal : ''
        this.inputPembelianNPL.tanggal_transfer = item.tanggal_transfer ? this.convertDateToPicker2(item.tanggal_transfer) : ''
        this.tampungNoPembelian = item.no_pembelian ? item.no_pembelian : ''
        this.inputVerifikasi.bukti = item.bukti ? item.bukti : ''
        this.inputVerifikasi.pesan_verifikasi = item.pesan_verifikasi ? item.pesan_verifikasi : ''
			}
			this.DialogPembelianNPL = true
		},
		tutupDialog() {
      this.clearForm()
			this.editedIndex = 3
      this.DialogPembelianNPL = false
    },
		SimpanForm(index) {
      let bodyData = {
        jenis: index == 0 ? 'ADD' : 'EDIT',
				id_pembelian_npl: index == 0 ? '' : this.inputPembelianNPL.id_pembelian_npl,
				id_event: this.inputPembelianNPL.id_event,
				id_peserta: this.inputPembelianNPL.id_peserta,
				type_pembelian: this.inputPembelianNPL.type_pembelian,
				type_transaksi: this.inputPembelianNPL.type_transaksi,
				no_pembelian: this.tampungNoPembelian,
				nominal: this.inputPembelianNPL.nominal,
				tanggal_transfer: this.inputPembelianNPL.tanggal_transfer,
        create_update_by: localStorage.getItem('idLogin'),
      }
      let payload = {
				method: "post",
				url: `moduleMain/prosesPembelianNPL`,
        body: bodyData,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then(async (res) => {
				this.notifikasi("success", res.data.message, "1")
				this.clearForm()
        this.DialogPembelianNPL = false
        this.getPembelianNPL()
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
    },
		SimpanFormVerifikasi(dataUpload) {
      let bodyData = {
				jenis: 'VERIFIKASI',
				id_pembelian_npl: this.inputPembelianNPL.id_pembelian_npl,
				id_peserta: this.inputPembelianNPL.id_peserta,
        id_event: this.inputPembelianNPL.id_event,
				pesan_verifikasi: this.inputVerifikasi.pesan_verifikasi,
				bukti: this.inputVerifikasi.bukti,
        dataNPL: this.kumpulNoNpl,
				create_update_by: localStorage.getItem('idLogin'),
      }
      let payload = {
				method: "post",
				url: `moduleMain/prosesPembelianNPL`,
        body: bodyData,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then(async (res) => {
				if(this.FileBUKTI){
					let uploadBUKTI = await this.uploadLampiran(dataUpload)
					if(uploadBUKTI.data.kode == 200){
						this.notifikasi("success", res.data.message, "1")
					}else{
						this.notifikasi("error", 'Gagal proses data', "1")
					}
				}else{
					this.notifikasi("success", res.data.message, "1")
				}
				// this.notifikasi("success", res.data.message, "1")
				this.clearForm()
        this.DialogVerifikasi = false
        this.getPembelianNPL()
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
    },
		async uploadLampiran(dataUpload) {
			if(dataUpload){
				const bodyData = {
					proses: 'EDIT',
					id: this.inputPembelianNPL.id_pembelian_npl,
					nama_folder: this.inputPembelianNPL.UnixTextPeserta,
					nama_file: `Bukti-${this.convertDate(this.inputPembelianNPL.tanggal_transfer)}${this.makeRandom(8)}`,
					jenis: "images",
					bagian: "berkas",
					table: "t_pembelian_npl",
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
        id_pembelian_npl: item.id_pembelian_npl,
        delete_by: localStorage.getItem('idLogin'),
      }
      let payload = {
				method: "post",
				url: `moduleMain/prosesPembelianNPL`,
        body: bodyData,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
        this.DialogPembelianNPL = false
        this.getPembelianNPL()
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
    },
    StatusRecord(item, status_aktif) {
      let bodyData = {
        jenis: 'STATUSRECORD',
        id_pembelian_npl: item.id_pembelian_npl,
        status_aktif: status_aktif,
      }
      let payload = {
				method: "post",
				url: `moduleMain/prosesPembelianNPL`,
        body: bodyData,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
        this.DialogPembelianNPL = false
        this.getPembelianNPL()
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
    },
		clearForm() {
			this.inputPembelianNPL.UnixTextPeserta = ''
			this.inputPembelianNPL.id_pembelian_npl = ''
			this.inputPembelianNPL.id_peserta = ''
			this.inputPembelianNPL.id_event = ''
			this.inputPembelianNPL.type_pembelian = ''
			this.inputPembelianNPL.type_transaksi = ''
			this.inputPembelianNPL.verifikasi = ''
			this.inputPembelianNPL.nominal = ''
			this.inputPembelianNPL.tanggal_transfer = ''
			this.tampungNoPembelian = ''
			this.FileBUKTI = ''
			this.inputVerifikasi.pesan_verifikasi = ''
			this.inputVerifikasi.bukti = ''
		},
		async uploadFile(e) {
			this.FileBUKTI = await e.target.files[0];
			this.inputVerifikasi.bukti = this.FileBUKTI.name;
			this.loadImage(this.FileBUKTI)
    },
		loadImage(files) {
      this.DialogCropPembelianNPL = true
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
				this.FileBUKTI = blob
			}, this.image.type);
      this.DialogCropPembelianNPL = false
		},
		hapusFile(){
			this.FileBUKTI = ''
			this.inputVerifikasi.bukti = '';
			this.image = {
				src: null,
				type: null,
			}
		},
		tutupDialogCrop(){
      this.hapusFile()
			this.editedIndex = 3
      this.DialogCropPembelianNPL = false
    },
		viewLampiran() {
			this.DialogViewLampiranPembelianNPL = true
			const API_URL = process.env.VUE_APP_NODE_ENV === "production" ? process.env.VUE_APP_VIEW_PROD_API_URL : process.env.VUE_APP_VIEW_DEV_API_URL
			const no_image = `${API_URL}No_Image_Available.jpg`
			this.urlView = this.inputVerifikasi.bukti ? `${API_URL}image/berkas/${this.inputVerifikasi.bukti}` : no_image
			// this.urlView = this.inputVerifikasi.bukti ? `${API_URL}${this.inputVerifikasi.bukti}` : no_image
		},
		bukaDialogVerifikasi() {
			this.dialogNotifikasi = false
			this.DialogVerifikasi = true
		},
		tutupDialogVerifikasi() {
			this.inputVerifikasi.pesan_verifikasi = ''
			this.inputVerifikasi.bukti = ''
			this.inputVerifikasi.jml_nonpl = ''
			this.FileBUKTI = ''
			this.image = {
				src: null,
				type: null,
			}
			this.DialogVerifikasi = false
		},
		questionProses(item, verif) {
			this.inputPembelianNPL.id_pembelian_npl = item.id_pembelian_npl ? item.id_pembelian_npl : ''
			this.inputPembelianNPL.id_peserta = item.id_peserta ? item.id_peserta : ''
			this.inputPembelianNPL.id_event = item.id_event ? item.id_event : ''
			this.inputPembelianNPL.verifikasi = verif
			this.inputPembelianNPL.tanggal_transfer = item.tanggal_transfer ? this.convertDateToPicker2(item.tanggal_transfer) : ''
			this.inputPembelianNPL.UnixTextPeserta = item.data_peserta.UnixText ? item.data_peserta.UnixText : ''
			this.inputVerifikasi.pesan_verifikasi = item.pesan_verifikasi ? item.pesan_verifikasi : ''
			this.inputVerifikasi.bukti = item.bukti ? item.bukti : ''
			if(verif == 1){
				this.notifikasi('questionProses', 'Apakah anda ingin upload bukti dan menambahkan pesan verifikasi ?', '2')
				this.getNoNPL(item.id_event)
			}else{
				this.StatusVerifikasi(this.inputVerifikasi.bukti)		
			}
		},
		StatusVerifikasi(bukti) {
			if(bukti == ''){
				this.DialogPembelianNPL = false
        this.getPembelianNPL()
        this.notifikasi("warning", 'Bukti Transfer tidak di temukan, tolong Upload Bukti Transfer !', "1")
				return
			}
			let bodyData = {
        jenis: 'STATUSVERIFIKASI',
        id_pembelian_npl: this.inputPembelianNPL.id_pembelian_npl,
        verifikasi: this.inputPembelianNPL.verifikasi,
        pesan_verifikasi: this.inputVerifikasi.pesan_verifikasi,
      }
      let payload = {
				method: "post",
				url: `moduleMain/prosesPembelianNPL`,
        body: bodyData,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
        this.DialogPembelianNPL = false
        this.getPembelianNPL()
        this.notifikasi("success", res.data.message, "1")
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