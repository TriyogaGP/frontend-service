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

		<v-divider class="mt-3 mb-2" />
		<v-card class="mt-2 mb-2 pa-1" outlined elevation="0">
			<h4>HIT MANUAL</h4>
			<v-card-text>
				<v-row no-gutters>
					<v-col
						cols="12"
						md="4"
						class="pt-2 d-flex align-center"
					>
						No Invoice
					</v-col>
					<v-col
						cols="12"
						md="8"
						class="pt-3"
					>
						<v-text-field
							placeholder="No Invoice"
							outlined
							dense
							label="No Invoice"
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
							color="light-blue darken-3"
							class="white--text text--darken-2"
							small
							dense
							depressed
							@click.stop="hitManual()"
						>
							Hit Manual
						</v-btn>
					</v-col>
				</v-row>
			</v-card-actions>
		</v-card>

	</div>
</template>

<script>
import { mapActions } from "vuex";
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
		},
		async hitManual() {
			const headers = new Headers();
      headers.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUyNjQiLCJ1c2VyVHlwZSI6Ik1FTUJFUiIsImlhdCI6MTY1NTI4MjAyNCwiZXhwIjoxNjg2ODE4MDI0fQ.Nhuug2zsGa5kAFA4XbzGbX4JT3LJj9eXCTiGI-1LPoo");
      headers.append("Origin", "https://k-mart.co.id");
      headers.append("access-control-allow-origin", "https://k-mart.co.id");
      headers.append("access-control-allow-credentials", true);
      headers.append("Content-Type", "application/json");
      const request = new Request(
        "https://kld-api-stg.k-mart.co.id/v1/admin/orders/get-data-harian?dateRange=2022-10-09,2022-10-10",
        {
          method: "GET",
          headers,
        }
      );
      const res = await fetch(request);
      const { data } = await res.json();
			console.log(data);


			// let bodydata = {

			// }
			// try {
			// } catch (error) {
			// 	console.log(error);
			// }
		},
	}
}
</script>

<style>

</style>