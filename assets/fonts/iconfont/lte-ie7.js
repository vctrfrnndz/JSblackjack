window.onload = function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'icomoon\'">' + entity + '</span>' + html;
	}
	var icons = {
			'icon-twitter' : '&#x74;',
			'icon-dribbble' : '&#x64;',
			'icon-github' : '&#x67;',
			'icon-github-2' : '&#x47;',
			'icon-embed' : '&#x63;',
			'icon-pen' : '&#x45;',
			'icon-feed' : '&#x72;',
			'icon-stackoverflow' : '&#x73;',
			'icon-pinterest' : '&#x50;',
			'icon-checkmark' : '&#x43;',
			'icon-spinner' : '&#x4c;',
			'icon-vimeo' : '&#x76;',
			'icon-star' : '&#x52;',
			'icon-target' : '&#x6d;',
			'icon-eject' : '&#x65;',
			'icon-play' : '&#x70;',
			'icon-user' : '&#x75;',
			'icon-talk' : '&#x54;',
			'icon-tag' : '&#x62;',
			'icon-reload' : '&#x6c;',
			'icon-popup' : '&#x77;',
			'icon-nope' : '&#x78;',
			'icon-music' : '&#x7a;',
			'icon-mail' : '&#x4d;',
			'icon-heart' : '&#x41;',
			'icon-exit' : '&#x58;',
			'icon-document' : '&#x6e;',
			'icon-clock' : '&#xe01b;',
			'icon-book' : '&#x42;',
			'icon-arrowright' : '&#x3c;',
			'icon-arrowleft' : '&#x3e;'
		},
		els = document.getElementsByTagName('*'),
		i, attr, html, c, el;
	for (i = 0; i < els.length; i += 1) {
		el = els[i];
		attr = el.getAttribute('data-icon');
		if (attr) {
			addIcon(el, attr);
		}
		c = el.className;
		c = c.match(/icon-[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}
};