define([], function() {
    'use strict';

    function FormController(el) {
        this.domNode = document.querySelector(el);
        this.title = this.domNode.querySelector('.section_title');
        this.content = this.domNode.querySelector('.section_content');

        this.initialize();
    }

    FormController.prototype.initialize = function() {
        this.title.addEventListener("click", handleFormSection.bind(this), false);

        var surface = this.content.querySelector('select[name=surface]');
        surface.addEventListener('change', handleSurface.bind(this), false);

        var form = this.content.querySelector('select[name=form]');
        form.addEventListener('change', handleForm.bind(this), false);

        var category = this.content.querySelector('select[name=category]');
        category.addEventListener('change', handleCategory.bind(this), false);
    };

    function handleFormSection(e) {
        /*jshint validthis:true */
        this.title.classList.toggle('collapsed');
        this.content.classList.toggle('hide');
    }

    function handleSurface(e) {
        /*jshint validthis:true */
        var surface_other = this.content.querySelector('#other_surface');
        surface_other.disabled = (e.target.value !== 'other');
    }

    function handleForm(e) {
        /*jshint validthis:true */
        var form_other = this.content.querySelector('#other_form');
        form_other.disabled = !e.target.options[e.target.options.length-1].selected;
    }

    function handleCategory(e) {
        /*jshint validthis:true */
        var category_other = this.content.querySelector('#other_category');
        category_other.disabled = !e.target.options[e.target.options.length-1].selected;
    }

    return FormController;
});
