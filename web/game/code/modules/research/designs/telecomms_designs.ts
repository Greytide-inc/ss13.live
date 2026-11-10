// Based on /tg/station's code/modules/research/designs/telecomms_designs.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(2985, "/datum/design/board/subspace_receiver", "/datum/design/board", {
	name: "Machine Design (Subspace Receiver)",
	desc: "Allows for the construction of Subspace Receiver equipment.",
	id: "s-receiver",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/machine/telecomms/receiver"),
});

// telecomms_designs.dm:9
rt.def("/datum/design/board/subspace_receiver/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["programming", 2, "engineering", 2, "bluespace", 1]);

	this.category = list("Subspace Telecomms");
	return f.dot;
});

rt.type(2986, "/datum/design/board/telecomms_bus", "/datum/design/board", {
	name: "Machine Design (Bus Mainframe)",
	desc: "Allows for the construction of Telecommunications Bus Mainframes.",
	id: "s-bus",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/machine/telecomms/bus"),
});

// telecomms_designs.dm:17
rt.def("/datum/design/board/telecomms_bus/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["programming", 2, "engineering", 2]);

	this.category = list("Subspace Telecomms");
	return f.dot;
});

rt.type(2987, "/datum/design/board/telecomms_hub", "/datum/design/board", {
	name: "Machine Design (Hub Mainframe)",
	desc: "Allows for the construction of Telecommunications Hub Mainframes.",
	id: "s-hub",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/machine/telecomms/hub"),
});

// telecomms_designs.dm:25
rt.def("/datum/design/board/telecomms_hub/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["programming", 2, "engineering", 2]);

	this.category = list("Subspace Telecomms");
	return f.dot;
});

rt.type(2988, "/datum/design/board/telecomms_relay", "/datum/design/board", {
	name: "Machine Design (Relay Mainframe)",
	desc: "Allows for the construction of Telecommunications Relay Mainframes.",
	id: "s-relay",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/machine/telecomms/relay"),
});

// telecomms_designs.dm:33
rt.def("/datum/design/board/telecomms_relay/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["programming", 2, "engineering", 2, "bluespace", 2]);

	this.category = list("Subspace Telecomms");
	return f.dot;
});

rt.type(2989, "/datum/design/board/telecomms_processor", "/datum/design/board", {
	name: "Machine Design (Processor Unit)",
	desc: "Allows for the construction of Telecommunications Processor equipment.",
	id: "s-processor",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/machine/telecomms/processor"),
});

// telecomms_designs.dm:41
rt.def("/datum/design/board/telecomms_processor/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["programming", 2, "engineering", 2]);

	this.category = list("Subspace Telecomms");
	return f.dot;
});

rt.type(2990, "/datum/design/board/telecomms_server", "/datum/design/board", {
	name: "Machine Design (Server Mainframe)",
	desc: "Allows for the construction of Telecommunications Servers.",
	id: "s-server",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/machine/telecomms/server"),
});

// telecomms_designs.dm:49
rt.def("/datum/design/board/telecomms_server/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["programming", 2, "engineering", 2]);

	this.category = list("Subspace Telecomms");
	return f.dot;
});

rt.type(2991, "/datum/design/board/subspace_broadcaster", "/datum/design/board", {
	name: "Machine Design (Subspace Broadcaster)",
	desc: "Allows for the construction of Subspace Broadcasting equipment.",
	id: "s-broadcaster",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/machine/telecomms/broadcaster"),
});

// telecomms_designs.dm:57
rt.def("/datum/design/board/subspace_broadcaster/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["programming", 2, "engineering", 2]);

	this.category = list("Subspace Telecomms");
	return f.dot;
});
