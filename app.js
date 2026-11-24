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
})();
