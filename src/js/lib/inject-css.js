/**
 * 
 * @param {String} styles - css-valid classes
 */
export function addStylesToDocument(styles) {
   let style = document.createElement('style');
   style.type = 'text/css';
   style.innerHTML = styles;
   document.getElementsByTagName('head')[0].appendChild(style);
}



/**
 * 
 * @param {String} hideCls - name of the hiding class, i.e. "none" --> .none {display: none; !important}
 */
export function addHidingClassToDocument(hideCls) {
   let css = `.${hideCls} {display: none !important; }`;
   addStylesToDocument( css );
}

// source: https://stackoverflow.com/questions/5296622/how-can-i-grab-all-css-styles-of-an-element
export function dumpCSSText(element) {
   var s = '';
   var o = getComputedStyle(element);
   for (var i = 0; i < o.length; i++) {
      s += o[i] + ':' + o.getPropertyValue(o[i]) + ';';
   }
   return s;
}