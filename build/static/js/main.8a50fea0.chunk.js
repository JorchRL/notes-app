(this.webpackJsonpstatefulcomponent=this.webpackJsonpstatefulcomponent||[]).push([[0],{41:function(t,n,e){},42:function(t,n,e){"use strict";e.r(n);var c=e(2),r=e(17),o=e.n(r),a=e(8),i=e(3),u=e(0),s=function(t){var n=t.note,e=t.toggleImportance,c=n.important?"make not important":"make important";return Object(u.jsxs)("li",{className:"note",children:[n.content,Object(u.jsx)("button",{onClick:e,children:c})]})},j=function(t){var n=t.message;return null===n?null:Object(u.jsx)("div",{className:"error",children:n})},l=function(){return Object(u.jsxs)("div",{style:{fontSize:16},children:[Object(u.jsx)("br",{}),Object(u.jsx)("p",{children:"Note app. c. 2021 :3"})]})},b=e(6),d=e.n(b),f="/api/notes",h=function(){return d.a.get(f).then((function(t){return t.data}))},O=function(t){return d.a.post(f,t).then((function(t){return t.data}))},m=function(t,n){return d.a.put("".concat(f,"/").concat(t),n).then((function(t){return t.data}))},p=(e(41),function(){var t=Object(c.useState)([]),n=Object(i.a)(t,2),e=n[0],r=n[1],o=Object(c.useState)(""),b=Object(i.a)(o,2),d=b[0],f=b[1],p=Object(c.useState)(!1),x=Object(i.a)(p,2),v=x[0],g=x[1],S=Object(c.useState)(null),k=Object(i.a)(S,2),w=k[0],N=k[1];Object(c.useEffect)((function(){h().then((function(t){r(t)}))}),[]);var y=v?e:e.filter((function(t){return t.important}));return Object(u.jsxs)("div",{children:[Object(u.jsx)("h1",{children:"Notes"}),Object(u.jsx)(j,{message:w}),Object(u.jsx)("div",{children:Object(u.jsxs)("button",{onClick:function(){return g(!v)},children:["show ",v?"important":"all"]})}),Object(u.jsx)("ul",{children:y.map((function(t,n){return Object(u.jsx)(s,{note:t,toggleImportance:function(){return function(t){var n=e.find((function(n){return n.id===t})),c=Object(a.a)(Object(a.a)({},n),{},{important:!n.important});m(t,c).then((function(n){r(e.map((function(e){return e.id===t?n:e})))})).catch((function(c){N("The note '".concat(n.content,"' was already removed from server!")),setTimeout((function(){N(null)}),5e3),r(e.filter((function(n){return n.id!==t})))}))}(t.id)}},t.id)}))}),Object(u.jsx)("hr",{}),Object(u.jsxs)("form",{onSubmit:function(t){t.preventDefault();var n={content:d,date:(new Date).toISOString(),important:Math.random()<.5};O(n).then((function(t){r(e.concat(t)),f("")})),t.target[0].value=""},children:[Object(u.jsx)("input",{onChange:function(t){f(t.target.value)},placeholder:"Add a new note here..."}),Object(u.jsx)("button",{type:"submit",disabled:d.length<=0,children:"Add Note"})]}),Object(u.jsx)(l,{})]})});o.a.render(Object(u.jsx)(p,{}),document.getElementById("root"))}},[[42,1,2]]]);
//# sourceMappingURL=main.8a50fea0.chunk.js.map