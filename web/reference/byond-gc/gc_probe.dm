// gc_probe.dm - Logs tg's SSgarbage counters to world.log every 30 s of game time, for comparing the
// VM's garbage collection with BYOND's (web/reference/boot-byond-gc.sh). Compiled only into a copy
// of the game (tg_gc.dme in the run folder); the game code itself is untouched.

/world/New()
	spawn(10)
		__gc_probe()
	..()

/proc/__gc_probe()
	while(TRUE)
		sleep(300)
		if(!SSgarbage)
			continue
		var/list/rows = list()
		for(var/path in SSgarbage.didntgc)
			rows += "[path] x[SSgarbage.didntgc[path]]"
		world.log << "\[gc-probe] time [world.time] totalgcs [SSgarbage.totalgcs] totaldels [SSgarbage.totaldels] queue [SSgarbage.queue.len] tobequeued [SSgarbage.tobequeued.len] | [jointext(rows, ", ")]"

// Additions: what gets queued, by type (the VM's VM_GC_PROBE=1 boot prints the same
// tallies), which emitters fire, and when the two types the VM hard-deletes get qdel'd.
/datum/controller/subsystem/garbage/var/list/probe_queue_types = list()
/datum/controller/subsystem/garbage/var/list/probe_fire_beam = list()

/datum/controller/subsystem/garbage/Queue(datum/A)
	if(A)
		probe_queue_types["[A.type]"]++
	return ..()

/obj/machinery/power/emitter/fire_beam(atom/targeted_atom, mob/user)
	if(SSgarbage)
		SSgarbage.probe_fire_beam["[type] z[z]"]++
	return ..()

/obj/machinery/door/airlock/external/Destroy()
	world.log << "\[gc-probe] qdel [type] \ref[src] at time [world.time] on [loc] ([x],[y],[z])"
	return ..()

/obj/effect/light_emitter/tendril/Destroy()
	world.log << "\[gc-probe] qdel [type] \ref[src] at time [world.time] on [loc] ([x],[y],[z])"
	return ..()

/proc/__gc_probe_top(list/L, n)
	var/list/S = sortTim(L.Copy(), /proc/cmp_numeric_dsc, TRUE)
	var/list/rows = list()
	var/total = 0
	for(var/k in S)
		total += S[k]
		if(rows.len < n)
			rows += "[k] x[S[k]]"
	return "total [total]: [jointext(rows, ", ")]"

/proc/__gc_probe_types()
	while(TRUE)
		sleep(600)
		if(!SSgarbage)
			continue
		world.log << "\[gc-probe] time [world.time] queued types [__gc_probe_top(SSgarbage.probe_queue_types, 25)]"
		world.log << "\[gc-probe] time [world.time] emitter fire_beam [__gc_probe_top(SSgarbage.probe_fire_beam, 10)]"

/world/New()
	spawn(15)
		__gc_probe_types()
	..()
