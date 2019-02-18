/**
 * @param {HTMLElement} sliderContainer 
 */
function sliderify(sliderContainer) {
   const SLIDER_CONTAINER_CLS_NAME = 'js-sliderify-slider';
   const SLIDER_CONTROL_CLS_NAME = 'js-sliderify-control';
   const SLIDER_SLIDE_CLS_NAME = 'js-sliderify-slide';
   const DOT = '.';
   const ACTIVE_STATE = '_active';

   // slider - div element (or section or whatever html5 div-like) 
   // with class .js-slider
   if (!(sliderContainer &&
      sliderContainer instanceof (HTMLElement) &&
      sliderContainer.classList.contains(SLIDER_CONTAINER_CLS_NAME)
   ))
      return;

   // slider has controls, when you click on them - slider changes active slide   
   const CONTROLS = sliderContainer.querySelectorAll(DOT + SLIDER_CONTROL_CLS_NAME);
   if (!CONTROLS.length)
      return;

   // slider should definitely have slides, otherwise nothing to show
   const SLIDES = sliderContainer.querySelectorAll(DOT + SLIDER_SLIDE_CLS_NAME);
   if (!SLIDES.length)
      return;

   // here goes all "magic"
   registerControlsHandlers(CONTROLS);

   /**
    * @param {NodeList} controls
    * @param {string}   evtName 
    */
   function registerControlsHandlers(controls, evtName = 'click') {
      Array.from(controls).forEach(control => {
         registerControlHandler(control, evtName);
      });
   }

   /**
    * @param {HTMLElement} control 
    * @param {string}      evtName
    */
   function registerControlHandler(control, evtName) {

      control.addEventListener(evtName, (evt) => {
         evt.preventDefault();

         let result = findRootClassPrefixForElement(control, sliderContainer);
         if (!result)
            return; //didn't find prefixed classes like slider-item or greetings-item or whatever-whatever

         let activeItem = result.element;
         if (activeItem.classList.contains(result.prefixedClass + ACTIVE_STATE))
            return;

         let controlContainersAndSlides = Array.from(sliderContainer.querySelectorAll(DOT + result.prefixedClass))
            .concat(...Array.from(SLIDES));
         removeActiveState(controlContainersAndSlides);

         activeItem.classList.add(result.prefixedClass + ACTIVE_STATE);

         let activeItemPosition = findElementSequenceNumber(activeItem, result.prefixedClass);
         let activeSlide = SLIDES.item(activeItemPosition);
         activeSlideClass = findRootClassPrefixForElement(activeSlide, sliderContainer).prefixedClass;
         activeSlide.classList.add(activeSlideClass + ACTIVE_STATE);
      });

   }

   /**
    * @param {HTMLElement} element 
    * @param {string} inactiveClassName 
    */
   function findElementSequenceNumber(element, inactiveClassName) {

      let array = Array.from(element.parentElement.querySelectorAll(DOT + inactiveClassName));
      for (let index = 0; index < array.length; index++) {
         if (element == array[index])
            return index;
      }

      return;
   }

   /**
    * @typedef  {Object} ObjectAndPrefix
    * @property {HTMLElement} element html element
    * @property {string} prefixedClass prefixed class found in one of element's classList values
    */
   /** 
    * @param {HTMLElement} element 
    * @param {HTMLElement} root 
    * @param {string}      delimiter 
    * @returns {ObjectAndPrefix} result
    */
   function findRootClassPrefixForElement(element, root, delimiter = '-') {
      let possiblePrefixes = Array.from(root.classList).filter(element => element != SLIDER_CONTAINER_CLS_NAME);
      let current = element;
      // usually goes first in classes list, i.e. use possiblePrefixes[0]
      do {
         let clsList = filterClassListByRegex(element.classList, possiblePrefixes[0] + delimiter)

         if (clsList.length) {
            return {
               element: element,
               prefixedClass: clsList[0]
            };
         }
         element = element.parentNode;
      }
      while (element != root);

      return null;
   }

   function removeActiveState(elements) {
      for (const element of elements) {
         let activeClasses = filterClassListByRegex(element.classList, ACTIVE_STATE);
         if (activeClasses.length) {
            for (const activeClass of activeClasses) {
               element.classList.remove(activeClass);
            }
         }
      }
   }

   /**
    * @param {DOMTokenList} clsList 
    * @param {string} regexString 
    * @returns {Array<string>} filtered classList
    */
   function filterClassListByRegex(clsList, regexString) {
      let regex = new RegExp(regexString);
      return Array.from(clsList).filter(cls => regex.test(cls));
   }

}