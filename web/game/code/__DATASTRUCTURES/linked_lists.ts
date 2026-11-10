// Based on /tg/station's code/__DATASTRUCTURES/linked_lists.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(4, "/datum/linked_list", "/datum", {
	head: null,
	tail: null,
	node_amt: 0,
});

// linked_lists.dm:18
rt.def("/datum/linked_list/proc/IsEmpty", function IsEmpty(f: Frame) {
	f.dot = (this.node_amt <= 0 ? 1 : 0);
	return f.dot;
});

// linked_lists.dm:26
rt.def("/datum/linked_list/proc/Add", function Add(f: Frame, node: Value, position: Value) {
	let adding: Value = null, location: Value = null, at: Value = null;
	if (rt.istype(node, T("/datum/linked_node"))) {
		adding = node;
	} else {
		rt.setFv(f, "value", (adding = new_(T("/datum/linked_node"))), node);
	}
	if (!adding.linked_list || adding.linked_list && adding.linked_list != this) {
		this.node_amt++;
	}
	adding.linked_list = this;
	if (position && position < this.node_amt) {
		if (position == 1) {
			if (this.head) {
				this.head.previous_node = adding;
				adding.next_node = this.head;
			}
			this.head = adding;
		} else {
			location = 0;
			while (location != position && location <= this.node_amt) {
				if (at) {
					if (at.next_node) {
						at = at.next_node;
					} else {
						break;
					}
				} else {
					at = this.head;
				}
				location++;
			}
			if (at && at.previous_node) {
				at.previous_node.next_node = adding;
				adding.previous_node = at.previous_node;
				at.previous_node = adding;
				adding.next_node = at;
			}
		}
		return f.dot;
	}
	if (this.tail) {
		this.tail.next_node = adding;
		adding.previous_node = this.tail;
		if (!this.tail.previous_node) {
			this.head = this.tail;
		}
	}
	this.tail = adding;
	return f.dot;
});

// linked_lists.dm:81
rt.def("/datum/linked_list/proc/Remove", function Remove(f: Frame, node: Value) {
	let removing: Value = null, location: Value = null, current_value: Value = null, at: Value = null;
	if (rt.istype(node, T("/datum/linked_node"))) {
		removing = node;
	} else if (removing == this.head) {
		removing = this.head;
	} else if (removing == this.tail) {
		removing = this.tail;
	} else {
		location = 1;
		while (current_value != node && location <= this.node_amt) {
			if (at) {
				if (at.next_node) {
					at = at.next_node;
				}
			} else {
				at = this.head;
			}
			location++;
			if (at) {
				if ((current_value = rt.fv(f, "value", at)) == node) {
					removing = at;
					break;
				}
			}
		}
	}
	if (removing) {
		if (removing.previous_node) {
			if (removing == this.tail) {
				this.tail = removing.previous_node;
			}
			if (removing.next_node) {
				if (removing == this.head) {
					this.head = removing.next_node;
				}
				removing.next_node.previous_node = removing.previous_node;
				removing.previous_node.next_node = removing.next_node;
			} else {
				removing.previous_node.next_node = null;
			}
		} else if (removing.next_node) {
			if (removing == this.head) {
				this.head = removing.next_node;
			}
			removing.next_node.previous_node = null;
		}
		if (removing == this.head) {
			this.head = null;
		}
		if (removing == this.tail) {
			this.tail = null;
		}
		removing.next_node = null;
		removing.previous_node = null;
		if (removing.linked_list == this) {
			this.node_amt--;
		}
		removing.linked_list = null;
		return removing;
	}
	return 0;
});

// linked_lists.dm:151
rt.def("/datum/linked_list/proc/Empty", function* Empty(f: Frame) {
	let next: Value = null;
	let n: Value = this.head;
	while (n) {
		next = n.next_node;
		yield* this.Remove(n);
		yield* qdel(n);
		n = next;
	}
	this.node_amt = 0;
	return f.dot;
}, true);
