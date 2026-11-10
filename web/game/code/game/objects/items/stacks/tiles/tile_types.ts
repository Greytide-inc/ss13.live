// Based on /tg/station's code/game/objects/items/stacks/tiles/tile_types.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g } = rt;


rt.type(8969, "/obj/item/stack/tile", "/obj/item/stack", {
	turf_type: null,
	mineralType: null,
	throw_speed: 3,
	throw_range: 7,
	name: "broken tile",
	singular_name: "broken tile",
	desc: "A broken tile. This should not exist.",
	icon: rt.rsc("icons/obj/tiles.dmi"),
	w_class: 3,
	force: 1,
	throwforce: 1,
	max_amount: 60,
	origin_tech: "materials=1",
	novariants: 1,
});

// tile_types.dm:18
rt.def("/obj/item/stack/tile/proc/Initialize", function* Initialize(f: Frame, mapload: Value, amount: Value) {
	f.dot = (yield* parent_proc());
	this.pixel_x = rand(-3, 3);
	this.pixel_y = rand(-3, 3);
	return f.dot;
}, true);

// tile_types.dm:24
rt.def("/obj/item/stack/tile/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let WT: Value = null, new_item: Value = null, R: Value = null, replace: Value = null, sheet_type: Value = null, new_item_2: Value = null, R_3: Value = null, replace_4: Value = null;
	if (rt.istype(W, T("/obj/item/weapon/weldingtool"))) {
		WT = W;
		if ((yield* g.srcCall(f, "get_amount")) < 4) {
			to_chat(user, "<span class='warning'>You need at least four tiles to do this!</span>");
			return f.dot;
		}
		if (WT.is_hot() && !rt.sv(f, "mineralType")) {
			to_chat(user, "<span class='warning'>You can not reform this!</span>");
			return f.dot;
		}
		if (yield* WT.remove_fuel(0, user)) {
			if (rt.sv(f, "mineralType") == "plasma") {
				yield* g.srcCall(f, "atmos_spawn_air", "plasma=5;TEMP=1000");
				user.visible_message(`<span class='warning'>${user.name} sets the plasma tiles on fire!</span>`, "<span class='warning'>You set the plasma tiles on fire!</span>");
				yield* qdel(f.src);
				return f.dot;
			}
			if (rt.sv(f, "mineralType") == "metal") {
				new_item = (yield* new_(T("/obj/item/stack/sheet/metal"), user.loc));
				user.visible_message(`${user.name} shaped ${f.src} into metal with the welding tool.`, `<span class='notice'>You shaped ${f.src} into metal with the welding tool.</span>`, "<span class='italics'>You hear welding.</span>");
				R = f.src;
				f.src = null;
				replace = (user.get_inactive_held_item() == R ? 1 : 0);
				yield* R.use(4);
				if (!R && replace) {
					yield* user.put_in_hands(new_item);
				}
			} else {
				sheet_type = text2path(`/obj/item/stack/sheet/mineral/${rt.sv(f, "mineralType")}`);
				new_item_2 = (yield* new_(sheet_type, user.loc));
				user.visible_message(`${user.name} shaped ${f.src} into a sheet with the welding tool.`, `<span class='notice'>You shaped ${f.src} into a sheet with the welding tool.</span>`, "<span class='italics'>You hear welding.</span>");
				R_3 = f.src;
				f.src = null;
				replace_4 = (user.get_inactive_held_item() == R_3 ? 1 : 0);
				yield* R_3.use(4);
				if (!R_3 && replace_4) {
					yield* user.put_in_hands(new_item_2);
				}
			}
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

rt.type(8970, "/obj/item/stack/tile/plasteel", "/obj/item/stack/tile", {
	flags: 64,
	name: "floor tile",
	singular_name: "floor tile",
	desc: "Those could work as a pretty decent throwing weapon.",
	icon_state: "tile",
	force: 6,
	materials: null,
	throwforce: 10,
	turf_type: rt.typePath("/turf/open/floor/plasteel"),
	mineralType: "metal",
	armor: null,
	resistance_flags: 2,
});

// tile_types.dm:212
rt.def("/obj/item/stack/tile/plasteel/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 500]);
	this.armor = rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 70]);
	return f.dot;
});

rt.type(8971, "/obj/item/stack/tile/plasteel/cyborg", "/obj/item/stack/tile/plasteel", {
	desc: "The ground you walk on.",
	materials: null,
	is_cyborg: 1,
	cost: 125,
});

// tile_types.dm:222
rt.def("/obj/item/stack/tile/plasteel/cyborg/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = list();
	return f.dot;
});
