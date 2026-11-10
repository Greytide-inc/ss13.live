// Based on /tg/station's code/game/objects/items/documents.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(9775, "/obj/item/documents/photocopy", "/obj/item/documents", {
	forgedseal: 0,
	copy_type: null,
	desc: "A copy of some top-secret documents. Nobody will notice they aren't the originals... right?",
});

// documents.dm:41
rt.def("/obj/item/documents/photocopy/proc/New", function* New(f: Frame) {
	let C: Value = null;
	if (f.args[1] === null) {
		f.args[1] = null;
	}
	yield* parent_proc();
	if (!f.args[1]) return f.dot;
	this.copy_type = f.args[1].type;
	if (!rt.istype(f.args[1], T("/obj/item/documents/photocopy"))) return f.dot;
	this.copy_type = (C = f.args[1]).copy_type;
	return f.dot;
}, true, { args: ["loc", "copy"] });

// documents.dm:49
rt.def("/obj/item/documents/photocopy/proc/attackby", function attackby(f: Frame, O: Value, user: Value, params: Value) {
	let C: Value = null;
	if (!(rt.istype(O, T("/obj/item/toy/crayon/red")) || rt.istype(O, T("/obj/item/toy/crayon/blue")))) return f.dot;
	if (this.forgedseal) {
		to_chat(user, `<span class='warning'>You have already forged a seal on ${this}!</span>`);
	} else {
		this.name = `${(C = O).item_color} secret documents`;
		this.icon_state = `docs_${C.item_color}`;
		this.forgedseal = C.item_color;
		to_chat(user, `<span class='notice'>You forge the official seal with a ${C.item_color} crayon. No one will notice... right?</span>`);
		this.update_icon();
	}
	return f.dot;
});
