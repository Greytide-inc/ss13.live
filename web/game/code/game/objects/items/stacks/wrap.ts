// Based on /tg/station's code/game/objects/items/stacks/wrap.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(9108, "/obj/item/stack/wrapping_paper", "/obj/item/stack", {
	flags: 4,
	amount: 25,
	max_amount: 25,
	name: "wrapping paper",
	desc: "Wrap packages with this festive paper to make gifts.",
	icon: rt.rsc("icons/obj/items.dmi"),
	icon_state: "wrap_paper",
	resistance_flags: 4,
});

// wrap.dm:18
rt.def("/obj/item/stack/wrapping_paper/proc/Destroy", function* Destroy(f: Frame) {
	if (!this.amount) {
		yield* new_(T("/obj/item/weapon/c_tube"), rt.getStep(f, this, 0));
	}
	return (yield* parent_proc());
}, true);

rt.type(9109, "/obj/item/stack/packageWrap", "/obj/item/stack", {
	flags: 4,
	amount: 25,
	max_amount: 25,
	name: "package wrapper",
	desc: "You can use this to wrap items in.",
	icon: rt.rsc("icons/obj/items.dmi"),
	icon_state: "deliveryPaper",
	resistance_flags: 4,
});

// wrap.dm:50
rt.def("/obj/item/stack/packageWrap/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity: Value) {
	let I: Value = null, _P: Value = null, size: Value = null, O: Value = null;
	if (!proximity) {
		return f.dot;
	}
	if (!rt.istype(target, T("/obj"))) {
		return f.dot;
	}
	if (target.anchored) {
		return f.dot;
	}
	if (rt.istype(target, T("/obj/item"))) {
		if (!(I = target).can_be_package_wrapped()) {
			return f.dot;
		}
		if (user.is_holding(I)) {
			if (!(yield* user.dropItemToGround(I))) {
				return f.dot;
			}
		} else if (!isturf(I.loc)) {
			return f.dot;
		}
		if (yield* this.use(1)) {
			_P = (yield* new_(T("/obj/item/smallDelivery"), rt.getStep(f, I.loc, 0)));
			if (user.Adjacent(I)) {
				yield* _P.add_fingerprint(user);
				yield* I.add_fingerprint(user);
				yield* user.put_in_hands(_P);
			}
			yield* I.forceMove(_P);
			size = round(I.w_class);
			_P.name = `${weightclass2text(size)} parcel`;
			_P.w_class = size;
			size = min(size, 5);
			_P.icon_state = `deliverypackage${size}`;
		}
	} else if (rt.istype(target, T("/obj/structure/closet"))) {
		if ((O = target).opened) {
			return f.dot;
		}
		if (!O.delivery_icon) {
			to_chat(user, "<span class='warning'>You can't wrap this!</span>");
			return f.dot;
		}
		if (yield* this.use(3)) {
			(_P = (yield* new_(T("/obj/structure/bigDelivery"), rt.getStep(f, O.loc, 0)))).icon_state = O.delivery_icon;
			yield* O.forceMove(_P);
			yield* _P.add_fingerprint(user);
			yield* O.add_fingerprint(user);
		} else {
			to_chat(user, "<span class='warning'>You need more paper!</span>");
			return f.dot;
		}
	} else {
		to_chat(user, "<span class='warning'>The object you are trying to wrap is unsuitable for the sorting machinery!</span>");
		return f.dot;
	}
	user.visible_message(`<span class='notice'>${user} wraps ${target}.</span>`);
	user.log_message(`<font color='blue'>Has used ${this.name} on ${target}</font>`, "Attack log");
	return f.dot;
}, true);

// wrap.dm:103
rt.def("/obj/item/stack/packageWrap/proc/Destroy", function* Destroy(f: Frame) {
	if (!this.amount) {
		yield* new_(T("/obj/item/weapon/c_tube"), rt.getStep(f, this, 0));
	}
	return (yield* parent_proc());
}, true);
