/******/ var __webpack_modules__ = ({

/***/ "../../node_modules/govuk-frontend/dist/govuk/common/closest-attribute-value.mjs":
/*!***************************************************************************************!*\
  !*** ../../node_modules/govuk-frontend/dist/govuk/common/closest-attribute-value.mjs ***!
  \***************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   closestAttributeValue: () => (/* binding */ closestAttributeValue)
/* harmony export */ });
function closestAttributeValue($element, attributeName) {
  const $closestElementWithAttribute = $element.closest(`[${attributeName}]`);
  return $closestElementWithAttribute ? $closestElementWithAttribute.getAttribute(attributeName) : null;
}




/***/ }),

/***/ "../../node_modules/govuk-frontend/dist/govuk/common/configuration.mjs":
/*!*****************************************************************************!*\
  !*** ../../node_modules/govuk-frontend/dist/govuk/common/configuration.mjs ***!
  \*****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ConfigurableComponent: () => (/* binding */ ConfigurableComponent),
/* harmony export */   configOverride: () => (/* binding */ configOverride),
/* harmony export */   validateConfig: () => (/* binding */ validateConfig)
/* harmony export */ });
/* unused harmony exports extractConfigByNamespace, mergeConfigs, normaliseDataset, normaliseString */
/* harmony import */ var _component_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../component.mjs */ "../../node_modules/govuk-frontend/dist/govuk/component.mjs");
/* harmony import */ var _errors_index_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../errors/index.mjs */ "../../node_modules/govuk-frontend/dist/govuk/errors/index.mjs");
/* harmony import */ var _index_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index.mjs */ "../../node_modules/govuk-frontend/dist/govuk/common/index.mjs");




const configOverride = Symbol.for('configOverride');
class ConfigurableComponent extends _component_mjs__WEBPACK_IMPORTED_MODULE_0__.Component {
  [configOverride](param) {
    return {};
  }

  /**
   * Returns the root element of the component
   *
   * @protected
   * @returns {ConfigurationType} - the root element of component
   */
  get config() {
    return this._config;
  }
  constructor($root, config) {
    super($root);
    this._config = void 0;
    const childConstructor = this.constructor;
    if (!(0,_index_mjs__WEBPACK_IMPORTED_MODULE_1__.isObject)(childConstructor.defaults)) {
      throw new _errors_index_mjs__WEBPACK_IMPORTED_MODULE_2__.ConfigError((0,_index_mjs__WEBPACK_IMPORTED_MODULE_1__.formatErrorMessage)(childConstructor, 'Config passed as parameter into constructor but no defaults defined'));
    }
    const datasetConfig = normaliseDataset(childConstructor, this._$root.dataset);
    this._config = mergeConfigs(childConstructor.defaults, config != null ? config : {}, this[configOverride](datasetConfig), datasetConfig);
  }
}
function normaliseString(value, property) {
  const trimmedValue = value ? value.trim() : '';
  let output;
  let outputType = property == null ? void 0 : property.type;
  if (!outputType) {
    if (['true', 'false'].includes(trimmedValue)) {
      outputType = 'boolean';
    }
    if (trimmedValue.length > 0 && isFinite(Number(trimmedValue))) {
      outputType = 'number';
    }
  }
  switch (outputType) {
    case 'boolean':
      output = trimmedValue === 'true';
      break;
    case 'number':
      output = Number(trimmedValue);
      break;
    default:
      output = value;
  }
  return output;
}
function normaliseDataset(Component, dataset) {
  if (!(0,_index_mjs__WEBPACK_IMPORTED_MODULE_1__.isObject)(Component.schema)) {
    throw new _errors_index_mjs__WEBPACK_IMPORTED_MODULE_2__.ConfigError((0,_index_mjs__WEBPACK_IMPORTED_MODULE_1__.formatErrorMessage)(Component, 'Config passed as parameter into constructor but no schema defined'));
  }
  const out = {};
  const entries = Object.entries(Component.schema.properties);
  for (const entry of entries) {
    const [namespace, property] = entry;
    const field = namespace.toString();
    if (field in dataset) {
      out[field] = normaliseString(dataset[field], property);
    }
    if ((property == null ? void 0 : property.type) === 'object') {
      out[field] = extractConfigByNamespace(Component.schema, dataset, namespace);
    }
  }
  return out;
}
function mergeConfigs(...configObjects) {
  const formattedConfigObject = {};
  for (const configObject of configObjects) {
    for (const key of Object.keys(configObject)) {
      const option = formattedConfigObject[key];
      const override = configObject[key];
      if ((0,_index_mjs__WEBPACK_IMPORTED_MODULE_1__.isObject)(option) && (0,_index_mjs__WEBPACK_IMPORTED_MODULE_1__.isObject)(override)) {
        formattedConfigObject[key] = mergeConfigs(option, override);
      } else {
        formattedConfigObject[key] = override;
      }
    }
  }
  return formattedConfigObject;
}
function validateConfig(schema, config) {
  const validationErrors = [];
  for (const [name, conditions] of Object.entries(schema)) {
    const errors = [];
    if (Array.isArray(conditions)) {
      for (const {
        required,
        errorMessage
      } of conditions) {
        if (!required.every(key => !!config[key])) {
          errors.push(errorMessage);
        }
      }
      if (name === 'anyOf' && !(conditions.length - errors.length >= 1)) {
        validationErrors.push(...errors);
      }
    }
  }
  return validationErrors;
}
function extractConfigByNamespace(schema, dataset, namespace) {
  const property = schema.properties[namespace];
  if ((property == null ? void 0 : property.type) !== 'object') {
    return;
  }
  const newObject = {
    [namespace]: {}
  };
  for (const [key, value] of Object.entries(dataset)) {
    let current = newObject;
    const keyParts = key.split('.');
    for (const [index, name] of keyParts.entries()) {
      if ((0,_index_mjs__WEBPACK_IMPORTED_MODULE_1__.isObject)(current)) {
        if (index < keyParts.length - 1) {
          if (!(0,_index_mjs__WEBPACK_IMPORTED_MODULE_1__.isObject)(current[name])) {
            current[name] = {};
          }
          current = current[name];
        } else if (key !== namespace) {
          current[name] = normaliseString(value);
        }
      }
    }
  }
  return newObject[namespace];
}
/**
 * Schema for component config
 *
 * @template {Partial<Record<keyof ConfigurationType, unknown>>} ConfigurationType
 * @typedef {object} Schema
 * @property {Record<keyof ConfigurationType, SchemaProperty | undefined>} properties - Schema properties
 * @property {SchemaCondition<ConfigurationType>[]} [anyOf] - List of schema conditions
 */
/**
 * Schema property for component config
 *
 * @typedef {object} SchemaProperty
 * @property {'string' | 'boolean' | 'number' | 'object'} type - Property type
 */
/**
 * Schema condition for component config
 *
 * @template {Partial<Record<keyof ConfigurationType, unknown>>} ConfigurationType
 * @typedef {object} SchemaCondition
 * @property {(keyof ConfigurationType)[]} required - List of required config fields
 * @property {string} errorMessage - Error message when required config fields not provided
 */
/**
 * @template {Partial<Record<keyof ConfigurationType, unknown>>} [ConfigurationType=ObjectNested]
 * @typedef ChildClass
 * @property {string} moduleName - The module name that'll be looked for in the DOM when initialising the component
 * @property {Schema<ConfigurationType>} [schema] - The schema of the component configuration
 * @property {ConfigurationType} [defaults] - The default values of the configuration of the component
 */
/**
 * @template {Partial<Record<keyof ConfigurationType, unknown>>} [ConfigurationType=ObjectNested]
 * @typedef {typeof Component & ChildClass<ConfigurationType>} ChildClassConstructor<ConfigurationType>
 */




/***/ }),

/***/ "../../node_modules/govuk-frontend/dist/govuk/common/index.mjs":
/*!*********************************************************************!*\
  !*** ../../node_modules/govuk-frontend/dist/govuk/common/index.mjs ***!
  \*********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   formatErrorMessage: () => (/* binding */ formatErrorMessage),
/* harmony export */   getBreakpoint: () => (/* binding */ getBreakpoint),
/* harmony export */   getFragmentFromUrl: () => (/* binding */ getFragmentFromUrl),
/* harmony export */   isInitialised: () => (/* binding */ isInitialised),
/* harmony export */   isObject: () => (/* binding */ isObject),
/* harmony export */   isSupported: () => (/* binding */ isSupported),
/* harmony export */   setFocus: () => (/* binding */ setFocus)
/* harmony export */ });
function getFragmentFromUrl(url) {
  if (!url.includes('#')) {
    return undefined;
  }
  return url.split('#').pop();
}
function getBreakpoint(name) {
  const property = `--govuk-breakpoint-${name}`;
  const value = window.getComputedStyle(document.documentElement).getPropertyValue(property);
  return {
    property,
    value: value || undefined
  };
}
function setFocus($element, options = {}) {
  var _options$onBeforeFocu;
  const isFocusable = $element.getAttribute('tabindex');
  if (!isFocusable) {
    $element.setAttribute('tabindex', '-1');
  }
  function onFocus() {
    $element.addEventListener('blur', onBlur, {
      once: true
    });
  }
  function onBlur() {
    var _options$onBlur;
    (_options$onBlur = options.onBlur) == null || _options$onBlur.call($element);
    if (!isFocusable) {
      $element.removeAttribute('tabindex');
    }
  }
  $element.addEventListener('focus', onFocus, {
    once: true
  });
  (_options$onBeforeFocu = options.onBeforeFocus) == null || _options$onBeforeFocu.call($element);
  $element.focus();
}
function isInitialised($root, moduleName) {
  return $root instanceof HTMLElement && $root.hasAttribute(`data-${moduleName}-init`);
}

/**
 * Checks if GOV.UK Frontend is supported on this page
 *
 * Some browsers will load and run our JavaScript but GOV.UK Frontend
 * won't be supported.
 *
 * @param {HTMLElement | null} [$scope] - (internal) `<body>` HTML element checked for browser support
 * @returns {boolean} Whether GOV.UK Frontend is supported on this page
 */
function isSupported($scope = document.body) {
  if (!$scope) {
    return false;
  }
  return $scope.classList.contains('govuk-frontend-supported');
}
function isArray(option) {
  return Array.isArray(option);
}
function isObject(option) {
  return !!option && typeof option === 'object' && !isArray(option);
}
function formatErrorMessage(Component, message) {
  return `${Component.moduleName}: ${message}`;
}
/**
 * @typedef ComponentWithModuleName
 * @property {string} moduleName - Name of the component
 */
/**
 * @import { ObjectNested } from './configuration.mjs'
 */




/***/ }),

/***/ "../../node_modules/govuk-frontend/dist/govuk/component.mjs":
/*!******************************************************************!*\
  !*** ../../node_modules/govuk-frontend/dist/govuk/component.mjs ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Component: () => (/* binding */ Component)
/* harmony export */ });
/* harmony import */ var _common_index_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./common/index.mjs */ "../../node_modules/govuk-frontend/dist/govuk/common/index.mjs");
/* harmony import */ var _errors_index_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./errors/index.mjs */ "../../node_modules/govuk-frontend/dist/govuk/errors/index.mjs");



class Component {
  /**
   * Returns the root element of the component
   *
   * @protected
   * @returns {RootElementType} - the root element of component
   */
  get $root() {
    return this._$root;
  }
  constructor($root) {
    this._$root = void 0;
    const childConstructor = this.constructor;
    if (typeof childConstructor.moduleName !== 'string') {
      throw new _errors_index_mjs__WEBPACK_IMPORTED_MODULE_0__.InitError(`\`moduleName\` not defined in component`);
    }
    if (!($root instanceof childConstructor.elementType)) {
      throw new _errors_index_mjs__WEBPACK_IMPORTED_MODULE_0__.ElementError({
        element: $root,
        component: childConstructor,
        identifier: 'Root element (`$root`)',
        expectedType: childConstructor.elementType.name
      });
    } else {
      this._$root = $root;
    }
    childConstructor.checkSupport();
    this.checkInitialised();
    const moduleName = childConstructor.moduleName;
    this.$root.setAttribute(`data-${moduleName}-init`, '');
  }
  checkInitialised() {
    const constructor = this.constructor;
    const moduleName = constructor.moduleName;
    if (moduleName && (0,_common_index_mjs__WEBPACK_IMPORTED_MODULE_1__.isInitialised)(this.$root, moduleName)) {
      throw new _errors_index_mjs__WEBPACK_IMPORTED_MODULE_0__.InitError(constructor);
    }
  }
  static checkSupport() {
    if (!(0,_common_index_mjs__WEBPACK_IMPORTED_MODULE_1__.isSupported)()) {
      throw new _errors_index_mjs__WEBPACK_IMPORTED_MODULE_0__.SupportError();
    }
  }
}

/**
 * @typedef ChildClass
 * @property {string} moduleName - The module name that'll be looked for in the DOM when initialising the component
 */

/**
 * @typedef {typeof Component & ChildClass} ChildClassConstructor
 */
Component.elementType = HTMLElement;




/***/ }),

/***/ "../../node_modules/govuk-frontend/dist/govuk/components/accordion/accordion.mjs":
/*!***************************************************************************************!*\
  !*** ../../node_modules/govuk-frontend/dist/govuk/components/accordion/accordion.mjs ***!
  \***************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Accordion: () => (/* binding */ Accordion)
/* harmony export */ });
/* harmony import */ var _common_configuration_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/configuration.mjs */ "../../node_modules/govuk-frontend/dist/govuk/common/configuration.mjs");
/* harmony import */ var _errors_index_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../errors/index.mjs */ "../../node_modules/govuk-frontend/dist/govuk/errors/index.mjs");
/* harmony import */ var _i18n_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../i18n.mjs */ "../../node_modules/govuk-frontend/dist/govuk/i18n.mjs");




/**
 * Accordion component
 *
 * This allows a collection of sections to be collapsed by default, showing only
 * their headers. Sections can be expanded or collapsed individually by clicking
 * their headers. A "Show all sections" button is also added to the top of the
 * accordion, which switches to "Hide all sections" when all the sections are
 * expanded.
 *
 * The state of each section is saved to the DOM via the `aria-expanded`
 * attribute, which also provides accessibility.
 *
 * @preserve
 * @augments ConfigurableComponent<AccordionConfig>
 */
class Accordion extends _common_configuration_mjs__WEBPACK_IMPORTED_MODULE_0__.ConfigurableComponent {
  /**
   * @param {Element | null} $root - HTML element to use for accordion
   * @param {AccordionConfig} [config] - Accordion config
   */
  constructor($root, config = {}) {
    super($root, config);
    this.i18n = void 0;
    this.controlsClass = 'govuk-accordion__controls';
    this.showAllClass = 'govuk-accordion__show-all';
    this.showAllTextClass = 'govuk-accordion__show-all-text';
    this.sectionClass = 'govuk-accordion__section';
    this.sectionExpandedClass = 'govuk-accordion__section--expanded';
    this.sectionButtonClass = 'govuk-accordion__section-button';
    this.sectionHeaderClass = 'govuk-accordion__section-header';
    this.sectionHeadingClass = 'govuk-accordion__section-heading';
    this.sectionHeadingDividerClass = 'govuk-accordion__section-heading-divider';
    this.sectionHeadingTextClass = 'govuk-accordion__section-heading-text';
    this.sectionHeadingTextFocusClass = 'govuk-accordion__section-heading-text-focus';
    this.sectionShowHideToggleClass = 'govuk-accordion__section-toggle';
    this.sectionShowHideToggleFocusClass = 'govuk-accordion__section-toggle-focus';
    this.sectionShowHideTextClass = 'govuk-accordion__section-toggle-text';
    this.upChevronIconClass = 'govuk-accordion-nav__chevron';
    this.downChevronIconClass = 'govuk-accordion-nav__chevron--down';
    this.sectionSummaryClass = 'govuk-accordion__section-summary';
    this.sectionSummaryFocusClass = 'govuk-accordion__section-summary-focus';
    this.sectionContentClass = 'govuk-accordion__section-content';
    this.$sections = void 0;
    this.$showAllButton = null;
    this.$showAllIcon = null;
    this.$showAllText = null;
    this.i18n = new _i18n_mjs__WEBPACK_IMPORTED_MODULE_1__.I18n(this.config.i18n);
    const $sections = this.$root.querySelectorAll(`.${this.sectionClass}`);
    if (!$sections.length) {
      throw new _errors_index_mjs__WEBPACK_IMPORTED_MODULE_2__.ElementError({
        component: Accordion,
        identifier: `Sections (\`<div class="${this.sectionClass}">\`)`
      });
    }
    this.$sections = $sections;
    this.initControls();
    this.initSectionHeaders();
    this.updateShowAllButton(this.areAllSectionsOpen());
  }
  initControls() {
    this.$showAllButton = document.createElement('button');
    this.$showAllButton.setAttribute('type', 'button');
    this.$showAllButton.setAttribute('class', this.showAllClass);
    this.$showAllButton.setAttribute('aria-expanded', 'false');
    this.$showAllIcon = document.createElement('span');
    this.$showAllIcon.classList.add(this.upChevronIconClass);
    this.$showAllButton.appendChild(this.$showAllIcon);
    const $accordionControls = document.createElement('div');
    $accordionControls.setAttribute('class', this.controlsClass);
    $accordionControls.appendChild(this.$showAllButton);
    this.$root.insertBefore($accordionControls, this.$root.firstChild);
    this.$showAllText = document.createElement('span');
    this.$showAllText.classList.add(this.showAllTextClass);
    this.$showAllButton.appendChild(this.$showAllText);
    this.$showAllButton.addEventListener('click', () => this.onShowOrHideAllToggle());
    if ('onbeforematch' in document) {
      document.addEventListener('beforematch', event => this.onBeforeMatch(event));
    }
  }
  initSectionHeaders() {
    this.$sections.forEach(($section, i) => {
      const $header = $section.querySelector(`.${this.sectionHeaderClass}`);
      if (!$header) {
        throw new _errors_index_mjs__WEBPACK_IMPORTED_MODULE_2__.ElementError({
          component: Accordion,
          identifier: `Section headers (\`<div class="${this.sectionHeaderClass}">\`)`
        });
      }
      this.constructHeaderMarkup($header, i);
      this.setExpanded(this.isExpanded($section), $section);
      $header.addEventListener('click', () => this.onSectionToggle($section));
      this.setInitialState($section);
    });
  }
  constructHeaderMarkup($header, index) {
    const $span = $header.querySelector(`.${this.sectionButtonClass}`);
    const $heading = $header.querySelector(`.${this.sectionHeadingClass}`);
    const $summary = $header.querySelector(`.${this.sectionSummaryClass}`);
    if (!$heading) {
      throw new _errors_index_mjs__WEBPACK_IMPORTED_MODULE_2__.ElementError({
        component: Accordion,
        identifier: `Section heading (\`.${this.sectionHeadingClass}\`)`
      });
    }
    if (!$span) {
      throw new _errors_index_mjs__WEBPACK_IMPORTED_MODULE_2__.ElementError({
        component: Accordion,
        identifier: `Section button placeholder (\`<span class="${this.sectionButtonClass}">\`)`
      });
    }
    const $button = document.createElement('button');
    $button.setAttribute('type', 'button');
    $button.setAttribute('aria-controls', `${this.$root.id}-content-${index + 1}`);
    for (const attr of Array.from($span.attributes)) {
      if (attr.name !== 'id') {
        $button.setAttribute(attr.name, attr.value);
      }
    }
    const $headingText = document.createElement('span');
    $headingText.classList.add(this.sectionHeadingTextClass);
    $headingText.id = $span.id;
    const $headingTextFocus = document.createElement('span');
    $headingTextFocus.classList.add(this.sectionHeadingTextFocusClass);
    $headingText.appendChild($headingTextFocus);
    Array.from($span.childNodes).forEach($child => $headingTextFocus.appendChild($child));
    const $showHideToggle = document.createElement('span');
    $showHideToggle.classList.add(this.sectionShowHideToggleClass);
    $showHideToggle.setAttribute('data-nosnippet', '');
    const $showHideToggleFocus = document.createElement('span');
    $showHideToggleFocus.classList.add(this.sectionShowHideToggleFocusClass);
    $showHideToggle.appendChild($showHideToggleFocus);
    const $showHideText = document.createElement('span');
    const $showHideIcon = document.createElement('span');
    $showHideIcon.classList.add(this.upChevronIconClass);
    $showHideToggleFocus.appendChild($showHideIcon);
    $showHideText.classList.add(this.sectionShowHideTextClass);
    $showHideToggleFocus.appendChild($showHideText);
    $button.appendChild($headingText);
    $button.appendChild(this.getButtonPunctuationEl());
    if ($summary) {
      const $summarySpan = document.createElement('span');
      const $summarySpanFocus = document.createElement('span');
      $summarySpanFocus.classList.add(this.sectionSummaryFocusClass);
      $summarySpan.appendChild($summarySpanFocus);
      for (const attr of Array.from($summary.attributes)) {
        $summarySpan.setAttribute(attr.name, attr.value);
      }
      Array.from($summary.childNodes).forEach($child => $summarySpanFocus.appendChild($child));
      $summary.remove();
      $button.appendChild($summarySpan);
      $button.appendChild(this.getButtonPunctuationEl());
    }
    $button.appendChild($showHideToggle);
    $heading.removeChild($span);
    $heading.appendChild($button);
  }
  onBeforeMatch(event) {
    const $fragment = event.target;
    if (!($fragment instanceof Element)) {
      return;
    }
    const $section = $fragment.closest(`.${this.sectionClass}`);
    if ($section) {
      this.setExpanded(true, $section);
    }
  }
  onSectionToggle($section) {
    const nowExpanded = !this.isExpanded($section);
    this.setExpanded(nowExpanded, $section);
    this.storeState($section, nowExpanded);
  }
  onShowOrHideAllToggle() {
    const nowExpanded = !this.areAllSectionsOpen();
    this.$sections.forEach($section => {
      this.setExpanded(nowExpanded, $section);
      this.storeState($section, nowExpanded);
    });
    this.updateShowAllButton(nowExpanded);
  }
  setExpanded(expanded, $section) {
    const $showHideIcon = $section.querySelector(`.${this.upChevronIconClass}`);
    const $showHideText = $section.querySelector(`.${this.sectionShowHideTextClass}`);
    const $button = $section.querySelector(`.${this.sectionButtonClass}`);
    const $content = $section.querySelector(`.${this.sectionContentClass}`);
    if (!$content) {
      throw new _errors_index_mjs__WEBPACK_IMPORTED_MODULE_2__.ElementError({
        component: Accordion,
        identifier: `Section content (\`<div class="${this.sectionContentClass}">\`)`
      });
    }
    if (!$showHideIcon || !$showHideText || !$button) {
      return;
    }
    const newButtonText = expanded ? this.i18n.t('hideSection') : this.i18n.t('showSection');
    $showHideText.textContent = newButtonText;
    $button.setAttribute('aria-expanded', `${expanded}`);
    const ariaLabelParts = [];
    const $headingText = $section.querySelector(`.${this.sectionHeadingTextClass}`);
    if ($headingText) {
      ariaLabelParts.push(`${$headingText.textContent}`.trim());
    }
    const $summary = $section.querySelector(`.${this.sectionSummaryClass}`);
    if ($summary) {
      ariaLabelParts.push(`${$summary.textContent}`.trim());
    }
    const ariaLabelMessage = expanded ? this.i18n.t('hideSectionAriaLabel') : this.i18n.t('showSectionAriaLabel');
    ariaLabelParts.push(ariaLabelMessage);
    $button.setAttribute('aria-label', ariaLabelParts.join(' , '));
    if (expanded) {
      $content.removeAttribute('hidden');
      $section.classList.add(this.sectionExpandedClass);
      $showHideIcon.classList.remove(this.downChevronIconClass);
    } else {
      $content.setAttribute('hidden', 'until-found');
      $section.classList.remove(this.sectionExpandedClass);
      $showHideIcon.classList.add(this.downChevronIconClass);
    }
    this.updateShowAllButton(this.areAllSectionsOpen());
  }
  isExpanded($section) {
    return $section.classList.contains(this.sectionExpandedClass);
  }
  areAllSectionsOpen() {
    return Array.from(this.$sections).every($section => this.isExpanded($section));
  }
  updateShowAllButton(expanded) {
    if (!this.$showAllButton || !this.$showAllText || !this.$showAllIcon) {
      return;
    }
    this.$showAllButton.setAttribute('aria-expanded', expanded.toString());
    this.$showAllText.textContent = expanded ? this.i18n.t('hideAllSections') : this.i18n.t('showAllSections');
    this.$showAllIcon.classList.toggle(this.downChevronIconClass, !expanded);
  }

  /**
   * Get the identifier for a section
   *
   * We need a unique way of identifying each content in the Accordion.
   * Since an `#id` should be unique and an `id` is required for `aria-`
   * attributes `id` can be safely used.
   *
   * @param {Element} $section - Section element
   * @returns {string | undefined | null} Identifier for section
   */
  getIdentifier($section) {
    const $button = $section.querySelector(`.${this.sectionButtonClass}`);
    return $button == null ? void 0 : $button.getAttribute('aria-controls');
  }
  storeState($section, isExpanded) {
    if (!this.config.rememberExpanded) {
      return;
    }
    const id = this.getIdentifier($section);
    if (id) {
      try {
        window.sessionStorage.setItem(id, isExpanded.toString());
      } catch (exception) {}
    }
  }
  setInitialState($section) {
    if (!this.config.rememberExpanded) {
      return;
    }
    const id = this.getIdentifier($section);
    if (id) {
      try {
        const state = window.sessionStorage.getItem(id);
        if (state !== null) {
          this.setExpanded(state === 'true', $section);
        }
      } catch (exception) {}
    }
  }
  getButtonPunctuationEl() {
    const $punctuationEl = document.createElement('span');
    $punctuationEl.classList.add('govuk-visually-hidden', this.sectionHeadingDividerClass);
    $punctuationEl.textContent = ', ';
    return $punctuationEl;
  }
}

/**
 * Accordion config
 *
 * @see {@link Accordion.defaults}
 * @typedef {object} AccordionConfig
 * @property {AccordionTranslations} [i18n=Accordion.defaults.i18n] - Accordion translations
 * @property {boolean} [rememberExpanded] - Whether the expanded and collapsed
 *   state of each section is remembered and restored when navigating.
 */

/**
 * Accordion translations
 *
 * @see {@link Accordion.defaults.i18n}
 * @typedef {object} AccordionTranslations
 *
 * Messages used by the component for the labels of its buttons. This includes
 * the visible text shown on screen, and text to help assistive technology users
 * for the buttons toggling each section.
 * @property {string} [hideAllSections] - The text content for the 'Hide all
 *   sections' button, used when at least one section is expanded.
 * @property {string} [hideSection] - The text content for the 'Hide'
 *   button, used when a section is expanded.
 * @property {string} [hideSectionAriaLabel] - The text content appended to the
 *   'Hide' button's accessible name when a section is expanded.
 * @property {string} [showAllSections] - The text content for the 'Show all
 *   sections' button, used when all sections are collapsed.
 * @property {string} [showSection] - The text content for the 'Show'
 *   button, used when a section is collapsed.
 * @property {string} [showSectionAriaLabel] - The text content appended to the
 *   'Show' button's accessible name when a section is expanded.
 */

/**
 * @import { Schema } from '../../common/configuration.mjs'
 */
Accordion.moduleName = 'govuk-accordion';
Accordion.defaults = Object.freeze({
  i18n: {
    hideAllSections: 'Hide all sections',
    hideSection: 'Hide',
    hideSectionAriaLabel: 'Hide this section',
    showAllSections: 'Show all sections',
    showSection: 'Show',
    showSectionAriaLabel: 'Show this section'
  },
  rememberExpanded: true
});
Accordion.schema = Object.freeze({
  properties: {
    i18n: {
      type: 'object'
    },
    rememberExpanded: {
      type: 'boolean'
    }
  }
});




/***/ }),

/***/ "../../node_modules/govuk-frontend/dist/govuk/components/button/button.mjs":
/*!*********************************************************************************!*\
  !*** ../../node_modules/govuk-frontend/dist/govuk/components/button/button.mjs ***!
  \*********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Button: () => (/* binding */ Button)
/* harmony export */ });
/* harmony import */ var _common_configuration_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/configuration.mjs */ "../../node_modules/govuk-frontend/dist/govuk/common/configuration.mjs");


const DEBOUNCE_TIMEOUT_IN_SECONDS = 1;

/**
 * JavaScript enhancements for the Button component
 *
 * @preserve
 * @augments ConfigurableComponent<ButtonConfig>
 */
class Button extends _common_configuration_mjs__WEBPACK_IMPORTED_MODULE_0__.ConfigurableComponent {
  /**
   * @param {Element | null} $root - HTML element to use for button
   * @param {ButtonConfig} [config] - Button config
   */
  constructor($root, config = {}) {
    super($root, config);
    this.debounceFormSubmitTimer = null;
    this.$root.addEventListener('keydown', event => this.handleKeyDown(event));
    this.$root.addEventListener('click', event => this.debounce(event));
  }
  handleKeyDown(event) {
    const $target = event.target;
    if (event.key !== ' ') {
      return;
    }
    if ($target instanceof HTMLElement && $target.getAttribute('role') === 'button') {
      event.preventDefault();
      $target.click();
    }
  }
  debounce(event) {
    if (!this.config.preventDoubleClick) {
      return;
    }
    if (this.debounceFormSubmitTimer) {
      event.preventDefault();
      return false;
    }
    this.debounceFormSubmitTimer = window.setTimeout(() => {
      this.debounceFormSubmitTimer = null;
    }, DEBOUNCE_TIMEOUT_IN_SECONDS * 1000);
  }
}

/**
 * Button config
 *
 * @typedef {object} ButtonConfig
 * @property {boolean} [preventDoubleClick=false] - Prevent accidental double
 *   clicks on submit buttons from submitting forms multiple times.
 */

/**
 * @import { Schema } from '../../common/configuration.mjs'
 */
Button.moduleName = 'govuk-button';
Button.defaults = Object.freeze({
  preventDoubleClick: false
});
Button.schema = Object.freeze({
  properties: {
    preventDoubleClick: {
      type: 'boolean'
    }
  }
});




/***/ }),

/***/ "../../node_modules/govuk-frontend/dist/govuk/components/character-count/character-count.mjs":
/*!***************************************************************************************************!*\
  !*** ../../node_modules/govuk-frontend/dist/govuk/components/character-count/character-count.mjs ***!
  \***************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CharacterCount: () => (/* binding */ CharacterCount)
/* harmony export */ });
/* harmony import */ var _common_closest_attribute_value_mjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../common/closest-attribute-value.mjs */ "../../node_modules/govuk-frontend/dist/govuk/common/closest-attribute-value.mjs");
/* harmony import */ var _common_configuration_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/configuration.mjs */ "../../node_modules/govuk-frontend/dist/govuk/common/configuration.mjs");
/* harmony import */ var _common_index_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../common/index.mjs */ "../../node_modules/govuk-frontend/dist/govuk/common/index.mjs");
/* harmony import */ var _errors_index_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../errors/index.mjs */ "../../node_modules/govuk-frontend/dist/govuk/errors/index.mjs");
/* harmony import */ var _i18n_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../i18n.mjs */ "../../node_modules/govuk-frontend/dist/govuk/i18n.mjs");






/**
 * Character count component
 *
 * Tracks the number of characters or words in the `.govuk-js-character-count`
 * `<textarea>` inside the element. Displays a message with the remaining number
 * of characters/words available, or the number of characters/words in excess.
 *
 * You can configure the message to only appear after a certain percentage
 * of the available characters/words has been entered.
 *
 * @preserve
 * @augments ConfigurableComponent<CharacterCountConfig>
 */
class CharacterCount extends _common_configuration_mjs__WEBPACK_IMPORTED_MODULE_0__.ConfigurableComponent {
  [_common_configuration_mjs__WEBPACK_IMPORTED_MODULE_0__.configOverride](datasetConfig) {
    let configOverrides = {};
    if ('maxwords' in datasetConfig || 'maxlength' in datasetConfig) {
      configOverrides = {
        maxlength: undefined,
        maxwords: undefined
      };
    }
    return configOverrides;
  }

  /**
   * @param {Element | null} $root - HTML element to use for character count
   * @param {CharacterCountConfig} [config] - Character count config
   */
  constructor($root, config = {}) {
    var _ref, _this$config$maxwords;
    super($root, config);
    this.$textarea = void 0;
    this.$visibleCountMessage = void 0;
    this.$screenReaderCountMessage = void 0;
    this.lastInputTimestamp = null;
    this.lastInputValue = '';
    this.valueChecker = null;
    this.i18n = void 0;
    this.maxLength = void 0;
    const $textarea = this.$root.querySelector('.govuk-js-character-count');
    if (!($textarea instanceof HTMLTextAreaElement || $textarea instanceof HTMLInputElement)) {
      throw new _errors_index_mjs__WEBPACK_IMPORTED_MODULE_1__.ElementError({
        component: CharacterCount,
        element: $textarea,
        expectedType: 'HTMLTextareaElement or HTMLInputElement',
        identifier: 'Form field (`.govuk-js-character-count`)'
      });
    }
    const errors = (0,_common_configuration_mjs__WEBPACK_IMPORTED_MODULE_0__.validateConfig)(CharacterCount.schema, this.config);
    if (errors[0]) {
      throw new _errors_index_mjs__WEBPACK_IMPORTED_MODULE_1__.ConfigError((0,_common_index_mjs__WEBPACK_IMPORTED_MODULE_2__.formatErrorMessage)(CharacterCount, errors[0]));
    }
    this.i18n = new _i18n_mjs__WEBPACK_IMPORTED_MODULE_3__.I18n(this.config.i18n, {
      locale: (0,_common_closest_attribute_value_mjs__WEBPACK_IMPORTED_MODULE_4__.closestAttributeValue)(this.$root, 'lang')
    });
    this.maxLength = (_ref = (_this$config$maxwords = this.config.maxwords) != null ? _this$config$maxwords : this.config.maxlength) != null ? _ref : Infinity;
    this.$textarea = $textarea;
    const textareaDescriptionId = `${this.$textarea.id}-info`;
    const $textareaDescription = document.getElementById(textareaDescriptionId);
    if (!$textareaDescription) {
      throw new _errors_index_mjs__WEBPACK_IMPORTED_MODULE_1__.ElementError({
        component: CharacterCount,
        element: $textareaDescription,
        identifier: `Count message (\`id="${textareaDescriptionId}"\`)`
      });
    }
    this.$errorMessage = this.$root.querySelector('.govuk-error-message');
    if (`${$textareaDescription.textContent}`.match(/^\s*$/)) {
      $textareaDescription.textContent = this.i18n.t('textareaDescription', {
        count: this.maxLength
      });
    }
    this.$textarea.insertAdjacentElement('afterend', $textareaDescription);
    const $screenReaderCountMessage = document.createElement('div');
    $screenReaderCountMessage.className = 'govuk-character-count__sr-status govuk-visually-hidden';
    $screenReaderCountMessage.setAttribute('aria-live', 'polite');
    this.$screenReaderCountMessage = $screenReaderCountMessage;
    $textareaDescription.insertAdjacentElement('afterend', $screenReaderCountMessage);
    const $visibleCountMessage = document.createElement('div');
    $visibleCountMessage.className = $textareaDescription.className;
    $visibleCountMessage.classList.add('govuk-character-count__status');
    $visibleCountMessage.setAttribute('aria-hidden', 'true');
    this.$visibleCountMessage = $visibleCountMessage;
    $textareaDescription.insertAdjacentElement('afterend', $visibleCountMessage);
    $textareaDescription.classList.add('govuk-visually-hidden');
    this.$textarea.removeAttribute('maxlength');
    this.bindChangeEvents();
    window.addEventListener('pageshow', () => this.updateCountMessage());
    this.updateCountMessage();
  }
  bindChangeEvents() {
    this.$textarea.addEventListener('keyup', () => this.handleKeyUp());
    this.$textarea.addEventListener('focus', () => this.handleFocus());
    this.$textarea.addEventListener('blur', () => this.handleBlur());
  }
  handleKeyUp() {
    this.updateVisibleCountMessage();
    this.lastInputTimestamp = Date.now();
  }
  handleFocus() {
    this.valueChecker = window.setInterval(() => {
      if (!this.lastInputTimestamp || Date.now() - 500 >= this.lastInputTimestamp) {
        this.updateIfValueChanged();
      }
    }, 1000);
  }
  handleBlur() {
    if (this.valueChecker) {
      window.clearInterval(this.valueChecker);
    }
  }
  updateIfValueChanged() {
    if (this.$textarea.value !== this.lastInputValue) {
      this.lastInputValue = this.$textarea.value;
      this.updateCountMessage();
    }
  }
  updateCountMessage() {
    this.updateVisibleCountMessage();
    this.updateScreenReaderCountMessage();
  }
  updateVisibleCountMessage() {
    const remainingNumber = this.maxLength - this.count(this.$textarea.value);
    const isError = remainingNumber < 0;
    this.$visibleCountMessage.classList.toggle('govuk-character-count__message--disabled', !this.isOverThreshold());
    if (!this.$errorMessage) {
      this.$textarea.classList.toggle('govuk-textarea--error', isError);
    }
    this.$visibleCountMessage.classList.toggle('govuk-error-message', isError);
    this.$visibleCountMessage.classList.toggle('govuk-hint', !isError);
    this.$visibleCountMessage.textContent = this.getCountMessage();
  }
  updateScreenReaderCountMessage() {
    if (this.isOverThreshold()) {
      this.$screenReaderCountMessage.removeAttribute('aria-hidden');
    } else {
      this.$screenReaderCountMessage.setAttribute('aria-hidden', 'true');
    }
    this.$screenReaderCountMessage.textContent = this.getCountMessage();
  }
  count(text) {
    if (this.config.maxwords) {
      var _text$match;
      const tokens = (_text$match = text.match(/\S+/g)) != null ? _text$match : [];
      return tokens.length;
    }
    return text.length;
  }
  getCountMessage() {
    const remainingNumber = this.maxLength - this.count(this.$textarea.value);
    const countType = this.config.maxwords ? 'words' : 'characters';
    return this.formatCountMessage(remainingNumber, countType);
  }
  formatCountMessage(remainingNumber, countType) {
    if (remainingNumber === 0) {
      return this.i18n.t(`${countType}AtLimit`);
    }
    const translationKeySuffix = remainingNumber < 0 ? 'OverLimit' : 'UnderLimit';
    return this.i18n.t(`${countType}${translationKeySuffix}`, {
      count: Math.abs(remainingNumber)
    });
  }
  isOverThreshold() {
    if (!this.config.threshold) {
      return true;
    }
    const currentLength = this.count(this.$textarea.value);
    const maxLength = this.maxLength;
    const thresholdValue = maxLength * this.config.threshold / 100;
    return thresholdValue <= currentLength;
  }
}

/**
 * Character count config
 *
 * @see {@link CharacterCount.defaults}
 * @typedef {object} CharacterCountConfig
 * @property {number} [maxlength] - The maximum number of characters.
 *   If maxwords is provided, the maxlength option will be ignored.
 * @property {number} [maxwords] - The maximum number of words. If maxwords is
 *   provided, the maxlength option will be ignored.
 * @property {number} [threshold=0] - The percentage value of the limit at
 *   which point the count message is displayed. If this attribute is set, the
 *   count message will be hidden by default.
 * @property {CharacterCountTranslations} [i18n=CharacterCount.defaults.i18n] - Character count translations
 */

/**
 * Character count translations
 *
 * @see {@link CharacterCount.defaults.i18n}
 * @typedef {object} CharacterCountTranslations
 *
 * Messages shown to users as they type. It provides feedback on how many words
 * or characters they have remaining or if they are over the limit. This also
 * includes a message used as an accessible description for the textarea.
 * @property {TranslationPluralForms} [charactersUnderLimit] - Message displayed
 *   when the number of characters is under the configured maximum, `maxlength`.
 *   This message is displayed visually and through assistive technologies. The
 *   component will replace the `%{count}` placeholder with the number of
 *   remaining characters. This is a [pluralised list of
 *   messages](https://frontend.design-system.service.gov.uk/localise-govuk-frontend).
 * @property {string} [charactersAtLimit] - Message displayed when the number of
 *   characters reaches the configured maximum, `maxlength`. This message is
 *   displayed visually and through assistive technologies.
 * @property {TranslationPluralForms} [charactersOverLimit] - Message displayed
 *   when the number of characters is over the configured maximum, `maxlength`.
 *   This message is displayed visually and through assistive technologies. The
 *   component will replace the `%{count}` placeholder with the number of
 *   remaining characters. This is a [pluralised list of
 *   messages](https://frontend.design-system.service.gov.uk/localise-govuk-frontend).
 * @property {TranslationPluralForms} [wordsUnderLimit] - Message displayed when
 *   the number of words is under the configured maximum, `maxlength`. This
 *   message is displayed visually and through assistive technologies. The
 *   component will replace the `%{count}` placeholder with the number of
 *   remaining words. This is a [pluralised list of
 *   messages](https://frontend.design-system.service.gov.uk/localise-govuk-frontend).
 * @property {string} [wordsAtLimit] - Message displayed when the number of
 *   words reaches the configured maximum, `maxlength`. This message is
 *   displayed visually and through assistive technologies.
 * @property {TranslationPluralForms} [wordsOverLimit] - Message displayed when
 *   the number of words is over the configured maximum, `maxlength`. This
 *   message is displayed visually and through assistive technologies. The
 *   component will replace the `%{count}` placeholder with the number of
 *   remaining words. This is a [pluralised list of
 *   messages](https://frontend.design-system.service.gov.uk/localise-govuk-frontend).
 * @property {TranslationPluralForms} [textareaDescription] - Message made
 *   available to assistive technologies, if none is already present in the
 *   HTML, to describe that the component accepts only a limited amount of
 *   content. It is visible on the page when JavaScript is unavailable. The
 *   component will replace the `%{count}` placeholder with the value of the
 *   `maxlength` or `maxwords` parameter.
 */

/**
 * @import { Schema } from '../../common/configuration.mjs'
 * @import { TranslationPluralForms } from '../../i18n.mjs'
 */
CharacterCount.moduleName = 'govuk-character-count';
CharacterCount.defaults = Object.freeze({
  threshold: 0,
  i18n: {
    charactersUnderLimit: {
      one: 'You have %{count} character remaining',
      other: 'You have %{count} characters remaining'
    },
    charactersAtLimit: 'You have 0 characters remaining',
    charactersOverLimit: {
      one: 'You have %{count} character too many',
      other: 'You have %{count} characters too many'
    },
    wordsUnderLimit: {
      one: 'You have %{count} word remaining',
      other: 'You have %{count} words remaining'
    },
    wordsAtLimit: 'You have 0 words remaining',
    wordsOverLimit: {
      one: 'You have %{count} word too many',
      other: 'You have %{count} words too many'
    },
    textareaDescription: {
      other: ''
    }
  }
});
CharacterCount.schema = Object.freeze({
  properties: {
    i18n: {
      type: 'object'
    },
    maxwords: {
      type: 'number'
    },
    maxlength: {
      type: 'number'
    },
    threshold: {
      type: 'number'
    }
  },
  anyOf: [{
    required: ['maxwords'],
    errorMessage: 'Either "maxlength" or "maxwords" must be provided'
  }, {
    required: ['maxlength'],
    errorMessage: 'Either "maxlength" or "maxwords" must be provided'
  }]
});




/***/ }),

/***/ "../../node_modules/govuk-frontend/dist/govuk/components/checkboxes/checkboxes.mjs":
/*!*****************************************************************************************!*\
  !*** ../../node_modules/govuk-frontend/dist/govuk/components/checkboxes/checkboxes.mjs ***!
  \*****************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Checkboxes: () => (/* binding */ Checkboxes)
/* harmony export */ });
/* harmony import */ var _component_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../component.mjs */ "../../node_modules/govuk-frontend/dist/govuk/component.mjs");
/* harmony import */ var _errors_index_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../errors/index.mjs */ "../../node_modules/govuk-frontend/dist/govuk/errors/index.mjs");



/**
 * Checkboxes component
 *
 * @preserve
 */
class Checkboxes extends _component_mjs__WEBPACK_IMPORTED_MODULE_0__.Component {
  /**
   * Checkboxes can be associated with a 'conditionally revealed' content block
   * – for example, a checkbox for 'Phone' could reveal an additional form field
   * for the user to enter their phone number.
   *
   * These associations are made using a `data-aria-controls` attribute, which
   * is promoted to an aria-controls attribute during initialisation.
   *
   * We also need to restore the state of any conditional reveals on the page
   * (for example if the user has navigated back), and set up event handlers to
   * keep the reveal in sync with the checkbox state.
   *
   * @param {Element | null} $root - HTML element to use for checkboxes
   */
  constructor($root) {
    super($root);
    this.$inputs = void 0;
    const $inputs = this.$root.querySelectorAll('input[type="checkbox"]');
    if (!$inputs.length) {
      throw new _errors_index_mjs__WEBPACK_IMPORTED_MODULE_1__.ElementError({
        component: Checkboxes,
        identifier: 'Form inputs (`<input type="checkbox">`)'
      });
    }
    this.$inputs = $inputs;
    this.$inputs.forEach($input => {
      const targetId = $input.getAttribute('data-aria-controls');
      if (!targetId) {
        return;
      }
      if (!document.getElementById(targetId)) {
        throw new _errors_index_mjs__WEBPACK_IMPORTED_MODULE_1__.ElementError({
          component: Checkboxes,
          identifier: `Conditional reveal (\`id="${targetId}"\`)`
        });
      }
      $input.setAttribute('aria-controls', targetId);
      $input.removeAttribute('data-aria-controls');
    });
    window.addEventListener('pageshow', () => this.syncAllConditionalReveals());
    this.syncAllConditionalReveals();
    this.$root.addEventListener('click', event => this.handleClick(event));
  }
  syncAllConditionalReveals() {
    this.$inputs.forEach($input => this.syncConditionalRevealWithInputState($input));
  }
  syncConditionalRevealWithInputState($input) {
    const targetId = $input.getAttribute('aria-controls');
    if (!targetId) {
      return;
    }
    const $target = document.getElementById(targetId);
    if ($target != null && $target.classList.contains('govuk-checkboxes__conditional')) {
      const inputIsChecked = $input.checked;
      $input.setAttribute('aria-expanded', inputIsChecked.toString());
      $target.classList.toggle('govuk-checkboxes__conditional--hidden', !inputIsChecked);
    }
  }
  unCheckAllInputsExcept($input) {
    const allInputsWithSameName = document.querySelectorAll(`input[type="checkbox"][name="${$input.name}"]`);
    allInputsWithSameName.forEach($inputWithSameName => {
      const hasSameFormOwner = $input.form === $inputWithSameName.form;
      if (hasSameFormOwner && $inputWithSameName !== $input) {
        $inputWithSameName.checked = false;
        this.syncConditionalRevealWithInputState($inputWithSameName);
      }
    });
  }
  unCheckExclusiveInputs($input) {
    const allInputsWithSameNameAndExclusiveBehaviour = document.querySelectorAll(`input[data-behaviour="exclusive"][type="checkbox"][name="${$input.name}"]`);
    allInputsWithSameNameAndExclusiveBehaviour.forEach($exclusiveInput => {
      const hasSameFormOwner = $input.form === $exclusiveInput.form;
      if (hasSameFormOwner) {
        $exclusiveInput.checked = false;
        this.syncConditionalRevealWithInputState($exclusiveInput);
      }
    });
  }
  handleClick(event) {
    const $clickedInput = event.target;
    if (!($clickedInput instanceof HTMLInputElement) || $clickedInput.type !== 'checkbox') {
      return;
    }
    const hasAriaControls = $clickedInput.getAttribute('aria-controls');
    if (hasAriaControls) {
      this.syncConditionalRevealWithInputState($clickedInput);
    }
    if (!$clickedInput.checked) {
      return;
    }
    const hasBehaviourExclusive = $clickedInput.getAttribute('data-behaviour') === 'exclusive';
    if (hasBehaviourExclusive) {
      this.unCheckAllInputsExcept($clickedInput);
    } else {
      this.unCheckExclusiveInputs($clickedInput);
    }
  }
}
Checkboxes.moduleName = 'govuk-checkboxes';




/***/ }),

/***/ "../../node_modules/govuk-frontend/dist/govuk/components/error-summary/error-summary.mjs":
/*!***********************************************************************************************!*\
  !*** ../../node_modules/govuk-frontend/dist/govuk/components/error-summary/error-summary.mjs ***!
  \***********************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ErrorSummary: () => (/* binding */ ErrorSummary)
/* harmony export */ });
/* harmony import */ var _common_configuration_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/configuration.mjs */ "../../node_modules/govuk-frontend/dist/govuk/common/configuration.mjs");
/* harmony import */ var _common_index_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../common/index.mjs */ "../../node_modules/govuk-frontend/dist/govuk/common/index.mjs");



/**
 * Error summary component
 *
 * Takes focus on initialisation for accessible announcement, unless disabled in
 * configuration.
 *
 * @preserve
 * @augments ConfigurableComponent<ErrorSummaryConfig>
 */
class ErrorSummary extends _common_configuration_mjs__WEBPACK_IMPORTED_MODULE_0__.ConfigurableComponent {
  /**
   * @param {Element | null} $root - HTML element to use for error summary
   * @param {ErrorSummaryConfig} [config] - Error summary config
   */
  constructor($root, config = {}) {
    super($root, config);
    if (!this.config.disableAutoFocus) {
      (0,_common_index_mjs__WEBPACK_IMPORTED_MODULE_1__.setFocus)(this.$root);
    }
    this.$root.addEventListener('click', event => this.handleClick(event));
  }
  handleClick(event) {
    const $target = event.target;
    if ($target && this.focusTarget($target)) {
      event.preventDefault();
    }
  }
  focusTarget($target) {
    if (!($target instanceof HTMLAnchorElement)) {
      return false;
    }
    const inputId = (0,_common_index_mjs__WEBPACK_IMPORTED_MODULE_1__.getFragmentFromUrl)($target.href);
    if (!inputId) {
      return false;
    }
    const $input = document.getElementById(inputId);
    if (!$input) {
      return false;
    }
    const $legendOrLabel = this.getAssociatedLegendOrLabel($input);
    if (!$legendOrLabel) {
      return false;
    }
    $legendOrLabel.scrollIntoView();
    $input.focus({
      preventScroll: true
    });
    return true;
  }
  getAssociatedLegendOrLabel($input) {
    var _document$querySelect;
    const $fieldset = $input.closest('fieldset');
    if ($fieldset) {
      const $legends = $fieldset.getElementsByTagName('legend');
      if ($legends.length) {
        const $candidateLegend = $legends[0];
        if ($input instanceof HTMLInputElement && ($input.type === 'checkbox' || $input.type === 'radio')) {
          return $candidateLegend;
        }
        const legendTop = $candidateLegend.getBoundingClientRect().top;
        const inputRect = $input.getBoundingClientRect();
        if (inputRect.height && window.innerHeight) {
          const inputBottom = inputRect.top + inputRect.height;
          if (inputBottom - legendTop < window.innerHeight / 2) {
            return $candidateLegend;
          }
        }
      }
    }
    return (_document$querySelect = document.querySelector(`label[for='${$input.getAttribute('id')}']`)) != null ? _document$querySelect : $input.closest('label');
  }
}

/**
 * Error summary config
 *
 * @typedef {object} ErrorSummaryConfig
 * @property {boolean} [disableAutoFocus=false] - If set to `true` the error
 *   summary will not be focussed when the page loads.
 */

/**
 * @import { Schema } from '../../common/configuration.mjs'
 */
ErrorSummary.moduleName = 'govuk-error-summary';
ErrorSummary.defaults = Object.freeze({
  disableAutoFocus: false
});
ErrorSummary.schema = Object.freeze({
  properties: {
    disableAutoFocus: {
      type: 'boolean'
    }
  }
});




/***/ }),

/***/ "../../node_modules/govuk-frontend/dist/govuk/components/exit-this-page/exit-this-page.mjs":
/*!*************************************************************************************************!*\
  !*** ../../node_modules/govuk-frontend/dist/govuk/components/exit-this-page/exit-this-page.mjs ***!
  \*************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ExitThisPage: () => (/* binding */ ExitThisPage)
/* harmony export */ });
/* harmony import */ var _common_configuration_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/configuration.mjs */ "../../node_modules/govuk-frontend/dist/govuk/common/configuration.mjs");
/* harmony import */ var _errors_index_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../errors/index.mjs */ "../../node_modules/govuk-frontend/dist/govuk/errors/index.mjs");
/* harmony import */ var _i18n_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../i18n.mjs */ "../../node_modules/govuk-frontend/dist/govuk/i18n.mjs");




/**
 * Exit this page component
 *
 * @preserve
 * @augments ConfigurableComponent<ExitThisPageConfig>
 */
class ExitThisPage extends _common_configuration_mjs__WEBPACK_IMPORTED_MODULE_0__.ConfigurableComponent {
  /**
   * @param {Element | null} $root - HTML element that wraps the Exit This Page button
   * @param {ExitThisPageConfig} [config] - Exit This Page config
   */
  constructor($root, config = {}) {
    super($root, config);
    this.i18n = void 0;
    this.$button = void 0;
    this.$skiplinkButton = null;
    this.$updateSpan = null;
    this.$indicatorContainer = null;
    this.$overlay = null;
    this.keypressCounter = 0;
    this.lastKeyWasModified = false;
    this.timeoutTime = 5000;
    this.keypressTimeoutId = null;
    this.timeoutMessageId = null;
    const $button = this.$root.querySelector('.govuk-exit-this-page__button');
    if (!($button instanceof HTMLAnchorElement)) {
      throw new _errors_index_mjs__WEBPACK_IMPORTED_MODULE_1__.ElementError({
        component: ExitThisPage,
        element: $button,
        expectedType: 'HTMLAnchorElement',
        identifier: 'Button (`.govuk-exit-this-page__button`)'
      });
    }
    this.i18n = new _i18n_mjs__WEBPACK_IMPORTED_MODULE_2__.I18n(this.config.i18n);
    this.$button = $button;
    const $skiplinkButton = document.querySelector('.govuk-js-exit-this-page-skiplink');
    if ($skiplinkButton instanceof HTMLAnchorElement) {
      this.$skiplinkButton = $skiplinkButton;
    }
    this.buildIndicator();
    this.initUpdateSpan();
    this.initButtonClickHandler();
    if (!('govukFrontendExitThisPageKeypress' in document.body.dataset)) {
      document.addEventListener('keyup', this.handleKeypress.bind(this), true);
      document.body.dataset.govukFrontendExitThisPageKeypress = 'true';
    }
    window.addEventListener('pageshow', this.resetPage.bind(this));
  }
  initUpdateSpan() {
    this.$updateSpan = document.createElement('span');
    this.$updateSpan.setAttribute('role', 'status');
    this.$updateSpan.className = 'govuk-visually-hidden';
    this.$root.appendChild(this.$updateSpan);
  }
  initButtonClickHandler() {
    this.$button.addEventListener('click', this.handleClick.bind(this));
    if (this.$skiplinkButton) {
      this.$skiplinkButton.addEventListener('click', this.handleClick.bind(this));
    }
  }
  buildIndicator() {
    this.$indicatorContainer = document.createElement('div');
    this.$indicatorContainer.className = 'govuk-exit-this-page__indicator';
    this.$indicatorContainer.setAttribute('aria-hidden', 'true');
    for (let i = 0; i < 3; i++) {
      const $indicator = document.createElement('div');
      $indicator.className = 'govuk-exit-this-page__indicator-light';
      this.$indicatorContainer.appendChild($indicator);
    }
    this.$button.appendChild(this.$indicatorContainer);
  }
  updateIndicator() {
    if (!this.$indicatorContainer) {
      return;
    }
    this.$indicatorContainer.classList.toggle('govuk-exit-this-page__indicator--visible', this.keypressCounter > 0);
    const $indicators = this.$indicatorContainer.querySelectorAll('.govuk-exit-this-page__indicator-light');
    $indicators.forEach(($indicator, index) => {
      $indicator.classList.toggle('govuk-exit-this-page__indicator-light--on', index < this.keypressCounter);
    });
  }
  exitPage() {
    if (!this.$updateSpan) {
      return;
    }
    this.$updateSpan.textContent = '';
    document.body.classList.add('govuk-exit-this-page-hide-content');
    this.$overlay = document.createElement('div');
    this.$overlay.className = 'govuk-exit-this-page-overlay';
    this.$overlay.setAttribute('role', 'alert');
    document.body.appendChild(this.$overlay);
    this.$overlay.textContent = this.i18n.t('activated');
    window.location.href = this.$button.href;
  }
  handleClick(event) {
    event.preventDefault();
    this.exitPage();
  }
  handleKeypress(event) {
    if (!this.$updateSpan) {
      return;
    }
    if (event.key === 'Shift' && !this.lastKeyWasModified) {
      this.keypressCounter += 1;
      this.updateIndicator();
      if (this.timeoutMessageId) {
        window.clearTimeout(this.timeoutMessageId);
        this.timeoutMessageId = null;
      }
      if (this.keypressCounter >= 3) {
        this.keypressCounter = 0;
        if (this.keypressTimeoutId) {
          window.clearTimeout(this.keypressTimeoutId);
          this.keypressTimeoutId = null;
        }
        this.exitPage();
      } else {
        if (this.keypressCounter === 1) {
          this.$updateSpan.textContent = this.i18n.t('pressTwoMoreTimes');
        } else {
          this.$updateSpan.textContent = this.i18n.t('pressOneMoreTime');
        }
      }
      this.setKeypressTimer();
    } else if (this.keypressTimeoutId) {
      this.resetKeypressTimer();
    }
    this.lastKeyWasModified = event.shiftKey;
  }
  setKeypressTimer() {
    if (this.keypressTimeoutId) {
      window.clearTimeout(this.keypressTimeoutId);
    }
    this.keypressTimeoutId = window.setTimeout(this.resetKeypressTimer.bind(this), this.timeoutTime);
  }
  resetKeypressTimer() {
    if (!this.$updateSpan) {
      return;
    }
    if (this.keypressTimeoutId) {
      window.clearTimeout(this.keypressTimeoutId);
      this.keypressTimeoutId = null;
    }
    const $updateSpan = this.$updateSpan;
    this.keypressCounter = 0;
    $updateSpan.textContent = this.i18n.t('timedOut');
    this.timeoutMessageId = window.setTimeout(() => {
      $updateSpan.textContent = '';
    }, this.timeoutTime);
    this.updateIndicator();
  }
  resetPage() {
    document.body.classList.remove('govuk-exit-this-page-hide-content');
    if (this.$overlay) {
      this.$overlay.remove();
      this.$overlay = null;
    }
    if (this.$updateSpan) {
      this.$updateSpan.setAttribute('role', 'status');
      this.$updateSpan.textContent = '';
    }
    this.updateIndicator();
    if (this.keypressTimeoutId) {
      window.clearTimeout(this.keypressTimeoutId);
    }
    if (this.timeoutMessageId) {
      window.clearTimeout(this.timeoutMessageId);
    }
  }
}

/**
 * Exit this Page config
 *
 * @see {@link ExitThisPage.defaults}
 * @typedef {object} ExitThisPageConfig
 * @property {ExitThisPageTranslations} [i18n=ExitThisPage.defaults.i18n] - Exit this page translations
 */

/**
 * Exit this Page translations
 *
 * @see {@link ExitThisPage.defaults.i18n}
 * @typedef {object} ExitThisPageTranslations
 *
 * Messages used by the component programatically inserted text, including
 * overlay text and screen reader announcements.
 * @property {string} [activated] - Screen reader announcement for when EtP
 *   keypress functionality has been successfully activated.
 * @property {string} [timedOut] - Screen reader announcement for when the EtP
 *   keypress functionality has timed out.
 * @property {string} [pressTwoMoreTimes] - Screen reader announcement informing
 *   the user they must press the activation key two more times.
 * @property {string} [pressOneMoreTime] - Screen reader announcement informing
 *   the user they must press the activation key one more time.
 */

/**
 * @import { Schema } from '../../common/configuration.mjs'
 */
ExitThisPage.moduleName = 'govuk-exit-this-page';
ExitThisPage.defaults = Object.freeze({
  i18n: {
    activated: 'Loading.',
    timedOut: 'Exit this page expired.',
    pressTwoMoreTimes: 'Shift, press 2 more times to exit.',
    pressOneMoreTime: 'Shift, press 1 more time to exit.'
  }
});
ExitThisPage.schema = Object.freeze({
  properties: {
    i18n: {
      type: 'object'
    }
  }
});




/***/ }),

/***/ "../../node_modules/govuk-frontend/dist/govuk/components/file-upload/file-upload.mjs":
/*!*******************************************************************************************!*\
  !*** ../../node_modules/govuk-frontend/dist/govuk/components/file-upload/file-upload.mjs ***!
  \*******************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FileUpload: () => (/* binding */ FileUpload)
/* harmony export */ });
/* harmony import */ var _common_closest_attribute_value_mjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../common/closest-attribute-value.mjs */ "../../node_modules/govuk-frontend/dist/govuk/common/closest-attribute-value.mjs");
/* harmony import */ var _common_configuration_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/configuration.mjs */ "../../node_modules/govuk-frontend/dist/govuk/common/configuration.mjs");
/* harmony import */ var _common_index_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../common/index.mjs */ "../../node_modules/govuk-frontend/dist/govuk/common/index.mjs");
/* harmony import */ var _errors_index_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../errors/index.mjs */ "../../node_modules/govuk-frontend/dist/govuk/errors/index.mjs");
/* harmony import */ var _i18n_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../i18n.mjs */ "../../node_modules/govuk-frontend/dist/govuk/i18n.mjs");






/**
 * File upload component
 *
 * @preserve
 * @augments ConfigurableComponent<FileUploadConfig>
 */
class FileUpload extends _common_configuration_mjs__WEBPACK_IMPORTED_MODULE_0__.ConfigurableComponent {
  /**
   * @param {Element | null} $root - File input element
   * @param {FileUploadConfig} [config] - File Upload config
   */
  constructor($root, config = {}) {
    super($root, config);
    this.$input = void 0;
    this.$button = void 0;
    this.$status = void 0;
    this.i18n = void 0;
    this.id = void 0;
    this.$announcements = void 0;
    this.enteredAnotherElement = void 0;
    const $input = this.$root.querySelector('input');
    if ($input === null) {
      throw new _errors_index_mjs__WEBPACK_IMPORTED_MODULE_1__.ElementError({
        component: FileUpload,
        identifier: 'File inputs (`<input type="file">`)'
      });
    }
    if ($input.type !== 'file') {
      throw new _errors_index_mjs__WEBPACK_IMPORTED_MODULE_1__.ElementError((0,_common_index_mjs__WEBPACK_IMPORTED_MODULE_2__.formatErrorMessage)(FileUpload, 'File input (`<input type="file">`) attribute (`type`) is not `file`'));
    }
    this.$input = $input;
    this.$input.setAttribute('hidden', 'true');
    if (!this.$input.id) {
      throw new _errors_index_mjs__WEBPACK_IMPORTED_MODULE_1__.ElementError({
        component: FileUpload,
        identifier: 'File input (`<input type="file">`) attribute (`id`)'
      });
    }
    this.id = this.$input.id;
    this.i18n = new _i18n_mjs__WEBPACK_IMPORTED_MODULE_3__.I18n(this.config.i18n, {
      locale: (0,_common_closest_attribute_value_mjs__WEBPACK_IMPORTED_MODULE_4__.closestAttributeValue)(this.$root, 'lang')
    });
    const $label = this.findLabel();
    if (!$label.id) {
      $label.id = `${this.id}-label`;
    }
    this.$input.id = `${this.id}-input`;
    const $button = document.createElement('button');
    $button.classList.add('govuk-file-upload-button');
    $button.type = 'button';
    $button.id = this.id;
    $button.classList.add('govuk-file-upload-button--empty');
    const ariaDescribedBy = this.$input.getAttribute('aria-describedby');
    if (ariaDescribedBy) {
      $button.setAttribute('aria-describedby', ariaDescribedBy);
    }
    const $status = document.createElement('span');
    $status.className = 'govuk-body govuk-file-upload-button__status';
    $status.setAttribute('aria-live', 'polite');
    $status.innerText = this.i18n.t('noFileChosen');
    $button.appendChild($status);
    const commaSpan = document.createElement('span');
    commaSpan.className = 'govuk-visually-hidden';
    commaSpan.innerText = ', ';
    commaSpan.id = `${this.id}-comma`;
    $button.appendChild(commaSpan);
    const containerSpan = document.createElement('span');
    containerSpan.className = 'govuk-file-upload-button__pseudo-button-container';
    const buttonSpan = document.createElement('span');
    buttonSpan.className = 'govuk-button govuk-button--secondary govuk-file-upload-button__pseudo-button';
    buttonSpan.innerText = this.i18n.t('chooseFilesButton');
    containerSpan.appendChild(buttonSpan);
    containerSpan.insertAdjacentText('beforeend', ' ');
    const instructionSpan = document.createElement('span');
    instructionSpan.className = 'govuk-body govuk-file-upload-button__instruction';
    instructionSpan.innerText = this.i18n.t('dropInstruction');
    containerSpan.appendChild(instructionSpan);
    $button.appendChild(containerSpan);
    $button.setAttribute('aria-labelledby', `${$label.id} ${commaSpan.id} ${$button.id}`);
    $button.addEventListener('click', this.onClick.bind(this));
    $button.addEventListener('dragover', event => {
      event.preventDefault();
    });
    this.$root.insertAdjacentElement('afterbegin', $button);
    this.$input.setAttribute('tabindex', '-1');
    this.$input.setAttribute('aria-hidden', 'true');
    this.$button = $button;
    this.$status = $status;
    this.$input.addEventListener('change', this.onChange.bind(this));
    this.updateDisabledState();
    this.observeDisabledState();
    this.$announcements = document.createElement('span');
    this.$announcements.classList.add('govuk-file-upload-announcements');
    this.$announcements.classList.add('govuk-visually-hidden');
    this.$announcements.setAttribute('aria-live', 'assertive');
    this.$root.insertAdjacentElement('afterend', this.$announcements);
    this.$button.addEventListener('drop', this.onDrop.bind(this));
    document.addEventListener('dragenter', this.updateDropzoneVisibility.bind(this));
    document.addEventListener('dragenter', () => {
      this.enteredAnotherElement = true;
    });
    document.addEventListener('dragleave', () => {
      if (!this.enteredAnotherElement && !this.$button.disabled) {
        this.hideDraggingState();
        this.$announcements.innerText = this.i18n.t('leftDropZone');
      }
      this.enteredAnotherElement = false;
    });
  }
  updateDropzoneVisibility(event) {
    if (this.$button.disabled) return;
    if (event.target instanceof Node) {
      if (this.$root.contains(event.target)) {
        if (event.dataTransfer && isContainingFiles(event.dataTransfer)) {
          if (!this.$button.classList.contains('govuk-file-upload-button--dragging')) {
            this.showDraggingState();
            this.$announcements.innerText = this.i18n.t('enteredDropZone');
          }
        }
      } else {
        if (this.$button.classList.contains('govuk-file-upload-button--dragging')) {
          this.hideDraggingState();
          this.$announcements.innerText = this.i18n.t('leftDropZone');
        }
      }
    }
  }
  showDraggingState() {
    this.$button.classList.add('govuk-file-upload-button--dragging');
  }
  hideDraggingState() {
    this.$button.classList.remove('govuk-file-upload-button--dragging');
  }
  onDrop(event) {
    event.preventDefault();
    if (event.dataTransfer && isContainingFiles(event.dataTransfer)) {
      this.$input.files = event.dataTransfer.files;
      this.$input.dispatchEvent(new CustomEvent('change'));
      this.hideDraggingState();
    }
  }
  onChange() {
    const fileCount = this.$input.files.length;
    if (fileCount === 0) {
      this.$status.innerText = this.i18n.t('noFileChosen');
      this.$button.classList.add('govuk-file-upload-button--empty');
    } else {
      if (fileCount === 1) {
        this.$status.innerText = this.$input.files[0].name;
      } else {
        this.$status.innerText = this.i18n.t('multipleFilesChosen', {
          count: fileCount
        });
      }
      this.$button.classList.remove('govuk-file-upload-button--empty');
    }
  }
  findLabel() {
    const $label = document.querySelector(`label[for="${this.$input.id}"]`);
    if (!$label) {
      throw new _errors_index_mjs__WEBPACK_IMPORTED_MODULE_1__.ElementError({
        component: FileUpload,
        identifier: `Field label (\`<label for=${this.$input.id}>\`)`
      });
    }
    return $label;
  }
  onClick() {
    this.$input.click();
  }
  observeDisabledState() {
    const observer = new MutationObserver(mutationList => {
      for (const mutation of mutationList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'disabled') {
          this.updateDisabledState();
        }
      }
    });
    observer.observe(this.$input, {
      attributes: true
    });
  }
  updateDisabledState() {
    this.$button.disabled = this.$input.disabled;
    this.$root.classList.toggle('govuk-drop-zone--disabled', this.$button.disabled);
  }
}
FileUpload.moduleName = 'govuk-file-upload';
FileUpload.defaults = Object.freeze({
  i18n: {
    chooseFilesButton: 'Choose file',
    dropInstruction: 'or drop file',
    noFileChosen: 'No file chosen',
    multipleFilesChosen: {
      one: '%{count} file chosen',
      other: '%{count} files chosen'
    },
    enteredDropZone: 'Entered drop zone',
    leftDropZone: 'Left drop zone'
  }
});
FileUpload.schema = Object.freeze({
  properties: {
    i18n: {
      type: 'object'
    }
  }
});
function isContainingFiles(dataTransfer) {
  const hasNoTypesInfo = dataTransfer.types.length === 0;
  const isDraggingFiles = dataTransfer.types.some(type => type === 'Files');
  return hasNoTypesInfo || isDraggingFiles;
}

/**
 * @typedef {HTMLInputElement & {files: FileList}} HTMLFileInputElement
 */

/**
 * File upload config
 *
 * @see {@link FileUpload.defaults}
 * @typedef {object} FileUploadConfig
 * @property {FileUploadTranslations} [i18n=FileUpload.defaults.i18n] - File upload translations
 */

/**
 * File upload translations
 *
 * @see {@link FileUpload.defaults.i18n}
 * @typedef {object} FileUploadTranslations
 *
 * Messages used by the component
 * @property {string} [chooseFile] - The text of the button that opens the file picker
 * @property {string} [dropInstruction] - The text informing users they can drop files
 * @property {TranslationPluralForms} [multipleFilesChosen] - The text displayed when multiple files
 *   have been chosen by the user
 * @property {string} [noFileChosen] - The text to displayed when no file has been chosen by the user
 * @property {string} [enteredDropZone] - The text announced by assistive technology
 *   when user drags files and enters the drop zone
 * @property {string} [leftDropZone] - The text announced by assistive technology
 *   when user drags files and leaves the drop zone without dropping
 */

/**
 * @import { Schema } from '../../common/configuration.mjs'
 * @import { TranslationPluralForms } from '../../i18n.mjs'
 */




/***/ }),

/***/ "../../node_modules/govuk-frontend/dist/govuk/components/header/header.mjs":
/*!*********************************************************************************!*\
  !*** ../../node_modules/govuk-frontend/dist/govuk/components/header/header.mjs ***!
  \*********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Header: () => (/* binding */ Header)
/* harmony export */ });
/* harmony import */ var _common_index_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../common/index.mjs */ "../../node_modules/govuk-frontend/dist/govuk/common/index.mjs");
/* harmony import */ var _component_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../component.mjs */ "../../node_modules/govuk-frontend/dist/govuk/component.mjs");
/* harmony import */ var _errors_index_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../errors/index.mjs */ "../../node_modules/govuk-frontend/dist/govuk/errors/index.mjs");




/**
 * Header component
 *
 * @preserve
 */
class Header extends _component_mjs__WEBPACK_IMPORTED_MODULE_0__.Component {
  /**
   * Apply a matchMedia for desktop which will trigger a state sync if the
   * browser viewport moves between states.
   *
   * @param {Element | null} $root - HTML element to use for header
   */
  constructor($root) {
    super($root);
    this.$menuButton = void 0;
    this.$menu = void 0;
    this.menuIsOpen = false;
    this.mql = null;
    const $menuButton = this.$root.querySelector('.govuk-js-header-toggle');
    if (!$menuButton) {
      return this;
    }
    this.$root.classList.add('govuk-header--with-js-navigation');
    const menuId = $menuButton.getAttribute('aria-controls');
    if (!menuId) {
      throw new _errors_index_mjs__WEBPACK_IMPORTED_MODULE_1__.ElementError({
        component: Header,
        identifier: 'Navigation button (`<button class="govuk-js-header-toggle">`) attribute (`aria-controls`)'
      });
    }
    const $menu = document.getElementById(menuId);
    if (!$menu) {
      throw new _errors_index_mjs__WEBPACK_IMPORTED_MODULE_1__.ElementError({
        component: Header,
        element: $menu,
        identifier: `Navigation (\`<ul id="${menuId}">\`)`
      });
    }
    this.$menu = $menu;
    this.$menuButton = $menuButton;
    this.setupResponsiveChecks();
    this.$menuButton.addEventListener('click', () => this.handleMenuButtonClick());
  }
  setupResponsiveChecks() {
    const breakpoint = (0,_common_index_mjs__WEBPACK_IMPORTED_MODULE_2__.getBreakpoint)('desktop');
    if (!breakpoint.value) {
      throw new _errors_index_mjs__WEBPACK_IMPORTED_MODULE_1__.ElementError({
        component: Header,
        identifier: `CSS custom property (\`${breakpoint.property}\`) on pseudo-class \`:root\``
      });
    }
    this.mql = window.matchMedia(`(min-width: ${breakpoint.value})`);
    if ('addEventListener' in this.mql) {
      this.mql.addEventListener('change', () => this.checkMode());
    } else {
      this.mql.addListener(() => this.checkMode());
    }
    this.checkMode();
  }
  checkMode() {
    if (!this.mql || !this.$menu || !this.$menuButton) {
      return;
    }
    if (this.mql.matches) {
      this.$menu.removeAttribute('hidden');
      this.$menuButton.setAttribute('hidden', '');
    } else {
      this.$menuButton.removeAttribute('hidden');
      this.$menuButton.setAttribute('aria-expanded', this.menuIsOpen.toString());
      if (this.menuIsOpen) {
        this.$menu.removeAttribute('hidden');
      } else {
        this.$menu.setAttribute('hidden', '');
      }
    }
  }
  handleMenuButtonClick() {
    this.menuIsOpen = !this.menuIsOpen;
    this.checkMode();
  }
}
Header.moduleName = 'govuk-header';




/***/ }),

/***/ "../../node_modules/govuk-frontend/dist/govuk/components/notification-banner/notification-banner.mjs":
/*!***********************************************************************************************************!*\
  !*** ../../node_modules/govuk-frontend/dist/govuk/components/notification-banner/notification-banner.mjs ***!
  \***********************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NotificationBanner: () => (/* binding */ NotificationBanner)
/* harmony export */ });
/* harmony import */ var _common_configuration_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/configuration.mjs */ "../../node_modules/govuk-frontend/dist/govuk/common/configuration.mjs");
/* harmony import */ var _common_index_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../common/index.mjs */ "../../node_modules/govuk-frontend/dist/govuk/common/index.mjs");



/**
 * Notification Banner component
 *
 * @preserve
 * @augments ConfigurableComponent<NotificationBannerConfig>
 */
class NotificationBanner extends _common_configuration_mjs__WEBPACK_IMPORTED_MODULE_0__.ConfigurableComponent {
  /**
   * @param {Element | null} $root - HTML element to use for notification banner
   * @param {NotificationBannerConfig} [config] - Notification banner config
   */
  constructor($root, config = {}) {
    super($root, config);
    if (this.$root.getAttribute('role') === 'alert' && !this.config.disableAutoFocus) {
      (0,_common_index_mjs__WEBPACK_IMPORTED_MODULE_1__.setFocus)(this.$root);
    }
  }
}

/**
 * Notification banner config
 *
 * @typedef {object} NotificationBannerConfig
 * @property {boolean} [disableAutoFocus=false] - If set to `true` the
 *   notification banner will not be focussed when the page loads. This only
 *   applies if the component has a `role` of `alert` – in other cases the
 *   component will not be focused on page load, regardless of this option.
 */

/**
 * @import { Schema } from '../../common/configuration.mjs'
 */
NotificationBanner.moduleName = 'govuk-notification-banner';
NotificationBanner.defaults = Object.freeze({
  disableAutoFocus: false
});
NotificationBanner.schema = Object.freeze({
  properties: {
    disableAutoFocus: {
      type: 'boolean'
    }
  }
});




/***/ }),

/***/ "../../node_modules/govuk-frontend/dist/govuk/components/password-input/password-input.mjs":
/*!*************************************************************************************************!*\
  !*** ../../node_modules/govuk-frontend/dist/govuk/components/password-input/password-input.mjs ***!
  \*************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PasswordInput: () => (/* binding */ PasswordInput)
/* harmony export */ });
/* harmony import */ var _common_closest_attribute_value_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../common/closest-attribute-value.mjs */ "../../node_modules/govuk-frontend/dist/govuk/common/closest-attribute-value.mjs");
/* harmony import */ var _common_configuration_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/configuration.mjs */ "../../node_modules/govuk-frontend/dist/govuk/common/configuration.mjs");
/* harmony import */ var _errors_index_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../errors/index.mjs */ "../../node_modules/govuk-frontend/dist/govuk/errors/index.mjs");
/* harmony import */ var _i18n_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../i18n.mjs */ "../../node_modules/govuk-frontend/dist/govuk/i18n.mjs");





/**
 * Password input component
 *
 * @preserve
 * @augments ConfigurableComponent<PasswordInputConfig>
 */
class PasswordInput extends _common_configuration_mjs__WEBPACK_IMPORTED_MODULE_0__.ConfigurableComponent {
  /**
   * @param {Element | null} $root - HTML element to use for password input
   * @param {PasswordInputConfig} [config] - Password input config
   */
  constructor($root, config = {}) {
    super($root, config);
    this.i18n = void 0;
    this.$input = void 0;
    this.$showHideButton = void 0;
    this.$screenReaderStatusMessage = void 0;
    const $input = this.$root.querySelector('.govuk-js-password-input-input');
    if (!($input instanceof HTMLInputElement)) {
      throw new _errors_index_mjs__WEBPACK_IMPORTED_MODULE_1__.ElementError({
        component: PasswordInput,
        element: $input,
        expectedType: 'HTMLInputElement',
        identifier: 'Form field (`.govuk-js-password-input-input`)'
      });
    }
    if ($input.type !== 'password') {
      throw new _errors_index_mjs__WEBPACK_IMPORTED_MODULE_1__.ElementError('Password input: Form field (`.govuk-js-password-input-input`) must be of type `password`.');
    }
    const $showHideButton = this.$root.querySelector('.govuk-js-password-input-toggle');
    if (!($showHideButton instanceof HTMLButtonElement)) {
      throw new _errors_index_mjs__WEBPACK_IMPORTED_MODULE_1__.ElementError({
        component: PasswordInput,
        element: $showHideButton,
        expectedType: 'HTMLButtonElement',
        identifier: 'Button (`.govuk-js-password-input-toggle`)'
      });
    }
    if ($showHideButton.type !== 'button') {
      throw new _errors_index_mjs__WEBPACK_IMPORTED_MODULE_1__.ElementError('Password input: Button (`.govuk-js-password-input-toggle`) must be of type `button`.');
    }
    this.$input = $input;
    this.$showHideButton = $showHideButton;
    this.i18n = new _i18n_mjs__WEBPACK_IMPORTED_MODULE_2__.I18n(this.config.i18n, {
      locale: (0,_common_closest_attribute_value_mjs__WEBPACK_IMPORTED_MODULE_3__.closestAttributeValue)(this.$root, 'lang')
    });
    this.$showHideButton.removeAttribute('hidden');
    const $screenReaderStatusMessage = document.createElement('div');
    $screenReaderStatusMessage.className = 'govuk-password-input__sr-status govuk-visually-hidden';
    $screenReaderStatusMessage.setAttribute('aria-live', 'polite');
    this.$screenReaderStatusMessage = $screenReaderStatusMessage;
    this.$input.insertAdjacentElement('afterend', $screenReaderStatusMessage);
    this.$showHideButton.addEventListener('click', this.toggle.bind(this));
    if (this.$input.form) {
      this.$input.form.addEventListener('submit', () => this.hide());
    }
    window.addEventListener('pageshow', event => {
      if (event.persisted && this.$input.type !== 'password') {
        this.hide();
      }
    });
    this.hide();
  }
  toggle(event) {
    event.preventDefault();
    if (this.$input.type === 'password') {
      this.show();
      return;
    }
    this.hide();
  }
  show() {
    this.setType('text');
  }
  hide() {
    this.setType('password');
  }
  setType(type) {
    if (type === this.$input.type) {
      return;
    }
    this.$input.setAttribute('type', type);
    const isHidden = type === 'password';
    const prefixButton = isHidden ? 'show' : 'hide';
    const prefixStatus = isHidden ? 'passwordHidden' : 'passwordShown';
    this.$showHideButton.innerText = this.i18n.t(`${prefixButton}Password`);
    this.$showHideButton.setAttribute('aria-label', this.i18n.t(`${prefixButton}PasswordAriaLabel`));
    this.$screenReaderStatusMessage.innerText = this.i18n.t(`${prefixStatus}Announcement`);
  }
}

/**
 * Password input config
 *
 * @typedef {object} PasswordInputConfig
 * @property {PasswordInputTranslations} [i18n=PasswordInput.defaults.i18n] - Password input translations
 */

/**
 * Password input translations
 *
 * @see {@link PasswordInput.defaults.i18n}
 * @typedef {object} PasswordInputTranslations
 *
 * Messages displayed to the user indicating the state of the show/hide toggle.
 * @property {string} [showPassword] - Visible text of the button when the
 *   password is currently hidden. Plain text only.
 * @property {string} [hidePassword] - Visible text of the button when the
 *   password is currently visible. Plain text only.
 * @property {string} [showPasswordAriaLabel] - aria-label of the button when
 *   the password is currently hidden. Plain text only.
 * @property {string} [hidePasswordAriaLabel] - aria-label of the button when
 *   the password is currently visible. Plain text only.
 * @property {string} [passwordShownAnnouncement] - Screen reader
 *   announcement to make when the password has just become visible.
 *   Plain text only.
 * @property {string} [passwordHiddenAnnouncement] - Screen reader
 *   announcement to make when the password has just been hidden.
 *   Plain text only.
 */

/**
 * @import { Schema } from '../../common/configuration.mjs'
 */
PasswordInput.moduleName = 'govuk-password-input';
PasswordInput.defaults = Object.freeze({
  i18n: {
    showPassword: 'Show',
    hidePassword: 'Hide',
    showPasswordAriaLabel: 'Show password',
    hidePasswordAriaLabel: 'Hide password',
    passwordShownAnnouncement: 'Your password is visible',
    passwordHiddenAnnouncement: 'Your password is hidden'
  }
});
PasswordInput.schema = Object.freeze({
  properties: {
    i18n: {
      type: 'object'
    }
  }
});




/***/ }),

/***/ "../../node_modules/govuk-frontend/dist/govuk/components/radios/radios.mjs":
/*!*********************************************************************************!*\
  !*** ../../node_modules/govuk-frontend/dist/govuk/components/radios/radios.mjs ***!
  \*********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Radios: () => (/* binding */ Radios)
/* harmony export */ });
/* harmony import */ var _component_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../component.mjs */ "../../node_modules/govuk-frontend/dist/govuk/component.mjs");
/* harmony import */ var _errors_index_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../errors/index.mjs */ "../../node_modules/govuk-frontend/dist/govuk/errors/index.mjs");



/**
 * Radios component
 *
 * @preserve
 */
class Radios extends _component_mjs__WEBPACK_IMPORTED_MODULE_0__.Component {
  /**
   * Radios can be associated with a 'conditionally revealed' content block –
   * for example, a radio for 'Phone' could reveal an additional form field for
   * the user to enter their phone number.
   *
   * These associations are made using a `data-aria-controls` attribute, which
   * is promoted to an aria-controls attribute during initialisation.
   *
   * We also need to restore the state of any conditional reveals on the page
   * (for example if the user has navigated back), and set up event handlers to
   * keep the reveal in sync with the radio state.
   *
   * @param {Element | null} $root - HTML element to use for radios
   */
  constructor($root) {
    super($root);
    this.$inputs = void 0;
    const $inputs = this.$root.querySelectorAll('input[type="radio"]');
    if (!$inputs.length) {
      throw new _errors_index_mjs__WEBPACK_IMPORTED_MODULE_1__.ElementError({
        component: Radios,
        identifier: 'Form inputs (`<input type="radio">`)'
      });
    }
    this.$inputs = $inputs;
    this.$inputs.forEach($input => {
      const targetId = $input.getAttribute('data-aria-controls');
      if (!targetId) {
        return;
      }
      if (!document.getElementById(targetId)) {
        throw new _errors_index_mjs__WEBPACK_IMPORTED_MODULE_1__.ElementError({
          component: Radios,
          identifier: `Conditional reveal (\`id="${targetId}"\`)`
        });
      }
      $input.setAttribute('aria-controls', targetId);
      $input.removeAttribute('data-aria-controls');
    });
    window.addEventListener('pageshow', () => this.syncAllConditionalReveals());
    this.syncAllConditionalReveals();
    this.$root.addEventListener('click', event => this.handleClick(event));
  }
  syncAllConditionalReveals() {
    this.$inputs.forEach($input => this.syncConditionalRevealWithInputState($input));
  }
  syncConditionalRevealWithInputState($input) {
    const targetId = $input.getAttribute('aria-controls');
    if (!targetId) {
      return;
    }
    const $target = document.getElementById(targetId);
    if ($target != null && $target.classList.contains('govuk-radios__conditional')) {
      const inputIsChecked = $input.checked;
      $input.setAttribute('aria-expanded', inputIsChecked.toString());
      $target.classList.toggle('govuk-radios__conditional--hidden', !inputIsChecked);
    }
  }
  handleClick(event) {
    const $clickedInput = event.target;
    if (!($clickedInput instanceof HTMLInputElement) || $clickedInput.type !== 'radio') {
      return;
    }
    const $allInputs = document.querySelectorAll('input[type="radio"][aria-controls]');
    const $clickedInputForm = $clickedInput.form;
    const $clickedInputName = $clickedInput.name;
    $allInputs.forEach($input => {
      const hasSameFormOwner = $input.form === $clickedInputForm;
      const hasSameName = $input.name === $clickedInputName;
      if (hasSameName && hasSameFormOwner) {
        this.syncConditionalRevealWithInputState($input);
      }
    });
  }
}
Radios.moduleName = 'govuk-radios';




/***/ }),

/***/ "../../node_modules/govuk-frontend/dist/govuk/components/service-navigation/service-navigation.mjs":
/*!*********************************************************************************************************!*\
  !*** ../../node_modules/govuk-frontend/dist/govuk/components/service-navigation/service-navigation.mjs ***!
  \*********************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ServiceNavigation: () => (/* binding */ ServiceNavigation)
/* harmony export */ });
/* harmony import */ var _common_index_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../common/index.mjs */ "../../node_modules/govuk-frontend/dist/govuk/common/index.mjs");
/* harmony import */ var _component_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../component.mjs */ "../../node_modules/govuk-frontend/dist/govuk/component.mjs");
/* harmony import */ var _errors_index_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../errors/index.mjs */ "../../node_modules/govuk-frontend/dist/govuk/errors/index.mjs");




/**
 * Service Navigation component
 *
 * @preserve
 */
class ServiceNavigation extends _component_mjs__WEBPACK_IMPORTED_MODULE_0__.Component {
  /**
   * @param {Element | null} $root - HTML element to use for header
   */
  constructor($root) {
    super($root);
    this.$menuButton = void 0;
    this.$menu = void 0;
    this.menuIsOpen = false;
    this.mql = null;
    const $menuButton = this.$root.querySelector('.govuk-js-service-navigation-toggle');
    if (!$menuButton) {
      return this;
    }
    const menuId = $menuButton.getAttribute('aria-controls');
    if (!menuId) {
      throw new _errors_index_mjs__WEBPACK_IMPORTED_MODULE_1__.ElementError({
        component: ServiceNavigation,
        identifier: 'Navigation button (`<button class="govuk-js-service-navigation-toggle">`) attribute (`aria-controls`)'
      });
    }
    const $menu = document.getElementById(menuId);
    if (!$menu) {
      throw new _errors_index_mjs__WEBPACK_IMPORTED_MODULE_1__.ElementError({
        component: ServiceNavigation,
        element: $menu,
        identifier: `Navigation (\`<ul id="${menuId}">\`)`
      });
    }
    this.$menu = $menu;
    this.$menuButton = $menuButton;
    this.setupResponsiveChecks();
    this.$menuButton.addEventListener('click', () => this.handleMenuButtonClick());
  }
  setupResponsiveChecks() {
    const breakpoint = (0,_common_index_mjs__WEBPACK_IMPORTED_MODULE_2__.getBreakpoint)('tablet');
    if (!breakpoint.value) {
      throw new _errors_index_mjs__WEBPACK_IMPORTED_MODULE_1__.ElementError({
        component: ServiceNavigation,
        identifier: `CSS custom property (\`${breakpoint.property}\`) on pseudo-class \`:root\``
      });
    }
    this.mql = window.matchMedia(`(min-width: ${breakpoint.value})`);
    if ('addEventListener' in this.mql) {
      this.mql.addEventListener('change', () => this.checkMode());
    } else {
      this.mql.addListener(() => this.checkMode());
    }
    this.checkMode();
  }
  checkMode() {
    if (!this.mql || !this.$menu || !this.$menuButton) {
      return;
    }
    if (this.mql.matches) {
      this.$menu.removeAttribute('hidden');
      this.$menuButton.setAttribute('hidden', '');
    } else {
      this.$menuButton.removeAttribute('hidden');
      this.$menuButton.setAttribute('aria-expanded', this.menuIsOpen.toString());
      if (this.menuIsOpen) {
        this.$menu.removeAttribute('hidden');
      } else {
        this.$menu.setAttribute('hidden', '');
      }
    }
  }
  handleMenuButtonClick() {
    this.menuIsOpen = !this.menuIsOpen;
    this.checkMode();
  }
}
ServiceNavigation.moduleName = 'govuk-service-navigation';




/***/ }),

/***/ "../../node_modules/govuk-frontend/dist/govuk/components/skip-link/skip-link.mjs":
/*!***************************************************************************************!*\
  !*** ../../node_modules/govuk-frontend/dist/govuk/components/skip-link/skip-link.mjs ***!
  \***************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SkipLink: () => (/* binding */ SkipLink)
/* harmony export */ });
/* harmony import */ var _common_index_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../common/index.mjs */ "../../node_modules/govuk-frontend/dist/govuk/common/index.mjs");
/* harmony import */ var _component_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../component.mjs */ "../../node_modules/govuk-frontend/dist/govuk/component.mjs");
/* harmony import */ var _errors_index_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../errors/index.mjs */ "../../node_modules/govuk-frontend/dist/govuk/errors/index.mjs");




/**
 * Skip link component
 *
 * @preserve
 * @augments Component<HTMLAnchorElement>
 */
class SkipLink extends _component_mjs__WEBPACK_IMPORTED_MODULE_0__.Component {
  /**
   * @param {Element | null} $root - HTML element to use for skip link
   * @throws {ElementError} when $root is not set or the wrong type
   * @throws {ElementError} when $root.hash does not contain a hash
   * @throws {ElementError} when the linked element is missing or the wrong type
   */
  constructor($root) {
    var _this$$root$getAttrib;
    super($root);
    const hash = this.$root.hash;
    const href = (_this$$root$getAttrib = this.$root.getAttribute('href')) != null ? _this$$root$getAttrib : '';
    let url;
    try {
      url = new window.URL(this.$root.href);
    } catch (error) {
      throw new _errors_index_mjs__WEBPACK_IMPORTED_MODULE_1__.ElementError(`Skip link: Target link (\`href="${href}"\`) is invalid`);
    }
    if (url.origin !== window.location.origin || url.pathname !== window.location.pathname) {
      return;
    }
    const linkedElementId = (0,_common_index_mjs__WEBPACK_IMPORTED_MODULE_2__.getFragmentFromUrl)(hash);
    if (!linkedElementId) {
      throw new _errors_index_mjs__WEBPACK_IMPORTED_MODULE_1__.ElementError(`Skip link: Target link (\`href="${href}"\`) has no hash fragment`);
    }
    const $linkedElement = document.getElementById(linkedElementId);
    if (!$linkedElement) {
      throw new _errors_index_mjs__WEBPACK_IMPORTED_MODULE_1__.ElementError({
        component: SkipLink,
        element: $linkedElement,
        identifier: `Target content (\`id="${linkedElementId}"\`)`
      });
    }
    this.$root.addEventListener('click', () => (0,_common_index_mjs__WEBPACK_IMPORTED_MODULE_2__.setFocus)($linkedElement, {
      onBeforeFocus() {
        $linkedElement.classList.add('govuk-skip-link-focused-element');
      },
      onBlur() {
        $linkedElement.classList.remove('govuk-skip-link-focused-element');
      }
    }));
  }
}
SkipLink.elementType = HTMLAnchorElement;
SkipLink.moduleName = 'govuk-skip-link';




/***/ }),

/***/ "../../node_modules/govuk-frontend/dist/govuk/components/tabs/tabs.mjs":
/*!*****************************************************************************!*\
  !*** ../../node_modules/govuk-frontend/dist/govuk/components/tabs/tabs.mjs ***!
  \*****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Tabs: () => (/* binding */ Tabs)
/* harmony export */ });
/* harmony import */ var _common_index_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../common/index.mjs */ "../../node_modules/govuk-frontend/dist/govuk/common/index.mjs");
/* harmony import */ var _component_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../component.mjs */ "../../node_modules/govuk-frontend/dist/govuk/component.mjs");
/* harmony import */ var _errors_index_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../errors/index.mjs */ "../../node_modules/govuk-frontend/dist/govuk/errors/index.mjs");




/**
 * Tabs component
 *
 * @preserve
 */
class Tabs extends _component_mjs__WEBPACK_IMPORTED_MODULE_0__.Component {
  /**
   * @param {Element | null} $root - HTML element to use for tabs
   */
  constructor($root) {
    super($root);
    this.$tabs = void 0;
    this.$tabList = void 0;
    this.$tabListItems = void 0;
    this.jsHiddenClass = 'govuk-tabs__panel--hidden';
    this.changingHash = false;
    this.boundTabClick = void 0;
    this.boundTabKeydown = void 0;
    this.boundOnHashChange = void 0;
    this.mql = null;
    const $tabs = this.$root.querySelectorAll('a.govuk-tabs__tab');
    if (!$tabs.length) {
      throw new _errors_index_mjs__WEBPACK_IMPORTED_MODULE_1__.ElementError({
        component: Tabs,
        identifier: 'Links (`<a class="govuk-tabs__tab">`)'
      });
    }
    this.$tabs = $tabs;
    this.boundTabClick = this.onTabClick.bind(this);
    this.boundTabKeydown = this.onTabKeydown.bind(this);
    this.boundOnHashChange = this.onHashChange.bind(this);
    const $tabList = this.$root.querySelector('.govuk-tabs__list');
    const $tabListItems = this.$root.querySelectorAll('li.govuk-tabs__list-item');
    if (!$tabList) {
      throw new _errors_index_mjs__WEBPACK_IMPORTED_MODULE_1__.ElementError({
        component: Tabs,
        identifier: 'List (`<ul class="govuk-tabs__list">`)'
      });
    }
    if (!$tabListItems.length) {
      throw new _errors_index_mjs__WEBPACK_IMPORTED_MODULE_1__.ElementError({
        component: Tabs,
        identifier: 'List items (`<li class="govuk-tabs__list-item">`)'
      });
    }
    this.$tabList = $tabList;
    this.$tabListItems = $tabListItems;
    this.setupResponsiveChecks();
  }
  setupResponsiveChecks() {
    const breakpoint = (0,_common_index_mjs__WEBPACK_IMPORTED_MODULE_2__.getBreakpoint)('tablet');
    if (!breakpoint.value) {
      throw new _errors_index_mjs__WEBPACK_IMPORTED_MODULE_1__.ElementError({
        component: Tabs,
        identifier: `CSS custom property (\`${breakpoint.property}\`) on pseudo-class \`:root\``
      });
    }
    this.mql = window.matchMedia(`(min-width: ${breakpoint.value})`);
    if ('addEventListener' in this.mql) {
      this.mql.addEventListener('change', () => this.checkMode());
    } else {
      this.mql.addListener(() => this.checkMode());
    }
    this.checkMode();
  }
  checkMode() {
    var _this$mql;
    if ((_this$mql = this.mql) != null && _this$mql.matches) {
      this.setup();
    } else {
      this.teardown();
    }
  }
  setup() {
    var _this$getTab;
    this.$tabList.setAttribute('role', 'tablist');
    this.$tabListItems.forEach($item => {
      $item.setAttribute('role', 'presentation');
    });
    this.$tabs.forEach($tab => {
      this.setAttributes($tab);
      $tab.addEventListener('click', this.boundTabClick, true);
      $tab.addEventListener('keydown', this.boundTabKeydown, true);
      this.hideTab($tab);
    });
    const $activeTab = (_this$getTab = this.getTab(window.location.hash)) != null ? _this$getTab : this.$tabs[0];
    this.showTab($activeTab);
    window.addEventListener('hashchange', this.boundOnHashChange, true);
  }
  teardown() {
    this.$tabList.removeAttribute('role');
    this.$tabListItems.forEach($item => {
      $item.removeAttribute('role');
    });
    this.$tabs.forEach($tab => {
      $tab.removeEventListener('click', this.boundTabClick, true);
      $tab.removeEventListener('keydown', this.boundTabKeydown, true);
      this.unsetAttributes($tab);
    });
    window.removeEventListener('hashchange', this.boundOnHashChange, true);
  }
  onHashChange() {
    const hash = window.location.hash;
    const $tabWithHash = this.getTab(hash);
    if (!$tabWithHash) {
      return;
    }
    if (this.changingHash) {
      this.changingHash = false;
      return;
    }
    const $previousTab = this.getCurrentTab();
    if (!$previousTab) {
      return;
    }
    this.hideTab($previousTab);
    this.showTab($tabWithHash);
    $tabWithHash.focus();
  }
  hideTab($tab) {
    this.unhighlightTab($tab);
    this.hidePanel($tab);
  }
  showTab($tab) {
    this.highlightTab($tab);
    this.showPanel($tab);
  }
  getTab(hash) {
    return this.$root.querySelector(`a.govuk-tabs__tab[href="${hash}"]`);
  }
  setAttributes($tab) {
    const panelId = (0,_common_index_mjs__WEBPACK_IMPORTED_MODULE_2__.getFragmentFromUrl)($tab.href);
    if (!panelId) {
      return;
    }
    $tab.setAttribute('id', `tab_${panelId}`);
    $tab.setAttribute('role', 'tab');
    $tab.setAttribute('aria-controls', panelId);
    $tab.setAttribute('aria-selected', 'false');
    $tab.setAttribute('tabindex', '-1');
    const $panel = this.getPanel($tab);
    if (!$panel) {
      return;
    }
    $panel.setAttribute('role', 'tabpanel');
    $panel.setAttribute('aria-labelledby', $tab.id);
    $panel.classList.add(this.jsHiddenClass);
  }
  unsetAttributes($tab) {
    $tab.removeAttribute('id');
    $tab.removeAttribute('role');
    $tab.removeAttribute('aria-controls');
    $tab.removeAttribute('aria-selected');
    $tab.removeAttribute('tabindex');
    const $panel = this.getPanel($tab);
    if (!$panel) {
      return;
    }
    $panel.removeAttribute('role');
    $panel.removeAttribute('aria-labelledby');
    $panel.classList.remove(this.jsHiddenClass);
  }
  onTabClick(event) {
    const $currentTab = this.getCurrentTab();
    const $nextTab = event.currentTarget;
    if (!$currentTab || !($nextTab instanceof HTMLAnchorElement)) {
      return;
    }
    event.preventDefault();
    this.hideTab($currentTab);
    this.showTab($nextTab);
    this.createHistoryEntry($nextTab);
  }
  createHistoryEntry($tab) {
    const $panel = this.getPanel($tab);
    if (!$panel) {
      return;
    }
    const panelId = $panel.id;
    $panel.id = '';
    this.changingHash = true;
    window.location.hash = panelId;
    $panel.id = panelId;
  }
  onTabKeydown(event) {
    switch (event.key) {
      case 'ArrowLeft':
      case 'Left':
        this.activatePreviousTab();
        event.preventDefault();
        break;
      case 'ArrowRight':
      case 'Right':
        this.activateNextTab();
        event.preventDefault();
        break;
    }
  }
  activateNextTab() {
    const $currentTab = this.getCurrentTab();
    if (!($currentTab != null && $currentTab.parentElement)) {
      return;
    }
    const $nextTabListItem = $currentTab.parentElement.nextElementSibling;
    if (!$nextTabListItem) {
      return;
    }
    const $nextTab = $nextTabListItem.querySelector('a.govuk-tabs__tab');
    if (!$nextTab) {
      return;
    }
    this.hideTab($currentTab);
    this.showTab($nextTab);
    $nextTab.focus();
    this.createHistoryEntry($nextTab);
  }
  activatePreviousTab() {
    const $currentTab = this.getCurrentTab();
    if (!($currentTab != null && $currentTab.parentElement)) {
      return;
    }
    const $previousTabListItem = $currentTab.parentElement.previousElementSibling;
    if (!$previousTabListItem) {
      return;
    }
    const $previousTab = $previousTabListItem.querySelector('a.govuk-tabs__tab');
    if (!$previousTab) {
      return;
    }
    this.hideTab($currentTab);
    this.showTab($previousTab);
    $previousTab.focus();
    this.createHistoryEntry($previousTab);
  }
  getPanel($tab) {
    const panelId = (0,_common_index_mjs__WEBPACK_IMPORTED_MODULE_2__.getFragmentFromUrl)($tab.href);
    if (!panelId) {
      return null;
    }
    return this.$root.querySelector(`#${panelId}`);
  }
  showPanel($tab) {
    const $panel = this.getPanel($tab);
    if (!$panel) {
      return;
    }
    $panel.classList.remove(this.jsHiddenClass);
  }
  hidePanel($tab) {
    const $panel = this.getPanel($tab);
    if (!$panel) {
      return;
    }
    $panel.classList.add(this.jsHiddenClass);
  }
  unhighlightTab($tab) {
    if (!$tab.parentElement) {
      return;
    }
    $tab.setAttribute('aria-selected', 'false');
    $tab.parentElement.classList.remove('govuk-tabs__list-item--selected');
    $tab.setAttribute('tabindex', '-1');
  }
  highlightTab($tab) {
    if (!$tab.parentElement) {
      return;
    }
    $tab.setAttribute('aria-selected', 'true');
    $tab.parentElement.classList.add('govuk-tabs__list-item--selected');
    $tab.setAttribute('tabindex', '0');
  }
  getCurrentTab() {
    return this.$root.querySelector('.govuk-tabs__list-item--selected a.govuk-tabs__tab');
  }
}
Tabs.moduleName = 'govuk-tabs';




/***/ }),

/***/ "../../node_modules/govuk-frontend/dist/govuk/errors/index.mjs":
/*!*********************************************************************!*\
  !*** ../../node_modules/govuk-frontend/dist/govuk/errors/index.mjs ***!
  \*********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ConfigError: () => (/* binding */ ConfigError),
/* harmony export */   ElementError: () => (/* binding */ ElementError),
/* harmony export */   InitError: () => (/* binding */ InitError),
/* harmony export */   SupportError: () => (/* binding */ SupportError)
/* harmony export */ });
/* unused harmony export GOVUKFrontendError */
/* harmony import */ var _common_index_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/index.mjs */ "../../node_modules/govuk-frontend/dist/govuk/common/index.mjs");


class GOVUKFrontendError extends Error {
  constructor(...args) {
    super(...args);
    this.name = 'GOVUKFrontendError';
  }
}
class SupportError extends GOVUKFrontendError {
  /**
   * Checks if GOV.UK Frontend is supported on this page
   *
   * @param {HTMLElement | null} [$scope] - HTML element `<body>` checked for browser support
   */
  constructor($scope = document.body) {
    const supportMessage = 'noModule' in HTMLScriptElement.prototype ? 'GOV.UK Frontend initialised without `<body class="govuk-frontend-supported">` from template `<script>` snippet' : 'GOV.UK Frontend is not supported in this browser';
    super($scope ? supportMessage : 'GOV.UK Frontend initialised without `<script type="module">`');
    this.name = 'SupportError';
  }
}
class ConfigError extends GOVUKFrontendError {
  constructor(...args) {
    super(...args);
    this.name = 'ConfigError';
  }
}
class ElementError extends GOVUKFrontendError {
  constructor(messageOrOptions) {
    let message = typeof messageOrOptions === 'string' ? messageOrOptions : '';
    if (typeof messageOrOptions === 'object') {
      const {
        component,
        identifier,
        element,
        expectedType
      } = messageOrOptions;
      message = identifier;
      message += element ? ` is not of type ${expectedType != null ? expectedType : 'HTMLElement'}` : ' not found';
      message = (0,_common_index_mjs__WEBPACK_IMPORTED_MODULE_0__.formatErrorMessage)(component, message);
    }
    super(message);
    this.name = 'ElementError';
  }
}
class InitError extends GOVUKFrontendError {
  constructor(componentOrMessage) {
    const message = typeof componentOrMessage === 'string' ? componentOrMessage : (0,_common_index_mjs__WEBPACK_IMPORTED_MODULE_0__.formatErrorMessage)(componentOrMessage, `Root element (\`$root\`) already initialised`);
    super(message);
    this.name = 'InitError';
  }
}
/**
 * @import { ComponentWithModuleName } from '../common/index.mjs'
 */




/***/ }),

/***/ "../../node_modules/govuk-frontend/dist/govuk/i18n.mjs":
/*!*************************************************************!*\
  !*** ../../node_modules/govuk-frontend/dist/govuk/i18n.mjs ***!
  \*************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   I18n: () => (/* binding */ I18n)
/* harmony export */ });
class I18n {
  constructor(translations = {}, config = {}) {
    var _config$locale;
    this.translations = void 0;
    this.locale = void 0;
    this.translations = translations;
    this.locale = (_config$locale = config.locale) != null ? _config$locale : document.documentElement.lang || 'en';
  }
  t(lookupKey, options) {
    if (!lookupKey) {
      throw new Error('i18n: lookup key missing');
    }
    let translation = this.translations[lookupKey];
    if (typeof (options == null ? void 0 : options.count) === 'number' && typeof translation === 'object') {
      const translationPluralForm = translation[this.getPluralSuffix(lookupKey, options.count)];
      if (translationPluralForm) {
        translation = translationPluralForm;
      }
    }
    if (typeof translation === 'string') {
      if (translation.match(/%{(.\S+)}/)) {
        if (!options) {
          throw new Error('i18n: cannot replace placeholders in string if no option data provided');
        }
        return this.replacePlaceholders(translation, options);
      }
      return translation;
    }
    return lookupKey;
  }
  replacePlaceholders(translationString, options) {
    const formatter = Intl.NumberFormat.supportedLocalesOf(this.locale).length ? new Intl.NumberFormat(this.locale) : undefined;
    return translationString.replace(/%{(.\S+)}/g, function (placeholderWithBraces, placeholderKey) {
      if (Object.prototype.hasOwnProperty.call(options, placeholderKey)) {
        const placeholderValue = options[placeholderKey];
        if (placeholderValue === false || typeof placeholderValue !== 'number' && typeof placeholderValue !== 'string') {
          return '';
        }
        if (typeof placeholderValue === 'number') {
          return formatter ? formatter.format(placeholderValue) : `${placeholderValue}`;
        }
        return placeholderValue;
      }
      throw new Error(`i18n: no data found to replace ${placeholderWithBraces} placeholder in string`);
    });
  }
  hasIntlPluralRulesSupport() {
    return Boolean('PluralRules' in window.Intl && Intl.PluralRules.supportedLocalesOf(this.locale).length);
  }
  getPluralSuffix(lookupKey, count) {
    count = Number(count);
    if (!isFinite(count)) {
      return 'other';
    }
    const translation = this.translations[lookupKey];
    const preferredForm = this.hasIntlPluralRulesSupport() ? new Intl.PluralRules(this.locale).select(count) : this.selectPluralFormUsingFallbackRules(count);
    if (typeof translation === 'object') {
      if (preferredForm in translation) {
        return preferredForm;
      } else if ('other' in translation) {
        console.warn(`i18n: Missing plural form ".${preferredForm}" for "${this.locale}" locale. Falling back to ".other".`);
        return 'other';
      }
    }
    throw new Error(`i18n: Plural form ".other" is required for "${this.locale}" locale`);
  }
  selectPluralFormUsingFallbackRules(count) {
    count = Math.abs(Math.floor(count));
    const ruleset = this.getPluralRulesForLocale();
    if (ruleset) {
      return I18n.pluralRules[ruleset](count);
    }
    return 'other';
  }
  getPluralRulesForLocale() {
    const localeShort = this.locale.split('-')[0];
    for (const pluralRule in I18n.pluralRulesMap) {
      const languages = I18n.pluralRulesMap[pluralRule];
      if (languages.includes(this.locale) || languages.includes(localeShort)) {
        return pluralRule;
      }
    }
  }
}
I18n.pluralRulesMap = {
  arabic: ['ar'],
  chinese: ['my', 'zh', 'id', 'ja', 'jv', 'ko', 'ms', 'th', 'vi'],
  french: ['hy', 'bn', 'fr', 'gu', 'hi', 'fa', 'pa', 'zu'],
  german: ['af', 'sq', 'az', 'eu', 'bg', 'ca', 'da', 'nl', 'en', 'et', 'fi', 'ka', 'de', 'el', 'hu', 'lb', 'no', 'so', 'sw', 'sv', 'ta', 'te', 'tr', 'ur'],
  irish: ['ga'],
  russian: ['ru', 'uk'],
  scottish: ['gd'],
  spanish: ['pt-PT', 'it', 'es'],
  welsh: ['cy']
};
I18n.pluralRules = {
  arabic(n) {
    if (n === 0) {
      return 'zero';
    }
    if (n === 1) {
      return 'one';
    }
    if (n === 2) {
      return 'two';
    }
    if (n % 100 >= 3 && n % 100 <= 10) {
      return 'few';
    }
    if (n % 100 >= 11 && n % 100 <= 99) {
      return 'many';
    }
    return 'other';
  },
  chinese() {
    return 'other';
  },
  french(n) {
    return n === 0 || n === 1 ? 'one' : 'other';
  },
  german(n) {
    return n === 1 ? 'one' : 'other';
  },
  irish(n) {
    if (n === 1) {
      return 'one';
    }
    if (n === 2) {
      return 'two';
    }
    if (n >= 3 && n <= 6) {
      return 'few';
    }
    if (n >= 7 && n <= 10) {
      return 'many';
    }
    return 'other';
  },
  russian(n) {
    const lastTwo = n % 100;
    const last = lastTwo % 10;
    if (last === 1 && lastTwo !== 11) {
      return 'one';
    }
    if (last >= 2 && last <= 4 && !(lastTwo >= 12 && lastTwo <= 14)) {
      return 'few';
    }
    if (last === 0 || last >= 5 && last <= 9 || lastTwo >= 11 && lastTwo <= 14) {
      return 'many';
    }
    return 'other';
  },
  scottish(n) {
    if (n === 1 || n === 11) {
      return 'one';
    }
    if (n === 2 || n === 12) {
      return 'two';
    }
    if (n >= 3 && n <= 10 || n >= 13 && n <= 19) {
      return 'few';
    }
    return 'other';
  },
  spanish(n) {
    if (n === 1) {
      return 'one';
    }
    if (n % 1000000 === 0 && n !== 0) {
      return 'many';
    }
    return 'other';
  },
  welsh(n) {
    if (n === 0) {
      return 'zero';
    }
    if (n === 1) {
      return 'one';
    }
    if (n === 2) {
      return 'two';
    }
    if (n === 3) {
      return 'few';
    }
    if (n === 6) {
      return 'many';
    }
    return 'other';
  }
};




/***/ }),

/***/ "../../node_modules/govuk-frontend/dist/govuk/init.mjs":
/*!*************************************************************!*\
  !*** ../../node_modules/govuk-frontend/dist/govuk/init.mjs ***!
  \*************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createAll: () => (/* binding */ createAll),
/* harmony export */   initAll: () => (/* binding */ initAll)
/* harmony export */ });
/* harmony import */ var _common_index_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./common/index.mjs */ "../../node_modules/govuk-frontend/dist/govuk/common/index.mjs");
/* harmony import */ var _components_accordion_accordion_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/accordion/accordion.mjs */ "../../node_modules/govuk-frontend/dist/govuk/components/accordion/accordion.mjs");
/* harmony import */ var _components_button_button_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/button/button.mjs */ "../../node_modules/govuk-frontend/dist/govuk/components/button/button.mjs");
/* harmony import */ var _components_character_count_character_count_mjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/character-count/character-count.mjs */ "../../node_modules/govuk-frontend/dist/govuk/components/character-count/character-count.mjs");
/* harmony import */ var _components_checkboxes_checkboxes_mjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/checkboxes/checkboxes.mjs */ "../../node_modules/govuk-frontend/dist/govuk/components/checkboxes/checkboxes.mjs");
/* harmony import */ var _components_error_summary_error_summary_mjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/error-summary/error-summary.mjs */ "../../node_modules/govuk-frontend/dist/govuk/components/error-summary/error-summary.mjs");
/* harmony import */ var _components_exit_this_page_exit_this_page_mjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./components/exit-this-page/exit-this-page.mjs */ "../../node_modules/govuk-frontend/dist/govuk/components/exit-this-page/exit-this-page.mjs");
/* harmony import */ var _components_file_upload_file_upload_mjs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./components/file-upload/file-upload.mjs */ "../../node_modules/govuk-frontend/dist/govuk/components/file-upload/file-upload.mjs");
/* harmony import */ var _components_header_header_mjs__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./components/header/header.mjs */ "../../node_modules/govuk-frontend/dist/govuk/components/header/header.mjs");
/* harmony import */ var _components_notification_banner_notification_banner_mjs__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./components/notification-banner/notification-banner.mjs */ "../../node_modules/govuk-frontend/dist/govuk/components/notification-banner/notification-banner.mjs");
/* harmony import */ var _components_password_input_password_input_mjs__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./components/password-input/password-input.mjs */ "../../node_modules/govuk-frontend/dist/govuk/components/password-input/password-input.mjs");
/* harmony import */ var _components_radios_radios_mjs__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./components/radios/radios.mjs */ "../../node_modules/govuk-frontend/dist/govuk/components/radios/radios.mjs");
/* harmony import */ var _components_service_navigation_service_navigation_mjs__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./components/service-navigation/service-navigation.mjs */ "../../node_modules/govuk-frontend/dist/govuk/components/service-navigation/service-navigation.mjs");
/* harmony import */ var _components_skip_link_skip_link_mjs__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./components/skip-link/skip-link.mjs */ "../../node_modules/govuk-frontend/dist/govuk/components/skip-link/skip-link.mjs");
/* harmony import */ var _components_tabs_tabs_mjs__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./components/tabs/tabs.mjs */ "../../node_modules/govuk-frontend/dist/govuk/components/tabs/tabs.mjs");
/* harmony import */ var _errors_index_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./errors/index.mjs */ "../../node_modules/govuk-frontend/dist/govuk/errors/index.mjs");

















/**
 * Initialise all components
 *
 * Use the `data-module` attributes to find, instantiate and init all of the
 * components provided as part of GOV.UK Frontend.
 *
 * @param {Config & { scope?: Element, onError?: OnErrorCallback<CompatibleClass> }} [config] - Config for all components (with optional scope)
 */
function initAll(config) {
  var _config$scope;
  config = typeof config !== 'undefined' ? config : {};
  if (!(0,_common_index_mjs__WEBPACK_IMPORTED_MODULE_0__.isSupported)()) {
    if (config.onError) {
      config.onError(new _errors_index_mjs__WEBPACK_IMPORTED_MODULE_1__.SupportError(), {
        config
      });
    } else {
      console.log(new _errors_index_mjs__WEBPACK_IMPORTED_MODULE_1__.SupportError());
    }
    return;
  }
  const components = [[_components_accordion_accordion_mjs__WEBPACK_IMPORTED_MODULE_2__.Accordion, config.accordion], [_components_button_button_mjs__WEBPACK_IMPORTED_MODULE_3__.Button, config.button], [_components_character_count_character_count_mjs__WEBPACK_IMPORTED_MODULE_4__.CharacterCount, config.characterCount], [_components_checkboxes_checkboxes_mjs__WEBPACK_IMPORTED_MODULE_5__.Checkboxes], [_components_error_summary_error_summary_mjs__WEBPACK_IMPORTED_MODULE_6__.ErrorSummary, config.errorSummary], [_components_exit_this_page_exit_this_page_mjs__WEBPACK_IMPORTED_MODULE_7__.ExitThisPage, config.exitThisPage], [_components_file_upload_file_upload_mjs__WEBPACK_IMPORTED_MODULE_8__.FileUpload, config.fileUpload], [_components_header_header_mjs__WEBPACK_IMPORTED_MODULE_9__.Header], [_components_notification_banner_notification_banner_mjs__WEBPACK_IMPORTED_MODULE_10__.NotificationBanner, config.notificationBanner], [_components_password_input_password_input_mjs__WEBPACK_IMPORTED_MODULE_11__.PasswordInput, config.passwordInput], [_components_radios_radios_mjs__WEBPACK_IMPORTED_MODULE_12__.Radios], [_components_service_navigation_service_navigation_mjs__WEBPACK_IMPORTED_MODULE_13__.ServiceNavigation], [_components_skip_link_skip_link_mjs__WEBPACK_IMPORTED_MODULE_14__.SkipLink], [_components_tabs_tabs_mjs__WEBPACK_IMPORTED_MODULE_15__.Tabs]];
  const options = {
    scope: (_config$scope = config.scope) != null ? _config$scope : document,
    onError: config.onError
  };
  components.forEach(([Component, config]) => {
    createAll(Component, config, options);
  });
}

/**
 * Create all instances of a specific component on the page
 *
 * Uses the `data-module` attribute to find all elements matching the specified
 * component on the page, creating instances of the component object for each
 * of them.
 *
 * Any component errors will be caught and logged to the console.
 *
 * @template {CompatibleClass} ComponentClass
 * @param {ComponentClass} Component - class of the component to create
 * @param {ComponentConfig<ComponentClass>} [config] - Config supplied to component
 * @param {OnErrorCallback<ComponentClass> | Element | Document | CreateAllOptions<ComponentClass> } [createAllOptions] - options for createAll including scope of the document to search within and callback function if error throw by component on init
 * @returns {Array<InstanceType<ComponentClass>>} - array of instantiated components
 */
function createAll(Component, config, createAllOptions) {
  let $scope = document;
  let onError;
  if (typeof createAllOptions === 'object') {
    var _createAllOptions$sco;
    createAllOptions = createAllOptions;
    $scope = (_createAllOptions$sco = createAllOptions.scope) != null ? _createAllOptions$sco : $scope;
    onError = createAllOptions.onError;
  }
  if (typeof createAllOptions === 'function') {
    onError = createAllOptions;
  }
  if (createAllOptions instanceof HTMLElement) {
    $scope = createAllOptions;
  }
  const $elements = $scope.querySelectorAll(`[data-module="${Component.moduleName}"]`);
  if (!(0,_common_index_mjs__WEBPACK_IMPORTED_MODULE_0__.isSupported)()) {
    if (onError) {
      onError(new _errors_index_mjs__WEBPACK_IMPORTED_MODULE_1__.SupportError(), {
        component: Component,
        config
      });
    } else {
      console.log(new _errors_index_mjs__WEBPACK_IMPORTED_MODULE_1__.SupportError());
    }
    return [];
  }
  return Array.from($elements).map($element => {
    try {
      return typeof config !== 'undefined' ? new Component($element, config) : new Component($element);
    } catch (error) {
      if (onError) {
        onError(error, {
          element: $element,
          component: Component,
          config
        });
      } else {
        console.log(error);
      }
      return null;
    }
  }).filter(Boolean);
}
/**
 * @typedef {{new (...args: any[]): any, moduleName: string}} CompatibleClass
 */
/**
 * Config for all components via `initAll()`
 *
 * @typedef {object} Config
 * @property {AccordionConfig} [accordion] - Accordion config
 * @property {ButtonConfig} [button] - Button config
 * @property {CharacterCountConfig} [characterCount] - Character Count config
 * @property {ErrorSummaryConfig} [errorSummary] - Error Summary config
 * @property {ExitThisPageConfig} [exitThisPage] - Exit This Page config
 * @property {FileUploadConfig} [fileUpload] - File Upload config
 * @property {NotificationBannerConfig} [notificationBanner] - Notification Banner config
 * @property {PasswordInputConfig} [passwordInput] - Password input config
 */
/**
 * Config for individual components
 *
 * @import { AccordionConfig } from './components/accordion/accordion.mjs'
 * @import { ButtonConfig } from './components/button/button.mjs'
 * @import { CharacterCountConfig } from './components/character-count/character-count.mjs'
 * @import { ErrorSummaryConfig } from './components/error-summary/error-summary.mjs'
 * @import { ExitThisPageConfig } from './components/exit-this-page/exit-this-page.mjs'
 * @import { NotificationBannerConfig } from './components/notification-banner/notification-banner.mjs'
 * @import { PasswordInputConfig } from './components/password-input/password-input.mjs'
 * @import { FileUploadConfig } from './components/file-upload/file-upload.mjs'
 */
/**
 * Component config keys, e.g. `accordion` and `characterCount`
 *
 * @typedef {keyof Config} ConfigKey
 */
/**
 * @template {CompatibleClass} ComponentClass
 * @typedef {ConstructorParameters<ComponentClass>[1]} ComponentConfig
 */
/**
 * @template {CompatibleClass} ComponentClass
 * @typedef {object} ErrorContext
 * @property {Element} [element] - Element used for component module initialisation
 * @property {ComponentClass} [component] - Class of component
 * @property {ComponentConfig<ComponentClass>} config - Config supplied to component
 */
/**
 * @template {CompatibleClass} ComponentClass
 * @callback OnErrorCallback
 * @param {unknown} error - Thrown error
 * @param {ErrorContext<ComponentClass>} context - Object containing the element, component class and configuration
 */
/**
 * @template {CompatibleClass} ComponentClass
 * @typedef {object} CreateAllOptions
 * @property {Element | Document} [scope] - scope of the document to search within
 * @property {OnErrorCallback<ComponentClass>} [onError] - callback function if error throw by component on init
 */




/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other entry modules.
(() => {
/*!************************************!*\
  !*** ./javascripts/application.js ***!
  \************************************/
/* harmony import */ var govuk_frontend__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! govuk-frontend */ "../../node_modules/govuk-frontend/dist/govuk/init.mjs");
/* harmony import */ var govuk_frontend__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! govuk-frontend */ "../../node_modules/govuk-frontend/dist/govuk/components/button/button.mjs");
/* harmony import */ var govuk_frontend__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! govuk-frontend */ "../../node_modules/govuk-frontend/dist/govuk/components/character-count/character-count.mjs");
/* harmony import */ var govuk_frontend__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! govuk-frontend */ "../../node_modules/govuk-frontend/dist/govuk/components/checkboxes/checkboxes.mjs");
/* harmony import */ var govuk_frontend__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! govuk-frontend */ "../../node_modules/govuk-frontend/dist/govuk/components/error-summary/error-summary.mjs");
/* harmony import */ var govuk_frontend__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! govuk-frontend */ "../../node_modules/govuk-frontend/dist/govuk/components/header/header.mjs");
/* harmony import */ var govuk_frontend__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! govuk-frontend */ "../../node_modules/govuk-frontend/dist/govuk/components/radios/radios.mjs");
/* harmony import */ var govuk_frontend__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! govuk-frontend */ "../../node_modules/govuk-frontend/dist/govuk/components/skip-link/skip-link.mjs");


(0,govuk_frontend__WEBPACK_IMPORTED_MODULE_0__.createAll)(govuk_frontend__WEBPACK_IMPORTED_MODULE_1__.Button)
;(0,govuk_frontend__WEBPACK_IMPORTED_MODULE_0__.createAll)(govuk_frontend__WEBPACK_IMPORTED_MODULE_2__.CharacterCount)
;(0,govuk_frontend__WEBPACK_IMPORTED_MODULE_0__.createAll)(govuk_frontend__WEBPACK_IMPORTED_MODULE_3__.Checkboxes)
;(0,govuk_frontend__WEBPACK_IMPORTED_MODULE_0__.createAll)(govuk_frontend__WEBPACK_IMPORTED_MODULE_4__.ErrorSummary)
;(0,govuk_frontend__WEBPACK_IMPORTED_MODULE_0__.createAll)(govuk_frontend__WEBPACK_IMPORTED_MODULE_5__.Header)
;(0,govuk_frontend__WEBPACK_IMPORTED_MODULE_0__.createAll)(govuk_frontend__WEBPACK_IMPORTED_MODULE_6__.Radios)
;(0,govuk_frontend__WEBPACK_IMPORTED_MODULE_0__.createAll)(govuk_frontend__WEBPACK_IMPORTED_MODULE_7__.SkipLink)

;(0,govuk_frontend__WEBPACK_IMPORTED_MODULE_0__.initAll)()

})();


//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQ0YsU0FBQyxDQUFDO0FBQ0osT0FBQyxNQUFNO0FBQ0xvZ0IsUUFBQUEsT0FBTyxDQUFDeUIsR0FBRyxDQUFDN0csS0FBSyxDQUFDO0FBQ3BCO0FBRUEsYUFBTyxJQUFJO0FBQ2I7QUFDRixHQUFDLENBQUMsQ0FDRDZILE1BQU0sQ0FBQzlDLE9BQU8sQ0FBQztBQUNwQjtBQVVBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7OztTQ3JPQTtTQUNBOztTQUVBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7U0FDQTtTQUNBOztTQUVBO1NBQ0E7O1NBRUE7U0FDQTtTQUNBOzs7OztVQ3RCQTtVQUNBO1VBQ0E7VUFDQTtVQUNBLHlDQUF5Qyx3Q0FBd0M7VUFDakY7VUFDQTtVQUNBLEU7Ozs7O1VDUEEsd0Y7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ1V1Qjs7QUFFdkIseURBQVMsQ0FBQyxrREFBTTtBQUNoQiwwREFBUyxDQUFDLDBEQUFjO0FBQ3hCLDBEQUFTLENBQUMsc0RBQVU7QUFDcEIsMERBQVMsQ0FBQyx3REFBWTtBQUN0QiwwREFBUyxDQUFDLGtEQUFNO0FBQ2hCLDBEQUFTLENBQUMsa0RBQU07QUFDaEIsMERBQVMsQ0FBQyxvREFBUTs7QUFFbEIsd0RBQU8iLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi4vLi4vbm9kZV9tb2R1bGVzL2dvdnVrLWZyb250ZW5kL3NyYy9nb3Z1ay9jb21tb24vY2xvc2VzdC1hdHRyaWJ1dGUtdmFsdWUubWpzIiwid2VicGFjazovLy8uLi8uLi9ub2RlX21vZHVsZXMvZ292dWstZnJvbnRlbmQvc3JjL2dvdnVrL2NvbW1vbi9jb25maWd1cmF0aW9uLm1qcyIsIndlYnBhY2s6Ly8vLi4vLi4vbm9kZV9tb2R1bGVzL2dvdnVrLWZyb250ZW5kL3NyYy9nb3Z1ay9jb21tb24vaW5kZXgubWpzIiwid2VicGFjazovLy8uLi8uLi9ub2RlX21vZHVsZXMvZ292dWstZnJvbnRlbmQvc3JjL2dvdnVrL2NvbXBvbmVudC5tanMiLCJ3ZWJwYWNrOi8vLy4uLy4uL25vZGVfbW9kdWxlcy9nb3Z1ay1mcm9udGVuZC9zcmMvZ292dWsvY29tcG9uZW50cy9hY2NvcmRpb24vYWNjb3JkaW9uLm1qcyIsIndlYnBhY2s6Ly8vLi4vLi4vbm9kZV9tb2R1bGVzL2dvdnVrLWZyb250ZW5kL3NyYy9nb3Z1ay9jb21wb25lbnRzL2J1dHRvbi9idXR0b24ubWpzIiwid2VicGFjazovLy8uLi8uLi9ub2RlX21vZHVsZXMvZ292dWstZnJvbnRlbmQvc3JjL2dvdnVrL2NvbXBvbmVudHMvY2hhcmFjdGVyLWNvdW50L2NoYXJhY3Rlci1jb3VudC5tanMiLCJ3ZWJwYWNrOi8vLy4uLy4uL25vZGVfbW9kdWxlcy9nb3Z1ay1mcm9udGVuZC9zcmMvZ292dWsvY29tcG9uZW50cy9jaGVja2JveGVzL2NoZWNrYm94ZXMubWpzIiwid2VicGFjazovLy8uLi8uLi9ub2RlX21vZHVsZXMvZ292dWstZnJvbnRlbmQvc3JjL2dvdnVrL2NvbXBvbmVudHMvZXJyb3Itc3VtbWFyeS9lcnJvci1zdW1tYXJ5Lm1qcyIsIndlYnBhY2s6Ly8vLi4vLi4vbm9kZV9tb2R1bGVzL2dvdnVrLWZyb250ZW5kL3NyYy9nb3Z1ay9jb21wb25lbnRzL2V4aXQtdGhpcy1wYWdlL2V4aXQtdGhpcy1wYWdlLm1qcyIsIndlYnBhY2s6Ly8vLi4vLi4vbm9kZV9tb2R1bGVzL2dvdnVrLWZyb250ZW5kL3NyYy9nb3Z1ay9jb21wb25lbnRzL2ZpbGUtdXBsb2FkL2ZpbGUtdXBsb2FkLm1qcyIsIndlYnBhY2s6Ly8vLi4vLi4vbm9kZV9tb2R1bGVzL2dvdnVrLWZyb250ZW5kL3NyYy9nb3Z1ay9jb21wb25lbnRzL2hlYWRlci9oZWFkZXIubWpzIiwid2VicGFjazovLy8uLi8uLi9ub2RlX21vZHVsZXMvZ292dWstZnJvbnRlbmQvc3JjL2dvdnVrL2NvbXBvbmVudHMvbm90aWZpY2F0aW9uLWJhbm5lci9ub3RpZmljYXRpb24tYmFubmVyLm1qcyIsIndlYnBhY2s6Ly8vLi4vLi4vbm9kZV9tb2R1bGVzL2dvdnVrLWZyb250ZW5kL3NyYy9nb3Z1ay9jb21wb25lbnRzL3Bhc3N3b3JkLWlucHV0L3Bhc3N3b3JkLWlucHV0Lm1qcyIsIndlYnBhY2s6Ly8vLi4vLi4vbm9kZV9tb2R1bGVzL2dvdnVrLWZyb250ZW5kL3NyYy9nb3Z1ay9jb21wb25lbnRzL3JhZGlvcy9yYWRpb3MubWpzIiwid2VicGFjazovLy8uLi8uLi9ub2RlX21vZHVsZXMvZ292dWstZnJvbnRlbmQvc3JjL2dvdnVrL2NvbXBvbmVudHMvc2VydmljZS1uYXZpZ2F0aW9uL3NlcnZpY2UtbmF2aWdhdGlvbi5tanMiLCJ3ZWJwYWNrOi8vLy4uLy4uL25vZGVfbW9kdWxlcy9nb3Z1ay1mcm9udGVuZC9zcmMvZ292dWsvY29tcG9uZW50cy9za2lwLWxpbmsvc2tpcC1saW5rLm1qcyIsIndlYnBhY2s6Ly8vLi4vLi4vbm9kZV9tb2R1bGVzL2dvdnVrLWZyb250ZW5kL3NyYy9nb3Z1ay9jb21wb25lbnRzL3RhYnMvdGFicy5tanMiLCJ3ZWJwYWNrOi8vLy4uLy4uL25vZGVfbW9kdWxlcy9nb3Z1ay1mcm9udGVuZC9zcmMvZ292dWsvZXJyb3JzL2luZGV4Lm1qcyIsIndlYnBhY2s6Ly8vLi4vLi4vbm9kZV9tb2R1bGVzL2dvdnVrLWZyb250ZW5kL3NyYy9nb3Z1ay9pMThuLm1qcyIsIndlYnBhY2s6Ly8vLi4vLi4vbm9kZV9tb2R1bGVzL2dvdnVrLWZyb250ZW5kL3NyYy9nb3Z1ay9pbml0Lm1qcyIsIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly8vLi9qYXZhc2NyaXB0cy9hcHBsaWNhdGlvbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFJldHVybnMgdGhlIHZhbHVlIG9mIHRoZSBnaXZlbiBhdHRyaWJ1dGUgY2xvc2VzdCB0byB0aGUgZ2l2ZW4gZWxlbWVudCAoaW5jbHVkaW5nIGl0c2VsZilcbiAqXG4gKiBAaW50ZXJuYWxcbiAqIEBwYXJhbSB7RWxlbWVudH0gJGVsZW1lbnQgLSBUaGUgZWxlbWVudCB0byBzdGFydCB3YWxraW5nIHRoZSBET00gdHJlZSB1cFxuICogQHBhcmFtIHtzdHJpbmd9IGF0dHJpYnV0ZU5hbWUgLSBUaGUgbmFtZSBvZiB0aGUgYXR0cmlidXRlXG4gKiBAcmV0dXJucyB7c3RyaW5nIHwgbnVsbH0gQXR0cmlidXRlIHZhbHVlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjbG9zZXN0QXR0cmlidXRlVmFsdWUoJGVsZW1lbnQsIGF0dHJpYnV0ZU5hbWUpIHtcbiAgY29uc3QgJGNsb3Nlc3RFbGVtZW50V2l0aEF0dHJpYnV0ZSA9ICRlbGVtZW50LmNsb3Nlc3QoYFske2F0dHJpYnV0ZU5hbWV9XWApXG4gIHJldHVybiAkY2xvc2VzdEVsZW1lbnRXaXRoQXR0cmlidXRlXG4gICAgPyAkY2xvc2VzdEVsZW1lbnRXaXRoQXR0cmlidXRlLmdldEF0dHJpYnV0ZShhdHRyaWJ1dGVOYW1lKVxuICAgIDogbnVsbFxufVxuIiwiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnLi4vY29tcG9uZW50Lm1qcydcbmltcG9ydCB7IENvbmZpZ0Vycm9yIH0gZnJvbSAnLi4vZXJyb3JzL2luZGV4Lm1qcydcblxuaW1wb3J0IHsgaXNPYmplY3QsIGZvcm1hdEVycm9yTWVzc2FnZSB9IGZyb20gJy4vaW5kZXgubWpzJ1xuXG5leHBvcnQgY29uc3QgY29uZmlnT3ZlcnJpZGUgPSBTeW1ib2wuZm9yKCdjb25maWdPdmVycmlkZScpXG5cbi8qKlxuICogQmFzZSBDb21wb25lbnQgY2xhc3NcbiAqXG4gKiBDZW50cmFsaXNlcyB0aGUgYmVoYXZpb3VycyBzaGFyZWQgYnkgb3VyIGNvbXBvbmVudHNcbiAqXG4gKiBAdmlydHVhbFxuICogQHRlbXBsYXRlIHtQYXJ0aWFsPFJlY29yZDxrZXlvZiBDb25maWd1cmF0aW9uVHlwZSwgdW5rbm93bj4+fSBbQ29uZmlndXJhdGlvblR5cGU9T2JqZWN0TmVzdGVkXVxuICogQHRlbXBsYXRlIHtFbGVtZW50ICYgeyBkYXRhc2V0OiBET01TdHJpbmdNYXAgfX0gW1Jvb3RFbGVtZW50VHlwZT1IVE1MRWxlbWVudF1cbiAqIEBhdWdtZW50cyBDb21wb25lbnQ8Um9vdEVsZW1lbnRUeXBlPlxuICovXG5leHBvcnQgY2xhc3MgQ29uZmlndXJhYmxlQ29tcG9uZW50IGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgLyoqXG4gICAqIGNvbmZpZ092ZXJyaWRlXG4gICAqXG4gICAqIEZ1bmN0aW9uIHdoaWNoIGRlZmluZXMgY29uZmlndXJhdGlvbiBvdmVycmlkZXMgdG8gcHJpb3JpdGl6ZVxuICAgKiBwcm9wZXJ0aWVzIGZyb20gdGhlIHJvb3QgZWxlbWVudCdzIGRhdGFzZXQuXG4gICAqXG4gICAqIEl0IHNob3VsZCB0YWtlIGEgc3Vic2V0IG9mIGNvbmZpZ3VyYXRpb24gYXMgaW5wdXQgYW5kIHJldHVyblxuICAgKiBhIG5ldyBjb25maWd1cmF0aW9uIG9iamVjdCB3aXRoIHByb3BlcnRpZXMgdGhhdCBzaG91bGQgYmVcbiAgICogb3ZlcnJpZGRlbiBiYXNlZCBvbiB0aGUgcm9vdCBlbGVtZW50J3MgZGF0YXNldC4gQSBTeW1ib2xcbiAgICogaXMgdXNlZCBmb3IgaW5kZXhpbmcgdG8gcHJldmVudCBjb25mbGljdHMuXG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKiBAdmlydHVhbFxuICAgKiBAcGFyYW0ge1BhcnRpYWw8Q29uZmlndXJhdGlvblR5cGU+fSBbcGFyYW1dIC0gQ29uZmlndXJhdGlvbiBvYmplY3RcbiAgICogQHJldHVybnMge1BhcnRpYWw8Q29uZmlndXJhdGlvblR5cGU+fSByZXR1cm4gLSBDb25maWd1cmF0aW9uIG9iamVjdFxuICAgKi9cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby11bnVzZWQtdmFyc1xuICBbY29uZmlnT3ZlcnJpZGVdKHBhcmFtKSB7XG4gICAgcmV0dXJuIHt9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgcm9vdCBlbGVtZW50IG9mIHRoZSBjb21wb25lbnRcbiAgICpcbiAgICogQHByb3RlY3RlZFxuICAgKiBAcmV0dXJucyB7Q29uZmlndXJhdGlvblR5cGV9IC0gdGhlIHJvb3QgZWxlbWVudCBvZiBjb21wb25lbnRcbiAgICovXG4gIGdldCBjb25maWcoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbmZpZ1xuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIEB0eXBlIHtDb25maWd1cmF0aW9uVHlwZX1cbiAgICovXG4gIF9jb25maWdcblxuICAvKipcbiAgICogQ29uc3RydWN0cyBhIG5ldyBjb21wb25lbnQsIHZhbGlkYXRpbmcgdGhhdCBHT1YuVUsgRnJvbnRlbmQgaXMgc3VwcG9ydGVkXG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKiBAcGFyYW0ge0VsZW1lbnQgfCBudWxsfSBbJHJvb3RdIC0gSFRNTCBlbGVtZW50IHRvIHVzZSBmb3IgY29tcG9uZW50XG4gICAqIEBwYXJhbSB7Q29uZmlndXJhdGlvblR5cGV9IFtjb25maWddIC0gSFRNTCBlbGVtZW50IHRvIHVzZSBmb3IgY29tcG9uZW50XG4gICAqL1xuICBjb25zdHJ1Y3Rvcigkcm9vdCwgY29uZmlnKSB7XG4gICAgc3VwZXIoJHJvb3QpXG5cbiAgICBjb25zdCBjaGlsZENvbnN0cnVjdG9yID1cbiAgICAgIC8qKiBAdHlwZSB7Q2hpbGRDbGFzc0NvbnN0cnVjdG9yPENvbmZpZ3VyYXRpb25UeXBlPn0gKi8gKHRoaXMuY29uc3RydWN0b3IpXG5cbiAgICBpZiAoIWlzT2JqZWN0KGNoaWxkQ29uc3RydWN0b3IuZGVmYXVsdHMpKSB7XG4gICAgICB0aHJvdyBuZXcgQ29uZmlnRXJyb3IoXG4gICAgICAgIGZvcm1hdEVycm9yTWVzc2FnZShcbiAgICAgICAgICBjaGlsZENvbnN0cnVjdG9yLFxuICAgICAgICAgICdDb25maWcgcGFzc2VkIGFzIHBhcmFtZXRlciBpbnRvIGNvbnN0cnVjdG9yIGJ1dCBubyBkZWZhdWx0cyBkZWZpbmVkJ1xuICAgICAgICApXG4gICAgICApXG4gICAgfVxuXG4gICAgY29uc3QgZGF0YXNldENvbmZpZyA9IC8qKiBAdHlwZSB7Q29uZmlndXJhdGlvblR5cGV9ICovIChcbiAgICAgIG5vcm1hbGlzZURhdGFzZXQoY2hpbGRDb25zdHJ1Y3RvciwgdGhpcy5fJHJvb3QuZGF0YXNldClcbiAgICApXG5cbiAgICB0aGlzLl9jb25maWcgPSAvKiogQHR5cGUge0NvbmZpZ3VyYXRpb25UeXBlfSAqLyAoXG4gICAgICBtZXJnZUNvbmZpZ3MoXG4gICAgICAgIGNoaWxkQ29uc3RydWN0b3IuZGVmYXVsdHMsXG4gICAgICAgIGNvbmZpZyA/PyB7fSxcbiAgICAgICAgdGhpc1tjb25maWdPdmVycmlkZV0oZGF0YXNldENvbmZpZyksXG4gICAgICAgIGRhdGFzZXRDb25maWdcbiAgICAgIClcbiAgICApXG4gIH1cbn1cblxuLyoqXG4gKiBOb3JtYWxpc2Ugc3RyaW5nXG4gKlxuICogJ0lmIGl0IGxvb2tzIGxpa2UgYSBkdWNrLCBhbmQgaXQgcXVhY2tzIGxpa2UgYSBkdWNr4oCmJyDwn6aGXG4gKlxuICogSWYgdGhlIHBhc3NlZCB2YWx1ZSBsb29rcyBsaWtlIGEgYm9vbGVhbiBvciBhIG51bWJlciwgY29udmVydCBpdCB0byBhIGJvb2xlYW5cbiAqIG9yIG51bWJlci5cbiAqXG4gKiBEZXNpZ25lZCB0byBiZSB1c2VkIHRvIGNvbnZlcnQgY29uZmlnIHBhc3NlZCB2aWEgZGF0YSBhdHRyaWJ1dGVzICh3aGljaCBhcmVcbiAqIGFsd2F5cyBzdHJpbmdzKSBpbnRvIHNvbWV0aGluZyBzZW5zaWJsZS5cbiAqXG4gKiBAaW50ZXJuYWxcbiAqIEBwYXJhbSB7RE9NU3RyaW5nTWFwW3N0cmluZ119IHZhbHVlIC0gVGhlIHZhbHVlIHRvIG5vcm1hbGlzZVxuICogQHBhcmFtIHtTY2hlbWFQcm9wZXJ0eX0gW3Byb3BlcnR5XSAtIENvbXBvbmVudCBzY2hlbWEgcHJvcGVydHlcbiAqIEByZXR1cm5zIHtzdHJpbmcgfCBib29sZWFuIHwgbnVtYmVyIHwgdW5kZWZpbmVkfSBOb3JtYWxpc2VkIGRhdGFcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGlzZVN0cmluZyh2YWx1ZSwgcHJvcGVydHkpIHtcbiAgY29uc3QgdHJpbW1lZFZhbHVlID0gdmFsdWUgPyB2YWx1ZS50cmltKCkgOiAnJ1xuXG4gIGxldCBvdXRwdXRcbiAgbGV0IG91dHB1dFR5cGUgPSBwcm9wZXJ0eT8udHlwZVxuXG4gIC8vIE5vIHNjaGVtYSB0eXBlIHNldD8gRGV0ZXJtaW5lIGF1dG9tYXRpY2FsbHlcbiAgaWYgKCFvdXRwdXRUeXBlKSB7XG4gICAgaWYgKFsndHJ1ZScsICdmYWxzZSddLmluY2x1ZGVzKHRyaW1tZWRWYWx1ZSkpIHtcbiAgICAgIG91dHB1dFR5cGUgPSAnYm9vbGVhbidcbiAgICB9XG5cbiAgICAvLyBFbXB0eSAvIHdoaXRlc3BhY2Utb25seSBzdHJpbmdzIGFyZSBjb25zaWRlcmVkIGZpbml0ZSBzbyB3ZSBuZWVkIHRvIGNoZWNrXG4gICAgLy8gdGhlIGxlbmd0aCBvZiB0aGUgdHJpbW1lZCBzdHJpbmcgYXMgd2VsbFxuICAgIGlmICh0cmltbWVkVmFsdWUubGVuZ3RoID4gMCAmJiBpc0Zpbml0ZShOdW1iZXIodHJpbW1lZFZhbHVlKSkpIHtcbiAgICAgIG91dHB1dFR5cGUgPSAnbnVtYmVyJ1xuICAgIH1cbiAgfVxuXG4gIHN3aXRjaCAob3V0cHV0VHlwZSkge1xuICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgb3V0cHV0ID0gdHJpbW1lZFZhbHVlID09PSAndHJ1ZSdcbiAgICAgIGJyZWFrXG5cbiAgICBjYXNlICdudW1iZXInOlxuICAgICAgb3V0cHV0ID0gTnVtYmVyKHRyaW1tZWRWYWx1ZSlcbiAgICAgIGJyZWFrXG5cbiAgICBkZWZhdWx0OlxuICAgICAgb3V0cHV0ID0gdmFsdWVcbiAgfVxuXG4gIHJldHVybiBvdXRwdXRcbn1cblxuLyoqXG4gKiBOb3JtYWxpc2UgZGF0YXNldFxuICpcbiAqIExvb3Agb3ZlciBhbiBvYmplY3QgYW5kIG5vcm1hbGlzZSBlYWNoIHZhbHVlIHVzaW5nIHtAbGluayBub3JtYWxpc2VTdHJpbmd9LFxuICogb3B0aW9uYWxseSBleHBhbmRpbmcgbmVzdGVkIGBpMThuLmZpZWxkYFxuICpcbiAqIEBpbnRlcm5hbFxuICogQHRlbXBsYXRlIHtQYXJ0aWFsPFJlY29yZDxrZXlvZiBDb25maWd1cmF0aW9uVHlwZSwgdW5rbm93bj4+fSBDb25maWd1cmF0aW9uVHlwZVxuICogQHRlbXBsYXRlIHtba2V5b2YgQ29uZmlndXJhdGlvblR5cGUsIFNjaGVtYVByb3BlcnR5IHwgdW5kZWZpbmVkXVtdfSBTY2hlbWFFbnRyeVR5cGVcbiAqIEBwYXJhbSB7eyBzY2hlbWE/OiBTY2hlbWE8Q29uZmlndXJhdGlvblR5cGU+LCBtb2R1bGVOYW1lOiBzdHJpbmcgfX0gQ29tcG9uZW50IC0gQ29tcG9uZW50IGNsYXNzXG4gKiBAcGFyYW0ge0RPTVN0cmluZ01hcH0gZGF0YXNldCAtIEhUTUwgZWxlbWVudCBkYXRhc2V0XG4gKiBAcmV0dXJucyB7T2JqZWN0TmVzdGVkfSBOb3JtYWxpc2VkIGRhdGFzZXRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGlzZURhdGFzZXQoQ29tcG9uZW50LCBkYXRhc2V0KSB7XG4gIGlmICghaXNPYmplY3QoQ29tcG9uZW50LnNjaGVtYSkpIHtcbiAgICB0aHJvdyBuZXcgQ29uZmlnRXJyb3IoXG4gICAgICBmb3JtYXRFcnJvck1lc3NhZ2UoXG4gICAgICAgIENvbXBvbmVudCxcbiAgICAgICAgJ0NvbmZpZyBwYXNzZWQgYXMgcGFyYW1ldGVyIGludG8gY29uc3RydWN0b3IgYnV0IG5vIHNjaGVtYSBkZWZpbmVkJ1xuICAgICAgKVxuICAgIClcbiAgfVxuXG4gIGNvbnN0IG91dCA9IC8qKiBAdHlwZSB7T2JqZWN0TmVzdGVkfSAqLyAoe30pXG4gIGNvbnN0IGVudHJpZXMgPSAvKiogQHR5cGUge1NjaGVtYUVudHJ5VHlwZX0gKi8gKFxuICAgIE9iamVjdC5lbnRyaWVzKENvbXBvbmVudC5zY2hlbWEucHJvcGVydGllcylcbiAgKVxuXG4gIC8vIE5vcm1hbGlzZSB0b3AtbGV2ZWwgZGF0YXNldCAoJ2RhdGEtKicpIHZhbHVlcyB1c2luZyBzY2hlbWEgdHlwZXNcbiAgZm9yIChjb25zdCBlbnRyeSBvZiBlbnRyaWVzKSB7XG4gICAgY29uc3QgW25hbWVzcGFjZSwgcHJvcGVydHldID0gZW50cnlcblxuICAgIC8vIENhc3QgdGhlIGBuYW1lc3BhY2VgIHRvIHN0cmluZyBzbyBpdCBjYW4gYmUgdXNlZCB0byBhY2Nlc3MgdGhlIGRhdGFzZXRcbiAgICBjb25zdCBmaWVsZCA9IG5hbWVzcGFjZS50b1N0cmluZygpXG5cbiAgICBpZiAoZmllbGQgaW4gZGF0YXNldCkge1xuICAgICAgb3V0W2ZpZWxkXSA9IG5vcm1hbGlzZVN0cmluZyhkYXRhc2V0W2ZpZWxkXSwgcHJvcGVydHkpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXh0cmFjdCBhbmQgbm9ybWFsaXNlIG5lc3RlZCBvYmplY3QgdmFsdWVzIGF1dG9tYXRpY2FsbHkgdXNpbmdcbiAgICAgKiB7QGxpbmsgbm9ybWFsaXNlU3RyaW5nfSBidXQgb25seSBzY2hlbWEgb2JqZWN0IHR5cGVzIGFyZSBhbGxvd2VkXG4gICAgICovXG4gICAgaWYgKHByb3BlcnR5Py50eXBlID09PSAnb2JqZWN0Jykge1xuICAgICAgb3V0W2ZpZWxkXSA9IGV4dHJhY3RDb25maWdCeU5hbWVzcGFjZShcbiAgICAgICAgQ29tcG9uZW50LnNjaGVtYSxcbiAgICAgICAgZGF0YXNldCxcbiAgICAgICAgbmFtZXNwYWNlXG4gICAgICApXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG91dFxufVxuXG4vKipcbiAqIENvbmZpZyBtZXJnaW5nIGZ1bmN0aW9uXG4gKlxuICogVGFrZXMgYW55IG51bWJlciBvZiBvYmplY3RzIGFuZCBjb21iaW5lcyB0aGVtIHRvZ2V0aGVyLCB3aXRoXG4gKiBncmVhdGVzdCBwcmlvcml0eSBvbiB0aGUgTEFTVCBpdGVtIHBhc3NlZCBpbi5cbiAqXG4gKiBAaW50ZXJuYWxcbiAqIEBwYXJhbSB7Li4ueyBba2V5OiBzdHJpbmddOiB1bmtub3duIH19IGNvbmZpZ09iamVjdHMgLSBDb25maWcgb2JqZWN0cyB0byBtZXJnZVxuICogQHJldHVybnMge3sgW2tleTogc3RyaW5nXTogdW5rbm93biB9fSBBIG1lcmdlZCBjb25maWcgb2JqZWN0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtZXJnZUNvbmZpZ3MoLi4uY29uZmlnT2JqZWN0cykge1xuICAvLyBTdGFydCB3aXRoIGFuIGVtcHR5IG9iamVjdCBhcyBvdXIgYmFzZVxuICAvKiogQHR5cGUge3sgW2tleTogc3RyaW5nXTogdW5rbm93biB9fSAqL1xuICBjb25zdCBmb3JtYXR0ZWRDb25maWdPYmplY3QgPSB7fVxuXG4gIC8vIExvb3AgdGhyb3VnaCBlYWNoIG9mIHRoZSBwYXNzZWQgb2JqZWN0c1xuICBmb3IgKGNvbnN0IGNvbmZpZ09iamVjdCBvZiBjb25maWdPYmplY3RzKSB7XG4gICAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXMoY29uZmlnT2JqZWN0KSkge1xuICAgICAgY29uc3Qgb3B0aW9uID0gZm9ybWF0dGVkQ29uZmlnT2JqZWN0W2tleV1cbiAgICAgIGNvbnN0IG92ZXJyaWRlID0gY29uZmlnT2JqZWN0W2tleV1cblxuICAgICAgLy8gUHVzaCB0aGVpciBrZXlzIG9uZS1ieS1vbmUgaW50byBmb3JtYXR0ZWRDb25maWdPYmplY3QuIEFueSBkdXBsaWNhdGVcbiAgICAgIC8vIGtleXMgd2l0aCBvYmplY3QgdmFsdWVzIHdpbGwgYmUgbWVyZ2VkLCBvdGhlcndpc2UgdGhlIG5ldyB2YWx1ZSB3aWxsXG4gICAgICAvLyBvdmVycmlkZSB0aGUgZXhpc3RpbmcgdmFsdWUuXG4gICAgICBpZiAoaXNPYmplY3Qob3B0aW9uKSAmJiBpc09iamVjdChvdmVycmlkZSkpIHtcbiAgICAgICAgZm9ybWF0dGVkQ29uZmlnT2JqZWN0W2tleV0gPSBtZXJnZUNvbmZpZ3Mob3B0aW9uLCBvdmVycmlkZSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEFwcGx5IG92ZXJyaWRlXG4gICAgICAgIGZvcm1hdHRlZENvbmZpZ09iamVjdFtrZXldID0gb3ZlcnJpZGVcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gZm9ybWF0dGVkQ29uZmlnT2JqZWN0XG59XG5cbi8qKlxuICogVmFsaWRhdGUgY29tcG9uZW50IGNvbmZpZyBieSBzY2hlbWFcbiAqXG4gKiBGb2xsb3dzIGxpbWl0ZWQgZXhhbXBsZXMgaW4gSlNPTiBzY2hlbWEgZm9yIHdpZGVyIHN1cHBvcnQgaW4gZnV0dXJlXG4gKlxuICoge0BsaW5rIGh0dHBzOi8vYWp2LmpzLm9yZy9qc29uLXNjaGVtYS5odG1sI2NvbXBvdW5kLWtleXdvcmRzfVxuICoge0BsaW5rIGh0dHBzOi8vYWp2LmpzLm9yZy9wYWNrYWdlcy9hanYtZXJyb3JzLmh0bWwjc2luZ2xlLW1lc3NhZ2V9XG4gKlxuICogQGludGVybmFsXG4gKiBAdGVtcGxhdGUge1BhcnRpYWw8UmVjb3JkPGtleW9mIENvbmZpZ3VyYXRpb25UeXBlLCB1bmtub3duPj59IENvbmZpZ3VyYXRpb25UeXBlXG4gKiBAcGFyYW0ge1NjaGVtYTxDb25maWd1cmF0aW9uVHlwZT59IHNjaGVtYSAtIFRoZSBzY2hlbWEgb2YgYSBjb21wb25lbnRcbiAqIEBwYXJhbSB7Q29uZmlndXJhdGlvblR5cGV9IGNvbmZpZyAtIENvbXBvbmVudCBjb25maWdcbiAqIEByZXR1cm5zIHtzdHJpbmdbXX0gTGlzdCBvZiB2YWxpZGF0aW9uIGVycm9yc1xuICovXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVDb25maWcoc2NoZW1hLCBjb25maWcpIHtcbiAgY29uc3QgdmFsaWRhdGlvbkVycm9ycyA9IFtdXG5cbiAgLy8gQ2hlY2sgZXJyb3JzIGZvciBlYWNoIHNjaGVtYVxuICBmb3IgKGNvbnN0IFtuYW1lLCBjb25kaXRpb25zXSBvZiBPYmplY3QuZW50cmllcyhzY2hlbWEpKSB7XG4gICAgY29uc3QgZXJyb3JzID0gW11cblxuICAgIC8vIENoZWNrIGVycm9ycyBmb3IgZWFjaCBzY2hlbWEgY29uZGl0aW9uXG4gICAgaWYgKEFycmF5LmlzQXJyYXkoY29uZGl0aW9ucykpIHtcbiAgICAgIGZvciAoY29uc3QgeyByZXF1aXJlZCwgZXJyb3JNZXNzYWdlIH0gb2YgY29uZGl0aW9ucykge1xuICAgICAgICBpZiAoIXJlcXVpcmVkLmV2ZXJ5KChrZXkpID0+ICEhY29uZmlnW2tleV0pKSB7XG4gICAgICAgICAgZXJyb3JzLnB1c2goZXJyb3JNZXNzYWdlKSAvLyBNaXNzaW5nIGNvbmZpZyBrZXkgdmFsdWVcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBDaGVjayBvbmUgY29uZGl0aW9uIHBhc3NlcyBvciBhZGQgZXJyb3JzXG4gICAgICBpZiAobmFtZSA9PT0gJ2FueU9mJyAmJiAhKGNvbmRpdGlvbnMubGVuZ3RoIC0gZXJyb3JzLmxlbmd0aCA+PSAxKSkge1xuICAgICAgICB2YWxpZGF0aW9uRXJyb3JzLnB1c2goLi4uZXJyb3JzKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB2YWxpZGF0aW9uRXJyb3JzXG59XG5cbi8qKlxuICogRXh0cmFjdHMga2V5cyBzdGFydGluZyB3aXRoIGEgcGFydGljdWxhciBuYW1lc3BhY2UgZnJvbSBkYXRhc2V0ICgnZGF0YS0qJylcbiAqIG9iamVjdCwgcmVtb3ZpbmcgdGhlIG5hbWVzcGFjZSBpbiB0aGUgcHJvY2Vzcywgbm9ybWFsaXNpbmcgYWxsIHZhbHVlc1xuICpcbiAqIEBpbnRlcm5hbFxuICogQHRlbXBsYXRlIHtQYXJ0aWFsPFJlY29yZDxrZXlvZiBDb25maWd1cmF0aW9uVHlwZSwgdW5rbm93bj4+fSBDb25maWd1cmF0aW9uVHlwZVxuICogQHBhcmFtIHtTY2hlbWE8Q29uZmlndXJhdGlvblR5cGU+fSBzY2hlbWEgLSBUaGUgc2NoZW1hIG9mIGEgY29tcG9uZW50XG4gKiBAcGFyYW0ge0RPTVN0cmluZ01hcH0gZGF0YXNldCAtIFRoZSBvYmplY3QgdG8gZXh0cmFjdCBrZXktdmFsdWUgcGFpcnMgZnJvbVxuICogQHBhcmFtIHtrZXlvZiBDb25maWd1cmF0aW9uVHlwZX0gbmFtZXNwYWNlIC0gVGhlIG5hbWVzcGFjZSB0byBmaWx0ZXIga2V5cyB3aXRoXG4gKiBAcmV0dXJucyB7T2JqZWN0TmVzdGVkIHwgdW5kZWZpbmVkfSBOZXN0ZWQgb2JqZWN0IHdpdGggZG90LXNlcGFyYXRlZCBrZXkgbmFtZXNwYWNlIHJlbW92ZWRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGV4dHJhY3RDb25maWdCeU5hbWVzcGFjZShzY2hlbWEsIGRhdGFzZXQsIG5hbWVzcGFjZSkge1xuICBjb25zdCBwcm9wZXJ0eSA9IHNjaGVtYS5wcm9wZXJ0aWVzW25hbWVzcGFjZV1cblxuICAvLyBPbmx5IGV4dHJhY3QgY29uZmlncyBmb3Igb2JqZWN0IHNjaGVtYSBwcm9wZXJ0aWVzXG4gIGlmIChwcm9wZXJ0eT8udHlwZSAhPT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm5cbiAgfVxuXG4gIC8vIEFkZCBkZWZhdWx0IGVtcHR5IGNvbmZpZ1xuICBjb25zdCBuZXdPYmplY3QgPSAvKiogQHR5cGUge1JlY29yZDx0eXBlb2YgbmFtZXNwYWNlLCBPYmplY3ROZXN0ZWQ+fSAqLyAoe1xuICAgIFtuYW1lc3BhY2VdOiB7fVxuICB9KVxuXG4gIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKGRhdGFzZXQpKSB7XG4gICAgLyoqIEB0eXBlIHtPYmplY3ROZXN0ZWQgfCBPYmplY3ROZXN0ZWRbTmVzdGVkS2V5XX0gKi9cbiAgICBsZXQgY3VycmVudCA9IG5ld09iamVjdFxuXG4gICAgLy8gU3BsaXQgdGhlIGtleSBpbnRvIHBhcnRzLCB1c2luZyAuIGFzIG91ciBuYW1lc3BhY2Ugc2VwYXJhdG9yXG4gICAgY29uc3Qga2V5UGFydHMgPSBrZXkuc3BsaXQoJy4nKVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIG5ldyBsZXZlbCBwZXIgcGFydFxuICAgICAqXG4gICAgICogZS5nLiAnaTE4bi50ZXh0YXJlYURlc2NyaXB0aW9uLm90aGVyJyBiZWNvbWVzXG4gICAgICogYHsgaTE4bjogeyB0ZXh0YXJlYURlc2NyaXB0aW9uOiB7IG90aGVyIH0gfSB9YFxuICAgICAqL1xuICAgIGZvciAoY29uc3QgW2luZGV4LCBuYW1lXSBvZiBrZXlQYXJ0cy5lbnRyaWVzKCkpIHtcbiAgICAgIGlmIChpc09iamVjdChjdXJyZW50KSkge1xuICAgICAgICAvLyBEcm9wIGRvd24gdG8gbmVzdGVkIG9iamVjdCB1bnRpbCB0aGUgbGFzdCBwYXJ0XG4gICAgICAgIGlmIChpbmRleCA8IGtleVBhcnRzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAvLyBOZXcgbmVzdGVkIG9iamVjdCAob3B0aW9uYWxseSkgcmVwbGFjZXMgZXhpc3RpbmcgdmFsdWVcbiAgICAgICAgICBpZiAoIWlzT2JqZWN0KGN1cnJlbnRbbmFtZV0pKSB7XG4gICAgICAgICAgICBjdXJyZW50W25hbWVdID0ge31cbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBEcm9wIGRvd24gaW50byBuZXcgb3IgZXhpc3RpbmcgbmVzdGVkIG9iamVjdFxuICAgICAgICAgIGN1cnJlbnQgPSBjdXJyZW50W25hbWVdXG4gICAgICAgIH0gZWxzZSBpZiAoa2V5ICE9PSBuYW1lc3BhY2UpIHtcbiAgICAgICAgICAvLyBOb3JtYWxpc2VkIHZhbHVlIChvcHRpb25hbGx5KSByZXBsYWNlcyBleGlzdGluZyB2YWx1ZVxuICAgICAgICAgIGN1cnJlbnRbbmFtZV0gPSBub3JtYWxpc2VTdHJpbmcodmFsdWUpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gbmV3T2JqZWN0W25hbWVzcGFjZV1cbn1cblxuLyoqXG4gKiBAaW50ZXJuYWxcbiAqIEB0eXBlZGVmIHtrZXlvZiBPYmplY3ROZXN0ZWR9IE5lc3RlZEtleVxuICogQHR5cGVkZWYge3sgW2tleTogc3RyaW5nXTogc3RyaW5nIHwgYm9vbGVhbiB8IG51bWJlciB8IE9iamVjdE5lc3RlZCB8IHVuZGVmaW5lZCB9fSBPYmplY3ROZXN0ZWRcbiAqL1xuXG4vKipcbiAqIFNjaGVtYSBmb3IgY29tcG9uZW50IGNvbmZpZ1xuICpcbiAqIEB0ZW1wbGF0ZSB7UGFydGlhbDxSZWNvcmQ8a2V5b2YgQ29uZmlndXJhdGlvblR5cGUsIHVua25vd24+Pn0gQ29uZmlndXJhdGlvblR5cGVcbiAqIEB0eXBlZGVmIHtvYmplY3R9IFNjaGVtYVxuICogQHByb3BlcnR5IHtSZWNvcmQ8a2V5b2YgQ29uZmlndXJhdGlvblR5cGUsIFNjaGVtYVByb3BlcnR5IHwgdW5kZWZpbmVkPn0gcHJvcGVydGllcyAtIFNjaGVtYSBwcm9wZXJ0aWVzXG4gKiBAcHJvcGVydHkge1NjaGVtYUNvbmRpdGlvbjxDb25maWd1cmF0aW9uVHlwZT5bXX0gW2FueU9mXSAtIExpc3Qgb2Ygc2NoZW1hIGNvbmRpdGlvbnNcbiAqL1xuXG4vKipcbiAqIFNjaGVtYSBwcm9wZXJ0eSBmb3IgY29tcG9uZW50IGNvbmZpZ1xuICpcbiAqIEB0eXBlZGVmIHtvYmplY3R9IFNjaGVtYVByb3BlcnR5XG4gKiBAcHJvcGVydHkgeydzdHJpbmcnIHwgJ2Jvb2xlYW4nIHwgJ251bWJlcicgfCAnb2JqZWN0J30gdHlwZSAtIFByb3BlcnR5IHR5cGVcbiAqL1xuXG4vKipcbiAqIFNjaGVtYSBjb25kaXRpb24gZm9yIGNvbXBvbmVudCBjb25maWdcbiAqXG4gKiBAdGVtcGxhdGUge1BhcnRpYWw8UmVjb3JkPGtleW9mIENvbmZpZ3VyYXRpb25UeXBlLCB1bmtub3duPj59IENvbmZpZ3VyYXRpb25UeXBlXG4gKiBAdHlwZWRlZiB7b2JqZWN0fSBTY2hlbWFDb25kaXRpb25cbiAqIEBwcm9wZXJ0eSB7KGtleW9mIENvbmZpZ3VyYXRpb25UeXBlKVtdfSByZXF1aXJlZCAtIExpc3Qgb2YgcmVxdWlyZWQgY29uZmlnIGZpZWxkc1xuICogQHByb3BlcnR5IHtzdHJpbmd9IGVycm9yTWVzc2FnZSAtIEVycm9yIG1lc3NhZ2Ugd2hlbiByZXF1aXJlZCBjb25maWcgZmllbGRzIG5vdCBwcm92aWRlZFxuICovXG5cbi8qKlxuICogQHRlbXBsYXRlIHtQYXJ0aWFsPFJlY29yZDxrZXlvZiBDb25maWd1cmF0aW9uVHlwZSwgdW5rbm93bj4+fSBbQ29uZmlndXJhdGlvblR5cGU9T2JqZWN0TmVzdGVkXVxuICogQHR5cGVkZWYgQ2hpbGRDbGFzc1xuICogQHByb3BlcnR5IHtzdHJpbmd9IG1vZHVsZU5hbWUgLSBUaGUgbW9kdWxlIG5hbWUgdGhhdCdsbCBiZSBsb29rZWQgZm9yIGluIHRoZSBET00gd2hlbiBpbml0aWFsaXNpbmcgdGhlIGNvbXBvbmVudFxuICogQHByb3BlcnR5IHtTY2hlbWE8Q29uZmlndXJhdGlvblR5cGU+fSBbc2NoZW1hXSAtIFRoZSBzY2hlbWEgb2YgdGhlIGNvbXBvbmVudCBjb25maWd1cmF0aW9uXG4gKiBAcHJvcGVydHkge0NvbmZpZ3VyYXRpb25UeXBlfSBbZGVmYXVsdHNdIC0gVGhlIGRlZmF1bHQgdmFsdWVzIG9mIHRoZSBjb25maWd1cmF0aW9uIG9mIHRoZSBjb21wb25lbnRcbiAqL1xuXG4vKipcbiAqIEB0ZW1wbGF0ZSB7UGFydGlhbDxSZWNvcmQ8a2V5b2YgQ29uZmlndXJhdGlvblR5cGUsIHVua25vd24+Pn0gW0NvbmZpZ3VyYXRpb25UeXBlPU9iamVjdE5lc3RlZF1cbiAqIEB0eXBlZGVmIHt0eXBlb2YgQ29tcG9uZW50ICYgQ2hpbGRDbGFzczxDb25maWd1cmF0aW9uVHlwZT59IENoaWxkQ2xhc3NDb25zdHJ1Y3RvcjxDb25maWd1cmF0aW9uVHlwZT5cbiAqL1xuIiwiLyoqXG4gKiBDb21tb24gaGVscGVycyB3aGljaCBkbyBub3QgcmVxdWlyZSBwb2x5ZmlsbC5cbiAqXG4gKiBJTVBPUlRBTlQ6IElmIGEgaGVscGVyIHJlcXVpcmUgYSBwb2x5ZmlsbCwgcGxlYXNlIGlzb2xhdGUgaXQgaW4gaXRzIG93biBtb2R1bGVcbiAqIHNvIHRoYXQgdGhlIHBvbHlmaWxsIGNhbiBiZSBwcm9wZXJseSB0cmVlLXNoYWtlbiBhbmQgZG9lcyBub3QgYnVyZGVuXG4gKiB0aGUgY29tcG9uZW50cyB0aGF0IGRvIG5vdCBuZWVkIHRoYXQgaGVscGVyXG4gKi9cblxuLyoqXG4gKiBHZXQgaGFzaCBmcmFnbWVudCBmcm9tIFVSTFxuICpcbiAqIEV4dHJhY3QgdGhlIGhhc2ggZnJhZ21lbnQgKGV2ZXJ5dGhpbmcgYWZ0ZXIgdGhlIGhhc2gpIGZyb20gYSBVUkwsXG4gKiBidXQgbm90IGluY2x1ZGluZyB0aGUgaGFzaCBzeW1ib2xcbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtzdHJpbmd9IHVybCAtIFVSTFxuICogQHJldHVybnMge3N0cmluZyB8IHVuZGVmaW5lZH0gRnJhZ21lbnQgZnJvbSBVUkwsIHdpdGhvdXQgdGhlIGhhc2hcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEZyYWdtZW50RnJvbVVybCh1cmwpIHtcbiAgaWYgKCF1cmwuaW5jbHVkZXMoJyMnKSkge1xuICAgIHJldHVybiB1bmRlZmluZWRcbiAgfVxuXG4gIHJldHVybiB1cmwuc3BsaXQoJyMnKS5wb3AoKVxufVxuXG4vKipcbiAqIEdldCBHT1YuVUsgRnJvbnRlbmQgYnJlYWtwb2ludCB2YWx1ZSBmcm9tIENTUyBjdXN0b20gcHJvcGVydHlcbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBCcmVha3BvaW50IG5hbWVcbiAqIEByZXR1cm5zIHt7IHByb3BlcnR5OiBzdHJpbmcsIHZhbHVlPzogc3RyaW5nIH19IEJyZWFrcG9pbnQgb2JqZWN0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRCcmVha3BvaW50KG5hbWUpIHtcbiAgY29uc3QgcHJvcGVydHkgPSBgLS1nb3Z1ay1icmVha3BvaW50LSR7bmFtZX1gXG5cbiAgLy8gR2V0IHZhbHVlIGZyb20gYDxodG1sPmAgd2l0aCBicmVha3BvaW50cyBvbiBDU1MgOnJvb3RcbiAgY29uc3QgdmFsdWUgPSB3aW5kb3dcbiAgICAuZ2V0Q29tcHV0ZWRTdHlsZShkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpXG4gICAgLmdldFByb3BlcnR5VmFsdWUocHJvcGVydHkpXG5cbiAgcmV0dXJuIHtcbiAgICBwcm9wZXJ0eSxcbiAgICB2YWx1ZTogdmFsdWUgfHwgdW5kZWZpbmVkXG4gIH1cbn1cblxuLyoqXG4gKiBNb3ZlIGZvY3VzIHRvIGVsZW1lbnRcbiAqXG4gKiBTZXRzIHRhYmluZGV4IHRvIC0xIHRvIG1ha2UgdGhlIGVsZW1lbnQgcHJvZ3JhbW1hdGljYWxseSBmb2N1c2FibGUsXG4gKiBidXQgcmVtb3ZlcyBpdCBvbiBibHVyIGFzIHRoZSBlbGVtZW50IGRvZXNuJ3QgbmVlZCB0byBiZSBmb2N1c2VkIGFnYWluLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAdGVtcGxhdGUge0hUTUxFbGVtZW50fSBGb2N1c0VsZW1lbnRcbiAqIEBwYXJhbSB7Rm9jdXNFbGVtZW50fSAkZWxlbWVudCAtIEhUTUwgZWxlbWVudFxuICogQHBhcmFtIHtvYmplY3R9IFtvcHRpb25zXSAtIEhhbmRsZXIgb3B0aW9uc1xuICogQHBhcmFtIHtmdW5jdGlvbih0aGlzOiBGb2N1c0VsZW1lbnQpOiB2b2lkfSBbb3B0aW9ucy5vbkJlZm9yZUZvY3VzXSAtIENhbGxiYWNrIGJlZm9yZSBmb2N1c1xuICogQHBhcmFtIHtmdW5jdGlvbih0aGlzOiBGb2N1c0VsZW1lbnQpOiB2b2lkfSBbb3B0aW9ucy5vbkJsdXJdIC0gQ2FsbGJhY2sgb24gYmx1clxuICovXG5leHBvcnQgZnVuY3Rpb24gc2V0Rm9jdXMoJGVsZW1lbnQsIG9wdGlvbnMgPSB7fSkge1xuICBjb25zdCBpc0ZvY3VzYWJsZSA9ICRlbGVtZW50LmdldEF0dHJpYnV0ZSgndGFiaW5kZXgnKVxuXG4gIGlmICghaXNGb2N1c2FibGUpIHtcbiAgICAkZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgJy0xJylcbiAgfVxuXG4gIC8qKlxuICAgKiBIYW5kbGUgZWxlbWVudCBmb2N1c1xuICAgKi9cbiAgZnVuY3Rpb24gb25Gb2N1cygpIHtcbiAgICAkZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgb25CbHVyLCB7IG9uY2U6IHRydWUgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBIYW5kbGUgZWxlbWVudCBibHVyXG4gICAqL1xuICBmdW5jdGlvbiBvbkJsdXIoKSB7XG4gICAgb3B0aW9ucy5vbkJsdXI/LmNhbGwoJGVsZW1lbnQpXG5cbiAgICBpZiAoIWlzRm9jdXNhYmxlKSB7XG4gICAgICAkZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoJ3RhYmluZGV4JylcbiAgICB9XG4gIH1cblxuICAvLyBBZGQgbGlzdGVuZXIgdG8gcmVzZXQgZWxlbWVudCBvbiBibHVyLCBhZnRlciBmb2N1c1xuICAkZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdmb2N1cycsIG9uRm9jdXMsIHsgb25jZTogdHJ1ZSB9KVxuXG4gIC8vIEZvY3VzIGVsZW1lbnRcbiAgb3B0aW9ucy5vbkJlZm9yZUZvY3VzPy5jYWxsKCRlbGVtZW50KVxuICAkZWxlbWVudC5mb2N1cygpXG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGNvbXBvbmVudCBpcyBhbHJlYWR5IGluaXRpYWxpc2VkXG4gKlxuICogQGludGVybmFsXG4gKiBAcGFyYW0ge0VsZW1lbnR9ICRyb290IC0gSFRNTCBlbGVtZW50IHRvIGJlIGNoZWNrZWRcbiAqIEBwYXJhbSB7c3RyaW5nfSBtb2R1bGVOYW1lIC0gbmFtZSBvZiBjb21wb25lbnQgbW9kdWxlXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gV2hldGhlciBjb21wb25lbnQgaXMgYWxyZWFkeSBpbml0aWFsaXNlZFxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNJbml0aWFsaXNlZCgkcm9vdCwgbW9kdWxlTmFtZSkge1xuICByZXR1cm4gKFxuICAgICRyb290IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgJiZcbiAgICAkcm9vdC5oYXNBdHRyaWJ1dGUoYGRhdGEtJHttb2R1bGVOYW1lfS1pbml0YClcbiAgKVxufVxuXG4vKipcbiAqIENoZWNrcyBpZiBHT1YuVUsgRnJvbnRlbmQgaXMgc3VwcG9ydGVkIG9uIHRoaXMgcGFnZVxuICpcbiAqIFNvbWUgYnJvd3NlcnMgd2lsbCBsb2FkIGFuZCBydW4gb3VyIEphdmFTY3JpcHQgYnV0IEdPVi5VSyBGcm9udGVuZFxuICogd29uJ3QgYmUgc3VwcG9ydGVkLlxuICpcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnQgfCBudWxsfSBbJHNjb3BlXSAtIChpbnRlcm5hbCkgYDxib2R5PmAgSFRNTCBlbGVtZW50IGNoZWNrZWQgZm9yIGJyb3dzZXIgc3VwcG9ydFxuICogQHJldHVybnMge2Jvb2xlYW59IFdoZXRoZXIgR09WLlVLIEZyb250ZW5kIGlzIHN1cHBvcnRlZCBvbiB0aGlzIHBhZ2VcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzU3VwcG9ydGVkKCRzY29wZSA9IGRvY3VtZW50LmJvZHkpIHtcbiAgaWYgKCEkc2NvcGUpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIHJldHVybiAkc2NvcGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdnb3Z1ay1mcm9udGVuZC1zdXBwb3J0ZWQnKVxufVxuXG4vKipcbiAqIENoZWNrIGZvciBhbiBhcnJheVxuICpcbiAqIEBpbnRlcm5hbFxuICogQHBhcmFtIHt1bmtub3dufSBvcHRpb24gLSBPcHRpb24gdG8gY2hlY2tcbiAqIEByZXR1cm5zIHtib29sZWFufSBXaGV0aGVyIHRoZSBvcHRpb24gaXMgYW4gYXJyYXlcbiAqL1xuZnVuY3Rpb24gaXNBcnJheShvcHRpb24pIHtcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkob3B0aW9uKVxufVxuXG4vKipcbiAqIENoZWNrIGZvciBhbiBvYmplY3RcbiAqXG4gKiBAaW50ZXJuYWxcbiAqIEB0ZW1wbGF0ZSB7UGFydGlhbDxSZWNvcmQ8a2V5b2YgT2JqZWN0VHlwZSwgdW5rbm93bj4+fSBbT2JqZWN0VHlwZT1PYmplY3ROZXN0ZWRdXG4gKiBAcGFyYW0ge3Vua25vd24gfCBPYmplY3RUeXBlfSBvcHRpb24gLSBPcHRpb24gdG8gY2hlY2tcbiAqIEByZXR1cm5zIHtvcHRpb24gaXMgT2JqZWN0VHlwZX0gV2hldGhlciB0aGUgb3B0aW9uIGlzIGFuIG9iamVjdFxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNPYmplY3Qob3B0aW9uKSB7XG4gIHJldHVybiAhIW9wdGlvbiAmJiB0eXBlb2Ygb3B0aW9uID09PSAnb2JqZWN0JyAmJiAhaXNBcnJheShvcHRpb24pXG59XG5cbi8qKlxuICogRm9ybWF0IGVycm9yIG1lc3NhZ2VcbiAqXG4gKiBAaW50ZXJuYWxcbiAqIEBwYXJhbSB7Q29tcG9uZW50V2l0aE1vZHVsZU5hbWV9IENvbXBvbmVudCAtIENvbXBvbmVudCB0aGF0IHRocmV3IHRoZSBlcnJvclxuICogQHBhcmFtIHtzdHJpbmd9IG1lc3NhZ2UgLSBFcnJvciBtZXNzYWdlXG4gKiBAcmV0dXJucyB7c3RyaW5nfSAtIEZvcm1hdHRlZCBlcnJvciBtZXNzYWdlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXRFcnJvck1lc3NhZ2UoQ29tcG9uZW50LCBtZXNzYWdlKSB7XG4gIHJldHVybiBgJHtDb21wb25lbnQubW9kdWxlTmFtZX06ICR7bWVzc2FnZX1gXG59XG5cbi8qIGVzbGludC1kaXNhYmxlIGpzZG9jL3ZhbGlkLXR5cGVzIC0tXG4gKiBge25ldyguLi5hcmdzOiBhbnlbXSApOiBvYmplY3R9YCBpcyBub3QgcmVjb2duaXNlZCBhcyB2YWxpZFxuICogaHR0cHM6Ly9naXRodWIuY29tL2dhanVzL2VzbGludC1wbHVnaW4tanNkb2MvaXNzdWVzLzE0NSNpc3N1ZWNvbW1lbnQtMTMwODcyMjg3OFxuICogaHR0cHM6Ly9naXRodWIuY29tL2pzZG9jLXR5cGUtcHJhdHQtcGFyc2VyL2pzZG9jLXR5cGUtcHJhdHQtcGFyc2VyL2lzc3Vlcy8xMzFcbiAqKi9cblxuLyoqXG4gKiBAdHlwZWRlZiBDb21wb25lbnRXaXRoTW9kdWxlTmFtZVxuICogQHByb3BlcnR5IHtzdHJpbmd9IG1vZHVsZU5hbWUgLSBOYW1lIG9mIHRoZSBjb21wb25lbnRcbiAqL1xuXG4vKiBlc2xpbnQtZW5hYmxlIGpzZG9jL3ZhbGlkLXR5cGVzICovXG5cbi8qKlxuICogQGltcG9ydCB7IE9iamVjdE5lc3RlZCB9IGZyb20gJy4vY29uZmlndXJhdGlvbi5tanMnXG4gKi9cbiIsImltcG9ydCB7IGlzSW5pdGlhbGlzZWQsIGlzU3VwcG9ydGVkIH0gZnJvbSAnLi9jb21tb24vaW5kZXgubWpzJ1xuaW1wb3J0IHsgRWxlbWVudEVycm9yLCBJbml0RXJyb3IsIFN1cHBvcnRFcnJvciB9IGZyb20gJy4vZXJyb3JzL2luZGV4Lm1qcydcblxuLyoqXG4gKiBCYXNlIENvbXBvbmVudCBjbGFzc1xuICpcbiAqIENlbnRyYWxpc2VzIHRoZSBiZWhhdmlvdXJzIHNoYXJlZCBieSBvdXIgY29tcG9uZW50c1xuICpcbiAqIEB2aXJ0dWFsXG4gKiBAdGVtcGxhdGUge0VsZW1lbnR9IFtSb290RWxlbWVudFR5cGU9SFRNTEVsZW1lbnRdXG4gKi9cbmV4cG9ydCBjbGFzcyBDb21wb25lbnQge1xuICAvKipcbiAgICogQHR5cGUge3R5cGVvZiBFbGVtZW50fVxuICAgKi9cbiAgc3RhdGljIGVsZW1lbnRUeXBlID0gSFRNTEVsZW1lbnRcblxuICAvLyBhbGxvd3MgVHlwZXNjcmlwdCB1c2VyIHRvIHdvcmsgYXJvdW5kIHRoZSBsYWNrIG9mIHR5cGVzXG4gIC8vIGluIEdPVlVLRnJvbnRlbmQgcGFja2FnZSwgVHlwZXNjcmlwdCBpcyBub3QgYXdhcmUgb2YgJHJvb3RcbiAgLy8gaW4gY29tcG9uZW50cyB0aGF0IGV4dGVuZCBHT1ZVS0Zyb250ZW5kQ29tcG9uZW50XG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSByb290IGVsZW1lbnQgb2YgdGhlIGNvbXBvbmVudFxuICAgKlxuICAgKiBAcHJvdGVjdGVkXG4gICAqIEByZXR1cm5zIHtSb290RWxlbWVudFR5cGV9IC0gdGhlIHJvb3QgZWxlbWVudCBvZiBjb21wb25lbnRcbiAgICovXG4gIGdldCAkcm9vdCgpIHtcbiAgICByZXR1cm4gdGhpcy5fJHJvb3RcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJvdGVjdGVkXG4gICAqIEB0eXBlIHtSb290RWxlbWVudFR5cGV9XG4gICAqL1xuICBfJHJvb3RcblxuICAvKipcbiAgICogQ29uc3RydWN0cyBhIG5ldyBjb21wb25lbnQsIHZhbGlkYXRpbmcgdGhhdCBHT1YuVUsgRnJvbnRlbmQgaXMgc3VwcG9ydGVkXG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKiBAcGFyYW0ge0VsZW1lbnQgfCBudWxsfSBbJHJvb3RdIC0gSFRNTCBlbGVtZW50IHRvIHVzZSBmb3IgY29tcG9uZW50XG4gICAqL1xuICBjb25zdHJ1Y3Rvcigkcm9vdCkge1xuICAgIGNvbnN0IGNoaWxkQ29uc3RydWN0b3IgPSAvKiogQHR5cGUge0NoaWxkQ2xhc3NDb25zdHJ1Y3Rvcn0gKi8gKFxuICAgICAgdGhpcy5jb25zdHJ1Y3RvclxuICAgIClcblxuICAgIC8vIFR5cGVTY3JpcHQgZG9lcyBub3QgZW5mb3JjZSB0aGF0IGluaGVyaXRpbmcgY2xhc3NlcyB3aWxsIGRlZmluZSBhIGBtb2R1bGVOYW1lYFxuICAgIC8vIChldmVuIGlmIHdlIGFkZCBhIGBAdmlydHVhbGAgYHN0YXRpYyBtb2R1bGVOYW1lYCBwcm9wZXJ0eSB0byB0aGlzIGNsYXNzKS5cbiAgICAvLyBXaGlsZSB3ZSB0cnVzdCB1c2VycyB0byBkbyB0aGlzIGNvcnJlY3RseSwgd2UgZG8gYSBsaXR0bGUgY2hlY2sgdG8gcHJvdmlkZSB0aGVtXG4gICAgLy8gYSBoZWxwZnVsIGVycm9yIG1lc3NhZ2UuXG4gICAgLy9cbiAgICAvLyBBZnRlciB0aGlzLCB3ZSdsbCBiZSBzdXJlIHRoYXQgYGNoaWxkQ29uc3RydWN0b3JgIGhhcyBhIGBtb2R1bGVOYW1lYFxuICAgIC8vIGFzIGV4cGVjdGVkIG9mIHRoZSBgQ2hpbGRDbGFzc0NvbnN0cnVjdG9yYCB3ZSd2ZSBjYXN0IGB0aGlzLmNvbnN0cnVjdG9yYCB0by5cbiAgICBpZiAodHlwZW9mIGNoaWxkQ29uc3RydWN0b3IubW9kdWxlTmFtZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBJbml0RXJyb3IoYFxcYG1vZHVsZU5hbWVcXGAgbm90IGRlZmluZWQgaW4gY29tcG9uZW50YClcbiAgICB9XG5cbiAgICBpZiAoISgkcm9vdCBpbnN0YW5jZW9mIGNoaWxkQ29uc3RydWN0b3IuZWxlbWVudFR5cGUpKSB7XG4gICAgICB0aHJvdyBuZXcgRWxlbWVudEVycm9yKHtcbiAgICAgICAgZWxlbWVudDogJHJvb3QsXG4gICAgICAgIGNvbXBvbmVudDogY2hpbGRDb25zdHJ1Y3RvcixcbiAgICAgICAgaWRlbnRpZmllcjogJ1Jvb3QgZWxlbWVudCAoYCRyb290YCknLFxuICAgICAgICBleHBlY3RlZFR5cGU6IGNoaWxkQ29uc3RydWN0b3IuZWxlbWVudFR5cGUubmFtZVxuICAgICAgfSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fJHJvb3QgPSAvKiogQHR5cGUge1Jvb3RFbGVtZW50VHlwZX0gKi8gKCRyb290KVxuICAgIH1cblxuICAgIGNoaWxkQ29uc3RydWN0b3IuY2hlY2tTdXBwb3J0KClcblxuICAgIHRoaXMuY2hlY2tJbml0aWFsaXNlZCgpXG5cbiAgICBjb25zdCBtb2R1bGVOYW1lID0gY2hpbGRDb25zdHJ1Y3Rvci5tb2R1bGVOYW1lXG5cbiAgICB0aGlzLiRyb290LnNldEF0dHJpYnV0ZShgZGF0YS0ke21vZHVsZU5hbWV9LWluaXRgLCAnJylcbiAgfVxuXG4gIC8qKlxuICAgKiBWYWxpZGF0ZXMgd2hldGhlciBjb21wb25lbnQgaXMgYWxyZWFkeSBpbml0aWFsaXNlZFxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAdGhyb3dzIHtJbml0RXJyb3J9IHdoZW4gY29tcG9uZW50IGlzIGFscmVhZHkgaW5pdGlhbGlzZWRcbiAgICovXG4gIGNoZWNrSW5pdGlhbGlzZWQoKSB7XG4gICAgY29uc3QgY29uc3RydWN0b3IgPSAvKiogQHR5cGUge0NoaWxkQ2xhc3NDb25zdHJ1Y3Rvcn0gKi8gKHRoaXMuY29uc3RydWN0b3IpXG4gICAgY29uc3QgbW9kdWxlTmFtZSA9IGNvbnN0cnVjdG9yLm1vZHVsZU5hbWVcblxuICAgIGlmIChtb2R1bGVOYW1lICYmIGlzSW5pdGlhbGlzZWQodGhpcy4kcm9vdCwgbW9kdWxlTmFtZSkpIHtcbiAgICAgIHRocm93IG5ldyBJbml0RXJyb3IoY29uc3RydWN0b3IpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFZhbGlkYXRlcyB3aGV0aGVyIGNvbXBvbmVudHMgYXJlIHN1cHBvcnRlZFxuICAgKlxuICAgKiBAdGhyb3dzIHtTdXBwb3J0RXJyb3J9IHdoZW4gdGhlIGNvbXBvbmVudHMgYXJlIG5vdCBzdXBwb3J0ZWRcbiAgICovXG4gIHN0YXRpYyBjaGVja1N1cHBvcnQoKSB7XG4gICAgaWYgKCFpc1N1cHBvcnRlZCgpKSB7XG4gICAgICB0aHJvdyBuZXcgU3VwcG9ydEVycm9yKClcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBAdHlwZWRlZiBDaGlsZENsYXNzXG4gKiBAcHJvcGVydHkge3N0cmluZ30gbW9kdWxlTmFtZSAtIFRoZSBtb2R1bGUgbmFtZSB0aGF0J2xsIGJlIGxvb2tlZCBmb3IgaW4gdGhlIERPTSB3aGVuIGluaXRpYWxpc2luZyB0aGUgY29tcG9uZW50XG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7dHlwZW9mIENvbXBvbmVudCAmIENoaWxkQ2xhc3N9IENoaWxkQ2xhc3NDb25zdHJ1Y3RvclxuICovXG4iLCJpbXBvcnQgeyBDb25maWd1cmFibGVDb21wb25lbnQgfSBmcm9tICcuLi8uLi9jb21tb24vY29uZmlndXJhdGlvbi5tanMnXG5pbXBvcnQgeyBFbGVtZW50RXJyb3IgfSBmcm9tICcuLi8uLi9lcnJvcnMvaW5kZXgubWpzJ1xuaW1wb3J0IHsgSTE4biB9IGZyb20gJy4uLy4uL2kxOG4ubWpzJ1xuXG4vKipcbiAqIEFjY29yZGlvbiBjb21wb25lbnRcbiAqXG4gKiBUaGlzIGFsbG93cyBhIGNvbGxlY3Rpb24gb2Ygc2VjdGlvbnMgdG8gYmUgY29sbGFwc2VkIGJ5IGRlZmF1bHQsIHNob3dpbmcgb25seVxuICogdGhlaXIgaGVhZGVycy4gU2VjdGlvbnMgY2FuIGJlIGV4cGFuZGVkIG9yIGNvbGxhcHNlZCBpbmRpdmlkdWFsbHkgYnkgY2xpY2tpbmdcbiAqIHRoZWlyIGhlYWRlcnMuIEEgXCJTaG93IGFsbCBzZWN0aW9uc1wiIGJ1dHRvbiBpcyBhbHNvIGFkZGVkIHRvIHRoZSB0b3Agb2YgdGhlXG4gKiBhY2NvcmRpb24sIHdoaWNoIHN3aXRjaGVzIHRvIFwiSGlkZSBhbGwgc2VjdGlvbnNcIiB3aGVuIGFsbCB0aGUgc2VjdGlvbnMgYXJlXG4gKiBleHBhbmRlZC5cbiAqXG4gKiBUaGUgc3RhdGUgb2YgZWFjaCBzZWN0aW9uIGlzIHNhdmVkIHRvIHRoZSBET00gdmlhIHRoZSBgYXJpYS1leHBhbmRlZGBcbiAqIGF0dHJpYnV0ZSwgd2hpY2ggYWxzbyBwcm92aWRlcyBhY2Nlc3NpYmlsaXR5LlxuICpcbiAqIEBwcmVzZXJ2ZVxuICogQGF1Z21lbnRzIENvbmZpZ3VyYWJsZUNvbXBvbmVudDxBY2NvcmRpb25Db25maWc+XG4gKi9cbmV4cG9ydCBjbGFzcyBBY2NvcmRpb24gZXh0ZW5kcyBDb25maWd1cmFibGVDb21wb25lbnQge1xuICAvKiogQHByaXZhdGUgKi9cbiAgaTE4blxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBjb250cm9sc0NsYXNzID0gJ2dvdnVrLWFjY29yZGlvbl9fY29udHJvbHMnXG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHNob3dBbGxDbGFzcyA9ICdnb3Z1ay1hY2NvcmRpb25fX3Nob3ctYWxsJ1xuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzaG93QWxsVGV4dENsYXNzID0gJ2dvdnVrLWFjY29yZGlvbl9fc2hvdy1hbGwtdGV4dCdcblxuICAvKiogQHByaXZhdGUgKi9cbiAgc2VjdGlvbkNsYXNzID0gJ2dvdnVrLWFjY29yZGlvbl9fc2VjdGlvbidcblxuICAvKiogQHByaXZhdGUgKi9cbiAgc2VjdGlvbkV4cGFuZGVkQ2xhc3MgPSAnZ292dWstYWNjb3JkaW9uX19zZWN0aW9uLS1leHBhbmRlZCdcblxuICAvKiogQHByaXZhdGUgKi9cbiAgc2VjdGlvbkJ1dHRvbkNsYXNzID0gJ2dvdnVrLWFjY29yZGlvbl9fc2VjdGlvbi1idXR0b24nXG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHNlY3Rpb25IZWFkZXJDbGFzcyA9ICdnb3Z1ay1hY2NvcmRpb25fX3NlY3Rpb24taGVhZGVyJ1xuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzZWN0aW9uSGVhZGluZ0NsYXNzID0gJ2dvdnVrLWFjY29yZGlvbl9fc2VjdGlvbi1oZWFkaW5nJ1xuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzZWN0aW9uSGVhZGluZ0RpdmlkZXJDbGFzcyA9ICdnb3Z1ay1hY2NvcmRpb25fX3NlY3Rpb24taGVhZGluZy1kaXZpZGVyJ1xuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzZWN0aW9uSGVhZGluZ1RleHRDbGFzcyA9ICdnb3Z1ay1hY2NvcmRpb25fX3NlY3Rpb24taGVhZGluZy10ZXh0J1xuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzZWN0aW9uSGVhZGluZ1RleHRGb2N1c0NsYXNzID0gJ2dvdnVrLWFjY29yZGlvbl9fc2VjdGlvbi1oZWFkaW5nLXRleHQtZm9jdXMnXG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHNlY3Rpb25TaG93SGlkZVRvZ2dsZUNsYXNzID0gJ2dvdnVrLWFjY29yZGlvbl9fc2VjdGlvbi10b2dnbGUnXG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHNlY3Rpb25TaG93SGlkZVRvZ2dsZUZvY3VzQ2xhc3MgPSAnZ292dWstYWNjb3JkaW9uX19zZWN0aW9uLXRvZ2dsZS1mb2N1cydcblxuICAvKiogQHByaXZhdGUgKi9cbiAgc2VjdGlvblNob3dIaWRlVGV4dENsYXNzID0gJ2dvdnVrLWFjY29yZGlvbl9fc2VjdGlvbi10b2dnbGUtdGV4dCdcblxuICAvKiogQHByaXZhdGUgKi9cbiAgdXBDaGV2cm9uSWNvbkNsYXNzID0gJ2dvdnVrLWFjY29yZGlvbi1uYXZfX2NoZXZyb24nXG5cbiAgLyoqIEBwcml2YXRlICovXG4gIGRvd25DaGV2cm9uSWNvbkNsYXNzID0gJ2dvdnVrLWFjY29yZGlvbi1uYXZfX2NoZXZyb24tLWRvd24nXG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHNlY3Rpb25TdW1tYXJ5Q2xhc3MgPSAnZ292dWstYWNjb3JkaW9uX19zZWN0aW9uLXN1bW1hcnknXG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHNlY3Rpb25TdW1tYXJ5Rm9jdXNDbGFzcyA9ICdnb3Z1ay1hY2NvcmRpb25fX3NlY3Rpb24tc3VtbWFyeS1mb2N1cydcblxuICAvKiogQHByaXZhdGUgKi9cbiAgc2VjdGlvbkNvbnRlbnRDbGFzcyA9ICdnb3Z1ay1hY2NvcmRpb25fX3NlY3Rpb24tY29udGVudCdcblxuICAvKiogQHByaXZhdGUgKi9cbiAgJHNlY3Rpb25zXG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqIEB0eXBlIHtIVE1MQnV0dG9uRWxlbWVudCB8IG51bGx9XG4gICAqL1xuICAkc2hvd0FsbEJ1dHRvbiA9IG51bGxcblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICogQHR5cGUge0hUTUxFbGVtZW50IHwgbnVsbH1cbiAgICovXG4gICRzaG93QWxsSWNvbiA9IG51bGxcblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICogQHR5cGUge0hUTUxFbGVtZW50IHwgbnVsbH1cbiAgICovXG4gICRzaG93QWxsVGV4dCA9IG51bGxcblxuICAvKipcbiAgICogQHBhcmFtIHtFbGVtZW50IHwgbnVsbH0gJHJvb3QgLSBIVE1MIGVsZW1lbnQgdG8gdXNlIGZvciBhY2NvcmRpb25cbiAgICogQHBhcmFtIHtBY2NvcmRpb25Db25maWd9IFtjb25maWddIC0gQWNjb3JkaW9uIGNvbmZpZ1xuICAgKi9cbiAgY29uc3RydWN0b3IoJHJvb3QsIGNvbmZpZyA9IHt9KSB7XG4gICAgc3VwZXIoJHJvb3QsIGNvbmZpZylcblxuICAgIHRoaXMuaTE4biA9IG5ldyBJMThuKHRoaXMuY29uZmlnLmkxOG4pXG5cbiAgICBjb25zdCAkc2VjdGlvbnMgPSB0aGlzLiRyb290LnF1ZXJ5U2VsZWN0b3JBbGwoYC4ke3RoaXMuc2VjdGlvbkNsYXNzfWApXG4gICAgaWYgKCEkc2VjdGlvbnMubGVuZ3RoKSB7XG4gICAgICB0aHJvdyBuZXcgRWxlbWVudEVycm9yKHtcbiAgICAgICAgY29tcG9uZW50OiBBY2NvcmRpb24sXG4gICAgICAgIGlkZW50aWZpZXI6IGBTZWN0aW9ucyAoXFxgPGRpdiBjbGFzcz1cIiR7dGhpcy5zZWN0aW9uQ2xhc3N9XCI+XFxgKWBcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgdGhpcy4kc2VjdGlvbnMgPSAkc2VjdGlvbnNcblxuICAgIHRoaXMuaW5pdENvbnRyb2xzKClcbiAgICB0aGlzLmluaXRTZWN0aW9uSGVhZGVycygpXG5cbiAgICB0aGlzLnVwZGF0ZVNob3dBbGxCdXR0b24odGhpcy5hcmVBbGxTZWN0aW9uc09wZW4oKSlcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXNlIGNvbnRyb2xzIGFuZCBzZXQgYXR0cmlidXRlc1xuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgaW5pdENvbnRyb2xzKCkge1xuICAgIC8vIENyZWF0ZSBcIlNob3cgYWxsXCIgYnV0dG9uIGFuZCBzZXQgYXR0cmlidXRlc1xuICAgIHRoaXMuJHNob3dBbGxCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKVxuICAgIHRoaXMuJHNob3dBbGxCdXR0b24uc2V0QXR0cmlidXRlKCd0eXBlJywgJ2J1dHRvbicpXG4gICAgdGhpcy4kc2hvd0FsbEJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgdGhpcy5zaG93QWxsQ2xhc3MpXG4gICAgdGhpcy4kc2hvd0FsbEJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKVxuXG4gICAgLy8gQ3JlYXRlIGljb24sIGFkZCB0byBlbGVtZW50XG4gICAgdGhpcy4kc2hvd0FsbEljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgICB0aGlzLiRzaG93QWxsSWNvbi5jbGFzc0xpc3QuYWRkKHRoaXMudXBDaGV2cm9uSWNvbkNsYXNzKVxuICAgIHRoaXMuJHNob3dBbGxCdXR0b24uYXBwZW5kQ2hpbGQodGhpcy4kc2hvd0FsbEljb24pXG5cbiAgICAvLyBDcmVhdGUgY29udHJvbCB3cmFwcGVyIGFuZCBhZGQgY29udHJvbHMgdG8gaXRcbiAgICBjb25zdCAkYWNjb3JkaW9uQ29udHJvbHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgICRhY2NvcmRpb25Db250cm9scy5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgdGhpcy5jb250cm9sc0NsYXNzKVxuICAgICRhY2NvcmRpb25Db250cm9scy5hcHBlbmRDaGlsZCh0aGlzLiRzaG93QWxsQnV0dG9uKVxuICAgIHRoaXMuJHJvb3QuaW5zZXJ0QmVmb3JlKCRhY2NvcmRpb25Db250cm9scywgdGhpcy4kcm9vdC5maXJzdENoaWxkKVxuXG4gICAgLy8gQnVpbGQgYWRkaXRpb25hbCB3cmFwcGVyIGZvciBTaG93IGFsbCB0b2dnbGUgdGV4dCBhbmQgcGxhY2UgYWZ0ZXIgaWNvblxuICAgIHRoaXMuJHNob3dBbGxUZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXG4gICAgdGhpcy4kc2hvd0FsbFRleHQuY2xhc3NMaXN0LmFkZCh0aGlzLnNob3dBbGxUZXh0Q2xhc3MpXG4gICAgdGhpcy4kc2hvd0FsbEJ1dHRvbi5hcHBlbmRDaGlsZCh0aGlzLiRzaG93QWxsVGV4dClcblxuICAgIC8vIEhhbmRsZSBjbGljayBldmVudHMgb24gdGhlIHNob3cvaGlkZSBhbGwgYnV0dG9uXG4gICAgdGhpcy4kc2hvd0FsbEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+XG4gICAgICB0aGlzLm9uU2hvd09ySGlkZUFsbFRvZ2dsZSgpXG4gICAgKVxuXG4gICAgLy8gSGFuZGxlICdiZWZvcmVtYXRjaCcgZXZlbnRzLCBpZiB0aGUgdXNlciBhZ2VudCBzdXBwb3J0cyB0aGVtXG4gICAgaWYgKCdvbmJlZm9yZW1hdGNoJyBpbiBkb2N1bWVudCkge1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignYmVmb3JlbWF0Y2gnLCAoZXZlbnQpID0+XG4gICAgICAgIHRoaXMub25CZWZvcmVNYXRjaChldmVudClcbiAgICAgIClcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhbGlzZSBzZWN0aW9uIGhlYWRlcnNcbiAgICpcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGluaXRTZWN0aW9uSGVhZGVycygpIHtcbiAgICB0aGlzLiRzZWN0aW9ucy5mb3JFYWNoKCgkc2VjdGlvbiwgaSkgPT4ge1xuICAgICAgY29uc3QgJGhlYWRlciA9ICRzZWN0aW9uLnF1ZXJ5U2VsZWN0b3IoYC4ke3RoaXMuc2VjdGlvbkhlYWRlckNsYXNzfWApXG4gICAgICBpZiAoISRoZWFkZXIpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVsZW1lbnRFcnJvcih7XG4gICAgICAgICAgY29tcG9uZW50OiBBY2NvcmRpb24sXG4gICAgICAgICAgaWRlbnRpZmllcjogYFNlY3Rpb24gaGVhZGVycyAoXFxgPGRpdiBjbGFzcz1cIiR7dGhpcy5zZWN0aW9uSGVhZGVyQ2xhc3N9XCI+XFxgKWBcbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgLy8gU2V0IGhlYWRlciBhdHRyaWJ1dGVzXG4gICAgICB0aGlzLmNvbnN0cnVjdEhlYWRlck1hcmt1cCgkaGVhZGVyLCBpKVxuICAgICAgdGhpcy5zZXRFeHBhbmRlZCh0aGlzLmlzRXhwYW5kZWQoJHNlY3Rpb24pLCAkc2VjdGlvbilcblxuICAgICAgLy8gSGFuZGxlIGV2ZW50c1xuICAgICAgJGhlYWRlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHRoaXMub25TZWN0aW9uVG9nZ2xlKCRzZWN0aW9uKSlcblxuICAgICAgLy8gU2VlIGlmIHRoZXJlIGlzIGFueSBzdGF0ZSBzdG9yZWQgaW4gc2Vzc2lvblN0b3JhZ2UgYW5kIHNldCB0aGUgc2VjdGlvbnNcbiAgICAgIC8vIHRvIG9wZW4gb3IgY2xvc2VkLlxuICAgICAgdGhpcy5zZXRJbml0aWFsU3RhdGUoJHNlY3Rpb24pXG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3Qgc2VjdGlvbiBoZWFkZXJcbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtFbGVtZW50fSAkaGVhZGVyIC0gU2VjdGlvbiBoZWFkZXJcbiAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IC0gU2VjdGlvbiBpbmRleFxuICAgKi9cbiAgY29uc3RydWN0SGVhZGVyTWFya3VwKCRoZWFkZXIsIGluZGV4KSB7XG4gICAgY29uc3QgJHNwYW4gPSAkaGVhZGVyLnF1ZXJ5U2VsZWN0b3IoYC4ke3RoaXMuc2VjdGlvbkJ1dHRvbkNsYXNzfWApXG4gICAgY29uc3QgJGhlYWRpbmcgPSAkaGVhZGVyLnF1ZXJ5U2VsZWN0b3IoYC4ke3RoaXMuc2VjdGlvbkhlYWRpbmdDbGFzc31gKVxuICAgIGNvbnN0ICRzdW1tYXJ5ID0gJGhlYWRlci5xdWVyeVNlbGVjdG9yKGAuJHt0aGlzLnNlY3Rpb25TdW1tYXJ5Q2xhc3N9YClcblxuICAgIGlmICghJGhlYWRpbmcpIHtcbiAgICAgIHRocm93IG5ldyBFbGVtZW50RXJyb3Ioe1xuICAgICAgICBjb21wb25lbnQ6IEFjY29yZGlvbixcbiAgICAgICAgaWRlbnRpZmllcjogYFNlY3Rpb24gaGVhZGluZyAoXFxgLiR7dGhpcy5zZWN0aW9uSGVhZGluZ0NsYXNzfVxcYClgXG4gICAgICB9KVxuICAgIH1cblxuICAgIGlmICghJHNwYW4pIHtcbiAgICAgIHRocm93IG5ldyBFbGVtZW50RXJyb3Ioe1xuICAgICAgICBjb21wb25lbnQ6IEFjY29yZGlvbixcbiAgICAgICAgaWRlbnRpZmllcjogYFNlY3Rpb24gYnV0dG9uIHBsYWNlaG9sZGVyIChcXGA8c3BhbiBjbGFzcz1cIiR7dGhpcy5zZWN0aW9uQnV0dG9uQ2xhc3N9XCI+XFxgKWBcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgLy8gQ3JlYXRlIGEgYnV0dG9uIGVsZW1lbnQgdGhhdCB3aWxsIHJlcGxhY2UgdGhlXG4gICAgLy8gJy5nb3Z1ay1hY2NvcmRpb25fX3NlY3Rpb24tYnV0dG9uJyBzcGFuXG4gICAgY29uc3QgJGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpXG4gICAgJGJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAnYnV0dG9uJylcbiAgICAkYnV0dG9uLnNldEF0dHJpYnV0ZShcbiAgICAgICdhcmlhLWNvbnRyb2xzJyxcbiAgICAgIGAke3RoaXMuJHJvb3QuaWR9LWNvbnRlbnQtJHtpbmRleCArIDF9YFxuICAgIClcblxuICAgIC8vIENvcHkgYWxsIGF0dHJpYnV0ZXMgZnJvbSAkc3BhbiB0byAkYnV0dG9uIChleGNlcHQgYGlkYCwgd2hpY2ggZ2V0cyBhZGRlZFxuICAgIC8vIHRvIHRoZSBgJGhlYWRpbmdUZXh0YCBlbGVtZW50KVxuICAgIGZvciAoY29uc3QgYXR0ciBvZiBBcnJheS5mcm9tKCRzcGFuLmF0dHJpYnV0ZXMpKSB7XG4gICAgICBpZiAoYXR0ci5uYW1lICE9PSAnaWQnKSB7XG4gICAgICAgICRidXR0b24uc2V0QXR0cmlidXRlKGF0dHIubmFtZSwgYXR0ci52YWx1ZSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBDcmVhdGUgY29udGFpbmVyIGZvciBoZWFkaW5nIHRleHQgc28gaXQgY2FuIGJlIHN0eWxlZFxuICAgIGNvbnN0ICRoZWFkaW5nVGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxuICAgICRoZWFkaW5nVGV4dC5jbGFzc0xpc3QuYWRkKHRoaXMuc2VjdGlvbkhlYWRpbmdUZXh0Q2xhc3MpXG4gICAgLy8gQ29weSB0aGUgc3BhbiBJRCB0byB0aGUgaGVhZGluZyB0ZXh0IHRvIGFsbG93IGl0IHRvIGJlIHJlZmVyZW5jZWQgYnlcbiAgICAvLyBgYXJpYS1sYWJlbGxlZGJ5YCBvbiB0aGUgaGlkZGVuIGNvbnRlbnQgYXJlYSB3aXRob3V0IFwiU2hvdyB0aGlzIHNlY3Rpb25cIlxuICAgICRoZWFkaW5nVGV4dC5pZCA9ICRzcGFuLmlkXG5cbiAgICAvLyBDcmVhdGUgYW4gaW5uZXIgaGVhZGluZyB0ZXh0IGNvbnRhaW5lciB0byBsaW1pdCB0aGUgd2lkdGggb2YgdGhlIGZvY3VzXG4gICAgLy8gc3RhdGVcbiAgICBjb25zdCAkaGVhZGluZ1RleHRGb2N1cyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxuICAgICRoZWFkaW5nVGV4dEZvY3VzLmNsYXNzTGlzdC5hZGQodGhpcy5zZWN0aW9uSGVhZGluZ1RleHRGb2N1c0NsYXNzKVxuICAgICRoZWFkaW5nVGV4dC5hcHBlbmRDaGlsZCgkaGVhZGluZ1RleHRGb2N1cylcbiAgICAvLyBzcGFuIGNvdWxkIGNvbnRhaW4gSFRNTCBlbGVtZW50c1xuICAgIC8vIChzZWUgaHR0cHM6Ly93d3cudzMub3JnL1RSLzIwMTEvV0QtaHRtbDUtMjAxMTA1MjUvY29udGVudC1tb2RlbHMuaHRtbCNwaHJhc2luZy1jb250ZW50KVxuICAgIEFycmF5LmZyb20oJHNwYW4uY2hpbGROb2RlcykuZm9yRWFjaCgoJGNoaWxkKSA9PlxuICAgICAgJGhlYWRpbmdUZXh0Rm9jdXMuYXBwZW5kQ2hpbGQoJGNoaWxkKVxuICAgIClcblxuICAgIC8vIENyZWF0ZSBjb250YWluZXIgZm9yIHNob3cgLyBoaWRlIGljb25zIGFuZCB0ZXh0LlxuICAgIGNvbnN0ICRzaG93SGlkZVRvZ2dsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxuICAgICRzaG93SGlkZVRvZ2dsZS5jbGFzc0xpc3QuYWRkKHRoaXMuc2VjdGlvblNob3dIaWRlVG9nZ2xlQ2xhc3MpXG4gICAgLy8gVGVsbCBHb29nbGUgbm90IHRvIGluZGV4IHRoZSAnc2hvdycgdGV4dCBhcyBwYXJ0IG9mIHRoZSBoZWFkaW5nLiBNdXN0IGJlXG4gICAgLy8gc2V0IG9uIHRoZSBlbGVtZW50IGJlZm9yZSBpdCdzIGFkZGVkIHRvIHRoZSBET00uXG4gICAgLy8gU2VlIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL3NlYXJjaC9kb2NzL2FkdmFuY2VkL3JvYm90cy9yb2JvdHNfbWV0YV90YWcjZGF0YS1ub3NuaXBwZXQtYXR0clxuICAgICRzaG93SGlkZVRvZ2dsZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtbm9zbmlwcGV0JywgJycpXG4gICAgLy8gQ3JlYXRlIGFuIGlubmVyIGNvbnRhaW5lciB0byBsaW1pdCB0aGUgd2lkdGggb2YgdGhlIGZvY3VzIHN0YXRlXG4gICAgY29uc3QgJHNob3dIaWRlVG9nZ2xlRm9jdXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgICAkc2hvd0hpZGVUb2dnbGVGb2N1cy5jbGFzc0xpc3QuYWRkKHRoaXMuc2VjdGlvblNob3dIaWRlVG9nZ2xlRm9jdXNDbGFzcylcbiAgICAkc2hvd0hpZGVUb2dnbGUuYXBwZW5kQ2hpbGQoJHNob3dIaWRlVG9nZ2xlRm9jdXMpXG4gICAgLy8gQ3JlYXRlIHdyYXBwZXIgZm9yIHRoZSBzaG93IC8gaGlkZSB0ZXh0LiBBcHBlbmQgdGV4dCBhZnRlciB0aGUgc2hvdy9oaWRlIGljb25cbiAgICBjb25zdCAkc2hvd0hpZGVUZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXG4gICAgY29uc3QgJHNob3dIaWRlSWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxuICAgICRzaG93SGlkZUljb24uY2xhc3NMaXN0LmFkZCh0aGlzLnVwQ2hldnJvbkljb25DbGFzcylcbiAgICAkc2hvd0hpZGVUb2dnbGVGb2N1cy5hcHBlbmRDaGlsZCgkc2hvd0hpZGVJY29uKVxuICAgICRzaG93SGlkZVRleHQuY2xhc3NMaXN0LmFkZCh0aGlzLnNlY3Rpb25TaG93SGlkZVRleHRDbGFzcylcbiAgICAkc2hvd0hpZGVUb2dnbGVGb2N1cy5hcHBlbmRDaGlsZCgkc2hvd0hpZGVUZXh0KVxuXG4gICAgLy8gQXBwZW5kIGVsZW1lbnRzIHRvIHRoZSBidXR0b246XG4gICAgLy8gMS4gSGVhZGluZyB0ZXh0XG4gICAgLy8gMi4gUHVuY3R1YXRpb25cbiAgICAvLyAzLiAoT3B0aW9uYWw6IFN1bW1hcnkgbGluZSBmb2xsb3dlZCBieSBwdW5jdHVhdGlvbilcbiAgICAvLyA0LiBTaG93IC8gaGlkZSB0b2dnbGVcbiAgICAkYnV0dG9uLmFwcGVuZENoaWxkKCRoZWFkaW5nVGV4dClcbiAgICAkYnV0dG9uLmFwcGVuZENoaWxkKHRoaXMuZ2V0QnV0dG9uUHVuY3R1YXRpb25FbCgpKVxuXG4gICAgLy8gSWYgc3VtbWFyeSBjb250ZW50IGV4aXN0cyBhZGQgdG8gRE9NIGluIGNvcnJlY3Qgb3JkZXJcbiAgICBpZiAoJHN1bW1hcnkpIHtcbiAgICAgIC8vIENyZWF0ZSBhIG5ldyBgc3BhbmAgZWxlbWVudCBhbmQgY29weSB0aGUgc3VtbWFyeSBsaW5lIGNvbnRlbnQgZnJvbSB0aGVcbiAgICAgIC8vIG9yaWdpbmFsIGBkaXZgIHRvIHRoZSBuZXcgYHNwYW5gLiBUaGlzIGlzIGJlY2F1c2UgdGhlIHN1bW1hcnkgbGluZSB0ZXh0XG4gICAgICAvLyBpcyBub3cgaW5zaWRlIGEgYnV0dG9uIGVsZW1lbnQsIHdoaWNoIGNhbiBvbmx5IGNvbnRhaW4gcGhyYXNpbmdcbiAgICAgIC8vIGNvbnRlbnQuXG4gICAgICBjb25zdCAkc3VtbWFyeVNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgICAgIC8vIENyZWF0ZSBhbiBpbm5lciBzdW1tYXJ5IGNvbnRhaW5lciB0byBsaW1pdCB0aGUgd2lkdGggb2YgdGhlIHN1bW1hcnlcbiAgICAgIC8vIGZvY3VzIHN0YXRlXG4gICAgICBjb25zdCAkc3VtbWFyeVNwYW5Gb2N1cyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxuICAgICAgJHN1bW1hcnlTcGFuRm9jdXMuY2xhc3NMaXN0LmFkZCh0aGlzLnNlY3Rpb25TdW1tYXJ5Rm9jdXNDbGFzcylcbiAgICAgICRzdW1tYXJ5U3Bhbi5hcHBlbmRDaGlsZCgkc3VtbWFyeVNwYW5Gb2N1cylcblxuICAgICAgLy8gR2V0IG9yaWdpbmFsIGF0dHJpYnV0ZXMsIGFuZCBwYXNzIHRoZW0gdG8gdGhlIHJlcGxhY2VtZW50XG4gICAgICBmb3IgKGNvbnN0IGF0dHIgb2YgQXJyYXkuZnJvbSgkc3VtbWFyeS5hdHRyaWJ1dGVzKSkge1xuICAgICAgICAkc3VtbWFyeVNwYW4uc2V0QXR0cmlidXRlKGF0dHIubmFtZSwgYXR0ci52YWx1ZSlcbiAgICAgIH1cblxuICAgICAgLy8gQ29weSBvcmlnaW5hbCBjb250ZW50cyBvZiBzdW1tYXJ5IHRvIHRoZSBuZXcgc3VtbWFyeSBzcGFuXG4gICAgICBBcnJheS5mcm9tKCRzdW1tYXJ5LmNoaWxkTm9kZXMpLmZvckVhY2goKCRjaGlsZCkgPT5cbiAgICAgICAgJHN1bW1hcnlTcGFuRm9jdXMuYXBwZW5kQ2hpbGQoJGNoaWxkKVxuICAgICAgKVxuXG4gICAgICAvLyBSZXBsYWNlIHRoZSBvcmlnaW5hbCBzdW1tYXJ5IGBkaXZgIHdpdGggdGhlIG5ldyBzdW1tYXJ5IGBzcGFuYFxuICAgICAgJHN1bW1hcnkucmVtb3ZlKClcblxuICAgICAgJGJ1dHRvbi5hcHBlbmRDaGlsZCgkc3VtbWFyeVNwYW4pXG4gICAgICAkYnV0dG9uLmFwcGVuZENoaWxkKHRoaXMuZ2V0QnV0dG9uUHVuY3R1YXRpb25FbCgpKVxuICAgIH1cblxuICAgICRidXR0b24uYXBwZW5kQ2hpbGQoJHNob3dIaWRlVG9nZ2xlKVxuXG4gICAgJGhlYWRpbmcucmVtb3ZlQ2hpbGQoJHNwYW4pXG4gICAgJGhlYWRpbmcuYXBwZW5kQ2hpbGQoJGJ1dHRvbilcbiAgfVxuXG4gIC8qKlxuICAgKiBXaGVuIGEgc2VjdGlvbiBpcyBvcGVuZWQgYnkgdGhlIHVzZXIgYWdlbnQgdmlhIHRoZSAnYmVmb3JlbWF0Y2gnIGV2ZW50XG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50IC0gR2VuZXJpYyBldmVudFxuICAgKi9cbiAgb25CZWZvcmVNYXRjaChldmVudCkge1xuICAgIGNvbnN0ICRmcmFnbWVudCA9IGV2ZW50LnRhcmdldFxuXG4gICAgLy8gSGFuZGxlIGVsZW1lbnRzIHdpdGggYC5jbG9zZXN0KClgIHN1cHBvcnQgb25seVxuICAgIGlmICghKCRmcmFnbWVudCBpbnN0YW5jZW9mIEVsZW1lbnQpKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICAvLyBIYW5kbGUgd2hlbiBmcmFnbWVudCBpcyBpbnNpZGUgc2VjdGlvblxuICAgIGNvbnN0ICRzZWN0aW9uID0gJGZyYWdtZW50LmNsb3Nlc3QoYC4ke3RoaXMuc2VjdGlvbkNsYXNzfWApXG4gICAgaWYgKCRzZWN0aW9uKSB7XG4gICAgICB0aGlzLnNldEV4cGFuZGVkKHRydWUsICRzZWN0aW9uKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBXaGVuIHNlY3Rpb24gdG9nZ2xlZCwgc2V0IGFuZCBzdG9yZSBzdGF0ZVxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge0VsZW1lbnR9ICRzZWN0aW9uIC0gU2VjdGlvbiBlbGVtZW50XG4gICAqL1xuICBvblNlY3Rpb25Ub2dnbGUoJHNlY3Rpb24pIHtcbiAgICBjb25zdCBub3dFeHBhbmRlZCA9ICF0aGlzLmlzRXhwYW5kZWQoJHNlY3Rpb24pXG4gICAgdGhpcy5zZXRFeHBhbmRlZChub3dFeHBhbmRlZCwgJHNlY3Rpb24pXG5cbiAgICAvLyBTdG9yZSB0aGUgc3RhdGUgaW4gc2Vzc2lvblN0b3JhZ2Ugd2hlbiBhIGNoYW5nZSBpcyB0cmlnZ2VyZWRcbiAgICB0aGlzLnN0b3JlU3RhdGUoJHNlY3Rpb24sIG5vd0V4cGFuZGVkKVxuICB9XG5cbiAgLyoqXG4gICAqIFdoZW4gT3Blbi9DbG9zZSBBbGwgdG9nZ2xlZCwgc2V0IGFuZCBzdG9yZSBzdGF0ZVxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgb25TaG93T3JIaWRlQWxsVG9nZ2xlKCkge1xuICAgIGNvbnN0IG5vd0V4cGFuZGVkID0gIXRoaXMuYXJlQWxsU2VjdGlvbnNPcGVuKClcblxuICAgIHRoaXMuJHNlY3Rpb25zLmZvckVhY2goKCRzZWN0aW9uKSA9PiB7XG4gICAgICB0aGlzLnNldEV4cGFuZGVkKG5vd0V4cGFuZGVkLCAkc2VjdGlvbilcbiAgICAgIHRoaXMuc3RvcmVTdGF0ZSgkc2VjdGlvbiwgbm93RXhwYW5kZWQpXG4gICAgfSlcblxuICAgIHRoaXMudXBkYXRlU2hvd0FsbEJ1dHRvbihub3dFeHBhbmRlZClcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgc2VjdGlvbiBhdHRyaWJ1dGVzIHdoZW4gb3BlbmVkL2Nsb3NlZFxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGV4cGFuZGVkIC0gU2VjdGlvbiBleHBhbmRlZFxuICAgKiBAcGFyYW0ge0VsZW1lbnR9ICRzZWN0aW9uIC0gU2VjdGlvbiBlbGVtZW50XG4gICAqL1xuICBzZXRFeHBhbmRlZChleHBhbmRlZCwgJHNlY3Rpb24pIHtcbiAgICBjb25zdCAkc2hvd0hpZGVJY29uID0gJHNlY3Rpb24ucXVlcnlTZWxlY3RvcihgLiR7dGhpcy51cENoZXZyb25JY29uQ2xhc3N9YClcbiAgICBjb25zdCAkc2hvd0hpZGVUZXh0ID0gJHNlY3Rpb24ucXVlcnlTZWxlY3RvcihcbiAgICAgIGAuJHt0aGlzLnNlY3Rpb25TaG93SGlkZVRleHRDbGFzc31gXG4gICAgKVxuICAgIGNvbnN0ICRidXR0b24gPSAkc2VjdGlvbi5xdWVyeVNlbGVjdG9yKGAuJHt0aGlzLnNlY3Rpb25CdXR0b25DbGFzc31gKVxuICAgIGNvbnN0ICRjb250ZW50ID0gJHNlY3Rpb24ucXVlcnlTZWxlY3RvcihgLiR7dGhpcy5zZWN0aW9uQ29udGVudENsYXNzfWApXG5cbiAgICBpZiAoISRjb250ZW50KSB7XG4gICAgICB0aHJvdyBuZXcgRWxlbWVudEVycm9yKHtcbiAgICAgICAgY29tcG9uZW50OiBBY2NvcmRpb24sXG4gICAgICAgIGlkZW50aWZpZXI6IGBTZWN0aW9uIGNvbnRlbnQgKFxcYDxkaXYgY2xhc3M9XCIke3RoaXMuc2VjdGlvbkNvbnRlbnRDbGFzc31cIj5cXGApYFxuICAgICAgfSlcbiAgICB9XG5cbiAgICBpZiAoISRzaG93SGlkZUljb24gfHwgISRzaG93SGlkZVRleHQgfHwgISRidXR0b24pIHtcbiAgICAgIC8vIFJldHVybiBlYXJseSBmb3IgZWxlbWVudHMgd2UgY3JlYXRlXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBjb25zdCBuZXdCdXR0b25UZXh0ID0gZXhwYW5kZWRcbiAgICAgID8gdGhpcy5pMThuLnQoJ2hpZGVTZWN0aW9uJylcbiAgICAgIDogdGhpcy5pMThuLnQoJ3Nob3dTZWN0aW9uJylcblxuICAgICRzaG93SGlkZVRleHQudGV4dENvbnRlbnQgPSBuZXdCdXR0b25UZXh0XG4gICAgJGJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCBgJHtleHBhbmRlZH1gKVxuXG4gICAgLy8gVXBkYXRlIGFyaWEtbGFiZWwgY29tYmluaW5nXG4gICAgY29uc3QgYXJpYUxhYmVsUGFydHMgPSBbXVxuXG4gICAgY29uc3QgJGhlYWRpbmdUZXh0ID0gJHNlY3Rpb24ucXVlcnlTZWxlY3RvcihcbiAgICAgIGAuJHt0aGlzLnNlY3Rpb25IZWFkaW5nVGV4dENsYXNzfWBcbiAgICApXG4gICAgaWYgKCRoZWFkaW5nVGV4dCkge1xuICAgICAgYXJpYUxhYmVsUGFydHMucHVzaChgJHskaGVhZGluZ1RleHQudGV4dENvbnRlbnR9YC50cmltKCkpXG4gICAgfVxuXG4gICAgY29uc3QgJHN1bW1hcnkgPSAkc2VjdGlvbi5xdWVyeVNlbGVjdG9yKGAuJHt0aGlzLnNlY3Rpb25TdW1tYXJ5Q2xhc3N9YClcbiAgICBpZiAoJHN1bW1hcnkpIHtcbiAgICAgIGFyaWFMYWJlbFBhcnRzLnB1c2goYCR7JHN1bW1hcnkudGV4dENvbnRlbnR9YC50cmltKCkpXG4gICAgfVxuXG4gICAgY29uc3QgYXJpYUxhYmVsTWVzc2FnZSA9IGV4cGFuZGVkXG4gICAgICA/IHRoaXMuaTE4bi50KCdoaWRlU2VjdGlvbkFyaWFMYWJlbCcpXG4gICAgICA6IHRoaXMuaTE4bi50KCdzaG93U2VjdGlvbkFyaWFMYWJlbCcpXG4gICAgYXJpYUxhYmVsUGFydHMucHVzaChhcmlhTGFiZWxNZXNzYWdlKVxuXG4gICAgLypcbiAgICAgKiBKb2luIHdpdGggYSBjb21tYSB0byBhZGQgcGF1c2UgZm9yIGFzc2lzdGl2ZSB0ZWNobm9sb2d5LlxuICAgICAqIEV4YW1wbGU6IFtoZWFkaW5nXVNlY3Rpb24gQSAsW3BhdXNlXSBTaG93IHRoaXMgc2VjdGlvbi5cbiAgICAgKiBodHRwczovL2FjY2Vzc2liaWxpdHkuYmxvZy5nb3YudWsvMjAxNy8xMi8xOC93aGF0LXdvcmtpbmctb24tZ292LXVrLW5hdmlnYXRpb24tdGF1Z2h0LXVzLWFib3V0LWFjY2Vzc2liaWxpdHkvXG4gICAgICovXG4gICAgJGJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCBhcmlhTGFiZWxQYXJ0cy5qb2luKCcgLCAnKSlcblxuICAgIC8vIFN3YXAgaWNvbiwgY2hhbmdlIGNsYXNzXG4gICAgaWYgKGV4cGFuZGVkKSB7XG4gICAgICAkY29udGVudC5yZW1vdmVBdHRyaWJ1dGUoJ2hpZGRlbicpXG4gICAgICAkc2VjdGlvbi5jbGFzc0xpc3QuYWRkKHRoaXMuc2VjdGlvbkV4cGFuZGVkQ2xhc3MpXG4gICAgICAkc2hvd0hpZGVJY29uLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5kb3duQ2hldnJvbkljb25DbGFzcylcbiAgICB9IGVsc2Uge1xuICAgICAgJGNvbnRlbnQuc2V0QXR0cmlidXRlKCdoaWRkZW4nLCAndW50aWwtZm91bmQnKVxuICAgICAgJHNlY3Rpb24uY2xhc3NMaXN0LnJlbW92ZSh0aGlzLnNlY3Rpb25FeHBhbmRlZENsYXNzKVxuICAgICAgJHNob3dIaWRlSWNvbi5jbGFzc0xpc3QuYWRkKHRoaXMuZG93bkNoZXZyb25JY29uQ2xhc3MpXG4gICAgfVxuXG4gICAgLy8gU2VlIGlmIFwiU2hvdyBhbGwgc2VjdGlvbnNcIiBidXR0b24gdGV4dCBzaG91bGQgYmUgdXBkYXRlZFxuICAgIHRoaXMudXBkYXRlU2hvd0FsbEJ1dHRvbih0aGlzLmFyZUFsbFNlY3Rpb25zT3BlbigpKVxuICB9XG5cbiAgLyoqXG4gICAqIEdldCBzdGF0ZSBvZiBzZWN0aW9uXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gJHNlY3Rpb24gLSBTZWN0aW9uIGVsZW1lbnRcbiAgICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgZXhwYW5kZWRcbiAgICovXG4gIGlzRXhwYW5kZWQoJHNlY3Rpb24pIHtcbiAgICByZXR1cm4gJHNlY3Rpb24uY2xhc3NMaXN0LmNvbnRhaW5zKHRoaXMuc2VjdGlvbkV4cGFuZGVkQ2xhc3MpXG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgYWxsIHNlY3Rpb25zIGFyZSBvcGVuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIGFsbCBzZWN0aW9ucyBhcmUgb3BlblxuICAgKi9cbiAgYXJlQWxsU2VjdGlvbnNPcGVuKCkge1xuICAgIHJldHVybiBBcnJheS5mcm9tKHRoaXMuJHNlY3Rpb25zKS5ldmVyeSgoJHNlY3Rpb24pID0+XG4gICAgICB0aGlzLmlzRXhwYW5kZWQoJHNlY3Rpb24pXG4gICAgKVxuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSBcIlNob3cgYWxsIHNlY3Rpb25zXCIgYnV0dG9uXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gZXhwYW5kZWQgLSBTZWN0aW9uIGV4cGFuZGVkXG4gICAqL1xuICB1cGRhdGVTaG93QWxsQnV0dG9uKGV4cGFuZGVkKSB7XG4gICAgaWYgKCF0aGlzLiRzaG93QWxsQnV0dG9uIHx8ICF0aGlzLiRzaG93QWxsVGV4dCB8fCAhdGhpcy4kc2hvd0FsbEljb24pIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIHRoaXMuJHNob3dBbGxCdXR0b24uc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgZXhwYW5kZWQudG9TdHJpbmcoKSlcbiAgICB0aGlzLiRzaG93QWxsVGV4dC50ZXh0Q29udGVudCA9IGV4cGFuZGVkXG4gICAgICA/IHRoaXMuaTE4bi50KCdoaWRlQWxsU2VjdGlvbnMnKVxuICAgICAgOiB0aGlzLmkxOG4udCgnc2hvd0FsbFNlY3Rpb25zJylcbiAgICB0aGlzLiRzaG93QWxsSWNvbi5jbGFzc0xpc3QudG9nZ2xlKHRoaXMuZG93bkNoZXZyb25JY29uQ2xhc3MsICFleHBhbmRlZClcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGlkZW50aWZpZXIgZm9yIGEgc2VjdGlvblxuICAgKlxuICAgKiBXZSBuZWVkIGEgdW5pcXVlIHdheSBvZiBpZGVudGlmeWluZyBlYWNoIGNvbnRlbnQgaW4gdGhlIEFjY29yZGlvbi5cbiAgICogU2luY2UgYW4gYCNpZGAgc2hvdWxkIGJlIHVuaXF1ZSBhbmQgYW4gYGlkYCBpcyByZXF1aXJlZCBmb3IgYGFyaWEtYFxuICAgKiBhdHRyaWJ1dGVzIGBpZGAgY2FuIGJlIHNhZmVseSB1c2VkLlxuICAgKlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9ICRzZWN0aW9uIC0gU2VjdGlvbiBlbGVtZW50XG4gICAqIEByZXR1cm5zIHtzdHJpbmcgfCB1bmRlZmluZWQgfCBudWxsfSBJZGVudGlmaWVyIGZvciBzZWN0aW9uXG4gICAqL1xuICBnZXRJZGVudGlmaWVyKCRzZWN0aW9uKSB7XG4gICAgY29uc3QgJGJ1dHRvbiA9ICRzZWN0aW9uLnF1ZXJ5U2VsZWN0b3IoYC4ke3RoaXMuc2VjdGlvbkJ1dHRvbkNsYXNzfWApXG5cbiAgICByZXR1cm4gJGJ1dHRvbj8uZ2V0QXR0cmlidXRlKCdhcmlhLWNvbnRyb2xzJylcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIHN0YXRlIG9mIHRoZSBhY2NvcmRpb25zIGluIHNlc3Npb25TdG9yYWdlXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gJHNlY3Rpb24gLSBTZWN0aW9uIGVsZW1lbnRcbiAgICogQHBhcmFtIHtib29sZWFufSBpc0V4cGFuZGVkIC0gV2hldGhlciB0aGUgc2VjdGlvbiBpcyBleHBhbmRlZFxuICAgKi9cbiAgc3RvcmVTdGF0ZSgkc2VjdGlvbiwgaXNFeHBhbmRlZCkge1xuICAgIGlmICghdGhpcy5jb25maWcucmVtZW1iZXJFeHBhbmRlZCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgY29uc3QgaWQgPSB0aGlzLmdldElkZW50aWZpZXIoJHNlY3Rpb24pXG5cbiAgICBpZiAoaWQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHdpbmRvdy5zZXNzaW9uU3RvcmFnZS5zZXRJdGVtKGlkLCBpc0V4cGFuZGVkLnRvU3RyaW5nKCkpXG4gICAgICB9IGNhdGNoIChleGNlcHRpb24pIHt9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlYWQgdGhlIHN0YXRlIG9mIHRoZSBhY2NvcmRpb25zIGZyb20gc2Vzc2lvblN0b3JhZ2VcbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtFbGVtZW50fSAkc2VjdGlvbiAtIFNlY3Rpb24gZWxlbWVudFxuICAgKi9cbiAgc2V0SW5pdGlhbFN0YXRlKCRzZWN0aW9uKSB7XG4gICAgaWYgKCF0aGlzLmNvbmZpZy5yZW1lbWJlckV4cGFuZGVkKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBjb25zdCBpZCA9IHRoaXMuZ2V0SWRlbnRpZmllcigkc2VjdGlvbilcblxuICAgIGlmIChpZCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3Qgc3RhdGUgPSB3aW5kb3cuc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShpZClcblxuICAgICAgICBpZiAoc3RhdGUgIT09IG51bGwpIHtcbiAgICAgICAgICB0aGlzLnNldEV4cGFuZGVkKHN0YXRlID09PSAndHJ1ZScsICRzZWN0aW9uKVxuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChleGNlcHRpb24pIHt9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhbiBlbGVtZW50IHRvIGltcHJvdmUgc2VtYW50aWNzIG9mIHRoZSBzZWN0aW9uIGJ1dHRvbiB3aXRoXG4gICAqIHB1bmN0dWF0aW9uXG4gICAqXG4gICAqIEFkZGluZyBwdW5jdHVhdGlvbiB0byB0aGUgYnV0dG9uIGNhbiBhbHNvIGltcHJvdmUgaXRzIGdlbmVyYWwgc2VtYW50aWNzIGJ5XG4gICAqIGRpdmlkaW5nIGl0cyBjb250ZW50cyBpbnRvIHRoZW1hdGljIGNodW5rcy4gU2VlXG4gICAqIGh0dHBzOi8vZ2l0aHViLmNvbS9hbHBoYWdvdi9nb3Z1ay1mcm9udGVuZC9pc3N1ZXMvMjMyNyNpc3N1ZWNvbW1lbnQtOTIyOTU3NDQyXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEByZXR1cm5zIHtFbGVtZW50fSBET00gZWxlbWVudFxuICAgKi9cbiAgZ2V0QnV0dG9uUHVuY3R1YXRpb25FbCgpIHtcbiAgICBjb25zdCAkcHVuY3R1YXRpb25FbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxuICAgICRwdW5jdHVhdGlvbkVsLmNsYXNzTGlzdC5hZGQoXG4gICAgICAnZ292dWstdmlzdWFsbHktaGlkZGVuJyxcbiAgICAgIHRoaXMuc2VjdGlvbkhlYWRpbmdEaXZpZGVyQ2xhc3NcbiAgICApXG4gICAgJHB1bmN0dWF0aW9uRWwudGV4dENvbnRlbnQgPSAnLCAnXG4gICAgcmV0dXJuICRwdW5jdHVhdGlvbkVsXG4gIH1cblxuICAvKipcbiAgICogTmFtZSBmb3IgdGhlIGNvbXBvbmVudCB1c2VkIHdoZW4gaW5pdGlhbGlzaW5nIHVzaW5nIGRhdGEtbW9kdWxlIGF0dHJpYnV0ZXMuXG4gICAqL1xuICBzdGF0aWMgbW9kdWxlTmFtZSA9ICdnb3Z1ay1hY2NvcmRpb24nXG5cbiAgLyoqXG4gICAqIEFjY29yZGlvbiBkZWZhdWx0IGNvbmZpZ1xuICAgKlxuICAgKiBAc2VlIHtAbGluayBBY2NvcmRpb25Db25maWd9XG4gICAqIEBjb25zdGFudFxuICAgKiBAdHlwZSB7QWNjb3JkaW9uQ29uZmlnfVxuICAgKi9cbiAgc3RhdGljIGRlZmF1bHRzID0gT2JqZWN0LmZyZWV6ZSh7XG4gICAgaTE4bjoge1xuICAgICAgaGlkZUFsbFNlY3Rpb25zOiAnSGlkZSBhbGwgc2VjdGlvbnMnLFxuICAgICAgaGlkZVNlY3Rpb246ICdIaWRlJyxcbiAgICAgIGhpZGVTZWN0aW9uQXJpYUxhYmVsOiAnSGlkZSB0aGlzIHNlY3Rpb24nLFxuICAgICAgc2hvd0FsbFNlY3Rpb25zOiAnU2hvdyBhbGwgc2VjdGlvbnMnLFxuICAgICAgc2hvd1NlY3Rpb246ICdTaG93JyxcbiAgICAgIHNob3dTZWN0aW9uQXJpYUxhYmVsOiAnU2hvdyB0aGlzIHNlY3Rpb24nXG4gICAgfSxcbiAgICByZW1lbWJlckV4cGFuZGVkOiB0cnVlXG4gIH0pXG5cbiAgLyoqXG4gICAqIEFjY29yZGlvbiBjb25maWcgc2NoZW1hXG4gICAqXG4gICAqIEBjb25zdGFudFxuICAgKiBAc2F0aXNmaWVzIHtTY2hlbWE8QWNjb3JkaW9uQ29uZmlnPn1cbiAgICovXG4gIHN0YXRpYyBzY2hlbWEgPSBPYmplY3QuZnJlZXplKHtcbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICBpMThuOiB7IHR5cGU6ICdvYmplY3QnIH0sXG4gICAgICByZW1lbWJlckV4cGFuZGVkOiB7IHR5cGU6ICdib29sZWFuJyB9XG4gICAgfVxuICB9KVxufVxuXG4vKipcbiAqIEFjY29yZGlvbiBjb25maWdcbiAqXG4gKiBAc2VlIHtAbGluayBBY2NvcmRpb24uZGVmYXVsdHN9XG4gKiBAdHlwZWRlZiB7b2JqZWN0fSBBY2NvcmRpb25Db25maWdcbiAqIEBwcm9wZXJ0eSB7QWNjb3JkaW9uVHJhbnNsYXRpb25zfSBbaTE4bj1BY2NvcmRpb24uZGVmYXVsdHMuaTE4bl0gLSBBY2NvcmRpb24gdHJhbnNsYXRpb25zXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IFtyZW1lbWJlckV4cGFuZGVkXSAtIFdoZXRoZXIgdGhlIGV4cGFuZGVkIGFuZCBjb2xsYXBzZWRcbiAqICAgc3RhdGUgb2YgZWFjaCBzZWN0aW9uIGlzIHJlbWVtYmVyZWQgYW5kIHJlc3RvcmVkIHdoZW4gbmF2aWdhdGluZy5cbiAqL1xuXG4vKipcbiAqIEFjY29yZGlvbiB0cmFuc2xhdGlvbnNcbiAqXG4gKiBAc2VlIHtAbGluayBBY2NvcmRpb24uZGVmYXVsdHMuaTE4bn1cbiAqIEB0eXBlZGVmIHtvYmplY3R9IEFjY29yZGlvblRyYW5zbGF0aW9uc1xuICpcbiAqIE1lc3NhZ2VzIHVzZWQgYnkgdGhlIGNvbXBvbmVudCBmb3IgdGhlIGxhYmVscyBvZiBpdHMgYnV0dG9ucy4gVGhpcyBpbmNsdWRlc1xuICogdGhlIHZpc2libGUgdGV4dCBzaG93biBvbiBzY3JlZW4sIGFuZCB0ZXh0IHRvIGhlbHAgYXNzaXN0aXZlIHRlY2hub2xvZ3kgdXNlcnNcbiAqIGZvciB0aGUgYnV0dG9ucyB0b2dnbGluZyBlYWNoIHNlY3Rpb24uXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW2hpZGVBbGxTZWN0aW9uc10gLSBUaGUgdGV4dCBjb250ZW50IGZvciB0aGUgJ0hpZGUgYWxsXG4gKiAgIHNlY3Rpb25zJyBidXR0b24sIHVzZWQgd2hlbiBhdCBsZWFzdCBvbmUgc2VjdGlvbiBpcyBleHBhbmRlZC5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbaGlkZVNlY3Rpb25dIC0gVGhlIHRleHQgY29udGVudCBmb3IgdGhlICdIaWRlJ1xuICogICBidXR0b24sIHVzZWQgd2hlbiBhIHNlY3Rpb24gaXMgZXhwYW5kZWQuXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW2hpZGVTZWN0aW9uQXJpYUxhYmVsXSAtIFRoZSB0ZXh0IGNvbnRlbnQgYXBwZW5kZWQgdG8gdGhlXG4gKiAgICdIaWRlJyBidXR0b24ncyBhY2Nlc3NpYmxlIG5hbWUgd2hlbiBhIHNlY3Rpb24gaXMgZXhwYW5kZWQuXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW3Nob3dBbGxTZWN0aW9uc10gLSBUaGUgdGV4dCBjb250ZW50IGZvciB0aGUgJ1Nob3cgYWxsXG4gKiAgIHNlY3Rpb25zJyBidXR0b24sIHVzZWQgd2hlbiBhbGwgc2VjdGlvbnMgYXJlIGNvbGxhcHNlZC5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbc2hvd1NlY3Rpb25dIC0gVGhlIHRleHQgY29udGVudCBmb3IgdGhlICdTaG93J1xuICogICBidXR0b24sIHVzZWQgd2hlbiBhIHNlY3Rpb24gaXMgY29sbGFwc2VkLlxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtzaG93U2VjdGlvbkFyaWFMYWJlbF0gLSBUaGUgdGV4dCBjb250ZW50IGFwcGVuZGVkIHRvIHRoZVxuICogICAnU2hvdycgYnV0dG9uJ3MgYWNjZXNzaWJsZSBuYW1lIHdoZW4gYSBzZWN0aW9uIGlzIGV4cGFuZGVkLlxuICovXG5cbi8qKlxuICogQGltcG9ydCB7IFNjaGVtYSB9IGZyb20gJy4uLy4uL2NvbW1vbi9jb25maWd1cmF0aW9uLm1qcydcbiAqL1xuIiwiaW1wb3J0IHsgQ29uZmlndXJhYmxlQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vY29tbW9uL2NvbmZpZ3VyYXRpb24ubWpzJ1xuXG5jb25zdCBERUJPVU5DRV9USU1FT1VUX0lOX1NFQ09ORFMgPSAxXG5cbi8qKlxuICogSmF2YVNjcmlwdCBlbmhhbmNlbWVudHMgZm9yIHRoZSBCdXR0b24gY29tcG9uZW50XG4gKlxuICogQHByZXNlcnZlXG4gKiBAYXVnbWVudHMgQ29uZmlndXJhYmxlQ29tcG9uZW50PEJ1dHRvbkNvbmZpZz5cbiAqL1xuZXhwb3J0IGNsYXNzIEJ1dHRvbiBleHRlbmRzIENvbmZpZ3VyYWJsZUNvbXBvbmVudCB7XG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAdHlwZSB7bnVtYmVyIHwgbnVsbH1cbiAgICovXG4gIGRlYm91bmNlRm9ybVN1Ym1pdFRpbWVyID0gbnVsbFxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0VsZW1lbnQgfCBudWxsfSAkcm9vdCAtIEhUTUwgZWxlbWVudCB0byB1c2UgZm9yIGJ1dHRvblxuICAgKiBAcGFyYW0ge0J1dHRvbkNvbmZpZ30gW2NvbmZpZ10gLSBCdXR0b24gY29uZmlnXG4gICAqL1xuICBjb25zdHJ1Y3Rvcigkcm9vdCwgY29uZmlnID0ge30pIHtcbiAgICBzdXBlcigkcm9vdCwgY29uZmlnKVxuXG4gICAgdGhpcy4kcm9vdC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGV2ZW50KSA9PiB0aGlzLmhhbmRsZUtleURvd24oZXZlbnQpKVxuICAgIHRoaXMuJHJvb3QuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHRoaXMuZGVib3VuY2UoZXZlbnQpKVxuICB9XG5cbiAgLyoqXG4gICAqIFRyaWdnZXIgYSBjbGljayBldmVudCB3aGVuIHRoZSBzcGFjZSBrZXkgaXMgcHJlc3NlZFxuICAgKlxuICAgKiBTb21lIHNjcmVlbiByZWFkZXJzIHRlbGwgdXNlcnMgdGhleSBjYW4gdXNlIHRoZSBzcGFjZSBiYXIgdG8gYWN0aXZhdGVcbiAgICogdGhpbmdzIHdpdGggdGhlICdidXR0b24nIHJvbGUsIHNvIHdlIG5lZWQgdG8gbWF0Y2ggdGhlIGZ1bmN0aW9uYWxpdHkgb2ZcbiAgICogbmF0aXZlIEhUTUwgYnV0dG9ucy5cbiAgICpcbiAgICogU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hbHBoYWdvdi9nb3Z1a19lbGVtZW50cy9wdWxsLzI3MiNpc3N1ZWNvbW1lbnQtMjMzMDI4MjcwXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgLSBLZXlkb3duIGV2ZW50XG4gICAqL1xuICBoYW5kbGVLZXlEb3duKGV2ZW50KSB7XG4gICAgY29uc3QgJHRhcmdldCA9IGV2ZW50LnRhcmdldFxuXG4gICAgLy8gSGFuZGxlIHNwYWNlIGJhciBvbmx5XG4gICAgaWYgKGV2ZW50LmtleSAhPT0gJyAnKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICAvLyBIYW5kbGUgZWxlbWVudHMgd2l0aCBbcm9sZT1cImJ1dHRvblwiXSBvbmx5XG4gICAgaWYgKFxuICAgICAgJHRhcmdldCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50ICYmXG4gICAgICAkdGFyZ2V0LmdldEF0dHJpYnV0ZSgncm9sZScpID09PSAnYnV0dG9uJ1xuICAgICkge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKSAvLyBwcmV2ZW50IHRoZSBwYWdlIGZyb20gc2Nyb2xsaW5nXG4gICAgICAkdGFyZ2V0LmNsaWNrKClcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRGVib3VuY2UgZG91YmxlLWNsaWNrc1xuICAgKlxuICAgKiBJZiB0aGUgY2xpY2sgcXVpY2tseSBzdWNjZWVkcyBhIHByZXZpb3VzIGNsaWNrIHRoZW4gbm90aGluZyB3aWxsIGhhcHBlbi5cbiAgICogVGhpcyBzdG9wcyBwZW9wbGUgYWNjaWRlbnRhbGx5IGNhdXNpbmcgbXVsdGlwbGUgZm9ybSBzdWJtaXNzaW9ucyBieSBkb3VibGVcbiAgICogY2xpY2tpbmcgYnV0dG9ucy5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtNb3VzZUV2ZW50fSBldmVudCAtIE1vdXNlIGNsaWNrIGV2ZW50XG4gICAqIEByZXR1cm5zIHt1bmRlZmluZWQgfCBmYWxzZX0gUmV0dXJucyB1bmRlZmluZWQsIG9yIGZhbHNlIHdoZW4gZGVib3VuY2VkXG4gICAqL1xuICBkZWJvdW5jZShldmVudCkge1xuICAgIC8vIENoZWNrIHRoZSBidXR0b24gdGhhdCB3YXMgY2xpY2tlZCBoYXMgcHJldmVudERvdWJsZUNsaWNrIGVuYWJsZWRcbiAgICBpZiAoIXRoaXMuY29uZmlnLnByZXZlbnREb3VibGVDbGljaykge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgLy8gSWYgdGhlIHRpbWVyIGlzIHN0aWxsIHJ1bm5pbmcsIHByZXZlbnQgdGhlIGNsaWNrIGZyb20gc3VibWl0dGluZyB0aGUgZm9ybVxuICAgIGlmICh0aGlzLmRlYm91bmNlRm9ybVN1Ym1pdFRpbWVyKSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICB0aGlzLmRlYm91bmNlRm9ybVN1Ym1pdFRpbWVyID0gd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5kZWJvdW5jZUZvcm1TdWJtaXRUaW1lciA9IG51bGxcbiAgICB9LCBERUJPVU5DRV9USU1FT1VUX0lOX1NFQ09ORFMgKiAxMDAwKVxuICB9XG5cbiAgLyoqXG4gICAqIE5hbWUgZm9yIHRoZSBjb21wb25lbnQgdXNlZCB3aGVuIGluaXRpYWxpc2luZyB1c2luZyBkYXRhLW1vZHVsZSBhdHRyaWJ1dGVzLlxuICAgKi9cbiAgc3RhdGljIG1vZHVsZU5hbWUgPSAnZ292dWstYnV0dG9uJ1xuXG4gIC8qKlxuICAgKiBCdXR0b24gZGVmYXVsdCBjb25maWdcbiAgICpcbiAgICogQHNlZSB7QGxpbmsgQnV0dG9uQ29uZmlnfVxuICAgKiBAY29uc3RhbnRcbiAgICogQHR5cGUge0J1dHRvbkNvbmZpZ31cbiAgICovXG4gIHN0YXRpYyBkZWZhdWx0cyA9IE9iamVjdC5mcmVlemUoe1xuICAgIHByZXZlbnREb3VibGVDbGljazogZmFsc2VcbiAgfSlcblxuICAvKipcbiAgICogQnV0dG9uIGNvbmZpZyBzY2hlbWFcbiAgICpcbiAgICogQGNvbnN0YW50XG4gICAqIEBzYXRpc2ZpZXMge1NjaGVtYTxCdXR0b25Db25maWc+fVxuICAgKi9cbiAgc3RhdGljIHNjaGVtYSA9IE9iamVjdC5mcmVlemUoe1xuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgIHByZXZlbnREb3VibGVDbGljazogeyB0eXBlOiAnYm9vbGVhbicgfVxuICAgIH1cbiAgfSlcbn1cblxuLyoqXG4gKiBCdXR0b24gY29uZmlnXG4gKlxuICogQHR5cGVkZWYge29iamVjdH0gQnV0dG9uQ29uZmlnXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IFtwcmV2ZW50RG91YmxlQ2xpY2s9ZmFsc2VdIC0gUHJldmVudCBhY2NpZGVudGFsIGRvdWJsZVxuICogICBjbGlja3Mgb24gc3VibWl0IGJ1dHRvbnMgZnJvbSBzdWJtaXR0aW5nIGZvcm1zIG11bHRpcGxlIHRpbWVzLlxuICovXG5cbi8qKlxuICogQGltcG9ydCB7IFNjaGVtYSB9IGZyb20gJy4uLy4uL2NvbW1vbi9jb25maWd1cmF0aW9uLm1qcydcbiAqL1xuIiwiaW1wb3J0IHsgY2xvc2VzdEF0dHJpYnV0ZVZhbHVlIH0gZnJvbSAnLi4vLi4vY29tbW9uL2Nsb3Nlc3QtYXR0cmlidXRlLXZhbHVlLm1qcydcbmltcG9ydCB7XG4gIHZhbGlkYXRlQ29uZmlnLFxuICBDb25maWd1cmFibGVDb21wb25lbnQsXG4gIGNvbmZpZ092ZXJyaWRlXG59IGZyb20gJy4uLy4uL2NvbW1vbi9jb25maWd1cmF0aW9uLm1qcydcbmltcG9ydCB7IGZvcm1hdEVycm9yTWVzc2FnZSB9IGZyb20gJy4uLy4uL2NvbW1vbi9pbmRleC5tanMnXG5pbXBvcnQgeyBDb25maWdFcnJvciwgRWxlbWVudEVycm9yIH0gZnJvbSAnLi4vLi4vZXJyb3JzL2luZGV4Lm1qcydcbmltcG9ydCB7IEkxOG4gfSBmcm9tICcuLi8uLi9pMThuLm1qcydcblxuLyoqXG4gKiBDaGFyYWN0ZXIgY291bnQgY29tcG9uZW50XG4gKlxuICogVHJhY2tzIHRoZSBudW1iZXIgb2YgY2hhcmFjdGVycyBvciB3b3JkcyBpbiB0aGUgYC5nb3Z1ay1qcy1jaGFyYWN0ZXItY291bnRgXG4gKiBgPHRleHRhcmVhPmAgaW5zaWRlIHRoZSBlbGVtZW50LiBEaXNwbGF5cyBhIG1lc3NhZ2Ugd2l0aCB0aGUgcmVtYWluaW5nIG51bWJlclxuICogb2YgY2hhcmFjdGVycy93b3JkcyBhdmFpbGFibGUsIG9yIHRoZSBudW1iZXIgb2YgY2hhcmFjdGVycy93b3JkcyBpbiBleGNlc3MuXG4gKlxuICogWW91IGNhbiBjb25maWd1cmUgdGhlIG1lc3NhZ2UgdG8gb25seSBhcHBlYXIgYWZ0ZXIgYSBjZXJ0YWluIHBlcmNlbnRhZ2VcbiAqIG9mIHRoZSBhdmFpbGFibGUgY2hhcmFjdGVycy93b3JkcyBoYXMgYmVlbiBlbnRlcmVkLlxuICpcbiAqIEBwcmVzZXJ2ZVxuICogQGF1Z21lbnRzIENvbmZpZ3VyYWJsZUNvbXBvbmVudDxDaGFyYWN0ZXJDb3VudENvbmZpZz5cbiAqL1xuZXhwb3J0IGNsYXNzIENoYXJhY3RlckNvdW50IGV4dGVuZHMgQ29uZmlndXJhYmxlQ29tcG9uZW50IHtcbiAgLyoqIEBwcml2YXRlICovXG4gICR0ZXh0YXJlYVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICAkdmlzaWJsZUNvdW50TWVzc2FnZVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICAkc2NyZWVuUmVhZGVyQ291bnRNZXNzYWdlXG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqIEB0eXBlIHtudW1iZXIgfCBudWxsfVxuICAgKi9cbiAgbGFzdElucHV0VGltZXN0YW1wID0gbnVsbFxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBsYXN0SW5wdXRWYWx1ZSA9ICcnXG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqIEB0eXBlIHtudW1iZXIgfCBudWxsfVxuICAgKi9cbiAgdmFsdWVDaGVja2VyID0gbnVsbFxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBpMThuXG5cbiAgLyoqIEBwcml2YXRlICovXG4gIG1heExlbmd0aDtcblxuICAvKipcbiAgICogQ2hhcmFjdGVyIGNvdW50IGNvbmZpZyBvdmVycmlkZVxuICAgKlxuICAgKiBUbyBlbnN1cmUgZGF0YS1hdHRyaWJ1dGVzIHRha2UgY29tcGxldGUgcHJlY2VkZW5jZSwgZXZlbiBpZiB0aGV5IGNoYW5nZVxuICAgKiB0aGUgdHlwZSBvZiBjb3VudCwgd2UgbmVlZCB0byByZXNldCB0aGUgYG1heGxlbmd0aGAgYW5kIGBtYXh3b3Jkc2AgZnJvbVxuICAgKiB0aGUgSmF2YVNjcmlwdCBjb25maWcuXG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKiBAcGFyYW0ge0NoYXJhY3RlckNvdW50Q29uZmlnfSBkYXRhc2V0Q29uZmlnIC0gY29uZmlndXJhdGlvbiBzcGVjaWZpZWQgYnkgZGF0YXNldFxuICAgKiBAcmV0dXJucyB7Q2hhcmFjdGVyQ291bnRDb25maWd9IC0gY29uZmlndXJhdGlvbiB0byBvdmVycmlkZSBieSBkYXRhc2V0XG4gICAqL1xuICBbY29uZmlnT3ZlcnJpZGVdKGRhdGFzZXRDb25maWcpIHtcbiAgICBsZXQgY29uZmlnT3ZlcnJpZGVzID0ge31cbiAgICBpZiAoJ21heHdvcmRzJyBpbiBkYXRhc2V0Q29uZmlnIHx8ICdtYXhsZW5ndGgnIGluIGRhdGFzZXRDb25maWcpIHtcbiAgICAgIGNvbmZpZ092ZXJyaWRlcyA9IHtcbiAgICAgICAgbWF4bGVuZ3RoOiB1bmRlZmluZWQsXG4gICAgICAgIG1heHdvcmRzOiB1bmRlZmluZWRcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gY29uZmlnT3ZlcnJpZGVzXG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtFbGVtZW50IHwgbnVsbH0gJHJvb3QgLSBIVE1MIGVsZW1lbnQgdG8gdXNlIGZvciBjaGFyYWN0ZXIgY291bnRcbiAgICogQHBhcmFtIHtDaGFyYWN0ZXJDb3VudENvbmZpZ30gW2NvbmZpZ10gLSBDaGFyYWN0ZXIgY291bnQgY29uZmlnXG4gICAqL1xuICBjb25zdHJ1Y3Rvcigkcm9vdCwgY29uZmlnID0ge30pIHtcbiAgICBzdXBlcigkcm9vdCwgY29uZmlnKVxuXG4gICAgY29uc3QgJHRleHRhcmVhID0gdGhpcy4kcm9vdC5xdWVyeVNlbGVjdG9yKCcuZ292dWstanMtY2hhcmFjdGVyLWNvdW50JylcbiAgICBpZiAoXG4gICAgICAhKFxuICAgICAgICAkdGV4dGFyZWEgaW5zdGFuY2VvZiBIVE1MVGV4dEFyZWFFbGVtZW50IHx8XG4gICAgICAgICR0ZXh0YXJlYSBpbnN0YW5jZW9mIEhUTUxJbnB1dEVsZW1lbnRcbiAgICAgIClcbiAgICApIHtcbiAgICAgIHRocm93IG5ldyBFbGVtZW50RXJyb3Ioe1xuICAgICAgICBjb21wb25lbnQ6IENoYXJhY3RlckNvdW50LFxuICAgICAgICBlbGVtZW50OiAkdGV4dGFyZWEsXG4gICAgICAgIGV4cGVjdGVkVHlwZTogJ0hUTUxUZXh0YXJlYUVsZW1lbnQgb3IgSFRNTElucHV0RWxlbWVudCcsXG4gICAgICAgIGlkZW50aWZpZXI6ICdGb3JtIGZpZWxkIChgLmdvdnVrLWpzLWNoYXJhY3Rlci1jb3VudGApJ1xuICAgICAgfSlcbiAgICB9XG5cbiAgICAvLyBDaGVjayBmb3IgdmFsaWQgY29uZmlnXG4gICAgY29uc3QgZXJyb3JzID0gdmFsaWRhdGVDb25maWcoQ2hhcmFjdGVyQ291bnQuc2NoZW1hLCB0aGlzLmNvbmZpZylcbiAgICBpZiAoZXJyb3JzWzBdKSB7XG4gICAgICB0aHJvdyBuZXcgQ29uZmlnRXJyb3IoZm9ybWF0RXJyb3JNZXNzYWdlKENoYXJhY3RlckNvdW50LCBlcnJvcnNbMF0pKVxuICAgIH1cblxuICAgIHRoaXMuaTE4biA9IG5ldyBJMThuKHRoaXMuY29uZmlnLmkxOG4sIHtcbiAgICAgIC8vIFJlYWQgdGhlIGZhbGxiYWNrIGlmIG5lY2Vzc2FyeSByYXRoZXIgdGhhbiBoYXZlIGl0IHNldCBpbiB0aGUgZGVmYXVsdHNcbiAgICAgIGxvY2FsZTogY2xvc2VzdEF0dHJpYnV0ZVZhbHVlKHRoaXMuJHJvb3QsICdsYW5nJylcbiAgICB9KVxuXG4gICAgLy8gRGV0ZXJtaW5lIHRoZSBsaW1pdCBhdHRyaWJ1dGUgKGNoYXJhY3RlcnMgb3Igd29yZHMpXG4gICAgdGhpcy5tYXhMZW5ndGggPSB0aGlzLmNvbmZpZy5tYXh3b3JkcyA/PyB0aGlzLmNvbmZpZy5tYXhsZW5ndGggPz8gSW5maW5pdHlcblxuICAgIHRoaXMuJHRleHRhcmVhID0gJHRleHRhcmVhXG5cbiAgICBjb25zdCB0ZXh0YXJlYURlc2NyaXB0aW9uSWQgPSBgJHt0aGlzLiR0ZXh0YXJlYS5pZH0taW5mb2BcbiAgICBjb25zdCAkdGV4dGFyZWFEZXNjcmlwdGlvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRleHRhcmVhRGVzY3JpcHRpb25JZClcbiAgICBpZiAoISR0ZXh0YXJlYURlc2NyaXB0aW9uKSB7XG4gICAgICB0aHJvdyBuZXcgRWxlbWVudEVycm9yKHtcbiAgICAgICAgY29tcG9uZW50OiBDaGFyYWN0ZXJDb3VudCxcbiAgICAgICAgZWxlbWVudDogJHRleHRhcmVhRGVzY3JpcHRpb24sXG4gICAgICAgIGlkZW50aWZpZXI6IGBDb3VudCBtZXNzYWdlIChcXGBpZD1cIiR7dGV4dGFyZWFEZXNjcmlwdGlvbklkfVwiXFxgKWBcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgLy8gUHJlLWV4aXN0aW5nIHZhbGlkYXRpb24gZXJyb3IgcmVuZGVyZWQgZnJvbSBzZXJ2ZXJcbiAgICB0aGlzLiRlcnJvck1lc3NhZ2UgPSB0aGlzLiRyb290LnF1ZXJ5U2VsZWN0b3IoJy5nb3Z1ay1lcnJvci1tZXNzYWdlJylcblxuICAgIC8vIEluamVjdCBhIGRlc2NyaXB0aW9uIGZvciB0aGUgdGV4dGFyZWEgaWYgbm9uZSBpcyBwcmVzZW50IGFscmVhZHlcbiAgICAvLyBmb3Igd2hlbiB0aGUgY29tcG9uZW50IHdhcyByZW5kZXJlZCB3aXRoIG5vIG1heGxlbmd0aCwgbWF4d29yZHNcbiAgICAvLyBub3IgY3VzdG9tIHRleHRhcmVhRGVzY3JpcHRpb25UZXh0XG4gICAgaWYgKGAkeyR0ZXh0YXJlYURlc2NyaXB0aW9uLnRleHRDb250ZW50fWAubWF0Y2goL15cXHMqJC8pKSB7XG4gICAgICAkdGV4dGFyZWFEZXNjcmlwdGlvbi50ZXh0Q29udGVudCA9IHRoaXMuaTE4bi50KCd0ZXh0YXJlYURlc2NyaXB0aW9uJywge1xuICAgICAgICBjb3VudDogdGhpcy5tYXhMZW5ndGhcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgLy8gTW92ZSB0aGUgdGV4dGFyZWEgZGVzY3JpcHRpb24gdG8gYmUgaW1tZWRpYXRlbHkgYWZ0ZXIgdGhlIHRleHRhcmVhXG4gICAgLy8gS2VwdCBmb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHlcbiAgICB0aGlzLiR0ZXh0YXJlYS5pbnNlcnRBZGphY2VudEVsZW1lbnQoJ2FmdGVyZW5kJywgJHRleHRhcmVhRGVzY3JpcHRpb24pXG5cbiAgICAvLyBDcmVhdGUgdGhlICpzY3JlZW4gcmVhZGVyKiBzcGVjaWZpYyBsaXZlLXVwZGF0aW5nIGNvdW50ZXJcbiAgICAvLyBUaGlzIGRvZXNuJ3QgbmVlZCBhbnkgc3R5bGluZyBjbGFzc2VzLCBhcyBpdCBpcyBuZXZlciB2aXNpYmxlXG4gICAgY29uc3QgJHNjcmVlblJlYWRlckNvdW50TWVzc2FnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgJHNjcmVlblJlYWRlckNvdW50TWVzc2FnZS5jbGFzc05hbWUgPVxuICAgICAgJ2dvdnVrLWNoYXJhY3Rlci1jb3VudF9fc3Itc3RhdHVzIGdvdnVrLXZpc3VhbGx5LWhpZGRlbidcbiAgICAkc2NyZWVuUmVhZGVyQ291bnRNZXNzYWdlLnNldEF0dHJpYnV0ZSgnYXJpYS1saXZlJywgJ3BvbGl0ZScpXG4gICAgdGhpcy4kc2NyZWVuUmVhZGVyQ291bnRNZXNzYWdlID0gJHNjcmVlblJlYWRlckNvdW50TWVzc2FnZVxuICAgICR0ZXh0YXJlYURlc2NyaXB0aW9uLmluc2VydEFkamFjZW50RWxlbWVudChcbiAgICAgICdhZnRlcmVuZCcsXG4gICAgICAkc2NyZWVuUmVhZGVyQ291bnRNZXNzYWdlXG4gICAgKVxuXG4gICAgLy8gQ3JlYXRlIG91ciBsaXZlLXVwZGF0aW5nIGNvdW50ZXIgZWxlbWVudCwgY29weWluZyB0aGUgY2xhc3NlcyBmcm9tIHRoZVxuICAgIC8vIHRleHRhcmVhIGRlc2NyaXB0aW9uIGZvciBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eSBhcyB0aGVzZSBtYXkgaGF2ZSBiZWVuXG4gICAgLy8gY29uZmlndXJlZFxuICAgIGNvbnN0ICR2aXNpYmxlQ291bnRNZXNzYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICAkdmlzaWJsZUNvdW50TWVzc2FnZS5jbGFzc05hbWUgPSAkdGV4dGFyZWFEZXNjcmlwdGlvbi5jbGFzc05hbWVcbiAgICAkdmlzaWJsZUNvdW50TWVzc2FnZS5jbGFzc0xpc3QuYWRkKCdnb3Z1ay1jaGFyYWN0ZXItY291bnRfX3N0YXR1cycpXG4gICAgJHZpc2libGVDb3VudE1lc3NhZ2Uuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJylcbiAgICB0aGlzLiR2aXNpYmxlQ291bnRNZXNzYWdlID0gJHZpc2libGVDb3VudE1lc3NhZ2VcbiAgICAkdGV4dGFyZWFEZXNjcmlwdGlvbi5pbnNlcnRBZGphY2VudEVsZW1lbnQoJ2FmdGVyZW5kJywgJHZpc2libGVDb3VudE1lc3NhZ2UpXG5cbiAgICAvLyBIaWRlIHRoZSB0ZXh0YXJlYSBkZXNjcmlwdGlvblxuICAgICR0ZXh0YXJlYURlc2NyaXB0aW9uLmNsYXNzTGlzdC5hZGQoJ2dvdnVrLXZpc3VhbGx5LWhpZGRlbicpXG5cbiAgICAvLyBSZW1vdmUgaGFyZCBsaW1pdCBpZiBzZXRcbiAgICB0aGlzLiR0ZXh0YXJlYS5yZW1vdmVBdHRyaWJ1dGUoJ21heGxlbmd0aCcpXG5cbiAgICB0aGlzLmJpbmRDaGFuZ2VFdmVudHMoKVxuXG4gICAgLy8gV2hlbiB0aGUgcGFnZSBpcyByZXN0b3JlZCBhZnRlciBuYXZpZ2F0aW5nICdiYWNrJyBpbiBzb21lIGJyb3dzZXJzIHRoZVxuICAgIC8vIHN0YXRlIG9mIGZvcm0gY29udHJvbHMgaXMgbm90IHJlc3RvcmVkIHVudGlsICphZnRlciogdGhlIERPTUNvbnRlbnRMb2FkZWRcbiAgICAvLyBldmVudCBpcyBmaXJlZCwgc28gd2UgbmVlZCB0byBzeW5jIGFmdGVyIHRoZSBwYWdlc2hvdyBldmVudC5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncGFnZXNob3cnLCAoKSA9PiB0aGlzLnVwZGF0ZUNvdW50TWVzc2FnZSgpKVxuXG4gICAgLy8gQWx0aG91Z2ggd2UndmUgc2V0IHVwIGhhbmRsZXJzIHRvIHN5bmMgc3RhdGUgb24gdGhlIHBhZ2VzaG93IGV2ZW50LCBpbml0XG4gICAgLy8gY291bGQgYmUgY2FsbGVkIGFmdGVyIHRob3NlIGV2ZW50cyBoYXZlIGZpcmVkLCBmb3IgZXhhbXBsZSBpZiB0aGV5IGFyZVxuICAgIC8vIGFkZGVkIHRvIHRoZSBwYWdlIGR5bmFtaWNhbGx5LCBzbyB1cGRhdGUgbm93IHRvby5cbiAgICB0aGlzLnVwZGF0ZUNvdW50TWVzc2FnZSgpXG4gIH1cblxuICAvKipcbiAgICogQmluZCBjaGFuZ2UgZXZlbnRzXG4gICAqXG4gICAqIFNldCB1cCBldmVudCBsaXN0ZW5lcnMgb24gdGhlICR0ZXh0YXJlYSBzbyB0aGF0IHRoZSBjb3VudCBtZXNzYWdlcyB1cGRhdGVcbiAgICogd2hlbiB0aGUgdXNlciB0eXBlcy5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGJpbmRDaGFuZ2VFdmVudHMoKSB7XG4gICAgdGhpcy4kdGV4dGFyZWEuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCAoKSA9PiB0aGlzLmhhbmRsZUtleVVwKCkpXG5cbiAgICAvLyBCaW5kIGZvY3VzL2JsdXIgZXZlbnRzIHRvIHN0YXJ0L3N0b3AgcG9sbGluZ1xuICAgIHRoaXMuJHRleHRhcmVhLmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgKCkgPT4gdGhpcy5oYW5kbGVGb2N1cygpKVxuICAgIHRoaXMuJHRleHRhcmVhLmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCAoKSA9PiB0aGlzLmhhbmRsZUJsdXIoKSlcbiAgfVxuXG4gIC8qKlxuICAgKiBIYW5kbGUga2V5IHVwIGV2ZW50XG4gICAqXG4gICAqIFVwZGF0ZSB0aGUgdmlzaWJsZSBjaGFyYWN0ZXIgY291bnRlciBhbmQga2VlcCB0cmFjayBvZiB3aGVuIHRoZSBsYXN0IHVwZGF0ZVxuICAgKiBoYXBwZW5lZCBmb3IgZWFjaCBrZXlwcmVzc1xuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgaGFuZGxlS2V5VXAoKSB7XG4gICAgdGhpcy51cGRhdGVWaXNpYmxlQ291bnRNZXNzYWdlKClcbiAgICB0aGlzLmxhc3RJbnB1dFRpbWVzdGFtcCA9IERhdGUubm93KClcbiAgfVxuXG4gIC8qKlxuICAgKiBIYW5kbGUgZm9jdXMgZXZlbnRcbiAgICpcbiAgICogU3BlZWNoIHJlY29nbml0aW9uIHNvZnR3YXJlIHN1Y2ggYXMgRHJhZ29uIE5hdHVyYWxseVNwZWFraW5nIHdpbGwgbW9kaWZ5XG4gICAqIHRoZSBmaWVsZHMgYnkgZGlyZWN0bHkgY2hhbmdpbmcgaXRzIGB2YWx1ZWAuIFRoZXNlIGNoYW5nZXMgZG9uJ3QgdHJpZ2dlclxuICAgKiBldmVudHMgaW4gSmF2YVNjcmlwdCwgc28gd2UgbmVlZCB0byBwb2xsIHRvIGhhbmRsZSB3aGVuIGFuZCBpZiB0aGV5IG9jY3VyLlxuICAgKlxuICAgKiBPbmNlIHRoZSBrZXl1cCBldmVudCBoYXNuJ3QgYmVlbiBkZXRlY3RlZCBmb3IgYXQgbGVhc3QgMTAwMCBtcyAoMXMpLCBjaGVja1xuICAgKiBpZiB0aGUgdGV4dGFyZWEgdmFsdWUgaGFzIGNoYW5nZWQgYW5kIHVwZGF0ZSB0aGUgY291bnQgbWVzc2FnZSBpZiBpdCBoYXMuXG4gICAqXG4gICAqIFRoaXMgaXMgc28gdGhhdCB0aGUgdXBkYXRlIHRyaWdnZXJlZCBieSB0aGUgbWFudWFsIGNvbXBhcmlzb24gZG9lc24ndFxuICAgKiBjb25mbGljdCB3aXRoIGRlYm91bmNlZCBLZXlib2FyZEV2ZW50IHVwZGF0ZXMuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBoYW5kbGVGb2N1cygpIHtcbiAgICB0aGlzLnZhbHVlQ2hlY2tlciA9IHdpbmRvdy5zZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICBpZiAoXG4gICAgICAgICF0aGlzLmxhc3RJbnB1dFRpbWVzdGFtcCB8fFxuICAgICAgICBEYXRlLm5vdygpIC0gNTAwID49IHRoaXMubGFzdElucHV0VGltZXN0YW1wXG4gICAgICApIHtcbiAgICAgICAgdGhpcy51cGRhdGVJZlZhbHVlQ2hhbmdlZCgpXG4gICAgICB9XG4gICAgfSwgMTAwMClcbiAgfVxuXG4gIC8qKlxuICAgKiBIYW5kbGUgYmx1ciBldmVudFxuICAgKlxuICAgKiBTdG9wIGNoZWNraW5nIHRoZSB0ZXh0YXJlYSB2YWx1ZSBvbmNlIHRoZSB0ZXh0YXJlYSBubyBsb25nZXIgaGFzIGZvY3VzXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBoYW5kbGVCbHVyKCkge1xuICAgIC8vIENhbmNlbCB2YWx1ZSBjaGVja2luZyBvbiBibHVyXG4gICAgaWYgKHRoaXMudmFsdWVDaGVja2VyKSB7XG4gICAgICB3aW5kb3cuY2xlYXJJbnRlcnZhbCh0aGlzLnZhbHVlQ2hlY2tlcilcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlIGNvdW50IG1lc3NhZ2UgaWYgdGV4dGFyZWEgdmFsdWUgaGFzIGNoYW5nZWRcbiAgICpcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHVwZGF0ZUlmVmFsdWVDaGFuZ2VkKCkge1xuICAgIGlmICh0aGlzLiR0ZXh0YXJlYS52YWx1ZSAhPT0gdGhpcy5sYXN0SW5wdXRWYWx1ZSkge1xuICAgICAgdGhpcy5sYXN0SW5wdXRWYWx1ZSA9IHRoaXMuJHRleHRhcmVhLnZhbHVlXG4gICAgICB0aGlzLnVwZGF0ZUNvdW50TWVzc2FnZSgpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSBjb3VudCBtZXNzYWdlXG4gICAqXG4gICAqIEhlbHBlciBmdW5jdGlvbiB0byB1cGRhdGUgYm90aCB0aGUgdmlzaWJsZSBhbmQgc2NyZWVuIHJlYWRlci1zcGVjaWZpY1xuICAgKiBjb3VudGVycyBzaW11bHRhbmVvdXNseSAoZS5nLiBvbiBpbml0KVxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgdXBkYXRlQ291bnRNZXNzYWdlKCkge1xuICAgIHRoaXMudXBkYXRlVmlzaWJsZUNvdW50TWVzc2FnZSgpXG4gICAgdGhpcy51cGRhdGVTY3JlZW5SZWFkZXJDb3VudE1lc3NhZ2UoKVxuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSB2aXNpYmxlIGNvdW50IG1lc3NhZ2VcbiAgICpcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHVwZGF0ZVZpc2libGVDb3VudE1lc3NhZ2UoKSB7XG4gICAgY29uc3QgcmVtYWluaW5nTnVtYmVyID0gdGhpcy5tYXhMZW5ndGggLSB0aGlzLmNvdW50KHRoaXMuJHRleHRhcmVhLnZhbHVlKVxuICAgIGNvbnN0IGlzRXJyb3IgPSByZW1haW5pbmdOdW1iZXIgPCAwXG5cbiAgICAvLyBJZiBpbnB1dCBpcyBvdmVyIHRoZSB0aHJlc2hvbGQsIHJlbW92ZSB0aGUgZGlzYWJsZWQgY2xhc3Mgd2hpY2ggcmVuZGVyc1xuICAgIC8vIHRoZSBjb3VudGVyIGludmlzaWJsZS5cbiAgICB0aGlzLiR2aXNpYmxlQ291bnRNZXNzYWdlLmNsYXNzTGlzdC50b2dnbGUoXG4gICAgICAnZ292dWstY2hhcmFjdGVyLWNvdW50X19tZXNzYWdlLS1kaXNhYmxlZCcsXG4gICAgICAhdGhpcy5pc092ZXJUaHJlc2hvbGQoKVxuICAgIClcblxuICAgIC8vIFVwZGF0ZSBzdHlsZXNcbiAgICBpZiAoIXRoaXMuJGVycm9yTWVzc2FnZSkge1xuICAgICAgLy8gT25seSB0b2dnbGUgdGhlIHRleHRhcmVhIGVycm9yIGNsYXNzIGlmIHRoZXJlIGlzbid0IGFuIGVycm9yIG1lc3NhZ2VcbiAgICAgIC8vIGFscmVhZHksIGFzIGl0IG1heSBiZSB1bnJlbGF0ZWQgdG8gdGhlIGxpbWl0IChlZzogYWxsb3dlZCBjaGFyYWN0ZXJzKVxuICAgICAgLy8gYW5kIHdvdWxkIHNldCB0aGUgYm9yZGVyIGNvbG91ciBiYWNrIHRvIGJsYWNrLlxuICAgICAgdGhpcy4kdGV4dGFyZWEuY2xhc3NMaXN0LnRvZ2dsZSgnZ292dWstdGV4dGFyZWEtLWVycm9yJywgaXNFcnJvcilcbiAgICB9XG4gICAgdGhpcy4kdmlzaWJsZUNvdW50TWVzc2FnZS5jbGFzc0xpc3QudG9nZ2xlKCdnb3Z1ay1lcnJvci1tZXNzYWdlJywgaXNFcnJvcilcbiAgICB0aGlzLiR2aXNpYmxlQ291bnRNZXNzYWdlLmNsYXNzTGlzdC50b2dnbGUoJ2dvdnVrLWhpbnQnLCAhaXNFcnJvcilcblxuICAgIC8vIFVwZGF0ZSBtZXNzYWdlXG4gICAgdGhpcy4kdmlzaWJsZUNvdW50TWVzc2FnZS50ZXh0Q29udGVudCA9IHRoaXMuZ2V0Q291bnRNZXNzYWdlKClcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGUgc2NyZWVuIHJlYWRlciBjb3VudCBtZXNzYWdlXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICB1cGRhdGVTY3JlZW5SZWFkZXJDb3VudE1lc3NhZ2UoKSB7XG4gICAgLy8gSWYgb3ZlciB0aGUgdGhyZXNob2xkLCByZW1vdmUgdGhlIGFyaWEtaGlkZGVuIGF0dHJpYnV0ZSwgYWxsb3dpbmcgc2NyZWVuXG4gICAgLy8gcmVhZGVycyB0byBhbm5vdW5jZSB0aGUgY29udGVudCBvZiB0aGUgZWxlbWVudC5cbiAgICBpZiAodGhpcy5pc092ZXJUaHJlc2hvbGQoKSkge1xuICAgICAgdGhpcy4kc2NyZWVuUmVhZGVyQ291bnRNZXNzYWdlLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLiRzY3JlZW5SZWFkZXJDb3VudE1lc3NhZ2Uuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJylcbiAgICB9XG5cbiAgICAvLyBVcGRhdGUgbWVzc2FnZVxuICAgIHRoaXMuJHNjcmVlblJlYWRlckNvdW50TWVzc2FnZS50ZXh0Q29udGVudCA9IHRoaXMuZ2V0Q291bnRNZXNzYWdlKClcbiAgfVxuXG4gIC8qKlxuICAgKiBDb3VudCB0aGUgbnVtYmVyIG9mIGNoYXJhY3RlcnMgKG9yIHdvcmRzLCBpZiBgY29uZmlnLm1heHdvcmRzYCBpcyBzZXQpXG4gICAqIGluIHRoZSBnaXZlbiB0ZXh0XG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IC0gVGhlIHRleHQgdG8gY291bnQgdGhlIGNoYXJhY3RlcnMgb2ZcbiAgICogQHJldHVybnMge251bWJlcn0gdGhlIG51bWJlciBvZiBjaGFyYWN0ZXJzIChvciB3b3JkcykgaW4gdGhlIHRleHRcbiAgICovXG4gIGNvdW50KHRleHQpIHtcbiAgICBpZiAodGhpcy5jb25maWcubWF4d29yZHMpIHtcbiAgICAgIGNvbnN0IHRva2VucyA9IHRleHQubWF0Y2goL1xcUysvZykgPz8gW10gLy8gTWF0Y2hlcyBjb25zZWN1dGl2ZSBub24td2hpdGVzcGFjZSBjaGFyc1xuICAgICAgcmV0dXJuIHRva2Vucy5sZW5ndGhcbiAgICB9XG5cbiAgICByZXR1cm4gdGV4dC5sZW5ndGhcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgY291bnQgbWVzc2FnZVxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBTdGF0dXMgbWVzc2FnZVxuICAgKi9cbiAgZ2V0Q291bnRNZXNzYWdlKCkge1xuICAgIGNvbnN0IHJlbWFpbmluZ051bWJlciA9IHRoaXMubWF4TGVuZ3RoIC0gdGhpcy5jb3VudCh0aGlzLiR0ZXh0YXJlYS52YWx1ZSlcbiAgICBjb25zdCBjb3VudFR5cGUgPSB0aGlzLmNvbmZpZy5tYXh3b3JkcyA/ICd3b3JkcycgOiAnY2hhcmFjdGVycydcbiAgICByZXR1cm4gdGhpcy5mb3JtYXRDb3VudE1lc3NhZ2UocmVtYWluaW5nTnVtYmVyLCBjb3VudFR5cGUpXG4gIH1cblxuICAvKipcbiAgICogRm9ybWF0cyB0aGUgbWVzc2FnZSBzaG93biB0byB1c2VycyBhY2NvcmRpbmcgdG8gd2hhdCdzIGNvdW50ZWRcbiAgICogYW5kIGhvdyBtYW55IHJlbWFpblxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge251bWJlcn0gcmVtYWluaW5nTnVtYmVyIC0gVGhlIG51bWJlciBvZiB3b3Jkcy9jaGFyYWNhdGVycyByZW1haW5pbmdcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNvdW50VHlwZSAtIFwid29yZHNcIiBvciBcImNoYXJhY3RlcnNcIlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBTdGF0dXMgbWVzc2FnZVxuICAgKi9cbiAgZm9ybWF0Q291bnRNZXNzYWdlKHJlbWFpbmluZ051bWJlciwgY291bnRUeXBlKSB7XG4gICAgaWYgKHJlbWFpbmluZ051bWJlciA9PT0gMCkge1xuICAgICAgcmV0dXJuIHRoaXMuaTE4bi50KGAke2NvdW50VHlwZX1BdExpbWl0YClcbiAgICB9XG5cbiAgICBjb25zdCB0cmFuc2xhdGlvbktleVN1ZmZpeCA9XG4gICAgICByZW1haW5pbmdOdW1iZXIgPCAwID8gJ092ZXJMaW1pdCcgOiAnVW5kZXJMaW1pdCdcblxuICAgIHJldHVybiB0aGlzLmkxOG4udChgJHtjb3VudFR5cGV9JHt0cmFuc2xhdGlvbktleVN1ZmZpeH1gLCB7XG4gICAgICBjb3VudDogTWF0aC5hYnMocmVtYWluaW5nTnVtYmVyKVxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgY291bnQgaXMgb3ZlciB0aHJlc2hvbGRcbiAgICpcbiAgICogQ2hlY2tzIHdoZXRoZXIgdGhlIHZhbHVlIGlzIG92ZXIgdGhlIGNvbmZpZ3VyZWQgdGhyZXNob2xkIGZvciB0aGUgaW5wdXQuXG4gICAqIElmIHRoZXJlIGlzIG5vIGNvbmZpZ3VyZWQgdGhyZXNob2xkLCBpdCBpcyBzZXQgdG8gMCBhbmQgdGhpcyBmdW5jdGlvbiB3aWxsXG4gICAqIGFsd2F5cyByZXR1cm4gdHJ1ZS5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgdGhlIGN1cnJlbnQgY291bnQgaXMgb3ZlciB0aGUgY29uZmlnLnRocmVzaG9sZFxuICAgKiAgIChvciBubyB0aHJlc2hvbGQgaXMgc2V0KVxuICAgKi9cbiAgaXNPdmVyVGhyZXNob2xkKCkge1xuICAgIC8vIE5vIHRocmVzaG9sZCBtZWFucyB3ZSdyZSBhbHdheXMgYWJvdmUgdGhyZXNob2xkIHNvIHNhdmUgc29tZSBjb21wdXRhdGlvblxuICAgIGlmICghdGhpcy5jb25maWcudGhyZXNob2xkKSB7XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIC8vIERldGVybWluZSB0aGUgcmVtYWluaW5nIG51bWJlciBvZiBjaGFyYWN0ZXJzL3dvcmRzXG4gICAgY29uc3QgY3VycmVudExlbmd0aCA9IHRoaXMuY291bnQodGhpcy4kdGV4dGFyZWEudmFsdWUpXG4gICAgY29uc3QgbWF4TGVuZ3RoID0gdGhpcy5tYXhMZW5ndGhcblxuICAgIGNvbnN0IHRocmVzaG9sZFZhbHVlID0gKG1heExlbmd0aCAqIHRoaXMuY29uZmlnLnRocmVzaG9sZCkgLyAxMDBcblxuICAgIHJldHVybiB0aHJlc2hvbGRWYWx1ZSA8PSBjdXJyZW50TGVuZ3RoXG4gIH1cblxuICAvKipcbiAgICogTmFtZSBmb3IgdGhlIGNvbXBvbmVudCB1c2VkIHdoZW4gaW5pdGlhbGlzaW5nIHVzaW5nIGRhdGEtbW9kdWxlIGF0dHJpYnV0ZXMuXG4gICAqL1xuICBzdGF0aWMgbW9kdWxlTmFtZSA9ICdnb3Z1ay1jaGFyYWN0ZXItY291bnQnXG5cbiAgLyoqXG4gICAqIENoYXJhY3RlciBjb3VudCBkZWZhdWx0IGNvbmZpZ1xuICAgKlxuICAgKiBAc2VlIHtAbGluayBDaGFyYWN0ZXJDb3VudENvbmZpZ31cbiAgICogQGNvbnN0YW50XG4gICAqIEB0eXBlIHtDaGFyYWN0ZXJDb3VudENvbmZpZ31cbiAgICovXG4gIHN0YXRpYyBkZWZhdWx0cyA9IE9iamVjdC5mcmVlemUoe1xuICAgIHRocmVzaG9sZDogMCxcbiAgICBpMThuOiB7XG4gICAgICAvLyBDaGFyYWN0ZXJzXG4gICAgICBjaGFyYWN0ZXJzVW5kZXJMaW1pdDoge1xuICAgICAgICBvbmU6ICdZb3UgaGF2ZSAle2NvdW50fSBjaGFyYWN0ZXIgcmVtYWluaW5nJyxcbiAgICAgICAgb3RoZXI6ICdZb3UgaGF2ZSAle2NvdW50fSBjaGFyYWN0ZXJzIHJlbWFpbmluZydcbiAgICAgIH0sXG4gICAgICBjaGFyYWN0ZXJzQXRMaW1pdDogJ1lvdSBoYXZlIDAgY2hhcmFjdGVycyByZW1haW5pbmcnLFxuICAgICAgY2hhcmFjdGVyc092ZXJMaW1pdDoge1xuICAgICAgICBvbmU6ICdZb3UgaGF2ZSAle2NvdW50fSBjaGFyYWN0ZXIgdG9vIG1hbnknLFxuICAgICAgICBvdGhlcjogJ1lvdSBoYXZlICV7Y291bnR9IGNoYXJhY3RlcnMgdG9vIG1hbnknXG4gICAgICB9LFxuICAgICAgLy8gV29yZHNcbiAgICAgIHdvcmRzVW5kZXJMaW1pdDoge1xuICAgICAgICBvbmU6ICdZb3UgaGF2ZSAle2NvdW50fSB3b3JkIHJlbWFpbmluZycsXG4gICAgICAgIG90aGVyOiAnWW91IGhhdmUgJXtjb3VudH0gd29yZHMgcmVtYWluaW5nJ1xuICAgICAgfSxcbiAgICAgIHdvcmRzQXRMaW1pdDogJ1lvdSBoYXZlIDAgd29yZHMgcmVtYWluaW5nJyxcbiAgICAgIHdvcmRzT3ZlckxpbWl0OiB7XG4gICAgICAgIG9uZTogJ1lvdSBoYXZlICV7Y291bnR9IHdvcmQgdG9vIG1hbnknLFxuICAgICAgICBvdGhlcjogJ1lvdSBoYXZlICV7Y291bnR9IHdvcmRzIHRvbyBtYW55J1xuICAgICAgfSxcbiAgICAgIHRleHRhcmVhRGVzY3JpcHRpb246IHtcbiAgICAgICAgb3RoZXI6ICcnXG4gICAgICB9XG4gICAgfVxuICB9KVxuXG4gIC8qKlxuICAgKiBDaGFyYWN0ZXIgY291bnQgY29uZmlnIHNjaGVtYVxuICAgKlxuICAgKiBAY29uc3RhbnRcbiAgICogQHNhdGlzZmllcyB7U2NoZW1hPENoYXJhY3RlckNvdW50Q29uZmlnPn1cbiAgICovXG4gIHN0YXRpYyBzY2hlbWEgPSBPYmplY3QuZnJlZXplKHtcbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICBpMThuOiB7IHR5cGU6ICdvYmplY3QnIH0sXG4gICAgICBtYXh3b3JkczogeyB0eXBlOiAnbnVtYmVyJyB9LFxuICAgICAgbWF4bGVuZ3RoOiB7IHR5cGU6ICdudW1iZXInIH0sXG4gICAgICB0aHJlc2hvbGQ6IHsgdHlwZTogJ251bWJlcicgfVxuICAgIH0sXG4gICAgYW55T2Y6IFtcbiAgICAgIHtcbiAgICAgICAgcmVxdWlyZWQ6IFsnbWF4d29yZHMnXSxcbiAgICAgICAgZXJyb3JNZXNzYWdlOiAnRWl0aGVyIFwibWF4bGVuZ3RoXCIgb3IgXCJtYXh3b3Jkc1wiIG11c3QgYmUgcHJvdmlkZWQnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICByZXF1aXJlZDogWydtYXhsZW5ndGgnXSxcbiAgICAgICAgZXJyb3JNZXNzYWdlOiAnRWl0aGVyIFwibWF4bGVuZ3RoXCIgb3IgXCJtYXh3b3Jkc1wiIG11c3QgYmUgcHJvdmlkZWQnXG4gICAgICB9XG4gICAgXVxuICB9KVxufVxuXG4vKipcbiAqIENoYXJhY3RlciBjb3VudCBjb25maWdcbiAqXG4gKiBAc2VlIHtAbGluayBDaGFyYWN0ZXJDb3VudC5kZWZhdWx0c31cbiAqIEB0eXBlZGVmIHtvYmplY3R9IENoYXJhY3RlckNvdW50Q29uZmlnXG4gKiBAcHJvcGVydHkge251bWJlcn0gW21heGxlbmd0aF0gLSBUaGUgbWF4aW11bSBudW1iZXIgb2YgY2hhcmFjdGVycy5cbiAqICAgSWYgbWF4d29yZHMgaXMgcHJvdmlkZWQsIHRoZSBtYXhsZW5ndGggb3B0aW9uIHdpbGwgYmUgaWdub3JlZC5cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBbbWF4d29yZHNdIC0gVGhlIG1heGltdW0gbnVtYmVyIG9mIHdvcmRzLiBJZiBtYXh3b3JkcyBpc1xuICogICBwcm92aWRlZCwgdGhlIG1heGxlbmd0aCBvcHRpb24gd2lsbCBiZSBpZ25vcmVkLlxuICogQHByb3BlcnR5IHtudW1iZXJ9IFt0aHJlc2hvbGQ9MF0gLSBUaGUgcGVyY2VudGFnZSB2YWx1ZSBvZiB0aGUgbGltaXQgYXRcbiAqICAgd2hpY2ggcG9pbnQgdGhlIGNvdW50IG1lc3NhZ2UgaXMgZGlzcGxheWVkLiBJZiB0aGlzIGF0dHJpYnV0ZSBpcyBzZXQsIHRoZVxuICogICBjb3VudCBtZXNzYWdlIHdpbGwgYmUgaGlkZGVuIGJ5IGRlZmF1bHQuXG4gKiBAcHJvcGVydHkge0NoYXJhY3RlckNvdW50VHJhbnNsYXRpb25zfSBbaTE4bj1DaGFyYWN0ZXJDb3VudC5kZWZhdWx0cy5pMThuXSAtIENoYXJhY3RlciBjb3VudCB0cmFuc2xhdGlvbnNcbiAqL1xuXG4vKipcbiAqIENoYXJhY3RlciBjb3VudCB0cmFuc2xhdGlvbnNcbiAqXG4gKiBAc2VlIHtAbGluayBDaGFyYWN0ZXJDb3VudC5kZWZhdWx0cy5pMThufVxuICogQHR5cGVkZWYge29iamVjdH0gQ2hhcmFjdGVyQ291bnRUcmFuc2xhdGlvbnNcbiAqXG4gKiBNZXNzYWdlcyBzaG93biB0byB1c2VycyBhcyB0aGV5IHR5cGUuIEl0IHByb3ZpZGVzIGZlZWRiYWNrIG9uIGhvdyBtYW55IHdvcmRzXG4gKiBvciBjaGFyYWN0ZXJzIHRoZXkgaGF2ZSByZW1haW5pbmcgb3IgaWYgdGhleSBhcmUgb3ZlciB0aGUgbGltaXQuIFRoaXMgYWxzb1xuICogaW5jbHVkZXMgYSBtZXNzYWdlIHVzZWQgYXMgYW4gYWNjZXNzaWJsZSBkZXNjcmlwdGlvbiBmb3IgdGhlIHRleHRhcmVhLlxuICogQHByb3BlcnR5IHtUcmFuc2xhdGlvblBsdXJhbEZvcm1zfSBbY2hhcmFjdGVyc1VuZGVyTGltaXRdIC0gTWVzc2FnZSBkaXNwbGF5ZWRcbiAqICAgd2hlbiB0aGUgbnVtYmVyIG9mIGNoYXJhY3RlcnMgaXMgdW5kZXIgdGhlIGNvbmZpZ3VyZWQgbWF4aW11bSwgYG1heGxlbmd0aGAuXG4gKiAgIFRoaXMgbWVzc2FnZSBpcyBkaXNwbGF5ZWQgdmlzdWFsbHkgYW5kIHRocm91Z2ggYXNzaXN0aXZlIHRlY2hub2xvZ2llcy4gVGhlXG4gKiAgIGNvbXBvbmVudCB3aWxsIHJlcGxhY2UgdGhlIGAle2NvdW50fWAgcGxhY2Vob2xkZXIgd2l0aCB0aGUgbnVtYmVyIG9mXG4gKiAgIHJlbWFpbmluZyBjaGFyYWN0ZXJzLiBUaGlzIGlzIGEgW3BsdXJhbGlzZWQgbGlzdCBvZlxuICogICBtZXNzYWdlc10oaHR0cHM6Ly9mcm9udGVuZC5kZXNpZ24tc3lzdGVtLnNlcnZpY2UuZ292LnVrL2xvY2FsaXNlLWdvdnVrLWZyb250ZW5kKS5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbY2hhcmFjdGVyc0F0TGltaXRdIC0gTWVzc2FnZSBkaXNwbGF5ZWQgd2hlbiB0aGUgbnVtYmVyIG9mXG4gKiAgIGNoYXJhY3RlcnMgcmVhY2hlcyB0aGUgY29uZmlndXJlZCBtYXhpbXVtLCBgbWF4bGVuZ3RoYC4gVGhpcyBtZXNzYWdlIGlzXG4gKiAgIGRpc3BsYXllZCB2aXN1YWxseSBhbmQgdGhyb3VnaCBhc3Npc3RpdmUgdGVjaG5vbG9naWVzLlxuICogQHByb3BlcnR5IHtUcmFuc2xhdGlvblBsdXJhbEZvcm1zfSBbY2hhcmFjdGVyc092ZXJMaW1pdF0gLSBNZXNzYWdlIGRpc3BsYXllZFxuICogICB3aGVuIHRoZSBudW1iZXIgb2YgY2hhcmFjdGVycyBpcyBvdmVyIHRoZSBjb25maWd1cmVkIG1heGltdW0sIGBtYXhsZW5ndGhgLlxuICogICBUaGlzIG1lc3NhZ2UgaXMgZGlzcGxheWVkIHZpc3VhbGx5IGFuZCB0aHJvdWdoIGFzc2lzdGl2ZSB0ZWNobm9sb2dpZXMuIFRoZVxuICogICBjb21wb25lbnQgd2lsbCByZXBsYWNlIHRoZSBgJXtjb3VudH1gIHBsYWNlaG9sZGVyIHdpdGggdGhlIG51bWJlciBvZlxuICogICByZW1haW5pbmcgY2hhcmFjdGVycy4gVGhpcyBpcyBhIFtwbHVyYWxpc2VkIGxpc3Qgb2ZcbiAqICAgbWVzc2FnZXNdKGh0dHBzOi8vZnJvbnRlbmQuZGVzaWduLXN5c3RlbS5zZXJ2aWNlLmdvdi51ay9sb2NhbGlzZS1nb3Z1ay1mcm9udGVuZCkuXG4gKiBAcHJvcGVydHkge1RyYW5zbGF0aW9uUGx1cmFsRm9ybXN9IFt3b3Jkc1VuZGVyTGltaXRdIC0gTWVzc2FnZSBkaXNwbGF5ZWQgd2hlblxuICogICB0aGUgbnVtYmVyIG9mIHdvcmRzIGlzIHVuZGVyIHRoZSBjb25maWd1cmVkIG1heGltdW0sIGBtYXhsZW5ndGhgLiBUaGlzXG4gKiAgIG1lc3NhZ2UgaXMgZGlzcGxheWVkIHZpc3VhbGx5IGFuZCB0aHJvdWdoIGFzc2lzdGl2ZSB0ZWNobm9sb2dpZXMuIFRoZVxuICogICBjb21wb25lbnQgd2lsbCByZXBsYWNlIHRoZSBgJXtjb3VudH1gIHBsYWNlaG9sZGVyIHdpdGggdGhlIG51bWJlciBvZlxuICogICByZW1haW5pbmcgd29yZHMuIFRoaXMgaXMgYSBbcGx1cmFsaXNlZCBsaXN0IG9mXG4gKiAgIG1lc3NhZ2VzXShodHRwczovL2Zyb250ZW5kLmRlc2lnbi1zeXN0ZW0uc2VydmljZS5nb3YudWsvbG9jYWxpc2UtZ292dWstZnJvbnRlbmQpLlxuICogQHByb3BlcnR5IHtzdHJpbmd9IFt3b3Jkc0F0TGltaXRdIC0gTWVzc2FnZSBkaXNwbGF5ZWQgd2hlbiB0aGUgbnVtYmVyIG9mXG4gKiAgIHdvcmRzIHJlYWNoZXMgdGhlIGNvbmZpZ3VyZWQgbWF4aW11bSwgYG1heGxlbmd0aGAuIFRoaXMgbWVzc2FnZSBpc1xuICogICBkaXNwbGF5ZWQgdmlzdWFsbHkgYW5kIHRocm91Z2ggYXNzaXN0aXZlIHRlY2hub2xvZ2llcy5cbiAqIEBwcm9wZXJ0eSB7VHJhbnNsYXRpb25QbHVyYWxGb3Jtc30gW3dvcmRzT3ZlckxpbWl0XSAtIE1lc3NhZ2UgZGlzcGxheWVkIHdoZW5cbiAqICAgdGhlIG51bWJlciBvZiB3b3JkcyBpcyBvdmVyIHRoZSBjb25maWd1cmVkIG1heGltdW0sIGBtYXhsZW5ndGhgLiBUaGlzXG4gKiAgIG1lc3NhZ2UgaXMgZGlzcGxheWVkIHZpc3VhbGx5IGFuZCB0aHJvdWdoIGFzc2lzdGl2ZSB0ZWNobm9sb2dpZXMuIFRoZVxuICogICBjb21wb25lbnQgd2lsbCByZXBsYWNlIHRoZSBgJXtjb3VudH1gIHBsYWNlaG9sZGVyIHdpdGggdGhlIG51bWJlciBvZlxuICogICByZW1haW5pbmcgd29yZHMuIFRoaXMgaXMgYSBbcGx1cmFsaXNlZCBsaXN0IG9mXG4gKiAgIG1lc3NhZ2VzXShodHRwczovL2Zyb250ZW5kLmRlc2lnbi1zeXN0ZW0uc2VydmljZS5nb3YudWsvbG9jYWxpc2UtZ292dWstZnJvbnRlbmQpLlxuICogQHByb3BlcnR5IHtUcmFuc2xhdGlvblBsdXJhbEZvcm1zfSBbdGV4dGFyZWFEZXNjcmlwdGlvbl0gLSBNZXNzYWdlIG1hZGVcbiAqICAgYXZhaWxhYmxlIHRvIGFzc2lzdGl2ZSB0ZWNobm9sb2dpZXMsIGlmIG5vbmUgaXMgYWxyZWFkeSBwcmVzZW50IGluIHRoZVxuICogICBIVE1MLCB0byBkZXNjcmliZSB0aGF0IHRoZSBjb21wb25lbnQgYWNjZXB0cyBvbmx5IGEgbGltaXRlZCBhbW91bnQgb2ZcbiAqICAgY29udGVudC4gSXQgaXMgdmlzaWJsZSBvbiB0aGUgcGFnZSB3aGVuIEphdmFTY3JpcHQgaXMgdW5hdmFpbGFibGUuIFRoZVxuICogICBjb21wb25lbnQgd2lsbCByZXBsYWNlIHRoZSBgJXtjb3VudH1gIHBsYWNlaG9sZGVyIHdpdGggdGhlIHZhbHVlIG9mIHRoZVxuICogICBgbWF4bGVuZ3RoYCBvciBgbWF4d29yZHNgIHBhcmFtZXRlci5cbiAqL1xuXG4vKipcbiAqIEBpbXBvcnQgeyBTY2hlbWEgfSBmcm9tICcuLi8uLi9jb21tb24vY29uZmlndXJhdGlvbi5tanMnXG4gKiBAaW1wb3J0IHsgVHJhbnNsYXRpb25QbHVyYWxGb3JtcyB9IGZyb20gJy4uLy4uL2kxOG4ubWpzJ1xuICovXG4iLCJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICcuLi8uLi9jb21wb25lbnQubWpzJ1xuaW1wb3J0IHsgRWxlbWVudEVycm9yIH0gZnJvbSAnLi4vLi4vZXJyb3JzL2luZGV4Lm1qcydcblxuLyoqXG4gKiBDaGVja2JveGVzIGNvbXBvbmVudFxuICpcbiAqIEBwcmVzZXJ2ZVxuICovXG5leHBvcnQgY2xhc3MgQ2hlY2tib3hlcyBleHRlbmRzIENvbXBvbmVudCB7XG4gIC8qKiBAcHJpdmF0ZSAqL1xuICAkaW5wdXRzXG5cbiAgLyoqXG4gICAqIENoZWNrYm94ZXMgY2FuIGJlIGFzc29jaWF0ZWQgd2l0aCBhICdjb25kaXRpb25hbGx5IHJldmVhbGVkJyBjb250ZW50IGJsb2NrXG4gICAqIOKAkyBmb3IgZXhhbXBsZSwgYSBjaGVja2JveCBmb3IgJ1Bob25lJyBjb3VsZCByZXZlYWwgYW4gYWRkaXRpb25hbCBmb3JtIGZpZWxkXG4gICAqIGZvciB0aGUgdXNlciB0byBlbnRlciB0aGVpciBwaG9uZSBudW1iZXIuXG4gICAqXG4gICAqIFRoZXNlIGFzc29jaWF0aW9ucyBhcmUgbWFkZSB1c2luZyBhIGBkYXRhLWFyaWEtY29udHJvbHNgIGF0dHJpYnV0ZSwgd2hpY2hcbiAgICogaXMgcHJvbW90ZWQgdG8gYW4gYXJpYS1jb250cm9scyBhdHRyaWJ1dGUgZHVyaW5nIGluaXRpYWxpc2F0aW9uLlxuICAgKlxuICAgKiBXZSBhbHNvIG5lZWQgdG8gcmVzdG9yZSB0aGUgc3RhdGUgb2YgYW55IGNvbmRpdGlvbmFsIHJldmVhbHMgb24gdGhlIHBhZ2VcbiAgICogKGZvciBleGFtcGxlIGlmIHRoZSB1c2VyIGhhcyBuYXZpZ2F0ZWQgYmFjayksIGFuZCBzZXQgdXAgZXZlbnQgaGFuZGxlcnMgdG9cbiAgICoga2VlcCB0aGUgcmV2ZWFsIGluIHN5bmMgd2l0aCB0aGUgY2hlY2tib3ggc3RhdGUuXG4gICAqXG4gICAqIEBwYXJhbSB7RWxlbWVudCB8IG51bGx9ICRyb290IC0gSFRNTCBlbGVtZW50IHRvIHVzZSBmb3IgY2hlY2tib3hlc1xuICAgKi9cbiAgY29uc3RydWN0b3IoJHJvb3QpIHtcbiAgICBzdXBlcigkcm9vdClcblxuICAgIGNvbnN0ICRpbnB1dHMgPSB0aGlzLiRyb290LnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0W3R5cGU9XCJjaGVja2JveFwiXScpXG4gICAgaWYgKCEkaW5wdXRzLmxlbmd0aCkge1xuICAgICAgdGhyb3cgbmV3IEVsZW1lbnRFcnJvcih7XG4gICAgICAgIGNvbXBvbmVudDogQ2hlY2tib3hlcyxcbiAgICAgICAgaWRlbnRpZmllcjogJ0Zvcm0gaW5wdXRzIChgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiPmApJ1xuICAgICAgfSlcbiAgICB9XG5cbiAgICB0aGlzLiRpbnB1dHMgPSAkaW5wdXRzXG5cbiAgICB0aGlzLiRpbnB1dHMuZm9yRWFjaCgoJGlucHV0KSA9PiB7XG4gICAgICBjb25zdCB0YXJnZXRJZCA9ICRpbnB1dC5nZXRBdHRyaWJ1dGUoJ2RhdGEtYXJpYS1jb250cm9scycpXG5cbiAgICAgIC8vIFNraXAgcmFkaW9zIHdpdGhvdXQgZGF0YS1hcmlhLWNvbnRyb2xzIGF0dHJpYnV0ZXNcbiAgICAgIGlmICghdGFyZ2V0SWQpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIC8vIFRocm93IGlmIHRhcmdldCBjb25kaXRpb25hbCBlbGVtZW50IGRvZXMgbm90IGV4aXN0LlxuICAgICAgaWYgKCFkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0YXJnZXRJZCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVsZW1lbnRFcnJvcih7XG4gICAgICAgICAgY29tcG9uZW50OiBDaGVja2JveGVzLFxuICAgICAgICAgIGlkZW50aWZpZXI6IGBDb25kaXRpb25hbCByZXZlYWwgKFxcYGlkPVwiJHt0YXJnZXRJZH1cIlxcYClgXG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIC8vIFByb21vdGUgdGhlIGRhdGEtYXJpYS1jb250cm9scyBhdHRyaWJ1dGUgdG8gYSBhcmlhLWNvbnRyb2xzIGF0dHJpYnV0ZVxuICAgICAgLy8gc28gdGhhdCB0aGUgcmVsYXRpb25zaGlwIGlzIGV4cG9zZWQgaW4gdGhlIEFPTVxuICAgICAgJGlucHV0LnNldEF0dHJpYnV0ZSgnYXJpYS1jb250cm9scycsIHRhcmdldElkKVxuICAgICAgJGlucHV0LnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS1hcmlhLWNvbnRyb2xzJylcbiAgICB9KVxuXG4gICAgLy8gV2hlbiB0aGUgcGFnZSBpcyByZXN0b3JlZCBhZnRlciBuYXZpZ2F0aW5nICdiYWNrJyBpbiBzb21lIGJyb3dzZXJzIHRoZVxuICAgIC8vIHN0YXRlIG9mIGZvcm0gY29udHJvbHMgaXMgbm90IHJlc3RvcmVkIHVudGlsICphZnRlciogdGhlIERPTUNvbnRlbnRMb2FkZWRcbiAgICAvLyBldmVudCBpcyBmaXJlZCwgc28gd2UgbmVlZCB0byBzeW5jIGFmdGVyIHRoZSBwYWdlc2hvdyBldmVudC5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncGFnZXNob3cnLCAoKSA9PiB0aGlzLnN5bmNBbGxDb25kaXRpb25hbFJldmVhbHMoKSlcblxuICAgIC8vIEFsdGhvdWdoIHdlJ3ZlIHNldCB1cCBoYW5kbGVycyB0byBzeW5jIHN0YXRlIG9uIHRoZSBwYWdlc2hvdyBldmVudCwgaW5pdFxuICAgIC8vIGNvdWxkIGJlIGNhbGxlZCBhZnRlciB0aG9zZSBldmVudHMgaGF2ZSBmaXJlZCwgZm9yIGV4YW1wbGUgaWYgdGhleSBhcmVcbiAgICAvLyBhZGRlZCB0byB0aGUgcGFnZSBkeW5hbWljYWxseSwgc28gc3luYyBub3cgdG9vLlxuICAgIHRoaXMuc3luY0FsbENvbmRpdGlvbmFsUmV2ZWFscygpXG5cbiAgICAvLyBIYW5kbGUgZXZlbnRzXG4gICAgdGhpcy4kcm9vdC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4gdGhpcy5oYW5kbGVDbGljayhldmVudCkpXG4gIH1cblxuICAvKipcbiAgICogU3luYyB0aGUgY29uZGl0aW9uYWwgcmV2ZWFsIHN0YXRlcyBmb3IgYWxsIGNoZWNrYm94ZXMgaW4gdGhpcyBjb21wb25lbnQuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzeW5jQWxsQ29uZGl0aW9uYWxSZXZlYWxzKCkge1xuICAgIHRoaXMuJGlucHV0cy5mb3JFYWNoKCgkaW5wdXQpID0+XG4gICAgICB0aGlzLnN5bmNDb25kaXRpb25hbFJldmVhbFdpdGhJbnB1dFN0YXRlKCRpbnB1dClcbiAgICApXG4gIH1cblxuICAvKipcbiAgICogU3luYyBjb25kaXRpb25hbCByZXZlYWwgd2l0aCB0aGUgaW5wdXQgc3RhdGVcbiAgICpcbiAgICogU3luY2hyb25pc2UgdGhlIHZpc2liaWxpdHkgb2YgdGhlIGNvbmRpdGlvbmFsIHJldmVhbCwgYW5kIGl0cyBhY2Nlc3NpYmxlXG4gICAqIHN0YXRlLCB3aXRoIHRoZSBpbnB1dCdzIGNoZWNrZWQgc3RhdGUuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7SFRNTElucHV0RWxlbWVudH0gJGlucHV0IC0gQ2hlY2tib3ggaW5wdXRcbiAgICovXG4gIHN5bmNDb25kaXRpb25hbFJldmVhbFdpdGhJbnB1dFN0YXRlKCRpbnB1dCkge1xuICAgIGNvbnN0IHRhcmdldElkID0gJGlucHV0LmdldEF0dHJpYnV0ZSgnYXJpYS1jb250cm9scycpXG4gICAgaWYgKCF0YXJnZXRJZCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgY29uc3QgJHRhcmdldCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRhcmdldElkKVxuICAgIGlmICgkdGFyZ2V0Py5jbGFzc0xpc3QuY29udGFpbnMoJ2dvdnVrLWNoZWNrYm94ZXNfX2NvbmRpdGlvbmFsJykpIHtcbiAgICAgIGNvbnN0IGlucHV0SXNDaGVja2VkID0gJGlucHV0LmNoZWNrZWRcblxuICAgICAgJGlucHV0LnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsIGlucHV0SXNDaGVja2VkLnRvU3RyaW5nKCkpXG4gICAgICAkdGFyZ2V0LmNsYXNzTGlzdC50b2dnbGUoXG4gICAgICAgICdnb3Z1ay1jaGVja2JveGVzX19jb25kaXRpb25hbC0taGlkZGVuJyxcbiAgICAgICAgIWlucHV0SXNDaGVja2VkXG4gICAgICApXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFVuY2hlY2sgb3RoZXIgY2hlY2tib3hlc1xuICAgKlxuICAgKiBGaW5kIGFueSBvdGhlciBjaGVja2JveCBpbnB1dHMgd2l0aCB0aGUgc2FtZSBuYW1lIHZhbHVlLCBhbmQgdW5jaGVjayB0aGVtLlxuICAgKiBUaGlzIGlzIHVzZWZ1bCBmb3Igd2hlbiBhIOKAnE5vbmUgb2YgdGhlc2VcIiBjaGVja2JveCBpcyBjaGVja2VkLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge0hUTUxJbnB1dEVsZW1lbnR9ICRpbnB1dCAtIENoZWNrYm94IGlucHV0XG4gICAqL1xuICB1bkNoZWNrQWxsSW5wdXRzRXhjZXB0KCRpbnB1dCkge1xuICAgIGNvbnN0IGFsbElucHV0c1dpdGhTYW1lTmFtZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXG4gICAgICBgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdW25hbWU9XCIkeyRpbnB1dC5uYW1lfVwiXWBcbiAgICApXG5cbiAgICBhbGxJbnB1dHNXaXRoU2FtZU5hbWUuZm9yRWFjaCgoJGlucHV0V2l0aFNhbWVOYW1lKSA9PiB7XG4gICAgICBjb25zdCBoYXNTYW1lRm9ybU93bmVyID0gJGlucHV0LmZvcm0gPT09ICRpbnB1dFdpdGhTYW1lTmFtZS5mb3JtXG4gICAgICBpZiAoaGFzU2FtZUZvcm1Pd25lciAmJiAkaW5wdXRXaXRoU2FtZU5hbWUgIT09ICRpbnB1dCkge1xuICAgICAgICAkaW5wdXRXaXRoU2FtZU5hbWUuY2hlY2tlZCA9IGZhbHNlXG4gICAgICAgIHRoaXMuc3luY0NvbmRpdGlvbmFsUmV2ZWFsV2l0aElucHV0U3RhdGUoJGlucHV0V2l0aFNhbWVOYW1lKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogVW5jaGVjayBleGNsdXNpdmUgY2hlY2tib3hlc1xuICAgKlxuICAgKiBGaW5kIGFueSBjaGVja2JveCBpbnB1dHMgd2l0aCB0aGUgc2FtZSBuYW1lIHZhbHVlIGFuZCB0aGUgJ2V4Y2x1c2l2ZSdcbiAgICogYmVoYXZpb3VyLCBhbmQgdW5jaGVjayB0aGVtLiBUaGlzIGhlbHBzIHByZXZlbnQgc29tZW9uZSBjaGVja2luZyBib3RoIGFcbiAgICogcmVndWxhciBjaGVja2JveCBhbmQgYSBcIk5vbmUgb2YgdGhlc2VcIiBjaGVja2JveCBpbiB0aGUgc2FtZSBmaWVsZHNldC5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtIVE1MSW5wdXRFbGVtZW50fSAkaW5wdXQgLSBDaGVja2JveCBpbnB1dFxuICAgKi9cbiAgdW5DaGVja0V4Y2x1c2l2ZUlucHV0cygkaW5wdXQpIHtcbiAgICBjb25zdCBhbGxJbnB1dHNXaXRoU2FtZU5hbWVBbmRFeGNsdXNpdmVCZWhhdmlvdXIgPVxuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcbiAgICAgICAgYGlucHV0W2RhdGEtYmVoYXZpb3VyPVwiZXhjbHVzaXZlXCJdW3R5cGU9XCJjaGVja2JveFwiXVtuYW1lPVwiJHskaW5wdXQubmFtZX1cIl1gXG4gICAgICApXG5cbiAgICBhbGxJbnB1dHNXaXRoU2FtZU5hbWVBbmRFeGNsdXNpdmVCZWhhdmlvdXIuZm9yRWFjaCgoJGV4Y2x1c2l2ZUlucHV0KSA9PiB7XG4gICAgICBjb25zdCBoYXNTYW1lRm9ybU93bmVyID0gJGlucHV0LmZvcm0gPT09ICRleGNsdXNpdmVJbnB1dC5mb3JtXG4gICAgICBpZiAoaGFzU2FtZUZvcm1Pd25lcikge1xuICAgICAgICAkZXhjbHVzaXZlSW5wdXQuY2hlY2tlZCA9IGZhbHNlXG4gICAgICAgIHRoaXMuc3luY0NvbmRpdGlvbmFsUmV2ZWFsV2l0aElucHV0U3RhdGUoJGV4Y2x1c2l2ZUlucHV0KVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogQ2xpY2sgZXZlbnQgaGFuZGxlclxuICAgKlxuICAgKiBIYW5kbGUgYSBjbGljayB3aXRoaW4gdGhlIGNvbXBvbmVudCByb290IOKAkyBpZiB0aGUgY2xpY2sgb2NjdXJyZWQgb24gYSBjaGVja2JveCxcbiAgICogc3luYyB0aGUgc3RhdGUgb2YgYW55IGFzc29jaWF0ZWQgY29uZGl0aW9uYWwgcmV2ZWFsIHdpdGggdGhlIGNoZWNrYm94XG4gICAqIHN0YXRlLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge01vdXNlRXZlbnR9IGV2ZW50IC0gQ2xpY2sgZXZlbnRcbiAgICovXG4gIGhhbmRsZUNsaWNrKGV2ZW50KSB7XG4gICAgY29uc3QgJGNsaWNrZWRJbnB1dCA9IGV2ZW50LnRhcmdldFxuXG4gICAgLy8gSWdub3JlIGNsaWNrcyBvbiB0aGluZ3MgdGhhdCBhcmVuJ3QgY2hlY2tib3ggaW5wdXRzXG4gICAgaWYgKFxuICAgICAgISgkY2xpY2tlZElucHV0IGluc3RhbmNlb2YgSFRNTElucHV0RWxlbWVudCkgfHxcbiAgICAgICRjbGlja2VkSW5wdXQudHlwZSAhPT0gJ2NoZWNrYm94J1xuICAgICkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgLy8gSWYgdGhlIGNoZWNrYm94IGNvbmRpdGlvbmFsbHktcmV2ZWFscyBzb21lIGNvbnRlbnQsIHN5bmMgdGhlIHN0YXRlXG4gICAgY29uc3QgaGFzQXJpYUNvbnRyb2xzID0gJGNsaWNrZWRJbnB1dC5nZXRBdHRyaWJ1dGUoJ2FyaWEtY29udHJvbHMnKVxuICAgIGlmIChoYXNBcmlhQ29udHJvbHMpIHtcbiAgICAgIHRoaXMuc3luY0NvbmRpdGlvbmFsUmV2ZWFsV2l0aElucHV0U3RhdGUoJGNsaWNrZWRJbnB1dClcbiAgICB9XG5cbiAgICAvLyBObyBmdXJ0aGVyIGJlaGF2aW91ciBuZWVkZWQgZm9yIHVuY2hlY2tpbmdcbiAgICBpZiAoISRjbGlja2VkSW5wdXQuY2hlY2tlZCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgLy8gSGFuZGxlICdleGNsdXNpdmUnIGNoZWNrYm94IGJlaGF2aW91ciAoaWUgXCJOb25lIG9mIHRoZXNlXCIpXG4gICAgY29uc3QgaGFzQmVoYXZpb3VyRXhjbHVzaXZlID1cbiAgICAgICRjbGlja2VkSW5wdXQuZ2V0QXR0cmlidXRlKCdkYXRhLWJlaGF2aW91cicpID09PSAnZXhjbHVzaXZlJ1xuICAgIGlmIChoYXNCZWhhdmlvdXJFeGNsdXNpdmUpIHtcbiAgICAgIHRoaXMudW5DaGVja0FsbElucHV0c0V4Y2VwdCgkY2xpY2tlZElucHV0KVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnVuQ2hlY2tFeGNsdXNpdmVJbnB1dHMoJGNsaWNrZWRJbnB1dClcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogTmFtZSBmb3IgdGhlIGNvbXBvbmVudCB1c2VkIHdoZW4gaW5pdGlhbGlzaW5nIHVzaW5nIGRhdGEtbW9kdWxlIGF0dHJpYnV0ZXMuXG4gICAqL1xuICBzdGF0aWMgbW9kdWxlTmFtZSA9ICdnb3Z1ay1jaGVja2JveGVzJ1xufVxuIiwiaW1wb3J0IHsgQ29uZmlndXJhYmxlQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vY29tbW9uL2NvbmZpZ3VyYXRpb24ubWpzJ1xuaW1wb3J0IHsgZ2V0RnJhZ21lbnRGcm9tVXJsLCBzZXRGb2N1cyB9IGZyb20gJy4uLy4uL2NvbW1vbi9pbmRleC5tanMnXG5cbi8qKlxuICogRXJyb3Igc3VtbWFyeSBjb21wb25lbnRcbiAqXG4gKiBUYWtlcyBmb2N1cyBvbiBpbml0aWFsaXNhdGlvbiBmb3IgYWNjZXNzaWJsZSBhbm5vdW5jZW1lbnQsIHVubGVzcyBkaXNhYmxlZCBpblxuICogY29uZmlndXJhdGlvbi5cbiAqXG4gKiBAcHJlc2VydmVcbiAqIEBhdWdtZW50cyBDb25maWd1cmFibGVDb21wb25lbnQ8RXJyb3JTdW1tYXJ5Q29uZmlnPlxuICovXG5leHBvcnQgY2xhc3MgRXJyb3JTdW1tYXJ5IGV4dGVuZHMgQ29uZmlndXJhYmxlQ29tcG9uZW50IHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7RWxlbWVudCB8IG51bGx9ICRyb290IC0gSFRNTCBlbGVtZW50IHRvIHVzZSBmb3IgZXJyb3Igc3VtbWFyeVxuICAgKiBAcGFyYW0ge0Vycm9yU3VtbWFyeUNvbmZpZ30gW2NvbmZpZ10gLSBFcnJvciBzdW1tYXJ5IGNvbmZpZ1xuICAgKi9cbiAgY29uc3RydWN0b3IoJHJvb3QsIGNvbmZpZyA9IHt9KSB7XG4gICAgc3VwZXIoJHJvb3QsIGNvbmZpZylcblxuICAgIC8qKlxuICAgICAqIEZvY3VzIHRoZSBlcnJvciBzdW1tYXJ5XG4gICAgICovXG4gICAgaWYgKCF0aGlzLmNvbmZpZy5kaXNhYmxlQXV0b0ZvY3VzKSB7XG4gICAgICBzZXRGb2N1cyh0aGlzLiRyb290KVxuICAgIH1cblxuICAgIHRoaXMuJHJvb3QuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHRoaXMuaGFuZGxlQ2xpY2soZXZlbnQpKVxuICB9XG5cbiAgLyoqXG4gICAqIENsaWNrIGV2ZW50IGhhbmRsZXJcbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtNb3VzZUV2ZW50fSBldmVudCAtIENsaWNrIGV2ZW50XG4gICAqL1xuICBoYW5kbGVDbGljayhldmVudCkge1xuICAgIGNvbnN0ICR0YXJnZXQgPSBldmVudC50YXJnZXRcbiAgICBpZiAoJHRhcmdldCAmJiB0aGlzLmZvY3VzVGFyZ2V0KCR0YXJnZXQpKSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEZvY3VzIHRoZSB0YXJnZXQgZWxlbWVudFxuICAgKlxuICAgKiBCeSBkZWZhdWx0LCB0aGUgYnJvd3NlciB3aWxsIHNjcm9sbCB0aGUgdGFyZ2V0IGludG8gdmlldy4gQmVjYXVzZSBvdXJcbiAgICogbGFiZWxzIG9yIGxlZ2VuZHMgYXBwZWFyIGFib3ZlIHRoZSBpbnB1dCwgdGhpcyBtZWFucyB0aGUgdXNlciB3aWxsIGJlXG4gICAqIHByZXNlbnRlZCB3aXRoIGFuIGlucHV0IHdpdGhvdXQgYW55IGNvbnRleHQsIGFzIHRoZSBsYWJlbCBvciBsZWdlbmQgd2lsbCBiZVxuICAgKiBvZmYgdGhlIHRvcCBvZiB0aGUgc2NyZWVuLlxuICAgKlxuICAgKiBNYW51YWxseSBoYW5kbGluZyB0aGUgY2xpY2sgZXZlbnQsIHNjcm9sbGluZyB0aGUgcXVlc3Rpb24gaW50byB2aWV3IGFuZFxuICAgKiB0aGVuIGZvY3Vzc2luZyB0aGUgZWxlbWVudCBzb2x2ZXMgdGhpcy5cbiAgICpcbiAgICogVGhpcyBhbHNvIHJlc3VsdHMgaW4gdGhlIGxhYmVsIGFuZC9vciBsZWdlbmQgYmVpbmcgYW5ub3VuY2VkIGNvcnJlY3RseSBpblxuICAgKiBOVkRBIChhcyB0ZXN0ZWQgaW4gMjAxOC4zLjIpIC0gd2l0aG91dCB0aGlzIG9ubHkgdGhlIGZpZWxkIHR5cGUgaXNcbiAgICogYW5ub3VuY2VkIChlLmcuIFwiRWRpdCwgaGFzIGF1dG9jb21wbGV0ZVwiKS5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtFdmVudFRhcmdldH0gJHRhcmdldCAtIEV2ZW50IHRhcmdldFxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgdGFyZ2V0IHdhcyBhYmxlIHRvIGJlIGZvY3Vzc2VkXG4gICAqL1xuICBmb2N1c1RhcmdldCgkdGFyZ2V0KSB7XG4gICAgLy8gSWYgdGhlIGVsZW1lbnQgdGhhdCB3YXMgY2xpY2tlZCB3YXMgbm90IGEgbGluaywgcmV0dXJuIGVhcmx5XG4gICAgaWYgKCEoJHRhcmdldCBpbnN0YW5jZW9mIEhUTUxBbmNob3JFbGVtZW50KSkge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG4gICAgY29uc3QgaW5wdXRJZCA9IGdldEZyYWdtZW50RnJvbVVybCgkdGFyZ2V0LmhyZWYpXG4gICAgaWYgKCFpbnB1dElkKSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICBjb25zdCAkaW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpbnB1dElkKVxuICAgIGlmICghJGlucHV0KSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICBjb25zdCAkbGVnZW5kT3JMYWJlbCA9IHRoaXMuZ2V0QXNzb2NpYXRlZExlZ2VuZE9yTGFiZWwoJGlucHV0KVxuICAgIGlmICghJGxlZ2VuZE9yTGFiZWwpIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIC8vIFNjcm9sbCB0aGUgbGVnZW5kIG9yIGxhYmVsIGludG8gdmlldyAqYmVmb3JlKiBjYWxsaW5nIGZvY3VzIG9uIHRoZSBpbnB1dFxuICAgIC8vIHRvIGF2b2lkIGV4dHJhIHNjcm9sbGluZyBpbiBicm93c2VycyB0aGF0IGRvbid0IHN1cHBvcnQgYHByZXZlbnRTY3JvbGxgXG4gICAgLy8gKHdoaWNoIGF0IHRpbWUgb2Ygd3JpdGluZyBpcyBtb3N0IG9mIHRoZW0uLi4pXG4gICAgJGxlZ2VuZE9yTGFiZWwuc2Nyb2xsSW50b1ZpZXcoKVxuICAgICRpbnB1dC5mb2N1cyh7IHByZXZlbnRTY3JvbGw6IHRydWUgfSlcblxuICAgIHJldHVybiB0cnVlXG4gIH1cblxuICAvKipcbiAgICogR2V0IGFzc29jaWF0ZWQgbGVnZW5kIG9yIGxhYmVsXG4gICAqXG4gICAqIFJldHVybnMgdGhlIGZpcnN0IGVsZW1lbnQgdGhhdCBleGlzdHMgZnJvbSB0aGlzIGxpc3Q6XG4gICAqXG4gICAqIC0gVGhlIGA8bGVnZW5kPmAgYXNzb2NpYXRlZCB3aXRoIHRoZSBjbG9zZXN0IGA8ZmllbGRzZXQ+YCBhbmNlc3RvciwgYXMgbG9uZ1xuICAgKiAgIGFzIHRoZSB0b3Agb2YgaXQgaXMgbm8gbW9yZSB0aGFuIGhhbGYgYSB2aWV3cG9ydCBoZWlnaHQgYXdheSBmcm9tIHRoZVxuICAgKiAgIGJvdHRvbSBvZiB0aGUgaW5wdXRcbiAgICogLSBUaGUgZmlyc3QgYDxsYWJlbD5gIHRoYXQgaXMgYXNzb2NpYXRlZCB3aXRoIHRoZSBpbnB1dCB1c2luZyBmb3I9XCJpbnB1dElkXCJcbiAgICogLSBUaGUgY2xvc2VzdCBwYXJlbnQgYDxsYWJlbD5gXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gJGlucHV0IC0gVGhlIGlucHV0XG4gICAqIEByZXR1cm5zIHtFbGVtZW50IHwgbnVsbH0gQXNzb2NpYXRlZCBsZWdlbmQgb3IgbGFiZWwsIG9yIG51bGwgaWYgbm9cbiAgICogICBhc3NvY2lhdGVkIGxlZ2VuZCBvciBsYWJlbCBjYW4gYmUgZm91bmRcbiAgICovXG4gIGdldEFzc29jaWF0ZWRMZWdlbmRPckxhYmVsKCRpbnB1dCkge1xuICAgIGNvbnN0ICRmaWVsZHNldCA9ICRpbnB1dC5jbG9zZXN0KCdmaWVsZHNldCcpXG5cbiAgICBpZiAoJGZpZWxkc2V0KSB7XG4gICAgICBjb25zdCAkbGVnZW5kcyA9ICRmaWVsZHNldC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnbGVnZW5kJylcblxuICAgICAgaWYgKCRsZWdlbmRzLmxlbmd0aCkge1xuICAgICAgICBjb25zdCAkY2FuZGlkYXRlTGVnZW5kID0gJGxlZ2VuZHNbMF1cblxuICAgICAgICAvLyBJZiB0aGUgaW5wdXQgdHlwZSBpcyByYWRpbyBvciBjaGVja2JveCwgYWx3YXlzIHVzZSB0aGUgbGVnZW5kIGlmXG4gICAgICAgIC8vIHRoZXJlIGlzIG9uZS5cbiAgICAgICAgaWYgKFxuICAgICAgICAgICRpbnB1dCBpbnN0YW5jZW9mIEhUTUxJbnB1dEVsZW1lbnQgJiZcbiAgICAgICAgICAoJGlucHV0LnR5cGUgPT09ICdjaGVja2JveCcgfHwgJGlucHV0LnR5cGUgPT09ICdyYWRpbycpXG4gICAgICAgICkge1xuICAgICAgICAgIHJldHVybiAkY2FuZGlkYXRlTGVnZW5kXG4gICAgICAgIH1cblxuICAgICAgICAvLyBGb3Igb3RoZXIgaW5wdXQgdHlwZXMsIG9ubHkgc2Nyb2xsIHRvIHRoZSBmaWVsZHNldOKAmXMgbGVnZW5kIChpbnN0ZWFkXG4gICAgICAgIC8vIG9mIHRoZSBsYWJlbCBhc3NvY2lhdGVkIHdpdGggdGhlIGlucHV0KSBpZiB0aGUgaW5wdXQgd291bGQgZW5kIHVwIGluXG4gICAgICAgIC8vIHRoZSB0b3AgaGFsZiBvZiB0aGUgc2NyZWVuLlxuICAgICAgICAvL1xuICAgICAgICAvLyBUaGlzIHNob3VsZCBhdm9pZCBzaXR1YXRpb25zIHdoZXJlIHRoZSBpbnB1dCBlaXRoZXIgZW5kcyB1cCBvZmYgdGhlXG4gICAgICAgIC8vIHNjcmVlbiwgb3Igb2JzY3VyZWQgYnkgYSBzb2Z0d2FyZSBrZXlib2FyZC5cbiAgICAgICAgY29uc3QgbGVnZW5kVG9wID0gJGNhbmRpZGF0ZUxlZ2VuZC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3BcbiAgICAgICAgY29uc3QgaW5wdXRSZWN0ID0gJGlucHV0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG5cbiAgICAgICAgLy8gSWYgdGhlIGJyb3dzZXIgZG9lc24ndCBzdXBwb3J0IEVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0XG4gICAgICAgIC8vIG9yIHdpbmRvdy5pbm5lckhlaWdodCAobGlrZSBJRTgpLCBiYWlsIGFuZCBqdXN0IGxpbmsgdG8gdGhlIGxhYmVsLlxuICAgICAgICBpZiAoaW5wdXRSZWN0LmhlaWdodCAmJiB3aW5kb3cuaW5uZXJIZWlnaHQpIHtcbiAgICAgICAgICBjb25zdCBpbnB1dEJvdHRvbSA9IGlucHV0UmVjdC50b3AgKyBpbnB1dFJlY3QuaGVpZ2h0XG5cbiAgICAgICAgICBpZiAoaW5wdXRCb3R0b20gLSBsZWdlbmRUb3AgPCB3aW5kb3cuaW5uZXJIZWlnaHQgLyAyKSB7XG4gICAgICAgICAgICByZXR1cm4gJGNhbmRpZGF0ZUxlZ2VuZFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBsYWJlbFtmb3I9JyR7JGlucHV0LmdldEF0dHJpYnV0ZSgnaWQnKX0nXWApID8/XG4gICAgICAkaW5wdXQuY2xvc2VzdCgnbGFiZWwnKVxuICAgIClcbiAgfVxuXG4gIC8qKlxuICAgKiBOYW1lIGZvciB0aGUgY29tcG9uZW50IHVzZWQgd2hlbiBpbml0aWFsaXNpbmcgdXNpbmcgZGF0YS1tb2R1bGUgYXR0cmlidXRlcy5cbiAgICovXG4gIHN0YXRpYyBtb2R1bGVOYW1lID0gJ2dvdnVrLWVycm9yLXN1bW1hcnknXG5cbiAgLyoqXG4gICAqIEVycm9yIHN1bW1hcnkgZGVmYXVsdCBjb25maWdcbiAgICpcbiAgICogQHNlZSB7QGxpbmsgRXJyb3JTdW1tYXJ5Q29uZmlnfVxuICAgKiBAY29uc3RhbnRcbiAgICogQHR5cGUge0Vycm9yU3VtbWFyeUNvbmZpZ31cbiAgICovXG4gIHN0YXRpYyBkZWZhdWx0cyA9IE9iamVjdC5mcmVlemUoe1xuICAgIGRpc2FibGVBdXRvRm9jdXM6IGZhbHNlXG4gIH0pXG5cbiAgLyoqXG4gICAqIEVycm9yIHN1bW1hcnkgY29uZmlnIHNjaGVtYVxuICAgKlxuICAgKiBAY29uc3RhbnRcbiAgICogQHNhdGlzZmllcyB7U2NoZW1hPEVycm9yU3VtbWFyeUNvbmZpZz59XG4gICAqL1xuICBzdGF0aWMgc2NoZW1hID0gT2JqZWN0LmZyZWV6ZSh7XG4gICAgcHJvcGVydGllczoge1xuICAgICAgZGlzYWJsZUF1dG9Gb2N1czogeyB0eXBlOiAnYm9vbGVhbicgfVxuICAgIH1cbiAgfSlcbn1cblxuLyoqXG4gKiBFcnJvciBzdW1tYXJ5IGNvbmZpZ1xuICpcbiAqIEB0eXBlZGVmIHtvYmplY3R9IEVycm9yU3VtbWFyeUNvbmZpZ1xuICogQHByb3BlcnR5IHtib29sZWFufSBbZGlzYWJsZUF1dG9Gb2N1cz1mYWxzZV0gLSBJZiBzZXQgdG8gYHRydWVgIHRoZSBlcnJvclxuICogICBzdW1tYXJ5IHdpbGwgbm90IGJlIGZvY3Vzc2VkIHdoZW4gdGhlIHBhZ2UgbG9hZHMuXG4gKi9cblxuLyoqXG4gKiBAaW1wb3J0IHsgU2NoZW1hIH0gZnJvbSAnLi4vLi4vY29tbW9uL2NvbmZpZ3VyYXRpb24ubWpzJ1xuICovXG4iLCJpbXBvcnQgeyBDb25maWd1cmFibGVDb21wb25lbnQgfSBmcm9tICcuLi8uLi9jb21tb24vY29uZmlndXJhdGlvbi5tanMnXG5pbXBvcnQgeyBFbGVtZW50RXJyb3IgfSBmcm9tICcuLi8uLi9lcnJvcnMvaW5kZXgubWpzJ1xuaW1wb3J0IHsgSTE4biB9IGZyb20gJy4uLy4uL2kxOG4ubWpzJ1xuXG4vKipcbiAqIEV4aXQgdGhpcyBwYWdlIGNvbXBvbmVudFxuICpcbiAqIEBwcmVzZXJ2ZVxuICogQGF1Z21lbnRzIENvbmZpZ3VyYWJsZUNvbXBvbmVudDxFeGl0VGhpc1BhZ2VDb25maWc+XG4gKi9cbmV4cG9ydCBjbGFzcyBFeGl0VGhpc1BhZ2UgZXh0ZW5kcyBDb25maWd1cmFibGVDb21wb25lbnQge1xuICAvKiogQHByaXZhdGUgKi9cbiAgaTE4blxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICAkYnV0dG9uXG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqIEB0eXBlIHtIVE1MQW5jaG9yRWxlbWVudCB8IG51bGx9XG4gICAqL1xuICAkc2tpcGxpbmtCdXR0b24gPSBudWxsXG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqIEB0eXBlIHtIVE1MRWxlbWVudCB8IG51bGx9XG4gICAqL1xuICAkdXBkYXRlU3BhbiA9IG51bGxcblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICogQHR5cGUge0hUTUxFbGVtZW50IHwgbnVsbH1cbiAgICovXG4gICRpbmRpY2F0b3JDb250YWluZXIgPSBudWxsXG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqIEB0eXBlIHtIVE1MRWxlbWVudCB8IG51bGx9XG4gICAqL1xuICAkb3ZlcmxheSA9IG51bGxcblxuICAvKiogQHByaXZhdGUgKi9cbiAga2V5cHJlc3NDb3VudGVyID0gMFxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBsYXN0S2V5V2FzTW9kaWZpZWQgPSBmYWxzZVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICB0aW1lb3V0VGltZSA9IDUwMDAgLy8gbWlsbGlzZWNvbmRzXG5cbiAgLy8gU3RvcmUgdGhlIHRpbWVvdXQgZXZlbnRzIHNvIHRoYXQgd2UgY2FuIGNsZWFyIHRoZW0gdG8gYXZvaWQgdXNlciBrZXlwcmVzc2VzIG92ZXJsYXBwaW5nXG4gIC8vIHNldFRpbWVvdXQgcmV0dXJucyBhbiBpZCB0aGF0IHdlIGNhbiB1c2UgdG8gY2xlYXIgaXQgd2l0aCBjbGVhclRpbWVvdXQsXG4gIC8vIGhlbmNlIHRoZSAnSWQnIHN1ZmZpeFxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAdHlwZSB7bnVtYmVyIHwgbnVsbH1cbiAgICovXG4gIGtleXByZXNzVGltZW91dElkID0gbnVsbFxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAdHlwZSB7bnVtYmVyIHwgbnVsbH1cbiAgICovXG4gIHRpbWVvdXRNZXNzYWdlSWQgPSBudWxsXG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7RWxlbWVudCB8IG51bGx9ICRyb290IC0gSFRNTCBlbGVtZW50IHRoYXQgd3JhcHMgdGhlIEV4aXQgVGhpcyBQYWdlIGJ1dHRvblxuICAgKiBAcGFyYW0ge0V4aXRUaGlzUGFnZUNvbmZpZ30gW2NvbmZpZ10gLSBFeGl0IFRoaXMgUGFnZSBjb25maWdcbiAgICovXG4gIGNvbnN0cnVjdG9yKCRyb290LCBjb25maWcgPSB7fSkge1xuICAgIHN1cGVyKCRyb290LCBjb25maWcpXG5cbiAgICBjb25zdCAkYnV0dG9uID0gdGhpcy4kcm9vdC5xdWVyeVNlbGVjdG9yKCcuZ292dWstZXhpdC10aGlzLXBhZ2VfX2J1dHRvbicpXG4gICAgaWYgKCEoJGJ1dHRvbiBpbnN0YW5jZW9mIEhUTUxBbmNob3JFbGVtZW50KSkge1xuICAgICAgdGhyb3cgbmV3IEVsZW1lbnRFcnJvcih7XG4gICAgICAgIGNvbXBvbmVudDogRXhpdFRoaXNQYWdlLFxuICAgICAgICBlbGVtZW50OiAkYnV0dG9uLFxuICAgICAgICBleHBlY3RlZFR5cGU6ICdIVE1MQW5jaG9yRWxlbWVudCcsXG4gICAgICAgIGlkZW50aWZpZXI6ICdCdXR0b24gKGAuZ292dWstZXhpdC10aGlzLXBhZ2VfX2J1dHRvbmApJ1xuICAgICAgfSlcbiAgICB9XG5cbiAgICB0aGlzLmkxOG4gPSBuZXcgSTE4bih0aGlzLmNvbmZpZy5pMThuKVxuICAgIHRoaXMuJGJ1dHRvbiA9ICRidXR0b25cblxuICAgIGNvbnN0ICRza2lwbGlua0J1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAnLmdvdnVrLWpzLWV4aXQtdGhpcy1wYWdlLXNraXBsaW5rJ1xuICAgIClcbiAgICBpZiAoJHNraXBsaW5rQnV0dG9uIGluc3RhbmNlb2YgSFRNTEFuY2hvckVsZW1lbnQpIHtcbiAgICAgIHRoaXMuJHNraXBsaW5rQnV0dG9uID0gJHNraXBsaW5rQnV0dG9uXG4gICAgfVxuXG4gICAgdGhpcy5idWlsZEluZGljYXRvcigpXG4gICAgdGhpcy5pbml0VXBkYXRlU3BhbigpXG4gICAgdGhpcy5pbml0QnV0dG9uQ2xpY2tIYW5kbGVyKClcblxuICAgIC8vIENoZWNrIHRvIHNlZSBpZiB0aGlzIGhhcyBhbHJlYWR5IGJlZW4gZG9uZSBieSBhIHByZXZpb3VzIGluaXRpYWxpc2F0aW9uIG9mIEV4aXRUaGlzUGFnZVxuICAgIGlmICghKCdnb3Z1a0Zyb250ZW5kRXhpdFRoaXNQYWdlS2V5cHJlc3MnIGluIGRvY3VtZW50LmJvZHkuZGF0YXNldCkpIHtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgdGhpcy5oYW5kbGVLZXlwcmVzcy5iaW5kKHRoaXMpLCB0cnVlKVxuICAgICAgZG9jdW1lbnQuYm9keS5kYXRhc2V0LmdvdnVrRnJvbnRlbmRFeGl0VGhpc1BhZ2VLZXlwcmVzcyA9ICd0cnVlJ1xuICAgIH1cblxuICAgIC8vIFdoZW4gdGhlIHBhZ2UgaXMgcmVzdG9yZWQgYWZ0ZXIgbmF2aWdhdGluZyAnYmFjaycgaW4gc29tZSBicm93c2VycyB0aGVcbiAgICAvLyBibGFuayBvdmVybGF5IHJlbWFpbnMgcHJlc2VudCwgcmVuZGVyaW5nIHRoZSBwYWdlIHVudXNhYmxlLiBIZXJlLCB3ZSBjaGVja1xuICAgIC8vIHRvIHNlZSBpZiBpdCdzIHByZXNlbnQgb24gcGFnZSAocmUpbG9hZCwgYW5kIHJlbW92ZSBpdCBpZiBzby5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncGFnZXNob3cnLCB0aGlzLnJlc2V0UGFnZS5iaW5kKHRoaXMpKVxuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSB0aGUgPHNwYW4+IHdlIHVzZSBmb3Igc2NyZWVuIHJlYWRlciBhbm5vdW5jZW1lbnRzLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgaW5pdFVwZGF0ZVNwYW4oKSB7XG4gICAgdGhpcy4kdXBkYXRlU3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxuICAgIHRoaXMuJHVwZGF0ZVNwYW4uc2V0QXR0cmlidXRlKCdyb2xlJywgJ3N0YXR1cycpXG4gICAgdGhpcy4kdXBkYXRlU3Bhbi5jbGFzc05hbWUgPSAnZ292dWstdmlzdWFsbHktaGlkZGVuJ1xuXG4gICAgdGhpcy4kcm9vdC5hcHBlbmRDaGlsZCh0aGlzLiR1cGRhdGVTcGFuKVxuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBidXR0b24gY2xpY2sgaGFuZGxlcnMuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBpbml0QnV0dG9uQ2xpY2tIYW5kbGVyKCkge1xuICAgIC8vIE1haW4gRXRQIGJ1dHRvblxuICAgIHRoaXMuJGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuaGFuZGxlQ2xpY2suYmluZCh0aGlzKSlcblxuICAgIC8vIEV0UCBzZWNvbmRhcnkgbGlua1xuICAgIGlmICh0aGlzLiRza2lwbGlua0J1dHRvbikge1xuICAgICAgdGhpcy4kc2tpcGxpbmtCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgJ2NsaWNrJyxcbiAgICAgICAgdGhpcy5oYW5kbGVDbGljay5iaW5kKHRoaXMpXG4gICAgICApXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSB0aGUgSFRNTCBmb3IgdGhlICd0aHJlZSBsaWdodHMnIGluZGljYXRvciBvbiB0aGUgYnV0dG9uLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgYnVpbGRJbmRpY2F0b3IoKSB7XG4gICAgLy8gQnVpbGQgY29udGFpbmVyXG4gICAgLy8gUHV0dGluZyBgYXJpYS1oaWRkZW5gIG9uIGl0IGFzIGl0IHdvbid0IGNvbnRhaW4gYW55IHJlYWRhYmxlIGluZm9ybWF0aW9uXG4gICAgdGhpcy4kaW5kaWNhdG9yQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICB0aGlzLiRpbmRpY2F0b3JDb250YWluZXIuY2xhc3NOYW1lID0gJ2dvdnVrLWV4aXQtdGhpcy1wYWdlX19pbmRpY2F0b3InXG4gICAgdGhpcy4kaW5kaWNhdG9yQ29udGFpbmVyLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpXG5cbiAgICAvLyBDcmVhdGUgdGhyZWUgJ2xpZ2h0cycgYW5kIHBsYWNlIHRoZW0gd2l0aGluIHRoZSBjb250YWluZXJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDM7IGkrKykge1xuICAgICAgY29uc3QgJGluZGljYXRvciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgICAkaW5kaWNhdG9yLmNsYXNzTmFtZSA9ICdnb3Z1ay1leGl0LXRoaXMtcGFnZV9faW5kaWNhdG9yLWxpZ2h0J1xuICAgICAgdGhpcy4kaW5kaWNhdG9yQ29udGFpbmVyLmFwcGVuZENoaWxkKCRpbmRpY2F0b3IpXG4gICAgfVxuXG4gICAgLy8gQXBwZW5kIGl0IGFsbCB0byB0aGUgbW9kdWxlXG4gICAgdGhpcy4kYnV0dG9uLmFwcGVuZENoaWxkKHRoaXMuJGluZGljYXRvckNvbnRhaW5lcilcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGUgd2hldGhlciB0aGUgbGlnaHRzIGFyZSB2aXNpYmxlIGFuZCB3aGljaCBvbmVzIGFyZSBsaXQgdXAgZGVwZW5kaW5nIG9uXG4gICAqIHRoZSB2YWx1ZSBvZiBga2V5cHJlc3NDb3VudGVyYC5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHVwZGF0ZUluZGljYXRvcigpIHtcbiAgICBpZiAoIXRoaXMuJGluZGljYXRvckNvbnRhaW5lcikge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgLy8gU2hvdyBvciBoaWRlIHRoZSBpbmRpY2F0b3IgY29udGFpbmVyIGRlcGVuZGluZyBvbiBrZXlwcmVzc0NvdW50ZXIgdmFsdWVcbiAgICB0aGlzLiRpbmRpY2F0b3JDb250YWluZXIuY2xhc3NMaXN0LnRvZ2dsZShcbiAgICAgICdnb3Z1ay1leGl0LXRoaXMtcGFnZV9faW5kaWNhdG9yLS12aXNpYmxlJyxcbiAgICAgIHRoaXMua2V5cHJlc3NDb3VudGVyID4gMFxuICAgIClcblxuICAgIC8vIFR1cm4gb24gb25seSB0aGUgaW5kaWNhdG9ycyB3ZSB3YW50IG9uXG4gICAgY29uc3QgJGluZGljYXRvcnMgPSB0aGlzLiRpbmRpY2F0b3JDb250YWluZXIucXVlcnlTZWxlY3RvckFsbChcbiAgICAgICcuZ292dWstZXhpdC10aGlzLXBhZ2VfX2luZGljYXRvci1saWdodCdcbiAgICApXG4gICAgJGluZGljYXRvcnMuZm9yRWFjaCgoJGluZGljYXRvciwgaW5kZXgpID0+IHtcbiAgICAgICRpbmRpY2F0b3IuY2xhc3NMaXN0LnRvZ2dsZShcbiAgICAgICAgJ2dvdnVrLWV4aXQtdGhpcy1wYWdlX19pbmRpY2F0b3ItbGlnaHQtLW9uJyxcbiAgICAgICAgaW5kZXggPCB0aGlzLmtleXByZXNzQ291bnRlclxuICAgICAgKVxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhdGVzIHRoZSByZWRpcmVjdGlvbiBhd2F5IGZyb20gdGhlIGN1cnJlbnQgcGFnZS5cbiAgICogSW5jbHVkZXMgdGhlIGxvYWRpbmcgb3ZlcmxheSBmdW5jdGlvbmFsaXR5LCB3aGljaCBjb3ZlcnMgdGhlIGN1cnJlbnQgcGFnZSB3aXRoIGFcbiAgICogd2hpdGUgb3ZlcmxheSBzbyB0aGF0IHRoZSBjb250ZW50cyBhcmUgbm90IHZpc2libGUgZHVyaW5nIHRoZSBsb2FkaW5nXG4gICAqIHByb2Nlc3MuIFRoaXMgaXMgcGFydGljdWxhcmx5IGltcG9ydGFudCBvbiBzbG93IG5ldHdvcmsgY29ubmVjdGlvbnMuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBleGl0UGFnZSgpIHtcbiAgICBpZiAoIXRoaXMuJHVwZGF0ZVNwYW4pIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIHRoaXMuJHVwZGF0ZVNwYW4udGV4dENvbnRlbnQgPSAnJ1xuXG4gICAgLy8gQmxhbmsgdGhlIHBhZ2VcbiAgICAvLyBBcyB3ZWxsIGFzIGNyZWF0aW5nIGFuIG92ZXJsYXkgd2l0aCB0ZXh0LCB3ZSBhbHNvIHNldCB0aGUgYm9keSB0byBoaWRkZW5cbiAgICAvLyB0byBwcmV2ZW50IHNjcmVlbiByZWFkZXIgYW5kIHNlcXVlbnRpYWwgbmF2aWdhdGlvbiB1c2VycyBwb3RlbnRpYWxseVxuICAgIC8vIG5hdmlnYXRpbmcgdGhyb3VnaCB0aGUgcGFnZSBiZWhpbmQgdGhlIG92ZXJsYXkgZHVyaW5nIGxvYWRpbmdcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ2dvdnVrLWV4aXQtdGhpcy1wYWdlLWhpZGUtY29udGVudCcpXG4gICAgdGhpcy4kb3ZlcmxheSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgdGhpcy4kb3ZlcmxheS5jbGFzc05hbWUgPSAnZ292dWstZXhpdC10aGlzLXBhZ2Utb3ZlcmxheSdcbiAgICB0aGlzLiRvdmVybGF5LnNldEF0dHJpYnV0ZSgncm9sZScsICdhbGVydCcpXG5cbiAgICAvLyB3ZSBkbyB0aGVzZSB0aGlzIHdheSByb3VuZCwgdGh1cyBpbmN1cnJpbmcgYSBzZWNvbmQgcGFpbnQsIGJlY2F1c2UgY2hhbmdpbmdcbiAgICAvLyB0aGUgZWxlbWVudCB0ZXh0IGFmdGVyIGFkZGluZyBpdCBtZWFucyB0aGF0IHNjcmVlbiByZWFkZXJzIHBpY2sgdXAgdGhlXG4gICAgLy8gYW5ub3VuY2VtZW50IG1vcmUgcmVsaWFibHkuXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLiRvdmVybGF5KVxuICAgIHRoaXMuJG92ZXJsYXkudGV4dENvbnRlbnQgPSB0aGlzLmkxOG4udCgnYWN0aXZhdGVkJylcblxuICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gdGhpcy4kYnV0dG9uLmhyZWZcbiAgfVxuXG4gIC8qKlxuICAgKiBQcmUtYWN0aXZhdGlvbiBsb2dpYyBmb3Igd2hlbiB0aGUgYnV0dG9uIGlzIGNsaWNrZWQvYWN0aXZhdGVkIHZpYSBtb3VzZSBvclxuICAgKiBwb2ludGVyLlxuICAgKlxuICAgKiBXZSBkbyB0aGlzIHRvIGRpZmZlcmVudGlhdGUgaXQgZnJvbSB0aGUga2V5Ym9hcmQgYWN0aXZhdGlvbiBldmVudCBiZWNhdXNlIHdlXG4gICAqIG5lZWQgdG8gcnVuIGBlLnByZXZlbnREZWZhdWx0YCBhcyB0aGUgYnV0dG9uIG9yIHNraXBsaW5rIGFyZSBib3RoIGxpbmtzIGFuZCB3ZVxuICAgKiB3YW50IHRvIGFwcGx5IHNvbWUgYWRkaXRpb25hbCBsb2dpYyBpbiBgZXhpdFBhZ2VgIGJlZm9yZSBuYXZpZ2F0aW5nLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge01vdXNlRXZlbnR9IGV2ZW50IC0gbW91c2UgY2xpY2sgZXZlbnRcbiAgICovXG4gIGhhbmRsZUNsaWNrKGV2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgIHRoaXMuZXhpdFBhZ2UoKVxuICB9XG5cbiAgLyoqXG4gICAqIExvZ2ljIGZvciB0aGUgJ3F1aWNrIGVzY2FwZScga2V5Ym9hcmQgc2VxdWVuY2UgZnVuY3Rpb25hbGl0eSAocHJlc3NpbmcgdGhlXG4gICAqIFNoaWZ0IGtleSB0aHJlZSB0aW1lcyB3aXRob3V0IGludGVycnVwdGlvbiwgd2l0aGluIGEgdGltZSBsaW1pdCkuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgLSBrZXl1cCBldmVudFxuICAgKi9cbiAgaGFuZGxlS2V5cHJlc3MoZXZlbnQpIHtcbiAgICBpZiAoIXRoaXMuJHVwZGF0ZVNwYW4pIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIC8vIERldGVjdCBpZiB0aGUgJ1NoaWZ0JyBrZXkgaGFzIGJlZW4gcHJlc3NlZC4gV2Ugd2FudCB0byBvbmx5IGRvIHRoaW5ncyBpZiBpdFxuICAgIC8vIHdhcyBwcmVzc2VkIGJ5IGl0c2VsZiBhbmQgbm90IGluIGEgY29tYmluYXRpb24gd2l0aCBhbm90aGVyIGtleeKAlHNvIHdlIGtlZXBcbiAgICAvLyB0cmFjayBvZiB3aGV0aGVyIHRoZSBwcmVjZWRpbmcga2V5dXAgaGFkIHNoaWZ0S2V5OiB0cnVlIG9uIGl0LCBhbmQgaWYgaXRcbiAgICAvLyBkaWQsIHdlIGlnbm9yZSB0aGUgbmV4dCBTaGlmdCBrZXl1cCBldmVudC5cbiAgICAvL1xuICAgIC8vIFRoaXMgd29ya3MgYmVjYXVzZSB1c2luZyBTaGlmdCBhcyBhIG1vZGlmaWVyIGtleSAoZS5nLiBwcmVzc2luZyBTaGlmdCArIEEpXG4gICAgLy8gd2lsbCBmaXJlIFRXTyBrZXl1cCBldmVudHMsIG9uZSBmb3IgQSAod2l0aCBlLnNoaWZ0S2V5OiB0cnVlKSBhbmQgdGhlIG90aGVyXG4gICAgLy8gZm9yIFNoaWZ0ICh3aXRoIGUuc2hpZnRLZXk6IGZhbHNlKS5cbiAgICBpZiAoZXZlbnQua2V5ID09PSAnU2hpZnQnICYmICF0aGlzLmxhc3RLZXlXYXNNb2RpZmllZCkge1xuICAgICAgdGhpcy5rZXlwcmVzc0NvdW50ZXIgKz0gMVxuXG4gICAgICAvLyBVcGRhdGUgdGhlIGluZGljYXRvciBiZWZvcmUgdGhlIGJlbG93IGlmIHN0YXRlbWVudCBjYW4gcmVzZXQgaXQgYmFjayB0byAwXG4gICAgICB0aGlzLnVwZGF0ZUluZGljYXRvcigpXG5cbiAgICAgIC8vIENsZWFyIHRoZSB0aW1lb3V0IGZvciB0aGUga2V5cHJlc3MgdGltZW91dCBtZXNzYWdlIGNsZWFyaW5nIGl0c2VsZlxuICAgICAgaWYgKHRoaXMudGltZW91dE1lc3NhZ2VJZCkge1xuICAgICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dE1lc3NhZ2VJZClcbiAgICAgICAgdGhpcy50aW1lb3V0TWVzc2FnZUlkID0gbnVsbFxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5rZXlwcmVzc0NvdW50ZXIgPj0gMykge1xuICAgICAgICB0aGlzLmtleXByZXNzQ291bnRlciA9IDBcblxuICAgICAgICBpZiAodGhpcy5rZXlwcmVzc1RpbWVvdXRJZCkge1xuICAgICAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQodGhpcy5rZXlwcmVzc1RpbWVvdXRJZClcbiAgICAgICAgICB0aGlzLmtleXByZXNzVGltZW91dElkID0gbnVsbFxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5leGl0UGFnZSgpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodGhpcy5rZXlwcmVzc0NvdW50ZXIgPT09IDEpIHtcbiAgICAgICAgICB0aGlzLiR1cGRhdGVTcGFuLnRleHRDb250ZW50ID0gdGhpcy5pMThuLnQoJ3ByZXNzVHdvTW9yZVRpbWVzJylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLiR1cGRhdGVTcGFuLnRleHRDb250ZW50ID0gdGhpcy5pMThuLnQoJ3ByZXNzT25lTW9yZVRpbWUnKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2V0S2V5cHJlc3NUaW1lcigpXG4gICAgfSBlbHNlIGlmICh0aGlzLmtleXByZXNzVGltZW91dElkKSB7XG4gICAgICAvLyBJZiB0aGUgdXNlciBwcmVzc2VkIGFueSBrZXkgb3RoZXIgdGhhbiAnU2hpZnQnLCBhZnRlciBoYXZpbmcgcHJlc3NlZFxuICAgICAgLy8gJ1NoaWZ0JyBhbmQgYWN0aXZhdGluZyB0aGUgdGltZXIsIHN0b3AgYW5kIHJlc2V0IHRoZSB0aW1lci5cbiAgICAgIHRoaXMucmVzZXRLZXlwcmVzc1RpbWVyKClcbiAgICB9XG5cbiAgICAvLyBLZWVwIHRyYWNrIG9mIHdoZXRoZXIgdGhlIFNoaWZ0IG1vZGlmaWVyIGtleSB3YXMgaGVsZCBkdXJpbmcgdGhpcyBrZXlwcmVzc1xuICAgIHRoaXMubGFzdEtleVdhc01vZGlmaWVkID0gZXZlbnQuc2hpZnRLZXlcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydHMgdGhlICdxdWljayBlc2NhcGUnIGtleWJvYXJkIHNlcXVlbmNlIHRpbWVyLlxuICAgKlxuICAgKiBUaGlzIGNhbiBiZSBpbnZva2VkIHNldmVyYWwgdGltZXMuIFdlIHdhbnQgdGhpcyB0byBiZSBwb3NzaWJsZSBzbyB0aGF0IHRoZVxuICAgKiB0aW1lciBpcyByZXN0YXJ0ZWQgZWFjaCB0aW1lIHRoZSBzaG9ydGN1dCBrZXkgaXMgcHJlc3NlZCAoZS5nLiB0aGUgdXNlciBoYXNcbiAgICogdXAgdG8gbiBzZWNvbmRzIGJldHdlZW4gZWFjaCBrZXlwcmVzcywgcmF0aGVyIHRoYW4gbiBzZWNvbmRzIHRvIGludm9rZSB0aGVcbiAgICogZW50aXJlIHNlcXVlbmNlLilcbiAgICpcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHNldEtleXByZXNzVGltZXIoKSB7XG4gICAgLy8gQ2xlYXIgYW55IGV4aXN0aW5nIHRpbWVvdXQuIFRoaXMgaXMgc28gb25seSBvbmUgdGltZXIgaXMgcnVubmluZyBldmVuIGlmXG4gICAgLy8gdGhlcmUgYXJlIG11bHRpcGxlIGtleXByZXNzZXMgaW4gcXVpY2sgc3VjY2Vzc2lvbi5cbiAgICBpZiAodGhpcy5rZXlwcmVzc1RpbWVvdXRJZCkge1xuICAgICAgd2luZG93LmNsZWFyVGltZW91dCh0aGlzLmtleXByZXNzVGltZW91dElkKVxuICAgIH1cblxuICAgIC8vIFNldCBhIGZyZXNoIHRpbWVvdXRcbiAgICB0aGlzLmtleXByZXNzVGltZW91dElkID0gd2luZG93LnNldFRpbWVvdXQoXG4gICAgICB0aGlzLnJlc2V0S2V5cHJlc3NUaW1lci5iaW5kKHRoaXMpLFxuICAgICAgdGhpcy50aW1lb3V0VGltZVxuICAgIClcbiAgfVxuXG4gIC8qKlxuICAgKiBTdG9wcyBhbmQgcmVzZXRzIHRoZSAncXVpY2sgZXNjYXBlJyBrZXlib2FyZCBzZXF1ZW5jZSB0aW1lci5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHJlc2V0S2V5cHJlc3NUaW1lcigpIHtcbiAgICBpZiAoIXRoaXMuJHVwZGF0ZVNwYW4pIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGlmICh0aGlzLmtleXByZXNzVGltZW91dElkKSB7XG4gICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHRoaXMua2V5cHJlc3NUaW1lb3V0SWQpXG4gICAgICB0aGlzLmtleXByZXNzVGltZW91dElkID0gbnVsbFxuICAgIH1cblxuICAgIGNvbnN0ICR1cGRhdGVTcGFuID0gdGhpcy4kdXBkYXRlU3BhblxuXG4gICAgdGhpcy5rZXlwcmVzc0NvdW50ZXIgPSAwXG4gICAgJHVwZGF0ZVNwYW4udGV4dENvbnRlbnQgPSB0aGlzLmkxOG4udCgndGltZWRPdXQnKVxuXG4gICAgdGhpcy50aW1lb3V0TWVzc2FnZUlkID0gd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgJHVwZGF0ZVNwYW4udGV4dENvbnRlbnQgPSAnJ1xuICAgIH0sIHRoaXMudGltZW91dFRpbWUpXG5cbiAgICB0aGlzLnVwZGF0ZUluZGljYXRvcigpXG4gIH1cblxuICAvKipcbiAgICogUmVzZXQgdGhlIHBhZ2UgdXNpbmcgdGhlIEV0UCBidXR0b25cbiAgICpcbiAgICogV2UgdXNlIHRoaXMgaW4gc2l0dWF0aW9ucyB3aGVyZSBhIHVzZXIgbWF5IHJlLWVudGVyIGEgcGFnZSB1c2luZyB0aGUgYnJvd3NlclxuICAgKiBiYWNrIGJ1dHRvbi4gSW4gdGhlc2UgY2FzZXMsIHRoZSBicm93c2VyIGNhbiBjaG9vc2UgdG8gcmVzdG9yZSB0aGUgc3RhdGUgb2ZcbiAgICogdGhlIHBhZ2UgYXMgaXQgd2FzIHByZXZpb3VzbHksIGluY2x1ZGluZyByZXN0b3JpbmcgdGhlICdnaG9zdCBwYWdlJyBvdmVybGF5LFxuICAgKiB0aGUgYW5ub3VuY2VtZW50IHNwYW4gaGF2aW5nIGl0J3Mgcm9sZSBzZXQgdG8gXCJhbGVydFwiIGFuZCB0aGUga2V5cHJlc3NcbiAgICogaW5kaWNhdG9yIHN0aWxsIGFjdGl2ZSwgbGVhdmluZyB0aGUgcGFnZSBpbiBhbiB1bnVzYWJsZSBzdGF0ZS5cbiAgICpcbiAgICogQnkgcnVubmluZyB0aGlzIGNoZWNrIHdoZW4gdGhlIHBhZ2UgaXMgc2hvd24sIHdlIGNhbiBwcm9ncmFtYXRpY2FsbHkgcmVzdG9yZVxuICAgKiB0aGUgcGFnZSBhbmQgdGhlIGNvbXBvbmVudCB0byBhIFwiZGVmYXVsdFwiIHN0YXRlXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICByZXNldFBhZ2UoKSB7XG4gICAgLy8gSWYgYW4gb3ZlcmxheSBpcyBzZXQsIHJlbW92ZSBpdCBhbmQgcmVzZXQgdGhlIHZhbHVlXG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdnb3Z1ay1leGl0LXRoaXMtcGFnZS1oaWRlLWNvbnRlbnQnKVxuXG4gICAgaWYgKHRoaXMuJG92ZXJsYXkpIHtcbiAgICAgIHRoaXMuJG92ZXJsYXkucmVtb3ZlKClcbiAgICAgIHRoaXMuJG92ZXJsYXkgPSBudWxsXG4gICAgfVxuXG4gICAgLy8gRW5zdXJlIHRoZSBhbm5vdW5jZW1lbnQgc3BhbidzIHJvbGUgaXMgc3RhdHVzLCBub3QgYWxlcnQgYW5kIGNsZWFyIGFueSB0ZXh0XG4gICAgaWYgKHRoaXMuJHVwZGF0ZVNwYW4pIHtcbiAgICAgIHRoaXMuJHVwZGF0ZVNwYW4uc2V0QXR0cmlidXRlKCdyb2xlJywgJ3N0YXR1cycpXG4gICAgICB0aGlzLiR1cGRhdGVTcGFuLnRleHRDb250ZW50ID0gJydcbiAgICB9XG5cbiAgICAvLyBTeW5jIHRoZSBrZXlwcmVzcyBpbmRpY2F0b3IgbGlnaHRzXG4gICAgdGhpcy51cGRhdGVJbmRpY2F0b3IoKVxuXG4gICAgLy8gSWYgdGhlIHRpbWVvdXRzIGFyZSBhY3RpdmUsIGNsZWFyIHRoZW1cbiAgICBpZiAodGhpcy5rZXlwcmVzc1RpbWVvdXRJZCkge1xuICAgICAgd2luZG93LmNsZWFyVGltZW91dCh0aGlzLmtleXByZXNzVGltZW91dElkKVxuICAgIH1cblxuICAgIGlmICh0aGlzLnRpbWVvdXRNZXNzYWdlSWQpIHtcbiAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQodGhpcy50aW1lb3V0TWVzc2FnZUlkKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBOYW1lIGZvciB0aGUgY29tcG9uZW50IHVzZWQgd2hlbiBpbml0aWFsaXNpbmcgdXNpbmcgZGF0YS1tb2R1bGUgYXR0cmlidXRlcy5cbiAgICovXG4gIHN0YXRpYyBtb2R1bGVOYW1lID0gJ2dvdnVrLWV4aXQtdGhpcy1wYWdlJ1xuXG4gIC8qKlxuICAgKiBFeGl0IHRoaXMgcGFnZSBkZWZhdWx0IGNvbmZpZ1xuICAgKlxuICAgKiBAc2VlIHtAbGluayBFeGl0VGhpc1BhZ2VDb25maWd9XG4gICAqIEBjb25zdGFudFxuICAgKiBAdHlwZSB7RXhpdFRoaXNQYWdlQ29uZmlnfVxuICAgKi9cbiAgc3RhdGljIGRlZmF1bHRzID0gT2JqZWN0LmZyZWV6ZSh7XG4gICAgaTE4bjoge1xuICAgICAgYWN0aXZhdGVkOiAnTG9hZGluZy4nLFxuICAgICAgdGltZWRPdXQ6ICdFeGl0IHRoaXMgcGFnZSBleHBpcmVkLicsXG4gICAgICBwcmVzc1R3b01vcmVUaW1lczogJ1NoaWZ0LCBwcmVzcyAyIG1vcmUgdGltZXMgdG8gZXhpdC4nLFxuICAgICAgcHJlc3NPbmVNb3JlVGltZTogJ1NoaWZ0LCBwcmVzcyAxIG1vcmUgdGltZSB0byBleGl0LidcbiAgICB9XG4gIH0pXG5cbiAgLyoqXG4gICAqIEV4aXQgdGhpcyBwYWdlIGNvbmZpZyBzY2hlbWFcbiAgICpcbiAgICogQGNvbnN0YW50XG4gICAqIEBzYXRpc2ZpZXMge1NjaGVtYTxFeGl0VGhpc1BhZ2VDb25maWc+fVxuICAgKi9cbiAgc3RhdGljIHNjaGVtYSA9IE9iamVjdC5mcmVlemUoe1xuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgIGkxOG46IHsgdHlwZTogJ29iamVjdCcgfVxuICAgIH1cbiAgfSlcbn1cblxuLyoqXG4gKiBFeGl0IHRoaXMgUGFnZSBjb25maWdcbiAqXG4gKiBAc2VlIHtAbGluayBFeGl0VGhpc1BhZ2UuZGVmYXVsdHN9XG4gKiBAdHlwZWRlZiB7b2JqZWN0fSBFeGl0VGhpc1BhZ2VDb25maWdcbiAqIEBwcm9wZXJ0eSB7RXhpdFRoaXNQYWdlVHJhbnNsYXRpb25zfSBbaTE4bj1FeGl0VGhpc1BhZ2UuZGVmYXVsdHMuaTE4bl0gLSBFeGl0IHRoaXMgcGFnZSB0cmFuc2xhdGlvbnNcbiAqL1xuXG4vKipcbiAqIEV4aXQgdGhpcyBQYWdlIHRyYW5zbGF0aW9uc1xuICpcbiAqIEBzZWUge0BsaW5rIEV4aXRUaGlzUGFnZS5kZWZhdWx0cy5pMThufVxuICogQHR5cGVkZWYge29iamVjdH0gRXhpdFRoaXNQYWdlVHJhbnNsYXRpb25zXG4gKlxuICogTWVzc2FnZXMgdXNlZCBieSB0aGUgY29tcG9uZW50IHByb2dyYW1hdGljYWxseSBpbnNlcnRlZCB0ZXh0LCBpbmNsdWRpbmdcbiAqIG92ZXJsYXkgdGV4dCBhbmQgc2NyZWVuIHJlYWRlciBhbm5vdW5jZW1lbnRzLlxuICogQHByb3BlcnR5IHtzdHJpbmd9IFthY3RpdmF0ZWRdIC0gU2NyZWVuIHJlYWRlciBhbm5vdW5jZW1lbnQgZm9yIHdoZW4gRXRQXG4gKiAgIGtleXByZXNzIGZ1bmN0aW9uYWxpdHkgaGFzIGJlZW4gc3VjY2Vzc2Z1bGx5IGFjdGl2YXRlZC5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbdGltZWRPdXRdIC0gU2NyZWVuIHJlYWRlciBhbm5vdW5jZW1lbnQgZm9yIHdoZW4gdGhlIEV0UFxuICogICBrZXlwcmVzcyBmdW5jdGlvbmFsaXR5IGhhcyB0aW1lZCBvdXQuXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW3ByZXNzVHdvTW9yZVRpbWVzXSAtIFNjcmVlbiByZWFkZXIgYW5ub3VuY2VtZW50IGluZm9ybWluZ1xuICogICB0aGUgdXNlciB0aGV5IG11c3QgcHJlc3MgdGhlIGFjdGl2YXRpb24ga2V5IHR3byBtb3JlIHRpbWVzLlxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtwcmVzc09uZU1vcmVUaW1lXSAtIFNjcmVlbiByZWFkZXIgYW5ub3VuY2VtZW50IGluZm9ybWluZ1xuICogICB0aGUgdXNlciB0aGV5IG11c3QgcHJlc3MgdGhlIGFjdGl2YXRpb24ga2V5IG9uZSBtb3JlIHRpbWUuXG4gKi9cblxuLyoqXG4gKiBAaW1wb3J0IHsgU2NoZW1hIH0gZnJvbSAnLi4vLi4vY29tbW9uL2NvbmZpZ3VyYXRpb24ubWpzJ1xuICovXG4iLCJpbXBvcnQgeyBjbG9zZXN0QXR0cmlidXRlVmFsdWUgfSBmcm9tICcuLi8uLi9jb21tb24vY2xvc2VzdC1hdHRyaWJ1dGUtdmFsdWUubWpzJ1xuaW1wb3J0IHsgQ29uZmlndXJhYmxlQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vY29tbW9uL2NvbmZpZ3VyYXRpb24ubWpzJ1xuaW1wb3J0IHsgZm9ybWF0RXJyb3JNZXNzYWdlIH0gZnJvbSAnLi4vLi4vY29tbW9uL2luZGV4Lm1qcydcbmltcG9ydCB7IEVsZW1lbnRFcnJvciB9IGZyb20gJy4uLy4uL2Vycm9ycy9pbmRleC5tanMnXG5pbXBvcnQgeyBJMThuIH0gZnJvbSAnLi4vLi4vaTE4bi5tanMnXG5cbi8qKlxuICogRmlsZSB1cGxvYWQgY29tcG9uZW50XG4gKlxuICogQHByZXNlcnZlXG4gKiBAYXVnbWVudHMgQ29uZmlndXJhYmxlQ29tcG9uZW50PEZpbGVVcGxvYWRDb25maWc+XG4gKi9cbmV4cG9ydCBjbGFzcyBGaWxlVXBsb2FkIGV4dGVuZHMgQ29uZmlndXJhYmxlQ29tcG9uZW50IHtcbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqIEB0eXBlIHtIVE1MRmlsZUlucHV0RWxlbWVudH1cbiAgICovXG4gICRpbnB1dFxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgJGJ1dHRvblxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgJHN0YXR1c1xuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBpMThuXG5cbiAgLyoqIEBwcml2YXRlICovXG4gIGlkXG5cbiAgLyoqIEBwcml2YXRlICovXG4gICRhbm5vdW5jZW1lbnRzXG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqIEB0eXBlIHtib29sZWFuIHwgdW5kZWZpbmVkfVxuICAgKi9cbiAgZW50ZXJlZEFub3RoZXJFbGVtZW50XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7RWxlbWVudCB8IG51bGx9ICRyb290IC0gRmlsZSBpbnB1dCBlbGVtZW50XG4gICAqIEBwYXJhbSB7RmlsZVVwbG9hZENvbmZpZ30gW2NvbmZpZ10gLSBGaWxlIFVwbG9hZCBjb25maWdcbiAgICovXG4gIGNvbnN0cnVjdG9yKCRyb290LCBjb25maWcgPSB7fSkge1xuICAgIHN1cGVyKCRyb290LCBjb25maWcpXG5cbiAgICBjb25zdCAkaW5wdXQgPSB0aGlzLiRyb290LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0JylcblxuICAgIGlmICgkaW5wdXQgPT09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBFbGVtZW50RXJyb3Ioe1xuICAgICAgICBjb21wb25lbnQ6IEZpbGVVcGxvYWQsXG4gICAgICAgIGlkZW50aWZpZXI6ICdGaWxlIGlucHV0cyAoYDxpbnB1dCB0eXBlPVwiZmlsZVwiPmApJ1xuICAgICAgfSlcbiAgICB9XG5cbiAgICBpZiAoJGlucHV0LnR5cGUgIT09ICdmaWxlJykge1xuICAgICAgdGhyb3cgbmV3IEVsZW1lbnRFcnJvcihcbiAgICAgICAgZm9ybWF0RXJyb3JNZXNzYWdlKFxuICAgICAgICAgIEZpbGVVcGxvYWQsXG4gICAgICAgICAgJ0ZpbGUgaW5wdXQgKGA8aW5wdXQgdHlwZT1cImZpbGVcIj5gKSBhdHRyaWJ1dGUgKGB0eXBlYCkgaXMgbm90IGBmaWxlYCdcbiAgICAgICAgKVxuICAgICAgKVxuICAgIH1cblxuICAgIHRoaXMuJGlucHV0ID0gLyoqIEB0eXBlIHtIVE1MRmlsZUlucHV0RWxlbWVudH0gKi8gKCRpbnB1dClcbiAgICB0aGlzLiRpbnB1dC5zZXRBdHRyaWJ1dGUoJ2hpZGRlbicsICd0cnVlJylcblxuICAgIGlmICghdGhpcy4kaW5wdXQuaWQpIHtcbiAgICAgIHRocm93IG5ldyBFbGVtZW50RXJyb3Ioe1xuICAgICAgICBjb21wb25lbnQ6IEZpbGVVcGxvYWQsXG4gICAgICAgIGlkZW50aWZpZXI6ICdGaWxlIGlucHV0IChgPGlucHV0IHR5cGU9XCJmaWxlXCI+YCkgYXR0cmlidXRlIChgaWRgKSdcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgdGhpcy5pZCA9IHRoaXMuJGlucHV0LmlkXG5cbiAgICB0aGlzLmkxOG4gPSBuZXcgSTE4bih0aGlzLmNvbmZpZy5pMThuLCB7XG4gICAgICAvLyBSZWFkIHRoZSBmYWxsYmFjayBpZiBuZWNlc3NhcnkgcmF0aGVyIHRoYW4gaGF2ZSBpdCBzZXQgaW4gdGhlIGRlZmF1bHRzXG4gICAgICBsb2NhbGU6IGNsb3Nlc3RBdHRyaWJ1dGVWYWx1ZSh0aGlzLiRyb290LCAnbGFuZycpXG4gICAgfSlcblxuICAgIGNvbnN0ICRsYWJlbCA9IHRoaXMuZmluZExhYmVsKClcbiAgICAvLyBBZGQgYW4gSUQgdG8gdGhlIGxhYmVsIGlmIGl0IGRvZXNuJ3QgaGF2ZSBvbmUgYWxyZWFkeVxuICAgIC8vIHNvIGl0IGNhbiBiZSByZWZlcmVuY2VkIGJ5IGBhcmlhLWxhYmVsbGVkYnlgXG4gICAgaWYgKCEkbGFiZWwuaWQpIHtcbiAgICAgICRsYWJlbC5pZCA9IGAke3RoaXMuaWR9LWxhYmVsYFxuICAgIH1cblxuICAgIC8vIHdlIG5lZWQgdG8gY29weSB0aGUgJ2lkJyBvZiB0aGUgcm9vdCBlbGVtZW50XG4gICAgLy8gdG8gdGhlIG5ldyBidXR0b24gcmVwbGFjZW1lbnQgZWxlbWVudFxuICAgIC8vIHNvIHRoYXQgZm9jdXMgd2lsbCB3b3JrIGluIHRoZSBlcnJvciBzdW1tYXJ5XG4gICAgdGhpcy4kaW5wdXQuaWQgPSBgJHt0aGlzLmlkfS1pbnB1dGBcblxuICAgIC8vIENyZWF0ZSB0aGUgZmlsZSBzZWxlY3Rpb24gYnV0dG9uXG4gICAgY29uc3QgJGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpXG4gICAgJGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdnb3Z1ay1maWxlLXVwbG9hZC1idXR0b24nKVxuICAgICRidXR0b24udHlwZSA9ICdidXR0b24nXG4gICAgJGJ1dHRvbi5pZCA9IHRoaXMuaWRcbiAgICAkYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2dvdnVrLWZpbGUtdXBsb2FkLWJ1dHRvbi0tZW1wdHknKVxuXG4gICAgLy8gQ29weSBgYXJpYS1kZXNjcmliZWRieWAgaWYgcHJlc2VudCBzbyBoaW50cyBhbmQgZXJyb3JzXG4gICAgLy8gYXJlIGFzc29jaWF0ZWQgdG8gdGhlIGA8YnV0dG9uPmBcbiAgICBjb25zdCBhcmlhRGVzY3JpYmVkQnkgPSB0aGlzLiRpbnB1dC5nZXRBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknKVxuICAgIGlmIChhcmlhRGVzY3JpYmVkQnkpIHtcbiAgICAgICRidXR0b24uc2V0QXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5JywgYXJpYURlc2NyaWJlZEJ5KVxuICAgIH1cblxuICAgIC8vIENyZWF0ZSBzdGF0dXMgZWxlbWVudCB0aGF0IHNob3dzIHdoYXQvaG93IG1hbnkgZmlsZXMgYXJlIHNlbGVjdGVkXG4gICAgY29uc3QgJHN0YXR1cyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxuICAgICRzdGF0dXMuY2xhc3NOYW1lID0gJ2dvdnVrLWJvZHkgZ292dWstZmlsZS11cGxvYWQtYnV0dG9uX19zdGF0dXMnXG4gICAgJHN0YXR1cy5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGl2ZScsICdwb2xpdGUnKVxuICAgICRzdGF0dXMuaW5uZXJUZXh0ID0gdGhpcy5pMThuLnQoJ25vRmlsZUNob3NlbicpXG5cbiAgICAkYnV0dG9uLmFwcGVuZENoaWxkKCRzdGF0dXMpXG5cbiAgICBjb25zdCBjb21tYVNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgICBjb21tYVNwYW4uY2xhc3NOYW1lID0gJ2dvdnVrLXZpc3VhbGx5LWhpZGRlbidcbiAgICBjb21tYVNwYW4uaW5uZXJUZXh0ID0gJywgJ1xuICAgIGNvbW1hU3Bhbi5pZCA9IGAke3RoaXMuaWR9LWNvbW1hYFxuXG4gICAgJGJ1dHRvbi5hcHBlbmRDaGlsZChjb21tYVNwYW4pXG5cbiAgICBjb25zdCBjb250YWluZXJTcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXG4gICAgY29udGFpbmVyU3Bhbi5jbGFzc05hbWUgPVxuICAgICAgJ2dvdnVrLWZpbGUtdXBsb2FkLWJ1dHRvbl9fcHNldWRvLWJ1dHRvbi1jb250YWluZXInXG5cbiAgICBjb25zdCBidXR0b25TcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXG4gICAgYnV0dG9uU3Bhbi5jbGFzc05hbWUgPVxuICAgICAgJ2dvdnVrLWJ1dHRvbiBnb3Z1ay1idXR0b24tLXNlY29uZGFyeSBnb3Z1ay1maWxlLXVwbG9hZC1idXR0b25fX3BzZXVkby1idXR0b24nXG4gICAgYnV0dG9uU3Bhbi5pbm5lclRleHQgPSB0aGlzLmkxOG4udCgnY2hvb3NlRmlsZXNCdXR0b24nKVxuXG4gICAgY29udGFpbmVyU3Bhbi5hcHBlbmRDaGlsZChidXR0b25TcGFuKVxuXG4gICAgLy8gQWRkIGEgc3BhY2Ugc28gdGhlIGJ1dHRvbiBhbmQgaW5zdHJ1Y3Rpb24gcmVhZCBjb3JyZWN0bHlcbiAgICAvLyB3aGVuIENTUyBpcyBkaXNhYmxlZFxuICAgIGNvbnRhaW5lclNwYW4uaW5zZXJ0QWRqYWNlbnRUZXh0KCdiZWZvcmVlbmQnLCAnICcpXG5cbiAgICBjb25zdCBpbnN0cnVjdGlvblNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgICBpbnN0cnVjdGlvblNwYW4uY2xhc3NOYW1lID1cbiAgICAgICdnb3Z1ay1ib2R5IGdvdnVrLWZpbGUtdXBsb2FkLWJ1dHRvbl9faW5zdHJ1Y3Rpb24nXG4gICAgaW5zdHJ1Y3Rpb25TcGFuLmlubmVyVGV4dCA9IHRoaXMuaTE4bi50KCdkcm9wSW5zdHJ1Y3Rpb24nKVxuXG4gICAgY29udGFpbmVyU3Bhbi5hcHBlbmRDaGlsZChpbnN0cnVjdGlvblNwYW4pXG5cbiAgICAkYnV0dG9uLmFwcGVuZENoaWxkKGNvbnRhaW5lclNwYW4pXG4gICAgJGJ1dHRvbi5zZXRBdHRyaWJ1dGUoXG4gICAgICAnYXJpYS1sYWJlbGxlZGJ5JyxcbiAgICAgIGAkeyRsYWJlbC5pZH0gJHtjb21tYVNwYW4uaWR9ICR7JGJ1dHRvbi5pZH1gXG4gICAgKVxuICAgICRidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLm9uQ2xpY2suYmluZCh0aGlzKSlcbiAgICAkYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdvdmVyJywgKGV2ZW50KSA9PiB7XG4gICAgICAvLyBwcmV2ZW50IGRlZmF1bHQgdG8gYWxsb3cgZHJvcFxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgIH0pXG5cbiAgICAvLyBBc3NlbWJsZSB0aGVzZSBhbGwgdG9nZXRoZXJcbiAgICB0aGlzLiRyb290Lmluc2VydEFkamFjZW50RWxlbWVudCgnYWZ0ZXJiZWdpbicsICRidXR0b24pXG5cbiAgICB0aGlzLiRpbnB1dC5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgJy0xJylcbiAgICB0aGlzLiRpbnB1dC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKVxuXG4gICAgLy8gTWFrZSBhbGwgdGhlc2UgbmV3IHZhcmlhYmxlcyBhdmFpbGFibGUgdG8gdGhlIG1vZHVsZVxuICAgIHRoaXMuJGJ1dHRvbiA9ICRidXR0b25cbiAgICB0aGlzLiRzdGF0dXMgPSAkc3RhdHVzXG5cbiAgICAvLyBCaW5kIGNoYW5nZSBldmVudCB0byB0aGUgdW5kZXJseWluZyBpbnB1dFxuICAgIHRoaXMuJGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIHRoaXMub25DaGFuZ2UuYmluZCh0aGlzKSlcblxuICAgIC8vIFN5bmNocm9uaXNlIHRoZSBgZGlzYWJsZWRgIHN0YXRlIGJldHdlZW4gdGhlIGJ1dHRvbiBhbmQgdW5kZXJseWluZyBpbnB1dFxuICAgIHRoaXMudXBkYXRlRGlzYWJsZWRTdGF0ZSgpXG4gICAgdGhpcy5vYnNlcnZlRGlzYWJsZWRTdGF0ZSgpXG5cbiAgICAvLyBIYW5kbGUgZHJvcCB6b25lIHZpc2liaWxpdHlcbiAgICAvLyBBIGxpdmUgcmVnaW9uIHRvIGFubm91bmNlIHdoZW4gdXNlcnMgZW50ZXIgb3IgbGVhdmUgdGhlIGRyb3Agem9uZVxuICAgIHRoaXMuJGFubm91bmNlbWVudHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgICB0aGlzLiRhbm5vdW5jZW1lbnRzLmNsYXNzTGlzdC5hZGQoJ2dvdnVrLWZpbGUtdXBsb2FkLWFubm91bmNlbWVudHMnKVxuICAgIHRoaXMuJGFubm91bmNlbWVudHMuY2xhc3NMaXN0LmFkZCgnZ292dWstdmlzdWFsbHktaGlkZGVuJylcbiAgICB0aGlzLiRhbm5vdW5jZW1lbnRzLnNldEF0dHJpYnV0ZSgnYXJpYS1saXZlJywgJ2Fzc2VydGl2ZScpXG4gICAgdGhpcy4kcm9vdC5pbnNlcnRBZGphY2VudEVsZW1lbnQoJ2FmdGVyZW5kJywgdGhpcy4kYW5ub3VuY2VtZW50cylcblxuICAgIC8vIGlmIHRoZXJlIGlzIG5vIENTUyBhbmQgaW5wdXQgaXMgaGlkZGVuXG4gICAgLy8gYnV0dG9uIHdpbGwgbmVlZCB0byBoYW5kbGUgZHJvcCBldmVudFxuICAgIHRoaXMuJGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdkcm9wJywgdGhpcy5vbkRyb3AuYmluZCh0aGlzKSlcblxuICAgIC8vIFdoaWxlIHVzZXIgaXMgZHJhZ2dpbmcsIGl0IGdldHMgYSBsaXR0bGUgbW9yZSBjb21wbGV4IGJlY2F1c2Ugb2YgU2FmYXJpLlxuICAgIC8vIFNhZmFyaSBkb2Vzbid0IGZpbGwgYHJlbGF0ZWRUYXJnZXRgIG9uIGBkcmFnbGVhdmVgIChub3IgYGRyYWdlbnRlcmApLlxuICAgIC8vIFRoaXMgbWVhbnMgd2UgY2FuJ3QgdXNlIGByZWxhdGVkVGFyZ2V0YCB0bzpcbiAgICAvLyAtIGNoZWNrIGlmIHRoZSB1c2VyIGlzIHN0aWxsIHdpdGhpbiB0aGUgd3JhcHBlclxuICAgIC8vICAgKGByZWxhdGVkVGFyZ2V0YCBiZWluZyBhIGRlc2NlbmRhbnQgb2YgdGhlIHdyYXBwZXIpXG4gICAgLy8gLSBjaGVjayBpZiB0aGUgdXNlciBpcyBzdGlsbCBvdmVyIHRoZSB2aWV3cG9ydFxuICAgIC8vICAgKGByZWxhdGVkVGFyZ2V0YCBiZWluZyBudWxsIGlmIG91dHNpZGUpXG5cbiAgICAvLyBUaGFua3MgdG8gYGRyYWdlbnRlcmAgYnViYmxpbmcsIHdlIGNhbiBsaXN0ZW4gb24gdGhlIGBkb2N1bWVudGAgd2l0aCBhXG4gICAgLy8gc2luZ2xlIGZ1bmN0aW9uIGFuZCB1cGRhdGUgdGhlIHZpc2liaWxpdHkgYmFzZWQgb24gd2hldGhlciB3ZSBlbnRlcmVkIGFcbiAgICAvLyBub2RlIGluc2lkZSBvciBvdXRzaWRlIHRoZSB3cmFwcGVyLlxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAnZHJhZ2VudGVyJyxcbiAgICAgIHRoaXMudXBkYXRlRHJvcHpvbmVWaXNpYmlsaXR5LmJpbmQodGhpcylcbiAgICApXG5cbiAgICAvLyBUbyBkZXRlY3QgaWYgd2UncmUgb3V0c2lkZSB0aGUgZG9jdW1lbnQsIHdlIGNhbiB0cmFjayBpZiB0aGVyZSB3YXMgYVxuICAgIC8vIGBkcmFnZW50ZXJgIGV2ZW50IHByZWNlZGluZyBhIGBkcmFnbGVhdmVgLiBJZiB0aGVyZSB3YXNuJ3QsIHRoaXMgbWVhbnNcbiAgICAvLyB3ZSdyZSBvdXRzaWRlIHRoZSBkb2N1bWVudC5cbiAgICAvL1xuICAgIC8vIFRoZSBvcmRlciBvZiBldmVudHMgaXMgZ3VhcmFudGVlZCBieSB0aGUgSFRNTCBzcGVjczpcbiAgICAvLyBodHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS9kbmQuaHRtbCNkcmFnLWFuZC1kcm9wLXByb2Nlc3NpbmctbW9kZWxcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdkcmFnZW50ZXInLCAoKSA9PiB7XG4gICAgICB0aGlzLmVudGVyZWRBbm90aGVyRWxlbWVudCA9IHRydWVcbiAgICB9KVxuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ2xlYXZlJywgKCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLmVudGVyZWRBbm90aGVyRWxlbWVudCAmJiAhdGhpcy4kYnV0dG9uLmRpc2FibGVkKSB7XG4gICAgICAgIHRoaXMuaGlkZURyYWdnaW5nU3RhdGUoKVxuICAgICAgICB0aGlzLiRhbm5vdW5jZW1lbnRzLmlubmVyVGV4dCA9IHRoaXMuaTE4bi50KCdsZWZ0RHJvcFpvbmUnKVxuICAgICAgfVxuXG4gICAgICB0aGlzLmVudGVyZWRBbm90aGVyRWxlbWVudCA9IGZhbHNlXG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSB2aXNpYmlsaXR5IG9mIHRoZSBkcm9wem9uZSBhcyB1c2VycyBlbnRlcnMgdGhlIHZhcmlvdXMgZWxlbWVudHMgb24gdGhlIHBhZ2VcbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtEcmFnRXZlbnR9IGV2ZW50IC0gVGhlIGBkcmFnZW50ZXJgIGV2ZW50XG4gICAqL1xuICB1cGRhdGVEcm9wem9uZVZpc2liaWxpdHkoZXZlbnQpIHtcbiAgICBpZiAodGhpcy4kYnV0dG9uLmRpc2FibGVkKSByZXR1cm5cblxuICAgIC8vIERPTSBpbnRlcmZhY2VzIG9ubHkgdHlwZSBgZXZlbnQudGFyZ2V0YCBhcyBgRXZlbnRUYXJnZXRgXG4gICAgLy8gc28gd2UgZmlyc3QgbmVlZCB0byBtYWtlIHN1cmUgaXQncyBhIGBOb2RlYFxuICAgIGlmIChldmVudC50YXJnZXQgaW5zdGFuY2VvZiBOb2RlKSB7XG4gICAgICBpZiAodGhpcy4kcm9vdC5jb250YWlucyhldmVudC50YXJnZXQpKSB7XG4gICAgICAgIGlmIChldmVudC5kYXRhVHJhbnNmZXIgJiYgaXNDb250YWluaW5nRmlsZXMoZXZlbnQuZGF0YVRyYW5zZmVyKSkge1xuICAgICAgICAgIC8vIE9ubHkgdXBkYXRlIHRoZSBjbGFzcyBhbmQgbWFrZSB0aGUgYW5ub3VuY2VtZW50IGlmIG5vdCBhbHJlYWR5IHZpc2libGVcbiAgICAgICAgICAvLyB0byBhdm9pZCByZXBlYXRlZCBhbm5vdW5jZW1lbnRzIG9uIE5WREEgKDIwMjQuNCkgKyBGaXJlZm94ICgxMzMpXG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgIXRoaXMuJGJ1dHRvbi5jbGFzc0xpc3QuY29udGFpbnMoXG4gICAgICAgICAgICAgICdnb3Z1ay1maWxlLXVwbG9hZC1idXR0b24tLWRyYWdnaW5nJ1xuICAgICAgICAgICAgKVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgdGhpcy5zaG93RHJhZ2dpbmdTdGF0ZSgpXG4gICAgICAgICAgICB0aGlzLiRhbm5vdW5jZW1lbnRzLmlubmVyVGV4dCA9IHRoaXMuaTE4bi50KCdlbnRlcmVkRHJvcFpvbmUnKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gT25seSBoaWRlIHRoZSBkcm9wem9uZSBpZiBpdCBpcyB2aXNpYmxlIHRvIHByZXZlbnQgYW5ub3VuY2luZyB1c2VyXG4gICAgICAgIC8vIGxlZnQgdGhlIGRyb3Agem9uZSB3aGVuIHRoZXkgZW50ZXIgdGhlIHBhZ2UgYnV0IGhhdmVuJ3QgcmVhY2hlZCB5ZXRcbiAgICAgICAgLy8gdGhlIGZpbGUgdXBsb2FkIGNvbXBvbmVudFxuICAgICAgICBpZiAoXG4gICAgICAgICAgdGhpcy4kYnV0dG9uLmNsYXNzTGlzdC5jb250YWlucygnZ292dWstZmlsZS11cGxvYWQtYnV0dG9uLS1kcmFnZ2luZycpXG4gICAgICAgICkge1xuICAgICAgICAgIHRoaXMuaGlkZURyYWdnaW5nU3RhdGUoKVxuICAgICAgICAgIHRoaXMuJGFubm91bmNlbWVudHMuaW5uZXJUZXh0ID0gdGhpcy5pMThuLnQoJ2xlZnREcm9wWm9uZScpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2hvdyB0aGUgZHJvcCB6b25lIHZpc3VhbGx5XG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzaG93RHJhZ2dpbmdTdGF0ZSgpIHtcbiAgICB0aGlzLiRidXR0b24uY2xhc3NMaXN0LmFkZCgnZ292dWstZmlsZS11cGxvYWQtYnV0dG9uLS1kcmFnZ2luZycpXG4gIH1cblxuICAvKipcbiAgICogSGlkZXMgdGhlIGRyb3Agem9uZSB2aXN1YWxseVxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgaGlkZURyYWdnaW5nU3RhdGUoKSB7XG4gICAgdGhpcy4kYnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ2dvdnVrLWZpbGUtdXBsb2FkLWJ1dHRvbi0tZHJhZ2dpbmcnKVxuICB9XG5cbiAgLyoqXG4gICAqIEhhbmRsZXMgdXNlciBkcm9wcGluZyBvbiB0aGUgY29tcG9uZW50XG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7RHJhZ0V2ZW50fSBldmVudCAtIFRoZSBgZHJhZ2VudGVyYCBldmVudFxuICAgKi9cbiAgb25Ecm9wKGV2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuXG4gICAgaWYgKGV2ZW50LmRhdGFUcmFuc2ZlciAmJiBpc0NvbnRhaW5pbmdGaWxlcyhldmVudC5kYXRhVHJhbnNmZXIpKSB7XG4gICAgICB0aGlzLiRpbnB1dC5maWxlcyA9IGV2ZW50LmRhdGFUcmFuc2Zlci5maWxlc1xuXG4gICAgICAvLyBEaXNwYXRjaCBhIGBjaGFuZ2VgIGV2ZW50IHNvIGV4dGVybmFsIGNvZGUgdGhhdCB3b3VsZCByZWx5IG9uIHRoZSBgPGlucHV0PmBcbiAgICAgIC8vIGRpc3BhdGNoaW5nIGFuIGV2ZW50IHdoZW4gZmlsZXMgYXJlIGRyb3BwZWQgc3RpbGwgd29yay5cbiAgICAgIC8vIFVzZSBhIGBDdXN0b21FdmVudGAgc28gb3VyIGV2ZW50cyBhcmUgZGlzdGluZ3Vpc2hhYmxlIGZyb20gYnJvd3NlcidzIG5hdGl2ZSBldmVudHNcbiAgICAgIHRoaXMuJGlucHV0LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdjaGFuZ2UnKSlcblxuICAgICAgdGhpcy5oaWRlRHJhZ2dpbmdTdGF0ZSgpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSB2YWx1ZSBvZiB0aGUgdW5kZXJseWluZyBpbnB1dCBoYXMgY2hhbmdlZFxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgb25DaGFuZ2UoKSB7XG4gICAgY29uc3QgZmlsZUNvdW50ID0gdGhpcy4kaW5wdXQuZmlsZXMubGVuZ3RoXG5cbiAgICBpZiAoZmlsZUNvdW50ID09PSAwKSB7XG4gICAgICAvLyBJZiB0aGVyZSBhcmUgbm8gZmlsZXMsIHNob3cgdGhlIGRlZmF1bHQgc2VsZWN0aW9uIHRleHRcbiAgICAgIHRoaXMuJHN0YXR1cy5pbm5lclRleHQgPSB0aGlzLmkxOG4udCgnbm9GaWxlQ2hvc2VuJylcbiAgICAgIHRoaXMuJGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdnb3Z1ay1maWxlLXVwbG9hZC1idXR0b24tLWVtcHR5JylcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKFxuICAgICAgICAvLyBJZiB0aGVyZSBpcyAxIGZpbGUsIGp1c3Qgc2hvdyB0aGUgZmlsZSBuYW1lXG4gICAgICAgIGZpbGVDb3VudCA9PT0gMVxuICAgICAgKSB7XG4gICAgICAgIHRoaXMuJHN0YXR1cy5pbm5lclRleHQgPSB0aGlzLiRpbnB1dC5maWxlc1swXS5uYW1lXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBPdGhlcndpc2UsIHRlbGwgdGhlIHVzZXIgaG93IG1hbnkgZmlsZXMgYXJlIHNlbGVjdGVkXG4gICAgICAgIHRoaXMuJHN0YXR1cy5pbm5lclRleHQgPSB0aGlzLmkxOG4udCgnbXVsdGlwbGVGaWxlc0Nob3NlbicsIHtcbiAgICAgICAgICBjb3VudDogZmlsZUNvdW50XG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIHRoaXMuJGJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdnb3Z1ay1maWxlLXVwbG9hZC1idXR0b24tLWVtcHR5JylcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogTG9va3MgdXAgdGhlIGA8bGFiZWw+YCBlbGVtZW50IGFzc29jaWF0ZWQgdG8gdGhlIGZpZWxkXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEByZXR1cm5zIHtIVE1MRWxlbWVudH0gVGhlIGA8bGFiZWw+YCBlbGVtZW50IGFzc29jaWF0ZWQgdG8gdGhlIGZpZWxkXG4gICAqIEB0aHJvd3Mge0VsZW1lbnRFcnJvcn0gSWYgdGhlIGA8bGFiZWw+YCBjYW5ub3QgYmUgZm91bmRcbiAgICovXG4gIGZpbmRMYWJlbCgpIHtcbiAgICAvLyBVc2UgYGxhYmVsYCBpbiB0aGUgc2VsZWN0b3Igc28gVHlwZVNjcmlwdCBrbm93cyB0aGUgdHlwZSBmbyBgSFRNTEVsZW1lbnRgXG4gICAgY29uc3QgJGxhYmVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgbGFiZWxbZm9yPVwiJHt0aGlzLiRpbnB1dC5pZH1cIl1gKVxuXG4gICAgaWYgKCEkbGFiZWwpIHtcbiAgICAgIHRocm93IG5ldyBFbGVtZW50RXJyb3Ioe1xuICAgICAgICBjb21wb25lbnQ6IEZpbGVVcGxvYWQsXG4gICAgICAgIGlkZW50aWZpZXI6IGBGaWVsZCBsYWJlbCAoXFxgPGxhYmVsIGZvcj0ke3RoaXMuJGlucHV0LmlkfT5cXGApYFxuICAgICAgfSlcbiAgICB9XG5cbiAgICByZXR1cm4gJGxhYmVsXG4gIH1cblxuICAvKipcbiAgICogV2hlbiB0aGUgYnV0dG9uIGlzIGNsaWNrZWQsIGVtdWxhdGUgY2xpY2tpbmcgdGhlIGFjdHVhbCwgaGlkZGVuIGZpbGUgaW5wdXRcbiAgICpcbiAgICogQHByaXZhdGVcbiAgICovXG4gIG9uQ2xpY2soKSB7XG4gICAgdGhpcy4kaW5wdXQuY2xpY2soKVxuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIG11dGF0aW9uIG9ic2VydmVyIHRvIGNoZWNrIGlmIHRoZSBpbnB1dCdzIGF0dHJpYnV0ZXMgYWx0ZXJlZC5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICovXG4gIG9ic2VydmVEaXNhYmxlZFN0YXRlKCkge1xuICAgIGNvbnN0IG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKG11dGF0aW9uTGlzdCkgPT4ge1xuICAgICAgZm9yIChjb25zdCBtdXRhdGlvbiBvZiBtdXRhdGlvbkxpc3QpIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIG11dGF0aW9uLnR5cGUgPT09ICdhdHRyaWJ1dGVzJyAmJlxuICAgICAgICAgIG11dGF0aW9uLmF0dHJpYnV0ZU5hbWUgPT09ICdkaXNhYmxlZCdcbiAgICAgICAgKSB7XG4gICAgICAgICAgdGhpcy51cGRhdGVEaXNhYmxlZFN0YXRlKClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBvYnNlcnZlci5vYnNlcnZlKHRoaXMuJGlucHV0LCB7XG4gICAgICBhdHRyaWJ1dGVzOiB0cnVlXG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBTeW5jaHJvbmlzZSB0aGUgYGRpc2FibGVkYCBzdGF0ZSBiZXR3ZWVuIHRoZSBpbnB1dCBhbmQgcmVwbGFjZW1lbnQgYnV0dG9uLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgdXBkYXRlRGlzYWJsZWRTdGF0ZSgpIHtcbiAgICB0aGlzLiRidXR0b24uZGlzYWJsZWQgPSB0aGlzLiRpbnB1dC5kaXNhYmxlZFxuXG4gICAgdGhpcy4kcm9vdC5jbGFzc0xpc3QudG9nZ2xlKFxuICAgICAgJ2dvdnVrLWRyb3Atem9uZS0tZGlzYWJsZWQnLFxuICAgICAgdGhpcy4kYnV0dG9uLmRpc2FibGVkXG4gICAgKVxuICB9XG5cbiAgLyoqXG4gICAqIE5hbWUgZm9yIHRoZSBjb21wb25lbnQgdXNlZCB3aGVuIGluaXRpYWxpc2luZyB1c2luZyBkYXRhLW1vZHVsZSBhdHRyaWJ1dGVzLlxuICAgKi9cbiAgc3RhdGljIG1vZHVsZU5hbWUgPSAnZ292dWstZmlsZS11cGxvYWQnXG5cbiAgLyoqXG4gICAqIEZpbGUgdXBsb2FkIGRlZmF1bHQgY29uZmlnXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIEZpbGVVcGxvYWRDb25maWd9XG4gICAqIEBjb25zdGFudFxuICAgKiBAdHlwZSB7RmlsZVVwbG9hZENvbmZpZ31cbiAgICovXG4gIHN0YXRpYyBkZWZhdWx0cyA9IE9iamVjdC5mcmVlemUoe1xuICAgIGkxOG46IHtcbiAgICAgIGNob29zZUZpbGVzQnV0dG9uOiAnQ2hvb3NlIGZpbGUnLFxuICAgICAgZHJvcEluc3RydWN0aW9uOiAnb3IgZHJvcCBmaWxlJyxcbiAgICAgIG5vRmlsZUNob3NlbjogJ05vIGZpbGUgY2hvc2VuJyxcbiAgICAgIG11bHRpcGxlRmlsZXNDaG9zZW46IHtcbiAgICAgICAgLy8gdGhlICdvbmUnIHN0cmluZyBpc24ndCB1c2VkIGFzIHRoZSBjb21wb25lbnQgZGlzcGxheXMgdGhlIGZpbGVuYW1lXG4gICAgICAgIC8vIGluc3RlYWQsIGhvd2V2ZXIgaXQncyBoZXJlIGZvciBjb3ZlcmFnZSdzIHNha2VcbiAgICAgICAgb25lOiAnJXtjb3VudH0gZmlsZSBjaG9zZW4nLFxuICAgICAgICBvdGhlcjogJyV7Y291bnR9IGZpbGVzIGNob3NlbidcbiAgICAgIH0sXG4gICAgICBlbnRlcmVkRHJvcFpvbmU6ICdFbnRlcmVkIGRyb3Agem9uZScsXG4gICAgICBsZWZ0RHJvcFpvbmU6ICdMZWZ0IGRyb3Agem9uZSdcbiAgICB9XG4gIH0pXG5cbiAgLyoqXG4gICAqIEZpbGUgdXBsb2FkIGNvbmZpZyBzY2hlbWFcbiAgICpcbiAgICogQGNvbnN0YW50XG4gICAqIEBzYXRpc2ZpZXMge1NjaGVtYTxGaWxlVXBsb2FkQ29uZmlnPn1cbiAgICovXG4gIHN0YXRpYyBzY2hlbWEgPSBPYmplY3QuZnJlZXplKHtcbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICBpMThuOiB7IHR5cGU6ICdvYmplY3QnIH1cbiAgICB9XG4gIH0pXG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIHRoZSBnaXZlbiBgRGF0YVRyYW5zZmVyYCBjb250YWlucyBmaWxlc1xuICpcbiAqIEBpbnRlcm5hbFxuICogQHBhcmFtIHtEYXRhVHJhbnNmZXJ9IGRhdGFUcmFuc2ZlciAtIFRoZSBgRGF0YVRyYW5zZmVyYCB0byBjaGVja1xuICogQHJldHVybnMge2Jvb2xlYW59IC0gYHRydWVgIGlmIGl0IGNvbnRhaW5zIGZpbGVzIG9yIHdlIGNhbid0IGluZmVyIGl0LCBgZmFsc2VgIG90aGVyd2lzZVxuICovXG5mdW5jdGlvbiBpc0NvbnRhaW5pbmdGaWxlcyhkYXRhVHJhbnNmZXIpIHtcbiAgLy8gU2FmYXJpIHNvbWV0aW1lcyBkb2VzIG5vdCBwcm92aWRlIGluZm8gYWJvdXQgdHlwZXMgOicoXG4gIC8vIEluIHdoaWNoIGNhc2UgYmVzdCBub3QgdG8gYXNzdW1lIGFueXRoaW5nIGFuZCB0cnkgdG8gc2V0IHRoZSBmaWxlc1xuICBjb25zdCBoYXNOb1R5cGVzSW5mbyA9IGRhdGFUcmFuc2Zlci50eXBlcy5sZW5ndGggPT09IDBcblxuICAvLyBXaGVuIGRyYWdnaW5nIGltYWdlcywgdGhlcmUncyBhIG1peCBvZiBtaW1lIHR5cGVzICsgRmlsZXNcbiAgLy8gd2hpY2ggd2UgY2FuJ3QgYXNzaWduIHRvIHRoZSBuYXRpdmUgaW5wdXRcbiAgY29uc3QgaXNEcmFnZ2luZ0ZpbGVzID0gZGF0YVRyYW5zZmVyLnR5cGVzLnNvbWUoKHR5cGUpID0+IHR5cGUgPT09ICdGaWxlcycpXG5cbiAgcmV0dXJuIGhhc05vVHlwZXNJbmZvIHx8IGlzRHJhZ2dpbmdGaWxlc1xufVxuXG4vKipcbiAqIEB0eXBlZGVmIHtIVE1MSW5wdXRFbGVtZW50ICYge2ZpbGVzOiBGaWxlTGlzdH19IEhUTUxGaWxlSW5wdXRFbGVtZW50XG4gKi9cblxuLyoqXG4gKiBGaWxlIHVwbG9hZCBjb25maWdcbiAqXG4gKiBAc2VlIHtAbGluayBGaWxlVXBsb2FkLmRlZmF1bHRzfVxuICogQHR5cGVkZWYge29iamVjdH0gRmlsZVVwbG9hZENvbmZpZ1xuICogQHByb3BlcnR5IHtGaWxlVXBsb2FkVHJhbnNsYXRpb25zfSBbaTE4bj1GaWxlVXBsb2FkLmRlZmF1bHRzLmkxOG5dIC0gRmlsZSB1cGxvYWQgdHJhbnNsYXRpb25zXG4gKi9cblxuLyoqXG4gKiBGaWxlIHVwbG9hZCB0cmFuc2xhdGlvbnNcbiAqXG4gKiBAc2VlIHtAbGluayBGaWxlVXBsb2FkLmRlZmF1bHRzLmkxOG59XG4gKiBAdHlwZWRlZiB7b2JqZWN0fSBGaWxlVXBsb2FkVHJhbnNsYXRpb25zXG4gKlxuICogTWVzc2FnZXMgdXNlZCBieSB0aGUgY29tcG9uZW50XG4gKiBAcHJvcGVydHkge3N0cmluZ30gW2Nob29zZUZpbGVdIC0gVGhlIHRleHQgb2YgdGhlIGJ1dHRvbiB0aGF0IG9wZW5zIHRoZSBmaWxlIHBpY2tlclxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtkcm9wSW5zdHJ1Y3Rpb25dIC0gVGhlIHRleHQgaW5mb3JtaW5nIHVzZXJzIHRoZXkgY2FuIGRyb3AgZmlsZXNcbiAqIEBwcm9wZXJ0eSB7VHJhbnNsYXRpb25QbHVyYWxGb3Jtc30gW211bHRpcGxlRmlsZXNDaG9zZW5dIC0gVGhlIHRleHQgZGlzcGxheWVkIHdoZW4gbXVsdGlwbGUgZmlsZXNcbiAqICAgaGF2ZSBiZWVuIGNob3NlbiBieSB0aGUgdXNlclxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtub0ZpbGVDaG9zZW5dIC0gVGhlIHRleHQgdG8gZGlzcGxheWVkIHdoZW4gbm8gZmlsZSBoYXMgYmVlbiBjaG9zZW4gYnkgdGhlIHVzZXJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbZW50ZXJlZERyb3Bab25lXSAtIFRoZSB0ZXh0IGFubm91bmNlZCBieSBhc3Npc3RpdmUgdGVjaG5vbG9neVxuICogICB3aGVuIHVzZXIgZHJhZ3MgZmlsZXMgYW5kIGVudGVycyB0aGUgZHJvcCB6b25lXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW2xlZnREcm9wWm9uZV0gLSBUaGUgdGV4dCBhbm5vdW5jZWQgYnkgYXNzaXN0aXZlIHRlY2hub2xvZ3lcbiAqICAgd2hlbiB1c2VyIGRyYWdzIGZpbGVzIGFuZCBsZWF2ZXMgdGhlIGRyb3Agem9uZSB3aXRob3V0IGRyb3BwaW5nXG4gKi9cblxuLyoqXG4gKiBAaW1wb3J0IHsgU2NoZW1hIH0gZnJvbSAnLi4vLi4vY29tbW9uL2NvbmZpZ3VyYXRpb24ubWpzJ1xuICogQGltcG9ydCB7IFRyYW5zbGF0aW9uUGx1cmFsRm9ybXMgfSBmcm9tICcuLi8uLi9pMThuLm1qcydcbiAqL1xuIiwiaW1wb3J0IHsgZ2V0QnJlYWtwb2ludCB9IGZyb20gJy4uLy4uL2NvbW1vbi9pbmRleC5tanMnXG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICcuLi8uLi9jb21wb25lbnQubWpzJ1xuaW1wb3J0IHsgRWxlbWVudEVycm9yIH0gZnJvbSAnLi4vLi4vZXJyb3JzL2luZGV4Lm1qcydcblxuLyoqXG4gKiBIZWFkZXIgY29tcG9uZW50XG4gKlxuICogQHByZXNlcnZlXG4gKi9cbmV4cG9ydCBjbGFzcyBIZWFkZXIgZXh0ZW5kcyBDb21wb25lbnQge1xuICAvKiogQHByaXZhdGUgKi9cbiAgJG1lbnVCdXR0b25cblxuICAvKiogQHByaXZhdGUgKi9cbiAgJG1lbnVcblxuICAvKipcbiAgICogU2F2ZSB0aGUgb3BlbmVkL2Nsb3NlZCBzdGF0ZSBmb3IgdGhlIG5hdiBpbiBtZW1vcnkgc28gdGhhdCB3ZSBjYW5cbiAgICogYWNjdXJhdGVseSBtYWludGFpbiBzdGF0ZSB3aGVuIHRoZSBzY3JlZW4gaXMgY2hhbmdlZCBmcm9tIHNtYWxsIHRvIGJpZyBhbmRcbiAgICogYmFjayB0byBzbWFsbFxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgbWVudUlzT3BlbiA9IGZhbHNlXG5cbiAgLyoqXG4gICAqIEEgZ2xvYmFsIGNvbnN0IGZvciBzdG9yaW5nIGEgbWF0Y2hNZWRpYSBpbnN0YW5jZSB3aGljaCB3ZSdsbCB1c2UgdG8gZGV0ZWN0XG4gICAqIHdoZW4gYSBzY3JlZW4gc2l6ZSBjaGFuZ2UgaGFwcGVucy4gV2UgcmVseSBvbiBpdCBiZWluZyBudWxsIGlmIHRoZSBmZWF0dXJlXG4gICAqIGlzbid0IGF2YWlsYWJsZSB0byBpbml0aWFsbHkgYXBwbHkgaGlkZGVuIGF0dHJpYnV0ZXNcbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHR5cGUge01lZGlhUXVlcnlMaXN0IHwgbnVsbH1cbiAgICovXG4gIG1xbCA9IG51bGxcblxuICAvKipcbiAgICogQXBwbHkgYSBtYXRjaE1lZGlhIGZvciBkZXNrdG9wIHdoaWNoIHdpbGwgdHJpZ2dlciBhIHN0YXRlIHN5bmMgaWYgdGhlXG4gICAqIGJyb3dzZXIgdmlld3BvcnQgbW92ZXMgYmV0d2VlbiBzdGF0ZXMuXG4gICAqXG4gICAqIEBwYXJhbSB7RWxlbWVudCB8IG51bGx9ICRyb290IC0gSFRNTCBlbGVtZW50IHRvIHVzZSBmb3IgaGVhZGVyXG4gICAqL1xuICBjb25zdHJ1Y3Rvcigkcm9vdCkge1xuICAgIHN1cGVyKCRyb290KVxuXG4gICAgY29uc3QgJG1lbnVCdXR0b24gPSB0aGlzLiRyb290LnF1ZXJ5U2VsZWN0b3IoJy5nb3Z1ay1qcy1oZWFkZXItdG9nZ2xlJylcblxuICAgIC8vIEhlYWRlcnMgZG9uJ3QgbmVjZXNzYXJpbHkgaGF2ZSBhIG5hdmlnYXRpb24uIFdoZW4gdGhleSBkb24ndCwgdGhlIG1lbnVcbiAgICAvLyB0b2dnbGUgd29uJ3QgYmUgcmVuZGVyZWQgYnkgb3VyIG1hY3JvIChvciBtYXkgYmUgb21pdHRlZCB3aGVuIHdyaXRpbmdcbiAgICAvLyBwbGFpbiBIVE1MKVxuICAgIGlmICghJG1lbnVCdXR0b24pIHtcbiAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgLy8gUGFkIHRoZSBoZWFkZXIgbG9nbyBzbyBpdCBkb2Vzbid0IG92ZXJsYXAgdGhlIG1lbnUgYnV0dG9uXG4gICAgdGhpcy4kcm9vdC5jbGFzc0xpc3QuYWRkKCdnb3Z1ay1oZWFkZXItLXdpdGgtanMtbmF2aWdhdGlvbicpXG5cbiAgICBjb25zdCBtZW51SWQgPSAkbWVudUJ1dHRvbi5nZXRBdHRyaWJ1dGUoJ2FyaWEtY29udHJvbHMnKVxuICAgIGlmICghbWVudUlkKSB7XG4gICAgICB0aHJvdyBuZXcgRWxlbWVudEVycm9yKHtcbiAgICAgICAgY29tcG9uZW50OiBIZWFkZXIsXG4gICAgICAgIGlkZW50aWZpZXI6XG4gICAgICAgICAgJ05hdmlnYXRpb24gYnV0dG9uIChgPGJ1dHRvbiBjbGFzcz1cImdvdnVrLWpzLWhlYWRlci10b2dnbGVcIj5gKSBhdHRyaWJ1dGUgKGBhcmlhLWNvbnRyb2xzYCknXG4gICAgICB9KVxuICAgIH1cblxuICAgIGNvbnN0ICRtZW51ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQobWVudUlkKVxuICAgIGlmICghJG1lbnUpIHtcbiAgICAgIHRocm93IG5ldyBFbGVtZW50RXJyb3Ioe1xuICAgICAgICBjb21wb25lbnQ6IEhlYWRlcixcbiAgICAgICAgZWxlbWVudDogJG1lbnUsXG4gICAgICAgIGlkZW50aWZpZXI6IGBOYXZpZ2F0aW9uIChcXGA8dWwgaWQ9XCIke21lbnVJZH1cIj5cXGApYFxuICAgICAgfSlcbiAgICB9XG5cbiAgICB0aGlzLiRtZW51ID0gJG1lbnVcbiAgICB0aGlzLiRtZW51QnV0dG9uID0gJG1lbnVCdXR0b25cblxuICAgIHRoaXMuc2V0dXBSZXNwb25zaXZlQ2hlY2tzKClcblxuICAgIHRoaXMuJG1lbnVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PlxuICAgICAgdGhpcy5oYW5kbGVNZW51QnV0dG9uQ2xpY2soKVxuICAgIClcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR1cCB2aWV3cG9ydCByZXNpemUgY2hlY2tcbiAgICpcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHNldHVwUmVzcG9uc2l2ZUNoZWNrcygpIHtcbiAgICBjb25zdCBicmVha3BvaW50ID0gZ2V0QnJlYWtwb2ludCgnZGVza3RvcCcpXG5cbiAgICBpZiAoIWJyZWFrcG9pbnQudmFsdWUpIHtcbiAgICAgIHRocm93IG5ldyBFbGVtZW50RXJyb3Ioe1xuICAgICAgICBjb21wb25lbnQ6IEhlYWRlcixcbiAgICAgICAgaWRlbnRpZmllcjogYENTUyBjdXN0b20gcHJvcGVydHkgKFxcYCR7YnJlYWtwb2ludC5wcm9wZXJ0eX1cXGApIG9uIHBzZXVkby1jbGFzcyBcXGA6cm9vdFxcYGBcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgLy8gTWVkaWEgcXVlcnkgbGlzdCBmb3IgR09WLlVLIEZyb250ZW5kIGRlc2t0b3AgYnJlYWtwb2ludFxuICAgIHRoaXMubXFsID0gd2luZG93Lm1hdGNoTWVkaWEoYChtaW4td2lkdGg6ICR7YnJlYWtwb2ludC52YWx1ZX0pYClcblxuICAgIC8vIE1lZGlhUXVlcnlMaXN0LmFkZEV2ZW50TGlzdGVuZXIgaXNuJ3Qgc3VwcG9ydGVkIGJ5IFNhZmFyaSA8IDE0IHNvIHdlIG5lZWRcbiAgICAvLyB0byBiZSBhYmxlIHRvIGZhbGwgYmFjayB0byB0aGUgZGVwcmVjYXRlZCBNZWRpYVF1ZXJ5TGlzdC5hZGRMaXN0ZW5lclxuICAgIGlmICgnYWRkRXZlbnRMaXN0ZW5lcicgaW4gdGhpcy5tcWwpIHtcbiAgICAgIHRoaXMubXFsLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsICgpID0+IHRoaXMuY2hlY2tNb2RlKCkpXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEB0cy1leHBlY3QtZXJyb3IgUHJvcGVydHkgJ2FkZExpc3RlbmVyJyBkb2VzIG5vdCBleGlzdFxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby11bnNhZmUtY2FsbFxuICAgICAgdGhpcy5tcWwuYWRkTGlzdGVuZXIoKCkgPT4gdGhpcy5jaGVja01vZGUoKSlcbiAgICB9XG5cbiAgICB0aGlzLmNoZWNrTW9kZSgpXG4gIH1cblxuICAvKipcbiAgICogU3luYyBtZW51IHN0YXRlXG4gICAqXG4gICAqIFVzZXMgdGhlIGdsb2JhbCB2YXJpYWJsZSBtZW51SXNPcGVuIHRvIGNvcnJlY3RseSBzZXQgdGhlIGFjY2Vzc2libGUgYW5kXG4gICAqIHZpc3VhbCBzdGF0ZXMgb2YgdGhlIG1lbnUgYW5kIHRoZSBtZW51IGJ1dHRvbi5cbiAgICogQWRkaXRpb25hbGx5IHdpbGwgZm9yY2UgdGhlIG1lbnUgdG8gYmUgdmlzaWJsZSBhbmQgdGhlIG1lbnUgYnV0dG9uIHRvIGJlXG4gICAqIGhpZGRlbiBpZiB0aGUgbWF0Y2hNZWRpYSBpcyB0cmlnZ2VyZWQgdG8gZGVza3RvcC5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGNoZWNrTW9kZSgpIHtcbiAgICBpZiAoIXRoaXMubXFsIHx8ICF0aGlzLiRtZW51IHx8ICF0aGlzLiRtZW51QnV0dG9uKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBpZiAodGhpcy5tcWwubWF0Y2hlcykge1xuICAgICAgdGhpcy4kbWVudS5yZW1vdmVBdHRyaWJ1dGUoJ2hpZGRlbicpXG4gICAgICB0aGlzLiRtZW51QnV0dG9uLnNldEF0dHJpYnV0ZSgnaGlkZGVuJywgJycpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuJG1lbnVCdXR0b24ucmVtb3ZlQXR0cmlidXRlKCdoaWRkZW4nKVxuICAgICAgdGhpcy4kbWVudUJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCB0aGlzLm1lbnVJc09wZW4udG9TdHJpbmcoKSlcblxuICAgICAgaWYgKHRoaXMubWVudUlzT3Blbikge1xuICAgICAgICB0aGlzLiRtZW51LnJlbW92ZUF0dHJpYnV0ZSgnaGlkZGVuJylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuJG1lbnUuc2V0QXR0cmlidXRlKCdoaWRkZW4nLCAnJylcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSGFuZGxlIG1lbnUgYnV0dG9uIGNsaWNrXG4gICAqXG4gICAqIFdoZW4gdGhlIG1lbnUgYnV0dG9uIGlzIGNsaWNrZWQsIGNoYW5nZSB0aGUgdmlzaWJpbGl0eSBvZiB0aGUgbWVudSBhbmQgdGhlblxuICAgKiBzeW5jIHRoZSBhY2Nlc3NpYmlsaXR5IHN0YXRlIGFuZCBtZW51IGJ1dHRvbiBzdGF0ZVxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgaGFuZGxlTWVudUJ1dHRvbkNsaWNrKCkge1xuICAgIHRoaXMubWVudUlzT3BlbiA9ICF0aGlzLm1lbnVJc09wZW5cbiAgICB0aGlzLmNoZWNrTW9kZSgpXG4gIH1cblxuICAvKipcbiAgICogTmFtZSBmb3IgdGhlIGNvbXBvbmVudCB1c2VkIHdoZW4gaW5pdGlhbGlzaW5nIHVzaW5nIGRhdGEtbW9kdWxlIGF0dHJpYnV0ZXMuXG4gICAqL1xuICBzdGF0aWMgbW9kdWxlTmFtZSA9ICdnb3Z1ay1oZWFkZXInXG59XG4iLCJpbXBvcnQgeyBDb25maWd1cmFibGVDb21wb25lbnQgfSBmcm9tICcuLi8uLi9jb21tb24vY29uZmlndXJhdGlvbi5tanMnXG5pbXBvcnQgeyBzZXRGb2N1cyB9IGZyb20gJy4uLy4uL2NvbW1vbi9pbmRleC5tanMnXG5cbi8qKlxuICogTm90aWZpY2F0aW9uIEJhbm5lciBjb21wb25lbnRcbiAqXG4gKiBAcHJlc2VydmVcbiAqIEBhdWdtZW50cyBDb25maWd1cmFibGVDb21wb25lbnQ8Tm90aWZpY2F0aW9uQmFubmVyQ29uZmlnPlxuICovXG5leHBvcnQgY2xhc3MgTm90aWZpY2F0aW9uQmFubmVyIGV4dGVuZHMgQ29uZmlndXJhYmxlQ29tcG9uZW50IHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7RWxlbWVudCB8IG51bGx9ICRyb290IC0gSFRNTCBlbGVtZW50IHRvIHVzZSBmb3Igbm90aWZpY2F0aW9uIGJhbm5lclxuICAgKiBAcGFyYW0ge05vdGlmaWNhdGlvbkJhbm5lckNvbmZpZ30gW2NvbmZpZ10gLSBOb3RpZmljYXRpb24gYmFubmVyIGNvbmZpZ1xuICAgKi9cbiAgY29uc3RydWN0b3IoJHJvb3QsIGNvbmZpZyA9IHt9KSB7XG4gICAgc3VwZXIoJHJvb3QsIGNvbmZpZylcblxuICAgIC8qKlxuICAgICAqIEZvY3VzIHRoZSBub3RpZmljYXRpb24gYmFubmVyXG4gICAgICpcbiAgICAgKiBJZiBgcm9sZT1cImFsZXJ0XCJgIGlzIHNldCwgZm9jdXMgdGhlIGVsZW1lbnQgdG8gaGVscCBzb21lIGFzc2lzdGl2ZVxuICAgICAqIHRlY2hub2xvZ2llcyBwcmlvcml0aXNlIGFubm91bmNpbmcgaXQuXG4gICAgICpcbiAgICAgKiBZb3UgY2FuIHR1cm4gb2ZmIHRoZSBhdXRvLWZvY3VzIGZ1bmN0aW9uYWxpdHkgYnkgc2V0dGluZ1xuICAgICAqIGBkYXRhLWRpc2FibGUtYXV0by1mb2N1cz1cInRydWVcImAgaW4gdGhlIGNvbXBvbmVudCBIVE1MLiBZb3UgbWlnaHQgd2lzaCB0b1xuICAgICAqIGRvIHRoaXMgYmFzZWQgb24gdXNlciByZXNlYXJjaCBmaW5kaW5ncywgb3IgdG8gYXZvaWQgYSBjbGFzaCB3aXRoIGFub3RoZXJcbiAgICAgKiBlbGVtZW50IHdoaWNoIHNob3VsZCBiZSBmb2N1c2VkIHdoZW4gdGhlIHBhZ2UgbG9hZHMuXG4gICAgICovXG4gICAgaWYgKFxuICAgICAgdGhpcy4kcm9vdC5nZXRBdHRyaWJ1dGUoJ3JvbGUnKSA9PT0gJ2FsZXJ0JyAmJlxuICAgICAgIXRoaXMuY29uZmlnLmRpc2FibGVBdXRvRm9jdXNcbiAgICApIHtcbiAgICAgIHNldEZvY3VzKHRoaXMuJHJvb3QpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIE5hbWUgZm9yIHRoZSBjb21wb25lbnQgdXNlZCB3aGVuIGluaXRpYWxpc2luZyB1c2luZyBkYXRhLW1vZHVsZSBhdHRyaWJ1dGVzLlxuICAgKi9cbiAgc3RhdGljIG1vZHVsZU5hbWUgPSAnZ292dWstbm90aWZpY2F0aW9uLWJhbm5lcidcblxuICAvKipcbiAgICogTm90aWZpY2F0aW9uIGJhbm5lciBkZWZhdWx0IGNvbmZpZ1xuICAgKlxuICAgKiBAc2VlIHtAbGluayBOb3RpZmljYXRpb25CYW5uZXJDb25maWd9XG4gICAqIEBjb25zdGFudFxuICAgKiBAdHlwZSB7Tm90aWZpY2F0aW9uQmFubmVyQ29uZmlnfVxuICAgKi9cbiAgc3RhdGljIGRlZmF1bHRzID0gT2JqZWN0LmZyZWV6ZSh7XG4gICAgZGlzYWJsZUF1dG9Gb2N1czogZmFsc2VcbiAgfSlcblxuICAvKipcbiAgICogTm90aWZpY2F0aW9uIGJhbm5lciBjb25maWcgc2NoZW1hXG4gICAqXG4gICAqIEBjb25zdGFudFxuICAgKiBAc2F0aXNmaWVzIHtTY2hlbWE8Tm90aWZpY2F0aW9uQmFubmVyQ29uZmlnPn1cbiAgICovXG4gIHN0YXRpYyBzY2hlbWEgPSBPYmplY3QuZnJlZXplKHtcbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICBkaXNhYmxlQXV0b0ZvY3VzOiB7IHR5cGU6ICdib29sZWFuJyB9XG4gICAgfVxuICB9KVxufVxuXG4vKipcbiAqIE5vdGlmaWNhdGlvbiBiYW5uZXIgY29uZmlnXG4gKlxuICogQHR5cGVkZWYge29iamVjdH0gTm90aWZpY2F0aW9uQmFubmVyQ29uZmlnXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IFtkaXNhYmxlQXV0b0ZvY3VzPWZhbHNlXSAtIElmIHNldCB0byBgdHJ1ZWAgdGhlXG4gKiAgIG5vdGlmaWNhdGlvbiBiYW5uZXIgd2lsbCBub3QgYmUgZm9jdXNzZWQgd2hlbiB0aGUgcGFnZSBsb2Fkcy4gVGhpcyBvbmx5XG4gKiAgIGFwcGxpZXMgaWYgdGhlIGNvbXBvbmVudCBoYXMgYSBgcm9sZWAgb2YgYGFsZXJ0YCDigJMgaW4gb3RoZXIgY2FzZXMgdGhlXG4gKiAgIGNvbXBvbmVudCB3aWxsIG5vdCBiZSBmb2N1c2VkIG9uIHBhZ2UgbG9hZCwgcmVnYXJkbGVzcyBvZiB0aGlzIG9wdGlvbi5cbiAqL1xuXG4vKipcbiAqIEBpbXBvcnQgeyBTY2hlbWEgfSBmcm9tICcuLi8uLi9jb21tb24vY29uZmlndXJhdGlvbi5tanMnXG4gKi9cbiIsImltcG9ydCB7IGNsb3Nlc3RBdHRyaWJ1dGVWYWx1ZSB9IGZyb20gJy4uLy4uL2NvbW1vbi9jbG9zZXN0LWF0dHJpYnV0ZS12YWx1ZS5tanMnXG5pbXBvcnQgeyBDb25maWd1cmFibGVDb21wb25lbnQgfSBmcm9tICcuLi8uLi9jb21tb24vY29uZmlndXJhdGlvbi5tanMnXG5pbXBvcnQgeyBFbGVtZW50RXJyb3IgfSBmcm9tICcuLi8uLi9lcnJvcnMvaW5kZXgubWpzJ1xuaW1wb3J0IHsgSTE4biB9IGZyb20gJy4uLy4uL2kxOG4ubWpzJ1xuXG4vKipcbiAqIFBhc3N3b3JkIGlucHV0IGNvbXBvbmVudFxuICpcbiAqIEBwcmVzZXJ2ZVxuICogQGF1Z21lbnRzIENvbmZpZ3VyYWJsZUNvbXBvbmVudDxQYXNzd29yZElucHV0Q29uZmlnPlxuICovXG5leHBvcnQgY2xhc3MgUGFzc3dvcmRJbnB1dCBleHRlbmRzIENvbmZpZ3VyYWJsZUNvbXBvbmVudCB7XG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBpMThuXG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqIEB0eXBlIHtIVE1MSW5wdXRFbGVtZW50fVxuICAgKi9cbiAgJGlucHV0XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqIEB0eXBlIHtIVE1MQnV0dG9uRWxlbWVudH1cbiAgICovXG4gICRzaG93SGlkZUJ1dHRvblxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICAkc2NyZWVuUmVhZGVyU3RhdHVzTWVzc2FnZVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0VsZW1lbnQgfCBudWxsfSAkcm9vdCAtIEhUTUwgZWxlbWVudCB0byB1c2UgZm9yIHBhc3N3b3JkIGlucHV0XG4gICAqIEBwYXJhbSB7UGFzc3dvcmRJbnB1dENvbmZpZ30gW2NvbmZpZ10gLSBQYXNzd29yZCBpbnB1dCBjb25maWdcbiAgICovXG4gIGNvbnN0cnVjdG9yKCRyb290LCBjb25maWcgPSB7fSkge1xuICAgIHN1cGVyKCRyb290LCBjb25maWcpXG5cbiAgICBjb25zdCAkaW5wdXQgPSB0aGlzLiRyb290LnF1ZXJ5U2VsZWN0b3IoJy5nb3Z1ay1qcy1wYXNzd29yZC1pbnB1dC1pbnB1dCcpXG4gICAgaWYgKCEoJGlucHV0IGluc3RhbmNlb2YgSFRNTElucHV0RWxlbWVudCkpIHtcbiAgICAgIHRocm93IG5ldyBFbGVtZW50RXJyb3Ioe1xuICAgICAgICBjb21wb25lbnQ6IFBhc3N3b3JkSW5wdXQsXG4gICAgICAgIGVsZW1lbnQ6ICRpbnB1dCxcbiAgICAgICAgZXhwZWN0ZWRUeXBlOiAnSFRNTElucHV0RWxlbWVudCcsXG4gICAgICAgIGlkZW50aWZpZXI6ICdGb3JtIGZpZWxkIChgLmdvdnVrLWpzLXBhc3N3b3JkLWlucHV0LWlucHV0YCknXG4gICAgICB9KVxuICAgIH1cblxuICAgIGlmICgkaW5wdXQudHlwZSAhPT0gJ3Bhc3N3b3JkJykge1xuICAgICAgdGhyb3cgbmV3IEVsZW1lbnRFcnJvcihcbiAgICAgICAgJ1Bhc3N3b3JkIGlucHV0OiBGb3JtIGZpZWxkIChgLmdvdnVrLWpzLXBhc3N3b3JkLWlucHV0LWlucHV0YCkgbXVzdCBiZSBvZiB0eXBlIGBwYXNzd29yZGAuJ1xuICAgICAgKVxuICAgIH1cblxuICAgIGNvbnN0ICRzaG93SGlkZUJ1dHRvbiA9IHRoaXMuJHJvb3QucXVlcnlTZWxlY3RvcihcbiAgICAgICcuZ292dWstanMtcGFzc3dvcmQtaW5wdXQtdG9nZ2xlJ1xuICAgIClcbiAgICBpZiAoISgkc2hvd0hpZGVCdXR0b24gaW5zdGFuY2VvZiBIVE1MQnV0dG9uRWxlbWVudCkpIHtcbiAgICAgIHRocm93IG5ldyBFbGVtZW50RXJyb3Ioe1xuICAgICAgICBjb21wb25lbnQ6IFBhc3N3b3JkSW5wdXQsXG4gICAgICAgIGVsZW1lbnQ6ICRzaG93SGlkZUJ1dHRvbixcbiAgICAgICAgZXhwZWN0ZWRUeXBlOiAnSFRNTEJ1dHRvbkVsZW1lbnQnLFxuICAgICAgICBpZGVudGlmaWVyOiAnQnV0dG9uIChgLmdvdnVrLWpzLXBhc3N3b3JkLWlucHV0LXRvZ2dsZWApJ1xuICAgICAgfSlcbiAgICB9XG5cbiAgICBpZiAoJHNob3dIaWRlQnV0dG9uLnR5cGUgIT09ICdidXR0b24nKSB7XG4gICAgICB0aHJvdyBuZXcgRWxlbWVudEVycm9yKFxuICAgICAgICAnUGFzc3dvcmQgaW5wdXQ6IEJ1dHRvbiAoYC5nb3Z1ay1qcy1wYXNzd29yZC1pbnB1dC10b2dnbGVgKSBtdXN0IGJlIG9mIHR5cGUgYGJ1dHRvbmAuJ1xuICAgICAgKVxuICAgIH1cblxuICAgIHRoaXMuJGlucHV0ID0gJGlucHV0XG4gICAgdGhpcy4kc2hvd0hpZGVCdXR0b24gPSAkc2hvd0hpZGVCdXR0b25cblxuICAgIHRoaXMuaTE4biA9IG5ldyBJMThuKHRoaXMuY29uZmlnLmkxOG4sIHtcbiAgICAgIC8vIFJlYWQgdGhlIGZhbGxiYWNrIGlmIG5lY2Vzc2FyeSByYXRoZXIgdGhhbiBoYXZlIGl0IHNldCBpbiB0aGUgZGVmYXVsdHNcbiAgICAgIGxvY2FsZTogY2xvc2VzdEF0dHJpYnV0ZVZhbHVlKHRoaXMuJHJvb3QsICdsYW5nJylcbiAgICB9KVxuXG4gICAgLy8gU2hvdyB0aGUgdG9nZ2xlIGJ1dHRvbiBlbGVtZW50XG4gICAgdGhpcy4kc2hvd0hpZGVCdXR0b24ucmVtb3ZlQXR0cmlidXRlKCdoaWRkZW4nKVxuXG4gICAgLy8gQ3JlYXRlIGFuZCBhcHBlbmQgdGhlIHN0YXR1cyB0ZXh0IGZvciBzY3JlZW4gcmVhZGVycy5cbiAgICAvLyBUaGlzIGlzIGluamVjdGVkIGJldHdlZW4gdGhlIGlucHV0IGFuZCBidXR0b24gc28gdGhhdCB1c2VycyBnZXQgYSBzZW5zaWJsZSByZWFkaW5nIG9yZGVyIGlmXG4gICAgLy8gbW92aW5nIHRocm91Z2ggdGhlIHBhZ2UgY29udGVudCBsaW5lYXJseTpcbiAgICAvLyBbcGFzc3dvcmQgaW5wdXRdIC0+IFt5b3VyIHBhc3N3b3JkIGlzIHZpc2libGUvaGlkZGVuXSAtPiBbc2hvdy9oaWRlIHBhc3N3b3JkXVxuICAgIGNvbnN0ICRzY3JlZW5SZWFkZXJTdGF0dXNNZXNzYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICAkc2NyZWVuUmVhZGVyU3RhdHVzTWVzc2FnZS5jbGFzc05hbWUgPVxuICAgICAgJ2dvdnVrLXBhc3N3b3JkLWlucHV0X19zci1zdGF0dXMgZ292dWstdmlzdWFsbHktaGlkZGVuJ1xuICAgICRzY3JlZW5SZWFkZXJTdGF0dXNNZXNzYWdlLnNldEF0dHJpYnV0ZSgnYXJpYS1saXZlJywgJ3BvbGl0ZScpXG4gICAgdGhpcy4kc2NyZWVuUmVhZGVyU3RhdHVzTWVzc2FnZSA9ICRzY3JlZW5SZWFkZXJTdGF0dXNNZXNzYWdlXG4gICAgdGhpcy4kaW5wdXQuaW5zZXJ0QWRqYWNlbnRFbGVtZW50KCdhZnRlcmVuZCcsICRzY3JlZW5SZWFkZXJTdGF0dXNNZXNzYWdlKVxuXG4gICAgLy8gQmluZCB0b2dnbGUgYnV0dG9uXG4gICAgdGhpcy4kc2hvd0hpZGVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLnRvZ2dsZS5iaW5kKHRoaXMpKVxuXG4gICAgLy8gQmluZCBldmVudCB0byByZXZlcnQgdGhlIHBhc3N3b3JkIHZpc2liaWxpdHkgdG8gaGlkZGVuXG4gICAgaWYgKHRoaXMuJGlucHV0LmZvcm0pIHtcbiAgICAgIHRoaXMuJGlucHV0LmZvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgKCkgPT4gdGhpcy5oaWRlKCkpXG4gICAgfVxuXG4gICAgLy8gSWYgdGhlIHBhZ2UgaXMgcmVzdG9yZWQgZnJvbSBiZmNhY2hlIGFuZCB0aGUgcGFzc3dvcmQgaXMgdmlzaWJsZSwgaGlkZSBpdCBhZ2FpblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwYWdlc2hvdycsIChldmVudCkgPT4ge1xuICAgICAgaWYgKGV2ZW50LnBlcnNpc3RlZCAmJiB0aGlzLiRpbnB1dC50eXBlICE9PSAncGFzc3dvcmQnKSB7XG4gICAgICAgIHRoaXMuaGlkZSgpXG4gICAgICB9XG4gICAgfSlcblxuICAgIC8vIERlZmF1bHQgdGhlIGNvbXBvbmVudCB0byBoYXZpbmcgdGhlIHBhc3N3b3JkIGhpZGRlbi5cbiAgICB0aGlzLmhpZGUoKVxuICB9XG5cbiAgLyoqXG4gICAqIFRvZ2dsZSB0aGUgdmlzaWJpbGl0eSBvZiB0aGUgcGFzc3dvcmQgaW5wdXRcbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtNb3VzZUV2ZW50fSBldmVudCAtIENsaWNrIGV2ZW50XG4gICAqL1xuICB0b2dnbGUoZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cbiAgICAvLyBJZiBvbiB0aGlzIGNsaWNrLCB0aGUgZmllbGQgaXMgdHlwZT1cInBhc3N3b3JkXCIsIHNob3cgdGhlIHZhbHVlXG4gICAgaWYgKHRoaXMuJGlucHV0LnR5cGUgPT09ICdwYXNzd29yZCcpIHtcbiAgICAgIHRoaXMuc2hvdygpXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICAvLyBPdGhlcndpc2UsIGhpZGUgaXRcbiAgICAvLyBCZWluZyBkZWZlbnNpdmUgLSBoaWRpbmcgc2hvdWxkIGFsd2F5cyBiZSB0aGUgZGVmYXVsdFxuICAgIHRoaXMuaGlkZSgpXG4gIH1cblxuICAvKipcbiAgICogU2hvdyB0aGUgcGFzc3dvcmQgaW5wdXQgdmFsdWUgaW4gcGxhaW4gdGV4dC5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHNob3coKSB7XG4gICAgdGhpcy5zZXRUeXBlKCd0ZXh0JylcbiAgfVxuXG4gIC8qKlxuICAgKiBIaWRlIHRoZSBwYXNzd29yZCBpbnB1dCB2YWx1ZS5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGhpZGUoKSB7XG4gICAgdGhpcy5zZXRUeXBlKCdwYXNzd29yZCcpXG4gIH1cblxuICAvKipcbiAgICogU2V0IHRoZSBwYXNzd29yZCBpbnB1dCB0eXBlXG4gICAqXG4gICAqIEBwYXJhbSB7J3RleHQnIHwgJ3Bhc3N3b3JkJ30gdHlwZSAtIElucHV0IHR5cGVcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHNldFR5cGUodHlwZSkge1xuICAgIGlmICh0eXBlID09PSB0aGlzLiRpbnB1dC50eXBlKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICAvLyBVcGRhdGUgaW5wdXQgdHlwZVxuICAgIHRoaXMuJGlucHV0LnNldEF0dHJpYnV0ZSgndHlwZScsIHR5cGUpXG5cbiAgICBjb25zdCBpc0hpZGRlbiA9IHR5cGUgPT09ICdwYXNzd29yZCdcbiAgICBjb25zdCBwcmVmaXhCdXR0b24gPSBpc0hpZGRlbiA/ICdzaG93JyA6ICdoaWRlJ1xuICAgIGNvbnN0IHByZWZpeFN0YXR1cyA9IGlzSGlkZGVuID8gJ3Bhc3N3b3JkSGlkZGVuJyA6ICdwYXNzd29yZFNob3duJ1xuXG4gICAgLy8gVXBkYXRlIGJ1dHRvbiB0ZXh0XG4gICAgdGhpcy4kc2hvd0hpZGVCdXR0b24uaW5uZXJUZXh0ID0gdGhpcy5pMThuLnQoYCR7cHJlZml4QnV0dG9ufVBhc3N3b3JkYClcblxuICAgIC8vIFVwZGF0ZSBidXR0b24gYXJpYS1sYWJlbFxuICAgIHRoaXMuJHNob3dIaWRlQnV0dG9uLnNldEF0dHJpYnV0ZShcbiAgICAgICdhcmlhLWxhYmVsJyxcbiAgICAgIHRoaXMuaTE4bi50KGAke3ByZWZpeEJ1dHRvbn1QYXNzd29yZEFyaWFMYWJlbGApXG4gICAgKVxuXG4gICAgLy8gVXBkYXRlIHN0YXR1cyBjaGFuZ2UgdGV4dFxuICAgIHRoaXMuJHNjcmVlblJlYWRlclN0YXR1c01lc3NhZ2UuaW5uZXJUZXh0ID0gdGhpcy5pMThuLnQoXG4gICAgICBgJHtwcmVmaXhTdGF0dXN9QW5ub3VuY2VtZW50YFxuICAgIClcbiAgfVxuXG4gIC8qKlxuICAgKiBOYW1lIGZvciB0aGUgY29tcG9uZW50IHVzZWQgd2hlbiBpbml0aWFsaXNpbmcgdXNpbmcgZGF0YS1tb2R1bGUgYXR0cmlidXRlcy5cbiAgICovXG4gIHN0YXRpYyBtb2R1bGVOYW1lID0gJ2dvdnVrLXBhc3N3b3JkLWlucHV0J1xuXG4gIC8qKlxuICAgKiBQYXNzd29yZCBpbnB1dCBkZWZhdWx0IGNvbmZpZ1xuICAgKlxuICAgKiBAc2VlIHtAbGluayBQYXNzd29yZElucHV0Q29uZmlnfVxuICAgKiBAY29uc3RhbnRcbiAgICogQGRlZmF1bHRcbiAgICogQHR5cGUge1Bhc3N3b3JkSW5wdXRDb25maWd9XG4gICAqL1xuICBzdGF0aWMgZGVmYXVsdHMgPSBPYmplY3QuZnJlZXplKHtcbiAgICBpMThuOiB7XG4gICAgICBzaG93UGFzc3dvcmQ6ICdTaG93JyxcbiAgICAgIGhpZGVQYXNzd29yZDogJ0hpZGUnLFxuICAgICAgc2hvd1Bhc3N3b3JkQXJpYUxhYmVsOiAnU2hvdyBwYXNzd29yZCcsXG4gICAgICBoaWRlUGFzc3dvcmRBcmlhTGFiZWw6ICdIaWRlIHBhc3N3b3JkJyxcbiAgICAgIHBhc3N3b3JkU2hvd25Bbm5vdW5jZW1lbnQ6ICdZb3VyIHBhc3N3b3JkIGlzIHZpc2libGUnLFxuICAgICAgcGFzc3dvcmRIaWRkZW5Bbm5vdW5jZW1lbnQ6ICdZb3VyIHBhc3N3b3JkIGlzIGhpZGRlbidcbiAgICB9XG4gIH0pXG5cbiAgLyoqXG4gICAqIFBhc3N3b3JkIGlucHV0IGNvbmZpZyBzY2hlbWFcbiAgICpcbiAgICogQGNvbnN0YW50XG4gICAqIEBzYXRpc2ZpZXMge1NjaGVtYTxQYXNzd29yZElucHV0Q29uZmlnPn1cbiAgICovXG4gIHN0YXRpYyBzY2hlbWEgPSBPYmplY3QuZnJlZXplKHtcbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICBpMThuOiB7IHR5cGU6ICdvYmplY3QnIH1cbiAgICB9XG4gIH0pXG59XG5cbi8qKlxuICogUGFzc3dvcmQgaW5wdXQgY29uZmlnXG4gKlxuICogQHR5cGVkZWYge29iamVjdH0gUGFzc3dvcmRJbnB1dENvbmZpZ1xuICogQHByb3BlcnR5IHtQYXNzd29yZElucHV0VHJhbnNsYXRpb25zfSBbaTE4bj1QYXNzd29yZElucHV0LmRlZmF1bHRzLmkxOG5dIC0gUGFzc3dvcmQgaW5wdXQgdHJhbnNsYXRpb25zXG4gKi9cblxuLyoqXG4gKiBQYXNzd29yZCBpbnB1dCB0cmFuc2xhdGlvbnNcbiAqXG4gKiBAc2VlIHtAbGluayBQYXNzd29yZElucHV0LmRlZmF1bHRzLmkxOG59XG4gKiBAdHlwZWRlZiB7b2JqZWN0fSBQYXNzd29yZElucHV0VHJhbnNsYXRpb25zXG4gKlxuICogTWVzc2FnZXMgZGlzcGxheWVkIHRvIHRoZSB1c2VyIGluZGljYXRpbmcgdGhlIHN0YXRlIG9mIHRoZSBzaG93L2hpZGUgdG9nZ2xlLlxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtzaG93UGFzc3dvcmRdIC0gVmlzaWJsZSB0ZXh0IG9mIHRoZSBidXR0b24gd2hlbiB0aGVcbiAqICAgcGFzc3dvcmQgaXMgY3VycmVudGx5IGhpZGRlbi4gUGxhaW4gdGV4dCBvbmx5LlxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtoaWRlUGFzc3dvcmRdIC0gVmlzaWJsZSB0ZXh0IG9mIHRoZSBidXR0b24gd2hlbiB0aGVcbiAqICAgcGFzc3dvcmQgaXMgY3VycmVudGx5IHZpc2libGUuIFBsYWluIHRleHQgb25seS5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbc2hvd1Bhc3N3b3JkQXJpYUxhYmVsXSAtIGFyaWEtbGFiZWwgb2YgdGhlIGJ1dHRvbiB3aGVuXG4gKiAgIHRoZSBwYXNzd29yZCBpcyBjdXJyZW50bHkgaGlkZGVuLiBQbGFpbiB0ZXh0IG9ubHkuXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW2hpZGVQYXNzd29yZEFyaWFMYWJlbF0gLSBhcmlhLWxhYmVsIG9mIHRoZSBidXR0b24gd2hlblxuICogICB0aGUgcGFzc3dvcmQgaXMgY3VycmVudGx5IHZpc2libGUuIFBsYWluIHRleHQgb25seS5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbcGFzc3dvcmRTaG93bkFubm91bmNlbWVudF0gLSBTY3JlZW4gcmVhZGVyXG4gKiAgIGFubm91bmNlbWVudCB0byBtYWtlIHdoZW4gdGhlIHBhc3N3b3JkIGhhcyBqdXN0IGJlY29tZSB2aXNpYmxlLlxuICogICBQbGFpbiB0ZXh0IG9ubHkuXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW3Bhc3N3b3JkSGlkZGVuQW5ub3VuY2VtZW50XSAtIFNjcmVlbiByZWFkZXJcbiAqICAgYW5ub3VuY2VtZW50IHRvIG1ha2Ugd2hlbiB0aGUgcGFzc3dvcmQgaGFzIGp1c3QgYmVlbiBoaWRkZW4uXG4gKiAgIFBsYWluIHRleHQgb25seS5cbiAqL1xuXG4vKipcbiAqIEBpbXBvcnQgeyBTY2hlbWEgfSBmcm9tICcuLi8uLi9jb21tb24vY29uZmlndXJhdGlvbi5tanMnXG4gKi9cbiIsImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJy4uLy4uL2NvbXBvbmVudC5tanMnXG5pbXBvcnQgeyBFbGVtZW50RXJyb3IgfSBmcm9tICcuLi8uLi9lcnJvcnMvaW5kZXgubWpzJ1xuXG4vKipcbiAqIFJhZGlvcyBjb21wb25lbnRcbiAqXG4gKiBAcHJlc2VydmVcbiAqL1xuZXhwb3J0IGNsYXNzIFJhZGlvcyBleHRlbmRzIENvbXBvbmVudCB7XG4gIC8qKiBAcHJpdmF0ZSAqL1xuICAkaW5wdXRzXG5cbiAgLyoqXG4gICAqIFJhZGlvcyBjYW4gYmUgYXNzb2NpYXRlZCB3aXRoIGEgJ2NvbmRpdGlvbmFsbHkgcmV2ZWFsZWQnIGNvbnRlbnQgYmxvY2sg4oCTXG4gICAqIGZvciBleGFtcGxlLCBhIHJhZGlvIGZvciAnUGhvbmUnIGNvdWxkIHJldmVhbCBhbiBhZGRpdGlvbmFsIGZvcm0gZmllbGQgZm9yXG4gICAqIHRoZSB1c2VyIHRvIGVudGVyIHRoZWlyIHBob25lIG51bWJlci5cbiAgICpcbiAgICogVGhlc2UgYXNzb2NpYXRpb25zIGFyZSBtYWRlIHVzaW5nIGEgYGRhdGEtYXJpYS1jb250cm9sc2AgYXR0cmlidXRlLCB3aGljaFxuICAgKiBpcyBwcm9tb3RlZCB0byBhbiBhcmlhLWNvbnRyb2xzIGF0dHJpYnV0ZSBkdXJpbmcgaW5pdGlhbGlzYXRpb24uXG4gICAqXG4gICAqIFdlIGFsc28gbmVlZCB0byByZXN0b3JlIHRoZSBzdGF0ZSBvZiBhbnkgY29uZGl0aW9uYWwgcmV2ZWFscyBvbiB0aGUgcGFnZVxuICAgKiAoZm9yIGV4YW1wbGUgaWYgdGhlIHVzZXIgaGFzIG5hdmlnYXRlZCBiYWNrKSwgYW5kIHNldCB1cCBldmVudCBoYW5kbGVycyB0b1xuICAgKiBrZWVwIHRoZSByZXZlYWwgaW4gc3luYyB3aXRoIHRoZSByYWRpbyBzdGF0ZS5cbiAgICpcbiAgICogQHBhcmFtIHtFbGVtZW50IHwgbnVsbH0gJHJvb3QgLSBIVE1MIGVsZW1lbnQgdG8gdXNlIGZvciByYWRpb3NcbiAgICovXG4gIGNvbnN0cnVjdG9yKCRyb290KSB7XG4gICAgc3VwZXIoJHJvb3QpXG5cbiAgICBjb25zdCAkaW5wdXRzID0gdGhpcy4kcm9vdC5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dFt0eXBlPVwicmFkaW9cIl0nKVxuICAgIGlmICghJGlucHV0cy5sZW5ndGgpIHtcbiAgICAgIHRocm93IG5ldyBFbGVtZW50RXJyb3Ioe1xuICAgICAgICBjb21wb25lbnQ6IFJhZGlvcyxcbiAgICAgICAgaWRlbnRpZmllcjogJ0Zvcm0gaW5wdXRzIChgPGlucHV0IHR5cGU9XCJyYWRpb1wiPmApJ1xuICAgICAgfSlcbiAgICB9XG5cbiAgICB0aGlzLiRpbnB1dHMgPSAkaW5wdXRzXG5cbiAgICB0aGlzLiRpbnB1dHMuZm9yRWFjaCgoJGlucHV0KSA9PiB7XG4gICAgICBjb25zdCB0YXJnZXRJZCA9ICRpbnB1dC5nZXRBdHRyaWJ1dGUoJ2RhdGEtYXJpYS1jb250cm9scycpXG5cbiAgICAgIC8vIFNraXAgcmFkaW9zIHdpdGhvdXQgZGF0YS1hcmlhLWNvbnRyb2xzIGF0dHJpYnV0ZXNcbiAgICAgIGlmICghdGFyZ2V0SWQpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIC8vIFRocm93IGlmIHRhcmdldCBjb25kaXRpb25hbCBlbGVtZW50IGRvZXMgbm90IGV4aXN0LlxuICAgICAgaWYgKCFkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0YXJnZXRJZCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVsZW1lbnRFcnJvcih7XG4gICAgICAgICAgY29tcG9uZW50OiBSYWRpb3MsXG4gICAgICAgICAgaWRlbnRpZmllcjogYENvbmRpdGlvbmFsIHJldmVhbCAoXFxgaWQ9XCIke3RhcmdldElkfVwiXFxgKWBcbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgLy8gUHJvbW90ZSB0aGUgZGF0YS1hcmlhLWNvbnRyb2xzIGF0dHJpYnV0ZSB0byBhIGFyaWEtY29udHJvbHMgYXR0cmlidXRlXG4gICAgICAvLyBzbyB0aGF0IHRoZSByZWxhdGlvbnNoaXAgaXMgZXhwb3NlZCBpbiB0aGUgQU9NXG4gICAgICAkaW5wdXQuc2V0QXR0cmlidXRlKCdhcmlhLWNvbnRyb2xzJywgdGFyZ2V0SWQpXG4gICAgICAkaW5wdXQucmVtb3ZlQXR0cmlidXRlKCdkYXRhLWFyaWEtY29udHJvbHMnKVxuICAgIH0pXG5cbiAgICAvLyBXaGVuIHRoZSBwYWdlIGlzIHJlc3RvcmVkIGFmdGVyIG5hdmlnYXRpbmcgJ2JhY2snIGluIHNvbWUgYnJvd3NlcnMgdGhlXG4gICAgLy8gc3RhdGUgb2YgZm9ybSBjb250cm9scyBpcyBub3QgcmVzdG9yZWQgdW50aWwgKmFmdGVyKiB0aGUgRE9NQ29udGVudExvYWRlZFxuICAgIC8vIGV2ZW50IGlzIGZpcmVkLCBzbyB3ZSBuZWVkIHRvIHN5bmMgYWZ0ZXIgdGhlIHBhZ2VzaG93IGV2ZW50LlxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwYWdlc2hvdycsICgpID0+IHRoaXMuc3luY0FsbENvbmRpdGlvbmFsUmV2ZWFscygpKVxuXG4gICAgLy8gQWx0aG91Z2ggd2UndmUgc2V0IHVwIGhhbmRsZXJzIHRvIHN5bmMgc3RhdGUgb24gdGhlIHBhZ2VzaG93IGV2ZW50LCBpbml0XG4gICAgLy8gY291bGQgYmUgY2FsbGVkIGFmdGVyIHRob3NlIGV2ZW50cyBoYXZlIGZpcmVkLCBmb3IgZXhhbXBsZSBpZiB0aGV5IGFyZVxuICAgIC8vIGFkZGVkIHRvIHRoZSBwYWdlIGR5bmFtaWNhbGx5LCBzbyBzeW5jIG5vdyB0b28uXG4gICAgdGhpcy5zeW5jQWxsQ29uZGl0aW9uYWxSZXZlYWxzKClcblxuICAgIC8vIEhhbmRsZSBldmVudHNcbiAgICB0aGlzLiRyb290LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB0aGlzLmhhbmRsZUNsaWNrKGV2ZW50KSlcbiAgfVxuXG4gIC8qKlxuICAgKiBTeW5jIHRoZSBjb25kaXRpb25hbCByZXZlYWwgc3RhdGVzIGZvciBhbGwgcmFkaW8gYnV0dG9ucyBpbiB0aGlzIGNvbXBvbmVudC5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHN5bmNBbGxDb25kaXRpb25hbFJldmVhbHMoKSB7XG4gICAgdGhpcy4kaW5wdXRzLmZvckVhY2goKCRpbnB1dCkgPT5cbiAgICAgIHRoaXMuc3luY0NvbmRpdGlvbmFsUmV2ZWFsV2l0aElucHV0U3RhdGUoJGlucHV0KVxuICAgIClcbiAgfVxuXG4gIC8qKlxuICAgKiBTeW5jIGNvbmRpdGlvbmFsIHJldmVhbCB3aXRoIHRoZSBpbnB1dCBzdGF0ZVxuICAgKlxuICAgKiBTeW5jaHJvbmlzZSB0aGUgdmlzaWJpbGl0eSBvZiB0aGUgY29uZGl0aW9uYWwgcmV2ZWFsLCBhbmQgaXRzIGFjY2Vzc2libGVcbiAgICogc3RhdGUsIHdpdGggdGhlIGlucHV0J3MgY2hlY2tlZCBzdGF0ZS5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtIVE1MSW5wdXRFbGVtZW50fSAkaW5wdXQgLSBSYWRpbyBpbnB1dFxuICAgKi9cbiAgc3luY0NvbmRpdGlvbmFsUmV2ZWFsV2l0aElucHV0U3RhdGUoJGlucHV0KSB7XG4gICAgY29uc3QgdGFyZ2V0SWQgPSAkaW5wdXQuZ2V0QXR0cmlidXRlKCdhcmlhLWNvbnRyb2xzJylcbiAgICBpZiAoIXRhcmdldElkKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBjb25zdCAkdGFyZ2V0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGFyZ2V0SWQpXG4gICAgaWYgKCR0YXJnZXQ/LmNsYXNzTGlzdC5jb250YWlucygnZ292dWstcmFkaW9zX19jb25kaXRpb25hbCcpKSB7XG4gICAgICBjb25zdCBpbnB1dElzQ2hlY2tlZCA9ICRpbnB1dC5jaGVja2VkXG5cbiAgICAgICRpbnB1dC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCBpbnB1dElzQ2hlY2tlZC50b1N0cmluZygpKVxuICAgICAgJHRhcmdldC5jbGFzc0xpc3QudG9nZ2xlKFxuICAgICAgICAnZ292dWstcmFkaW9zX19jb25kaXRpb25hbC0taGlkZGVuJyxcbiAgICAgICAgIWlucHV0SXNDaGVja2VkXG4gICAgICApXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENsaWNrIGV2ZW50IGhhbmRsZXJcbiAgICpcbiAgICogSGFuZGxlIGEgY2xpY2sgd2l0aGluIHRoZSBjb21wb25lbnQgcm9vdCDigJMgaWYgdGhlIGNsaWNrIG9jY3VycmVkIG9uIGEgcmFkaW8sIHN5bmNcbiAgICogdGhlIHN0YXRlIG9mIHRoZSBjb25kaXRpb25hbCByZXZlYWwgZm9yIGFsbCByYWRpbyBidXR0b25zIGluIHRoZSBzYW1lIGZvcm1cbiAgICogd2l0aCB0aGUgc2FtZSBuYW1lIChiZWNhdXNlIGNoZWNraW5nIG9uZSByYWRpbyBjb3VsZCBoYXZlIHVuLWNoZWNrZWQgYVxuICAgKiByYWRpbyB1bmRlciB0aGUgcm9vdCBvZiBhbm90aGVyIFJhZGlvIGNvbXBvbmVudClcbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtNb3VzZUV2ZW50fSBldmVudCAtIENsaWNrIGV2ZW50XG4gICAqL1xuICBoYW5kbGVDbGljayhldmVudCkge1xuICAgIGNvbnN0ICRjbGlja2VkSW5wdXQgPSBldmVudC50YXJnZXRcblxuICAgIC8vIElnbm9yZSBjbGlja3Mgb24gdGhpbmdzIHRoYXQgYXJlbid0IHJhZGlvIGJ1dHRvbnNcbiAgICBpZiAoXG4gICAgICAhKCRjbGlja2VkSW5wdXQgaW5zdGFuY2VvZiBIVE1MSW5wdXRFbGVtZW50KSB8fFxuICAgICAgJGNsaWNrZWRJbnB1dC50eXBlICE9PSAncmFkaW8nXG4gICAgKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICAvLyBXZSBvbmx5IG5lZWQgdG8gY29uc2lkZXIgcmFkaW9zIHdpdGggY29uZGl0aW9uYWwgcmV2ZWFscywgd2hpY2ggd2lsbCBoYXZlXG4gICAgLy8gYXJpYS1jb250cm9scyBhdHRyaWJ1dGVzLlxuICAgIGNvbnN0ICRhbGxJbnB1dHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFxuICAgICAgJ2lucHV0W3R5cGU9XCJyYWRpb1wiXVthcmlhLWNvbnRyb2xzXSdcbiAgICApXG5cbiAgICBjb25zdCAkY2xpY2tlZElucHV0Rm9ybSA9ICRjbGlja2VkSW5wdXQuZm9ybVxuICAgIGNvbnN0ICRjbGlja2VkSW5wdXROYW1lID0gJGNsaWNrZWRJbnB1dC5uYW1lXG5cbiAgICAkYWxsSW5wdXRzLmZvckVhY2goKCRpbnB1dCkgPT4ge1xuICAgICAgY29uc3QgaGFzU2FtZUZvcm1Pd25lciA9ICRpbnB1dC5mb3JtID09PSAkY2xpY2tlZElucHV0Rm9ybVxuICAgICAgY29uc3QgaGFzU2FtZU5hbWUgPSAkaW5wdXQubmFtZSA9PT0gJGNsaWNrZWRJbnB1dE5hbWVcblxuICAgICAgaWYgKGhhc1NhbWVOYW1lICYmIGhhc1NhbWVGb3JtT3duZXIpIHtcbiAgICAgICAgdGhpcy5zeW5jQ29uZGl0aW9uYWxSZXZlYWxXaXRoSW5wdXRTdGF0ZSgkaW5wdXQpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBOYW1lIGZvciB0aGUgY29tcG9uZW50IHVzZWQgd2hlbiBpbml0aWFsaXNpbmcgdXNpbmcgZGF0YS1tb2R1bGUgYXR0cmlidXRlcy5cbiAgICovXG4gIHN0YXRpYyBtb2R1bGVOYW1lID0gJ2dvdnVrLXJhZGlvcydcbn1cbiIsImltcG9ydCB7IGdldEJyZWFrcG9pbnQgfSBmcm9tICcuLi8uLi9jb21tb24vaW5kZXgubWpzJ1xuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vY29tcG9uZW50Lm1qcydcbmltcG9ydCB7IEVsZW1lbnRFcnJvciB9IGZyb20gJy4uLy4uL2Vycm9ycy9pbmRleC5tanMnXG5cbi8qKlxuICogU2VydmljZSBOYXZpZ2F0aW9uIGNvbXBvbmVudFxuICpcbiAqIEBwcmVzZXJ2ZVxuICovXG5leHBvcnQgY2xhc3MgU2VydmljZU5hdmlnYXRpb24gZXh0ZW5kcyBDb21wb25lbnQge1xuICAvKiogQHByaXZhdGUgKi9cbiAgJG1lbnVCdXR0b25cblxuICAvKiogQHByaXZhdGUgKi9cbiAgJG1lbnVcblxuICAvKipcbiAgICogUmVtZW1iZXIgdGhlIG9wZW4vY2xvc2VkIHN0YXRlIG9mIHRoZSBuYXYgc28gd2UgY2FuIG1haW50YWluIGl0IHdoZW4gdGhlXG4gICAqIHNjcmVlbiBpcyByZXNpemVkLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgbWVudUlzT3BlbiA9IGZhbHNlXG5cbiAgLyoqXG4gICAqIEEgZ2xvYmFsIGNvbnN0IGZvciBzdG9yaW5nIGEgbWF0Y2hNZWRpYSBpbnN0YW5jZSB3aGljaCB3ZSdsbCB1c2UgdG8gZGV0ZWN0XG4gICAqIHdoZW4gYSBzY3JlZW4gc2l6ZSBjaGFuZ2UgaGFwcGVucy4gV2UgcmVseSBvbiBpdCBiZWluZyBudWxsIGlmIHRoZSBmZWF0dXJlXG4gICAqIGlzbid0IGF2YWlsYWJsZSB0byBpbml0aWFsbHkgYXBwbHkgaGlkZGVuIGF0dHJpYnV0ZXNcbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHR5cGUge01lZGlhUXVlcnlMaXN0IHwgbnVsbH1cbiAgICovXG4gIG1xbCA9IG51bGxcblxuICAvKipcbiAgICogQHBhcmFtIHtFbGVtZW50IHwgbnVsbH0gJHJvb3QgLSBIVE1MIGVsZW1lbnQgdG8gdXNlIGZvciBoZWFkZXJcbiAgICovXG4gIGNvbnN0cnVjdG9yKCRyb290KSB7XG4gICAgc3VwZXIoJHJvb3QpXG5cbiAgICBjb25zdCAkbWVudUJ1dHRvbiA9IHRoaXMuJHJvb3QucXVlcnlTZWxlY3RvcihcbiAgICAgICcuZ292dWstanMtc2VydmljZS1uYXZpZ2F0aW9uLXRvZ2dsZSdcbiAgICApXG5cbiAgICAvLyBIZWFkZXJzIGRvbid0IG5lY2Vzc2FyaWx5IGhhdmUgYSBuYXZpZ2F0aW9uLiBXaGVuIHRoZXkgZG9uJ3QsIHRoZSBtZW51XG4gICAgLy8gdG9nZ2xlIHdvbid0IGJlIHJlbmRlcmVkIGJ5IG91ciBtYWNybyAob3IgbWF5IGJlIG9taXR0ZWQgd2hlbiB3cml0aW5nXG4gICAgLy8gcGxhaW4gSFRNTClcbiAgICBpZiAoISRtZW51QnV0dG9uKSB7XG4gICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIGNvbnN0IG1lbnVJZCA9ICRtZW51QnV0dG9uLmdldEF0dHJpYnV0ZSgnYXJpYS1jb250cm9scycpXG4gICAgaWYgKCFtZW51SWQpIHtcbiAgICAgIHRocm93IG5ldyBFbGVtZW50RXJyb3Ioe1xuICAgICAgICBjb21wb25lbnQ6IFNlcnZpY2VOYXZpZ2F0aW9uLFxuICAgICAgICBpZGVudGlmaWVyOlxuICAgICAgICAgICdOYXZpZ2F0aW9uIGJ1dHRvbiAoYDxidXR0b24gY2xhc3M9XCJnb3Z1ay1qcy1zZXJ2aWNlLW5hdmlnYXRpb24tdG9nZ2xlXCI+YCkgYXR0cmlidXRlIChgYXJpYS1jb250cm9sc2ApJ1xuICAgICAgfSlcbiAgICB9XG5cbiAgICBjb25zdCAkbWVudSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG1lbnVJZClcbiAgICBpZiAoISRtZW51KSB7XG4gICAgICB0aHJvdyBuZXcgRWxlbWVudEVycm9yKHtcbiAgICAgICAgY29tcG9uZW50OiBTZXJ2aWNlTmF2aWdhdGlvbixcbiAgICAgICAgZWxlbWVudDogJG1lbnUsXG4gICAgICAgIGlkZW50aWZpZXI6IGBOYXZpZ2F0aW9uIChcXGA8dWwgaWQ9XCIke21lbnVJZH1cIj5cXGApYFxuICAgICAgfSlcbiAgICB9XG5cbiAgICB0aGlzLiRtZW51ID0gJG1lbnVcbiAgICB0aGlzLiRtZW51QnV0dG9uID0gJG1lbnVCdXR0b25cblxuICAgIHRoaXMuc2V0dXBSZXNwb25zaXZlQ2hlY2tzKClcblxuICAgIHRoaXMuJG1lbnVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PlxuICAgICAgdGhpcy5oYW5kbGVNZW51QnV0dG9uQ2xpY2soKVxuICAgIClcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR1cCB2aWV3cG9ydCByZXNpemUgY2hlY2tcbiAgICpcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHNldHVwUmVzcG9uc2l2ZUNoZWNrcygpIHtcbiAgICBjb25zdCBicmVha3BvaW50ID0gZ2V0QnJlYWtwb2ludCgndGFibGV0JylcblxuICAgIGlmICghYnJlYWtwb2ludC52YWx1ZSkge1xuICAgICAgdGhyb3cgbmV3IEVsZW1lbnRFcnJvcih7XG4gICAgICAgIGNvbXBvbmVudDogU2VydmljZU5hdmlnYXRpb24sXG4gICAgICAgIGlkZW50aWZpZXI6IGBDU1MgY3VzdG9tIHByb3BlcnR5IChcXGAke2JyZWFrcG9pbnQucHJvcGVydHl9XFxgKSBvbiBwc2V1ZG8tY2xhc3MgXFxgOnJvb3RcXGBgXG4gICAgICB9KVxuICAgIH1cblxuICAgIC8vIE1lZGlhIHF1ZXJ5IGxpc3QgZm9yIEdPVi5VSyBGcm9udGVuZCBkZXNrdG9wIGJyZWFrcG9pbnRcbiAgICB0aGlzLm1xbCA9IHdpbmRvdy5tYXRjaE1lZGlhKGAobWluLXdpZHRoOiAke2JyZWFrcG9pbnQudmFsdWV9KWApXG5cbiAgICAvLyBNZWRpYVF1ZXJ5TGlzdC5hZGRFdmVudExpc3RlbmVyIGlzbid0IHN1cHBvcnRlZCBieSBTYWZhcmkgPCAxNCBzbyB3ZSBuZWVkXG4gICAgLy8gdG8gYmUgYWJsZSB0byBmYWxsIGJhY2sgdG8gdGhlIGRlcHJlY2F0ZWQgTWVkaWFRdWVyeUxpc3QuYWRkTGlzdGVuZXJcbiAgICBpZiAoJ2FkZEV2ZW50TGlzdGVuZXInIGluIHRoaXMubXFsKSB7XG4gICAgICB0aGlzLm1xbC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoKSA9PiB0aGlzLmNoZWNrTW9kZSgpKVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBAdHMtZXhwZWN0LWVycm9yIFByb3BlcnR5ICdhZGRMaXN0ZW5lcicgZG9lcyBub3QgZXhpc3RcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdW5zYWZlLWNhbGxcbiAgICAgIHRoaXMubXFsLmFkZExpc3RlbmVyKCgpID0+IHRoaXMuY2hlY2tNb2RlKCkpXG4gICAgfVxuXG4gICAgdGhpcy5jaGVja01vZGUoKVxuICB9XG5cbiAgLyoqXG4gICAqIFN5bmMgbWVudSBzdGF0ZVxuICAgKlxuICAgKiBVc2VzIHRoZSBnbG9iYWwgdmFyaWFibGUgbWVudUlzT3BlbiB0byBjb3JyZWN0bHkgc2V0IHRoZSBhY2Nlc3NpYmxlIGFuZFxuICAgKiB2aXN1YWwgc3RhdGVzIG9mIHRoZSBtZW51IGFuZCB0aGUgbWVudSBidXR0b24uXG4gICAqIEFkZGl0aW9uYWxseSB3aWxsIGZvcmNlIHRoZSBtZW51IHRvIGJlIHZpc2libGUgYW5kIHRoZSBtZW51IGJ1dHRvbiB0byBiZVxuICAgKiBoaWRkZW4gaWYgdGhlIG1hdGNoTWVkaWEgaXMgdHJpZ2dlcmVkIHRvIGRlc2t0b3AuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBjaGVja01vZGUoKSB7XG4gICAgaWYgKCF0aGlzLm1xbCB8fCAhdGhpcy4kbWVudSB8fCAhdGhpcy4kbWVudUJ1dHRvbikge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgaWYgKHRoaXMubXFsLm1hdGNoZXMpIHtcbiAgICAgIHRoaXMuJG1lbnUucmVtb3ZlQXR0cmlidXRlKCdoaWRkZW4nKVxuICAgICAgdGhpcy4kbWVudUJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2hpZGRlbicsICcnKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLiRtZW51QnV0dG9uLnJlbW92ZUF0dHJpYnV0ZSgnaGlkZGVuJylcbiAgICAgIHRoaXMuJG1lbnVCdXR0b24uc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgdGhpcy5tZW51SXNPcGVuLnRvU3RyaW5nKCkpXG5cbiAgICAgIGlmICh0aGlzLm1lbnVJc09wZW4pIHtcbiAgICAgICAgdGhpcy4kbWVudS5yZW1vdmVBdHRyaWJ1dGUoJ2hpZGRlbicpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLiRtZW51LnNldEF0dHJpYnV0ZSgnaGlkZGVuJywgJycpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEhhbmRsZSBtZW51IGJ1dHRvbiBjbGlja1xuICAgKlxuICAgKiBXaGVuIHRoZSBtZW51IGJ1dHRvbiBpcyBjbGlja2VkLCBjaGFuZ2UgdGhlIHZpc2liaWxpdHkgb2YgdGhlIG1lbnUgYW5kIHRoZW5cbiAgICogc3luYyB0aGUgYWNjZXNzaWJpbGl0eSBzdGF0ZSBhbmQgbWVudSBidXR0b24gc3RhdGVcbiAgICpcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGhhbmRsZU1lbnVCdXR0b25DbGljaygpIHtcbiAgICB0aGlzLm1lbnVJc09wZW4gPSAhdGhpcy5tZW51SXNPcGVuXG4gICAgdGhpcy5jaGVja01vZGUoKVxuICB9XG5cbiAgLyoqXG4gICAqIE5hbWUgZm9yIHRoZSBjb21wb25lbnQgdXNlZCB3aGVuIGluaXRpYWxpc2luZyB1c2luZyBkYXRhLW1vZHVsZSBhdHRyaWJ1dGVzLlxuICAgKi9cbiAgc3RhdGljIG1vZHVsZU5hbWUgPSAnZ292dWstc2VydmljZS1uYXZpZ2F0aW9uJ1xufVxuIiwiaW1wb3J0IHsgZ2V0RnJhZ21lbnRGcm9tVXJsLCBzZXRGb2N1cyB9IGZyb20gJy4uLy4uL2NvbW1vbi9pbmRleC5tanMnXG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICcuLi8uLi9jb21wb25lbnQubWpzJ1xuaW1wb3J0IHsgRWxlbWVudEVycm9yIH0gZnJvbSAnLi4vLi4vZXJyb3JzL2luZGV4Lm1qcydcblxuLyoqXG4gKiBTa2lwIGxpbmsgY29tcG9uZW50XG4gKlxuICogQHByZXNlcnZlXG4gKiBAYXVnbWVudHMgQ29tcG9uZW50PEhUTUxBbmNob3JFbGVtZW50PlxuICovXG5leHBvcnQgY2xhc3MgU2tpcExpbmsgZXh0ZW5kcyBDb21wb25lbnQge1xuICBzdGF0aWMgZWxlbWVudFR5cGUgPSBIVE1MQW5jaG9yRWxlbWVudFxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0VsZW1lbnQgfCBudWxsfSAkcm9vdCAtIEhUTUwgZWxlbWVudCB0byB1c2UgZm9yIHNraXAgbGlua1xuICAgKiBAdGhyb3dzIHtFbGVtZW50RXJyb3J9IHdoZW4gJHJvb3QgaXMgbm90IHNldCBvciB0aGUgd3JvbmcgdHlwZVxuICAgKiBAdGhyb3dzIHtFbGVtZW50RXJyb3J9IHdoZW4gJHJvb3QuaGFzaCBkb2VzIG5vdCBjb250YWluIGEgaGFzaFxuICAgKiBAdGhyb3dzIHtFbGVtZW50RXJyb3J9IHdoZW4gdGhlIGxpbmtlZCBlbGVtZW50IGlzIG1pc3Npbmcgb3IgdGhlIHdyb25nIHR5cGVcbiAgICovXG4gIGNvbnN0cnVjdG9yKCRyb290KSB7XG4gICAgc3VwZXIoJHJvb3QpXG5cbiAgICBjb25zdCBoYXNoID0gdGhpcy4kcm9vdC5oYXNoXG4gICAgY29uc3QgaHJlZiA9IHRoaXMuJHJvb3QuZ2V0QXR0cmlidXRlKCdocmVmJykgPz8gJydcblxuICAgIC8qKiBAdHlwZSB7VVJMIHwgdW5kZWZpbmVkfSAqL1xuICAgIGxldCB1cmxcblxuICAgIC8qKlxuICAgICAqIENoZWNrIGZvciB2YWxpZCBsaW5rIFVSTFxuICAgICAqXG4gICAgICoge0BsaW5rIGh0dHBzOi8vY2FuaXVzZS5jb20vdXJsfVxuICAgICAqIHtAbGluayBodHRwczovL3VybC5zcGVjLndoYXR3Zy5vcmd9XG4gICAgICpcbiAgICAgKi9cbiAgICB0cnkge1xuICAgICAgdXJsID0gbmV3IHdpbmRvdy5VUkwodGhpcy4kcm9vdC5ocmVmKVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICB0aHJvdyBuZXcgRWxlbWVudEVycm9yKFxuICAgICAgICBgU2tpcCBsaW5rOiBUYXJnZXQgbGluayAoXFxgaHJlZj1cIiR7aHJlZn1cIlxcYCkgaXMgaW52YWxpZGBcbiAgICAgIClcbiAgICB9XG5cbiAgICAvLyBSZXR1cm4gZWFybHkgZm9yIGV4dGVybmFsIFVSTHMgb3IgbGlua3MgdG8gb3RoZXIgcGFnZXNcbiAgICBpZiAoXG4gICAgICB1cmwub3JpZ2luICE9PSB3aW5kb3cubG9jYXRpb24ub3JpZ2luIHx8XG4gICAgICB1cmwucGF0aG5hbWUgIT09IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZVxuICAgICkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgY29uc3QgbGlua2VkRWxlbWVudElkID0gZ2V0RnJhZ21lbnRGcm9tVXJsKGhhc2gpXG5cbiAgICAvLyBDaGVjayBsaW5rIHBhdGggbWF0Y2hpbmcgY3VycmVudCBwYWdlXG4gICAgaWYgKCFsaW5rZWRFbGVtZW50SWQpIHtcbiAgICAgIHRocm93IG5ldyBFbGVtZW50RXJyb3IoXG4gICAgICAgIGBTa2lwIGxpbms6IFRhcmdldCBsaW5rIChcXGBocmVmPVwiJHtocmVmfVwiXFxgKSBoYXMgbm8gaGFzaCBmcmFnbWVudGBcbiAgICAgIClcbiAgICB9XG5cbiAgICBjb25zdCAkbGlua2VkRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGxpbmtlZEVsZW1lbnRJZClcblxuICAgIC8vIENoZWNrIGZvciBsaW5rIHRhcmdldCBlbGVtZW50XG4gICAgaWYgKCEkbGlua2VkRWxlbWVudCkge1xuICAgICAgdGhyb3cgbmV3IEVsZW1lbnRFcnJvcih7XG4gICAgICAgIGNvbXBvbmVudDogU2tpcExpbmssXG4gICAgICAgIGVsZW1lbnQ6ICRsaW5rZWRFbGVtZW50LFxuICAgICAgICBpZGVudGlmaWVyOiBgVGFyZ2V0IGNvbnRlbnQgKFxcYGlkPVwiJHtsaW5rZWRFbGVtZW50SWR9XCJcXGApYFxuICAgICAgfSlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGb2N1cyB0aGUgbGlua2VkIGVsZW1lbnQgb24gY2xpY2tcbiAgICAgKlxuICAgICAqIEFkZHMgYSBoZWxwZXIgQ1NTIGNsYXNzIHRvIGhpZGUgbmF0aXZlIGZvY3VzIHN0eWxlcyxcbiAgICAgKiBidXQgcmVtb3ZlcyBpdCBvbiBibHVyIHRvIHJlc3RvcmUgbmF0aXZlIGZvY3VzIHN0eWxlc1xuICAgICAqL1xuICAgIHRoaXMuJHJvb3QuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PlxuICAgICAgc2V0Rm9jdXMoJGxpbmtlZEVsZW1lbnQsIHtcbiAgICAgICAgb25CZWZvcmVGb2N1cygpIHtcbiAgICAgICAgICAkbGlua2VkRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdnb3Z1ay1za2lwLWxpbmstZm9jdXNlZC1lbGVtZW50JylcbiAgICAgICAgfSxcbiAgICAgICAgb25CbHVyKCkge1xuICAgICAgICAgICRsaW5rZWRFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2dvdnVrLXNraXAtbGluay1mb2N1c2VkLWVsZW1lbnQnKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIClcbiAgfVxuXG4gIC8qKlxuICAgKiBOYW1lIGZvciB0aGUgY29tcG9uZW50IHVzZWQgd2hlbiBpbml0aWFsaXNpbmcgdXNpbmcgZGF0YS1tb2R1bGUgYXR0cmlidXRlcy5cbiAgICovXG4gIHN0YXRpYyBtb2R1bGVOYW1lID0gJ2dvdnVrLXNraXAtbGluaydcbn1cbiIsImltcG9ydCB7IGdldEJyZWFrcG9pbnQsIGdldEZyYWdtZW50RnJvbVVybCB9IGZyb20gJy4uLy4uL2NvbW1vbi9pbmRleC5tanMnXG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICcuLi8uLi9jb21wb25lbnQubWpzJ1xuaW1wb3J0IHsgRWxlbWVudEVycm9yIH0gZnJvbSAnLi4vLi4vZXJyb3JzL2luZGV4Lm1qcydcblxuLyoqXG4gKiBUYWJzIGNvbXBvbmVudFxuICpcbiAqIEBwcmVzZXJ2ZVxuICovXG5leHBvcnQgY2xhc3MgVGFicyBleHRlbmRzIENvbXBvbmVudCB7XG4gIC8qKiBAcHJpdmF0ZSAqL1xuICAkdGFic1xuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICAkdGFiTGlzdFxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICAkdGFiTGlzdEl0ZW1zXG5cbiAgLyoqIEBwcml2YXRlICovXG4gIGpzSGlkZGVuQ2xhc3MgPSAnZ292dWstdGFic19fcGFuZWwtLWhpZGRlbidcblxuICAvKiogQHByaXZhdGUgKi9cbiAgY2hhbmdpbmdIYXNoID0gZmFsc2VcblxuICAvKiogQHByaXZhdGUgKi9cbiAgYm91bmRUYWJDbGlja1xuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBib3VuZFRhYktleWRvd25cblxuICAvKiogQHByaXZhdGUgKi9cbiAgYm91bmRPbkhhc2hDaGFuZ2VcblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICogQHR5cGUge01lZGlhUXVlcnlMaXN0IHwgbnVsbH1cbiAgICovXG4gIG1xbCA9IG51bGxcblxuICAvKipcbiAgICogQHBhcmFtIHtFbGVtZW50IHwgbnVsbH0gJHJvb3QgLSBIVE1MIGVsZW1lbnQgdG8gdXNlIGZvciB0YWJzXG4gICAqL1xuICBjb25zdHJ1Y3Rvcigkcm9vdCkge1xuICAgIHN1cGVyKCRyb290KVxuXG4gICAgY29uc3QgJHRhYnMgPSB0aGlzLiRyb290LnF1ZXJ5U2VsZWN0b3JBbGwoJ2EuZ292dWstdGFic19fdGFiJylcbiAgICBpZiAoISR0YWJzLmxlbmd0aCkge1xuICAgICAgdGhyb3cgbmV3IEVsZW1lbnRFcnJvcih7XG4gICAgICAgIGNvbXBvbmVudDogVGFicyxcbiAgICAgICAgaWRlbnRpZmllcjogJ0xpbmtzIChgPGEgY2xhc3M9XCJnb3Z1ay10YWJzX190YWJcIj5gKSdcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgdGhpcy4kdGFicyA9ICR0YWJzXG5cbiAgICAvLyBTYXZlIGJvdW5kIGZ1bmN0aW9ucyBzbyB3ZSBjYW4gcmVtb3ZlIGV2ZW50IGxpc3RlbmVycyBkdXJpbmcgdGVhcmRvd25cbiAgICB0aGlzLmJvdW5kVGFiQ2xpY2sgPSB0aGlzLm9uVGFiQ2xpY2suYmluZCh0aGlzKVxuICAgIHRoaXMuYm91bmRUYWJLZXlkb3duID0gdGhpcy5vblRhYktleWRvd24uYmluZCh0aGlzKVxuICAgIHRoaXMuYm91bmRPbkhhc2hDaGFuZ2UgPSB0aGlzLm9uSGFzaENoYW5nZS5iaW5kKHRoaXMpXG5cbiAgICBjb25zdCAkdGFiTGlzdCA9IHRoaXMuJHJvb3QucXVlcnlTZWxlY3RvcignLmdvdnVrLXRhYnNfX2xpc3QnKVxuICAgIGNvbnN0ICR0YWJMaXN0SXRlbXMgPSB0aGlzLiRyb290LnF1ZXJ5U2VsZWN0b3JBbGwoXG4gICAgICAnbGkuZ292dWstdGFic19fbGlzdC1pdGVtJ1xuICAgIClcblxuICAgIGlmICghJHRhYkxpc3QpIHtcbiAgICAgIHRocm93IG5ldyBFbGVtZW50RXJyb3Ioe1xuICAgICAgICBjb21wb25lbnQ6IFRhYnMsXG4gICAgICAgIGlkZW50aWZpZXI6ICdMaXN0IChgPHVsIGNsYXNzPVwiZ292dWstdGFic19fbGlzdFwiPmApJ1xuICAgICAgfSlcbiAgICB9XG5cbiAgICBpZiAoISR0YWJMaXN0SXRlbXMubGVuZ3RoKSB7XG4gICAgICB0aHJvdyBuZXcgRWxlbWVudEVycm9yKHtcbiAgICAgICAgY29tcG9uZW50OiBUYWJzLFxuICAgICAgICBpZGVudGlmaWVyOiAnTGlzdCBpdGVtcyAoYDxsaSBjbGFzcz1cImdvdnVrLXRhYnNfX2xpc3QtaXRlbVwiPmApJ1xuICAgICAgfSlcbiAgICB9XG5cbiAgICB0aGlzLiR0YWJMaXN0ID0gJHRhYkxpc3RcbiAgICB0aGlzLiR0YWJMaXN0SXRlbXMgPSAkdGFiTGlzdEl0ZW1zXG5cbiAgICB0aGlzLnNldHVwUmVzcG9uc2l2ZUNoZWNrcygpXG4gIH1cblxuICAvKipcbiAgICogU2V0dXAgdmlld3BvcnQgcmVzaXplIGNoZWNrXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzZXR1cFJlc3BvbnNpdmVDaGVja3MoKSB7XG4gICAgY29uc3QgYnJlYWtwb2ludCA9IGdldEJyZWFrcG9pbnQoJ3RhYmxldCcpXG5cbiAgICBpZiAoIWJyZWFrcG9pbnQudmFsdWUpIHtcbiAgICAgIHRocm93IG5ldyBFbGVtZW50RXJyb3Ioe1xuICAgICAgICBjb21wb25lbnQ6IFRhYnMsXG4gICAgICAgIGlkZW50aWZpZXI6IGBDU1MgY3VzdG9tIHByb3BlcnR5IChcXGAke2JyZWFrcG9pbnQucHJvcGVydHl9XFxgKSBvbiBwc2V1ZG8tY2xhc3MgXFxgOnJvb3RcXGBgXG4gICAgICB9KVxuICAgIH1cblxuICAgIC8vIE1lZGlhIHF1ZXJ5IGxpc3QgZm9yIEdPVi5VSyBGcm9udGVuZCB0YWJsZXQgYnJlYWtwb2ludFxuICAgIHRoaXMubXFsID0gd2luZG93Lm1hdGNoTWVkaWEoYChtaW4td2lkdGg6ICR7YnJlYWtwb2ludC52YWx1ZX0pYClcblxuICAgIC8vIE1lZGlhUXVlcnlMaXN0LmFkZEV2ZW50TGlzdGVuZXIgaXNuJ3Qgc3VwcG9ydGVkIGJ5IFNhZmFyaSA8IDE0IHNvIHdlIG5lZWRcbiAgICAvLyB0byBiZSBhYmxlIHRvIGZhbGwgYmFjayB0byB0aGUgZGVwcmVjYXRlZCBNZWRpYVF1ZXJ5TGlzdC5hZGRMaXN0ZW5lclxuICAgIGlmICgnYWRkRXZlbnRMaXN0ZW5lcicgaW4gdGhpcy5tcWwpIHtcbiAgICAgIHRoaXMubXFsLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsICgpID0+IHRoaXMuY2hlY2tNb2RlKCkpXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEB0cy1leHBlY3QtZXJyb3IgUHJvcGVydHkgJ2FkZExpc3RlbmVyJyBkb2VzIG5vdCBleGlzdFxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby11bnNhZmUtY2FsbFxuICAgICAgdGhpcy5tcWwuYWRkTGlzdGVuZXIoKCkgPT4gdGhpcy5jaGVja01vZGUoKSlcbiAgICB9XG5cbiAgICB0aGlzLmNoZWNrTW9kZSgpXG4gIH1cblxuICAvKipcbiAgICogU2V0dXAgb3IgdGVhcmRvd24gaGFuZGxlciBmb3Igdmlld3BvcnQgcmVzaXplIGNoZWNrXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBjaGVja01vZGUoKSB7XG4gICAgaWYgKHRoaXMubXFsPy5tYXRjaGVzKSB7XG4gICAgICB0aGlzLnNldHVwKClcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy50ZWFyZG93bigpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldHVwIHRhYiBjb21wb25lbnRcbiAgICpcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHNldHVwKCkge1xuICAgIHRoaXMuJHRhYkxpc3Quc2V0QXR0cmlidXRlKCdyb2xlJywgJ3RhYmxpc3QnKVxuXG4gICAgdGhpcy4kdGFiTGlzdEl0ZW1zLmZvckVhY2goKCRpdGVtKSA9PiB7XG4gICAgICAkaXRlbS5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAncHJlc2VudGF0aW9uJylcbiAgICB9KVxuXG4gICAgdGhpcy4kdGFicy5mb3JFYWNoKCgkdGFiKSA9PiB7XG4gICAgICAvLyBTZXQgSFRNTCBhdHRyaWJ1dGVzXG4gICAgICB0aGlzLnNldEF0dHJpYnV0ZXMoJHRhYilcblxuICAgICAgLy8gSGFuZGxlIGV2ZW50c1xuICAgICAgJHRhYi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuYm91bmRUYWJDbGljaywgdHJ1ZSlcbiAgICAgICR0YWIuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMuYm91bmRUYWJLZXlkb3duLCB0cnVlKVxuXG4gICAgICAvLyBSZW1vdmUgb2xkIGFjdGl2ZSBwYW5lbHNcbiAgICAgIHRoaXMuaGlkZVRhYigkdGFiKVxuICAgIH0pXG5cbiAgICAvLyBTaG93IGVpdGhlciB0aGUgYWN0aXZlIHRhYiBhY2NvcmRpbmcgdG8gdGhlIFVSTCdzIGhhc2ggb3IgdGhlIGZpcnN0IHRhYlxuICAgIGNvbnN0ICRhY3RpdmVUYWIgPSB0aGlzLmdldFRhYih3aW5kb3cubG9jYXRpb24uaGFzaCkgPz8gdGhpcy4kdGFic1swXVxuXG4gICAgdGhpcy5zaG93VGFiKCRhY3RpdmVUYWIpXG5cbiAgICAvLyBIYW5kbGUgaGFzaGNoYW5nZSBldmVudHNcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignaGFzaGNoYW5nZScsIHRoaXMuYm91bmRPbkhhc2hDaGFuZ2UsIHRydWUpXG4gIH1cblxuICAvKipcbiAgICogVGVhcmRvd24gdGFiIGNvbXBvbmVudFxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgdGVhcmRvd24oKSB7XG4gICAgdGhpcy4kdGFiTGlzdC5yZW1vdmVBdHRyaWJ1dGUoJ3JvbGUnKVxuXG4gICAgdGhpcy4kdGFiTGlzdEl0ZW1zLmZvckVhY2goKCRpdGVtKSA9PiB7XG4gICAgICAkaXRlbS5yZW1vdmVBdHRyaWJ1dGUoJ3JvbGUnKVxuICAgIH0pXG5cbiAgICB0aGlzLiR0YWJzLmZvckVhY2goKCR0YWIpID0+IHtcbiAgICAgIC8vIFJlbW92ZSBldmVudHNcbiAgICAgICR0YWIucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmJvdW5kVGFiQ2xpY2ssIHRydWUpXG4gICAgICAkdGFiLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmJvdW5kVGFiS2V5ZG93biwgdHJ1ZSlcblxuICAgICAgLy8gVW5zZXQgSFRNTCBhdHRyaWJ1dGVzXG4gICAgICB0aGlzLnVuc2V0QXR0cmlidXRlcygkdGFiKVxuICAgIH0pXG5cbiAgICAvLyBSZW1vdmUgaGFzaGNoYW5nZSBldmVudCBoYW5kbGVyXG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2hhc2hjaGFuZ2UnLCB0aGlzLmJvdW5kT25IYXNoQ2hhbmdlLCB0cnVlKVxuICB9XG5cbiAgLyoqXG4gICAqIEhhbmRsZSBoYXNoY2hhbmdlIGV2ZW50XG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEByZXR1cm5zIHt2b2lkIHwgdW5kZWZpbmVkfSBSZXR1cm5zIHZvaWQsIG9yIHVuZGVmaW5lZCB3aGVuIHByZXZlbnRlZFxuICAgKi9cbiAgb25IYXNoQ2hhbmdlKCkge1xuICAgIGNvbnN0IGhhc2ggPSB3aW5kb3cubG9jYXRpb24uaGFzaFxuICAgIGNvbnN0ICR0YWJXaXRoSGFzaCA9IHRoaXMuZ2V0VGFiKGhhc2gpXG4gICAgaWYgKCEkdGFiV2l0aEhhc2gpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIC8vIFByZXZlbnQgY2hhbmdpbmcgdGhlIGhhc2hcbiAgICBpZiAodGhpcy5jaGFuZ2luZ0hhc2gpIHtcbiAgICAgIHRoaXMuY2hhbmdpbmdIYXNoID0gZmFsc2VcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIC8vIFNob3cgZWl0aGVyIHRoZSBhY3RpdmUgdGFiIGFjY29yZGluZyB0byB0aGUgVVJMJ3MgaGFzaCBvciB0aGUgZmlyc3QgdGFiXG4gICAgY29uc3QgJHByZXZpb3VzVGFiID0gdGhpcy5nZXRDdXJyZW50VGFiKClcbiAgICBpZiAoISRwcmV2aW91c1RhYikge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgdGhpcy5oaWRlVGFiKCRwcmV2aW91c1RhYilcbiAgICB0aGlzLnNob3dUYWIoJHRhYldpdGhIYXNoKVxuICAgICR0YWJXaXRoSGFzaC5mb2N1cygpXG4gIH1cblxuICAvKipcbiAgICogSGlkZSBwYW5lbCBmb3IgdGFiIGxpbmtcbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtIVE1MQW5jaG9yRWxlbWVudH0gJHRhYiAtIFRhYiBsaW5rXG4gICAqL1xuICBoaWRlVGFiKCR0YWIpIHtcbiAgICB0aGlzLnVuaGlnaGxpZ2h0VGFiKCR0YWIpXG4gICAgdGhpcy5oaWRlUGFuZWwoJHRhYilcbiAgfVxuXG4gIC8qKlxuICAgKiBTaG93IHBhbmVsIGZvciB0YWIgbGlua1xuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge0hUTUxBbmNob3JFbGVtZW50fSAkdGFiIC0gVGFiIGxpbmtcbiAgICovXG4gIHNob3dUYWIoJHRhYikge1xuICAgIHRoaXMuaGlnaGxpZ2h0VGFiKCR0YWIpXG4gICAgdGhpcy5zaG93UGFuZWwoJHRhYilcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGFiIGxpbmsgYnkgaGFzaFxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gaGFzaCAtIEhhc2ggZnJhZ21lbnQgaW5jbHVkaW5nICNcbiAgICogQHJldHVybnMge0hUTUxBbmNob3JFbGVtZW50IHwgbnVsbH0gVGFiIGxpbmtcbiAgICovXG4gIGdldFRhYihoYXNoKSB7XG4gICAgcmV0dXJuIHRoaXMuJHJvb3QucXVlcnlTZWxlY3RvcihgYS5nb3Z1ay10YWJzX190YWJbaHJlZj1cIiR7aGFzaH1cIl1gKVxuICB9XG5cbiAgLyoqXG4gICAqIFNldCB0YWIgbGluayBhbmQgcGFuZWwgYXR0cmlidXRlc1xuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge0hUTUxBbmNob3JFbGVtZW50fSAkdGFiIC0gVGFiIGxpbmtcbiAgICovXG4gIHNldEF0dHJpYnV0ZXMoJHRhYikge1xuICAgIGNvbnN0IHBhbmVsSWQgPSBnZXRGcmFnbWVudEZyb21VcmwoJHRhYi5ocmVmKVxuICAgIGlmICghcGFuZWxJZCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgLy8gU2V0IHRhYiBhdHRyaWJ1dGVzXG4gICAgJHRhYi5zZXRBdHRyaWJ1dGUoJ2lkJywgYHRhYl8ke3BhbmVsSWR9YClcbiAgICAkdGFiLnNldEF0dHJpYnV0ZSgncm9sZScsICd0YWInKVxuICAgICR0YWIuc2V0QXR0cmlidXRlKCdhcmlhLWNvbnRyb2xzJywgcGFuZWxJZClcbiAgICAkdGFiLnNldEF0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcsICdmYWxzZScpXG4gICAgJHRhYi5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgJy0xJylcblxuICAgIC8vIFNldCBwYW5lbCBhdHRyaWJ1dGVzXG4gICAgY29uc3QgJHBhbmVsID0gdGhpcy5nZXRQYW5lbCgkdGFiKVxuICAgIGlmICghJHBhbmVsKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICAkcGFuZWwuc2V0QXR0cmlidXRlKCdyb2xlJywgJ3RhYnBhbmVsJylcbiAgICAkcGFuZWwuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsbGVkYnknLCAkdGFiLmlkKVxuICAgICRwYW5lbC5jbGFzc0xpc3QuYWRkKHRoaXMuanNIaWRkZW5DbGFzcylcbiAgfVxuXG4gIC8qKlxuICAgKiBVbnNldCB0YWIgbGluayBhbmQgcGFuZWwgYXR0cmlidXRlc1xuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge0hUTUxBbmNob3JFbGVtZW50fSAkdGFiIC0gVGFiIGxpbmtcbiAgICovXG4gIHVuc2V0QXR0cmlidXRlcygkdGFiKSB7XG4gICAgLy8gdW5zZXQgdGFiIGF0dHJpYnV0ZXNcbiAgICAkdGFiLnJlbW92ZUF0dHJpYnV0ZSgnaWQnKVxuICAgICR0YWIucmVtb3ZlQXR0cmlidXRlKCdyb2xlJylcbiAgICAkdGFiLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1jb250cm9scycpXG4gICAgJHRhYi5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnKVxuICAgICR0YWIucmVtb3ZlQXR0cmlidXRlKCd0YWJpbmRleCcpXG5cbiAgICAvLyB1bnNldCBwYW5lbCBhdHRyaWJ1dGVzXG4gICAgY29uc3QgJHBhbmVsID0gdGhpcy5nZXRQYW5lbCgkdGFiKVxuICAgIGlmICghJHBhbmVsKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICAkcGFuZWwucmVtb3ZlQXR0cmlidXRlKCdyb2xlJylcbiAgICAkcGFuZWwucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWxhYmVsbGVkYnknKVxuICAgICRwYW5lbC5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuanNIaWRkZW5DbGFzcylcbiAgfVxuXG4gIC8qKlxuICAgKiBIYW5kbGUgdGFiIGxpbmsgY2xpY2tzXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7TW91c2VFdmVudH0gZXZlbnQgLSBNb3VzZSBjbGljayBldmVudFxuICAgKiBAcmV0dXJucyB7dm9pZH0gUmV0dXJucyB2b2lkXG4gICAqL1xuICBvblRhYkNsaWNrKGV2ZW50KSB7XG4gICAgY29uc3QgJGN1cnJlbnRUYWIgPSB0aGlzLmdldEN1cnJlbnRUYWIoKVxuICAgIGNvbnN0ICRuZXh0VGFiID0gZXZlbnQuY3VycmVudFRhcmdldFxuXG4gICAgaWYgKCEkY3VycmVudFRhYiB8fCAhKCRuZXh0VGFiIGluc3RhbmNlb2YgSFRNTEFuY2hvckVsZW1lbnQpKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cbiAgICB0aGlzLmhpZGVUYWIoJGN1cnJlbnRUYWIpXG4gICAgdGhpcy5zaG93VGFiKCRuZXh0VGFiKVxuICAgIHRoaXMuY3JlYXRlSGlzdG9yeUVudHJ5KCRuZXh0VGFiKVxuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSBicm93c2VyIFVSTCBoYXNoIGZyYWdtZW50IGZvciB0YWJcbiAgICpcbiAgICogLSBBbGxvd3MgYmFjay9mb3J3YXJkIHRvIG5hdmlnYXRlIHRhYnNcbiAgICogLSBBdm9pZHMgcGFnZSBqdW1wIHdoZW4gaGFzaCBjaGFuZ2VzXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7SFRNTEFuY2hvckVsZW1lbnR9ICR0YWIgLSBUYWIgbGlua1xuICAgKi9cbiAgY3JlYXRlSGlzdG9yeUVudHJ5KCR0YWIpIHtcbiAgICBjb25zdCAkcGFuZWwgPSB0aGlzLmdldFBhbmVsKCR0YWIpXG4gICAgaWYgKCEkcGFuZWwpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIC8vIFNhdmUgYW5kIHJlc3RvcmUgdGhlIGlkIHNvIHRoZSBwYWdlIGRvZXNuJ3QganVtcCB3aGVuIGEgdXNlciBjbGlja3MgYSB0YWJcbiAgICAvLyAod2hpY2ggY2hhbmdlcyB0aGUgaGFzaClcbiAgICBjb25zdCBwYW5lbElkID0gJHBhbmVsLmlkXG4gICAgJHBhbmVsLmlkID0gJydcbiAgICB0aGlzLmNoYW5naW5nSGFzaCA9IHRydWVcbiAgICB3aW5kb3cubG9jYXRpb24uaGFzaCA9IHBhbmVsSWRcbiAgICAkcGFuZWwuaWQgPSBwYW5lbElkXG4gIH1cblxuICAvKipcbiAgICogSGFuZGxlIHRhYiBrZXlkb3duIGV2ZW50XG4gICAqXG4gICAqIC0gUHJlc3MgcmlnaHQgYXJyb3cgZm9yIG5leHQgdGFiXG4gICAqIC0gUHJlc3MgbGVmdCBhcnJvdyBmb3IgcHJldmlvdXMgdGFiXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgLSBLZXlkb3duIGV2ZW50XG4gICAqL1xuICBvblRhYktleWRvd24oZXZlbnQpIHtcbiAgICBzd2l0Y2ggKGV2ZW50LmtleSkge1xuICAgICAgLy8gJ0xlZnQnIGFuZCAnUmlnaHQnIHJlcXVpcmVkIGZvciBFZGdlIDE2IHN1cHBvcnQuXG4gICAgICBjYXNlICdBcnJvd0xlZnQnOlxuICAgICAgY2FzZSAnTGVmdCc6XG4gICAgICAgIHRoaXMuYWN0aXZhdGVQcmV2aW91c1RhYigpXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgJ0Fycm93UmlnaHQnOlxuICAgICAgY2FzZSAnUmlnaHQnOlxuICAgICAgICB0aGlzLmFjdGl2YXRlTmV4dFRhYigpXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgYnJlYWtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWN0aXZhdGUgbmV4dCB0YWJcbiAgICpcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGFjdGl2YXRlTmV4dFRhYigpIHtcbiAgICBjb25zdCAkY3VycmVudFRhYiA9IHRoaXMuZ2V0Q3VycmVudFRhYigpXG4gICAgaWYgKCEkY3VycmVudFRhYj8ucGFyZW50RWxlbWVudCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgY29uc3QgJG5leHRUYWJMaXN0SXRlbSA9ICRjdXJyZW50VGFiLnBhcmVudEVsZW1lbnQubmV4dEVsZW1lbnRTaWJsaW5nXG4gICAgaWYgKCEkbmV4dFRhYkxpc3RJdGVtKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBjb25zdCAkbmV4dFRhYiA9ICRuZXh0VGFiTGlzdEl0ZW0ucXVlcnlTZWxlY3RvcignYS5nb3Z1ay10YWJzX190YWInKVxuICAgIGlmICghJG5leHRUYWIpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIHRoaXMuaGlkZVRhYigkY3VycmVudFRhYilcbiAgICB0aGlzLnNob3dUYWIoJG5leHRUYWIpXG4gICAgJG5leHRUYWIuZm9jdXMoKVxuICAgIHRoaXMuY3JlYXRlSGlzdG9yeUVudHJ5KCRuZXh0VGFiKVxuICB9XG5cbiAgLyoqXG4gICAqIEFjdGl2YXRlIHByZXZpb3VzIHRhYlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgYWN0aXZhdGVQcmV2aW91c1RhYigpIHtcbiAgICBjb25zdCAkY3VycmVudFRhYiA9IHRoaXMuZ2V0Q3VycmVudFRhYigpXG4gICAgaWYgKCEkY3VycmVudFRhYj8ucGFyZW50RWxlbWVudCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgY29uc3QgJHByZXZpb3VzVGFiTGlzdEl0ZW0gPVxuICAgICAgJGN1cnJlbnRUYWIucGFyZW50RWxlbWVudC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nXG4gICAgaWYgKCEkcHJldmlvdXNUYWJMaXN0SXRlbSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgY29uc3QgJHByZXZpb3VzVGFiID0gJHByZXZpb3VzVGFiTGlzdEl0ZW0ucXVlcnlTZWxlY3RvcignYS5nb3Z1ay10YWJzX190YWInKVxuICAgIGlmICghJHByZXZpb3VzVGFiKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICB0aGlzLmhpZGVUYWIoJGN1cnJlbnRUYWIpXG4gICAgdGhpcy5zaG93VGFiKCRwcmV2aW91c1RhYilcbiAgICAkcHJldmlvdXNUYWIuZm9jdXMoKVxuICAgIHRoaXMuY3JlYXRlSGlzdG9yeUVudHJ5KCRwcmV2aW91c1RhYilcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGFiIHBhbmVsIGZvciB0YWIgbGlua1xuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge0hUTUxBbmNob3JFbGVtZW50fSAkdGFiIC0gVGFiIGxpbmtcbiAgICogQHJldHVybnMge0VsZW1lbnQgfCBudWxsfSBUYWIgcGFuZWxcbiAgICovXG4gIGdldFBhbmVsKCR0YWIpIHtcbiAgICBjb25zdCBwYW5lbElkID0gZ2V0RnJhZ21lbnRGcm9tVXJsKCR0YWIuaHJlZilcbiAgICBpZiAoIXBhbmVsSWQpIHtcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuJHJvb3QucXVlcnlTZWxlY3RvcihgIyR7cGFuZWxJZH1gKVxuICB9XG5cbiAgLyoqXG4gICAqIFNob3cgdGFiIHBhbmVsIGZvciB0YWIgbGlua1xuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge0hUTUxBbmNob3JFbGVtZW50fSAkdGFiIC0gVGFiIGxpbmtcbiAgICovXG4gIHNob3dQYW5lbCgkdGFiKSB7XG4gICAgY29uc3QgJHBhbmVsID0gdGhpcy5nZXRQYW5lbCgkdGFiKVxuICAgIGlmICghJHBhbmVsKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICAkcGFuZWwuY2xhc3NMaXN0LnJlbW92ZSh0aGlzLmpzSGlkZGVuQ2xhc3MpXG4gIH1cblxuICAvKipcbiAgICogSGlkZSB0YWIgcGFuZWwgZm9yIHRhYiBsaW5rXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7SFRNTEFuY2hvckVsZW1lbnR9ICR0YWIgLSBUYWIgbGlua1xuICAgKi9cbiAgaGlkZVBhbmVsKCR0YWIpIHtcbiAgICBjb25zdCAkcGFuZWwgPSB0aGlzLmdldFBhbmVsKCR0YWIpXG4gICAgaWYgKCEkcGFuZWwpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgICRwYW5lbC5jbGFzc0xpc3QuYWRkKHRoaXMuanNIaWRkZW5DbGFzcylcbiAgfVxuXG4gIC8qKlxuICAgKiBVbnNldCAnc2VsZWN0ZWQnIHN0YXRlIGZvciB0YWIgbGlua1xuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge0hUTUxBbmNob3JFbGVtZW50fSAkdGFiIC0gVGFiIGxpbmtcbiAgICovXG4gIHVuaGlnaGxpZ2h0VGFiKCR0YWIpIHtcbiAgICBpZiAoISR0YWIucGFyZW50RWxlbWVudCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgJHRhYi5zZXRBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnLCAnZmFsc2UnKVxuICAgICR0YWIucGFyZW50RWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdnb3Z1ay10YWJzX19saXN0LWl0ZW0tLXNlbGVjdGVkJylcbiAgICAkdGFiLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnLTEnKVxuICB9XG5cbiAgLyoqXG4gICAqIFNldCAnc2VsZWN0ZWQnIHN0YXRlIGZvciB0YWIgbGlua1xuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge0hUTUxBbmNob3JFbGVtZW50fSAkdGFiIC0gVGFiIGxpbmtcbiAgICovXG4gIGhpZ2hsaWdodFRhYigkdGFiKSB7XG4gICAgaWYgKCEkdGFiLnBhcmVudEVsZW1lbnQpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgICR0YWIuc2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJywgJ3RydWUnKVxuICAgICR0YWIucGFyZW50RWxlbWVudC5jbGFzc0xpc3QuYWRkKCdnb3Z1ay10YWJzX19saXN0LWl0ZW0tLXNlbGVjdGVkJylcbiAgICAkdGFiLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnMCcpXG4gIH1cblxuICAvKipcbiAgICogR2V0IGN1cnJlbnQgdGFiIGxpbmtcbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHJldHVybnMge0hUTUxBbmNob3JFbGVtZW50IHwgbnVsbH0gVGFiIGxpbmtcbiAgICovXG4gIGdldEN1cnJlbnRUYWIoKSB7XG4gICAgcmV0dXJuIHRoaXMuJHJvb3QucXVlcnlTZWxlY3RvcihcbiAgICAgICcuZ292dWstdGFic19fbGlzdC1pdGVtLS1zZWxlY3RlZCBhLmdvdnVrLXRhYnNfX3RhYidcbiAgICApXG4gIH1cblxuICAvKipcbiAgICogTmFtZSBmb3IgdGhlIGNvbXBvbmVudCB1c2VkIHdoZW4gaW5pdGlhbGlzaW5nIHVzaW5nIGRhdGEtbW9kdWxlIGF0dHJpYnV0ZXMuXG4gICAqL1xuICBzdGF0aWMgbW9kdWxlTmFtZSA9ICdnb3Z1ay10YWJzJ1xufVxuIiwiaW1wb3J0IHsgZm9ybWF0RXJyb3JNZXNzYWdlIH0gZnJvbSAnLi4vY29tbW9uL2luZGV4Lm1qcydcblxuLyoqXG4gKiBHT1YuVUsgRnJvbnRlbmQgZXJyb3JcbiAqXG4gKiBBIGJhc2UgY2xhc3MgZm9yIGBFcnJvcmBzIHRocm93biBieSBHT1YuVUsgRnJvbnRlbmQuXG4gKlxuICogSXQgaXMgbWVhbnQgdG8gYmUgZXh0ZW5kZWQgaW50byBzcGVjaWZpYyB0eXBlcyBvZiBlcnJvcnNcbiAqIHRvIGJlIHRocm93biBieSBvdXIgY29kZS5cbiAqXG4gKiBAZXhhbXBsZVxuICogYGBganNcbiAqIGNsYXNzIE1pc3NpbmdSb290RXJyb3IgZXh0ZW5kcyBHT1ZVS0Zyb250ZW5kRXJyb3Ige1xuICogICAvLyBTZXR0aW5nIGFuIGV4cGxpY2l0IG5hbWUgaXMgaW1wb3J0YW50IGFzIGV4dGVuZGluZyB0aGUgY2xhc3Mgd2lsbCBub3RcbiAqICAgLy8gc2V0IGEgbmV3IGBuYW1lYCBvbiB0aGUgc3ViY2xhc3MuIFRoZSBgbmFtZWAgcHJvcGVydHkgaXMgaW1wb3J0YW50XG4gKiAgIC8vIHRvIGVuc3VyZSBpbnRlbGxpZ2libGUgZXJyb3IgbmFtZXMgZXZlbiBpZiB0aGUgY2xhc3MgbmFtZSBnZXRzXG4gKiAgIC8vIG1hbmdsZWQgYnkgYSBtaW5pZmllclxuICogICBuYW1lID0gXCJNaXNzaW5nUm9vdEVycm9yXCJcbiAqIH1cbiAqIGBgYFxuICogQHZpcnR1YWxcbiAqL1xuZXhwb3J0IGNsYXNzIEdPVlVLRnJvbnRlbmRFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgbmFtZSA9ICdHT1ZVS0Zyb250ZW5kRXJyb3InXG59XG5cbi8qKlxuICogSW5kaWNhdGVzIHRoYXQgR09WLlVLIEZyb250ZW5kIGlzIG5vdCBzdXBwb3J0ZWRcbiAqL1xuZXhwb3J0IGNsYXNzIFN1cHBvcnRFcnJvciBleHRlbmRzIEdPVlVLRnJvbnRlbmRFcnJvciB7XG4gIG5hbWUgPSAnU3VwcG9ydEVycm9yJ1xuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgR09WLlVLIEZyb250ZW5kIGlzIHN1cHBvcnRlZCBvbiB0aGlzIHBhZ2VcbiAgICpcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudCB8IG51bGx9IFskc2NvcGVdIC0gSFRNTCBlbGVtZW50IGA8Ym9keT5gIGNoZWNrZWQgZm9yIGJyb3dzZXIgc3VwcG9ydFxuICAgKi9cbiAgY29uc3RydWN0b3IoJHNjb3BlID0gZG9jdW1lbnQuYm9keSkge1xuICAgIGNvbnN0IHN1cHBvcnRNZXNzYWdlID1cbiAgICAgICdub01vZHVsZScgaW4gSFRNTFNjcmlwdEVsZW1lbnQucHJvdG90eXBlXG4gICAgICAgID8gJ0dPVi5VSyBGcm9udGVuZCBpbml0aWFsaXNlZCB3aXRob3V0IGA8Ym9keSBjbGFzcz1cImdvdnVrLWZyb250ZW5kLXN1cHBvcnRlZFwiPmAgZnJvbSB0ZW1wbGF0ZSBgPHNjcmlwdD5gIHNuaXBwZXQnXG4gICAgICAgIDogJ0dPVi5VSyBGcm9udGVuZCBpcyBub3Qgc3VwcG9ydGVkIGluIHRoaXMgYnJvd3NlcidcblxuICAgIHN1cGVyKFxuICAgICAgJHNjb3BlXG4gICAgICAgID8gc3VwcG9ydE1lc3NhZ2VcbiAgICAgICAgOiAnR09WLlVLIEZyb250ZW5kIGluaXRpYWxpc2VkIHdpdGhvdXQgYDxzY3JpcHQgdHlwZT1cIm1vZHVsZVwiPmAnXG4gICAgKVxuICB9XG59XG5cbi8qKlxuICogSW5kaWNhdGVzIHRoYXQgYSBjb21wb25lbnQgaGFzIHJlY2VpdmVkIGFuIGlsbGVnYWwgY29uZmlndXJhdGlvblxuICovXG5leHBvcnQgY2xhc3MgQ29uZmlnRXJyb3IgZXh0ZW5kcyBHT1ZVS0Zyb250ZW5kRXJyb3Ige1xuICBuYW1lID0gJ0NvbmZpZ0Vycm9yJ1xufVxuXG4vKipcbiAqIEluZGljYXRlcyBhbiBpc3N1ZSB3aXRoIGFuIGVsZW1lbnQgKHBvc3NpYmx5IGBudWxsYCBvciBgdW5kZWZpbmVkYClcbiAqL1xuZXhwb3J0IGNsYXNzIEVsZW1lbnRFcnJvciBleHRlbmRzIEdPVlVLRnJvbnRlbmRFcnJvciB7XG4gIG5hbWUgPSAnRWxlbWVudEVycm9yJ1xuXG4gIC8qKlxuICAgKiBAaW50ZXJuYWxcbiAgICogQG92ZXJsb2FkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlIC0gRWxlbWVudCBlcnJvciBtZXNzYWdlXG4gICAqL1xuXG4gIC8qKlxuICAgKiBAaW50ZXJuYWxcbiAgICogQG92ZXJsb2FkXG4gICAqIEBwYXJhbSB7RWxlbWVudEVycm9yT3B0aW9uc30gb3B0aW9ucyAtIEVsZW1lbnQgZXJyb3Igb3B0aW9uc1xuICAgKi9cblxuICAvKipcbiAgICogQGludGVybmFsXG4gICAqIEBwYXJhbSB7c3RyaW5nIHwgRWxlbWVudEVycm9yT3B0aW9uc30gbWVzc2FnZU9yT3B0aW9ucyAtIEVsZW1lbnQgZXJyb3IgbWVzc2FnZSBvciBvcHRpb25zXG4gICAqL1xuICBjb25zdHJ1Y3RvcihtZXNzYWdlT3JPcHRpb25zKSB7XG4gICAgbGV0IG1lc3NhZ2UgPSB0eXBlb2YgbWVzc2FnZU9yT3B0aW9ucyA9PT0gJ3N0cmluZycgPyBtZXNzYWdlT3JPcHRpb25zIDogJydcblxuICAgIC8vIEJ1aWxkIG1lc3NhZ2UgZnJvbSBvcHRpb25zXG4gICAgaWYgKHR5cGVvZiBtZXNzYWdlT3JPcHRpb25zID09PSAnb2JqZWN0Jykge1xuICAgICAgY29uc3QgeyBjb21wb25lbnQsIGlkZW50aWZpZXIsIGVsZW1lbnQsIGV4cGVjdGVkVHlwZSB9ID0gbWVzc2FnZU9yT3B0aW9uc1xuXG4gICAgICBtZXNzYWdlID0gaWRlbnRpZmllclxuXG4gICAgICAvLyBBcHBlbmQgcmVhc29uXG4gICAgICBtZXNzYWdlICs9IGVsZW1lbnRcbiAgICAgICAgPyBgIGlzIG5vdCBvZiB0eXBlICR7ZXhwZWN0ZWRUeXBlID8/ICdIVE1MRWxlbWVudCd9YFxuICAgICAgICA6ICcgbm90IGZvdW5kJ1xuXG4gICAgICBtZXNzYWdlID0gZm9ybWF0RXJyb3JNZXNzYWdlKGNvbXBvbmVudCwgbWVzc2FnZSlcbiAgICB9XG5cbiAgICBzdXBlcihtZXNzYWdlKVxuICB9XG59XG5cbi8qKlxuICogSW5kaWNhdGVzIHRoYXQgYSBjb21wb25lbnQgaXMgYWxyZWFkeSBpbml0aWFsaXNlZFxuICovXG5leHBvcnQgY2xhc3MgSW5pdEVycm9yIGV4dGVuZHMgR09WVUtGcm9udGVuZEVycm9yIHtcbiAgbmFtZSA9ICdJbml0RXJyb3InXG5cbiAgLyoqXG4gICAqIEBpbnRlcm5hbFxuICAgKiBAcGFyYW0ge0NvbXBvbmVudFdpdGhNb2R1bGVOYW1lIHwgc3RyaW5nfSBjb21wb25lbnRPck1lc3NhZ2UgLSBuYW1lIG9mIHRoZSBjb21wb25lbnQgbW9kdWxlXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihjb21wb25lbnRPck1lc3NhZ2UpIHtcbiAgICBjb25zdCBtZXNzYWdlID1cbiAgICAgIHR5cGVvZiBjb21wb25lbnRPck1lc3NhZ2UgPT09ICdzdHJpbmcnXG4gICAgICAgID8gY29tcG9uZW50T3JNZXNzYWdlXG4gICAgICAgIDogZm9ybWF0RXJyb3JNZXNzYWdlKFxuICAgICAgICAgICAgY29tcG9uZW50T3JNZXNzYWdlLFxuICAgICAgICAgICAgYFJvb3QgZWxlbWVudCAoXFxgJHJvb3RcXGApIGFscmVhZHkgaW5pdGlhbGlzZWRgXG4gICAgICAgICAgKVxuXG4gICAgc3VwZXIobWVzc2FnZSlcbiAgfVxufVxuXG4vKipcbiAqIEVsZW1lbnQgZXJyb3Igb3B0aW9uc1xuICpcbiAqIEBpbnRlcm5hbFxuICogQHR5cGVkZWYge29iamVjdH0gRWxlbWVudEVycm9yT3B0aW9uc1xuICogQHByb3BlcnR5IHtzdHJpbmd9IGlkZW50aWZpZXIgLSBBbiBpZGVudGlmaWVyIHRoYXQnbGwgbGV0IHRoZSB1c2VyIHVuZGVyc3RhbmQgd2hpY2ggZWxlbWVudCBoYXMgYW4gZXJyb3IuIFRoaXMgaXMgd2hhdGV2ZXIgbWFrZXMgdGhlIG1vc3Qgc2Vuc2VcbiAqIEBwcm9wZXJ0eSB7RWxlbWVudCB8IG51bGx9IFtlbGVtZW50XSAtIFRoZSBlbGVtZW50IGluIGVycm9yXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW2V4cGVjdGVkVHlwZV0gLSBUaGUgdHlwZSB0aGF0IHdhcyBleHBlY3RlZCBmb3IgdGhlIGlkZW50aWZpZXJcbiAqIEBwcm9wZXJ0eSB7Q29tcG9uZW50V2l0aE1vZHVsZU5hbWV9IGNvbXBvbmVudCAtIENvbXBvbmVudCB0aHJvd2luZyB0aGUgZXJyb3JcbiAqL1xuXG4vKipcbiAqIEBpbXBvcnQgeyBDb21wb25lbnRXaXRoTW9kdWxlTmFtZSB9IGZyb20gJy4uL2NvbW1vbi9pbmRleC5tanMnXG4gKi9cbiIsIi8qKlxuICogSW50ZXJuYWwgc3VwcG9ydCBmb3Igc2VsZWN0aW5nIG1lc3NhZ2VzIHRvIHJlbmRlciwgd2l0aCBwbGFjZWhvbGRlclxuICogaW50ZXJwb2xhdGlvbiBhbmQgbG9jYWxlLWF3YXJlIG51bWJlciBmb3JtYXR0aW5nIGFuZCBwbHVyYWxpc2F0aW9uXG4gKlxuICogQGludGVybmFsXG4gKi9cbmV4cG9ydCBjbGFzcyBJMThuIHtcbiAgdHJhbnNsYXRpb25zXG4gIGxvY2FsZVxuXG4gIC8qKlxuICAgKiBAaW50ZXJuYWxcbiAgICogQHBhcmFtIHt7IFtrZXk6IHN0cmluZ106IHN0cmluZyB8IFRyYW5zbGF0aW9uUGx1cmFsRm9ybXMgfX0gdHJhbnNsYXRpb25zIC0gS2V5LXZhbHVlIHBhaXJzIG9mIHRoZSB0cmFuc2xhdGlvbiBzdHJpbmdzIHRvIHVzZS5cbiAgICogQHBhcmFtIHtvYmplY3R9IFtjb25maWddIC0gQ29uZmlndXJhdGlvbiBvcHRpb25zIGZvciB0aGUgZnVuY3Rpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nIHwgbnVsbH0gW2NvbmZpZy5sb2NhbGVdIC0gQW4gb3ZlcnJpZGluZyBsb2NhbGUgZm9yIHRoZSBQbHVyYWxSdWxlcyBmdW5jdGlvbmFsaXR5LlxuICAgKi9cbiAgY29uc3RydWN0b3IodHJhbnNsYXRpb25zID0ge30sIGNvbmZpZyA9IHt9KSB7XG4gICAgLy8gTWFrZSBsaXN0IG9mIHRyYW5zbGF0aW9ucyBhdmFpbGFibGUgdGhyb3VnaG91dCBmdW5jdGlvblxuICAgIHRoaXMudHJhbnNsYXRpb25zID0gdHJhbnNsYXRpb25zXG5cbiAgICAvLyBUaGUgbG9jYWxlIHRvIHVzZSBmb3IgUGx1cmFsUnVsZXMgYW5kIE51bWJlckZvcm1hdFxuICAgIHRoaXMubG9jYWxlID0gY29uZmlnLmxvY2FsZSA/PyAoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmxhbmcgfHwgJ2VuJylcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgbW9zdCB1c2VkIGZ1bmN0aW9uIC0gdGFrZXMgdGhlIGtleSBmb3IgYSBnaXZlbiBwaWVjZSBvZiBVSSB0ZXh0IGFuZFxuICAgKiByZXR1cm5zIHRoZSBhcHByb3ByaWF0ZSBzdHJpbmcuXG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKiBAcGFyYW0ge3N0cmluZ30gbG9va3VwS2V5IC0gVGhlIGxvb2t1cCBrZXkgb2YgdGhlIHN0cmluZyB0byB1c2UuXG4gICAqIEBwYXJhbSB7eyBba2V5OiBzdHJpbmddOiB1bmtub3duIH19IFtvcHRpb25zXSAtIEFueSBvcHRpb25zIHBhc3NlZCB3aXRoIHRoZSB0cmFuc2xhdGlvbiBzdHJpbmcsIGUuZzogZm9yIHN0cmluZyBpbnRlcnBvbGF0aW9uLlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgYXBwcm9wcmlhdGUgdHJhbnNsYXRpb24gc3RyaW5nLlxuICAgKiBAdGhyb3dzIHtFcnJvcn0gTG9va3VwIGtleSByZXF1aXJlZFxuICAgKiBAdGhyb3dzIHtFcnJvcn0gT3B0aW9ucyByZXF1aXJlZCBmb3IgYCR7fWAgcGxhY2Vob2xkZXJzXG4gICAqL1xuICB0KGxvb2t1cEtleSwgb3B0aW9ucykge1xuICAgIGlmICghbG9va3VwS2V5KSB7XG4gICAgICAvLyBQcmludCBhIGNvbnNvbGUgZXJyb3IgaWYgbm8gbG9va3VwIGtleSBoYXMgYmVlbiBwcm92aWRlZFxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdpMThuOiBsb29rdXAga2V5IG1pc3NpbmcnKVxuICAgIH1cblxuICAgIC8vIEZldGNoIHRoZSB0cmFuc2xhdGlvbiBmb3IgdGhhdCBsb29rdXAga2V5XG4gICAgbGV0IHRyYW5zbGF0aW9uID0gdGhpcy50cmFuc2xhdGlvbnNbbG9va3VwS2V5XVxuXG4gICAgLy8gSWYgdGhlIGBjb3VudGAgb3B0aW9uIGlzIHNldCwgZGV0ZXJtaW5lIHdoaWNoIHBsdXJhbCBzdWZmaXggaXMgbmVlZGVkIGFuZFxuICAgIC8vIGNoYW5nZSB0aGUgbG9va3VwS2V5IHRvIG1hdGNoLiBXZSBjaGVjayB0byBzZWUgaWYgaXQncyBudW1lcmljIGluc3RlYWQgb2ZcbiAgICAvLyBmYWxzeSwgYXMgdGhpcyBjb3VsZCBsZWdpdGltYXRlbHkgYmUgMC5cbiAgICBpZiAodHlwZW9mIG9wdGlvbnM/LmNvdW50ID09PSAnbnVtYmVyJyAmJiB0eXBlb2YgdHJhbnNsYXRpb24gPT09ICdvYmplY3QnKSB7XG4gICAgICBjb25zdCB0cmFuc2xhdGlvblBsdXJhbEZvcm0gPVxuICAgICAgICB0cmFuc2xhdGlvblt0aGlzLmdldFBsdXJhbFN1ZmZpeChsb29rdXBLZXksIG9wdGlvbnMuY291bnQpXVxuXG4gICAgICAvLyBVcGRhdGUgdHJhbnNsYXRpb24gd2l0aCBwbHVyYWwgc3VmZml4XG4gICAgICBpZiAodHJhbnNsYXRpb25QbHVyYWxGb3JtKSB7XG4gICAgICAgIHRyYW5zbGF0aW9uID0gdHJhbnNsYXRpb25QbHVyYWxGb3JtXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiB0cmFuc2xhdGlvbiA9PT0gJ3N0cmluZycpIHtcbiAgICAgIC8vIENoZWNrIGZvciAke30gcGxhY2Vob2xkZXJzIGluIHRoZSB0cmFuc2xhdGlvbiBzdHJpbmdcbiAgICAgIGlmICh0cmFuc2xhdGlvbi5tYXRjaCgvJXsoLlxcUyspfS8pKSB7XG4gICAgICAgIGlmICghb3B0aW9ucykge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgICdpMThuOiBjYW5ub3QgcmVwbGFjZSBwbGFjZWhvbGRlcnMgaW4gc3RyaW5nIGlmIG5vIG9wdGlvbiBkYXRhIHByb3ZpZGVkJ1xuICAgICAgICAgIClcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLnJlcGxhY2VQbGFjZWhvbGRlcnModHJhbnNsYXRpb24sIG9wdGlvbnMpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cmFuc2xhdGlvblxuICAgIH1cblxuICAgIC8vIElmIHRoZSBrZXkgd2Fzbid0IGZvdW5kIGluIG91ciB0cmFuc2xhdGlvbnMgb2JqZWN0LFxuICAgIC8vIHJldHVybiB0aGUgbG9va3VwIGtleSBpdHNlbGYgYXMgdGhlIGZhbGxiYWNrXG4gICAgcmV0dXJuIGxvb2t1cEtleVxuICB9XG5cbiAgLyoqXG4gICAqIFRha2VzIGEgdHJhbnNsYXRpb24gc3RyaW5nIHdpdGggcGxhY2Vob2xkZXJzLCBhbmQgcmVwbGFjZXMgdGhlIHBsYWNlaG9sZGVyc1xuICAgKiB3aXRoIHRoZSBwcm92aWRlZCBkYXRhXG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKiBAcGFyYW0ge3N0cmluZ30gdHJhbnNsYXRpb25TdHJpbmcgLSBUaGUgdHJhbnNsYXRpb24gc3RyaW5nXG4gICAqIEBwYXJhbSB7eyBba2V5OiBzdHJpbmddOiB1bmtub3duIH19IG9wdGlvbnMgLSBBbnkgb3B0aW9ucyBwYXNzZWQgd2l0aCB0aGUgdHJhbnNsYXRpb24gc3RyaW5nLCBlLmc6IGZvciBzdHJpbmcgaW50ZXJwb2xhdGlvbi5cbiAgICogQHJldHVybnMge3N0cmluZ30gVGhlIHRyYW5zbGF0aW9uIHN0cmluZyB0byBvdXRwdXQsIHdpdGggJFxce1xcfSBwbGFjZWhvbGRlcnMgcmVwbGFjZWRcbiAgICovXG4gIHJlcGxhY2VQbGFjZWhvbGRlcnModHJhbnNsYXRpb25TdHJpbmcsIG9wdGlvbnMpIHtcbiAgICBjb25zdCBmb3JtYXR0ZXIgPSBJbnRsLk51bWJlckZvcm1hdC5zdXBwb3J0ZWRMb2NhbGVzT2YodGhpcy5sb2NhbGUpLmxlbmd0aFxuICAgICAgPyBuZXcgSW50bC5OdW1iZXJGb3JtYXQodGhpcy5sb2NhbGUpXG4gICAgICA6IHVuZGVmaW5lZFxuXG4gICAgcmV0dXJuIHRyYW5zbGF0aW9uU3RyaW5nLnJlcGxhY2UoXG4gICAgICAvJXsoLlxcUyspfS9nLFxuXG4gICAgICAvKipcbiAgICAgICAqIFJlcGxhY2UgdHJhbnNsYXRpb24gc3RyaW5nIHBsYWNlaG9sZGVyc1xuICAgICAgICpcbiAgICAgICAqIEBpbnRlcm5hbFxuICAgICAgICogQHBhcmFtIHtzdHJpbmd9IHBsYWNlaG9sZGVyV2l0aEJyYWNlcyAtIFBsYWNlaG9sZGVyIHdpdGggYnJhY2VzXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ30gcGxhY2Vob2xkZXJLZXkgLSBQbGFjZWhvbGRlciBrZXlcbiAgICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IFBsYWNlaG9sZGVyIHZhbHVlXG4gICAgICAgKi9cbiAgICAgIGZ1bmN0aW9uIChwbGFjZWhvbGRlcldpdGhCcmFjZXMsIHBsYWNlaG9sZGVyS2V5KSB7XG4gICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob3B0aW9ucywgcGxhY2Vob2xkZXJLZXkpKSB7XG4gICAgICAgICAgY29uc3QgcGxhY2Vob2xkZXJWYWx1ZSA9IG9wdGlvbnNbcGxhY2Vob2xkZXJLZXldXG5cbiAgICAgICAgICAvLyBJZiBhIHVzZXIgaGFzIHBhc3NlZCBgZmFsc2VgIGFzIHRoZSB2YWx1ZSBmb3IgdGhlIHBsYWNlaG9sZGVyXG4gICAgICAgICAgLy8gdHJlYXQgaXQgYXMgdGhvdWdoIHRoZSB2YWx1ZSBzaG91bGQgbm90IGJlIGRpc3BsYXllZFxuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyVmFsdWUgPT09IGZhbHNlIHx8XG4gICAgICAgICAgICAodHlwZW9mIHBsYWNlaG9sZGVyVmFsdWUgIT09ICdudW1iZXInICYmXG4gICAgICAgICAgICAgIHR5cGVvZiBwbGFjZWhvbGRlclZhbHVlICE9PSAnc3RyaW5nJylcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIHJldHVybiAnJ1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIElmIHRoZSBwbGFjZWhvbGRlcidzIHZhbHVlIGlzIGEgbnVtYmVyLCBsb2NhbGlzZSB0aGUgbnVtYmVyIGZvcm1hdHRpbmdcbiAgICAgICAgICBpZiAodHlwZW9mIHBsYWNlaG9sZGVyVmFsdWUgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICByZXR1cm4gZm9ybWF0dGVyXG4gICAgICAgICAgICAgID8gZm9ybWF0dGVyLmZvcm1hdChwbGFjZWhvbGRlclZhbHVlKVxuICAgICAgICAgICAgICA6IGAke3BsYWNlaG9sZGVyVmFsdWV9YFxuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBwbGFjZWhvbGRlclZhbHVlXG4gICAgICAgIH1cblxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgYGkxOG46IG5vIGRhdGEgZm91bmQgdG8gcmVwbGFjZSAke3BsYWNlaG9sZGVyV2l0aEJyYWNlc30gcGxhY2Vob2xkZXIgaW4gc3RyaW5nYFxuICAgICAgICApXG4gICAgICB9XG4gICAgKVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIHRvIHNlZSBpZiB0aGUgYnJvd3NlciBzdXBwb3J0cyBJbnRsLlBsdXJhbFJ1bGVzXG4gICAqXG4gICAqIEl0IHJlcXVpcmVzIGFsbCBjb25kaXRpb25zIHRvIGJlIG1ldCBpbiBvcmRlciB0byBiZSBzdXBwb3J0ZWQ6XG4gICAqIC0gVGhlIGltcGxlbWVudGF0aW9uIG9mIEludGwgc3VwcG9ydHMgUGx1cmFsUnVsZXMgKE5PVCB0cnVlIGluIFNhZmFyaSAxMOKAkzEyKVxuICAgKiAtIFRoZSBicm93c2VyL09TIGhhcyBwbHVyYWwgcnVsZXMgZm9yIHRoZSBjdXJyZW50IGxvY2FsZSAoYnJvd3NlciBkZXBlbmRlbnQpXG4gICAqXG4gICAqIHtAbGluayBodHRwczovL2Jyb3dzZXJzbC5pc3QvI3E9c3VwcG9ydHMrZXM2LW1vZHVsZSthbmQrbm90K3N1cHBvcnRzK2ludGwtcGx1cmFscnVsZXN9XG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyB0cnVlIGlmIGFsbCBjb25kaXRpb25zIGFyZSBtZXQuIFJldHVybnMgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgKi9cbiAgaGFzSW50bFBsdXJhbFJ1bGVzU3VwcG9ydCgpIHtcbiAgICByZXR1cm4gQm9vbGVhbihcbiAgICAgICdQbHVyYWxSdWxlcycgaW4gd2luZG93LkludGwgJiZcbiAgICAgICAgSW50bC5QbHVyYWxSdWxlcy5zdXBwb3J0ZWRMb2NhbGVzT2YodGhpcy5sb2NhbGUpLmxlbmd0aFxuICAgIClcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGFwcHJvcHJpYXRlIHN1ZmZpeCBmb3IgdGhlIHBsdXJhbCBmb3JtLlxuICAgKlxuICAgKiBVc2VzIEludGwuUGx1cmFsUnVsZXMgKG9yIG91ciBvd24gZmFsbGJhY2sgaW1wbGVtZW50YXRpb24pIHRvIGdldCB0aGVcbiAgICogJ3ByZWZlcnJlZCcgZm9ybSB0byB1c2UgZm9yIHRoZSBnaXZlbiBjb3VudC5cbiAgICpcbiAgICogQ2hlY2tzIHRoYXQgYSB0cmFuc2xhdGlvbiBoYXMgYmVlbiBwcm92aWRlZCBmb3IgdGhhdCBwbHVyYWwgZm9ybSDigJMgaWYgaXRcbiAgICogaGFzbid0LCBpdCdsbCBmYWxsIGJhY2sgdG8gdGhlICdvdGhlcicgcGx1cmFsIGZvcm0gKHVubGVzcyB0aGF0IGRvZXNuJ3QgZXhpc3RcbiAgICogZWl0aGVyLCBpbiB3aGljaCBjYXNlIGFuIGVycm9yIHdpbGwgYmUgdGhyb3duKVxuICAgKlxuICAgKiBAaW50ZXJuYWxcbiAgICogQHBhcmFtIHtzdHJpbmd9IGxvb2t1cEtleSAtIFRoZSBsb29rdXAga2V5IG9mIHRoZSBzdHJpbmcgdG8gdXNlLlxuICAgKiBAcGFyYW0ge251bWJlcn0gY291bnQgLSBOdW1iZXIgdXNlZCB0byBkZXRlcm1pbmUgd2hpY2ggcGx1cmFsaXNhdGlvbiB0byB1c2UuXG4gICAqIEByZXR1cm5zIHtQbHVyYWxSdWxlfSBUaGUgc3VmZml4IGFzc29jaWF0ZWQgd2l0aCB0aGUgY29ycmVjdCBwbHVyYWxpc2F0aW9uIGZvciB0aGlzIGxvY2FsZS5cbiAgICogQHRocm93cyB7RXJyb3J9IFBsdXJhbCBmb3JtIGAub3RoZXJgIHJlcXVpcmVkIHdoZW4gcHJlZmVycmVkIHBsdXJhbCBmb3JtIGlzIG1pc3NpbmdcbiAgICovXG4gIGdldFBsdXJhbFN1ZmZpeChsb29rdXBLZXksIGNvdW50KSB7XG4gICAgLy8gVmFsaWRhdGUgdGhhdCB0aGUgbnVtYmVyIGlzIGFjdHVhbGx5IGEgbnVtYmVyLlxuICAgIC8vXG4gICAgLy8gTnVtYmVyKGNvdW50KSB3aWxsIHR1cm4gYW55dGhpbmcgdGhhdCBjYW4ndCBiZSBjb252ZXJ0ZWQgdG8gYSBOdW1iZXIgdHlwZVxuICAgIC8vIGludG8gJ05hTicuIGlzRmluaXRlIGZpbHRlcnMgb3V0IE5hTiwgYXMgaXQgaXNuJ3QgYSBmaW5pdGUgbnVtYmVyLlxuICAgIGNvdW50ID0gTnVtYmVyKGNvdW50KVxuICAgIGlmICghaXNGaW5pdGUoY291bnQpKSB7XG4gICAgICByZXR1cm4gJ290aGVyJ1xuICAgIH1cblxuICAgIC8vIEZldGNoIHRoZSB0cmFuc2xhdGlvbiBmb3IgdGhhdCBsb29rdXAga2V5XG4gICAgY29uc3QgdHJhbnNsYXRpb24gPSB0aGlzLnRyYW5zbGF0aW9uc1tsb29rdXBLZXldXG5cbiAgICAvLyBDaGVjayB0byB2ZXJpZnkgdGhhdCBhbGwgdGhlIHJlcXVpcmVtZW50cyBmb3IgSW50bC5QbHVyYWxSdWxlcyBhcmUgbWV0LlxuICAgIC8vIElmIHNvLCB3ZSBjYW4gdXNlIHRoYXQgaW5zdGVhZCBvZiBvdXIgY3VzdG9tIGltcGxlbWVudGF0aW9uLiBPdGhlcndpc2UsXG4gICAgLy8gdXNlIHRoZSBoYXJkY29kZWQgZmFsbGJhY2suXG4gICAgY29uc3QgcHJlZmVycmVkRm9ybSA9IHRoaXMuaGFzSW50bFBsdXJhbFJ1bGVzU3VwcG9ydCgpXG4gICAgICA/IG5ldyBJbnRsLlBsdXJhbFJ1bGVzKHRoaXMubG9jYWxlKS5zZWxlY3QoY291bnQpXG4gICAgICA6IHRoaXMuc2VsZWN0UGx1cmFsRm9ybVVzaW5nRmFsbGJhY2tSdWxlcyhjb3VudClcblxuICAgIC8vIFVzZSB0aGUgY29ycmVjdCBwbHVyYWwgZm9ybSBpZiBwcm92aWRlZFxuICAgIGlmICh0eXBlb2YgdHJhbnNsYXRpb24gPT09ICdvYmplY3QnKSB7XG4gICAgICBpZiAocHJlZmVycmVkRm9ybSBpbiB0cmFuc2xhdGlvbikge1xuICAgICAgICByZXR1cm4gcHJlZmVycmVkRm9ybVxuICAgICAgICAvLyBGYWxsIGJhY2sgdG8gYG90aGVyYCBpZiB0aGUgcGx1cmFsIGZvcm0gaXMgbWlzc2luZywgYnV0IGxvZyBhIHdhcm5pbmdcbiAgICAgICAgLy8gdG8gdGhlIGNvbnNvbGVcbiAgICAgIH0gZWxzZSBpZiAoJ290aGVyJyBpbiB0cmFuc2xhdGlvbikge1xuICAgICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICAgYGkxOG46IE1pc3NpbmcgcGx1cmFsIGZvcm0gXCIuJHtwcmVmZXJyZWRGb3JtfVwiIGZvciBcIiR7dGhpcy5sb2NhbGV9XCIgbG9jYWxlLiBGYWxsaW5nIGJhY2sgdG8gXCIub3RoZXJcIi5gXG4gICAgICAgIClcblxuICAgICAgICByZXR1cm4gJ290aGVyJ1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIElmIHRoZSByZXF1aXJlZCBgb3RoZXJgIHBsdXJhbCBmb3JtIGlzIG1pc3NpbmcsIGFsbCB3ZSBjYW4gZG8gaXMgZXJyb3JcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBgaTE4bjogUGx1cmFsIGZvcm0gXCIub3RoZXJcIiBpcyByZXF1aXJlZCBmb3IgXCIke3RoaXMubG9jYWxlfVwiIGxvY2FsZWBcbiAgICApXG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBwbHVyYWwgZm9ybSB1c2luZyBvdXIgZmFsbGJhY2sgaW1wbGVtZW50YXRpb25cbiAgICpcbiAgICogVGhpcyBpcyBzcGxpdCBvdXQgaW50byBhIHNlcGFyYXRlIGZ1bmN0aW9uIHRvIG1ha2UgaXQgZWFzaWVyIHRvIHRlc3QgdGhlXG4gICAqIGZhbGxiYWNrIGJlaGF2aW91ciBpbiBhbiBlbnZpcm9ubWVudCB3aGVyZSBJbnRsLlBsdXJhbFJ1bGVzIGV4aXN0cy5cbiAgICpcbiAgICogQGludGVybmFsXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBjb3VudCAtIE51bWJlciB1c2VkIHRvIGRldGVybWluZSB3aGljaCBwbHVyYWxpc2F0aW9uIHRvIHVzZS5cbiAgICogQHJldHVybnMge1BsdXJhbFJ1bGV9IFRoZSBwbHVyYWxpc2F0aW9uIGZvcm0gZm9yIGNvdW50IGluIHRoaXMgbG9jYWxlLlxuICAgKi9cbiAgc2VsZWN0UGx1cmFsRm9ybVVzaW5nRmFsbGJhY2tSdWxlcyhjb3VudCkge1xuICAgIC8vIEN1cnJlbnRseSBvdXIgY3VzdG9tIGNvZGUgY2FuIG9ubHkgaGFuZGxlIHBvc2l0aXZlIGludGVnZXJzLCBzbyBsZXQnc1xuICAgIC8vIG1ha2Ugc3VyZSBvdXIgbnVtYmVyIGlzIG9uZSBvZiB0aG9zZS5cbiAgICBjb3VudCA9IE1hdGguYWJzKE1hdGguZmxvb3IoY291bnQpKVxuXG4gICAgY29uc3QgcnVsZXNldCA9IHRoaXMuZ2V0UGx1cmFsUnVsZXNGb3JMb2NhbGUoKVxuXG4gICAgaWYgKHJ1bGVzZXQpIHtcbiAgICAgIHJldHVybiBJMThuLnBsdXJhbFJ1bGVzW3J1bGVzZXRdKGNvdW50KVxuICAgIH1cblxuICAgIHJldHVybiAnb3RoZXInXG4gIH1cblxuICAvKipcbiAgICogV29yayBvdXQgd2hpY2ggcGx1cmFsaXNhdGlvbiBydWxlcyB0byB1c2UgZm9yIHRoZSBjdXJyZW50IGxvY2FsZVxuICAgKlxuICAgKiBUaGUgbG9jYWxlIG1heSBpbmNsdWRlIGEgcmVnaW9uYWwgaW5kaWNhdG9yIChzdWNoIGFzIGVuLUdCKSwgYnV0IHdlIGRvbid0XG4gICAqIHVzdWFsbHkgY2FyZSBhYm91dCB0aGlzIHBhcnQsIGFzIHBsdXJhbGlzYXRpb24gcnVsZXMgYXJlIHVzdWFsbHkgdGhlIHNhbWVcbiAgICogcmVnYXJkbGVzcyBvZiByZWdpb24uIFRoZXJlIGFyZSBleGNlcHRpb25zLCBob3dldmVyLCAoZS5nLiBQb3J0dWd1ZXNlKSBzb1xuICAgKiB0aGlzIHNlYXJjaGVzIGJ5IGJvdGggdGhlIGZ1bGwgYW5kIHNob3J0ZW5lZCBsb2NhbGUgY29kZXMsIGp1c3QgdG8gYmUgc3VyZS5cbiAgICpcbiAgICogQGludGVybmFsXG4gICAqIEByZXR1cm5zIHtzdHJpbmcgfCB1bmRlZmluZWR9IFRoZSBuYW1lIG9mIHRoZSBwbHVyYWxpc2F0aW9uIHJ1bGUgdG8gdXNlIChhIGtleSBmb3Igb25lXG4gICAqICAgb2YgdGhlIGZ1bmN0aW9ucyBpbiB0aGlzLnBsdXJhbFJ1bGVzKVxuICAgKi9cbiAgZ2V0UGx1cmFsUnVsZXNGb3JMb2NhbGUoKSB7XG4gICAgY29uc3QgbG9jYWxlU2hvcnQgPSB0aGlzLmxvY2FsZS5zcGxpdCgnLScpWzBdXG5cbiAgICAvLyBMb29rIHRocm91Z2ggdGhlIHBsdXJhbCBydWxlcyBtYXAgdG8gZmluZCB3aGljaCBgcGx1cmFsUnVsZWAgaXNcbiAgICAvLyBhcHByb3ByaWF0ZSBmb3Igb3VyIGN1cnJlbnQgYGxvY2FsZWAuXG4gICAgZm9yIChjb25zdCBwbHVyYWxSdWxlIGluIEkxOG4ucGx1cmFsUnVsZXNNYXApIHtcbiAgICAgIGNvbnN0IGxhbmd1YWdlcyA9IEkxOG4ucGx1cmFsUnVsZXNNYXBbcGx1cmFsUnVsZV1cbiAgICAgIGlmIChsYW5ndWFnZXMuaW5jbHVkZXModGhpcy5sb2NhbGUpIHx8IGxhbmd1YWdlcy5pbmNsdWRlcyhsb2NhbGVTaG9ydCkpIHtcbiAgICAgICAgcmV0dXJuIHBsdXJhbFJ1bGVcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogTWFwIG9mIHBsdXJhbCBydWxlcyB0byBsYW5ndWFnZXMgd2hlcmUgdGhvc2UgcnVsZXMgYXBwbHkuXG4gICAqXG4gICAqIE5vdGU6IFRoZXNlIGdyb3VwcyBhcmUgbmFtZWQgZm9yIHRoZSBtb3N0IGRvbWluYW50IG9yIHJlY29nbmlzYWJsZSBsYW5ndWFnZVxuICAgKiB0aGF0IHVzZXMgZWFjaCBzeXN0ZW0uIFRoZSBncm91cGluZ3MgZG8gbm90IGltcGx5IHRoYXQgdGhlIGxhbmd1YWdlcyBhcmVcbiAgICogcmVsYXRlZCB0byBvbmUgYW5vdGhlci4gTWFueSBsYW5ndWFnZXMgaGF2ZSBldm9sdmVkIHRoZSBzYW1lIHN5c3RlbXNcbiAgICogaW5kZXBlbmRlbnRseSBvZiBvbmUgYW5vdGhlci5cbiAgICpcbiAgICogQ29kZSB0byBzdXBwb3J0IG1vcmUgbGFuZ3VhZ2VzIGNhbiBiZSBmb3VuZCBpbiB0aGUgaTE4biBzcGlrZTpcbiAgICoge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9hbHBoYWdvdi9nb3Z1ay1mcm9udGVuZC9ibG9iL3NwaWtlLWkxOG4tc3VwcG9ydC9zcmMvZ292dWsvaTE4bi5tanN9XG4gICAqXG4gICAqIExhbmd1YWdlcyBjdXJyZW50bHkgc3VwcG9ydGVkOlxuICAgKlxuICAgKiBBcmFiaWM6IEFyYWJpYyAoYXIpXG4gICAqIENoaW5lc2U6IEJ1cm1lc2UgKG15KSwgQ2hpbmVzZSAoemgpLCBJbmRvbmVzaWFuIChpZCksIEphcGFuZXNlIChqYSksXG4gICAqICAgSmF2YW5lc2UgKGp2KSwgS29yZWFuIChrbyksIE1hbGF5IChtcyksIFRoYWkgKHRoKSwgVmlldG5hbWVzZSAodmkpXG4gICAqIEZyZW5jaDogQXJtZW5pYW4gKGh5KSwgQmFuZ2xhIChibiksIEZyZW5jaCAoZnIpLCBHdWphcmF0aSAoZ3UpLCBIaW5kaSAoaGkpLFxuICAgKiAgIFBlcnNpYW4gRmFyc2kgKGZhKSwgUHVuamFiaSAocGEpLCBadWx1ICh6dSlcbiAgICogR2VybWFuOiBBZnJpa2FhbnMgKGFmKSwgQWxiYW5pYW4gKHNxKSwgQXplcmJhaWphbmkgKGF6KSwgQmFzcXVlIChldSksXG4gICAqICAgQnVsZ2FyaWFuIChiZyksIENhdGFsYW4gKGNhKSwgRGFuaXNoIChkYSksIER1dGNoIChubCksIEVuZ2xpc2ggKGVuKSxcbiAgICogICBFc3RvbmlhbiAoZXQpLCBGaW5uaXNoIChmaSksIEdlb3JnaWFuIChrYSksIEdlcm1hbiAoZGUpLCBHcmVlayAoZWwpLFxuICAgKiAgIEh1bmdhcmlhbiAoaHUpLCBMdXhlbWJvdXJnaXNoIChsYiksIE5vcndlZ2lhbiAobm8pLCBTb21hbGkgKHNvKSxcbiAgICogICBTd2FoaWxpIChzdyksIFN3ZWRpc2ggKHN2KSwgVGFtaWwgKHRhKSwgVGVsdWd1ICh0ZSksIFR1cmtpc2ggKHRyKSxcbiAgICogICBVcmR1ICh1cilcbiAgICogSXJpc2g6IElyaXNoIEdhZWxpYyAoZ2EpXG4gICAqIFJ1c3NpYW46IFJ1c3NpYW4gKHJ1KSwgVWtyYWluaWFuICh1aylcbiAgICogU2NvdHRpc2g6IFNjb3R0aXNoIEdhZWxpYyAoZ2QpXG4gICAqIFNwYW5pc2g6IEV1cm9wZWFuIFBvcnR1Z3Vlc2UgKHB0LVBUKSwgSXRhbGlhbiAoaXQpLCBTcGFuaXNoIChlcylcbiAgICogV2Vsc2g6IFdlbHNoIChjeSlcbiAgICpcbiAgICogQGludGVybmFsXG4gICAqIEB0eXBlIHt7IFtrZXk6IHN0cmluZ106IHN0cmluZ1tdIH19XG4gICAqL1xuICBzdGF0aWMgcGx1cmFsUnVsZXNNYXAgPSB7XG4gICAgYXJhYmljOiBbJ2FyJ10sXG4gICAgY2hpbmVzZTogWydteScsICd6aCcsICdpZCcsICdqYScsICdqdicsICdrbycsICdtcycsICd0aCcsICd2aSddLFxuICAgIGZyZW5jaDogWydoeScsICdibicsICdmcicsICdndScsICdoaScsICdmYScsICdwYScsICd6dSddLFxuICAgIGdlcm1hbjogW1xuICAgICAgJ2FmJyxcbiAgICAgICdzcScsXG4gICAgICAnYXonLFxuICAgICAgJ2V1JyxcbiAgICAgICdiZycsXG4gICAgICAnY2EnLFxuICAgICAgJ2RhJyxcbiAgICAgICdubCcsXG4gICAgICAnZW4nLFxuICAgICAgJ2V0JyxcbiAgICAgICdmaScsXG4gICAgICAna2EnLFxuICAgICAgJ2RlJyxcbiAgICAgICdlbCcsXG4gICAgICAnaHUnLFxuICAgICAgJ2xiJyxcbiAgICAgICdubycsXG4gICAgICAnc28nLFxuICAgICAgJ3N3JyxcbiAgICAgICdzdicsXG4gICAgICAndGEnLFxuICAgICAgJ3RlJyxcbiAgICAgICd0cicsXG4gICAgICAndXInXG4gICAgXSxcbiAgICBpcmlzaDogWydnYSddLFxuICAgIHJ1c3NpYW46IFsncnUnLCAndWsnXSxcbiAgICBzY290dGlzaDogWydnZCddLFxuICAgIHNwYW5pc2g6IFsncHQtUFQnLCAnaXQnLCAnZXMnXSxcbiAgICB3ZWxzaDogWydjeSddXG4gIH1cblxuICAvKipcbiAgICogRGlmZmVyZW50IHBsdXJhbGlzYXRpb24gcnVsZSBzZXRzXG4gICAqXG4gICAqIFJldHVybnMgdGhlIGFwcHJvcHJpYXRlIHN1ZmZpeCBmb3IgdGhlIHBsdXJhbCBmb3JtIGFzc29jaWF0ZWQgd2l0aCBgbmAuXG4gICAqIFBvc3NpYmxlIHN1ZmZpeGVzOiAnemVybycsICdvbmUnLCAndHdvJywgJ2ZldycsICdtYW55JywgJ290aGVyJyAodGhlIGFjdHVhbFxuICAgKiBtZWFuaW5nIG9mIGVhY2ggZGlmZmVycyBwZXIgbG9jYWxlKS4gJ290aGVyJyBzaG91bGQgYWx3YXlzIGV4aXN0LCBldmVuIGluXG4gICAqIGxhbmd1YWdlcyB3aXRob3V0IHBsdXJhbHMsIHN1Y2ggYXMgQ2hpbmVzZS5cbiAgICoge0BsaW5rIGh0dHBzOi8vY2xkci51bmljb2RlLm9yZy9pbmRleC9jbGRyLXNwZWMvcGx1cmFsLXJ1bGVzfVxuICAgKlxuICAgKiBUaGUgY291bnQgbXVzdCBiZSBhIHBvc2l0aXZlIGludGVnZXIuIE5lZ2F0aXZlIG51bWJlcnMgYW5kIGRlY2ltYWxzIGFyZW4ndCBhY2NvdW50ZWQgZm9yXG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKiBAdHlwZSB7eyBba2V5OiBzdHJpbmddOiAoY291bnQ6IG51bWJlcikgPT4gUGx1cmFsUnVsZSB9fVxuICAgKi9cbiAgc3RhdGljIHBsdXJhbFJ1bGVzID0ge1xuICAgIGFyYWJpYyhuKSB7XG4gICAgICBpZiAobiA9PT0gMCkge1xuICAgICAgICByZXR1cm4gJ3plcm8nXG4gICAgICB9XG4gICAgICBpZiAobiA9PT0gMSkge1xuICAgICAgICByZXR1cm4gJ29uZSdcbiAgICAgIH1cbiAgICAgIGlmIChuID09PSAyKSB7XG4gICAgICAgIHJldHVybiAndHdvJ1xuICAgICAgfVxuICAgICAgaWYgKG4gJSAxMDAgPj0gMyAmJiBuICUgMTAwIDw9IDEwKSB7XG4gICAgICAgIHJldHVybiAnZmV3J1xuICAgICAgfVxuICAgICAgaWYgKG4gJSAxMDAgPj0gMTEgJiYgbiAlIDEwMCA8PSA5OSkge1xuICAgICAgICByZXR1cm4gJ21hbnknXG4gICAgICB9XG4gICAgICByZXR1cm4gJ290aGVyJ1xuICAgIH0sXG4gICAgY2hpbmVzZSgpIHtcbiAgICAgIHJldHVybiAnb3RoZXInXG4gICAgfSxcbiAgICBmcmVuY2gobikge1xuICAgICAgcmV0dXJuIG4gPT09IDAgfHwgbiA9PT0gMSA/ICdvbmUnIDogJ290aGVyJ1xuICAgIH0sXG4gICAgZ2VybWFuKG4pIHtcbiAgICAgIHJldHVybiBuID09PSAxID8gJ29uZScgOiAnb3RoZXInXG4gICAgfSxcbiAgICBpcmlzaChuKSB7XG4gICAgICBpZiAobiA9PT0gMSkge1xuICAgICAgICByZXR1cm4gJ29uZSdcbiAgICAgIH1cbiAgICAgIGlmIChuID09PSAyKSB7XG4gICAgICAgIHJldHVybiAndHdvJ1xuICAgICAgfVxuICAgICAgaWYgKG4gPj0gMyAmJiBuIDw9IDYpIHtcbiAgICAgICAgcmV0dXJuICdmZXcnXG4gICAgICB9XG4gICAgICBpZiAobiA+PSA3ICYmIG4gPD0gMTApIHtcbiAgICAgICAgcmV0dXJuICdtYW55J1xuICAgICAgfVxuICAgICAgcmV0dXJuICdvdGhlcidcbiAgICB9LFxuICAgIHJ1c3NpYW4obikge1xuICAgICAgY29uc3QgbGFzdFR3byA9IG4gJSAxMDBcbiAgICAgIGNvbnN0IGxhc3QgPSBsYXN0VHdvICUgMTBcbiAgICAgIGlmIChsYXN0ID09PSAxICYmIGxhc3RUd28gIT09IDExKSB7XG4gICAgICAgIHJldHVybiAnb25lJ1xuICAgICAgfVxuICAgICAgaWYgKGxhc3QgPj0gMiAmJiBsYXN0IDw9IDQgJiYgIShsYXN0VHdvID49IDEyICYmIGxhc3RUd28gPD0gMTQpKSB7XG4gICAgICAgIHJldHVybiAnZmV3J1xuICAgICAgfVxuICAgICAgaWYgKFxuICAgICAgICBsYXN0ID09PSAwIHx8XG4gICAgICAgIChsYXN0ID49IDUgJiYgbGFzdCA8PSA5KSB8fFxuICAgICAgICAobGFzdFR3byA+PSAxMSAmJiBsYXN0VHdvIDw9IDE0KVxuICAgICAgKSB7XG4gICAgICAgIHJldHVybiAnbWFueSdcbiAgICAgIH1cbiAgICAgIC8vIE5vdGU6IFRoZSAnb3RoZXInIHN1ZmZpeCBpcyBvbmx5IHVzZWQgYnkgZGVjaW1hbCBudW1iZXJzIGluIFJ1c3NpYW4uXG4gICAgICAvLyBXZSBkb24ndCBhbnRpY2lwYXRlIGl0IGJlaW5nIHVzZWQsIGJ1dCBpdCdzIGhlcmUgZm9yIGNvbnNpc3RlbmN5LlxuICAgICAgcmV0dXJuICdvdGhlcidcbiAgICB9LFxuICAgIHNjb3R0aXNoKG4pIHtcbiAgICAgIGlmIChuID09PSAxIHx8IG4gPT09IDExKSB7XG4gICAgICAgIHJldHVybiAnb25lJ1xuICAgICAgfVxuICAgICAgaWYgKG4gPT09IDIgfHwgbiA9PT0gMTIpIHtcbiAgICAgICAgcmV0dXJuICd0d28nXG4gICAgICB9XG4gICAgICBpZiAoKG4gPj0gMyAmJiBuIDw9IDEwKSB8fCAobiA+PSAxMyAmJiBuIDw9IDE5KSkge1xuICAgICAgICByZXR1cm4gJ2ZldydcbiAgICAgIH1cbiAgICAgIHJldHVybiAnb3RoZXInXG4gICAgfSxcbiAgICBzcGFuaXNoKG4pIHtcbiAgICAgIGlmIChuID09PSAxKSB7XG4gICAgICAgIHJldHVybiAnb25lJ1xuICAgICAgfVxuICAgICAgaWYgKG4gJSAxMDAwMDAwID09PSAwICYmIG4gIT09IDApIHtcbiAgICAgICAgcmV0dXJuICdtYW55J1xuICAgICAgfVxuICAgICAgcmV0dXJuICdvdGhlcidcbiAgICB9LFxuICAgIHdlbHNoKG4pIHtcbiAgICAgIGlmIChuID09PSAwKSB7XG4gICAgICAgIHJldHVybiAnemVybydcbiAgICAgIH1cbiAgICAgIGlmIChuID09PSAxKSB7XG4gICAgICAgIHJldHVybiAnb25lJ1xuICAgICAgfVxuICAgICAgaWYgKG4gPT09IDIpIHtcbiAgICAgICAgcmV0dXJuICd0d28nXG4gICAgICB9XG4gICAgICBpZiAobiA9PT0gMykge1xuICAgICAgICByZXR1cm4gJ2ZldydcbiAgICAgIH1cbiAgICAgIGlmIChuID09PSA2KSB7XG4gICAgICAgIHJldHVybiAnbWFueSdcbiAgICAgIH1cbiAgICAgIHJldHVybiAnb3RoZXInXG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogUGx1cmFsIHJ1bGUgY2F0ZWdvcnkgbW5lbW9uaWMgdGFnc1xuICpcbiAqIEBpbnRlcm5hbFxuICogQHR5cGVkZWYgeyd6ZXJvJyB8ICdvbmUnIHwgJ3R3bycgfCAnZmV3JyB8ICdtYW55JyB8ICdvdGhlcid9IFBsdXJhbFJ1bGVcbiAqL1xuXG4vKipcbiAqIFRyYW5zbGF0ZWQgbWVzc2FnZSBieSBwbHVyYWwgcnVsZSB0aGV5IGNvcnJlc3BvbmQgdG8uXG4gKlxuICogQWxsb3dzIHRvIGdyb3VwIHBsdXJhbGlzZWQgbWVzc2FnZXMgdW5kZXIgYSBzaW5nbGUga2V5IHdoZW4gcGFzc2luZ1xuICogdHJhbnNsYXRpb25zIHRvIGEgY29tcG9uZW50J3MgY29uc3RydWN0b3JcbiAqXG4gKiBAaW50ZXJuYWxcbiAqIEB0eXBlZGVmIHtvYmplY3R9IFRyYW5zbGF0aW9uUGx1cmFsRm9ybXNcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbb3RoZXJdIC0gR2VuZXJhbCBwbHVyYWwgZm9ybVxuICogQHByb3BlcnR5IHtzdHJpbmd9IFt6ZXJvXSAtIFBsdXJhbCBmb3JtIHVzZWQgd2l0aCAwXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW29uZV0gLSBQbHVyYWwgZm9ybSB1c2VkIHdpdGggMVxuICogQHByb3BlcnR5IHtzdHJpbmd9IFt0d29dIC0gUGx1cmFsIGZvcm0gdXNlZCB3aXRoIDJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbZmV3XSAtIFBsdXJhbCBmb3JtIHVzZWQgZm9yIGEgZmV3XG4gKiBAcHJvcGVydHkge3N0cmluZ30gW21hbnldIC0gUGx1cmFsIGZvcm0gdXNlZCBmb3IgbWFueVxuICovXG4iLCJpbXBvcnQgeyBpc1N1cHBvcnRlZCB9IGZyb20gJy4vY29tbW9uL2luZGV4Lm1qcydcbmltcG9ydCB7IEFjY29yZGlvbiB9IGZyb20gJy4vY29tcG9uZW50cy9hY2NvcmRpb24vYWNjb3JkaW9uLm1qcydcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gJy4vY29tcG9uZW50cy9idXR0b24vYnV0dG9uLm1qcydcbmltcG9ydCB7IENoYXJhY3RlckNvdW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2NoYXJhY3Rlci1jb3VudC9jaGFyYWN0ZXItY291bnQubWpzJ1xuaW1wb3J0IHsgQ2hlY2tib3hlcyB9IGZyb20gJy4vY29tcG9uZW50cy9jaGVja2JveGVzL2NoZWNrYm94ZXMubWpzJ1xuaW1wb3J0IHsgRXJyb3JTdW1tYXJ5IH0gZnJvbSAnLi9jb21wb25lbnRzL2Vycm9yLXN1bW1hcnkvZXJyb3Itc3VtbWFyeS5tanMnXG5pbXBvcnQgeyBFeGl0VGhpc1BhZ2UgfSBmcm9tICcuL2NvbXBvbmVudHMvZXhpdC10aGlzLXBhZ2UvZXhpdC10aGlzLXBhZ2UubWpzJ1xuaW1wb3J0IHsgRmlsZVVwbG9hZCB9IGZyb20gJy4vY29tcG9uZW50cy9maWxlLXVwbG9hZC9maWxlLXVwbG9hZC5tanMnXG5pbXBvcnQgeyBIZWFkZXIgfSBmcm9tICcuL2NvbXBvbmVudHMvaGVhZGVyL2hlYWRlci5tanMnXG5pbXBvcnQgeyBOb3RpZmljYXRpb25CYW5uZXIgfSBmcm9tICcuL2NvbXBvbmVudHMvbm90aWZpY2F0aW9uLWJhbm5lci9ub3RpZmljYXRpb24tYmFubmVyLm1qcydcbmltcG9ydCB7IFBhc3N3b3JkSW5wdXQgfSBmcm9tICcuL2NvbXBvbmVudHMvcGFzc3dvcmQtaW5wdXQvcGFzc3dvcmQtaW5wdXQubWpzJ1xuaW1wb3J0IHsgUmFkaW9zIH0gZnJvbSAnLi9jb21wb25lbnRzL3JhZGlvcy9yYWRpb3MubWpzJ1xuaW1wb3J0IHsgU2VydmljZU5hdmlnYXRpb24gfSBmcm9tICcuL2NvbXBvbmVudHMvc2VydmljZS1uYXZpZ2F0aW9uL3NlcnZpY2UtbmF2aWdhdGlvbi5tanMnXG5pbXBvcnQgeyBTa2lwTGluayB9IGZyb20gJy4vY29tcG9uZW50cy9za2lwLWxpbmsvc2tpcC1saW5rLm1qcydcbmltcG9ydCB7IFRhYnMgfSBmcm9tICcuL2NvbXBvbmVudHMvdGFicy90YWJzLm1qcydcbmltcG9ydCB7IFN1cHBvcnRFcnJvciB9IGZyb20gJy4vZXJyb3JzL2luZGV4Lm1qcydcblxuLyoqXG4gKiBJbml0aWFsaXNlIGFsbCBjb21wb25lbnRzXG4gKlxuICogVXNlIHRoZSBgZGF0YS1tb2R1bGVgIGF0dHJpYnV0ZXMgdG8gZmluZCwgaW5zdGFudGlhdGUgYW5kIGluaXQgYWxsIG9mIHRoZVxuICogY29tcG9uZW50cyBwcm92aWRlZCBhcyBwYXJ0IG9mIEdPVi5VSyBGcm9udGVuZC5cbiAqXG4gKiBAcGFyYW0ge0NvbmZpZyAmIHsgc2NvcGU/OiBFbGVtZW50LCBvbkVycm9yPzogT25FcnJvckNhbGxiYWNrPENvbXBhdGlibGVDbGFzcz4gfX0gW2NvbmZpZ10gLSBDb25maWcgZm9yIGFsbCBjb21wb25lbnRzICh3aXRoIG9wdGlvbmFsIHNjb3BlKVxuICovXG5mdW5jdGlvbiBpbml0QWxsKGNvbmZpZykge1xuICBjb25maWcgPSB0eXBlb2YgY29uZmlnICE9PSAndW5kZWZpbmVkJyA/IGNvbmZpZyA6IHt9XG5cbiAgLy8gU2tpcCBpbml0aWFsaXNhdGlvbiB3aGVuIEdPVi5VSyBGcm9udGVuZCBpcyBub3Qgc3VwcG9ydGVkXG4gIGlmICghaXNTdXBwb3J0ZWQoKSkge1xuICAgIGlmIChjb25maWcub25FcnJvcikge1xuICAgICAgY29uZmlnLm9uRXJyb3IobmV3IFN1cHBvcnRFcnJvcigpLCB7XG4gICAgICAgIGNvbmZpZ1xuICAgICAgfSlcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2cobmV3IFN1cHBvcnRFcnJvcigpKVxuICAgIH1cbiAgICByZXR1cm5cbiAgfVxuXG4gIGNvbnN0IGNvbXBvbmVudHMgPSAvKiogQHR5cGUge2NvbnN0fSAqLyAoW1xuICAgIFtBY2NvcmRpb24sIGNvbmZpZy5hY2NvcmRpb25dLFxuICAgIFtCdXR0b24sIGNvbmZpZy5idXR0b25dLFxuICAgIFtDaGFyYWN0ZXJDb3VudCwgY29uZmlnLmNoYXJhY3RlckNvdW50XSxcbiAgICBbQ2hlY2tib3hlc10sXG4gICAgW0Vycm9yU3VtbWFyeSwgY29uZmlnLmVycm9yU3VtbWFyeV0sXG4gICAgW0V4aXRUaGlzUGFnZSwgY29uZmlnLmV4aXRUaGlzUGFnZV0sXG4gICAgW0ZpbGVVcGxvYWQsIGNvbmZpZy5maWxlVXBsb2FkXSxcbiAgICBbSGVhZGVyXSxcbiAgICBbTm90aWZpY2F0aW9uQmFubmVyLCBjb25maWcubm90aWZpY2F0aW9uQmFubmVyXSxcbiAgICBbUGFzc3dvcmRJbnB1dCwgY29uZmlnLnBhc3N3b3JkSW5wdXRdLFxuICAgIFtSYWRpb3NdLFxuICAgIFtTZXJ2aWNlTmF2aWdhdGlvbl0sXG4gICAgW1NraXBMaW5rXSxcbiAgICBbVGFic11cbiAgXSlcblxuICAvLyBBbGxvdyB0aGUgdXNlciB0byBpbml0aWFsaXNlIEdPVi5VSyBGcm9udGVuZCBpbiBvbmx5IGNlcnRhaW4gc2VjdGlvbnMgb2YgdGhlIHBhZ2VcbiAgLy8gRGVmYXVsdHMgdG8gdGhlIGVudGlyZSBkb2N1bWVudCBpZiBub3RoaW5nIGlzIHNldC5cbiAgLy8gY29uc3QgJHNjb3BlID0gY29uZmlnLnNjb3BlID8/IGRvY3VtZW50XG5cbiAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICBzY29wZTogY29uZmlnLnNjb3BlID8/IGRvY3VtZW50LFxuICAgIG9uRXJyb3I6IGNvbmZpZy5vbkVycm9yXG4gIH1cblxuICBjb21wb25lbnRzLmZvckVhY2goKFtDb21wb25lbnQsIGNvbmZpZ10pID0+IHtcbiAgICBjcmVhdGVBbGwoQ29tcG9uZW50LCBjb25maWcsIG9wdGlvbnMpXG4gIH0pXG59XG5cbi8qKlxuICogQ3JlYXRlIGFsbCBpbnN0YW5jZXMgb2YgYSBzcGVjaWZpYyBjb21wb25lbnQgb24gdGhlIHBhZ2VcbiAqXG4gKiBVc2VzIHRoZSBgZGF0YS1tb2R1bGVgIGF0dHJpYnV0ZSB0byBmaW5kIGFsbCBlbGVtZW50cyBtYXRjaGluZyB0aGUgc3BlY2lmaWVkXG4gKiBjb21wb25lbnQgb24gdGhlIHBhZ2UsIGNyZWF0aW5nIGluc3RhbmNlcyBvZiB0aGUgY29tcG9uZW50IG9iamVjdCBmb3IgZWFjaFxuICogb2YgdGhlbS5cbiAqXG4gKiBBbnkgY29tcG9uZW50IGVycm9ycyB3aWxsIGJlIGNhdWdodCBhbmQgbG9nZ2VkIHRvIHRoZSBjb25zb2xlLlxuICpcbiAqIEB0ZW1wbGF0ZSB7Q29tcGF0aWJsZUNsYXNzfSBDb21wb25lbnRDbGFzc1xuICogQHBhcmFtIHtDb21wb25lbnRDbGFzc30gQ29tcG9uZW50IC0gY2xhc3Mgb2YgdGhlIGNvbXBvbmVudCB0byBjcmVhdGVcbiAqIEBwYXJhbSB7Q29tcG9uZW50Q29uZmlnPENvbXBvbmVudENsYXNzPn0gW2NvbmZpZ10gLSBDb25maWcgc3VwcGxpZWQgdG8gY29tcG9uZW50XG4gKiBAcGFyYW0ge09uRXJyb3JDYWxsYmFjazxDb21wb25lbnRDbGFzcz4gfCBFbGVtZW50IHwgRG9jdW1lbnQgfCBDcmVhdGVBbGxPcHRpb25zPENvbXBvbmVudENsYXNzPiB9IFtjcmVhdGVBbGxPcHRpb25zXSAtIG9wdGlvbnMgZm9yIGNyZWF0ZUFsbCBpbmNsdWRpbmcgc2NvcGUgb2YgdGhlIGRvY3VtZW50IHRvIHNlYXJjaCB3aXRoaW4gYW5kIGNhbGxiYWNrIGZ1bmN0aW9uIGlmIGVycm9yIHRocm93IGJ5IGNvbXBvbmVudCBvbiBpbml0XG4gKiBAcmV0dXJucyB7QXJyYXk8SW5zdGFuY2VUeXBlPENvbXBvbmVudENsYXNzPj59IC0gYXJyYXkgb2YgaW5zdGFudGlhdGVkIGNvbXBvbmVudHNcbiAqL1xuZnVuY3Rpb24gY3JlYXRlQWxsKENvbXBvbmVudCwgY29uZmlnLCBjcmVhdGVBbGxPcHRpb25zKSB7XG4gIGxldCAvKiogQHR5cGUge0VsZW1lbnQgfCBEb2N1bWVudH0gKi8gJHNjb3BlID0gZG9jdW1lbnRcbiAgbGV0IC8qKiBAdHlwZSB7T25FcnJvckNhbGxiYWNrPENvbXBvbmVudD4gfCB1bmRlZmluZWR9ICovIG9uRXJyb3JcblxuICBpZiAodHlwZW9mIGNyZWF0ZUFsbE9wdGlvbnMgPT09ICdvYmplY3QnKSB7XG4gICAgY3JlYXRlQWxsT3B0aW9ucyA9IC8qKiBAdHlwZSB7Q3JlYXRlQWxsT3B0aW9uczxDb21wb25lbnQ+fSAqLyAoXG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2VsZi1hc3NpZ25cbiAgICAgIGNyZWF0ZUFsbE9wdGlvbnNcbiAgICApXG5cbiAgICAkc2NvcGUgPSBjcmVhdGVBbGxPcHRpb25zLnNjb3BlID8/ICRzY29wZVxuICAgIG9uRXJyb3IgPSBjcmVhdGVBbGxPcHRpb25zLm9uRXJyb3JcbiAgfVxuXG4gIGlmICh0eXBlb2YgY3JlYXRlQWxsT3B0aW9ucyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIG9uRXJyb3IgPSBjcmVhdGVBbGxPcHRpb25zXG4gIH1cblxuICBpZiAoY3JlYXRlQWxsT3B0aW9ucyBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgJHNjb3BlID0gY3JlYXRlQWxsT3B0aW9uc1xuICB9XG5cbiAgY29uc3QgJGVsZW1lbnRzID0gJHNjb3BlLnF1ZXJ5U2VsZWN0b3JBbGwoXG4gICAgYFtkYXRhLW1vZHVsZT1cIiR7Q29tcG9uZW50Lm1vZHVsZU5hbWV9XCJdYFxuICApXG5cbiAgLy8gU2tpcCBpbml0aWFsaXNhdGlvbiB3aGVuIEdPVi5VSyBGcm9udGVuZCBpcyBub3Qgc3VwcG9ydGVkXG4gIGlmICghaXNTdXBwb3J0ZWQoKSkge1xuICAgIGlmIChvbkVycm9yKSB7XG4gICAgICBvbkVycm9yKG5ldyBTdXBwb3J0RXJyb3IoKSwge1xuICAgICAgICBjb21wb25lbnQ6IENvbXBvbmVudCxcbiAgICAgICAgY29uZmlnXG4gICAgICB9KVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZyhuZXcgU3VwcG9ydEVycm9yKCkpXG4gICAgfVxuICAgIHJldHVybiBbXVxuICB9XG5cbiAgLyogZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby11bnNhZmUtcmV0dXJuIC0tXG4gICAqIFdlIGNhbid0IGRlZmluZSBDb21wYXRpYmxlQ2xhc3MgYXMgYHtuZXcoKTogQ29tcGF0aWJsZUNsYXNzLCBtb2R1bGVOYW1lOiBzdHJpbmd9YCxcbiAgICogYXMgd2hlbiBkb2luZyBgdHlwZW9mIEFjY29yZGlvbmAgKG9yIGFueSBjb21wb25lbnQpLCBUeXBlU2NyaXB0IGRvZXNuJ3Qgc2VlbVxuICAgKiB0byBhY2tub3dsZWRnZSB0aGUgc3RhdGljIGBtb2R1bGVOYW1lYCB0aGF0J3Mgc2V0IGluIG91ciBjb21wb25lbnQgY2xhc3Nlcy5cbiAgICogVGhpcyBtZWFucyB3ZSBoYXZlIHRvIHNldCB0aGUgY29uc3RydWN0b3Igb2YgYENvbXBhdGlibGVDbGFzc2AgYXMgYHtuZXcoKTogYW55fWAsXG4gICAqIGxlYWRpbmcgdG8gRVNMaW50IGZyb3duaW5nIHRoYXQgd2UncmUgcmV0dXJuaW5nIGBhbnlbXWAuXG4gICAqL1xuICByZXR1cm4gQXJyYXkuZnJvbSgkZWxlbWVudHMpXG4gICAgLm1hcCgoJGVsZW1lbnQpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIE9ubHkgcGFzcyBjb25maWcgdG8gY29tcG9uZW50cyB0aGF0IGFjY2VwdCBpdFxuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXVuc2FmZS1yZXR1cm5cbiAgICAgICAgcmV0dXJuIHR5cGVvZiBjb25maWcgIT09ICd1bmRlZmluZWQnXG4gICAgICAgICAgPyBuZXcgQ29tcG9uZW50KCRlbGVtZW50LCBjb25maWcpXG4gICAgICAgICAgOiBuZXcgQ29tcG9uZW50KCRlbGVtZW50KVxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgaWYgKG9uRXJyb3IpIHtcbiAgICAgICAgICBvbkVycm9yKGVycm9yLCB7XG4gICAgICAgICAgICBlbGVtZW50OiAkZWxlbWVudCxcbiAgICAgICAgICAgIGNvbXBvbmVudDogQ29tcG9uZW50LFxuICAgICAgICAgICAgY29uZmlnXG4gICAgICAgICAgfSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcilcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBudWxsXG4gICAgICB9XG4gICAgfSlcbiAgICAuZmlsdGVyKEJvb2xlYW4pIC8vIEV4Y2x1ZGUgY29tcG9uZW50cyB0aGF0IGVycm9yZWRcbn1cblxuZXhwb3J0IHsgaW5pdEFsbCwgY3JlYXRlQWxsIH1cblxuLyogZXNsaW50LWRpc2FibGUganNkb2MvdmFsaWQtdHlwZXMgLS1cbiAqIGB7bmV3KC4uLmFyZ3M6IGFueVtdICk6IG9iamVjdH1gIGlzIG5vdCByZWNvZ25pc2VkIGFzIHZhbGlkXG4gKiBodHRwczovL2dpdGh1Yi5jb20vZ2FqdXMvZXNsaW50LXBsdWdpbi1qc2RvYy9pc3N1ZXMvMTQ1I2lzc3VlY29tbWVudC0xMzA4NzIyODc4XG4gKiBodHRwczovL2dpdGh1Yi5jb20vanNkb2MtdHlwZS1wcmF0dC1wYXJzZXIvanNkb2MtdHlwZS1wcmF0dC1wYXJzZXIvaXNzdWVzLzEzMVxuICoqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHt7bmV3ICguLi5hcmdzOiBhbnlbXSk6IGFueSwgbW9kdWxlTmFtZTogc3RyaW5nfX0gQ29tcGF0aWJsZUNsYXNzXG4gKi9cblxuLyogZXNsaW50LWVuYWJsZSBqc2RvYy92YWxpZC10eXBlcyAqL1xuXG4vKipcbiAqIENvbmZpZyBmb3IgYWxsIGNvbXBvbmVudHMgdmlhIGBpbml0QWxsKClgXG4gKlxuICogQHR5cGVkZWYge29iamVjdH0gQ29uZmlnXG4gKiBAcHJvcGVydHkge0FjY29yZGlvbkNvbmZpZ30gW2FjY29yZGlvbl0gLSBBY2NvcmRpb24gY29uZmlnXG4gKiBAcHJvcGVydHkge0J1dHRvbkNvbmZpZ30gW2J1dHRvbl0gLSBCdXR0b24gY29uZmlnXG4gKiBAcHJvcGVydHkge0NoYXJhY3RlckNvdW50Q29uZmlnfSBbY2hhcmFjdGVyQ291bnRdIC0gQ2hhcmFjdGVyIENvdW50IGNvbmZpZ1xuICogQHByb3BlcnR5IHtFcnJvclN1bW1hcnlDb25maWd9IFtlcnJvclN1bW1hcnldIC0gRXJyb3IgU3VtbWFyeSBjb25maWdcbiAqIEBwcm9wZXJ0eSB7RXhpdFRoaXNQYWdlQ29uZmlnfSBbZXhpdFRoaXNQYWdlXSAtIEV4aXQgVGhpcyBQYWdlIGNvbmZpZ1xuICogQHByb3BlcnR5IHtGaWxlVXBsb2FkQ29uZmlnfSBbZmlsZVVwbG9hZF0gLSBGaWxlIFVwbG9hZCBjb25maWdcbiAqIEBwcm9wZXJ0eSB7Tm90aWZpY2F0aW9uQmFubmVyQ29uZmlnfSBbbm90aWZpY2F0aW9uQmFubmVyXSAtIE5vdGlmaWNhdGlvbiBCYW5uZXIgY29uZmlnXG4gKiBAcHJvcGVydHkge1Bhc3N3b3JkSW5wdXRDb25maWd9IFtwYXNzd29yZElucHV0XSAtIFBhc3N3b3JkIGlucHV0IGNvbmZpZ1xuICovXG5cbi8qKlxuICogQ29uZmlnIGZvciBpbmRpdmlkdWFsIGNvbXBvbmVudHNcbiAqXG4gKiBAaW1wb3J0IHsgQWNjb3JkaW9uQ29uZmlnIH0gZnJvbSAnLi9jb21wb25lbnRzL2FjY29yZGlvbi9hY2NvcmRpb24ubWpzJ1xuICogQGltcG9ydCB7IEJ1dHRvbkNvbmZpZyB9IGZyb20gJy4vY29tcG9uZW50cy9idXR0b24vYnV0dG9uLm1qcydcbiAqIEBpbXBvcnQgeyBDaGFyYWN0ZXJDb3VudENvbmZpZyB9IGZyb20gJy4vY29tcG9uZW50cy9jaGFyYWN0ZXItY291bnQvY2hhcmFjdGVyLWNvdW50Lm1qcydcbiAqIEBpbXBvcnQgeyBFcnJvclN1bW1hcnlDb25maWcgfSBmcm9tICcuL2NvbXBvbmVudHMvZXJyb3Itc3VtbWFyeS9lcnJvci1zdW1tYXJ5Lm1qcydcbiAqIEBpbXBvcnQgeyBFeGl0VGhpc1BhZ2VDb25maWcgfSBmcm9tICcuL2NvbXBvbmVudHMvZXhpdC10aGlzLXBhZ2UvZXhpdC10aGlzLXBhZ2UubWpzJ1xuICogQGltcG9ydCB7IE5vdGlmaWNhdGlvbkJhbm5lckNvbmZpZyB9IGZyb20gJy4vY29tcG9uZW50cy9ub3RpZmljYXRpb24tYmFubmVyL25vdGlmaWNhdGlvbi1iYW5uZXIubWpzJ1xuICogQGltcG9ydCB7IFBhc3N3b3JkSW5wdXRDb25maWcgfSBmcm9tICcuL2NvbXBvbmVudHMvcGFzc3dvcmQtaW5wdXQvcGFzc3dvcmQtaW5wdXQubWpzJ1xuICogQGltcG9ydCB7IEZpbGVVcGxvYWRDb25maWcgfSBmcm9tICcuL2NvbXBvbmVudHMvZmlsZS11cGxvYWQvZmlsZS11cGxvYWQubWpzJ1xuICovXG5cbi8qKlxuICogQ29tcG9uZW50IGNvbmZpZyBrZXlzLCBlLmcuIGBhY2NvcmRpb25gIGFuZCBgY2hhcmFjdGVyQ291bnRgXG4gKlxuICogQHR5cGVkZWYge2tleW9mIENvbmZpZ30gQ29uZmlnS2V5XG4gKi9cblxuLyoqXG4gKiBAdGVtcGxhdGUge0NvbXBhdGlibGVDbGFzc30gQ29tcG9uZW50Q2xhc3NcbiAqIEB0eXBlZGVmIHtDb25zdHJ1Y3RvclBhcmFtZXRlcnM8Q29tcG9uZW50Q2xhc3M+WzFdfSBDb21wb25lbnRDb25maWdcbiAqL1xuXG4vKipcbiAqIEB0ZW1wbGF0ZSB7Q29tcGF0aWJsZUNsYXNzfSBDb21wb25lbnRDbGFzc1xuICogQHR5cGVkZWYge29iamVjdH0gRXJyb3JDb250ZXh0XG4gKiBAcHJvcGVydHkge0VsZW1lbnR9IFtlbGVtZW50XSAtIEVsZW1lbnQgdXNlZCBmb3IgY29tcG9uZW50IG1vZHVsZSBpbml0aWFsaXNhdGlvblxuICogQHByb3BlcnR5IHtDb21wb25lbnRDbGFzc30gW2NvbXBvbmVudF0gLSBDbGFzcyBvZiBjb21wb25lbnRcbiAqIEBwcm9wZXJ0eSB7Q29tcG9uZW50Q29uZmlnPENvbXBvbmVudENsYXNzPn0gY29uZmlnIC0gQ29uZmlnIHN1cHBsaWVkIHRvIGNvbXBvbmVudFxuICovXG5cbi8qKlxuICogQHRlbXBsYXRlIHtDb21wYXRpYmxlQ2xhc3N9IENvbXBvbmVudENsYXNzXG4gKiBAY2FsbGJhY2sgT25FcnJvckNhbGxiYWNrXG4gKiBAcGFyYW0ge3Vua25vd259IGVycm9yIC0gVGhyb3duIGVycm9yXG4gKiBAcGFyYW0ge0Vycm9yQ29udGV4dDxDb21wb25lbnRDbGFzcz59IGNvbnRleHQgLSBPYmplY3QgY29udGFpbmluZyB0aGUgZWxlbWVudCwgY29tcG9uZW50IGNsYXNzIGFuZCBjb25maWd1cmF0aW9uXG4gKi9cblxuLyoqXG4gKiBAdGVtcGxhdGUge0NvbXBhdGlibGVDbGFzc30gQ29tcG9uZW50Q2xhc3NcbiAqIEB0eXBlZGVmIHtvYmplY3R9IENyZWF0ZUFsbE9wdGlvbnNcbiAqIEBwcm9wZXJ0eSB7RWxlbWVudCB8IERvY3VtZW50fSBbc2NvcGVdIC0gc2NvcGUgb2YgdGhlIGRvY3VtZW50IHRvIHNlYXJjaCB3aXRoaW5cbiAqIEBwcm9wZXJ0eSB7T25FcnJvckNhbGxiYWNrPENvbXBvbmVudENsYXNzPn0gW29uRXJyb3JdIC0gY2FsbGJhY2sgZnVuY3Rpb24gaWYgZXJyb3IgdGhyb3cgYnkgY29tcG9uZW50IG9uIGluaXRcbiAqL1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCJpbXBvcnQge1xuICBpbml0QWxsLFxuICBjcmVhdGVBbGwsXG4gIEJ1dHRvbixcbiAgQ2hhcmFjdGVyQ291bnQsXG4gIENoZWNrYm94ZXMsXG4gIEVycm9yU3VtbWFyeSxcbiAgSGVhZGVyLFxuICBSYWRpb3MsXG4gIFNraXBMaW5rXG59IGZyb20gJ2dvdnVrLWZyb250ZW5kJ1xuXG5jcmVhdGVBbGwoQnV0dG9uKVxuY3JlYXRlQWxsKENoYXJhY3RlckNvdW50KVxuY3JlYXRlQWxsKENoZWNrYm94ZXMpXG5jcmVhdGVBbGwoRXJyb3JTdW1tYXJ5KVxuY3JlYXRlQWxsKEhlYWRlcilcbmNyZWF0ZUFsbChSYWRpb3MpXG5jcmVhdGVBbGwoU2tpcExpbmspXG5cbmluaXRBbGwoKVxuIl0sIm5hbWVzIjpbImNsb3Nlc3RBdHRyaWJ1dGVWYWx1ZSIsIiRlbGVtZW50IiwiYXR0cmlidXRlTmFtZSIsIiRjbG9zZXN0RWxlbWVudFdpdGhBdHRyaWJ1dGUiLCJjbG9zZXN0IiwiZ2V0QXR0cmlidXRlIiwiY29uZmlnT3ZlcnJpZGUiLCJTeW1ib2wiLCJmb3IiLCJDb25maWd1cmFibGVDb21wb25lbnQiLCJDb21wb25lbnQiLCJwYXJhbSIsImNvbmZpZyIsIl9jb25maWciLCJjb25zdHJ1Y3RvciIsIiRyb290IiwiY2hpbGRDb25zdHJ1Y3RvciIsImlzT2JqZWN0IiwiZGVmYXVsdHMiLCJDb25maWdFcnJvciIsImZvcm1hdEVycm9yTWVzc2FnZSIsImRhdGFzZXRDb25maWciLCJub3JtYWxpc2VEYXRhc2V0IiwiXyRyb290IiwiZGF0YXNldCIsIm1lcmdlQ29uZmlncyIsIm5vcm1hbGlzZVN0cmluZyIsInZhbHVlIiwicHJvcGVydHkiLCJ0cmltbWVkVmFsdWUiLCJ0cmltIiwib3V0cHV0Iiwib3V0cHV0VHlwZSIsInR5cGUiLCJpbmNsdWRlcyIsImxlbmd0aCIsImlzRmluaXRlIiwiTnVtYmVyIiwic2NoZW1hIiwib3V0IiwiZW50cmllcyIsIk9iamVjdCIsInByb3BlcnRpZXMiLCJlbnRyeSIsIm5hbWVzcGFjZSIsImZpZWxkIiwidG9TdHJpbmciLCJleHRyYWN0Q29uZmlnQnlOYW1lc3BhY2UiLCJjb25maWdPYmplY3RzIiwiZm9ybWF0dGVkQ29uZmlnT2JqZWN0IiwiY29uZmlnT2JqZWN0Iiwia2V5Iiwia2V5cyIsIm9wdGlvbiIsIm92ZXJyaWRlIiwidmFsaWRhdGVDb25maWciLCJ2YWxpZGF0aW9uRXJyb3JzIiwibmFtZSIsImNvbmRpdGlvbnMiLCJlcnJvcnMiLCJBcnJheSIsImlzQXJyYXkiLCJyZXF1aXJlZCIsImVycm9yTWVzc2FnZSIsImV2ZXJ5IiwicHVzaCIsIm5ld09iamVjdCIsImN1cnJlbnQiLCJrZXlQYXJ0cyIsInNwbGl0IiwiaW5kZXgiLCJnZXRGcmFnbWVudEZyb21VcmwiLCJ1cmwiLCJ1bmRlZmluZWQiLCJwb3AiLCJnZXRCcmVha3BvaW50Iiwid2luZG93IiwiZ2V0Q29tcHV0ZWRTdHlsZSIsImRvY3VtZW50IiwiZG9jdW1lbnRFbGVtZW50IiwiZ2V0UHJvcGVydHlWYWx1ZSIsInNldEZvY3VzIiwib3B0aW9ucyIsIl9vcHRpb25zJG9uQmVmb3JlRm9jdSIsImlzRm9jdXNhYmxlIiwic2V0QXR0cmlidXRlIiwib25Gb2N1cyIsImFkZEV2ZW50TGlzdGVuZXIiLCJvbkJsdXIiLCJvbmNlIiwiX29wdGlvbnMkb25CbHVyIiwiY2FsbCIsInJlbW92ZUF0dHJpYnV0ZSIsIm9uQmVmb3JlRm9jdXMiLCJmb2N1cyIsImlzSW5pdGlhbGlzZWQiLCJtb2R1bGVOYW1lIiwiSFRNTEVsZW1lbnQiLCJoYXNBdHRyaWJ1dGUiLCJpc1N1cHBvcnRlZCIsIiRzY29wZSIsImJvZHkiLCJjbGFzc0xpc3QiLCJjb250YWlucyIsIm1lc3NhZ2UiLCJJbml0RXJyb3IiLCJlbGVtZW50VHlwZSIsIkVsZW1lbnRFcnJvciIsImVsZW1lbnQiLCJjb21wb25lbnQiLCJpZGVudGlmaWVyIiwiZXhwZWN0ZWRUeXBlIiwiY2hlY2tTdXBwb3J0IiwiY2hlY2tJbml0aWFsaXNlZCIsIlN1cHBvcnRFcnJvciIsIkFjY29yZGlvbiIsImkxOG4iLCJjb250cm9sc0NsYXNzIiwic2hvd0FsbENsYXNzIiwic2hvd0FsbFRleHRDbGFzcyIsInNlY3Rpb25DbGFzcyIsInNlY3Rpb25FeHBhbmRlZENsYXNzIiwic2VjdGlvbkJ1dHRvbkNsYXNzIiwic2VjdGlvbkhlYWRlckNsYXNzIiwic2VjdGlvbkhlYWRpbmdDbGFzcyIsInNlY3Rpb25IZWFkaW5nRGl2aWRlckNsYXNzIiwic2VjdGlvbkhlYWRpbmdUZXh0Q2xhc3MiLCJzZWN0aW9uSGVhZGluZ1RleHRGb2N1c0NsYXNzIiwic2VjdGlvblNob3dIaWRlVG9nZ2xlQ2xhc3MiLCJzZWN0aW9uU2hvd0hpZGVUb2dnbGVGb2N1c0NsYXNzIiwic2VjdGlvblNob3dIaWRlVGV4dENsYXNzIiwidXBDaGV2cm9uSWNvbkNsYXNzIiwiZG93bkNoZXZyb25JY29uQ2xhc3MiLCJzZWN0aW9uU3VtbWFyeUNsYXNzIiwic2VjdGlvblN1bW1hcnlGb2N1c0NsYXNzIiwic2VjdGlvbkNvbnRlbnRDbGFzcyIsIiRzZWN0aW9ucyIsIiRzaG93QWxsQnV0dG9uIiwiJHNob3dBbGxJY29uIiwiJHNob3dBbGxUZXh0IiwiSTE4biIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJpbml0Q29udHJvbHMiLCJpbml0U2VjdGlvbkhlYWRlcnMiLCJ1cGRhdGVTaG93QWxsQnV0dG9uIiwiYXJlQWxsU2VjdGlvbnNPcGVuIiwiY3JlYXRlRWxlbWVudCIsImFkZCIsImFwcGVuZENoaWxkIiwiJGFjY29yZGlvbkNvbnRyb2xzIiwiaW5zZXJ0QmVmb3JlIiwiZmlyc3RDaGlsZCIsIm9uU2hvd09ySGlkZUFsbFRvZ2dsZSIsImV2ZW50Iiwib25CZWZvcmVNYXRjaCIsImZvckVhY2giLCIkc2VjdGlvbiIsImkiLCIkaGVhZGVyIiwicXVlcnlTZWxlY3RvciIsImNvbnN0cnVjdEhlYWRlck1hcmt1cCIsInNldEV4cGFuZGVkIiwiaXNFeHBhbmRlZCIsIm9uU2VjdGlvblRvZ2dsZSIsInNldEluaXRpYWxTdGF0ZSIsIiRzcGFuIiwiJGhlYWRpbmciLCIkc3VtbWFyeSIsIiRidXR0b24iLCJpZCIsImF0dHIiLCJmcm9tIiwiYXR0cmlidXRlcyIsIiRoZWFkaW5nVGV4dCIsIiRoZWFkaW5nVGV4dEZvY3VzIiwiY2hpbGROb2RlcyIsIiRjaGlsZCIsIiRzaG93SGlkZVRvZ2dsZSIsIiRzaG93SGlkZVRvZ2dsZUZvY3VzIiwiJHNob3dIaWRlVGV4dCIsIiRzaG93SGlkZUljb24iLCJnZXRCdXR0b25QdW5jdHVhdGlvbkVsIiwiJHN1bW1hcnlTcGFuIiwiJHN1bW1hcnlTcGFuRm9jdXMiLCJyZW1vdmUiLCJyZW1vdmVDaGlsZCIsIiRmcmFnbWVudCIsInRhcmdldCIsIkVsZW1lbnQiLCJub3dFeHBhbmRlZCIsInN0b3JlU3RhdGUiLCJleHBhbmRlZCIsIiRjb250ZW50IiwibmV3QnV0dG9uVGV4dCIsInQiLCJ0ZXh0Q29udGVudCIsImFyaWFMYWJlbFBhcnRzIiwiYXJpYUxhYmVsTWVzc2FnZSIsImpvaW4iLCJ0b2dnbGUiLCJnZXRJZGVudGlmaWVyIiwicmVtZW1iZXJFeHBhbmRlZCIsInNlc3Npb25TdG9yYWdlIiwic2V0SXRlbSIsImV4Y2VwdGlvbiIsInN0YXRlIiwiZ2V0SXRlbSIsIiRwdW5jdHVhdGlvbkVsIiwiZnJlZXplIiwiaGlkZUFsbFNlY3Rpb25zIiwiaGlkZVNlY3Rpb24iLCJoaWRlU2VjdGlvbkFyaWFMYWJlbCIsInNob3dBbGxTZWN0aW9ucyIsInNob3dTZWN0aW9uIiwic2hvd1NlY3Rpb25BcmlhTGFiZWwiLCJERUJPVU5DRV9USU1FT1VUX0lOX1NFQ09ORFMiLCJCdXR0b24iLCJkZWJvdW5jZUZvcm1TdWJtaXRUaW1lciIsImhhbmRsZUtleURvd24iLCJkZWJvdW5jZSIsIiR0YXJnZXQiLCJwcmV2ZW50RGVmYXVsdCIsImNsaWNrIiwicHJldmVudERvdWJsZUNsaWNrIiwic2V0VGltZW91dCIsIkNoYXJhY3RlckNvdW50IiwiY29uZmlnT3ZlcnJpZGVzIiwibWF4bGVuZ3RoIiwibWF4d29yZHMiLCJfcmVmIiwiX3RoaXMkY29uZmlnJG1heHdvcmRzIiwiJHRleHRhcmVhIiwiJHZpc2libGVDb3VudE1lc3NhZ2UiLCIkc2NyZWVuUmVhZGVyQ291bnRNZXNzYWdlIiwibGFzdElucHV0VGltZXN0YW1wIiwibGFzdElucHV0VmFsdWUiLCJ2YWx1ZUNoZWNrZXIiLCJtYXhMZW5ndGgiLCJIVE1MVGV4dEFyZWFFbGVtZW50IiwiSFRNTElucHV0RWxlbWVudCIsImxvY2FsZSIsIkluZmluaXR5IiwidGV4dGFyZWFEZXNjcmlwdGlvbklkIiwiJHRleHRhcmVhRGVzY3JpcHRpb24iLCJnZXRFbGVtZW50QnlJZCIsIiRlcnJvck1lc3NhZ2UiLCJtYXRjaCIsImNvdW50IiwiaW5zZXJ0QWRqYWNlbnRFbGVtZW50IiwiY2xhc3NOYW1lIiwiYmluZENoYW5nZUV2ZW50cyIsInVwZGF0ZUNvdW50TWVzc2FnZSIsImhhbmRsZUtleVVwIiwiaGFuZGxlRm9jdXMiLCJoYW5kbGVCbHVyIiwidXBkYXRlVmlzaWJsZUNvdW50TWVzc2FnZSIsIkRhdGUiLCJub3ciLCJzZXRJbnRlcnZhbCIsInVwZGF0ZUlmVmFsdWVDaGFuZ2VkIiwiY2xlYXJJbnRlcnZhbCIsInVwZGF0ZVNjcmVlblJlYWRlckNvdW50TWVzc2FnZSIsInJlbWFpbmluZ051bWJlciIsImlzRXJyb3IiLCJpc092ZXJUaHJlc2hvbGQiLCJnZXRDb3VudE1lc3NhZ2UiLCJ0ZXh0IiwiX3RleHQkbWF0Y2giLCJ0b2tlbnMiLCJjb3VudFR5cGUiLCJmb3JtYXRDb3VudE1lc3NhZ2UiLCJ0cmFuc2xhdGlvbktleVN1ZmZpeCIsIk1hdGgiLCJhYnMiLCJ0aHJlc2hvbGQiLCJjdXJyZW50TGVuZ3RoIiwidGhyZXNob2xkVmFsdWUiLCJjaGFyYWN0ZXJzVW5kZXJMaW1pdCIsIm9uZSIsIm90aGVyIiwiY2hhcmFjdGVyc0F0TGltaXQiLCJjaGFyYWN0ZXJzT3ZlckxpbWl0Iiwid29yZHNVbmRlckxpbWl0Iiwid29yZHNBdExpbWl0Iiwid29yZHNPdmVyTGltaXQiLCJ0ZXh0YXJlYURlc2NyaXB0aW9uIiwiYW55T2YiLCJDaGVja2JveGVzIiwiJGlucHV0cyIsIiRpbnB1dCIsInRhcmdldElkIiwic3luY0FsbENvbmRpdGlvbmFsUmV2ZWFscyIsImhhbmRsZUNsaWNrIiwic3luY0NvbmRpdGlvbmFsUmV2ZWFsV2l0aElucHV0U3RhdGUiLCJpbnB1dElzQ2hlY2tlZCIsImNoZWNrZWQiLCJ1bkNoZWNrQWxsSW5wdXRzRXhjZXB0IiwiYWxsSW5wdXRzV2l0aFNhbWVOYW1lIiwiJGlucHV0V2l0aFNhbWVOYW1lIiwiaGFzU2FtZUZvcm1Pd25lciIsImZvcm0iLCJ1bkNoZWNrRXhjbHVzaXZlSW5wdXRzIiwiYWxsSW5wdXRzV2l0aFNhbWVOYW1lQW5kRXhjbHVzaXZlQmVoYXZpb3VyIiwiJGV4Y2x1c2l2ZUlucHV0IiwiJGNsaWNrZWRJbnB1dCIsImhhc0FyaWFDb250cm9scyIsImhhc0JlaGF2aW91ckV4Y2x1c2l2ZSIsIkVycm9yU3VtbWFyeSIsImRpc2FibGVBdXRvRm9jdXMiLCJmb2N1c1RhcmdldCIsIkhUTUxBbmNob3JFbGVtZW50IiwiaW5wdXRJZCIsImhyZWYiLCIkbGVnZW5kT3JMYWJlbCIsImdldEFzc29jaWF0ZWRMZWdlbmRPckxhYmVsIiwic2Nyb2xsSW50b1ZpZXciLCJwcmV2ZW50U2Nyb2xsIiwiX2RvY3VtZW50JHF1ZXJ5U2VsZWN0IiwiJGZpZWxkc2V0IiwiJGxlZ2VuZHMiLCJnZXRFbGVtZW50c0J5VGFnTmFtZSIsIiRjYW5kaWRhdGVMZWdlbmQiLCJsZWdlbmRUb3AiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJ0b3AiLCJpbnB1dFJlY3QiLCJoZWlnaHQiLCJpbm5lckhlaWdodCIsImlucHV0Qm90dG9tIiwiRXhpdFRoaXNQYWdlIiwiJHNraXBsaW5rQnV0dG9uIiwiJHVwZGF0ZVNwYW4iLCIkaW5kaWNhdG9yQ29udGFpbmVyIiwiJG92ZXJsYXkiLCJrZXlwcmVzc0NvdW50ZXIiLCJsYXN0S2V5V2FzTW9kaWZpZWQiLCJ0aW1lb3V0VGltZSIsImtleXByZXNzVGltZW91dElkIiwidGltZW91dE1lc3NhZ2VJZCIsImJ1aWxkSW5kaWNhdG9yIiwiaW5pdFVwZGF0ZVNwYW4iLCJpbml0QnV0dG9uQ2xpY2tIYW5kbGVyIiwiaGFuZGxlS2V5cHJlc3MiLCJiaW5kIiwiZ292dWtGcm9udGVuZEV4aXRUaGlzUGFnZUtleXByZXNzIiwicmVzZXRQYWdlIiwiJGluZGljYXRvciIsInVwZGF0ZUluZGljYXRvciIsIiRpbmRpY2F0b3JzIiwiZXhpdFBhZ2UiLCJsb2NhdGlvbiIsImNsZWFyVGltZW91dCIsInNldEtleXByZXNzVGltZXIiLCJyZXNldEtleXByZXNzVGltZXIiLCJzaGlmdEtleSIsImFjdGl2YXRlZCIsInRpbWVkT3V0IiwicHJlc3NUd29Nb3JlVGltZXMiLCJwcmVzc09uZU1vcmVUaW1lIiwiRmlsZVVwbG9hZCIsIiRzdGF0dXMiLCIkYW5ub3VuY2VtZW50cyIsImVudGVyZWRBbm90aGVyRWxlbWVudCIsIiRsYWJlbCIsImZpbmRMYWJlbCIsImFyaWFEZXNjcmliZWRCeSIsImlubmVyVGV4dCIsImNvbW1hU3BhbiIsImNvbnRhaW5lclNwYW4iLCJidXR0b25TcGFuIiwiaW5zZXJ0QWRqYWNlbnRUZXh0IiwiaW5zdHJ1Y3Rpb25TcGFuIiwib25DbGljayIsIm9uQ2hhbmdlIiwidXBkYXRlRGlzYWJsZWRTdGF0ZSIsIm9ic2VydmVEaXNhYmxlZFN0YXRlIiwib25Ecm9wIiwidXBkYXRlRHJvcHpvbmVWaXNpYmlsaXR5IiwiZGlzYWJsZWQiLCJoaWRlRHJhZ2dpbmdTdGF0ZSIsIk5vZGUiLCJkYXRhVHJhbnNmZXIiLCJpc0NvbnRhaW5pbmdGaWxlcyIsInNob3dEcmFnZ2luZ1N0YXRlIiwiZmlsZXMiLCJkaXNwYXRjaEV2ZW50IiwiQ3VzdG9tRXZlbnQiLCJmaWxlQ291bnQiLCJvYnNlcnZlciIsIk11dGF0aW9uT2JzZXJ2ZXIiLCJtdXRhdGlvbkxpc3QiLCJtdXRhdGlvbiIsIm9ic2VydmUiLCJjaG9vc2VGaWxlc0J1dHRvbiIsImRyb3BJbnN0cnVjdGlvbiIsIm5vRmlsZUNob3NlbiIsIm11bHRpcGxlRmlsZXNDaG9zZW4iLCJlbnRlcmVkRHJvcFpvbmUiLCJsZWZ0RHJvcFpvbmUiLCJoYXNOb1R5cGVzSW5mbyIsInR5cGVzIiwiaXNEcmFnZ2luZ0ZpbGVzIiwic29tZSIsIkhlYWRlciIsIiRtZW51QnV0dG9uIiwiJG1lbnUiLCJtZW51SXNPcGVuIiwibXFsIiwibWVudUlkIiwic2V0dXBSZXNwb25zaXZlQ2hlY2tzIiwiaGFuZGxlTWVudUJ1dHRvbkNsaWNrIiwiYnJlYWtwb2ludCIsIm1hdGNoTWVkaWEiLCJjaGVja01vZGUiLCJhZGRMaXN0ZW5lciIsIm1hdGNoZXMiLCJOb3RpZmljYXRpb25CYW5uZXIiLCJQYXNzd29yZElucHV0IiwiJHNob3dIaWRlQnV0dG9uIiwiJHNjcmVlblJlYWRlclN0YXR1c01lc3NhZ2UiLCJIVE1MQnV0dG9uRWxlbWVudCIsImhpZGUiLCJwZXJzaXN0ZWQiLCJzaG93Iiwic2V0VHlwZSIsImlzSGlkZGVuIiwicHJlZml4QnV0dG9uIiwicHJlZml4U3RhdHVzIiwic2hvd1Bhc3N3b3JkIiwiaGlkZVBhc3N3b3JkIiwic2hvd1Bhc3N3b3JkQXJpYUxhYmVsIiwiaGlkZVBhc3N3b3JkQXJpYUxhYmVsIiwicGFzc3dvcmRTaG93bkFubm91bmNlbWVudCIsInBhc3N3b3JkSGlkZGVuQW5ub3VuY2VtZW50IiwiUmFkaW9zIiwiJGFsbElucHV0cyIsIiRjbGlja2VkSW5wdXRGb3JtIiwiJGNsaWNrZWRJbnB1dE5hbWUiLCJoYXNTYW1lTmFtZSIsIlNlcnZpY2VOYXZpZ2F0aW9uIiwiU2tpcExpbmsiLCJfdGhpcyQkcm9vdCRnZXRBdHRyaWIiLCJoYXNoIiwiVVJMIiwiZXJyb3IiLCJvcmlnaW4iLCJwYXRobmFtZSIsImxpbmtlZEVsZW1lbnRJZCIsIiRsaW5rZWRFbGVtZW50IiwiVGFicyIsIiR0YWJzIiwiJHRhYkxpc3QiLCIkdGFiTGlzdEl0ZW1zIiwianNIaWRkZW5DbGFzcyIsImNoYW5naW5nSGFzaCIsImJvdW5kVGFiQ2xpY2siLCJib3VuZFRhYktleWRvd24iLCJib3VuZE9uSGFzaENoYW5nZSIsIm9uVGFiQ2xpY2siLCJvblRhYktleWRvd24iLCJvbkhhc2hDaGFuZ2UiLCJfdGhpcyRtcWwiLCJzZXR1cCIsInRlYXJkb3duIiwiX3RoaXMkZ2V0VGFiIiwiJGl0ZW0iLCIkdGFiIiwic2V0QXR0cmlidXRlcyIsImhpZGVUYWIiLCIkYWN0aXZlVGFiIiwiZ2V0VGFiIiwic2hvd1RhYiIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJ1bnNldEF0dHJpYnV0ZXMiLCIkdGFiV2l0aEhhc2giLCIkcHJldmlvdXNUYWIiLCJnZXRDdXJyZW50VGFiIiwidW5oaWdobGlnaHRUYWIiLCJoaWRlUGFuZWwiLCJoaWdobGlnaHRUYWIiLCJzaG93UGFuZWwiLCJwYW5lbElkIiwiJHBhbmVsIiwiZ2V0UGFuZWwiLCIkY3VycmVudFRhYiIsIiRuZXh0VGFiIiwiY3VycmVudFRhcmdldCIsImNyZWF0ZUhpc3RvcnlFbnRyeSIsImFjdGl2YXRlUHJldmlvdXNUYWIiLCJhY3RpdmF0ZU5leHRUYWIiLCJwYXJlbnRFbGVtZW50IiwiJG5leHRUYWJMaXN0SXRlbSIsIm5leHRFbGVtZW50U2libGluZyIsIiRwcmV2aW91c1RhYkxpc3RJdGVtIiwicHJldmlvdXNFbGVtZW50U2libGluZyIsIkdPVlVLRnJvbnRlbmRFcnJvciIsIkVycm9yIiwiYXJncyIsInN1cHBvcnRNZXNzYWdlIiwiSFRNTFNjcmlwdEVsZW1lbnQiLCJwcm90b3R5cGUiLCJtZXNzYWdlT3JPcHRpb25zIiwiY29tcG9uZW50T3JNZXNzYWdlIiwidHJhbnNsYXRpb25zIiwiX2NvbmZpZyRsb2NhbGUiLCJsYW5nIiwibG9va3VwS2V5IiwidHJhbnNsYXRpb24iLCJ0cmFuc2xhdGlvblBsdXJhbEZvcm0iLCJnZXRQbHVyYWxTdWZmaXgiLCJyZXBsYWNlUGxhY2Vob2xkZXJzIiwidHJhbnNsYXRpb25TdHJpbmciLCJmb3JtYXR0ZXIiLCJJbnRsIiwiTnVtYmVyRm9ybWF0Iiwic3VwcG9ydGVkTG9jYWxlc09mIiwicmVwbGFjZSIsInBsYWNlaG9sZGVyV2l0aEJyYWNlcyIsInBsYWNlaG9sZGVyS2V5IiwiaGFzT3duUHJvcGVydHkiLCJwbGFjZWhvbGRlclZhbHVlIiwiZm9ybWF0IiwiaGFzSW50bFBsdXJhbFJ1bGVzU3VwcG9ydCIsIkJvb2xlYW4iLCJQbHVyYWxSdWxlcyIsInByZWZlcnJlZEZvcm0iLCJzZWxlY3QiLCJzZWxlY3RQbHVyYWxGb3JtVXNpbmdGYWxsYmFja1J1bGVzIiwiY29uc29sZSIsIndhcm4iLCJmbG9vciIsInJ1bGVzZXQiLCJnZXRQbHVyYWxSdWxlc0ZvckxvY2FsZSIsInBsdXJhbFJ1bGVzIiwibG9jYWxlU2hvcnQiLCJwbHVyYWxSdWxlIiwicGx1cmFsUnVsZXNNYXAiLCJsYW5ndWFnZXMiLCJhcmFiaWMiLCJjaGluZXNlIiwiZnJlbmNoIiwiZ2VybWFuIiwiaXJpc2giLCJydXNzaWFuIiwic2NvdHRpc2giLCJzcGFuaXNoIiwid2Vsc2giLCJuIiwibGFzdFR3byIsImxhc3QiLCJpbml0QWxsIiwiX2NvbmZpZyRzY29wZSIsIm9uRXJyb3IiLCJsb2ciLCJjb21wb25lbnRzIiwiYWNjb3JkaW9uIiwiYnV0dG9uIiwiY2hhcmFjdGVyQ291bnQiLCJlcnJvclN1bW1hcnkiLCJleGl0VGhpc1BhZ2UiLCJmaWxlVXBsb2FkIiwibm90aWZpY2F0aW9uQmFubmVyIiwicGFzc3dvcmRJbnB1dCIsInNjb3BlIiwiY3JlYXRlQWxsIiwiY3JlYXRlQWxsT3B0aW9ucyIsIl9jcmVhdGVBbGxPcHRpb25zJHNjbyIsIiRlbGVtZW50cyIsIm1hcCIsImZpbHRlciJdLCJzb3VyY2VSb290IjoiIn0=