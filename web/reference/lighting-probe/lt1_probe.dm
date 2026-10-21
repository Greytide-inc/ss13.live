// lt1_probe.dm - Logs what tg's lighting computed around (a) space-side walls/airlocks lit by a player's light
// and (b) the walls of lit rooms, so BYOND and the VM can be compared value by value.
//
// Never part of the real game. web/reference/lighting-probe/run-*.sh compile a wrapper .dme that does
// #include "tgstation.dme" then this file, in a throwaway folder. Every line goes to world.log with the
// prefix "[lt1] ". "[lt1] done" ends the probe.
//
// When: right after SSlighting's Initialize (during MC init, so BYOND needs no client). Lights are
// applied by calling SSlighting.fire() until its queues are empty.
// (a) up to 8 space turfs with a lattice next to an opaque, dynamically lit station tile, plus up to 4
//     next to a closed external airlock. A flashlight-strength light (range 4, power 1) is put on each;
//     the 5x5 around it is logged. Every other light within 12 tiles is switched off first.
// (b) the first 4 wall-mounted tube lights (spaced apart) get a lamp with the tube light (range 8) on their turf;
//     every opaque turf within 5 tiles is logged.
// Per tile: type, opacity, has_opaque_atom, lighting_object icon_state/luminosity/color, and each corner's
// lum_r/g/b. Per placed light: the turfs it affects (tg's view() of the light).

/obj/effect/lt1_lamp
	name = "lt1 lamp"

/datum/controller/subsystem/lighting/Initialize(timeofday)
	. = ..()
	lt1_probe()

/proc/lt1_n(v)
	return "[round(v, 0.001)]"

/proc/lt1_tile(tag, turf/T)
	var/lo = "none"
	if(T.lighting_object)
		var/atom/movable/lighting_object/O = T.lighting_object
		var/c = "null"
		if(islist(O.color))
			var/list/L = O.color
			var/list/parts = list()
			for(var/v in L)
				parts += lt1_n(v)
			c = jointext(parts, ",")
		else if(O.color)
			c = "[O.color]"
		lo = "[O.icon_state]|lum=[O.luminosity]|color=[c]"
	var/cs = "none"
	if(T.corners)
		var/list/parts = list()
		for(var/datum/lighting_corner/C in T.corners)
			var/list/src_parts = list()
			for(var/datum/light_source/LS in C.affecting)
				var/turf/ST = LS.source_turf
				src_parts += "[LS.source_atom ? LS.source_atom.type : "?"]@[ST ? "[ST.x],[ST.y]" : "-"]:[LS.light_range]:[lt1_n(LS.effect_str[C])]"
			parts += "([C.x],[C.y])=[lt1_n(C.lum_r)]/[lt1_n(C.lum_g)]/[lt1_n(C.lum_b)]{[jointext(sortList(src_parts), ";")]}"
		cs = jointext(parts, " ")
	world.log << "\[lt1] tile [tag] [T.x],[T.y] [T.type] op=[T.opacity] hoa=[T.has_opaque_atom] tlum=[T.luminosity] lo=[lo] corners=[cs]"

// The view() input around S, north row first: per cell "#" opaque or "." clear, the highest luminosity
// of the turf and its contents, and "A" if its area is luminous ("-" if not).
/proc/lt1_grid(tag, turf/S, r)
	for(var/dy in r to -r step -1)
		var/row = ""
		for(var/dx in -r to r)
			var/turf/T = locate(S.x + dx, S.y + dy, S.z)
			if(!T)
				row += " x "
				continue
			var/o = T.opacity
			var/l = T.luminosity
			for(var/atom/movable/M in T)
				if(M.opacity)
					o = 1
				if(M.luminosity > l)
					l = M.luminosity
			var/area/A = T.loc
			row += "[o ? "#" : "."][min(l, 9)][A.luminosity ? "A" : "-"]"
		world.log << "\[lt1] grid [tag] [S.y + dy] [row]"

/proc/lt1_far(turf/T, list/others, d)
	for(var/turf/O in others)
		if(get_dist(O, T) < d)
			return FALSE
	return TRUE

/proc/lt1_probe()
	var/z = ZLEVEL_STATION
	world.log << "\[lt1] start z=[z] time=[world.time]"
	var/list/spots = list()
	var/list/kinds = list()
	var/nwall = 0
	var/nlock = 0
	for(var/y in 1 to world.maxy)
		for(var/x in 1 to world.maxx)
			var/turf/open/space/S = locate(x, y, z)
			if(!istype(S) || !(locate(/obj/structure/lattice) in S))
				continue
			if(!lt1_far(S, spots, 12))
				continue
			var/lock = FALSE
			var/opaque_next = FALSE
			for(var/d in GLOB.cardinal)
				var/turf/N = get_step(S, d)
				if(!N || isspaceturf(N) || !N.lighting_object)
					continue
				if(N.has_opaque_atom)
					opaque_next = TRUE
				var/obj/machinery/door/airlock/external/A = locate() in N
				if(A && A.density)
					lock = TRUE
			if(!opaque_next)
				continue
			if(lock)
				if(nlock >= 4)
					continue
				nlock++
				spots += S
				kinds += "airlock"
				continue
			if(nwall >= 8)
				continue
			nwall++
			spots += S
			kinds += "wall"
	var/list/fixtures = list()
	for(var/obj/machinery/light/F in GLOB.machines)
		if(F.type != /obj/machinery/light || F.z != z)
			continue
		var/turf/FT = get_turf(F)
		var/far = TRUE
		for(var/obj/machinery/light/O in fixtures)
			if(get_dist(O, FT) < 15)
				far = FALSE
				break
		if(!far)
			continue
		fixtures += F
		if(fixtures.len >= 4)
			break
	// Only the probe's own lamps light the probed places, so the result doesn't depend on which station
	// lights happened to be on (they switch on from spawn()s, and 2-5% start broken): every other light
	// within 12 tiles is switched off.
	var/list/centres = spots.Copy()
	for(var/obj/machinery/light/F in fixtures)
		centres += get_turf(F)
	for(var/turf/C in centres)
		for(var/atom/A in range(12, C))
			if(A.light)
				A.set_light(0)
	SSlighting.fire(FALSE, TRUE)
	var/list/lamps = list()
	for(var/i in 1 to spots.len)
		var/obj/effect/lt1_lamp/L = new(spots[i])
		L.set_light(4, 1)
		lamps += L
	// (b) Each room gets a lamp with the tube's light (range 8) on the fixture's turf: the same source turf
	// and view() as the fixture's own light.
	for(var/obj/machinery/light/F in fixtures)
		var/obj/effect/lt1_lamp/L = new(get_turf(F))
		L.set_light(8, 1)
		lamps += L
	SSlighting.fire(FALSE, TRUE)
	// Once more, so each lamp's view() sees the others' lit tiles as they finally are.
	for(var/obj/effect/lt1_lamp/L in lamps)
		L.light.force_update()
	SSlighting.fire(FALSE, TRUE)
	for(var/i in 1 to lamps.len)
		var/obj/effect/lt1_lamp/L = lamps[i]
		var/turf/S = get_turf(L)
		var/list/aff = list()
		for(var/turf/T in L.light.affecting_turfs)
			aff += "[T.x],[T.y]"
		var/tag = i <= spots.len ? "a[i]" : "b[i - spots.len]"
		var/kind = i <= spots.len ? kinds[i] : "room [get_area(S)]"
		world.log << "\[lt1] spot [tag] [replacetext(kind, " ", "_")] [S.x],[S.y] affecting=[aff.len]: [jointext(sortList(aff), " ")]"
		if(i <= spots.len)
			lt1_grid(tag, S, 5)
			for(var/turf/T in range(2, S))
				if(!isspaceturf(T))
					lt1_tile(tag, T)
		else
			for(var/turf/T in range(5, S))
				if(T.opacity)
					lt1_tile(tag, T)
	world.log << "\[lt1] done"
