(function () {
	function wpWidgetPageLogic() {
		const host = location.origin;
		const newLine = '\n';
		const currentUserId = 321456; // TODO, need get ID from page
		const widgetCodeEl = document.querySelector('.widget-code__text');
		let widgetCodeStr = '<!-- sitechecker on page audit widget -->' + newLine +
			'<script>' + newLine +
			'  (function(d, s, id) {' + newLine +
			'    var js, fjs = d.getElementsByTagName(s)[0];' + newLine +
			'    if(d.getElementById(id)) return;' + newLine +
			'    js = d.createElement(s); js.id = id; ' + newLine +
			'    js.src = "' + host + '/javascripts/widget.js";' + newLine + // TODO, add url
			'    fjs.parentNode.insertBefore(js, fjs);' + newLine +
			'  }(document, "script", "sitechecker-jssdk"));' + newLine +
			'</script>' + newLine +
			'<div id="sitechecker-widget-root" data-user-id="' + currentUserId + '" data-color="rgb(0, 102, 255)" data-host="' + host + '"></div>' + newLine +
			'<!-- /sitechecker on page audit widget -->';

		/**
		 * Set Current Actual Widget Code To DOM Element as text
		 */
		const setWidgetCodeInDOM = function () {
			widgetCodeEl.innerHTML = widgetCodeStr
				.replace(/^\s\s/mgi, '&ensp;')
				.replace(/^\s\s\s\s/mgi, '&emsp;')
				.replace(/\</mgi, '&lt;')
				.replace(/\>/mgi, '&gt;');
		};

		/**
		 * Show widget code to user on page
		 */
		setWidgetCodeInDOM();

		/**
		 * Update widget code after color changed
		 *
		 * @param color
		 */
		const setColorOfWidget = function (color) {
			widgetCodeStr = widgetCodeStr.replace(/data-color="(.+?)"/mgi, 'data-color="' + color + '"');
			setWidgetCodeInDOM();
		};

		/**
		 * Add listener to set widget color by user change
		 */
		Utils.getElementsArrayByClass('select-color__tile')
			.forEach(function (el) {
				el.addEventListener('click', function (e) {
					const color = Utils.getComputedStyle(el, 'background-color');

					document
						.getElementById('sitechecker-widget-root')
						.dataset.color = color;

					Utils.getElementsArrayByClass('scw')
						.forEach(function (elem) {
							elem.style.backgroundColor = color;
						});

					setColorOfWidget(color);
				});
			});

		/**
		 * Add listener to copy widget code on copy button
		 */
		document
			.querySelector('.widget-code__btn')
			.addEventListener('click', function (e) {
				Utils.copyToClipboard(widgetCodeStr);
			});

	}

	const Utils = (function () {

		/**
		 * Get elements by classname and return Array of them
		 *
		 * @param {string} className
		 */
		const _getElementsArrayByClass = function (className) {
			try {
				const elements = Array.from(document.getElementsByClassName(className));
				return elements.length ? elements : [];
			} catch (err) {
				return [];
			}
		};
		/**
		 * Get element computed style
		 *
		 * @param {HTMLElement} element
		 * @param {string} styleName
		 * @return string
		 */
		const _getComputedStyle = function (element, styleName) {
			try {
				return window.getComputedStyle(element, null).getPropertyValue(styleName);
			} catch (err) {
				console.warn('Can not get computed styles!', err);
			}
		};

		/**
		 *  @param {string} str - string for copying
		 */
		const _copyToClipboard = function (str) {
			const el = document.createElement('textarea');
			el.setAttribute('readonly', '');
			el.style.position = 'absolute';
			el.style.left = '-9999px';
			el.value = str;

			document.body.appendChild(el);
			el.select();
			document.execCommand('copy');
			document.body.removeChild(el);
		};

		return Object.freeze({
			getElementsArrayByClass: _getElementsArrayByClass,
			getComputedStyle: _getComputedStyle,
			copyToClipboard: _copyToClipboard,
		});
	}());

	/**
	 * Main
	 */
	document.addEventListener('DOMContentLoaded', function (event) {
		wpWidgetPageLogic();
	});
}());