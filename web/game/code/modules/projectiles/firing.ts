// Based on /tg/station's code/modules/projectiles/firing.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// firing.dm:2
rt.def("/obj/item/ammo_casing/proc/fire_casing", function* fire_casing(f: Frame, target: Value, user: Value, params: Value, distro: Value, quiet: Value, zone_override: Value, spread: Value) {
	let targloc: Value = null;
	distro += this.variance;
	let i: Value = max(1, this.pellets);
	while (i > 0) {
		targloc = rt.getStep(f, target, 0);
		yield* this.ready_proj(target, user, quiet, zone_override);
		if (distro) {
			if (this.randomspread) {
				spread = round((rand() - 0.5) * distro);
			} else {
				spread = round((i / this.pellets - 0.5) * distro);
			}
		}
		if (!(yield* this.throw_proj(target, targloc, user, params, spread))) {
			return 0;
		}
		if (i > 1) {
			yield* this.newshot();
		}
		i--;
	}
	if (this.click_cooldown_override) {
		user.changeNext_move(this.click_cooldown_override);
	} else {
		user.changeNext_move(4);
	}
	yield* user.newtonian_move(rt.getDir(f, target, user));
	yield* this.update_icon();
	return 1;
}, true);

// firing.dm:24
rt.def("/obj/item/ammo_casing/proc/ready_proj", function* ready_proj(f: Frame, target: Value, user: Value, quiet: Value, zone_override: Value) {
	if (!this.BB) {
		return f.dot;
	}
	this.BB.original = target;
	this.BB.firer = user;
	if (zone_override) {
		this.BB.def_zone = zone_override;
	} else {
		this.BB.def_zone = user.zone_selected;
	}
	this.BB.suppressed = quiet;
	if (!(this.reagents && this.BB.reagents)) return f.dot;
	yield* this.reagents.trans_to(this.BB, this.reagents.total_volume);
	yield* qdel(this.reagents);
	return f.dot;
}, true);

// firing.dm:39
rt.def("/obj/item/ammo_casing/proc/throw_proj", function* throw_proj(f: Frame, target: Value, targloc: Value, user: Value, params: Value, spread: Value) {
	let firing_dir: Value = null, direct_target: Value = null;
	let curloc: Value = rt.getStep(f, user, 0);
	if (!rt.istype(targloc, T("/turf")) || !rt.istype(curloc, T("/turf")) || !this.BB) {
		return 0;
	}
	if (this.BB.firer) {
		firing_dir = this.BB.firer.dir;
	}
	if (!this.BB.suppressed && this.firing_effect_type) {
		yield* new_(this.firing_effect_type, rt.getStep(f, this, 0), firing_dir);
	}
	if (targloc == curloc) {
		if (target) {
			direct_target = target;
		}
	}
	if (!direct_target) {
		yield* this.BB.preparePixelProjectile(target, targloc, user, params, spread);
	}
	yield* this.BB.fire(null, direct_target);
	this.BB = null;
	return 1;
}, true);

// firing.dm:60
rt.def("/obj/item/ammo_casing/proc/spread", function spread(f: Frame, target: Value, current: Value, distro: Value) {
	let dx: Value = rt.op(f, "Abs", [], [target.x - current.x]);
	let dy: Value = rt.op(f, "Abs", [], [target.y - current.y]);
	return rt.locate(target.x + round(gaussian(0, distro) * (dy + 2) / 8, 1), target.y + round(gaussian(0, distro) * (dx + 2) / 8, 1), target.z);
});
