// Shows the result of a URL autoplay (scripts/url_plan.gd) in the page.
// Loaded by the "Web" export preset: html/head_include is
// <script src="awb-result.js"></script>, and tools/package_web.sh copies this
// file next to index.html. Without it the page has no panel: the game is then
// not paused and the result is only printed, kept in window.awbAutoplayResult
// and sent as the awb-autoplay-result event.
(function () {
	// Tells the game that the page shows the result, so it may pause until Close.
	window.awbResultPanel = true;
	window.addEventListener('awb-autoplay-result', function (e) {
		var old = document.getElementById('awb-result');
		if (old) old.remove();
		var text = JSON.stringify(e.detail, null, 2);
		var box = document.createElement('div');
		box.id = 'awb-result';
		box.style.cssText = 'position:fixed;top:0;right:0;bottom:0;width:40vw;min-width:320px;z-index:10;'
			+ 'background:rgba(8,8,14,.97);color:#ddd;font:13px/1.35 monospace;display:flex;flex-direction:column';
		var bar = document.createElement('div');
		bar.style.cssText = 'display:flex;gap:8px;padding:8px;align-items:center';
		var title = document.createElement('b');
		title.textContent = 'End of the autoplay';
		title.style.flex = '1';
		bar.appendChild(title);
		function button(label, fn) {
			var b = document.createElement('button');
			b.textContent = label;
			b.onclick = fn;
			bar.appendChild(b);
		}
		button('Copy', function () { if (navigator.clipboard) navigator.clipboard.writeText(text); });
		// The game waits for this (window.awbOnClose is set by scripts/url_plan.gd).
		button('Close', function () { box.remove(); if (window.awbOnClose) window.awbOnClose(); });
		var pre = document.createElement('pre');
		pre.style.cssText = 'flex:1;margin:0;padding:8px;overflow:auto;white-space:pre';
		pre.textContent = text;
		box.appendChild(bar);
		box.appendChild(pre);
		document.body.appendChild(box);
	});
})();
