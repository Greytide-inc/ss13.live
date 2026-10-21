// Types declared in code/modules/research that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../build/dist/src/translate/runtime.js";

rt.type(3111, "/datum/design/disk", "/datum/design", {});
rt.type(3118, "/datum/design/netcard", "/datum/design", {});
rt.type(3122, "/datum/design/portabledrive", "/datum/design", {});
rt.type(3130, "/datum/design/battery", "/datum/design", {});
rt.type(4187, "/datum/tech/materials", "/datum/tech", {
	name: "Materials Research",
	desc: "Development of new and improved materials.",
	id: "materials",
});
rt.type(4188, "/datum/tech/engineering", "/datum/tech", {
	name: "Engineering Research",
	desc: "Development of new and improved engineering parts and tools.",
	id: "engineering",
});
rt.type(4189, "/datum/tech/plasmatech", "/datum/tech", {
	name: "Plasma Research",
	desc: "Research into the mysterious substance colloqually known as \"plasma\".",
	id: "plasmatech",
	rare: 3,
});
rt.type(4190, "/datum/tech/powerstorage", "/datum/tech", {
	name: "Power Manipulation Technology",
	desc: "The various technologies behind the storage and generation of electicity.",
	id: "powerstorage",
});
rt.type(4191, "/datum/tech/bluespace", "/datum/tech", {
	name: "\"Blue-space\" Research",
	desc: "Research into the sub-reality known as \"blue-space\".",
	id: "bluespace",
	rare: 2,
});
rt.type(4192, "/datum/tech/biotech", "/datum/tech", {
	name: "Biological Technology",
	desc: "Research into the deeper mysteries of life and organic substances.",
	id: "biotech",
});
rt.type(4193, "/datum/tech/combat", "/datum/tech", {
	name: "Combat Systems Research",
	desc: "The development of offensive and defensive systems.",
	id: "combat",
});
rt.type(4194, "/datum/tech/magnets", "/datum/tech", {
	name: "Electromagnetic Spectrum Research",
	desc: "Research into the electromagnetic spectrum. No clue how they actually work, though.",
	id: "magnets",
});
rt.type(4195, "/datum/tech/programming", "/datum/tech", {
	name: "Data Theory Research",
	desc: "The development of new computer and artificial intelligence and data storage systems.",
	id: "programming",
});
rt.type(4196, "/datum/tech/syndicate", "/datum/tech", {
	name: "Illegal Technologies Research",
	desc: "The study of technologies that violate Nanotrassen regulations.",
	id: "syndicate",
	rare: 4,
});
rt.type(4197, "/datum/tech/abductor", "/datum/tech", {
	name: "Alien Technologies Research",
	desc: "The study of technologies used by the advanced alien race known as Abductors.",
	id: "abductor",
	rare: 5,
	level: 0,
});
rt.type(4198, "/datum/tech/arcane", "/datum/tech", {
	name: "Arcane Research",
	desc: "When sufficiently analyzed, any magic becomes indistinguishable from technology.",
	id: "arcane",
	rare: 5,
	level: 0,
});
rt.type(5757, "/obj/item/weapon/stock_parts/subspace", "/obj/item/weapon/stock_parts", {});
rt.type(10427, "/obj/machinery/computer/rdconsole/core", "/obj/machinery/computer/rdconsole", {
	id: 1,
	name: "Core R&D Console",
	desc: "A console used to interface with R&D tools.",
});
rt.type(10428, "/obj/machinery/computer/rdconsole/experiment", "/obj/machinery/computer/rdconsole", {
	id: 3,
	name: "E.X.P.E.R.I-MENTOR R&D Console",
	desc: "A console used to interface with R&D tools.",
});
rt.type(10968, "/obj/machinery/r_n_d/server/robotics", "/obj/machinery/r_n_d/server", {
	id_with_upload_string: "1;2",
	id_with_download_string: "1;2",
	server_id: 2,
	name: "Robotics R&D Server",
});
rt.type(10969, "/obj/machinery/r_n_d/server/core", "/obj/machinery/r_n_d/server", {
	id_with_upload_string: "1",
	id_with_download_string: "1",
	server_id: 1,
	name: "Core R&D Server",
});
