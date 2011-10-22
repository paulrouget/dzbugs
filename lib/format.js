// http://upload.wikimedia.org/wikipedia/commons/9/95/Xterm_color_chart.png
// One item: {selector: "" or value: "" or getter: "", color: "076"},
exports.formater = {
  start: function(bug) {
    var b = bug.src.bz.data;
    var str = "[" + fw(b.id, 6, " ", true) + "] ";
    str += fw(b.status, 10) + " ";
    str += b.summary;
    return str;
  },
  end: function (bug) {
    var b = bug.src.bz.data;
    return " http://bugzil.la/" + b.id;
  }
}

var fw = function fixedWidth(str, max, /* optional */ c, /* optional */ start) {
  if (str.length > max) {
    return str.substr(0, max);
  } else {
    if (!c) c = " ";
    while (str.length < max) {
      if (start) {
        str = c + str;
      } else {
        str += c;
      }
    }
    return str;
  }
}


/* src.bz.data:

--- 
assigned_to: 
  name: Jan.Varga
  real_name: Jan Varga [:janv]
blocks: 
  - 467530
  - 568516
classification: Components
component: "DOM: Core & HTML"
creation_time: 2010-12-08T06:12:00Z
creator: 
  name: mike
  real_name: Michael(tm) Smith
depends_on: 
  - 295285
  - 676236
  - 692139
id: 617528
is_cc_accessible: 1
is_confirmed: 1
is_creator_accessible: 1
keywords: 
  - dev-doc-needed
  - html5
  - sec-review-needed
last_change_time: 2011-10-18T18:29:16Z
op_sys: All
platform: All
priority: --
product: Core
qa_contact: 
  name: general
ref: https://api-dev.bugzilla.mozilla.org/latest/bug/617528
severity: enhancement
status: ASSIGNED
summary: implement the HTML5 "context menu" feature (contextmenu attribute)
target_milestone: mozilla8
url: http://whatwg.org/html/#context-menus
version: Trunk
attachments: 
  - 
    attacher: 
      name: Jan.Varga
    bug_id: 617528
    bug_ref: https://api-dev.bugzilla.mozilla.org/latest/bug/617528
    content_type: text/plain
    creation_time: 2011-06-02T07:49:00Z
    description: patch for event dispatcher
    file_name: nc7.diff
    flags: 
      - 
        id: 448062
        name: review
        setter: 
          name: Olli.Pettay
        status: "-"
        type_id: 4
    id: 536833
    is_obsolete: 1
    is_patch: 1
    is_private: 0
    last_change_time: 2011-06-02T19:34:57Z
    ref: https://api-dev.bugzilla.mozilla.org/latest/attachment/536833
    size: 2074
  - 
    attacher: 
      name: Jan.Varga
    bug_id: 617528
    bug_ref: https://api-dev.bugzilla.mozilla.org/latest/bug/617528
    content_type: text/plain
    creation_time: 2011-06-02T19:34:00Z
    description: patch for event dispatcher v2
    file_name: nc9.diff
    flags: 
      - 
        id: 448154
        name: review
        setter: 
          name: Olli.Pettay
        status: +
        type_id: 4
    id: 536957
    is_obsolete: 1
    is_patch: 1
    is_private: 0
    last_change_time: 2011-06-14T18:47:38Z
    ref: https://api-dev.bugzilla.mozilla.org/latest/attachment/536957
    size: 2578
  - 
    attacher: 
      name: Jan.Varga
    bug_id: 617528
    bug_ref: https://api-dev.bugzilla.mozilla.org/latest/bug/617528
    content_type: text/plain
    creation_time: 2011-06-06T05:00:00Z
    description: test for event dispatcher
    file_name: test.diff
    id: 537498
    is_obsolete: 1
    is_patch: 1
    is_private: 0
    last_change_time: 2011-06-14T18:47:38Z
    ref: https://api-dev.bugzilla.mozilla.org/latest/attachment/537498
    size: 4372
  - 
    attacher: 
      name: Jan.Varga
    bug_id: 617528
    bug_ref: https://api-dev.bugzilla.mozilla.org/latest/bug/617528
    content_type: text/plain
    creation_time: 2011-06-08T21:12:00Z
    description: patch v1
    file_name: nc18.diff
    id: 538114
    is_obsolete: 1
    is_patch: 1
    is_private: 0
    last_change_time: 2011-06-12T20:58:20Z
    ref: https://api-dev.bugzilla.mozilla.org/latest/attachment/538114
    size: 115524
  - 
    attacher: 
      name: Jan.Varga
    bug_id: 617528
    bug_ref: https://api-dev.bugzilla.mozilla.org/latest/bug/617528
    content_type: text/plain
    creation_time: 2011-06-10T16:33:00Z
    description: browser/ part
    file_name: browser.diff
    id: 538539
    is_obsolete: 1
    is_patch: 1
    is_private: 0
    last_change_time: 2011-07-06T20:00:47Z
    ref: https://api-dev.bugzilla.mozilla.org/latest/attachment/538539
    size: 4351
  - 
    attacher: 
      name: Jan.Varga
    bug_id: 617528
    bug_ref: https://api-dev.bugzilla.mozilla.org/latest/bug/617528
    content_type: text/plain
    creation_time: 2011-06-12T20:58:00Z
    description: patch v2
    file_name: nc19.diff
    flags: 
      - 
        id: 449658
        name: review
        setter: 
          name: Olli.Pettay
        status: "-"
        type_id: 4
    id: 538778
    is_obsolete: 1
    is_patch: 1
    is_private: 0
    last_change_time: 2011-06-21T16:59:35Z
    ref: https://api-dev.bugzilla.mozilla.org/latest/attachment/538778
    size: 115676
  - 
    attacher: 
      name: Jan.Varga
    bug_id: 617528
    bug_ref: https://api-dev.bugzilla.mozilla.org/latest/bug/617528
    content_type: text/plain
    creation_time: 2011-06-14T18:47:00Z
    description: patch for event dispatcher v3 (ready to be pushed)
    file_name: nc20.diff
    flags: 
      - 
        id: 450161
        name: review
        setter: 
          name: mounir
        status: "-"
        type_id: 4
    id: 539268
    is_obsolete: 1
    is_patch: 1
    is_private: 0
    last_change_time: 2011-06-15T15:00:59Z
    ref: https://api-dev.bugzilla.mozilla.org/latest/attachment/539268
    size: 8946
  - 
    attacher: 
      name: Jan.Varga
    bug_id: 617528
    bug_ref: https://api-dev.bugzilla.mozilla.org/latest/bug/617528
    content_type: text/plain
    creation_time: 2011-06-15T15:00:00Z
    description: Part 1 - Dispatch shift right click (contextmenu event) only to chrome (ready to be pushed)
    file_name: bug617528-1
    flags: 
      - 
        id: 450951
        name: checkin
        setter: 
          name: mounir
        status: +
        type_id: 41
    id: 539521
    is_obsolete: 0
    is_patch: 1
    is_private: 0
    last_change_time: 2011-06-20T10:24:56Z
    ref: https://api-dev.bugzilla.mozilla.org/latest/attachment/539521
    size: 9273
  - 
    attacher: 
      name: Jan.Varga
    bug_id: 617528
    bug_ref: https://api-dev.bugzilla.mozilla.org/latest/bug/617528
    content_type: text/plain
    creation_time: 2011-06-21T16:59:00Z
    description: Part 2 - Add support for HTML5 Commands
    file_name: nc21
    flags: 
      - 
        id: 451237
        name: review
        setter: 
          name: mounir
        status: "-"
        type_id: 4
    id: 540787
    is_obsolete: 1
    is_patch: 1
    is_private: 0
    last_change_time: 2011-07-06T20:00:47Z
    ref: https://api-dev.bugzilla.mozilla.org/latest/attachment/540787
    size: 95522
  - 
    attacher: 
      name: Jan.Varga
    bug_id: 617528
    bug_ref: https://api-dev.bugzilla.mozilla.org/latest/bug/617528
    content_type: text/plain
    creation_time: 2011-07-06T20:00:00Z
    description: Part2 - Core implementation
    file_name: bug617528-2
    id: 544318
    is_obsolete: 1
    is_patch: 1
    is_private: 0
    last_change_time: 2011-07-08T09:43:26Z
    ref: https://api-dev.bugzilla.mozilla.org/latest/attachment/544318
    size: 102008
  - 
    attacher: 
      name: Jan.Varga
    bug_id: 617528
    bug_ref: https://api-dev.bugzilla.mozilla.org/latest/bug/617528
    content_type: text/plain
    creation_time: 2011-07-08T09:43:00Z
    description: Part 2 - Core implementation v2
    file_name: bug617528-2
    flags: 
      - 
        id: 454091
        name: review
        setter: 
          name: Olli.Pettay
        status: "-"
        type_id: 4
    id: 544758
    is_obsolete: 1
    is_patch: 1
    is_private: 0
    last_change_time: 2011-07-15T19:51:42Z
    ref: https://api-dev.bugzilla.mozilla.org/latest/attachment/544758
    size: 120137
  - 
    attacher: 
      name: Jan.Varga
    bug_id: 617528
    bug_ref: https://api-dev.bugzilla.mozilla.org/latest/bug/617528
    content_type: text/plain
    creation_time: 2011-07-15T19:51:00Z
    description: Part 2 - Core implementation v3
    file_name: bug617528-2
    flags: 
      - 
        id: 455550
        name: review
        setter: 
          name: dao
        status: "-"
        type_id: 4
    id: 546209
    is_obsolete: 1
    is_patch: 1
    is_private: 0
    last_change_time: 2011-07-20T13:47:59Z
    ref: https://api-dev.bugzilla.mozilla.org/latest/attachment/546209
    size: 120844
  - 
    attacher: 
      name: Jan.Varga
    bug_id: 617528
    bug_ref: https://api-dev.bugzilla.mozilla.org/latest/bug/617528
    content_type: text/plain
    creation_time: 2011-07-20T13:47:00Z
    description: Part 2 - Core implementation v4
    file_name: bug617528-2
    flags: 
      - 
        id: 455960
        name: review
        setter: 
          name: dao
        status: +
        type_id: 4
    id: 547069
    is_obsolete: 1
    is_patch: 1
    is_private: 0
    last_change_time: 2011-07-25T11:11:37Z
    ref: https://api-dev.bugzilla.mozilla.org/latest/attachment/547069
    size: 131264
  - 
    attacher: 
      name: Jan.Varga
    bug_id: 617528
    bug_ref: https://api-dev.bugzilla.mozilla.org/latest/bug/617528
    content_type: text/plain
    creation_time: 2011-07-25T11:11:00Z
    description: Part 2 - Core implementation v5
    file_name: bug617528-2
    id: 548145
    is_obsolete: 1
    is_patch: 1
    is_private: 0
    last_change_time: 2011-07-25T12:59:42Z
    ref: https://api-dev.bugzilla.mozilla.org/latest/attachment/548145
    size: 149445
  - 
    attacher: 
      name: Jan.Varga
    bug_id: 617528
    bug_ref: https://api-dev.bugzilla.mozilla.org/latest/bug/617528
    content_type: text/plain
    creation_time: 2011-07-25T12:59:00Z
    description: Part 2 - Core implementation v6
    file_name: bug617528-2
    id: 548159
    is_obsolete: 1
    is_patch: 1
    is_private: 0
    last_change_time: 2011-07-27T15:44:00Z
    ref: https://api-dev.bugzilla.mozilla.org/latest/attachment/548159
    size: 149182
  - 
    attacher: 
      name: Jan.Varga
    bug_id: 617528
    bug_ref: https://api-dev.bugzilla.mozilla.org/latest/bug/617528
    content_type: text/plain
    creation_time: 2011-07-25T14:16:00Z
    description: interdiff v4 - v5
    file_name: 2.diff
    id: 548177
    is_obsolete: 1
    is_patch: 1
    is_private: 0
    last_change_time: 2011-07-27T15:44:00Z
    ref: https://api-dev.bugzilla.mozilla.org/latest/attachment/548177
    size: 31977
  - 
    attacher: 
      name: Jan.Varga
    bug_id: 617528
    bug_ref: https://api-dev.bugzilla.mozilla.org/latest/bug/617528
    content_type: text/plain
    creation_time: 2011-07-25T14:17:00Z
    description: interdiff v5 - v6
    file_name: 3.diff
    id: 548178
    is_obsolete: 1
    is_patch: 1
    is_private: 0
    last_change_time: 2011-07-27T15:44:00Z
    ref: https://api-dev.bugzilla.mozilla.org/latest/attachment/548178
    size: 6584
  - 
    attacher: 
      name: Olli.Pettay
    bug_id: 617528
    bug_ref: https://api-dev.bugzilla.mozilla.org/latest/bug/617528
    content_type: text/plain
    creation_time: 2011-07-27T13:42:00Z
    description: comments
    file_name: varga-bug617528-2-v7.txt
    id: 548762
    is_obsolete: 0
    is_patch: 0
    is_private: 0
    last_change_time: 2011-07-27T13:42:02Z
    ref: https://api-dev.bugzilla.mozilla.org/latest/attachment/548762
    size: 5361
  - 
    attacher: 
      name: Jan.Varga
    bug_id: 617528
    bug_ref: https://api-dev.bugzilla.mozilla.org/latest/bug/617528
    content_type: text/plain
    creation_time: 2011-07-27T15:44:00Z
    description: Part 2 - Core implementation v7
    file_name: bug617528-2
    flags: 
      - 
        id: 457252
        name: review
        setter: 
          name: Olli.Pettay
        status: +
        type_id: 4
    id: 548799
    is_obsolete: 1
    is_patch: 1
    is_private: 0
    last_change_time: 2011-07-27T19:56:21Z
    ref: https://api-dev.bugzilla.mozilla.org/latest/attachment/548799
    size: 148227
  - 
    attacher: 
      name: Jan.Varga
    bug_id: 617528
    bug_ref: https://api-dev.bugzilla.mozilla.org/latest/bug/617528
    content_type: text/plain
    creation_time: 2011-07-27T19:56:00Z
    description: Part 2 - Core implementation v8
    file_name: bug617528-2
    flags: 
      - 
        id: 457307
        name: review
        setter: 
          name: Olli.Pettay
        status: +
        type_id: 4
    id: 548875
    is_obsolete: 1
    is_patch: 1
    is_private: 0
    last_change_time: 2011-08-08T13:08:06Z
    ref: https://api-dev.bugzilla.mozilla.org/latest/attachment/548875
    size: 149224
  - 
    attacher: 
      name: Jan.Varga
    bug_id: 617528
    bug_ref: https://api-dev.bugzilla.mozilla.org/latest/bug/617528
    content_type: text/plain
    creation_time: 2011-08-08T13:08:00Z
    description: Part 2 - Core implementation v9
    file_name: bug617528-2
    flags: 
      - 
        id: 459254
        name: review
        setter: 
          name: Olli.Pettay
        status: +
        type_id: 4
      - 
        id: 459571
        name: review
        setter: 
          name: enndeakin
        status: +
        type_id: 4
    id: 551436
    is_obsolete: 0
    is_patch: 1
    is_private: 0
    last_change_time: 2011-08-09T19:04:00Z
    ref: https://api-dev.bugzilla.mozilla.org/latest/attachment/551436
    size: 150891
  - 
    attacher: 
      name: Jan.Varga
    bug_id: 617528
    bug_ref: https://api-dev.bugzilla.mozilla.org/latest/bug/617528
    content_type: text/plain
    creation_time: 2011-08-08T13:09:00Z
    description: Changes between v8 and v9
    file_name: inter2.diff
    id: 551437
    is_obsolete: 0
    is_patch: 1
    is_private: 0
    last_change_time: 2011-08-08T13:09:06Z
    ref: https://api-dev.bugzilla.mozilla.org/latest/attachment/551437
    size: 87977
  - 
    attacher: 
      name: Jan.Varga
    bug_id: 617528
    bug_ref: https://api-dev.bugzilla.mozilla.org/latest/bug/617528
    content_type: text/plain
    creation_time: 2011-08-15T13:06:00Z
    description: A followup fix
    file_name: bug617528-followup
    flags: 
      - 
        id: 460495
        name: review
        setter: 
          name: enndeakin
        status: +
        type_id: 4
    id: 553157
    is_obsolete: 0
    is_patch: 1
    is_private: 0
    last_change_time: 2011-08-18T13:07:06Z
    ref: https://api-dev.bugzilla.mozilla.org/latest/attachment/553157
    size: 14642
  - 
    attacher: 
      name: Jan.Varga
    bug_id: 617528
    bug_ref: https://api-dev.bugzilla.mozilla.org/latest/bug/617528
    content_type: text/html
    creation_time: 2011-08-19T05:50:00Z
    description: updated demo
    file_name: test.html
    id: 554309
    is_obsolete: 0
    is_patch: 0
    is_private: 0
    last_change_time: 2011-08-19T05:50:41Z
    ref: https://api-dev.bugzilla.mozilla.org/latest/attachment/554309
    size: 1153

cc: 
  - 
    name: a2414578
  - 
    name: antoine.mechelynck
  - 
    name: asa
  - 
    name: asqueella
  - 
    name: blizzard
  - 
    name: bolterbugz
  - 
    name: briks.si
  - 
    name: bugzilla
  - 
    name: bugzilla
  - 
    name: cheilmann
  - 
    name: curtisk
  - 
    name: d-kalck
  - 
    name: daniel.nr01
  - 
    name: dao
  - 
    name: dewmigg
  - 
    name: dzbarsky
  - 
    name: ehsan
  - 
    name: enndeakin
  - 
    name: faulkner.steve
  - 
    name: fullmetaljacket.xp+bugmail
  - 
    name: gavin.sharp
  - 
    name: geekshadow
  - 
    name: grenavitar
  - 
    name: ian
  - 
    name: ipottinger
  - 
    name: Jan.Varga
  - 
    name: jonathan.protzenko
  - 
    name: jst
  - 
    name: kairo
  - 
    name: kangax
  - 
    name: khuey
  - 
    name: kohei.yoshino.bugs
  - 
    name: mano
  - 
    name: marco.zehe
  - 
    name: mark.finkle
  - 
    name: mathias
  - 
    name: matjk7
  - 
    name: mkmelin+mozilla
  - 
    name: mounir
  - 
    name: Ms2ger
  - 
    name: odormann
  - 
    name: Olli.Pettay
  - 
    name: p.franc
  - 
    name: paul
  - 
    name: pb-dsp_bugzilla
  - 
    name: robert
  - 
    name: soft
  - 
    name: sonny.piers
  - 
    name: stipek
  - 
    name: tnikkel
  - 
    name: tobmue
  - 
    name: webmaster
  - 
    name: xtc4uall
  - 
    name: yannbreliere
cf_blocking_191: ---
cf_blocking_192: ---
cf_blocking_20: ---
cf_blocking_fennec: ---
cf_blocking_seamonkey21: ---
cf_blocking_thunderbird30: ---
cf_blocking_thunderbird31: ---
cf_blocking_thunderbird32: ---
cf_blocking_thunderbird33: ---
cf_colo_site: ---
cf_office: ---
cf_status_191: ---
cf_status_192: ---
cf_status_20: ---
cf_status_firefox10: ---
cf_status_firefox5: ---
cf_status_firefox6: ---
cf_status_firefox7: ---
cf_status_firefox8: ---
cf_status_firefox9: ---
cf_status_seamonkey21: ---
cf_status_seamonkey22: ---
cf_status_seamonkey23: ---
cf_status_seamonkey24: ---
cf_status_seamonkey25: ---
cf_status_seamonkey26: ---
cf_status_seamonkey27: ---
cf_status_thunderbird10: ---
cf_status_thunderbird30: ---
cf_status_thunderbird31: ---
cf_status_thunderbird32: ---
cf_status_thunderbird33: ---
cf_status_thunderbird6: ---
cf_status_thunderbird7: ---
cf_status_thunderbird8: ---
cf_status_thunderbird9: ---
cf_tracking_firefox10: ---
cf_tracking_firefox5: ---
cf_tracking_firefox6: ---
cf_tracking_firefox7: ---
cf_tracking_firefox8: "-"
cf_tracking_firefox9: ---
cf_tracking_seamonkey22: ---
cf_tracking_seamonkey23: ---
cf_tracking_seamonkey24: ---
cf_tracking_seamonkey25: ---
cf_tracking_seamonkey26: ---
cf_tracking_seamonkey27: ---
cf_tracking_thunderbird10: ---
cf_tracking_thunderbird6: ---
cf_tracking_thunderbird7: ---
cf_tracking_thunderbird8: ---
cf_tracking_thunderbird9: ---

*/
