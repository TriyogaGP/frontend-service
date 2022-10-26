<template>
	<div>
		<h4>Testing {{ siteLogin }}</h4>

		<v-btn
			color="lime accent-3"
			small
			dense
			depressed
			class="black--text text--darken-2"
			@click="tombolJoin()"
		>
			<v-icon small left>person</v-icon> Tombol {{ siteLogin }}
		</v-btn>
		<v-btn
			v-if="siteLogin == 'Admin'"
			color="lime accent-3"
			small
			dense
			depressed
			class="ml-2 black--text text--darken-2"
			@click="Clear()"
			>
			<v-icon small left>clear</v-icon> Clear
		</v-btn>

		<div class="mt-3" v-for="(data, index) in userData" :key="index">
			{{ data.nama }}<br>
		</div>
	</div>
</template>

<script>
import io from 'socket.io-client'
export default {
	name: 'Testing',
  data: () => ({
		siteLogin: '',
		API_URL: '',
		userData: [],
	}),
	created() {
		this.API_URL = process.env.VUE_APP_NODE_ENV === "production" ? process.env.VUE_APP_VIEW_PROD_API_URL : process.env.VUE_APP_VIEW_DEV_API_URL
		const socket = io(this.API_URL);
		socket.on("clear", (data) => {
			this.userData = data
		});
	},
	mounted() {
		this.API_URL = process.env.VUE_APP_NODE_ENV === "production" ? process.env.VUE_APP_VIEW_PROD_API_URL : process.env.VUE_APP_VIEW_DEV_API_URL
		this.siteLogin = localStorage.getItem('siteLogin');
	},
	methods: {
		tombolJoin() {
			const socket = io(this.API_URL);
			socket.emit("join-testing", { 
        room: 'testing_room', 
        nama: localStorage.getItem('nama'), 
      });
			socket.on("UsersData", (data) => {
        this.userData = data
			});
		},
		Clear() {
			const socket = io(this.API_URL);
			socket.emit("clear", { room: 'testing_room' });
			socket.on("clear", (data) => {
        this.userData = data
			});
		}
	}
}
</script>

<style>

</style>