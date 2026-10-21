// runs before the game boots (the module script awaits window.ss13Gate). Registers the service worker, shows the
// first-visit download on the loading screen, and never lets a download problem stop the game (it just plays online).
window.ss13Gate = (async () => {
	if (!("serviceWorker" in navigator) || !window.isSecureContext) return;
	// The offline copy is opt-in: ?offline=1 turns it on and is remembered; ?nocache=1 turns it off again.
	// Without it the page plays from the server and removes any copy left from before.
	const q = new URLSearchParams(location.search);
	try { if (q.has("offline")) localStorage.setItem("ss13-offline", "1"); if (q.has("nocache")) localStorage.removeItem("ss13-offline"); } catch {}
	let wantCopy = false; try { wantCopy = localStorage.getItem("ss13-offline") === "1"; } catch {}
	if (!wantCopy) { // no offline copy; remove one left from before
		try {
			const regs = await navigator.serviceWorker.getRegistrations();
			await Promise.all(regs.map((r) => r.unregister()));
			for (const k of await caches.keys()) if (k.startsWith("ss13-")) await caches.delete(k);
			if (regs.length && navigator.serviceWorker.controller) { location.reload(); await new Promise(() => {}); } // this load came from the old copy; reload from the server
		} catch (err) { console.warn("removing the offline copy failed:", err); }
		return;
	}
	const loading = document.getElementById("loading"), stage = document.getElementById("loading-stage");
	const mb = (n) => Math.round(n / 1e6);
	const chan = new BroadcastChannel("ss13-sw");
	let failed = null;
	chan.onmessage = (e) => {
		const m = e.data;
		if (m.type === "progress" && loading && stage) { loading.firstChild.textContent = "Downloading the game (first visit only)"; stage.textContent = mb(m.done) + " / " + mb(m.total) + " MB. Afterwards it plays with no internet."; }
		if (m.type === "failed") failed = m.error;
	};
	try {
		const hadController = !!navigator.serviceWorker.controller;
		const reg = await navigator.serviceWorker.register("./sw.js");
		await reg.update().catch(() => {}); // look for a new build now
		const settle = (sw) => new Promise((res) => { if (sw.state === "installed" || sw.state === "activated" || sw.state === "redundant") return res(sw.state); sw.addEventListener("statechange", () => { if (["installed", "activated", "redundant"].includes(sw.state)) res(sw.state); }); });
		if (reg.installing) await settle(reg.installing);
		if (reg.waiting) { // a finished new build: switch to it before the game starts (nothing is running yet)
			const changed = new Promise((res) => navigator.serviceWorker.addEventListener("controllerchange", res, { once: true }));
			reg.waiting.postMessage("skipWaiting");
			await changed;
			if (hadController && !sessionStorage.getItem("ss13-sw-reload")) { sessionStorage.setItem("ss13-sw-reload", "1"); if (stage) stage.textContent = "Updating to the new version..."; location.reload(); await new Promise(() => {}); }
		}
		sessionStorage.removeItem("ss13-sw-reload");
		if (failed || (reg.installing === null && !reg.active)) throw new Error(failed || "no active worker");
		if (stage) stage.textContent = "";
		loading && (loading.firstChild.textContent = "Starting the game...");
	} catch (err) {
		console.warn("offline cache not ready:", err);
		if (loading && loading.firstChild) { loading.firstChild.textContent = "Starting the game..."; }
		if (stage) stage.textContent = "The offline download didn't finish (" + (failed || err.message || err) + "). It will try again next visit; the game still runs while you're online.";
		setTimeout(() => { if (stage && stage.isConnected && /offline download/.test(stage.textContent)) stage.textContent = ""; }, 15000);
	}
})();
