// Test world for web/tests/render-rules/run.sh pipes (phase pv1): Box Station's medbay cryo room pipes
// (x143-147, y112-114 on Box) rebuilt in plain BYOND 511 with tg's own dmis and tg's own icon logic
// (pipe/update_icon, manifold/update_icon + getpipeimage, components/update_icon for the connector
// underlay, canister/update_icon), so the look can be compared with the page. Tile (X,Y) on Box is
// (X-140, Y-108) here. Paths are relative to web/build/render-rules/ (where run.sh builds).
#define PIPES 'icons/obj/atmospherics/pipes/simple.dmi'
#define MANI 'icons/obj/atmospherics/pipes/manifold.dmi'
world
	maxx = 11
	maxy = 9
	view = "11x9"
	turf = /turf/floor
	fps = 20
/turf/floor
	icon = 'icons/turf/floors.dmi'
	icon_state = "floor"
/mob
	Login()
		..()
		loc = locate(6,5,1)
		spawn(20)
			winset(src, "mainwindow", "is-minimized=false;is-maximized=false;pos=0,0;size=1100x900")
			winset(src, "mapwindow.map", "icon-size=32")
/obj/pipe
	icon = PIPES
	icon_state = "intact"
	layer = 2.47
/obj/mani
	icon = MANI
	icon_state = "manifold_center"
	layer = 2.47
/obj/conn
	icon = 'icons/obj/atmospherics/components/unary_devices.dmi'
	icon_state = "connector_map"
	layer = 2.48
/obj/can
	icon = 'icons/obj/atmos.dmi'
	icon_state = "blue"
	layer = 3
/obj/freezer
	icon = 'icons/obj/Cryogenic2.dmi'
	icon_state = "freezer"
	layer = 3
// tg's getpipeimage (atmosmachinery.dm), without the cache
proc/pimg(iconset, iconstate, direction, col = rgb(255,255,255))
	var/image/I = image(iconset, iconstate, dir = direction)
	I.color = col
	return I
// tg's build_appearance_list (SSoverlays, processing/overlays.dm): each image goes through a static
// /image whose appearance is set, then dir copied over, then its appearance taken; and compile_overlays
// assigns the whole list (overlays = our_overlays).
proc/bro(image/cached_overlay)
	var/static/image/appearance_bro = new()
	appearance_bro.appearance = cached_overlay
	appearance_bro.dir = cached_overlay.dir
	return appearance_bro.appearance
proc/at(X, Y)
	return locate(X - 140, Y - 108, 1)
proc/pipe(X, Y, D)
	var/obj/pipe/P = new(at(X, Y)); P.dir = D
proc/mani(X, Y, D, arms)
	var/obj/mani/M = new(at(X, Y)); M.dir = D
	var/list/L = list()
	for(var/a in arms)
		L += bro(pimg(MANI, "manifold_full", a))
	M.overlays = L
	var/list/got = list()
	for(var/o in M.overlays)
		got += "[o:dir]"
	world.log << "T mani [X],[Y] dir [D] overlay dirs [jointext(got, ",")]"
proc/conn(X, Y)
	var/obj/conn/C = new(at(X, Y)); C.dir = NORTH
	C.underlays += pimg('icons/obj/atmospherics/components/binary_devices.dmi', "pipe_intact", NORTH, null)
	var/o = C.underlays[1]
	world.log << "T conn underlay dir [o:dir]"
	var/obj/can/K = new(at(X, Y)); K.overlays += "can-o3"
world/New()
	..()
	spawn(1)
		pipe(144, 114, 5); pipe(145, 114, 4); pipe(147, 114, 10); pipe(145, 113, 6)
		mani(146, 114, SOUTH, list(WEST, NORTH, EAST))   // node dirs in NORTH/SOUTH/EAST/WEST loop order don't matter for the look
		mani(146, 113, NORTH, list(EAST, SOUTH, WEST))
		mani(147, 113, EAST, list(SOUTH, WEST, NORTH))
		var/obj/can/K = new(at(143, 112)); K.overlays += "can-o3"
		conn(145, 112); conn(146, 112)
		var/obj/freezer/F = new(at(147, 112)); F.dir = NORTH
		// Row 1: the same parts alone on bare floor, no neighbours: T (x2), 4-way (x4), connector without canister (x6), straight (x8)
		M4(4)
		var/obj/mani/T = new(locate(2, 1, 1)); T.dir = SOUTH
		for(var/a in list(WEST, NORTH, EAST)) T.overlays += pimg(MANI, "manifold_full", a)
		var/obj/conn/C = new(locate(6, 1, 1)); C.dir = NORTH
		C.underlays += pimg('icons/obj/atmospherics/components/binary_devices.dmi', "pipe_intact", NORTH, null)
		var/obj/pipe/P = new(locate(8, 1, 1)); P.dir = 4
		// Row 3: the T again with the plain overlays += image() path (no appearance_bro), owner dir SOUTH (x2) and NORTH (x4)
		for(var/xx in list(2, 4))
			var/obj/mani/T2 = new(locate(xx, 3, 1)); T2.dir = xx == 2 ? SOUTH : NORTH
			for(var/a in (xx == 2 ? list(WEST, NORTH, EAST) : list(WEST, SOUTH, EAST))) T2.overlays += pimg(MANI, "manifold_full", a)
		// Row 8: which ways of setting an overlay's dir at run time keep it (drawn EAST arm) or make it follow
		// the owner (NORTH arm)? Owner dir NORTH, overlay manifold_full meant to point EAST.
		probe(1, "img+=")      // /image, dir set, overlays +=
		probe(2, "img=list")   // /image, dir set, overlays = list()
		probe(3, "snap+=")     // its .appearance, overlays +=
		probe(4, "snap=list")  // its .appearance, overlays = list()
		probe(5, "bro+=")      // tg's appearance_bro path (image() with dir arg), overlays +=
		probe(6, "bro=list")   // tg's path, overlays = list() (what the cryo room above uses)
		probe(7, "ma+=")       // /mutable_appearance, dir set, overlays +=
		probe(8, "ma=list")    // same, overlays = list()
		probe(9, "bro2+=")     // appearance_bro path with an image made without a dir arg, dir set after
		// Row 9 (x1-x4): is an assignment of the same dir a no-op?
		probe(10, "typedir4-bro")  // (x1,9) obj of a type whose default dir is EAST, via tg's bro path
		probe(11, "imgarg-set-same") // (x2,9) image() dir arg EAST, then I.dir = EAST, overlays +=
		probe(12, "imgarg-set-other") // (x3,9) image() dir arg WEST, then I.dir = EAST
		probe(13, "typedir4-set-same") // (x4,9) obj of a type whose default dir is EAST, S.dir = EAST, overlays += S
		world.log << "READY [world.time]"
proc/M4(x)
	var/obj/mani/M = new(locate(x, 1, 1)); M.icon_state = "manifold4w_center"; M.icon = 'icons/obj/atmospherics/pipes/manifold.dmi'
	for(var/a in list(NORTH, SOUTH, EAST, WEST)) M.overlays += pimg(MANI, "manifold_full", a)
proc/probe(x, how)
	var/obj/mani/O = new(x < 10 ? locate(x, 8, 1) : locate(x - 9, 9, 1)); O.icon_state = "manifold_center"; O.dir = NORTH
	var/v
	switch(how)
		if("img+=", "img=list", "snap+=", "snap=list")
			var/image/I = new; I.icon = MANI; I.icon_state = "manifold_full"; I.dir = EAST
			v = (how == "snap+=" || how == "snap=list") ? I.appearance : I
		if("ma+=", "ma=list")
			var/mutable_appearance/M = new; M.icon = MANI; M.icon_state = "manifold_full"; M.dir = EAST
			v = M
		if("bro+=", "bro=list")
			v = bro(pimg(MANI, "manifold_full", EAST))
		if("typedir4-bro")
			v = bro(new /obj/east)
		if("imgarg-set-same")
			var/image/J = image(MANI, "manifold_full", dir = EAST); J.dir = EAST
			v = J
		if("imgarg-set-other")
			var/image/J = image(MANI, "manifold_full", dir = WEST); J.dir = EAST
			v = J
		if("typedir4-set-same")
			var/obj/east/E = new; E.dir = EAST
			v = E
		if("bro2+=")
			var/image/J = image(MANI, "manifold_full"); J.dir = EAST
			v = bro(J)
	if(findtext(how, "=list"))
		O.overlays = list(v)
	else
		O.overlays += v
	var/o = O.overlays[1]
	world.log << "T probe x[x] [how] overlay dir [o:dir]"
/obj/east
	icon = MANI
	icon_state = "manifold_full"
	dir = EAST
