/**
 * FrostUI-FileInput v1.0
 * https://github.com/elusivecodes/FrostUI-FileInput
 */
(function(global, factory) {
    'use strict';

    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory;
    } else {
        factory(global);
    }

})(window, function(window) {
    'use strict';

    if (!window) {
        throw new Error('FrostUI-FileInput requires a Window.');
    }

    if (!('UI' in window)) {
        throw new Error('FrostUI-FileInput requires FrostUI.');
    }

    const Core = window.Core;
    const dom = window.dom;
    const UI = window.UI;

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


    /**
     * FileInput Events
     */

    Object.assign(FileInput.prototype, {

        /**
         * Attach events for the FileInput.
         */
        _events() {
            dom.addEvent(this._node, 'change.ui.fileinput', _ => {
                this._refresh();
            });

            dom.addEvent(this._container, 'dragover.ui.fileinput', e => {
                e.preventDefault();
            });

            dom.addEvent(this._container, 'drop.ui.fileinput', e => {
                e.preventDefault();

                dom.setProperty(this._node, 'files', e.dataTransfer.files);

                this._refresh();
            });

            dom.addEvent(this._input, 'focus.ui.fileinput', _ => {
                dom.blur(this._input);
            });

            dom.addEvent(this._input, 'click.ui.fileinput', _ => {
                dom.click(this._node);
            });

            if (this._uploadButton) {
                const uploadCallback = this._settings.uploadCallback.bind(this);
                const updateProgress = progress => {
                    progress = Math.round(progress);

                    if (this._progressBar) {
                        dom.setText(this._progressBar, `${progress}%`);
                        dom.setStyle(this._progressBar, 'width', `${progress}%`);
                    }
                };

                dom.addEvent(this._uploadButton, 'click.ui.fileinput', _ => {
                    this._startLoading(this._uploadButton);

                    if (this._cancelButton) {
                        dom.append(this._group, this._cancelButton);
                    }

                    if (this._progress) {
                        dom.append(this._container, this._progress);
                    }

                    if (this._progressBar) {
                        dom.removeClass(this._progressBar, [this.constructor.classes.progressSuccess, this.constructor.classes.progressError]);
                    }

                    Promise.resolve(uploadCallback(updateProgress)).then(_ => {
                        this._fileList = this._getFileNames();

                        dom.setValue(this._node, '');

                        dom.triggerEvent(this._node, 'change.ui.fileinput');

                        dom.detach(this._uploadButton);

                        if (this._progressBar) {
                            dom.setText(this._progressBar, this.constructor.lang.uploadSuccess);
                            dom.addClass(this._progressBar, this.constructor.classes.progressSuccess);
                        }
                    }).catch(_ => {
                        if (this._progressBar) {
                            dom.setText(this._progressBar, this.constructor.lang.uploadFail);
                            dom.addClass(this._progressBar, this.constructor.classes.progressError);
                        }
                    }).finally(_ => {
                        this._endLoading();

                        if (this._progressBar) {
                            dom.setStyle(this._progressBar, 'width', '100%');
                        }
                    });
                });
            }

            if (this._cancelButton) {
                const cancelCallback = this._settings.cancelCallback.bind(this);
                dom.addEvent(this._cancelButton, 'click.ui.fileinput', _ => {
                    this._startLoading(this._cancelButton);

                    Promise.resolve(cancelCallback()).then(_ => {
                        if (this._progressBar) {
                            dom.setStyle(this._progressBar, 'width', `0%`);
                        }
                    }).finally(_ => {
                        this._endLoading();

                        if (this._progress) {
                            dom.detach(this._progress);
                        }
                    });
                });
            }

            if (this._removeButton) {
                const removeCallback = this._settings.removeCallback.bind(this);
                dom.addEvent(this._removeButton, 'click.ui.fileinput', _ => {
                    this._startLoading(this._removeButton);

                    Promise.resolve(removeCallback()).then(_ => {
                        this._fileList = [];

                        if (dom.getProperty(this._node, 'files')) {
                            dom.setValue(this._node, '');

                            dom.triggerEvent(this._node, 'change.ui.fileinput');
                        }
                    }).finally(_ => {
                        this._endLoading();

                        if (this._progress) {
                            dom.detach(this._progress);
                        }
                    });
                });
            }

            if (this._browseButton) {
                dom.addEvent(this._browseButton, 'click.ui.fileinput', _ => {
                    dom.click(this._node);
                });
            }
        }

    });


    /**
     * FileInput Helpers
     */

    Object.assign(FileInput.prototype, {

        /**
         * End loading.
         */
        _endLoading() {
            dom.removeAttribute(this._node, 'disabled');

            const buttons = this._getButtons();

            for (const button of buttons) {
                if (!dom.hasDataset(button, 'uiContent')) {
                    continue;
                }

                dom.removeAttribute(button, 'disabled');
                const content = dom.getDataset(button, 'uiContent');
                dom.setHTML(button, content);
                dom.append(this._group, button);
            }

            this._refresh();
        },

        /**
         * Get the buttons.
         * @returns {Array} The buttons.
         */
        _getButtons() {
            return [this._uploadButton, this._cancelButton, this._removeButton, this._browseButton].filter(a => a);
        },

        /**
         * Get the file names.
         * @returns {Array} The file names.
         */
        _getFileNames() {
            return this.getFiles()
                .map(file => file.name);
        },

        /**
         * Refresh the disabled styling.
         */
        _refreshDisabled() {
            const nodes = this._getButtons();

            if (this._input) {
                nodes.push(this._input);
            }

            if (dom.is(this._node, ':disabled')) {
                dom.setAttribute(nodes, 'disabled', true);
            } else {
                dom.removeAttribute(nodes, 'disabled');
            }
        },

        /**
         * Start loading.
         * @param {HTMLElement} button The active button.
         */
        _startLoading(button) {
            if (this._node) {
                dom.setAttribute(this._node, 'disabled', true);
            }

            const buttons = this._getButtons();

            dom.detach(buttons);

            if (button) {
                dom.setAttribute(button, 'disabled', true);
                const content = dom.getHTML(button);
                dom.setDataset(button, 'uiContent', content);
                const spinner = dom.create('span', {
                    class: this.constructor.classes.spinner
                });
                dom.empty(button);
                dom.append(button, spinner);
                dom.append(this._group, button);
            }
        }

    })


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


    /**
     * FileInput Render (Static)
     */

    Object.assign(FileInput, {

        /**
         * Render a button.
         * @param {string} style The button style.
         * @param {string} key The button key.
         * @returns {HTMLElement} The button.
         */
        _renderButton(style, key) {
            const button = dom.create('button', {
                class: [this.classes.btn, `btn-${style}`],
                text: this.lang[key],
                attributes: {
                    type: 'button'
                }
            });

            const icon = dom.create('div', {
                class: this.classes.icon,
                html: this.icons[key]
            });

            dom.prepend(button, icon);

            return button;
        }

    });


    // FileInput default options
    FileInput.defaults = {
        uploadCallback: null,
        cancelCallback: null,
        removeCallback: null,
        initialValue: null,
        inputStyle: 'filled',
        browseStyle: 'light',
        removeStyle: 'light',
        uploadStyle: 'primary',
        cancelStyle: 'danger',
        multiSeparator: ', ',
        showBrowse: true,
        showUpload: true,
        showCancel: true,
        showRemove: true,
        showProgress: true
    };

    // FileInput classes
    FileInput.classes = {
        btn: 'btn',
        btnGroup: 'btn-group',
        fileNames: 'align-middle ms-2',
        formInput: 'form-input',
        hide: 'visually-hidden',
        icon: 'd-inline-block me-1',
        inputFilled: 'input-filled',
        inputOutline: 'input-outline',
        inputGroup: 'input-group',
        inputGroupFilled: 'input-group-filled',
        progress: 'progress mt-1',
        progressBar: 'progress-bar',
        progressError: 'bg-danger',
        progressSuccess: 'bg-success',
        spinner: 'spinner-border spinner-border-sm'
    };

    // FileInput icons
    FileInput.icons = {
        browse: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="M19 20H4a2 2 0 0 1-2-2V6c0-1.11.89-2 2-2h6l2 2h7a2 2 0 0 1 2 2H4v10l2.14-8h17.07l-2.28 8.5c-.23.87-1.01 1.5-1.93 1.5z" fill="currentColor"/></svg>',
        cancel: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="M20 6.91L17.09 4L12 9.09L6.91 4L4 6.91L9.09 12L4 17.09L6.91 20L12 14.91L17.09 20L20 17.09L14.91 12L20 6.91z" fill="currentColor"/></svg>',
        remove: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="M20 6.91L17.09 4L12 9.09L6.91 4L4 6.91L9.09 12L4 17.09L6.91 20L12 14.91L17.09 20L20 17.09L14.91 12L20 6.91z" fill="currentColor"/></svg>',
        upload: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="M9 16v-6H5l7-7l7 7h-4v6H9m-4 4v-2h14v2H5z" fill="currentColor"/></svg>'
    };

    // FileInput lang
    FileInput.lang = {
        browse: 'Browse',
        cancel: 'Cancel',
        remove: 'Remove',
        selectFiles: 'Select files ...',
        selectFile: 'Select file ...',
        upload: 'Upload',
        uploadFailed: 'Upload failed',
        uploadSuccess: 'Upload success'
    };

    UI.initComponent('fileinput', FileInput);

    UI.FileInput = FileInput;

});