
// source: https://css-tricks.com/snippets/javascript/comma-values-in-numbers/
function commaFormatted(amount) {
	var delimiter = ","; // replace comma if desired
	var a = amount.split('.',2)
	var d = a[1];
	var i = parseInt(a[0]);
	if(isNaN(i)) { return ''; }
	var minus = '';
	if(i < 0) { minus = '-'; }
	i = Math.abs(i);
	var n = new String(i);
	var a = [];
	while(n.length > 3) {
		var nn = n.substr(n.length-3);
		a.unshift(nn);
		n = n.substr(0,n.length-3);
	}
	if(n.length > 0) { a.unshift(n); }
	n = a.join(delimiter);
	if(d.length < 1) { amount = n; }
	else { amount = n + '.' + d; }
	amount = minus + amount;
	return amount;
}

// source: https://css-tricks.com/snippets/javascript/format-currency/
function currencyFormatted(amount) {
	var i = parseFloat(amount);
	if(isNaN(i)) { i = 0.00; }
	var minus = '';
	if(i < 0) { minus = '-'; }
	i = Math.abs(i);
	i = parseInt((i + .005) * 100);
	i = i / 100;
	s = new String(i);
	if(s.indexOf('.') < 0) { s += '.00'; }
	if(s.indexOf('.') == (s.length - 2)) { s += '0'; }
	s = minus + s;
	return s;
}

// source: SO
// http://stackoverflow.com/questions/16835754/regex-reads-from-right-to-left
function separateNumberGroups(nStr, delim = ' ') {
	nStr += '';
	let x = nStr.split('.');
	let x1 = x[0];
	let x2 = x.length > 1 ? '.' + x[1] : '';
	let rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + delim + '$2');
	}
	return x1 + x2;
}


function mutationsHandler_ModifyText(mutationsList, action) {
	for (let mutation of mutationsList) {
		//source: https://caniuse.com/#feat=mutationobserver
		//quote: "When changing the innerHTML content of a node containing a single CharacterData node,  "
		//		   "resulting in a single-but-different CharacterData child node, WebKit browsers consider "
		//		   "this a characterData mutation of the child CharacterData node, while other browsers    "
		//			"consider it a childList mutation of the parent node.                                   "
		if (mutation.type === "childList" && mutation.addedNodes.length) {

			if (!(/\d+\s\d+/i.test(mutation.target.textContent))) {
				mutation.target.innerHTML = action(mutation.target.innerHTML);
			}
		}
	}
}

/**
 * 
 * @param {HTMLElement} element
 * @param {function} action 
 */
function registerMutationsHandler(targetNode, action) {
	// Options for the observer (which mutations to observe)
	let cfg = { characterData: true, childList: true };

	// Callback function to execute when mutations are observed
	let cb = (mutationsList) => mutationsHandler_ModifyText(mutationsList, action);

	// Create an observer instance linked to the callback function
	const _MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
	const observer = new _MutationObserver(cb);

	// Start observing the target node for configured mutations
	observer.observe(targetNode, cfg);
}

/**
 * 
 * @param {ArrayLike<HTMLElement>} elements 
 * @param {function} action 
 */
export function onTextChanged(elements, action = str => separateNumberGroups(str) ) {
	Array.from(elements).forEach(element => {
		registerMutationsHandler(element, action);
	});
}