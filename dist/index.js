"use strict";
(function () {
    /**
     * Главный обьект для создания слайдера
     * @param {string} selector Селектор елемента для создания слайдера в нём.
     */
    function YorkeSlider(selector) {
        this._element = document.querySelector(selector);
        this._slides = [];
        this._buttons = [];
        this._currentSlide = 0;
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
            this.initButtons();
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
            else if (key === 'append' && typeof key === 'function') {
                element.appendChild(elementOptions[key](create));
            }
            else {
                element[key] = elementOptions[key];
            }
        }
        return element;
    };
    window.YorkeSlider = YorkeSlider;
}());
//# sourceMappingURL=index.js.map