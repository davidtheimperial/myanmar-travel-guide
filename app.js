(function () {
	'use strict';

	var header = document.querySelector('.site-header');
	var toggle = document.querySelector('.nav-toggle');
	var nav = document.getElementById('site-nav');

	/* Footer year, so the site never goes stale again. */
	document.querySelectorAll('[data-year]').forEach(function (el) {
		el.textContent = new Date().getFullYear();
	});

	/* Accessible disclosure menu (only active below the nav breakpoint). */
	if (header && toggle && nav) {
		var setOpen = function (open) {
			header.classList.toggle('nav-open', open);
			toggle.setAttribute('aria-expanded', String(open));
			toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
		};

		toggle.addEventListener('click', function () {
			setOpen(!header.classList.contains('nav-open'));
		});

		/* Close after following a link. */
		nav.addEventListener('click', function (event) {
			if (event.target.closest('a')) setOpen(false);
		});

		/* Escape closes and returns focus to the button. */
		document.addEventListener('keydown', function (event) {
			if (event.key === 'Escape' && header.classList.contains('nav-open')) {
				setOpen(false);
				toggle.focus();
			}
		});

		/* Tapping outside closes. */
		document.addEventListener('click', function (event) {
			if (header.classList.contains('nav-open') && !header.contains(event.target)) {
				setOpen(false);
			}
		});

		/* Don't leave the menu "open" after rotating or resizing to desktop. */
		var desktop = window.matchMedia('(min-width: 861px)');
		var onChange = function (event) {
			if (event.matches) setOpen(false);
		};
		if (desktop.addEventListener) {
			desktop.addEventListener('change', onChange);
		} else if (desktop.addListener) {
			desktop.addListener(onChange);
		}
	}

	/* Fallback: highlight the current page if the markup didn't say so. */
	var file = window.location.pathname.split('/').pop() || 'index.html';
	document.querySelectorAll('.site-nav a').forEach(function (link) {
		if (link.hasAttribute('aria-current')) return;
		var href = link.getAttribute('href');
		if (href && href.split('#')[0] === file) {
			link.setAttribute('aria-current', 'page');
		}
	});

	/* Ambient music toggle ---------------------------------------------------
	   A short pentatonic phrase over a low drone, synthesised with the Web
	   Audio API on first press. No audio file to download, nothing licensed.
	   Off by default; nothing plays until the visitor asks for it. */
	var musicBtn = document.querySelector('[data-music-toggle]');

	if (musicBtn) {
		var audioCtx = null;
		var master = null;
		var pluckTimer = null;
		var stopTimer = null;
		var playing = false;
		var notes = [261.63, 293.66, 349.23, 392.0, 440.0, 523.25];

		var buildAudio = function () {
			var Ctx = window.AudioContext || window.webkitAudioContext;
			if (!Ctx) return false;

			try {
				audioCtx = new Ctx();
			} catch (error) {
				return false;
			}

			master = audioCtx.createGain();
			master.gain.value = 0;
			master.connect(audioCtx.destination);

			/* Two detuned sines, filtered down, form a quiet bed. */
			var filter = audioCtx.createBiquadFilter();
			filter.type = 'lowpass';
			filter.frequency.value = 620;
			filter.connect(master);

			var droneGain = audioCtx.createGain();
			droneGain.gain.value = 0.07;
			droneGain.connect(filter);

			[110, 164.81, 220].forEach(function (freq, index) {
				var osc = audioCtx.createOscillator();
				osc.type = 'sine';
				osc.frequency.value = freq;
				osc.detune.value = index === 1 ? 6 : -4;
				osc.connect(droneGain);
				osc.start();
			});

			return true;
		};

		var pluck = function () {
			if (!playing) return;

			var now = audioCtx.currentTime;
			var osc = audioCtx.createOscillator();
			var gain = audioCtx.createGain();
			var note = notes[Math.floor(Math.random() * notes.length)];

			osc.type = 'triangle';
			osc.frequency.setValueAtTime(note, now);
			osc.frequency.exponentialRampToValueAtTime(note * 0.997, now + 1.8);

			gain.gain.setValueAtTime(0.0001, now);
			gain.gain.exponentialRampToValueAtTime(0.18, now + 0.02);
			gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.1);

			osc.connect(gain);
			gain.connect(master);
			osc.start(now);
			osc.stop(now + 2.2);
		};

		var schedule = function () {
			if (!playing) return;
			pluck();
			pluckTimer = window.setTimeout(schedule, 850 + Math.random() * 650);
		};

		var start = function () {
			if (!audioCtx && !buildAudio()) {
				musicBtn.disabled = true;
				musicBtn.title = 'Audio is not supported in this browser';
				return;
			}

			if (stopTimer) {
				window.clearTimeout(stopTimer);
				stopTimer = null;
			}

			playing = true;
			musicBtn.setAttribute('aria-pressed', 'true');
			musicBtn.title = 'Pause ambient music';

			if (audioCtx.state === 'suspended') audioCtx.resume();

			var now = audioCtx.currentTime;
			master.gain.cancelScheduledValues(now);
			master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), now);
			master.gain.exponentialRampToValueAtTime(0.2, now + 1.2);

			schedule();
		};

		var stop = function () {
			if (!audioCtx) return;

			playing = false;
			musicBtn.setAttribute('aria-pressed', 'false');
			musicBtn.title = 'Play ambient music';

			if (pluckTimer) {
				window.clearTimeout(pluckTimer);
				pluckTimer = null;
			}

			var now = audioCtx.currentTime;
			master.gain.cancelScheduledValues(now);
			master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), now);
			master.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

			stopTimer = window.setTimeout(function () {
				if (!playing && audioCtx.state === 'running') audioCtx.suspend();
				stopTimer = null;
			}, 550);
		};

		musicBtn.title = 'Play ambient music';

		musicBtn.addEventListener('click', function () {
			if (playing) {
				stop();
			} else {
				start();
			}
		});

		/* Don't keep playing in a tab nobody is looking at. */
		document.addEventListener('visibilitychange', function () {
			if (document.hidden && playing) stop();
		});
	}
})();
