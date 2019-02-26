// // usage example:
// // popuppify(document.body, {
// //    animation: {
// //       fadeInClasses: ['animation-fade-in'],
// //       fadeOutClasses: ['animation-fade-out'],
// //       animationDuration: 0.1
// //    },
// //    memorizeFormInputsValues: true
// // });


/**
 * @param {HTMLElement} rootElement
 */
export function popuppify(rootElement = document.body, options = {}) {
   const POPUP_ROOT_CLS = 'js-popuppify-popup';
   const POPUP_OPEN_CLS = 'js-popuppify-open';
   const POPUP_CLOSE_CLS = 'js-popuppify-close';
   const POPUP_OVERLAY_CLS = 'js-popuppify-overlay';
   const POPUP_HIDE_CLS = 'js-popuppify-hide';
   const DOT = '.';

   if (!rootElement)
      return;


   //copy options to constant
   const POPUP_OPTIONS = options;

   let POPUP_HIDE = POPUP_HIDE_CLS;
   if (POPUP_OPTIONS) {
      if( POPUP_OPTIONS.hidingClassName )
         POPUP_HIDE = POPUP_OPTIONS.hidingClassName;
   } 

   //find overlay otherwise generate it
   const POPUP_OVERLAY = document.querySelector(DOT + POPUP_OVERLAY_CLS) || generateOverlay();

   //find all .popup containers inside root container
   let popups = rootElement.querySelectorAll(DOT + POPUP_ROOT_CLS);
   Array.from(popups).forEach(popup => registerPopupHandlers(popup));

   /**
    * @param {HTMLElement} popupRoot
    */
   function registerPopupHandlers(popupRoot) {
      if (!popupRoot)
         return;

      registerHidingCssClass();
      closePopupAndOverlay(popupRoot, POPUP_OVERLAY); //initial state - hidden
      registerOpenPopupHandlers(popupRoot);
      registerClosePopupHandlers(popupRoot);
      registerPopupFormsHandlers(popupRoot);
   }

   /**
    * @param {HTMLAnchorElementElement|HTMLButtonElement}  link
    * @param {HTMLElement}                                 popupRoot
    */
   function registerLinkHandler(link, popupRoot) {
      //element is not <a> or <button> - do nothing 
      if (!(link && (link instanceof HTMLAnchorElement || link instanceof HTMLButtonElement)))
         return;

      //if element's property '-data-js-popuppify-name' is empty we can't determine class name of desired popup to be opened
      if (!(link.dataset.jsPopuppifyName))
         return;

      link.addEventListener('click', evt => {
         evt.preventDefault();
         openPopupAndOverlay(popupRoot, POPUP_OVERLAY);
      });
   }

   function registerCloseButtonHandler(closeBtn) {
      let element = closeBtn;

      let parent = element;
      while (!parent.classList.contains(POPUP_ROOT_CLS))
         parent = parent.parentNode;

      closeBtn.addEventListener('click', evt => {
         closePopupAndOverlay(parent, POPUP_OVERLAY);
      });
   }

   function registerEscKeyboardEvent(popupRoot) {
      document.addEventListener('keydown', evt => {
         if (!popupRoot.classList.contains('none')) {
            let keycode = (typeof evt.keyCode != 'undefined' && evt.keyCode) ? evt.keyCode : evt.which;
            if (keycode === 27) {
               closePopupAndOverlay(popupRoot, POPUP_OVERLAY);
            };
         }
      });
   }

   function closePopupAndOverlay(popupRoot, overlay) {

      let delay = 200;

      if (popupRoot) {
         if (options && options.animation) {
            if (options.animation.fadeOutClasses)
               options.animation.fadeOutClasses.forEach(cls => popupRoot.classList.add(cls));

            if (POPUP_OPTIONS.animation.animationDuration)
               delay = POPUP_OPTIONS.animation.animationDuration * 1000;
         }

         setTimeout(() => {
            popupRoot.classList.add(POPUP_HIDE)
         }, delay);
      }

      if (overlay) {
         overlay.classList.add(POPUP_HIDE);
      }
   }

   function openPopupAndOverlay(popupRoot, overlay) {
      if (popupRoot)
         if (options && options.animation) {
            if( options.animation.fadeOutClasses )
               options.animation.fadeOutClasses.forEach(cls => popupRoot.classList.remove(cls));            
            if (options.animation.fadeInClasses)
               options.animation.fadeInClasses.forEach(cls => popupRoot.classList.add(cls));
         }

      popupRoot.classList.remove(POPUP_HIDE);

      if (overlay)
         overlay.classList.remove(POPUP_HIDE);
   }

   /**
    * @param {HTMLElement} popupRoot 
    */
   function registerClosePopupHandlers(popupRoot) {
      let closeButtons = popupRoot.querySelectorAll(DOT + POPUP_CLOSE_CLS);
      Array.from(closeButtons).forEach(closeBtn => registerCloseButtonHandler(closeBtn));

      registerEscKeyboardEvent(popupRoot);
   }

   /**
    * @param {HTMLElement} popupRoot 
    */
   function registerOpenPopupHandlers(popupRoot) {
      let dataAttr = popupRoot.dataset.jsPopuppifyName;
      if (dataAttr)
         Array.from(document.querySelectorAll(DOT + POPUP_OPEN_CLS))
            .filter(link => link.dataset.jsPopuppifyName == dataAttr)
            .forEach(link => registerLinkHandler(link, popupRoot));
   }

   /**
    * @param {HTMLElement} popupRoot 
    */
   function registerPopupFormsHandlers(popupRoot) {
      if (!(POPUP_OPTIONS && POPUP_OPTIONS.memorizeFormInputsValues))
         return;

      let forms = findForms(popupRoot);
      if (!forms.length)
         return;

      forms.forEach(form => {
         formMemorizeInputValuesInLocalStorage(form);
         addAttributesChangeObsever(popupRoot);
         changeOnSubmitBehaviour(form, popupRoot);
      });


      function changeOnSubmitBehaviour(form, popupRoot) {
         form.addEventListener('submit', evt => {
            evt.preventDefault();
            // fetch(form.action, {
            //    method: 'POST',
            //    headers: {
            //       'Accept': 'application/json',
            //       'Content-Type': 'application/json'
            //    },
            //    body: JSON.stringify({
            //       hello: 'AND',
            //       die: '111'
            //    })
            // })
            fetchStub()
               .then(response => {
                  console.log(response);
                  flushFormControlsAndLocalStorageValues(form);
               });
         });
      }

      /**
       * watch for class changes (popup closes and opens by adding/removing classes)
       */
      function addAttributesChangeObsever(popupRoot) {
         // create an observer instance
         let observer = new MutationObserver(function (mutations) {
            let mutationsArray = Array.from(mutations).filter(mutation =>
               mutation.type == 'attributes' &&
               mutation.attributeName == "class" &&
               !mutation.target.classList.contains('none') &&
               mutation.target.getBoundingClientRect().height == 0);

            //form opening moment catched
            if (!mutationsArray.length) {
               forms.forEach(form => restoreControlsValuesFromLocalStorage(form));
            }

         });

         // configuration of the observer:
         let config = {
            attributes: true,
            childList: false,
            characterData: false
         };

         // pass in the target node, as well as the observer options
         observer.observe(popupRoot, config);
      }

      /**
       * @param {HTMLFormElement} form 
       */
      function formMemorizeInputValuesInLocalStorage(form) {
         // no fallback to cookies
         if (!localStorage)
            return;

         let controls = searchInputControls(form);
         if (!controls.length)
            return;

         //prepare Utils
         if (!form.Utils)
            initializeIdsGenerator(form);

         controls.forEach(control => {
            checkGenerateId(control);
            control.addEventListener('change', evt => {
               localStorage.setItem(evt.target.id, evt.target.value);
            });
         });


         /**
          * @param {HTMLElement} control 
          */
         function checkGenerateId(control) {
            if (!control.id)
               control.id = form.Utils.text.getRandomStrStrict(20);
         }

         /**
          * initialize library and add it to root container
          */
         function initializeIdsGenerator(root) {
            var _data = {};
            _data.symbols = {};

            var module = {};

            module.text = {

               getRandomHex: function () {
                  return (Math.floor(Math.random() * 0x100000) % 0x10000).toString(16);
               },

               getRandomHexFixed: function () {
                  let _temp = this.getRandomHex();
                  let _zeros = 4 - _temp.length;

                  for (let i = 0; i < _zeros; i++)
                     _temp = "0" + _temp;

                  return _temp;
               },

               getUnicodeSymbol: function () {
                  return String.fromCharCode(this.getRandomHexFixed());
               },

               /**
                * @param {string} symb  - Symbol to check
                * @param {RegExp} regex - Symbol should satisfy the conditions in regex
                */
               satisfyRestrictions: function (symb, regex = /[a-zA-Z0-9_]/) {
                  return symb ? regex.test(symb) : false;
               },

               /**
                * @param {string} str        - String to check
                * @param {RegExpp[]} regexes - String should satisfy all the conditions listed in given Regexes array
                */
               satisfyRestrictionsStrict: function (
                  str,
                  regexes = [/[a-z]/, /[A-Z]/, /[0-9]/, /\_/]
               ) {
                  return regexes.reduce((prev, curr, inx) => {
                     return prev && curr.test(str);
                  }, true);
               },

               getUnicodeSymbolNoRepeats: function () {
                  let current;
                  do {
                     current = this.getUnicodeSymbol();
                  }
                  while (current == _data.symbols.last);
                  _data.symbols.last = current;
                  return current;
               },

               getUnicodeSymbolNoRepeatsFiltered: function (filterRegex) {
                  let current;
                  do {
                     current = this.getUnicodeSymbol();
                  }
                  while (!this.satisfyRestrictions(current, filterRegex) || current == _data.symbols.last);
                  _data.symbols.last = current;
                  return current;
               },

               getRandomStr: function (len) {
                  if (!len) return;
                  let result = [];

                  while (len--) {
                     result.push(this.getUnicodeSymbolNoRepeatsFiltered());
                  }

                  return result.join('');
               },

               getRandomStrStrict: function (len) {
                  if (!len) return;
                  let result = "";

                  do {
                     result = this.getRandomStr(len);
                  }
                  while (!this.satisfyRestrictionsStrict(result));

                  return result;
               },

               boldify: function (text) {
                  return '<b>' + text + '</b>';
               }
            };

            if (!root.Utils)
               root.Utils = module;
         }
      }

      /**
       * @param {HTMLFormElement} form 
       */
      function restoreControlsValuesFromLocalStorage(form) {
         // no fallback to cookies
         if (!localStorage)
            return;

         let controls = searchInputControls(form);
         if (!controls.length)
            return;

         controls.forEach(control => {
            control.value = localStorage.getItem(control.id);
         });
      }


      function flushFormControlsAndLocalStorageValues(form) {
         // no fallback to cookies
         if (!localStorage)
            return;

         let controls = searchInputControls(form);
         if (!controls.length)
            return;

         controls.forEach(control => {
            control.value = '';
            localStorage.setItem(control.id, control.value);
         });
      }

      /**
       * @param {HTMLFormElement} form 
       */
      function searchInputControls(form) {
         return Array.from(form.elements)
            .filter(element => !(element.attributes.type && element.attributes.type.nodeValue == 'submit'));
      }

      function getJsonDataFromInputControls(form) {
         let result;

         let controls = searchInputControls(form);
         if (!controls.length)
            return;

         controls.forEach(control => {
            //TODO: get json from controls
         });

      }
   }

   function generateOverlay() {
      let cssStyles = `.js-popuppify-generated-cls-overlay {
         display: block;
         width: 100%;
         height: 100%;
         position: fixed;
         top: 0;
         left: 0;
         z-index: 100;
         background: #1A032B;
         opacity: 0.9;
      }`;
      addStylesToDocument(cssStyles);
      let div = document.createElement('div');
      div.setAttribute('class', 'js-popuppify-generated-cls-overlay js-popuppify-overlay');
      document.body.appendChild(div);
      return div;
   }

   /**
    * @param {HTMLElement} rootElement 
    */
   function findForms(rootElement) {
      return Array.from(rootElement.querySelectorAll('form'));
   }


   function registerHidingCssClass() {
      if (POPUP_OPTIONS && POPUP_OPTIONS.hidingClassName) {
         addHidingClassToDocument(POPUP_OPTIONS.hidingClassName);
      }
      else { 
         addHidingClassToDocument(POPUP_HIDE); 
      }
   }
}



/**
 * 
 * @param {String} hideCls - name of the hiding class, i.e. "none" --> .none {display: none; !important}
 */
function addHidingClassToDocument(hideCls) {
   let css = `.${hideCls} {display: none !important; }`;
   addStylesToDocument( css );
}


/**
 * 
 * @param {String} styles - css-valid classes
 */
function addStylesToDocument(styles) {
   let style = document.createElement('style');
   style.type = 'text/css';
   style.innerHTML = styles;
   document.getElementsByTagName('head')[0].appendChild(style);
}