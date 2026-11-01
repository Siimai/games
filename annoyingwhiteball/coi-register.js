// Registers coi-sw.js and reloads once so the page is cross-origin isolated.
if (!window.crossOriginIsolated && "serviceWorker" in navigator) {
	navigator.serviceWorker.register("coi-sw.js").then((reg) => {
		if (reg.active && !navigator.serviceWorker.controller) location.reload();
		else reg.addEventListener("updatefound", () => location.reload());
	});
}
