const reEmail =  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const POPUP_FORM_CLS = 'form-ordernow';
let   POPUP_EMAIL_INPUT_CLS = POPUP_FORM_CLS + '__email-input';
let   POPUP_EMAIL_INPUT_INVALID_CLS = POPUP_EMAIL_INPUT_CLS + '_invalid';

export function init() {
   let form = document.querySelector('.' + POPUP_FORM_CLS);
   if (form) {
      let emailInput = form.querySelector('.' + POPUP_EMAIL_INPUT_CLS);
      if (emailInput) {
         emailInput.addEventListener('blur', evt => {
            if( validateEmail(evt.target.value) ) {
               emailInput.classList.remove( POPUP_EMAIL_INPUT_INVALID_CLS );
            }
            else {
               emailInput.classList.add( POPUP_EMAIL_INPUT_INVALID_CLS );
            }
         });
      }
   }
}



function validateEmail(email) {       
   return reEmail.test(String(email).toLowerCase());
}