/**
 * FileInput Render
 */

Object.assign(FileInput.prototype, {

    /**
     * Refresh the file input.
     */
    _refresh() {
        const files = this.getFiles();
        const hasFiles = files.length > 0;

        let fileNames;
        if (hasFiles) {
            fileNames = this._getFileNames();
        } else {
            fileNames = this._fileList;
        }

        fileNames = fileNames.join(this._settings.multiSeparator);

        if (this._input) {
            dom.setValue(this._input, fileNames);
        } else {
            dom.setText(this._fileNames, fileNames);
        }

        if (this._uploadButton) {
            if (hasFiles) {
                dom.append(this._group, this._uploadButton);
            } else {
                dom.detach(this._uploadButton);
            }
        }

        if (this._cancelButton) {
            dom.detach(this._cancelButton);
        }

        if (this._removeButton) {
            if (fileNames) {
                dom.append(this._group, this._removeButton);
            } else {
                dom.detach(this._removeButton);
            }
        }

        if (this._browseButton) {
            dom.append(this._group, this._browseButton);
        }
    },

    /**
     * Render the file input.
     */
    _render() {
        this._container = dom.create('div');

        if (this._settings.inputStyle === 'none') {
            this._group = dom.create('div', {
                class: this.constructor.classes.btnGroup
            });

            this._fileNames = dom.create('small', {
                class: this.constructor.classes.fileNames
            });
        } else {
            this._group = dom.create('div', {
                class: this.constructor.classes.inputGroup
            });

            const formInput = dom.create('div', {
                class: this.constructor.classes.formInput
            });

            this._input = dom.create('input', {
                attributes: {
                    type: 'text',
                    placeholder: dom.is(this._node, '[multiple]') ?
                        this.constructor.lang.selectFiles :
                        this.constructor.lang.selectFile,
                    tabindex: -1
                }
            });

            if (this._settings.inputStyle === 'filled') {
                dom.addClass(this._input, this.constructor.classes.inputFilled);
                dom.addClass(this._group, this.constructor.classes.inputGroupFilled);
            } else {
                dom.addClass(this._input, this.constructor.classes.inputOutline);
            }

            dom.append(formInput, this._input);
            dom.append(this._group, formInput);
        }

        if (this._settings.showUpload) {
            this._uploadButton = this.constructor._renderButton(this._settings.uploadStyle, 'upload');
        }

        if (this._settings.showCancel) {
            this._cancelButton = this.constructor._renderButton(this._settings.cancelStyle, 'cancel');
        }

        if (this._settings.showRemove) {
            this._removeButton = this.constructor._renderButton(this._settings.removeStyle, 'remove');
        }

        if (this._settings.showBrowse) {
            this._browseButton = this.constructor._renderButton(this._settings.browseStyle, 'browse');
        }

        dom.append(this._container, this._group);

        if (this._fileNames) {
            dom.append(this._container, this._fileNames);
        }

        dom.setAttribute(this._node, 'tabindex', '-1');
        dom.addClass(this._node, this.constructor.classes.hide);
        dom.before(this._node, this._container);

        if (this._settings.showProgress) {
            this._progress = dom.create('div', {
                class: this.constructor.classes.progress
            });

            this._progressBar = dom.create('div', {
                class: this.constructor.classes.progressBar
            });

            dom.append(this._progress, this._progressBar);
        }
    }

});
