const timerInput = document.querySelector(".timer__input");
const timerPlay = document.querySelector(".timer__play");
const timerPause = document.querySelector(".timer__pause");
const circle = document.querySelector(".svg__circle");
const icons = document.querySelectorAll(".fas");

const radius = circle.getAttribute("r");
const strokeLength = 2 * Math.PI * radius;
let strokeOffset = 0;
let red = 230;
let green = 143;
let blue = 29;
circle.setAttribute("stroke-dasharray", strokeLength);

class Timer {
	constructor(timerInput, timerPlay, timerPause, callbacks) {
		this.timerInput = timerInput;
		this.timerPlay = timerPlay;
		this.timerPause = timerPause;
		this.isPlayed = false;

		if (callbacks) {
			this.onStart = callbacks.onStart;
			this.onTick = callbacks.onTick;
			this.onComplete = callbacks.onComplete;
			this.resetTimer = callbacks.resetTimer;
		}

		this.timerPlay.addEventListener("click", () => {
			if (this.isPlayed === false) {
				this.start();
			}
		});
		this.timerPause.addEventListener("click", this.pause);
	}

	start = () => {
		if (this.onStart()) {
			this.timeSet = this.onStart();
		}
		this.isPlayed = true;
		this.tick();
		this.interval = setInterval(this.tick, 20);
	};

	pause = () => {
		clearInterval(this.interval);
		this.timerInput.value = "";
		this.resetTimer();
		this.isPlayed = false;
		console.log(this.isPlayed);
	};

	tick = () => {
		if (this.timerInput.value <= 0) {
			if (this.onComplete) {
				this.onComplete();
			}
			this.pause();
		} else {
			this.onTick(this.timeSet);
			this.timeRemaining -= 0.02;
		}
	};

	get timeRemaining() {
		return parseFloat(this.timerInput.value);
	}

	set timeRemaining(time) {
		this.timerInput.value = time.toFixed(2);
	}
}

const timer = new Timer(timerInput, timerPlay, timerPause, {
	onStart() {
		return parseFloat(timerInput.value);
	},
	onTick(timeSet) {
		circle.setAttribute("stroke-dashoffset", strokeOffset);
		strokeOffset -= (strokeLength / timeSet) * 0.02;
		red -= (strokeLength / timeSet) * 0.005;
		green += (strokeLength / timeSet) * 0.001;
		blue += (strokeLength / timeSet) * 0.01;
		circle.style.stroke = `rgb(${red}, ${green}, ${blue})`;
		timerInput.style.backgroundColor = `rgb(${red}, ${green}, ${blue})`;
		icons.forEach((icon) => {
			icon.style.color = `rgb(${red}, ${green}, ${blue})`;
		});
	},
	onComplete() {
		circle.setAttribute("stroke-dasharray", strokeLength);
		circle.setAttribute("stroke-dashoffset", strokeOffset);
	},
	resetTimer() {
		strokeOffset = 0;
		red = 230;
		green = 143;
		blue = 29;
	},
});
