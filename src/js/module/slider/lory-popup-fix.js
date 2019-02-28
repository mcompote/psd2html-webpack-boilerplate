import { dumpCSSText,addHidingClassToDocument } from '../../lib/inject-css';
import { getOffset } from '../../lib/get-offset';

const LORY_HIDING_CLS   = "js-lory-special-hide";
const LORY_INFO_CLS     = "lory-item__info";
const LORY_DESC_CLS     = "lory-item__desc";

addHidingClassToDocument(LORY_HIDING_CLS);
let overlayDiv = document.createElement('div');
overlayDiv.classList.add(LORY_HIDING_CLS);
document.body.appendChild(overlayDiv);

// workaround for cutted popups in lory.js slider
export function init() {
   Array.from(document.querySelectorAll('.' + LORY_INFO_CLS)).forEach(item => {

      item.addEventListener('mouseover', evt => {
         let target = evt.target;

         if (target && target.classList.contains(LORY_INFO_CLS)) {
            let descrBlk = target.parentElement.querySelector('.' + LORY_DESC_CLS);
            if (descrBlk) {
               let descrBlk_css  = dumpCSSText(descrBlk);
               let descrBlk_text = descrBlk.textContent;
               let descrBlk_rect = getOffset(descrBlk);

               overlayDiv.style = descrBlk_css;
               overlayDiv.textContent = descrBlk_text;

               overlayDiv.style.position     = "absolute";
               overlayDiv.style.left         = descrBlk_rect.left + 'px';
               overlayDiv.style.top          = descrBlk_rect.top  + 'px';
               overlayDiv.style.transform    = '';
               overlayDiv.style.margin       = '';
               overlayDiv.classList.remove(LORY_HIDING_CLS);
            }
         }
      });

      item.addEventListener('mouseout', evt => {
         let target = evt.target;

         if (target && target.classList.contains(LORY_INFO_CLS)) {
            let descrBlk = target.parentElement.querySelector('.' + LORY_DESC_CLS);
            if (descrBlk) {
               overlayDiv.classList.add(LORY_HIDING_CLS);
            }
         }
      });

   });
}