const formCls = 'form-ordernow';
const decorativeBtnCls = 'btn-circle-purple';
const inputFileCls = 'form-ordernow__file-input';
const fileNameFieldCls = 'form-ordernow__file-name';

export function init() {
   decorativeButtonFix();
   onInputFileChanged();
}

function decorativeButtonFix() {
   let form = document.querySelector('.' + formCls);
   if (form) {
      let btn = form.querySelector('.' + decorativeBtnCls);
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

function onInputFileChanged() {
   let form = document.querySelector('.' + formCls);
   if (form) {
      let inputFile = form.querySelector('.' + inputFileCls);
      if (inputFile) {
         inputFile.addEventListener('change', evt => {
            let inputFile = evt.target;
            let fileNameField = form.querySelector('.' + fileNameFieldCls);

            if (fileNameField) {
               fileNameField.textContent = (inputFile.files && inputFile.files[0].name) ?
                  inputFile.files[0].name : "Загрузить файл";
            }
         });
      }
   }
}
