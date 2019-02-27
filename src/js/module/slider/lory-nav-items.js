import { lory } from 'lory.js';

export function init() {
   var loryInstance;
   var slider            = document.querySelector('.js_slider');
   var slide_count       = slider.querySelectorAll('.js_slide').length;
   var dot_container     = slider.querySelector('.js_dots');
   var dot_list_item     = document.createElement('li');

   function handleDotEvent(e) {
       if (e.type === 'before.lory.init') {
         for (var i = 0, len = slide_count; i < len; i++) {
           var clone = dot_list_item.cloneNode();
           dot_container.appendChild(clone);
         }
         dot_container.childNodes[0].classList.add('active');
       }
       if (e.type === 'after.lory.init') {
         for (var i = 0, len = slide_count; i < len; i++) {
           dot_container.childNodes[i].addEventListener('click', function(e) {
            loryInstance.slideTo(Array.prototype.indexOf.call(dot_container.childNodes, e.target));
           });
         }
       }
       if (e.type === 'after.lory.slide') {
         for (var i = 0, len = dot_container.childNodes.length; i < len; i++) {
           dot_container.childNodes[i].classList.remove('active');
         }
         dot_container.childNodes[e.detail.currentSlide - 1].classList.add('active');
       }
       if (e.type === 'on.lory.resize') {
           for (var i = 0, len = dot_container.childNodes.length; i < len; i++) {
               dot_container.childNodes[i].classList.remove('active');
           }
           dot_container.childNodes[0].classList.add('active');
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
}
