// messages - the shapes the boot worker's files share: the page's start, hot-reload and pointer messages (what each one means:
// the top of boot-worker.ts), and what the saved-world download gives back. Types only, so any worker file can import them
// without importing boot-worker.ts itself.

export interface StartMsg {
	type: "start";
	snapshot?: boolean;
	ticks?: number;
	seconds?: number;
	afterStart?: number | null;
	join?: string;
	gender?: string;
	check?: boolean;
	dirty?: boolean;
	lie?: boolean;
	goto?: string;
	seed?: number;
	lobby?: boolean;
	lobbySeconds?: number;
	map?: string;
	snap?: string;
	autojoin?: string;
	roundstart?: boolean;
	endround?: number;
	ssoff?: string;
	setup?: string;
	rounddelay?: number;
	round?: number;
	ride?: boolean;
	shoot?: boolean;
	shake?: boolean;
	crew?: boolean;
	tgui?: string;
	tguiWatch?: string;
	tguiSet?: string;
	busyWait?: boolean;
	hot?: boolean;
	translated?: boolean;
	fastAir?: boolean;
	scenario?: { name: string; text?: string; error?: string };
	stress?: boolean;
	playerKey?: string;
	playerAddress?: string;
	second?: string;
	secondJob?: string;
	clickNow?: boolean;
	log?: string;
}

export interface HotMsg { type: "hot"; id: string; fresh?: boolean; tgui?: string; tguiSet?: string; tguiWatch?: string; files: { file: string; js: string; firstId: number; paths: string[] }[] }

export type ClickMsg = { type: "click"; player?: string; id: number | null; x: number | null; y: number | null; dbl: boolean; control: string; params: string };
export type MenuMsg = { type: "menu"; player?: string; one?: number; x: number; y: number; sx: number; sy: number; click: ClickMsg };
export type MenuPickMsg = { type: "menupick"; player?: string; id: number; a: number; v: number };
export type MouseMsg = {
	type: "mouse";
	player?: string;
	proc: "MouseDown" | "MouseUp" | "MouseDrop" | "MouseDrag" | "MouseMove" | "MouseEntered" | "MouseExited" | "MouseWheel";
	dx?: number;
	dy?: number;
	id: number | null;
	x: number | null;
	y: number | null;
	over?: number | null;
	ox?: number | null;
	oy?: number | null;
	control: string;
	params: string;
};

/** What boot-worker.ts's fetchSnapshot gives back: the saved world's bytes, or why there are none (then a normal boot). */
export type SnapFetch = { bytes: Uint8Array; gz: number; how: string; ms: number } | { why: string; noZstd?: boolean };
