
// get element position relative to browser window (considering scroll values)
// source: https://stackoverflow.com/questions/442404/retrieve-the-position-x-y-of-an-html-element

export function getOffset(el) {
   const rect = el.getBoundingClientRect();
   return {
      left: rect.left + window.scrollX,
      top: rect.top + window.scrollY
   };
}