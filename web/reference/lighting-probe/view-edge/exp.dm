/world
	maxx = 15
	maxy = 15
	view = 7
/area/dark
	luminosity = 0
/turf/opq
	opacity = 1
/obj/lum
/mob/viewer
var/seed = 11
/proc/rnd(n)
	seed = (seed * 75 + 74) % 65537
	return seed % n
/proc/run_tests()
	var/area/dark/D = new
	for(var/x in 1 to 15)
		for(var/y in 1 to 15)
			D.contents += locate(x, y, 1)
	var/mob/viewer/M = new(locate(8, 8, 1))
	for(var/p in 1 to 240)
		var/mode = p % 3 // 0: turf centre with lum 4 (tg's light view), 1: mob, 2: mob with lum-1 field sparse walls
		var/wallp = mode == 2 ? 10 : 22
		var/fieldp = 20 + rnd(60)
		for(var/x in 1 to 15)
			for(var/y in 1 to 15)
				var/turf/T = locate(x, y, 1)
				for(var/obj/O in T) del O
				if(x == 8 && y == 8)
					if(T.type != /turf) new /turf(T)
				else if(rnd(100) < wallp)
					if(T.type != /turf/opq) new /turf/opq(T)
				else if(T.type != /turf) new /turf(T)
				T = locate(x, y, 1)
				T.luminosity = (rnd(100) < fieldp) ? 1 : 0
		var/nl = rnd(4)
		for(var/i in 1 to nl)
			var/x = 1 + rnd(15)
			var/y = 1 + rnd(15)
			var/obj/lum/O = new(locate(x, y, 1))
			O.luminosity = 1 + rnd(5)
		var/turf/C = locate(8, 8, 1)
		var/list/L
		if(mode == 0)
			M.loc = null
			var/old = C.luminosity
			C.luminosity = 4
			L = view(4, C)
			C.luminosity = old
		else
			M.loc = C
			M.see_in_dark = rnd(3)
			L = view(7, M)
		var/s = "R [p] mode=[mode] sid=[M.see_in_dark]\n"
		for(var/y in 15 to 1 step -1)
			for(var/x in 1 to 15)
				var/turf/T = locate(x, y, 1)
				var/tl = T.luminosity
				if(mode == 0 && x == 8 && y == 8) tl = 4
				var/ol = 0
				for(var/obj/O in T)
					ol += O.luminosity
				s += "[T.opacity ? "#" : "."][tl][ol][(T in L) ? "S" : "-"]"
			s += "\n"
		world.log << s
	shutdown()
/world/New()
	spawn(1) run_tests()
