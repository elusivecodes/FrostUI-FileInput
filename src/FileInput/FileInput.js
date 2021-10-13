/**
 * FileInput Class
 * @class
 */
class FileInput extends UI.BaseComponent {

    /**
     * New FileInput constructor.
     * @param {HTMLElement} node The input node.
     * @param {object} [settings] The options to create the FileInput with.
     * @returns {FileInput} A new FileInput object.
     */
    constructor(node, settings) {
        super(node, settings);

        if (!this._settings.uploadCallback) {
            this._settings.showUpload = false;
        }

        if (!this._settings.cancelCallback) {
            this._settings.showCancel = false;
        }

        if (!this._settings.removeCallback) {
            this._settings.showRemove = false;
        }

        if (this._settings.initialValue) {
            this._fileList = Core.wrap(this._settings.initialValue);
        } else {
            this._fileList = [];
        }

        this._render();
        this._events();

        this._refresh();
        this._refreshDisabled();
    }

    /**
     * Disable the FileInput.
     * @returns {FileInput} The FileInput.
     */
    disable() {
        dom.setAttribute(this._node, 'disabled', true);

        this._refreshDisabled();

        return this;
    }

    /**
     * Dispose the FileInput.
     */
    dispose() {
        dom.remove(this._container);
        dom.removeEvent(this._node, 'change.ui.fileinput');
        dom.removeEvent(this._node, 'change.ui.fileinput');
        dom.removeEvent(this._node, 'change.ui.fileinput');
        dom.removeAttribute(this._node, 'tabindex');
        dom.removeClass(this._node, this.constructor.classes.hide);

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
     * @returns {FileInput} The FileInput.
     */
    enable() {
        dom.removeAttribute(this._node, 'disabled');

        this._refreshDisabled();

        return this;
    }

    /**
     * Get the files.
     * @returns {Array} The files.
     */
    getFiles() {
        const files = dom.getProperty(this._node, 'files');

        const results = [];

        for (const file of files) {
            results.push(file);
        }

        return results;
    }


}
