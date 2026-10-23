// ss13.live's front page (site/index.html): asks the multiplayer host's /status every 30 s (tools/server.mjs, no names) and shows it;
// no answer = the host is off, and the Multiplayer button says so.
const play = (() => { const p = new URLSearchParams(location.search).get("play"); return p && /^https?:\/\//.test(p) ? p.replace(/\/?$/, "/") : "https://play.ss13.live/"; })();
const $ = (id) => document.getElementById(id);
$("mp").href = play;
const show = (s) => {
	const up = !!s;
	$("mp").classList.toggle("off", !up);
	$("mp-sub").textContent = up ? `join the crew (${s.players} playing)` : "server offline: try Singleplayer";
	$("st-state").innerHTML = up ? '<span class="good">&#9679; Online</span>' : '<span class="bad">&#9679; Offline</span>';
	$("st-players").textContent = up ? s.players : "—";
	$("st-map").textContent = up ? s.map ?? "starts when someone joins" : "—";
	$("st-time").textContent = up && s.roundSeconds != null ? `${Math.round(s.roundSeconds / 60)} min` : "—";
};
const ask = () => fetch(play + "status", { cache: "no-store", signal: AbortSignal.timeout(8000) }).then((r) => (r.ok ? r.json() : null)).catch(() => null).then(show);
ask(); setInterval(ask, 30000);
