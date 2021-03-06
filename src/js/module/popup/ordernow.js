import {init as customSelect_Init} from '../../lib/custom-select-box';
import {init as emailInputFix_Init} from './email-input-fix';
import 'axios';
import Axios from 'axios';

let formCls          = 'form-ordernow';
let addFileBtnCls    = formCls + '__file-add';
let delFileBtnCls    = formCls + '__file-del';
let submitFileBtnCls = formCls + '__submit';
let inputFileCls     = formCls + '__file-input';
let fileNameFieldCls = formCls + '__file-name';
let fileNameFieldCls_modifier = fileNameFieldCls + '_chosen';
let fileNameFieldPlaceholderLike = "Загрузить файл";

export function init() {
   customSelect_Init({ preserveQuestionInList: false });  //custom select initialize
  
   emailInputFix_Init();

   choseFileButtonFix();
   delFileButtonFix();

   onInputFileChanged();
   onDelFileClicked();

   onSubmit();
}

function choseFileButtonFix() {
   let form = document.querySelector('.' + formCls);
   if (form) {
      let btn = form.querySelector('.' + addFileBtnCls);
      if (btn) {
         btn.addEventListener('click', evt => {
            evt.preventDefault();
            evt.stopPropagation();

            let btn = evt.target;
            if (btn.parentNode instanceof HTMLLabelElement) {
               btn.parentNode.click();
            }
         });
      }
   }
}

function delFileButtonFix() {
   //initial delBtn state - hidden
   setDelFileButtonVisibility(false);
}

function setDelFileButtonVisibility( visibility ) {
   let form = document.querySelector('.' + formCls);
   if (form) {
      let delBtn = form.querySelector('.' + delFileBtnCls);
      if( delBtn ) {
            setElementVisibility(delBtn, visibility);
      }
   }
}

function onDelFileClicked() {
   let form = document.querySelector('.' + formCls);
   if (form) {
      let delBtn = form.querySelector('.' + delFileBtnCls);
      if (delBtn) {

         delBtn.addEventListener('click', evt => {
            evt.preventDefault();
            evt.stopPropagation();

            let fileInput = form.querySelector('.' + inputFileCls);
            let fileNameField = form.querySelector('.' + fileNameFieldCls);
            if (fileInput && fileInput.files && fileInput.files.length) {
               //empty files list for input[type='file']
               fileInput.value = '';
               //empty fileName form field <p class="file-name-field-like"... >  File.txt  </p>
               if( fileNameField ) {
                  fileNameField.textContent = fileNameFieldPlaceholderLike;
                  fileNameField.classList.remove(fileNameFieldCls_modifier);
               }
               //hide del button
               setDelFileButtonVisibility(false);
            }
         });
      }
   }
}

function onInputFileChanged() {
   let form = document.querySelector('.' + formCls);
   if (form) {
      let inputFileElement = form.querySelector('.' + inputFileCls);
      if (inputFileElement) {
         inputFileElement.addEventListener('change', evt => {
            let inputFile = evt.target;
            let fileNameField = form.querySelector('.' + fileNameFieldCls);

            //change text from 'Please load file' to 'Filename.ext'
            if (fileNameField) {
               fileNameField.textContent = (inputFile.files && inputFile.files[0].name) ?
                  inputFile.files[0].name : fileNameFieldPlaceholderLike;
            }

            //change text style according to input value
            if (fileNameField) {
               if( inputFile.files && inputFile.files.length ) {
                  fileNameField.classList.add(fileNameFieldCls_modifier);
               } 
               else {
                  fileNameField.classList.remove(fileNameFieldCls_modifier)
               }
            }

            //if file is chosen => show 'del' button instead of 'add' button
            if (fileNameField && inputFile.files && inputFile.files.length) {
               setDelFileButtonVisibility(true);
            }
         });
      }
   }
}


/**
 * 
 * @param {HTMLElement} element 
 * @param {String} propName 
 * @param {any} propVal 
 */
function setElementProperty(element, propName, propVal) {
   if( propName )
      element.style['' + propName] = propVal;
}

function setElementVisibility(element, visibility = true) {
   let displayValue = visibility ? 'block' : 'none';
   setElementProperty(element, 'display', displayValue);
}


function onSubmit() {
   let form = document.querySelector('.' + formCls);
   if (form) {

      let submitBtn = form.querySelector('.' + submitFileBtnCls);
      if (submitBtn) {

         submitBtn.addEventListener('click', evt => {
            evt.preventDefault();
            evt.stopPropagation();
            

            let formData = new FormData();
            let imagefile = form.querySelector('.' + inputFileCls);
            formData.append('ordernow__file', imagefile.files[0])
          
            let data = {
              name: form.querySelector('#ordernow__name' ).value,
              mail: form.querySelector('#ordernow__email' ).value,
              occupation: form.querySelector('#ordernow__occupation' ).value,
              agree: form.querySelector('#ordernow__law152' ).value,
              ultimateAnswer: 42
            }

            formData.append('data', JSON.stringify(data));
          
            Axios.post('/ordernow', formData)
            .then(function (response) {
              alert(response);
              //etc...
            })
            .catch(function (error) {
              alert(error);
            })

         });
      }
   }   
}