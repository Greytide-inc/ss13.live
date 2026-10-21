// the right-click popup menu (DOM #ctxmenu). createCtxMenu(post) -> { ctx, show(m), close() }; a choice calls post({type:"menupick", id, a, v}).
export function createCtxMenu(post) {
	const ctx = document.createElement("div");
	ctx.id = "ctxmenu"; ctx.hidden = true; document.body.append(ctx);
	const closeMenu = () => { ctx.hidden = true; ctx.replaceChildren(); };
	function showMenu(m) {
		ctx.replaceChildren(...m.items.map((it, a) => {
			const row = document.createElement("div");
			row.className = "row sub"; row.textContent = it.name;
			const sub = document.createElement("div");
			sub.className = "sm";
			for (const [v, name] of it.verbs.entries()) {
				const r = document.createElement("div");
				r.className = "row"; r.textContent = name;
				r.onclick = (e) => { e.stopPropagation(); closeMenu(); post({ type: "menupick", id: m.id, a, v }); };
				sub.append(r);
			}
			row.append(sub);
			return row;
		}));
		ctx.hidden = false;
		placeMenu(m.sx, m.sy);
	}
	// keep the menu and every submenu on the page. The main menu moves up/left to fit, and scrolls if taller than the page;
	// a submenu opens on the side with room (right, else left) and is shifted up to fit (scrolling when taller than the page).
	function placeMenu(sx, sy) {
		const W = innerWidth, H = innerHeight;
		ctx.style.maxHeight = H - 4 + "px"; ctx.style.overflowY = "auto"; ctx.style.left = "0px"; ctx.style.top = "0px";
		const r = ctx.getBoundingClientRect();
		ctx.style.left = Math.max(0, Math.min(sx, W - r.width - 2)) + "px";
		ctx.style.top = Math.max(0, Math.min(sy, H - r.height - 2)) + "px";
	}
	function placeSub(row) { // fixed-position submenus: the scrolling main menu can't clip them
		const sm = row.querySelector(":scope>.sm"); if (!sm) return;
		const W = innerWidth, H = innerHeight, pr = row.getBoundingClientRect();
		sm.style.maxHeight = H - 4 + "px"; sm.style.overflowY = "auto";
		const r = sm.getBoundingClientRect();
		sm.style.left = (pr.right + r.width > W && pr.left - r.width >= 0 ? pr.left - r.width : pr.right - 1) + "px";
		sm.style.top = Math.max(2, Math.min(pr.top - 1, H - 2 - r.height)) + "px";
	}
	ctx.addEventListener("mouseover", (e) => { const row = e.target.closest && e.target.closest(".row.sub"); if (row && ctx.contains(row)) placeSub(row); });
	return { ctx, show: showMenu, close: closeMenu };
}
