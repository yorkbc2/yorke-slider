"use strict";
(function () {
    /**
     * Главный обьект для создания слайдера
     * @param {string} selector Селектор елемента для создания слайдера в нём.
     * @param {object} options Настройки слайдера.
     */
    function YorkeSlider(selector, options) {
        this._element = document.querySelector(selector);
        this._slides = [];
        this._buttons = [];
        this._currentSlide = 0;
        this._arrows = ["left", "right"];
        if (typeof options === 'object') {
            this._options = options;
        }
        else {
            this._options = {};
        }
        this.config = {
            width: 900
        };
        if (this._element) {
            this.init();
        }
    }
    YorkeSlider.prototype.init = function () {
        let slides = this._element.querySelectorAll('.slide');
        if (slides && slides.length > 0) {
            this.classNames();
            slides.forEach((item, index) => {
                item.classList.remove('slide');
                item.classList.add('yorke--slider-slide');
                let slideElement = this.Helper.createSlideElement(item);
                this._slides.push(slideElement);
                this._buttons.push({
                    title: slideElement.title,
                    index: index
                });
            });
            if (YorkeFunctions.objValue(this._options, 'buttons') !== false) {
                this.initButtons();
            }
            if (YorkeFunctions.objValue(this._options, 'arrows') !== false) {
                this.initArrows();
            }
            this.changeSlides();
        }
    };
    YorkeSlider.prototype.initButtons = function () {
        let buttonsContainer = YorkeFunctions.create("div", { className: "yorke--slider-buttons" });
        this._buttons = this._buttons.map((item, index) => {
            let button = YorkeFunctions.create("button", {
                className: index === 0 ? "yorke--button yorke--button-active" : "yorke--button",
                onclick: (e) => { this.changeSlidesHandler(e, item.index); },
                innerText: item.title
            });
            buttonsContainer.appendChild(button);
            item.element = button;
            return item;
        });
        this._element.appendChild(buttonsContainer);
    };
    YorkeSlider.prototype.initArrows = function () {
        for (let i = 0; i < 2; i++) {
            let arrowDirection = this._arrows[i];
            let arrow = YorkeFunctions.create('button', {
                className: `yorke--arrow-container yorke--container-${arrowDirection}`,
                append: (c) => {
                    return c("span", {
                        className: `yorke--arrow yorke--arrow-${arrowDirection}`
                    });
                },
                onclick: (e) => { this.changeSlideByArrow(e, arrowDirection); }
            });
            this._view.appendChild(arrow);
        }
    };
    /**
     * @param {object} event MouseEvent
     * @param {string} dir   Куда слайдить
     */
    YorkeSlider.prototype.changeSlideByArrow = function (event, dir) {
        let d;
        if (dir === 'right') {
            d = 1;
        }
        else {
            d = -1;
        }
        let currentSlide = this._currentSlide + d;
        if (currentSlide >= this._slides.length) {
            this._currentSlide = 0;
        }
        else if (currentSlide < 0) {
            this._currentSlide = this._slides.length - 1;
        }
        else {
            this._currentSlide = currentSlide;
        }
        this.changeSlides();
    };
    YorkeSlider.prototype.changeSlides = function () {
        let _currentSlide = this._currentSlide;
        this._slides.forEach((item, index) => {
            if (index === _currentSlide) {
                item.element.style.transform = `translateX(0px)`;
            }
            else if (index > _currentSlide) {
                item.element.style.transform = `translateX(${this.config.width * index}px)`;
            }
            else if (index < _currentSlide && index !== 0) {
                item.element.style.transform = `translateX(${-(this.config.width * index)}px)`;
            }
            else if (index < _currentSlide && index === 0) {
                item.element.style.transform = `translateX(${-this.config.width}px)`;
            }
        });
    };
    YorkeSlider.prototype.classNames = function () {
        let slidesContainer = this._element.querySelector('.slides');
        if (slidesContainer) {
            this._view = slidesContainer;
            slidesContainer.className = "yorke--slider-view";
        }
        this._element.className = "yorke--slider";
    };
    YorkeSlider.prototype.changeSlidesHandler = function (event, index) {
        let el = event.target;
        if (this._currentSlide !== index) {
            this._currentSlide = index;
            this.changeSlides();
            this.activeButtons();
        }
    };
    YorkeSlider.prototype.activeButtons = function () {
        this._buttons.forEach((item) => {
            if (item.index === this._currentSlide) {
                item.element.classList.add('yorke--button-active');
            }
            else {
                item.element.classList.remove('yorke--button-active');
            }
        });
    };
    YorkeSlider.prototype.Helper = {};
    /**
     * Создание типичного елемента слайдера
     * @param {HTMLDivElement} item Слайд
     */
    YorkeSlider.prototype.Helper.createSlideElement = function (item) {
        return {
            element: item,
            title: item.getAttribute('slide-title') || ""
        };
    };
    let YorkeFunctions = {};
    /**
     * Создание елемента DOM
     * @param {string} elementName
     * @param {object} elementOptions
     */
    YorkeFunctions.create = function (elementName, elementOptions) {
        let element = document.createElement(elementName);
        for (let key in elementOptions) {
            if (key === "attributes") {
                for (let attribute in elementOptions[key]) {
                    element.getAttribute(attribute, elementOptions[key][attribute]);
                }
            }
            else if (key === "append" && typeof elementOptions[key] === 'function') {
                element.appendChild(elementOptions[key](YorkeFunctions.create));
            }
            else {
                element[key] = elementOptions[key];
            }
        }
        return element;
    };
    YorkeFunctions.objValue = function (object, key) {
        if (typeof object[key] !== 'undefined') {
            return object[key];
        }
        return {};
    };
    window.YorkeSlider = YorkeSlider;
}());
//# sourceMappingURL=index.js.map