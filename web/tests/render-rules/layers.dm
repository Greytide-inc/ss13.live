// Test world for web/tests/render-rules/run.sh layers: how BYOND 511 sorts FLOAT_LAYER
// overlays/underlays against other objs on the same tile. Cases are tiles (x = 2,4,..14) in rows y=9,7,5,3.
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
	icon = 'sq_p.png'
	layer = 3
/obj/q
	icon = 'sq_q.png'
	layer = 3
proc/img(icon, layer)
	return image(icon = icon, layer = layer)
// one case: P (layer 3) with the given overlays/underlays, plus a Q obj at qlayer (before = created first)
proc/mk(x, y, qlayer, list/over = null, list/under = null, before = FALSE)
	var/obj/q/Q
	if(before)
		Q = new(locate(x,y,1)); Q.layer = qlayer
	var/obj/p/P = new(locate(x,y,1))
	if(over) P.overlays += over
	if(under) P.underlays += under
	if(!before)
		Q = new(locate(x,y,1)); Q.layer = qlayer
world/New()
	..()
	spawn(1)
		// row 9: floating overlay (blue) vs Q at various layers
		mk(2, 9, 3, list(img('sq_o.png', FLOAT_LAYER)))
		mk(4, 9, 3, list(img('sq_o.png', FLOAT_LAYER)), before = TRUE)
		mk(6, 9, 3.01, list(img('sq_o.png', FLOAT_LAYER)))
		mk(8, 9, 3.5, list(img('sq_o.png', FLOAT_LAYER)))
		mk(10, 9, 4, list(img('sq_o.png', FLOAT_LAYER)))
		mk(12, 9, 2.99, list(img('sq_o.png', FLOAT_LAYER)))
		// row 7: overlay with an explicit layer vs Q at 4
		mk(2, 7, 4, list(img('sq_o.png', 3.5)))
		mk(4, 7, 4, list(img('sq_o.png', 4.5)))
		mk(6, 7, 4, list(img('sq_o.png', 4)))
		mk(8, 7, 4, list(img('sq_o.png', 4)), before = TRUE)
		mk(10, 7, 3, list(img('sq_o.png', 2.5)))
		// row 5: underlay (blue) vs Q at various layers (floating layer, then explicit)
		mk(2, 5, 2.99, null, list(img('sq_o.png', FLOAT_LAYER)))
		mk(4, 5, 2.5, null, list(img('sq_o.png', FLOAT_LAYER)))
		mk(6, 5, 3, null, list(img('sq_o.png', FLOAT_LAYER)), before = TRUE)
		mk(8, 5, 2.5, null, list(img('sq_o.png', 2.9)))
		mk(10, 5, 3.5, null, list(img('sq_o.png', 3.6)))
		// row 3: two floating overlays (blue, yellow) in both list orders, and with -2 / -1 layers
		var/obj/p/P
		P = new(locate(2,3,1)); P.overlays += img('sq_o.png', FLOAT_LAYER); P.overlays += img('sq_y.png', FLOAT_LAYER)
		P = new(locate(4,3,1)); P.overlays += img('sq_y.png', FLOAT_LAYER); P.overlays += img('sq_o.png', FLOAT_LAYER)
		P = new(locate(6,3,1)); P.overlays += img('sq_o.png', FLOAT_LAYER); P.overlays += img('sq_y.png', FLOAT_LAYER - 1)
		P = new(locate(8,3,1)); P.overlays += img('sq_y.png', FLOAT_LAYER - 1); P.overlays += img('sq_o.png', FLOAT_LAYER)
		P = new(locate(10,3,1)); P.overlays += img('sq_o.png', FLOAT_LAYER); P.underlays += img('sq_y.png', FLOAT_LAYER)
		world.log << "READY [world.time]"
