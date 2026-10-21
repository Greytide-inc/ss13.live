// Test world for web/tests/render-rules/run.sh nested (phase ov1): how BYOND 511 draws an overlay's own
// overlays (nested), and what image(icon, state, dir = D) sets. Cases are tiles x = 2,4,..12 on row 9 (nesting) and row 7 (overlay dir).
// Sample with nested-sample.py. full_*.png are solid 32x32; dot_*.png an 8x8 dot at the bottom-left.
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
		loc = locate(1,1,1)
		spawn(20)
			winset(src, "mainwindow", "is-minimized=false;is-maximized=false;pos=0,0;size=1100x900")
			winset(src, "mapwindow.map", "icon-size=32")
/obj/p
	layer = 3
proc/img(icon, layer = FLOAT_LAYER, px = 0, py = 0)
	var/image/I = image(icon = icon, layer = layer)
	I.pixel_x = px
	I.pixel_y = py
	return I
proc/mkp(x)
	return new /obj/p(locate(x, 9, 1))
world/New()
	..()
	spawn(1)
		var/obj/p/P
		var/image/I
		// x2: position. Blue dot raised 16; its nested yellow dot has pixel_x 16. Yellow at (16,16) = offsets add up.
		P = mkp(2); I = img('dot_o.png', py = 16); I.overlays += img('dot_y.png', px = 16); P.overlays += I
		// x4: blue overlay with a nested yellow at FLOAT_LAYER-25, then a green sibling overlay. Top colour?
		P = mkp(4); I = img('full_o.png'); I.overlays += img('full_y.png', FLOAT_LAYER - 25); P.overlays += I; P.overlays += img('full_q.png')
		// x6: same, nested yellow at FLOAT_LAYER.
		P = mkp(6); I = img('full_o.png'); I.overlays += img('full_y.png'); P.overlays += I; P.overlays += img('full_q.png')
		// x8: blue overlay with nested yellow at FLOAT_LAYER-25, no sibling: does the child go under its parent?
		P = mkp(8); I = img('full_o.png'); I.overlays += img('full_y.png', FLOAT_LAYER - 25); P.overlays += I
		// x10: blue (-1) with nested yellow (-1), then green sibling at FLOAT_LAYER-25.
		P = mkp(10); I = img('full_o.png'); I.overlays += img('full_y.png'); P.overlays += I; P.overlays += img('full_q.png', FLOAT_LAYER - 25)
		// x12: cryo shape: image made, then pixel_y 22 and dir set; nested yellow dot; then a green dot sibling at pixel_x 16.
		P = mkp(12); I = image('dot_o.png', ""); I.overlays += img('dot_y.png', px = 8); I.dir = SOUTH; I.pixel_y = 16; P.overlays += I; P.overlays += img('dot_q.png', px = 16, py = 16)
		// row 7: overlay dir vs owner dir. dir4.dmi "d": S yellow, N blue, E green, W red.
		P = new(locate(2,7,1)); P.dir = NORTH; P.overlays += image('dir4.dmi', "d", dir = SOUTH)
		P = new(locate(4,7,1)); P.dir = EAST; P.overlays += image('dir4.dmi', "d", dir = SOUTH)
		P = new(locate(6,7,1)); P.dir = NORTH; P.overlays += image('dir4.dmi', "d", dir = EAST)
		P = new(locate(8,7,1)); P.dir = EAST; var/mutable_appearance/M = new; M.icon = 'dir4.dmi'; M.icon_state = "d"; P.overlays += M
		P = new(locate(10,7,1)); P.dir = EAST; I = image('dir4.dmi', "d"); I.dir = SOUTH; P.overlays += I
		P = new(locate(12,7,1)); P.dir = EAST; P.overlays += image('dir4.dmi', null, "d", FLOAT_LAYER, SOUTH)
		P = new(locate(14,7,1)); P.overlays += image('dir4.dmi', "d", dir = SOUTH); P.dir = EAST
		// x3: image(dir = SOUTH)'s look copied to a new image, then used as an overlay: kept (yellow) or follows (green)?
		P = new(locate(3,7,1)); P.dir = EAST; var/image/C1 = image('dir4.dmi', "d", dir = SOUTH); var/image/C2 = new; C2.appearance = C1.appearance; P.overlays += C2
		// x5: an obj of a type with dir = SOUTH explicitly set in code? (dir var default) used as overlay
		P = new(locate(5,7,1)); P.dir = EAST; var/image/C3 = new('dir4.dmi'); C3.icon_state = "d"; P.overlays += C3
		var/obj/p/Z = new; Z.overlays += image('dir4.dmi', "d", dir = SOUTH); var/z1 = Z.overlays[1]
		var/obj/p/Z2 = new; Z2.overlays += image('dir4.dmi', "d"); var/z2 = Z2.overlays[1]
		var/image/Z3 = image('dir4.dmi', "d", dir = SOUTH); var/obj/p/Z4 = new; Z4.appearance = Z3
		var/image/Z5 = image('dir4.dmi', "d", dir = SOUTH); var/image/Z6 = new; Z6.appearance = Z5.appearance; var/obj/p/Z7 = new; Z7.overlays += Z6; var/z7 = Z7.overlays[1]
		world.log << "T ovdir dirarg=[z1:dir] plain=[z2:dir] copy=[Z4.dir] z7=[z7:dir]"
		// image() argument checks
		I = image('dot_o.png', "s", dir = 4)
		world.log << "T dirarg dir=[I.dir] layer=[I.layer] state=[I.icon_state]"
		I = image('dot_o.png', null, "s", 5, 8)
		world.log << "T positional dir=[I.dir] layer=[I.layer]"
		I = image('dot_o.png', "s", 5, 8)
		world.log << "T shifted dir=[I.dir] layer=[I.layer]"
		I = image('dot_o.png', "s", layer = 6)
		world.log << "T layerarg dir=[I.dir] layer=[I.layer]"
		I = image('dot_o.png', icon_state = "s", dir = 4, pixel_y = 3)
		world.log << "T named dir=[I.dir] layer=[I.layer] py=[I.pixel_y] state=[I.icon_state]"
		world.log << "READY [world.time]"
