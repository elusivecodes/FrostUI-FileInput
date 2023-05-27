import $ from '@fr0st/query';

/**
 * Render the file input.
 */
export function _render() {
    this._container = $.create('div');

    if (this._options.inputStyle === 'none') {
        this._group = $.create('div', {
            class: this.constructor.classes.btnGroup,
        });

        this._fileNames = $.create('small', {
            class: this.constructor.classes.fileNames,
        });
    } else {
        this._group = $.create('div', {
            class: this.constructor.classes.inputGroup,
        });

        const formInput = $.create('div', {
            class: this.constructor.classes.formInput,
        });

        this._input = $.create('input', {
            attributes: {
                type: 'text',
                placeholder: $.is(this._node, '[multiple]') ?
                    this.constructor.lang.selectFiles :
                    this.constructor.lang.selectFile,
                tabindex: -1,
            },
        });

        if (this._options.inputStyle === 'filled') {
            $.addClass(this._input, this.constructor.classes.inputFilled);
            $.addClass(this._group, this.constructor.classes.inputGroupFilled);
        } else {
            $.addClass(this._input, this.constructor.classes.inputOutline);
        }

        $.append(formInput, this._input);
        $.append(this._group, formInput);
    }

    if (this._options.showUpload) {
        this._uploadButton = this.constructor._renderButton(this._options.uploadStyle, 'upload');
    }

    if (this._options.showCancel) {
        this._cancelButton = this.constructor._renderButton(this._options.cancelStyle, 'cancel');
    }

    if (this._options.showRemove) {
        this._removeButton = this.constructor._renderButton(this._options.removeStyle, 'remove');
    }

    if (this._options.showBrowse) {
        this._browseButton = this.constructor._renderButton(this._options.browseStyle, 'browse');
    }

    $.append(this._container, this._group);

    if (this._fileNames) {
        $.append(this._container, this._fileNames);
    }

    if (this._options.showProgress) {
        this._progress = $.create('div', {
            class: this.constructor.classes.progress,
        });

        this._progressBar = $.create('div', {
            class: this.constructor.classes.progressBar,
        });

        $.append(this._progress, this._progressBar);
    }

    $.setAttribute(this._node, { tabindex: -1 });
    $.addClass(this._node, this.constructor.classes.hide);
    $.before(this._node, this._container);
};
