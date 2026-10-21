// screen_dup.dm - what do += twice / -= once / |= do to client.screen in BYOND?
/mob/Login()
	..()
	spawn(10)
		var/obj/O = new /obj/thing
		var/obj/P = new /obj/thing
		var/list/L = list(O, P)
		client.screen += O
		client.screen += O
		world.log << "T plus-plus n=[client.screen.len]"
		client.screen -= O
		world.log << "T after one minus n=[client.screen.len]"
		client.screen -= O
		world.log << "T after two minus n=[client.screen.len]"
		client.screen |= L
		client.screen |= L
		world.log << "T or-or n=[client.screen.len]"
		client.screen -= L
		world.log << "T minus list n=[client.screen.len]"
		client.screen += O
		client.screen += O
		client.screen += P
		client.screen -= L
		world.log << "T dup then minus list n=[client.screen.len]"
		client.screen.Cut()
		client.screen += O
		client.screen += P
		client.screen += O
		client.screen -= O
		world.log << "T O P O minus O n=[client.screen.len] first=[client.screen.len ? (client.screen[1] == O ? "O" : "P") : "-"]"
		world.log << "DONE"
/obj/thing
	name = "thing"
