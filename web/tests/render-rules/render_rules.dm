// Test world for web/tests/render-rules/run.sh. Map is 15x11; layout is described in README of
// web/reference/render-rules/. Tile (x,y) is at screen x = 39+(x-1)*32, y = 303+(11-y)*32 in the capture.
world
	maxx = 15
	maxy = 11
	view = "15x11"
	turf = /turf/floor
	fps = 20
/turf/floor
	icon = 'floor.png'
/mob
	Login()
		..()
		loc = locate(8,6,1)
		spawn(20)
			winset(src, "mainwindow", "is-minimized=false;is-maximized=false;pos=0,0;size=1100x900")
			// tg skin.dmf map element: font-family Arial, font-size 7, text-color none
			winset(src, "mapwindow.map", "icon-size=32;font-family=Arial;font-size=7;text-color=none")
		// animation sets: row 2 appears 6 s after login, row 1 2.5 s later (checks per-object vs global phase)
		spawn(60)
			anims(2)
			world.log << "ANIM ROW 2 at [world.time]"
		spawn(85)
			anims(1)
			world.log << "ANIM ROW 1 at [world.time]"
/obj/mt
	icon = 'bg96x64.png'
	maptext_width = 96
	maptext_height = 64
/obj/mt/g
	icon = 'bg64x64.png'
	maptext_width = 64
/obj/mt/short
	icon = 'bg64x32.png'
	maptext_width = 64
	maptext_height = 32
/obj/mt/hud
	icon = 'bg32x32.png'
	maptext_width = 32
	maptext_height = 32
/obj/mt/w32
	icon = 'bg96x32.png'
	maptext_height = 32
/obj/arrow
	icon = 'arrow.png'
	layer = 5
/obj/an
	icon = 'anim.dmi'
proc/put(type, x, y, mt = null)
	var/atom/movable/A = new type(locate(x,y,1))
	if(mt) A.maptext = mt
	return A
proc/anims(y)
	var/list/S = list("plain", "rw", "lp", "rwlp")
	for(var/i in 1 to 4)
		var/atom/movable/A = put(/obj/an, 2 + (i-1)*3, y)
		A.icon_state = S[i]
proc/tr(x, matrix/M, label)
	var/atom/movable/A = put(/obj/arrow, x, 4)
	A.transform = M
	world.log << "T [label] x=[x] = [M.a],[M.b],[M.c],[M.d],[M.e],[M.f]"
world/New()
	..()
	spawn(1)
		// rows 9-10: anchor, wrap, align
		put(/obj/mt, 1, 9, "Hi")
		put(/obj/mt/g, 5, 9, "one two three four five six seven")
		put(/obj/mt, 8, 9, "<span style='text-align:right'>R1</span><br>L2")
		put(/obj/mt, 12, 9, "L1<br><span style='text-align:right'>R2</span>")
		// rows 6-7: more align, overflow, long word
		put(/obj/mt, 1, 6, "<span style='text-align:center'>C1</span><br><span style='text-align:right'>R2</span>")
		put(/obj/mt/short, 5, 6, "one two three four five six seven")
		put(/obj/mt/g, 8, 6, "abcdefghijklmnopqrstuvwxyz0123")
		put(/obj/mt, 12, 6, "L<span style='text-align:center'>CC</span>")
		// row 11: <div> forms, including tg's own HUD counter string (carbon/life.dm etc.)
		put(/obj/mt/hud, 1, 11, "<div align='center' valign='middle' style='position:relative; top:0px; left:6px'><font color='#dd66dd'>42</font></div>")
		put(/obj/mt/w32, 3, 11, "<div align='center'>DV</div>")
		put(/obj/mt/w32, 7, 11, "<div valign='middle'>VM</div>")
		put(/obj/mt/hud, 11, 11, "<div align='center' valign='middle' style='position:relative; top:0px; left:6px'><font color='#efeeef'>100%</font></div>")
		put(/obj/mt/w32, 13, 11, "<div style='position:relative; top:0px; left:6px'>P6</div>")
		// row 4: transforms
		put(/obj/arrow, 2, 4)
		tr(4, matrix(2,0,0,0,2,0), "scale2")
		tr(6, turn(matrix(), 90), "turn90")
		tr(8, turn(matrix(), 45), "turn45")
		tr(10, matrix(1,0,16,0,1,8), "translate16,8")
		var/matrix/M = matrix()
		M.Scale(2,1)
		M.Turn(90)
		M.Translate(16,0)
		tr(12, M, "Scale(2,1).Turn(90).Translate(16,0)")
		tr(14, matrix(1,0.5,0,0,1,0), "shear b=0.5")
		world.log << "READY [world.time]"
