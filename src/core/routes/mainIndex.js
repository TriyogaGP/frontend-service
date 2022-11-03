export default [
  {
    path: '',
    component: () => import("@/views/Layout/index.vue"),
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue')
      },
      {
        path: '/profile',
        name: 'Profile',
        component: () => import('@/views/Profile.vue')
      },
      {
        path: '/settings',
        name: 'Settings',
        component: () => import('@/views/Settings.vue')
      },
      {
        path: '/dataAdmin',
        name: 'DataAdmin',
        component: () => import('@/views/page-content/Administrator/V_Administrator.vue')
      },
      {
        path: '/dataPeserta',
        name: 'DataPeserta',
        component: () => import('@/views/page-content/Peserta/V_Peserta.vue')
      },
      {
        path: '/dataWinPay',
        name: 'DataWinPay',
        component: () => import('@/views/page-content/WinPay/V_WinPay.vue')
      },
      {
        path: '/dataLelang',
        name: 'DataLelang',
        component: () => import('@/views/page-content/Lelang/V_Lelang.vue')
      },
      {
        path: '/dataECommerce',
        name: 'DataECommerce',
        component: () => import('@/views/page-content/E-Commerce/V_ECommerce.vue')
      },
      {
        path: '/dataEMall',
        name: 'DataEMall',
        component: () => import('@/views/page-content/E-Mall/V_EMall.vue')
      },

      //Notifikasi
      {
        path: '/Notifikasi',
        name: 'Notifikasi',
        component: () => import('@/views/Notifikasi.vue')
      },

      //Testing
      {
        path: '/Testing',
        name: 'Testing',
        component: () => import('@/views/Testing.vue')
      },
      
      //data untuk admin lelang
      {
        path: '/dataKategoriLelang',
        name: 'DataKategoriLelang',
        component: () => import('@/views/page-content/Lelang/V_KategoriBarang.vue')
      },
      {
        path: '/dataBarangLelang',
        name: 'DataBarangLelang',
        component: () => import('@/views/page-content/Lelang/V_Barang.vue')
      },
      {
        path: '/dataLot',
        name: 'DataLot',
        component: () => import('@/views/page-content/Lelang/V_Lot.vue')
      },
      {
        path: '/dataEvent',
        name: 'DataEvent',
        component: () => import('@/views/page-content/Lelang/V_Event.vue')
      },
      {
        path: '/dataPemenang',
        name: 'DataPemenang',
        component: () => import('@/views/page-content/Lelang/V_Pemenang.vue')
      },
      {
        path: '/dataPembelianNPL',
        name: 'DataPembelianNPL',
        component: () => import('@/views/page-content/Lelang/V_PembelianNPL.vue')
      },
      {
        path: '/dataNPL',
        name: 'DataNPL',
        component: () => import('@/views/page-content/Lelang/V_NPL.vue')
      },
      {
        path: '/dataBidding',
        name: 'DataBidding',
        component: () => import('@/views/page-content/Lelang/V_Bidding.vue')
      },

      //data untuk admin belanja
      {
        path: '/dataKategoriProduk',
        name: 'DataKategoriProduk',
        component: () => import('@/views/page-content/E-Commerce/V_KategoriProduk.vue')
      },
      {
        path: '/dataProduk',
        name: 'DataProduk',
        component: () => import('@/views/page-content/E-Commerce/V_Produk.vue')
      },
      {
        path: '/dataPromosiProduk',
        name: 'DataPromosiProduk',
        component: () => import('@/views/page-content/E-Commerce/V_PromosiProduk.vue')
      },
      {
        path: '/dataOrderProduk',
        name: 'DataOrderProduk',
        component: () => import('@/views/page-content/E-Commerce/V_OrderProduk.vue')
      },
      {
        path: '/dataPembayaran',
        name: 'DataPembayaran',
        component: () => import('@/views/page-content/E-Commerce/V_Pembayaran.vue')
      },
      {
        path: '/dataPengiriman',
        name: 'DataPengiriman',
        component: () => import('@/views/page-content/E-Commerce/V_Pengiriman.vue')
      },

      //data untuk admin mall
      {
        path: '/dataAdminTenantMall',
        name: 'DataAdminTenantMall',
        component: () => import('@/views/page-content/Administrator/V_Administrator.vue')
      },
      {
        path: '/dataMall',
        name: 'DataMall',
        component: () => import('@/views/page-content/E-Mall/V_Mall.vue')
      },
      {
        path: '/dataFasilitasMall',
        name: 'DataFasiltasMall',
        component: () => import('@/views/page-content/E-Mall/V_FasilitasMall.vue')
      },
      {
        path: '/dataKategoriTenant',
        name: 'DataKategoriTenantMall',
        component: () => import('@/views/page-content/E-Mall/V_KategoriTenantMall.vue')
      },
      {
        path: '/dataTenant',
        name: 'DataTenantMall',
        component: () => import('@/views/page-content/E-Mall/V_TenantMall.vue')
      },
      {
        path: '/dataContentMall',
        name: 'DataContentMall',
        component: () => import('@/views/page-content/E-Mall/V_ContentMall.vue')
      },
      
      //data untuk admin tenant mall
      {
        path: '/dataContentTenantMall',
        name: 'DataContentTenantMall',
        component: () => import('@/views/page-content/E-Mall/V_ContentTenantMall.vue')
      },
    ]
  },
  {
    path: '/Bidding/:no_lot/:nama_event/:nama',
    name: 'Bidding',
    prop: true,
    component: () => import('@/views/Bidding.vue')
  },
  {
    path: '/Bidding/:no_lot/:nama_event/:nama',
    name: 'Bidding',
    prop: true,
    component: () => import('@/views/Bidding.vue')
  },
  {
    path: '/undercontruction',
    name: 'UnderContruction',
    prop: true,
    component: () => import('@/views/UnderContruction.vue')
  },
]