/* Load this script using conditional IE comments if you need to support IE 7 and IE 6. */

window.onload = function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'deck\'">' + entity + '</span>' + html;
	}
	var icons = {
			'card-queen' : '&#x71;',
			'card-jack' : '&#x6a;',
			'card-king' : '&#x6b;',
			'card-heart' : '&#x68;',
			'card-diamond' : '&#x64;',
			'card-club' : '&#x63;',
			'card-spade' : '&#x73;'
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
		c = c.match(/card-[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}
};