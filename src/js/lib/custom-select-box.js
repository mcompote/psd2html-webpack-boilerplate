// source: https://www.w3schools.com/howto/howto_custom_select.asp

export function init(options) {

   let rootContainerCls = 'custom-select';
   let selectedItemCls = rootContainerCls + '__' + 'selected';
   let selectedItemClsActive = selectedItemCls + '_' + 'active';
   let optionsContainerCls = rootContainerCls + '__' + 'items';
   let optionsContainerCls_hide = optionsContainerCls + '_' + 'hide';
   let optionCls = rootContainerCls + '__' + 'item';
   let optionQuestionCls = optionCls + '_' + 'question';
   let optionAsSelectedCls = optionCls + '_' + 'same-as-selected';

   let preserveQuestionInList = true; //dont show question in list of options

   if (options) {
      if (options.rootContainerClassName) {
         rootContainerCls = options.rootContainerClassName
      }

      if(options.hasOwnProperty('preserveQuestionInList') ) {
         preserveQuestionInList = options.preserveQuestionInList;
      }
   }

   /* Look for any elements with the class "custom-select": */
   let customSelectArray = document.getElementsByClassName(rootContainerCls);

   Array.from(customSelectArray).forEach(customSelect => {

      let originalSelectElement = customSelect.getElementsByTagName("select")[0];
      if (!(originalSelectElement && originalSelectElement instanceof HTMLSelectElement))
         return;

      /* create a new DIV that will act as the currently selected item: */
      //common practice - place question for user's choice in in first option (node No: 0)
      let selectedDiv = document.createElement("div");
      selectedDiv.setAttribute("class", selectedItemCls);
      selectedDiv.innerHTML = originalSelectElement.options[originalSelectElement.selectedIndex].innerHTML;
      customSelect.appendChild(selectedDiv);

      /* For each element, create a new DIV that will contain the option list: */
      let optionsContainerDiv = document.createElement("div");
      optionsContainerDiv.setAttribute("class", `${optionsContainerCls} ${optionsContainerCls_hide}`);

      for (let j = 0; j < originalSelectElement.length; j++) {
         /* For each option in the original select element,
         create a new DIV that will act as an option item: */
         let optionDiv = document.createElement("div");
         optionDiv.setAttribute("class", `${optionCls}`);

         if (j == 0) {
            optionDiv.classList.add(optionQuestionCls);
            optionDiv.style.display = 'none';
         }

         optionDiv.innerHTML = originalSelectElement.options[j].innerHTML;

         optionDiv.addEventListener("click", function (e) {
            /* When an item is clicked, update the original select box,
            and the selected item: */

            for (let i = 0; i < originalSelectElement.length; i++) {
               if (originalSelectElement.options[i].innerHTML == this.innerHTML) {
                  originalSelectElement.selectedIndex = i;
                  selectedDiv.innerHTML = this.innerHTML;

                  let sameAsSelected = this.parentNode.getElementsByClassName(optionAsSelectedCls);
                  Array.from(sameAsSelected).forEach(asSelected => {
                     asSelected.classList.remove(optionAsSelectedCls);
                  });

                  this.classList.add(optionAsSelectedCls);

                  //if "question" <option> is chosen by click - hide this "question" <option> in rolling list next time
                  if( preserveQuestionInList ) {
                     this
                        .parentNode
                        .getElementsByClassName(optionQuestionCls)[0]
                        .style
                        .display = (this.classList.contains(optionQuestionCls)) ? 'none' : 'block';
                  }

                  break;
               }
            }
            selectedDiv.click();
         });
         optionsContainerDiv.appendChild(optionDiv);
      }
      customSelect.appendChild(optionsContainerDiv);

      selectedDiv.addEventListener("click", function (e) {
         /* When the select box is clicked, close any other select boxes,
         and open/close the current select box: */
         e.stopPropagation();
         closeAllOtherCustomSelects(this);
         this.nextSibling.classList.toggle(optionsContainerCls_hide);
         this.classList.toggle(selectedItemClsActive);
      });
   });

   function closeAllOtherCustomSelects(element) {
      /* A function that will close all select boxes in the document,
      except the current select box: */
      let allOptionsContainers = document.getElementsByClassName(optionsContainerCls);
      let allSelectedItems = document.getElementsByClassName(selectedItemCls);

      if (allSelectedItems && allSelectedItems.length) {
         Array.from(allSelectedItems).forEach(selectedItm => {
            if (selectedItm != element) {
               selectedItm.classList.remove(selectedItemClsActive);

               selectedItm
                  .parentNode
                  .getElementsByClassName(optionsContainerCls)[0]
                  .classList
                  .add(optionsContainerCls_hide);
            }
         });
      }
   }

   /* If the user clicks anywhere outside the select box,
   then close all select boxes: */
   document.addEventListener('click', closeAllOtherCustomSelects);
}