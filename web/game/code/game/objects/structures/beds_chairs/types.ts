// Types declared in code/game/objects/structures/beds_chairs that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";

rt.type(9878, "/obj/item/chair/stool", "/obj/item/chair", {
	item_state: "stool",
	break_chance: 0,
	name: "stool",
	icon_state: "stool_toppled",
	origin_type: rt.typePath("/obj/structure/chair/stool"),
});
rt.type(9879, "/obj/item/chair/stool/bar", "/obj/item/chair/stool", {
	item_state: "stool_bar",
	name: "bar stool",
	icon_state: "bar_toppled",
	origin_type: rt.typePath("/obj/structure/chair/stool/bar"),
});
rt.type(9881, "/obj/item/chair/wood/wings", "/obj/item/chair/wood", {
	icon_state: "wooden_chair_wings_toppled",
	origin_type: rt.typePath("/obj/structure/chair/wood/wings"),
});
rt.type(12245, "/obj/structure/bed/abductor", "/obj/structure/bed", {
	name: "resting contraption",
	desc: "This looks similar to contraptions from earth. Could aliens be stealing our technology?",
	icon: rt.rsc("icons/obj/abductor.dmi"),
	buildstacktype: rt.typePath("/obj/item/stack/sheet/mineral/abductor"),
	icon_state: "bed",
});
rt.type(12249, "/obj/structure/bed/alien", "/obj/structure/bed", {
	name: "resting contraption",
	desc: "This looks similar to contraptions from earth. Could aliens be stealing our technology?",
	icon_state: "abed",
});
rt.type(12250, "/obj/structure/bed/pod", "/obj/structure/bed", {
	icon: rt.rsc("icons/obj/lavaland/survival_pod.dmi"),
	icon_state: "bed",
});
rt.type(12733, "/obj/structure/chair/wood", "/obj/structure/chair", {
	buildstacktype: rt.typePath("/obj/item/stack/sheet/mineral/wood"),
	buildstackamount: 3,
	item_chair: rt.typePath("/obj/item/chair/wood"),
	icon_state: "wooden_chair",
	name: "wooden chair",
	desc: "Old is never too old to not be in fashion.",
	resistance_flags: 4,
	obj_integrity: 70,
	max_integrity: 70,
});
rt.type(12734, "/obj/structure/chair/wood/normal", "/obj/structure/chair/wood", {});
rt.type(12735, "/obj/structure/chair/wood/wings", "/obj/structure/chair/wood", {
	item_chair: rt.typePath("/obj/item/chair/wood/wings"),
	icon_state: "wooden_chair_wings",
});
rt.type(12737, "/obj/structure/chair/comfy/brown", "/obj/structure/chair/comfy", {
	color: "#ff7100",
});
rt.type(12738, "/obj/structure/chair/comfy/beige", "/obj/structure/chair/comfy", {
	color: "#fffdc3",
});
rt.type(12739, "/obj/structure/chair/comfy/teal", "/obj/structure/chair/comfy", {
	color: "#00ffff",
});
rt.type(12740, "/obj/structure/chair/comfy/black", "/obj/structure/chair/comfy", {
	color: "#a7a499",
});
rt.type(12741, "/obj/structure/chair/comfy/lime", "/obj/structure/chair/comfy", {
	color: "#fffb00",
});
rt.type(12742, "/obj/structure/chair/office", "/obj/structure/chair", {
	anchored: 0,
	buildstackamount: 5,
	item_chair: null,
});
rt.type(12743, "/obj/structure/chair/office/light", "/obj/structure/chair/office", {
	icon_state: "officechair_white",
});
rt.type(12744, "/obj/structure/chair/office/dark", "/obj/structure/chair/office", {
	icon_state: "officechair_dark",
});
rt.type(12745, "/obj/structure/chair/stool", "/obj/structure/chair", {
	can_buckle: 0,
	buildstackamount: 1,
	item_chair: rt.typePath("/obj/item/chair/stool"),
	name: "stool",
	desc: "Apply butt.",
	icon_state: "stool",
});
rt.type(12746, "/obj/structure/chair/stool/bar", "/obj/structure/chair/stool", {
	item_chair: rt.typePath("/obj/item/chair/stool/bar"),
	name: "bar stool",
	desc: "It has some unsavory stains on it...",
	icon_state: "bar",
});
rt.type(12747, "/obj/structure/chair/old", "/obj/structure/chair", {
	item_chair: null,
	name: "strange chair",
	desc: "You sit in this. Either by will or force. Looks REALLY uncomfortable.",
	icon_state: "chairold",
});
