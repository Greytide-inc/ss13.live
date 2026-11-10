// Based on BYOND's Types/Atoms/Movable.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, truthy } = rt;


// Empty in tg.
rt.def("/atom/movable/proc/get_alt_name");

// Empty in tg.
rt.def("/atom/movable/proc/GetJob");

// Empty in tg.
rt.def("/atom/movable/proc/GetSource");

// Empty in tg.
rt.def("/atom/movable/proc/GetRadio");

// Movable.dm:25
rt.def("/atom/movable/proc/Move", function Move(f: Frame, NewLoc: Value, Dir: Value) {
	let d: Value = null, obstacle: Value = null, uncrossed: Value = null, crossed: Value = null;
	let $e: any;
	let L: Value = null, sk: Value = null;
	Dir ??= 0;
	if (NewLoc === null) {
		return 0;
	}
	let oldloc: Value = this.loc;
	if (Dir) {
		this.dir = Dir;
	} else if (oldloc) {
		if (d = rt.getDir(f, oldloc, NewLoc)) {
			this.dir = d;
		}
	}
	if (oldloc == NewLoc) {
		return 1;
	}
	let oldarea: Value = isturf(oldloc) ? oldloc.loc : null;
	let newarea: Value = isturf(NewLoc) ? NewLoc.loc : null;
	let areachange: Value = (oldarea != newarea ? 1 : 0);
	if (oldloc) {
		if (!oldloc.Exit(this, NewLoc)) {
			return 0;
		}
		if (areachange && oldarea && !oldarea.Exit(this, NewLoc)) {
			return 0;
		}
	}
	let entered: Value = NewLoc.Enter(this, oldloc);
	let areaentered: Value = !areachange || !newarea ? 1 : newarea.Enter(this, oldloc);
	if (!entered || !areaentered) {
		if (!entered) {
			if (NewLoc.density) {
				this.Bump(NewLoc);
			} else {
				for (obstacle of each(NewLoc, T("/atom/movable"))) {
					if (obstacle != this && obstacle.density) {
						this.Bump(obstacle);
						break;
					}
				}
			}
		}
		if (!areaentered) {
			this.Bump(newarea);
		}
		return 0;
	}
	this.loc = NewLoc;
	if (oldloc) {
		oldloc.Exited(this, NewLoc);
		// stress2c: Uncrossed and (below) Crossed only for the neighbours that define one (hook_list, src/vm/natives-world.ts)
		if (isturf(oldloc) && (L = hook_list(oldloc, 2)) !== null) {
			const chk = truthy(hook_check_mode());
			for (uncrossed of each(L, T("/atom/movable"))) {
				if (uncrossed != this) {
					sk = (chk ? hook_skips(uncrossed, 2) : 0);
					const r = uncrossed.Uncrossed(this);
					if (chk) hook_check(sk, r, 2);
				}
			}
		}
	}
	if (areachange && oldarea) {
		oldarea.Exited(this, NewLoc);
	}
	NewLoc.Entered(this, oldloc);
	if (isturf(NewLoc) && (L = hook_list(NewLoc, 3)) !== null) {
		const chk = truthy(hook_check_mode());
		for (crossed of each(L, T("/atom/movable"))) {
			if (crossed != this) {
				sk = (chk ? hook_skips(crossed, 3) : 0);
				const r = crossed.Crossed(this);
				if (chk) hook_check(sk, r, 3);
			}
		}
	}
	if (areachange && newarea) {
		newarea.Entered(this, oldloc);
	}
	if (isturf(oldloc) && isturf(NewLoc) && oldloc.z == NewLoc.z && get_dist(oldloc, NewLoc) == 1) {
		return 32;
	}
	return 1;
});
