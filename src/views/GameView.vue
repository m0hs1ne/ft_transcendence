<!-- CanvasComponent.vue -->
<template>
	<!-- <div class="flex dark:bg-slate-800 h-screen items-center justify-center">
		<canvas ref="gameCanvas" width="800" height="400" class="rounded-xl">

		</canvas>
	</div> -->
</template>
  
<script>
export default {
	data() {
		return {
			PaddleHeight: 120,
			PaddleWidth: 14,
		};
	},
	methods: {
		draw() {
			console.log("Start Rendering?");
			const canvas = this.$refs.gameCanvas;
			const context = canvas.getContext("2d");

			context.clearRect(0, 0, canvas.width, canvas.height);
			this.drawRect(0, 0, canvas.width, canvas.height, "#1F173D");
			this.drawRect(5, 120, this.PaddleWidth, this.PaddleHeight, "#A33A6F");
			this.drawRect(
				canvas.width - 15,
				120,
				this.PaddleWidth,
				this.PaddleHeight,
				"#A33A6F"
			);
			this.drawBall(300, 200, 10, "#A33A6F");
		},

		drawBall(x, y, radius, color) {
			const context = this.$refs.gameCanvas.getContext("2d");
			context.fillStyle = color;
			context.beginPath();
			context.arc(x, y, radius, 0, Math.PI * 2);
			context.fill();
		},

		drawRect(x, y, width, height, color) {
			const context = this.$refs.gameCanvas.getContext("2d");
			context.fillStyle = color;
			context.fillRect(x, y, width, height);
		},
	},

	mounted() {
		this.draw();
	},
};
</script>
  
<style scoped>
/* Add your styles here if needed */
</style>
  