import ApiService from "@/core/services/api.service";

const state = {
}

const actions = {
  uploadFiles: function ({commit}, data) {
    return new Promise((resolve, reject) => {
      let fData = new FormData();
      fData.append('proses', data.proses); //proses
      fData.append('id', data.id); //id
      if(data.bagian == 'berkas'){
        fData.append('nik', data.nik); //nik
      }else if(data.bagian == 'event'){
        fData.append('kode_event', data.kode_event); //nama
        fData.append('nama_event', data.nama_event); //nama
      }else if(data.bagian == 'barang_lelang'){
        fData.append('nama_barang_lelang', data.nama_barang_lelang); //nama
      }else if(data.bagian == 'mall'){
        fData.append('nama_tenant_kategori', data.nama_tenant_kategori || null); //nama
        fData.append('nama_tenant_mall', data.nama_tenant_mall || null); //nama
        fData.append('judul_content', data.judul_content || null); //nama
      }else if(data.bagian == 'bukti_pemenang'){
        fData.append('no_rek', data.no_rek); //nama
        fData.append('nama_pemilik', data.nama_pemilik); //nama
      }
      fData.append('nama_folder', data.nama_folder); //nama_folder
      fData.append('nama_file', data.nama_file); //nama_file
      fData.append('jenis', data.jenis); //jenis
      fData.append('bagian', data.bagian); //bagian
      fData.append('table', data.table); //bagian
      fData.append('file', data.files); //data files
      // fData.append('id_profile', idProfile ? idProfile : null); //id profile user
      // axios services
      ApiService.postFile('settings/updateFile', fData)
        .then((res) => resolve(res))
        .catch((err) => reject(err))
    });
  },
  uploadExcel: function ({commit},data) {
    return new Promise((resolve, reject) => {
      let idProfile = localStorage.getItem('profile_id');
      let fData = new FormData();
      fData.append('main_modul', data.nama_modul); //nama modul
      fData.append('strKey', data.strKey); //id permohonan
      fData.append('strSubkey', data.strSubKey); //id proyek
      fData.append('nama_file', data.nama_file); //nama file nya
      fData.append('id_profile', idProfile ? idProfile : null); //id profile user
      fData.append('file', data.files); //data files
      // axios services
      ApiService.post('file/uploadExcel', fData)
        .then((res) => resolve(res))
        .catch((err) => reject(err))
    });
  },
}

export default {
  namespaced: true,
  actions,
  state
}