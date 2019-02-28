import { init as lory_with_fixes_Init } from './module/slider';
import { init as ordernowFormFixes_Init} from './module/popup/ordernow';
import { popuppify } from './lib/popuppify';




document.addEventListener('DOMContentLoaded', () => {
   
   //initialize slider
   const slider = document.querySelector('.js_slider');
   lory_with_fixes_Init();


   //popup
   ordernowFormFixes_Init();
   popuppify( document.body );
});