Object.entries||(Object.entries=function(t){console.log(t);for(var e=Object.keys(t),n=e.length,r=new Array(n);n--;)r[n]=[e[n],t[e[n]]];return r}),String.prototype.padStart||(String.prototype.padStart=function(t,e){return t>>=0,e=String(e||" "),this.length>t?String(this):((t-=this.length)>e.length&&(e+=e.repeat(t/e.length)),e.slice(0,t)+String(this))}),function(t){t.URLSearchParams=t.URLSearchParams||function(t){var e=this;e.searchString=t,e.get=function(t){var n=new RegExp("[?&]"+t+"=([^&#]*)").exec(e.searchString);return null==n?null:decodeURI(n[1])||0}}}(window),"NodeList"in window&&!NodeList.prototype.forEach&&(console.info("polyfill for IE11"),NodeList.prototype.forEach=function(t,e){e=e||window;for(var n=0;n<this.length;n++)t.call(e,this[n],n,this)}),"function"!=typeof Object.assign&&(Object.assign=function(t){"use strict";var e=arguments;if(null==t)throw new TypeError("Cannot convert undefined or null to object");t=Object(t);for(var n=1;n<arguments.length;n++){var r=e[n];if(null!=r)for(var o in r)Object.prototype.hasOwnProperty.call(r,o)&&(t[o]=r[o])}return t}),Object.entries||(Object.entries=function(t){return Object.keys(t).reduce(function(e,n){return e.push([n,t[n]]),e},[])}(function(t,e){"use strict";var n,r,o;!t.localStorage&&(n=e.body)&&n.addBehavior&&n.addBehavior("#default#userdata")&&(n.load(r="localStorage"),o=n.XMLDocument.documentElement.attributes,t.localStorage={length:o.length,key:function(t){return t>=this.length?null:o[t].name},getItem:function(t){return n.getAttribute(t)},setItem:function(t,e){n.setAttribute(t,e),n.save(r),this.length+=null===n.getAttribute(t)?1:0},removeItem:function(t){null!==n.getAttribute(t)&&(n.removeAttribute(t),n.save(r),this.length=Math.max(0,this.length-1))},clear:function(){for(;this.length;)n.removeAttribute(o[--this.length].name);n.save(r)}})})(this,this.document));