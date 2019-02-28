import { lory } from 'lory.js';
import {} from '../../lib/inject-css';

export function init() {
   let loryInstance;
   let slider            = document.querySelector('.js_slider');
   let slide_count       = slider.querySelectorAll('.js_slide').length;
   let dot_container     = slider.querySelector('.js_dots');
   let dot_list_item     = document.createElement('li');


   //fix: prepare dot_container - remove all child nodes if exists
   if (dot_container.childNodes.length) {
     Array.from(dot_container.childNodes).forEach( childNode => childNode.remove() );
   }

   function handleDotEvent(e) {
       if (e.type === 'before.lory.init') {
         for (let i = 0, len = slide_count; i < len; i++) {
           let clone = dot_list_item.cloneNode();
            clone.classList.add('js_dot');
           dot_container.appendChild(clone);
         }
         dot_container.childNodes[0].classList.add('js_dot__active');
       }
       if (e.type === 'after.lory.init') {
         for (let i = 0, len = slide_count; i < len; i++) {
           dot_container.childNodes[i].addEventListener('click', function(e) {
            loryInstance.slideTo(Array.prototype.indexOf.call(dot_container.childNodes, e.target));
           });
         }
       }
       if (e.type === 'after.lory.slide') {
         for (let i = 0, len = dot_container.childNodes.length; i < len; i++) {
           dot_container.childNodes[i].classList.remove('js_dot__active');
         }
         dot_container.childNodes[e.detail.currentSlide].classList.add('js_dot__active');
       }
       if (e.type === 'on.lory.resize') {
           for (let i = 0, len = dot_container.childNodes.length; i < len; i++) {
               dot_container.childNodes[i].classList.remove('js_dot__active');
           }
           dot_container.childNodes[0].classList.add('js_dot__active');
       }
   }
   slider.addEventListener('before.lory.init', handleDotEvent);
   slider.addEventListener('after.lory.init', handleDotEvent);
   slider.addEventListener('after.lory.slide', handleDotEvent);
   slider.addEventListener('on.lory.resize', handleDotEvent);

  loryInstance = lory(slider, {
    rewind: true,
    slidesToScroll: 3,
    slideSpeed: 1000,
    ease: 'cubic-bezier(0.455, 0.03, 0.515, 0.955)',
    enableMouseEvents: true
  });

  setTimeout( () => { loryInstance.prev(); } , 100 );
}
