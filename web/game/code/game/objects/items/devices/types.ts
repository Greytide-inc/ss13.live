// Types declared in code/game/objects/items/devices that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";

rt.type(9124, "/obj/item/device/flashlight/flare/torch", "/obj/item/device/flashlight/flare", {
	on_damage: 10,
	name: "torch",
	desc: "A torch fashioned from some leaves and a log.",
	w_class: 4,
	brightness_on: 4,
	icon_state: "torch",
	item_state: "torch",
	slot_flags: null,
});
rt.type(9126, "/obj/item/device/flashlight/seclite", "/obj/item/device/flashlight", {
	brightness_on: 5,
	name: "seclite",
	desc: "A robust flashlight used by security.",
	icon_state: "seclite",
	item_state: "seclite",
	force: 9,
	hitsound: rt.rsc("sound/weapons/genhit1.ogg"),
});
rt.type(9128, "/obj/item/device/flashlight/lamp/green", "/obj/item/device/flashlight/lamp", {
	desc: "A classic green-shaded desk lamp.",
	icon_state: "lampgreen",
	item_state: "lampgreen",
});
rt.type(9129, "/obj/item/device/flashlight/lamp/bananalamp", "/obj/item/device/flashlight/lamp", {
	name: "banana lamp",
	desc: "Only a clown would think to make a ghetto banana-shaped lamp. Even has a goofy pullstring.",
	icon_state: "bananalamp",
	item_state: "bananalamp",
});
rt.type(9130, "/obj/item/device/flashlight/lantern", "/obj/item/device/flashlight", {
	brightness_on: 6,
	name: "lantern",
	icon_state: "lantern",
	item_state: "lantern",
	desc: "A mining lantern.",
});
rt.type(9134, "/obj/item/device/flashlight/glowstick/red", "/obj/item/device/flashlight/glowstick", {
	name: "red glowstick",
	color: "#FA8282",
});
rt.type(9135, "/obj/item/device/flashlight/glowstick/blue", "/obj/item/device/flashlight/glowstick", {
	name: "blue glowstick",
	color: "#6496FA",
});
rt.type(9136, "/obj/item/device/flashlight/glowstick/cyan", "/obj/item/device/flashlight/glowstick", {
	name: "cyan glowstick",
	color: "#7DE1E1",
});
rt.type(9137, "/obj/item/device/flashlight/glowstick/orange", "/obj/item/device/flashlight/glowstick", {
	name: "orange glowstick",
	color: "#FA9632",
});
rt.type(9138, "/obj/item/device/flashlight/glowstick/yellow", "/obj/item/device/flashlight/glowstick", {
	name: "yellow glowstick",
	color: "#E1E17D",
});
rt.type(9139, "/obj/item/device/flashlight/glowstick/pink", "/obj/item/device/flashlight/glowstick", {
	name: "pink glowstick",
	color: "#E17DE1",
});
rt.type(9141, "/obj/item/device/flashlight/spotlight", "/obj/item/device/flashlight", {
	range: null,
	light_color: null,
	brightness_on: 0,
	light_range: 0,
	light_power: 10,
	on: 1,
	anchored: 1,
	name: "disco light",
	desc: "Groovy...",
	icon_state: null,
	alpha: 0,
	layer: 0,
	resistance_flags: 115,
});
rt.type(9142, "/obj/item/device/flashlight/flashdark", "/obj/item/device/flashlight", {
	brightness_on: 2.5,
	flashlight_power: -3,
	name: "flashdark",
	desc: "A strange device manufactured with mysterious elements that somehow emits darkness. Or maybe it just sucks in light? Nobody knows for sure.",
	icon_state: "flashdark",
	item_state: "flashdark",
});
rt.type(9233, "/obj/item/device/gps/science", "/obj/item/device/gps", {
	gpstag: "SCI0",
	icon_state: "gps-s",
});
rt.type(9234, "/obj/item/device/gps/engineering", "/obj/item/device/gps", {
	gpstag: "ENG0",
	icon_state: "gps-e",
});
rt.type(9235, "/obj/item/device/gps/mining", "/obj/item/device/gps", {
	gpstag: "MINE0",
	icon_state: "gps-m",
	desc: "A positioning system helpful for rescuing trapped or injured miners, keeping one on you at all times while mining might just save your life.",
});
rt.type(9236, "/obj/item/device/gps/mining/internal", "/obj/item/device/gps/mining", {
	gpstag: "MINER",
	icon_state: "gps-m",
	desc: "A positioning system helpful for rescuing trapped or injured miners, keeping one on you at all times while mining might just save your life.",
});
rt.type(9237, "/obj/item/device/gps/cyborg", "/obj/item/device/gps", {
	gpstag: "BORG0",
	flags: 2,
	icon_state: "gps-b",
	desc: "A mining cyborg internal positioning system. Used as a recovery beacon for damaged cyborg assets, or a collaboration tool for mining teams.",
});
rt.type(9238, "/obj/item/device/gps/internal", "/obj/item/device/gps", {
	flags: 128,
	gpstag: "Eerie Signal",
	icon_state: null,
	desc: "Report to a coder immediately.",
	invisibility: 100,
});
rt.type(9239, "/obj/item/device/gps/internal/base", "/obj/item/device/gps/internal", {
	gpstag: "NT_AUX",
	desc: "A homing signal from Nanotrasen's mining base.",
});
rt.type(9240, "/obj/item/device/gps/internal/miner", "/obj/item/device/gps/internal", {
	gpstag: "Resonant Signal",
	icon_state: null,
	desc: "The sweet blood, oh, it sings to me.",
	invisibility: 100,
});
rt.type(9241, "/obj/item/device/gps/internal/bubblegum", "/obj/item/device/gps/internal", {
	gpstag: "Bloody Signal",
	icon_state: null,
	desc: "You're not quite sure how a signal can be bloody.",
	invisibility: 100,
});
rt.type(9242, "/obj/item/device/gps/internal/colossus", "/obj/item/device/gps/internal", {
	gpstag: "Angelic Signal",
	icon_state: null,
	desc: "Get in the fucking robot.",
	invisibility: 100,
});
rt.type(9243, "/obj/item/device/gps/internal/dragon", "/obj/item/device/gps/internal", {
	gpstag: "Fiery Signal",
	icon_state: null,
	desc: "Here there be dragons.",
	invisibility: 100,
});
rt.type(9244, "/obj/item/device/gps/internal/hierophant", "/obj/item/device/gps/internal", {
	gpstag: "Zealous Signal",
	icon_state: null,
	desc: "Heed its words.",
	invisibility: 100,
});
rt.type(9245, "/obj/item/device/gps/internal/legion", "/obj/item/device/gps/internal", {
	gpstag: "Echoing Signal",
	icon_state: null,
	desc: "The message repeats.",
	invisibility: 100,
});
rt.type(9246, "/obj/item/device/gps/internal/swarmer_beacon", "/obj/item/device/gps/internal", {
	gpstag: "Hungry Signal",
	icon_state: null,
	desc: "Transmited over the signal is a strange message repeated in every language you know of, and some you don't too...",
	invisibility: 100,
});
rt.type(9250, "/obj/item/device/instrument/violin", "/obj/item/device/instrument", {
	instrumentId: "violin",
	name: "space violin",
	desc: "A wooden musical instrument with four strings and a bow. \"The devil went down to space, he was looking for an assistant to grief.\"",
	icon: rt.rsc("icons/obj/musician.dmi"),
	icon_state: "violin",
	item_state: "violin",
	force: 10,
	hitsound: "swing_hit",
});
rt.type(9251, "/obj/item/device/instrument/violin/golden", "/obj/item/device/instrument/violin", {
	name: "golden violin",
	desc: "A golden musical instrument with four strings and a bow. \"The devil went down to space, he was looking for an assistant to grief.\"",
	icon_state: "golden_violin",
	item_state: "golden_violin",
	resistance_flags: 35,
});
rt.type(9252, "/obj/item/device/instrument/guitar", "/obj/item/device/instrument", {
	instrumentId: "guitar",
	name: "guitar",
	desc: "It's made of wood and has bronze strings.",
	icon: rt.rsc("icons/obj/musician.dmi"),
	icon_state: "guitar",
	item_state: "guitar",
	force: 10,
	attack_verb: null,
	hitsound: rt.rsc("sound/weapons/stringsmash.ogg"),
});
rt.type(9253, "/obj/item/device/instrument/eguitar", "/obj/item/device/instrument", {
	instrumentId: "eguitar",
	name: "electric guitar",
	desc: "Makes all your shredding needs possible.",
	icon: rt.rsc("icons/obj/musician.dmi"),
	icon_state: "eguitar",
	item_state: "eguitar",
	force: 12,
	attack_verb: null,
	hitsound: rt.rsc("sound/weapons/stringsmash.ogg"),
});
rt.type(9255, "/obj/item/device/laser_pointer/red", "/obj/item/device/laser_pointer", {
	pointer_icon_state: "red_laser",
});
rt.type(9256, "/obj/item/device/laser_pointer/green", "/obj/item/device/laser_pointer", {
	pointer_icon_state: "green_laser",
});
rt.type(9257, "/obj/item/device/laser_pointer/blue", "/obj/item/device/laser_pointer", {
	pointer_icon_state: "blue_laser",
});
rt.type(9258, "/obj/item/device/laser_pointer/purple", "/obj/item/device/laser_pointer", {
	pointer_icon_state: "purple_laser",
});
rt.type(9261, "/obj/item/device/lightreplacer/cyborg", "/obj/item/device/lightreplacer", {});
rt.type(9264, "/obj/item/device/megaphone/sec", "/obj/item/device/megaphone", {
	name: "security megaphone",
	icon_state: "megaphone-sec",
});
rt.type(9265, "/obj/item/device/megaphone/command", "/obj/item/device/megaphone", {
	name: "command megaphone",
	icon_state: "megaphone-command",
});
rt.type(9266, "/obj/item/device/megaphone/cargo", "/obj/item/device/megaphone", {
	name: "supply megaphone",
	icon_state: "megaphone-cargo",
});
rt.type(9271, "/obj/item/device/multitool/cyborg", "/obj/item/device/multitool", {
	name: "multitool",
	desc: "Optimised and stripped-down version of a regular multitool.",
	toolspeed: 0.5,
});
rt.type(9272, "/obj/item/device/multitool/abductor", "/obj/item/device/multitool", {
	name: "alien multitool",
	desc: "An omni-technological interface.",
	icon: rt.rsc("icons/obj/abductor.dmi"),
	icon_state: "multitool",
	toolspeed: 0.1,
	origin_tech: "magnets=5;engineering=5;abductor=3",
});
rt.type(9286, "/obj/item/device/mass_spectrometer/adv", "/obj/item/device/mass_spectrometer", {
	details: 1,
	name: "advanced mass-spectrometer",
	icon_state: "adv_spectrometer",
	origin_tech: "magnets=4;biotech=3;plasmatech=3",
});
rt.type(9290, "/obj/item/device/taperecorder/empty", "/obj/item/device/taperecorder", {
	starting_tape_type: null,
});
