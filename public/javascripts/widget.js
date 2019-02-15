(function () {
	/**
	 * Main script for generation widget
	 */
	const initSCW = function () {
		const rootElement = document.getElementById('sitechecker-widget-root');
		if (!rootElement) {
			setTimeout(function () {
				throw new Error('Can not find sitechecker widget root element');
			});
			return;
		}
		const host = rootElement.dataset.host;

		const isOpenInIframe = !!+rootElement.dataset.iframe;

		/**
		 * Dynamically connect widget stylesheets
		 */
		(function () {
			const scwStylesId = 'scw-styles';
			const fcss = document.getElementsByTagName('link')[0];
			if (document.getElementById(scwStylesId)) return;
			let css = document.createElement('link');
			css.id = scwStylesId;
			css.href = host + '/stylesheets/widget-styles.css'; // TODO, add url
			css.rel = 'stylesheet';
			css.type = 'text/css';
			fcss.parentNode.insertBefore(css, fcss);
		}());

		const widgetColor = rootElement.dataset.color;
		const userId = rootElement.dataset.userId;

		/**
		 * Returns widget wrapper element
		 */
		const createWrapper = function () {
			const _logoSVG = document.createElement('img');
			_logoSVG.src = host + '/images/widget-logo.svg'; // TODO, add url
			const _logo = document.createElement('p');
			_logo.classList.add('scw__logo');
			_logo.appendChild(_logoSVG);
			const _el = document.createElement('div');
			_el.classList.add('scw');
			_el.style.backgroundColor = widgetColor;
			_el.appendChild(_logo);

			return _el;
		};

		/**
		 * Returns widget form element
		 */
		const createForm = function () {
			const _wrapperEl = document.createElement('div');
			_wrapperEl.classList.add('scw__input-wrapper');

			const _input = document.createElement('input');
			_input.classList.add('scw__input');
			_input.placeholder = 'Enter URL for analysis';
			_input.size = 30;
			_input.pattern = 'https?://.*';
			_input.required = true;

			const _form = document.createElement('form');
			_form.classList.add('scw__form');
			_form.addEventListener('submit', function (e) {
				e.preventDefault();
				if (isOpenInIframe) return checkUrlInIframe(_input.value);

				const a = document.createElement('a');
				a.href = 'https://sitechecker.pro/seo-report/' + encodeURIComponent(_input.value);
				a.target = '_blank';
				a.style.position = 'absolute';
				a.style.left = '-9999px';
				document.querySelector('body').appendChild(a);
				a.click();
			});

			const _btnText = document.createElement('SPAN');
			_btnText.textContent = 'Check';
			const _arrowRight = document.createElement('img');
			_arrowRight.src = host + '/images/arrow-right.svg'; // TODO, add url
			const _btn = document.createElement('button');
			_btn.type = 'submit';
			_btn.classList.add('scw__submit-btn');
			_btn.appendChild(_btnText);
			_btn.appendChild(_arrowRight);

			_form.appendChild(_input);
			_form.appendChild(_btn);
			_wrapperEl.appendChild(_form);

			return _wrapperEl;
		};

		function createPreloader() {
			const _wrap = document.createElement('div');
			_wrap.classList.add('scw__preloader');
			_wrap.style.display = 'none';

			const _el = document.createElement('div');
			_el.classList.add('scw__preloader-ring');

			new Array(3)
				.fill(document.createElement('div'))
				.forEach(el => _el.appendChild(el));
			_wrap.appendChild(_el);

			return _wrap;
		}

		const formWrapper = createWrapper();
		const form = createForm();
		const preloader = createPreloader();

		formWrapper.appendChild(form);
		rootElement.appendChild(formWrapper);
		rootElement.appendChild(preloader);

		function checkUrlInIframe(url) {
			preloader.style.display = 'block';
			const _iframe = document.createElement('iframe');
			Object.assign(_iframe, {
				width: '100%',
				height: '100%',
				frameborder: '0',
				allowfullscreen: true,
				name: 'iframe_sitechecker',
				src: 'https://test.sitechecker.pro/seo-report/' + url,
			});
			Object.assign(_iframe.style, {
				border: 'none',
				overflow: 'hidden',
				height: '100%',
				width: '100%',
				maxHeight: '80vh',
			});

			_iframe.addEventListener('load', function () {
				preloader.style.display = 'none';
			});

			rootElement.appendChild(_iframe);
			formWrapper.remove();
		}
	};

	const idDOMReady = document.readyState === 'complete'
		|| document.readyState === 'loaded'
		|| document.readyState === 'interactive';

	if (idDOMReady) {
		initSCW();
	} else {
		document.addEventListener('DOMContentLoaded', function (event) {
			initSCW();
		});
	}
}());