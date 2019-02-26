import $ from 'jquery';
import { lory } from 'lory.js';
import './module/cat';
import { onTextChanged } from './lib/text-formatting';
import { init as customSelect_Init} from './lib/custom-select-box';
import { init as ordernowFormFixes__Init} from './module/ordernow';
import { popuppify } from './lib/popuppify';


window.$ = $;
window.jQuery = $;




document.addEventListener('DOMContentLoaded', () => {
   const slider = document.querySelector('.js_slider');

   //initialize slider
   lory(slider, {
      rewind: true,
      slidesToScroll: 3,
      slideSpeed: 1000,
      ease: 'cubic-bezier(0.455, 0.03, 0.515, 0.955)',
   });

   //prettify prices
   onTextChanged(document.querySelectorAll('.lory-item__price'));
   document.querySelectorAll('.lory-item__price').forEach(e => { let tmp = e.innerHTML; e.innerHTML = tmp; });

   //popup custom select
   customSelect_Init( { preserveQuestionInList: false } );
   ordernowFormFixes__Init();

   popuppify( document.body, { hidingClassName: 'hui'} );
});