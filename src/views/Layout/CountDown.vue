<template>
	<div>
		<!-- <div class="day">
			<span class="number">{{ days }}</span>
			<div class="format">{{ wordString.day }}</div>
		</div>
		<div class="hour">
			<span class="number">{{ hours }}</span>
			<div class="format">{{ wordString.hours }}</div>
		</div> -->
		<div class="min">
			<span class="number">{{ minutes }}</span>
			<!-- <div class="format">{{ wordString.minutes }}</div> -->
		</div>
		:
		<div class="sec">
			<span class="number">{{ seconds }}</span>
			<!-- <div class="format">{{ wordString.seconds }}</div> -->
		</div>
		<!-- <div class="message">{{ message }}</div>
		<div class="status-tag" :class="statusType">{{ statusText }}</div> -->
	</div>
</template>
<script>
export default {
  props: ['starttime','endtime','trans','kondisi','selesaitombol','updateWaktu'],
  data() {
    return{
			timer:"",
      wordString: {},
      start: "",
      end: "",
      interval: "",
      days:"",
      minutes:"",
      hours:"",
      seconds:"",
      message:"",
      statusType:"",
      statusText: "",
			kondisiTimer: ""
    }
  },
	watch: {
		kondisi(value){
			this.kondisiTimer = value
			// console.log(this.kondisiTimer, value);
			if(this.kondisiTimer == false){
				this.start = new Date(this.starttime).getTime();
				this.end = new Date(this.endtime).getTime();
				this.timerCount(this.start,this.end);
				this.interval = setInterval(() => {
					if(this.updateWaktu == true){
						this.start = new Date(this.starttime).getTime();
						this.end = new Date(this.endtime).getTime();
						this.$emit("updateTime", false);
					}
					this.timerCount(this.start,this.end);
				}, 1000);
			}else{
				this.days = 0
				this.hours = 0
				this.minutes = 0
				this.seconds = 0
			}
      return this.kondisiTimer
		},
		selesaitombol(value){
			// console.log(value, 'masuk sini');
			if(value == true) {
				this.$emit("selesaitrig", true);
				this.kondisiTimer = true
				clearInterval(this.interval);
				return;
			}
		}
	},
	updated() {
		if(this.kondisiTimer != false){
			this.days = 0
			this.hours = 0
			this.minutes = 0
			this.seconds = 0
		}
	},
  created() {
		this.wordString = JSON.parse(this.trans);
	},
  mounted(){
		this.days = 0
		this.hours = 0
		this.minutes = 0
		this.seconds = 0
  },
  methods:{
    timerCount(start,end){
			let now = new Date().getTime();
			let distance = start - now;
			let passTime =  end - now;
			
			this.days = Math.floor(passTime / (1000 * 60 * 60 * 24));
			this.hours = Math.floor((passTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			this.minutes = Math.floor((passTime % (1000 * 60 * 60)) / (1000 * 60));
			this.seconds = Math.floor((passTime % (1000 * 60)) / 1000);
			// console.log(this.minutes, this.seconds);
			if(this.minutes == 0 && this.seconds == 0) {
				this.message = this.wordString.expired;
				this.statusType = "Waktu Habis";
				this.statusText = this.wordString.status.expired;
				this.$emit("selesaiwaktu", true);
				this.kondisiTimer = true
				clearInterval(this.interval);
				return;
			}else if(this.minutes > 0 && this.seconds > 0) {
				this.message = this.wordString.running;
				this.statusType = "Masih Berlangsung";
				this.statusText = this.wordString.status.running;
			}
			
			// if(distance < 0 && passTime < 0){
			// 	this.message = this.wordString.expired;
			// 	this.statusType = "Waktu Habis";
			// 	this.statusText = this.wordString.status.expired;
			// 	this.$emit("selesaiwaktu", true);
			// 	this.kondisiTimer = true
			// 	clearInterval(this.interval);
			// 	return;
			// }else if(distance < 0 && passTime > 0){
			// 	this.calcTime(passTime);
			// 	this.message = this.wordString.running;
			// 	this.statusType = "Masih Berlangsung";
			// 	this.statusText = this.wordString.status.running;
			// } else if(distance > 0 && passTime > 0){
			// 	this.calcTime(distance); 
			// 	this.message = this.wordString.upcoming;
			// 	this.statusType = "Akan Datang";
			// 	this.statusText = this.wordString.status.upcoming;
			// }
    },
    calcTime(dist){
			this.days = Math.floor(dist / (1000 * 60 * 60 * 24));
			this.hours = Math.floor((dist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			this.minutes = Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60));
			this.seconds = Math.floor((dist % (1000 * 60)) / 1000);
			// console.log(this.minutes, this.seconds);
			// if(this.minutes == 1 && this.seconds == 50) {
			// 	this.$emit("selesaiwaktu", true);
			// 	this.kondisiTimer = true
			// 	clearInterval(this.interval);
			// 	return;
			// }
    }
  },
}
</script>
<style>
</style>