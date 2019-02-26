let formCls = 'form-ordernow';
let addFileBtnCls = formCls + '__file-add';
let delFileBtnCls = formCls + '__file-del';
let inputFileCls =  formCls + '__file-input';
let fileNameFieldCls = formCls + '__file-name';
let fileNameFieldCls_modifier = fileNameFieldCls + '_chosen';
let fileNameFieldPlaceholderLike = "Загрузить файл";

export function init() {
   choseFileButtonFix();
   delFileButtonFix();

   onInputFileChanged();
   onDelFileClicked();
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
