// From code/game/objects/items/devices/radio/encryptionkey.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9334, "/obj/item/device/encryptionkey", "/obj/item/device", {
	translate_binary: 0,
	syndie: 0,
	independent: 0,
	channels: null,
	name: "standard encryption key",
	desc: "An encryption key for a radio headset.  Has no special codes in it.  WHY DOES IT EXIST?  ASK NANOTRASEN.",
	icon: rt.rsc("icons/obj/radio.dmi"),
	icon_state: "cypherkey",
	w_class: 1,
	origin_tech: "engineering=2;bluespace=1",
});

// /obj/item/device/encryptionkey/proc/<init>  (code/game/objects/items/devices/radio/encryptionkey.dm:11)
rt.def("/obj/item/device/encryptionkey/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "channels", rt.list());
	return f.dot;
});

rt.type(9335, "/obj/item/device/encryptionkey/syndicate", "/obj/item/device/encryptionkey", {
	channels: null,
	syndie: 1,
	name: "syndicate encryption key",
	desc: "An encryption key for a radio headset. To access the syndicate channel, use :t.",
	icon_state: "syn_cypherkey",
	origin_tech: "syndicate=1;engineering=3;bluespace=2",
});

// /obj/item/device/encryptionkey/syndicate/proc/<init>  (code/game/objects/items/devices/radio/encryptionkey.dm:17)
rt.def("/obj/item/device/encryptionkey/syndicate/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "channels", rt.alist(f, ["Syndicate", 1]));
	return f.dot;
});

rt.type(9337, "/obj/item/device/encryptionkey/headset_sec", "/obj/item/device/encryptionkey", {
	channels: null,
	name: "security radio encryption key",
	desc: "An encryption key for a radio headset.  To access the security channel, use :s.",
	icon_state: "sec_cypherkey",
});

// /obj/item/device/encryptionkey/headset_sec/proc/<init>  (code/game/objects/items/devices/radio/encryptionkey.dm:32)
rt.def("/obj/item/device/encryptionkey/headset_sec/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "channels", rt.alist(f, ["Security", 1]));
	return f.dot;
});

rt.type(9338, "/obj/item/device/encryptionkey/headset_eng", "/obj/item/device/encryptionkey", {
	channels: null,
	name: "engineering radio encryption key",
	desc: "An encryption key for a radio headset.  To access the engineering channel, use :e.",
	icon_state: "eng_cypherkey",
});

// /obj/item/device/encryptionkey/headset_eng/proc/<init>  (code/game/objects/items/devices/radio/encryptionkey.dm:38)
rt.def("/obj/item/device/encryptionkey/headset_eng/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "channels", rt.alist(f, ["Engineering", 1]));
	return f.dot;
});

rt.type(9339, "/obj/item/device/encryptionkey/headset_rob", "/obj/item/device/encryptionkey", {
	channels: null,
	name: "robotics radio encryption key",
	desc: "An encryption key for a radio headset.  To access the engineering channel, use :e. For research, use :n.",
	icon_state: "rob_cypherkey",
});

// /obj/item/device/encryptionkey/headset_rob/proc/<init>  (code/game/objects/items/devices/radio/encryptionkey.dm:44)
rt.def("/obj/item/device/encryptionkey/headset_rob/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "channels", rt.alist(f, ["Science", 1, "Engineering", 1]));
	return f.dot;
});

rt.type(9340, "/obj/item/device/encryptionkey/headset_med", "/obj/item/device/encryptionkey", {
	channels: null,
	name: "medical radio encryption key",
	desc: "An encryption key for a radio headset.  To access the medical channel, use :m.",
	icon_state: "med_cypherkey",
});

// /obj/item/device/encryptionkey/headset_med/proc/<init>  (code/game/objects/items/devices/radio/encryptionkey.dm:50)
rt.def("/obj/item/device/encryptionkey/headset_med/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "channels", rt.alist(f, ["Medical", 1]));
	return f.dot;
});

rt.type(9341, "/obj/item/device/encryptionkey/headset_sci", "/obj/item/device/encryptionkey", {
	channels: null,
	name: "science radio encryption key",
	desc: "An encryption key for a radio headset.  To access the science channel, use :n.",
	icon_state: "sci_cypherkey",
});

// /obj/item/device/encryptionkey/headset_sci/proc/<init>  (code/game/objects/items/devices/radio/encryptionkey.dm:56)
rt.def("/obj/item/device/encryptionkey/headset_sci/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "channels", rt.alist(f, ["Science", 1]));
	return f.dot;
});

rt.type(9342, "/obj/item/device/encryptionkey/headset_medsci", "/obj/item/device/encryptionkey", {
	channels: null,
	name: "medical research radio encryption key",
	desc: "An encryption key for a radio headset.  To access the medical channel, use :m. For science, use :n.",
	icon_state: "medsci_cypherkey",
});

// /obj/item/device/encryptionkey/headset_medsci/proc/<init>  (code/game/objects/items/devices/radio/encryptionkey.dm:62)
rt.def("/obj/item/device/encryptionkey/headset_medsci/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "channels", rt.alist(f, ["Science", 1, "Medical", 1]));
	return f.dot;
});

rt.type(9343, "/obj/item/device/encryptionkey/headset_com", "/obj/item/device/encryptionkey", {
	channels: null,
	name: "command radio encryption key",
	desc: "An encryption key for a radio headset.  To access the command channel, use :c.",
	icon_state: "com_cypherkey",
});

// /obj/item/device/encryptionkey/headset_com/proc/<init>  (code/game/objects/items/devices/radio/encryptionkey.dm:68)
rt.def("/obj/item/device/encryptionkey/headset_com/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "channels", rt.alist(f, ["Command", 1]));
	return f.dot;
});

rt.type(9345, "/obj/item/device/encryptionkey/heads/captain", "/obj/item/device/encryptionkey/heads", {
	channels: null,
	name: "０the captain's encryption key",
	desc: "An encryption key for a radio headset.  Channels are as follows: :c - command, :s - security, :e - engineering, :u - supply, :v - service, :m - medical, :n - science.",
	icon_state: "cap_cypherkey",
});

// /obj/item/device/encryptionkey/heads/captain/proc/<init>  (code/game/objects/items/devices/radio/encryptionkey.dm:74)
rt.def("/obj/item/device/encryptionkey/heads/captain/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "channels", rt.alist(f, ["Command", 1, "Security", 1, "Engineering", 0, "Science", 0, "Medical", 0, "Supply", 0, "Service", 0]));
	return f.dot;
});

rt.type(9346, "/obj/item/device/encryptionkey/heads/rd", "/obj/item/device/encryptionkey/heads", {
	channels: null,
	name: "０the research director's encryption key",
	desc: "An encryption key for a radio headset.  To access the science channel, use :n. For command, use :c.",
	icon_state: "rd_cypherkey",
});

// /obj/item/device/encryptionkey/heads/rd/proc/<init>  (code/game/objects/items/devices/radio/encryptionkey.dm:80)
rt.def("/obj/item/device/encryptionkey/heads/rd/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "channels", rt.alist(f, ["Science", 1, "Command", 1]));
	return f.dot;
});

rt.type(9347, "/obj/item/device/encryptionkey/heads/hos", "/obj/item/device/encryptionkey/heads", {
	channels: null,
	name: "０the head of security's encryption key",
	desc: "An encryption key for a radio headset.  To access the security channel, use :s. For command, use :c.",
	icon_state: "hos_cypherkey",
});

// /obj/item/device/encryptionkey/heads/hos/proc/<init>  (code/game/objects/items/devices/radio/encryptionkey.dm:86)
rt.def("/obj/item/device/encryptionkey/heads/hos/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "channels", rt.alist(f, ["Security", 1, "Command", 1]));
	return f.dot;
});

rt.type(9348, "/obj/item/device/encryptionkey/heads/ce", "/obj/item/device/encryptionkey/heads", {
	channels: null,
	name: "０the chief engineer's encryption key",
	desc: "An encryption key for a radio headset.  To access the engineering channel, use :e. For command, use :c.",
	icon_state: "ce_cypherkey",
});

// /obj/item/device/encryptionkey/heads/ce/proc/<init>  (code/game/objects/items/devices/radio/encryptionkey.dm:92)
rt.def("/obj/item/device/encryptionkey/heads/ce/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "channels", rt.alist(f, ["Engineering", 1, "Command", 1]));
	return f.dot;
});

rt.type(9349, "/obj/item/device/encryptionkey/heads/cmo", "/obj/item/device/encryptionkey/heads", {
	channels: null,
	name: "０the chief medical officer's encryption key",
	desc: "An encryption key for a radio headset.  To access the medical channel, use :m. For command, use :c.",
	icon_state: "cmo_cypherkey",
});

// /obj/item/device/encryptionkey/heads/cmo/proc/<init>  (code/game/objects/items/devices/radio/encryptionkey.dm:98)
rt.def("/obj/item/device/encryptionkey/heads/cmo/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "channels", rt.alist(f, ["Medical", 1, "Command", 1]));
	return f.dot;
});

rt.type(9350, "/obj/item/device/encryptionkey/heads/hop", "/obj/item/device/encryptionkey/heads", {
	channels: null,
	name: "０the head of personnel's encryption key",
	desc: "An encryption key for a radio headset.  Channels are as follows: :u - supply, :v - service, :c - command.",
	icon_state: "hop_cypherkey",
});

// /obj/item/device/encryptionkey/heads/hop/proc/<init>  (code/game/objects/items/devices/radio/encryptionkey.dm:104)
rt.def("/obj/item/device/encryptionkey/heads/hop/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "channels", rt.alist(f, ["Supply", 1, "Service", 1, "Command", 1]));
	return f.dot;
});

rt.type(9351, "/obj/item/device/encryptionkey/headset_cargo", "/obj/item/device/encryptionkey", {
	channels: null,
	name: "supply radio encryption key",
	desc: "An encryption key for a radio headset.  To access the supply channel, use :u.",
	icon_state: "cargo_cypherkey",
});

// /obj/item/device/encryptionkey/headset_cargo/proc/<init>  (code/game/objects/items/devices/radio/encryptionkey.dm:110)
rt.def("/obj/item/device/encryptionkey/headset_cargo/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "channels", rt.alist(f, ["Supply", 1]));
	return f.dot;
});

rt.type(9352, "/obj/item/device/encryptionkey/headset_mining", "/obj/item/device/encryptionkey", {
	channels: null,
	name: "mining radio encryption key",
	desc: "An encryption key for a radio headset.  To access the supply channel, use :u. For science, use :n.",
	icon_state: "cargo_cypherkey",
});

// /obj/item/device/encryptionkey/headset_mining/proc/<init>  (code/game/objects/items/devices/radio/encryptionkey.dm:116)
rt.def("/obj/item/device/encryptionkey/headset_mining/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "channels", rt.alist(f, ["Supply", 1, "Science", 1]));
	return f.dot;
});

rt.type(9353, "/obj/item/device/encryptionkey/headset_service", "/obj/item/device/encryptionkey", {
	channels: null,
	name: "service radio encryption key",
	desc: "An encryption key for a radio headset.  To access the service channel, use :v.",
	icon_state: "srv_cypherkey",
});

// /obj/item/device/encryptionkey/headset_service/proc/<init>  (code/game/objects/items/devices/radio/encryptionkey.dm:122)
rt.def("/obj/item/device/encryptionkey/headset_service/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "channels", rt.alist(f, ["Service", 1]));
	return f.dot;
});

rt.type(9354, "/obj/item/device/encryptionkey/headset_cent", "/obj/item/device/encryptionkey", {
	independent: 1,
	channels: null,
	name: "centcom radio encryption key",
	desc: "An encryption key for a radio headset.  To access the centcom channel, use :y.",
	icon_state: "cent_cypherkey",
});

// /obj/item/device/encryptionkey/headset_cent/proc/<init>  (code/game/objects/items/devices/radio/encryptionkey.dm:129)
rt.def("/obj/item/device/encryptionkey/headset_cent/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "channels", rt.alist(f, ["Centcom", 1]));
	return f.dot;
});

rt.type(9355, "/obj/item/device/encryptionkey/ai", "/obj/item/device/encryptionkey", {
	channels: null,
});

// /obj/item/device/encryptionkey/ai/proc/<init>  (code/game/objects/items/devices/radio/encryptionkey.dm:132)
rt.def("/obj/item/device/encryptionkey/ai/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "channels", rt.alist(f, ["Command", 1, "Security", 1, "Engineering", 1, "Science", 1, "Medical", 1, "Supply", 1, "Service", 1, "AI Private", 1]));
	return f.dot;
});

rt.type(9356, "/obj/item/device/encryptionkey/secbot", "/obj/item/device/encryptionkey", {
	channels: null,
});

// /obj/item/device/encryptionkey/secbot/proc/<init>  (code/game/objects/items/devices/radio/encryptionkey.dm:135)
rt.def("/obj/item/device/encryptionkey/secbot/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "channels", rt.alist(f, ["AI Private", 1, "Security", 1]));
	return f.dot;
});
