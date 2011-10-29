DZ.fetcher.addSource({
  tag: "assigned2me",
  query: {
    email1: DZ.conf.email,
    email1_type: "equals_any",
    email1_assigned_to: "1"
}});

/*
DZ.fetcher.addSource({
  tag: "highlighter",
  blocking: 663830
});
*/

DZ.fetcher.addSource({
  tag: "devtools",
  query: {
    component: "Developer Tools",
    priority: "P1"
}});
