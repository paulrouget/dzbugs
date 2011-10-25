var sorters = {
  bugnumber: function(bug1, bug2) {
    if (bug1 < bug2)
      return -1;
    if (bug1 > bug2)
      return 1;
    return 0;
  },
  activity: function(bug1, bug2) {
    bug1 = DZ.store.$(bug1); bug2 = DZ.store.$(bug2);
    bug1 = bug1.src.bz.data; bug2 = bug2.src.bz.data;
    if (bug1.last_change_time < bug2.last_change_time)
      return -1;
    if (bug1.last_change_time > bug2.last_change_time)
      return 1;
    return 0;
  },
  priority: function(bug1, bug2) {
    bug1 = DZ.store.$(bug1); bug2 = DZ.store.$(bug2);
    bug1 = bug1.src.bz.data; bug2 = bug2.src.bz.data;
    if (bug1.priority == bug2.priority)
      return 0;
    if (bug1.priority == "--")
      return 1;
    if (bug2.priority == "--")
      return -1;
    return bug1.priority < bug2.priority ? -1 : 1;
  },
};

for (var i in sorters) {
  exports[i] = sorters[i];
}
