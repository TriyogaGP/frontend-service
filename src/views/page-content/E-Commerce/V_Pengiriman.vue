<template>
  <div>
		<v-card :class="roleID == 4 && 'mt-2 mb-2 pa-1'" :outlined="roleID == 4" elevation="0">
			<h1 class="subheading grey--text">Panel Pengiriman Produk</h1>
		</v-card>
	</div>
</template>
<script>
export default {
	name: 'Pengiriman',
	data: () => ({
		isLoading: false,
		roleID: '',
	}),
	mounted(){
		this.roleID = localStorage.getItem("roleID")
	},
	methods: {

	}
}
</script>
<style>

</style>