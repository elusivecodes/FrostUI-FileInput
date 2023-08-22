import $ from '@fr0st/query';
import { generateId } from '@fr0st/ui';

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

    if (this._options.uploadCallback) {
        this._uploadButton = this._renderButton(this._options.uploadStyle, 'upload');
    }

    if (this._options.cancelCallback) {
        this._cancelButton = this._renderButton(this._options.cancelStyle, 'cancel');
    }

    if (this._options.showRemove) {
        this._removeButton = this._renderButton(this._options.removeStyle, 'remove');
    }

    if (this._options.showBrowse) {
        this._browseButton = this._renderButton(this._options.browseStyle, 'browse');
    }

    $.append(this._container, this._group);

    if (this._fileNames) {
        $.append(this._container, this._fileNames);
    }

    if (this._options.showProgress) {
        this._progress = $.create('div', {
            class: this.constructor.classes.progress,
        });

        const id = generateId('upload-progress');

        this._progressBar = $.create('div', {
            class: this.constructor.classes.progressBar,
            attributes: {
                'id': id,
                'role': 'progressbar',
                'aria-valuemin': '0',
                'aria-valuemax': '100',
            },
        });

        $.append(this._progress, this._progressBar);
    }

    $.setAttribute(this._node, { tabindex: -1 });
    $.addClass(this._node, this.constructor.classes.hide);
    $.before(this._node, this._container);
};

/**
 * Render a button.
 * @param {string} style The button style.
 * @param {string} key The button key.
 * @return {HTMLElement} The button.
 */
export function _renderButton(style, key) {
    const button = $.create('button', {
        class: [this.constructor.classes.btn, `btn-${style}`],
        attributes: {
            type: 'button',
        },
    });

    const icon = $.create('div', {
        html: this.constructor.icons[key],
    });

    if (this._options.buttonText) {
        $.setText(button, this.constructor.lang[key]);
        $.addClass(icon, this.constructor.classes.iconText);
    } else {
        $.setAttribute(button, { 'aria-label': this.constructor.lang[key] });
    }

    $.prepend(button, icon);

    return button;
};
