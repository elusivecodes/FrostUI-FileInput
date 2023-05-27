import $ from '@fr0st/query';
import { BaseComponent } from '@fr0st/ui';

/**
 * FileInput Class
 * @class
 */
export default class FileInput extends BaseComponent {
    /**
     * New FileInput constructor.
     * @param {HTMLElement} node The input node.
     * @param {object} [options] The options to create the FileInput with.
     */
    constructor(node, options) {
        super(node, options);

        if (!this._options.uploadCallback) {
            this._options.showUpload = false;
        }

        if (!this._options.cancelCallback) {
            this._options.showCancel = false;
        }

        if (!this._options.removeCallback) {
            this._options.showRemove = false;
        }

        if (this._options.initialValue) {
            this._fileList = $._wrap(this._options.initialValue);
        } else {
            this._fileList = [];
        }

        this._render();
        this._events();

        this._refresh();
        this._refreshDisabled();
    }

    /**
     * Clear the FileInput.
     */
    clear() {
        $.setValue(this._node, null);
        this._refresh();
    }

    /**
     * Disable the FileInput.
     */
    disable() {
        $.setAttribute(this._node, { disabled: true });
        this._refreshDisabled();
    }

    /**
     * Dispose the FileInput.
     */
    dispose() {
        $.remove(this._container);
        $.removeEvent(this._node, 'change.ui.fileinput');
        $.removeAttribute(this._node, 'tabindex');
        $.removeClass(this._node, this.constructor.classes.hide);

        this._container = null;
        this._group = null;
        this._input = null;
        this._fileNames = null;
        this._uploadButton = null;
        this._cancelButton = null;
        this._removeButton = null;
        this._browseButton = null;
        this._progress = null;
        this._progressBar = null;
        this._fileList = null;

        super.dispose();
    }

    /**
     * Enable the FileInput.
     */
    enable() {
        $.removeAttribute(this._node, 'disabled');
        this._refreshDisabled();
    }

    /**
     * Get the files.
     * @return {Array} The files.
     */
    getFiles() {
        const files = $.getProperty(this._node, 'files');

        const results = [];

        for (const file of files) {
            results.push(file);
        }

        return results;
    }

    /**
     * Render a button.
     * @param {string} style The button style.
     * @param {string} key The button key.
     * @return {HTMLElement} The button.
     */
    static _renderButton(style, key) {
        const button = $.create('button', {
            class: [this.classes.btn, `btn-${style}`],
            text: this.lang[key],
            attributes: {
                type: 'button',
            },
        });

        const icon = $.create('div', {
            class: this.classes.icon,
            html: this.icons[key],
        });

        $.prepend(button, icon);

        return button;
    }
}
