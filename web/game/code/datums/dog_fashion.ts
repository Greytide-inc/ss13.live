// From code/datums/dog_fashion.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(399, "/datum/dog_fashion", "/datum", {
	name: null,
	desc: null,
	emote_see: null,
	emote_hear: null,
	speak: null,
	speak_emote: null,
	icon_file: null,
	obj_icon_state: null,
	obj_alpha: null,
	obj_color: null,
});

// /datum/dog_fashion/proc/New  (code/datums/dog_fashion.dm:17)
rt.def("/datum/dog_fashion/proc/New", function New(f: Frame, M: Value) {
	rt.setSv(f, "name", rt.call(f, P("/proc/replacetext"), null, [rt.sv(f, "name"), "REAL_NAME", rt.fv(f, "real_name", live(M))]));
	rt.setSv(f, "desc", rt.call(f, P("/proc/replacetext"), null, [rt.sv(f, "desc"), "NAME", rt.sv(f, "name")]));
	return f.dot;
});

// /datum/dog_fashion/proc/get_overlay  (code/datums/dog_fashion.dm:35)
rt.def("/datum/dog_fashion/proc/get_overlay", function get_overlay(f: Frame, dir: Value) {
	let corgI: Value = null;
	f.vars = () => [corgI];
	if (!(truthy(rt.sv(f, "icon_file")) && truthy(rt.sv(f, "obj_icon_state")))) return f.dot;
	rt.setFv(f, "alpha", (corgI = rt.call(f, P("/proc/image"), null, [null, rt.sv(f, "icon_file"), null, rt.sv(f, "obj_icon_state"), "dir", live(dir)], rt.Args.Named)), rt.sv(f, "obj_alpha"));
	rt.setFv(f, "color", live(corgI), rt.sv(f, "obj_color"));
	return live(corgI);
});

rt.type(404, "/datum/dog_fashion/head/kitty", "/datum/dog_fashion/head", {
	name: "Runtime",
	emote_see: null,
	emote_hear: null,
	speak: null,
	desc: "It's a cute little kitty-cat! ... wait ... what the hell?",
});

// /datum/dog_fashion/head/kitty/proc/<init>  (code/datums/dog_fashion.dm:64)
rt.def("/datum/dog_fashion/head/kitty/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "emote_see", rt.list("coughs up a furball", "stretches"));
	$0 = $0;
	rt.setSv(f, "emote_hear", rt.list("purrs"));
	rt.setSv(f, "speak", rt.list("Purrr", "Meow!", "MAOOOOOW!", "HISSSSS", "MEEEEEEW"));
	return f.dot;
});

rt.type(409, "/datum/dog_fashion/head/pirate", "/datum/dog_fashion/head", {
	name: "Pirate-title Pirate-name",
	desc: "Yaarghh!! Thar' be a scurvy dog!",
	emote_see: null,
	emote_hear: null,
	speak: null,
});

// /datum/dog_fashion/head/pirate/proc/New  (code/datums/dog_fashion.dm:98)
rt.def("/datum/dog_fashion/head/pirate/proc/New", function New(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "name", fmt("＀ ＀", [rt.op(f, "PickUnweighted", [9], ["Ol'", "Scurvy", "Black", "Rum", "Gammy", "Bloody", "Gangrene", "Death", "Long-John"]), rt.op(f, "PickUnweighted", [10], ["kibble", "leg", "beard", "tooth", "poop-deck", "Threepwood", "Le Chuck", "corsair", "Silver", "Crusoe"])]));
	return f.dot;
}, false, { args: ["M"] });

rt.type(410, "/datum/dog_fashion/head/ushanka", "/datum/dog_fashion/head", {
	name: "Communist-title Realname",
	desc: "A follower of Karl Barx.",
	emote_see: null,
});

// /datum/dog_fashion/head/ushanka/proc/New  (code/datums/dog_fashion.dm:107)
rt.def("/datum/dog_fashion/head/ushanka/proc/New", function New(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "name", fmt("＀ ＀", [rt.op(f, "PickUnweighted", [3], ["Comrade", "Commissar", "Glorious Leader"]), rt.fv(f, "real_name", live(f.args[0]))]));
	return f.dot;
}, false, { args: ["M"] });

rt.type(419, "/datum/dog_fashion/head/sombrero", "/datum/dog_fashion/head", {
	name: "Segnor REAL_NAME",
	desc: "You must respect Elder Dogname",
});

// /datum/dog_fashion/head/sombrero/proc/New  (code/datums/dog_fashion.dm:157)
rt.def("/datum/dog_fashion/head/sombrero/proc/New", function New(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "desc", fmt("You must respect Elder ＀.", [rt.fv(f, "real_name", live(f.args[0]))]));
	return f.dot;
}, false, { args: ["M"] });
