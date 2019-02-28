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