import { init as lory_with_dots_Init } from './module/slider/lory-nav-items';
import { onTextChanged } from './lib/text-formatting';
import { init as customSelect_Init} from './lib/custom-select-box';
import { init as ordernowFormFixes_Init} from './module/ordernow';
import { popuppify } from './lib/popuppify';




document.addEventListener('DOMContentLoaded', () => {
   
   //initialize slider
   const slider = document.querySelector('.js_slider');
   lory_with_dots_Init();


   //prettify prices
   onTextChanged(document.querySelectorAll('.lory-item__price'));
   document.querySelectorAll('.lory-item__price').forEach(e => { let tmp = e.innerHTML; e.innerHTML = tmp; });

   //popup
   ordernowFormFixes_Init();

   popuppify( document.body );
});