(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@fr0st/ui'), require('@fr0st/query')) :
    typeof define === 'function' && define.amd ? define(['exports', '@fr0st/ui', '@fr0st/query'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.UI = global.UI || {}, global.UI, global.fQuery));
})(this, (function (exports, ui, $) { 'use strict';

    /**
     * FileInput Class
     * @class
     */
    class FileInput extends ui.BaseComponent {
        /**
         * New FileInput constructor.
         * @param {HTMLElement} node The input node.
         * @param {object} [options] The options to create the FileInput with.
         */
        constructor(node, options) {
            super(node, options);

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
    }

    /**
     * Attach events for the FileInput.
     */
    function _events() {
        $.addEvent(this._node, 'change.ui.fileinput', (_) => {
            this._refresh();
        });

        $.addEvent(this._container, 'dragover.ui.fileinput', (e) => {
            e.preventDefault();
        });

        $.addEvent(this._container, 'drop.ui.fileinput', (e) => {
            e.preventDefault();

            $.setProperty(this._node, { files: e.dataTransfer.files });

            this._refresh();
        });

        $.addEvent(this._input, 'focus.ui.fileinput', (_) => {
            $.blur(this._input);
        });

        $.addEvent(this._input, 'click.ui.fileinput', (_) => {
            $.click(this._node);
        });

        if (this._uploadButton) {
            const updateProgress = (progress) => {
                progress = Math.round(progress * 100);

                if (this._progressBar) {
                    $.setText(this._progressBar, `${progress}%`);
                    $.setStyle(this._progressBar, { width: `${progress}%` });
                    $.setAttribute(this._progressBar, 'aria-valuenow', progress);
                }
            };

            $.addEvent(this._uploadButton, 'click.ui.fileinput', (_) => {
                this._startLoading(this._uploadButton);

                if (this._cancelButton) {
                    $.append(this._group, this._cancelButton);
                }

                if (this._progress) {
                    $.append(this._container, this._progress);
                }

                if (this._progressBar) {
                    $.removeClass(this._progressBar, [this.constructor.classes.progressSuccess, this.constructor.classes.progressError]);
                    $.setAttribute(this._progressBar, { 'aria-valuenow': 0 });

                    const progressBarId = $.getAttribute(this._progressBar, 'id');
                    $.setAttribute(this._uploadButton, { 'aria-describedby': progressBarId });
                }

                const uploadCallback = this._options.uploadCallback.bind(this);

                Promise.resolve(uploadCallback(updateProgress))
                    .then((_) => {
                        this._fileList = this._getFileNames();

                        $.setValue(this._node, '');
                        $.triggerEvent(this._node, 'change.ui.fileinput');
                        $.detach(this._uploadButton);

                        if (this._progressBar) {
                            $.setText(this._progressBar, this.constructor.lang.uploadSuccess);
                            $.addClass(this._progressBar, this.constructor.classes.progressSuccess);
                            $.removeAttribute(this._uploadButton, 'aria-describedby');
                        }
                    }).catch((_) => {
                        if (this._progressBar) {
                            $.setText(this._progressBar, this.constructor.lang.uploadFail);
                            $.addClass(this._progressBar, this.constructor.classes.progressError);
                        }
                    }).finally((_) => {
                        this._endLoading();

                        if (this._progressBar) {
                            $.setAttribute(this._progressBar, { 'aria-valuenow': 100 });
                            $.setStyle(this._progressBar, { width: '100%' });
                        }
                    });
            });
        }

        if (this._cancelButton) {
            $.addEvent(this._cancelButton, 'click.ui.fileinput', (_) => {
                this._startLoading(this._cancelButton);

                const cancelCallback = this._options.cancelCallback.bind(this);

                Promise.resolve(cancelCallback())
                    .then((_) => {
                        if (this._progressBar) {
                            $.setStyle(this._progressBar, { width: `0%` });
                            $.setAttribute(this._progressBar, { 'aria-valuenow': 0 });
                            $.removeAttribute(this._uploadButton, 'aria-describedby');
                        }
                    })
                    .catch((_) => { })
                    .finally((_) => {
                        this._endLoading();

                        if (this._progress) {
                            $.detach(this._progress);
                        }
                    });
            });
        }

        if (this._removeButton) {
            $.addEvent(this._removeButton, 'click.ui.fileinput', (_) => {
                if ($.getProperty(this._node, 'files')) {
                    $.setValue(this._node, '');
                    $.triggerEvent(this._node, 'change.ui.fileinput');
                }

                if (this._progress) {
                    $.detach(this._progress);
                }

                if (!this._fileList.length || !this._options.removeCallback) {
                    this._refresh();
                    return;
                }

                this._startLoading(this._removeButton);

                const removeCallback = this._options.removeCallback.bind(this);

                Promise.resolve(removeCallback())
                    .then((_) => {
                        this._fileList = [];
                    })
                    .catch((_) => { })
                    .finally((_) => {
                        this._endLoading();
                    });
            });
        }

        if (this._browseButton) {
            $.addEvent(this._browseButton, 'click.ui.fileinput', (_) => {
                $.click(this._node);
            });
        }
    }

    /**
     * End loading.
     */
    function _endLoading() {
        $.removeAttribute(this._node, 'disabled');

        const buttons = this._getButtons();

        for (const button of buttons) {
            if (!$.hasDataset(button, 'uiContent')) {
                continue;
            }

            $.removeAttribute(button, 'disabled');
            const content = $.getDataset(button, 'uiContent');
            $.removeDataset(button, 'uiContent');
            $.setHTML(button, content);
            $.append(this._group, button);
        }

        this._refresh();
    }
    /**
     * Get the buttons.
     * @return {Array} The buttons.
     */
    function _getButtons() {
        return [this._uploadButton, this._cancelButton, this._removeButton, this._browseButton].filter((a) => a);
    }
    /**
     * Get the file names.
     * @return {Array} The file names.
     */
    function _getFileNames() {
        return this.getFiles()
            .map((file) => file.name);
    }
    /**
     * Refresh the file input.
     */
    function _refresh() {
        const files = this.getFiles();
        const hasFiles = files.length > 0;

        let fileNames;
        if (hasFiles) {
            fileNames = this._getFileNames();
        } else {
            fileNames = this._fileList;
        }

        fileNames = fileNames.join(this._options.multiSeparator);

        if (this._input) {
            $.setValue(this._input, fileNames);
        } else {
            $.setText(this._fileNames, fileNames);
        }

        if (this._uploadButton) {
            if (hasFiles) {
                $.append(this._group, this._uploadButton);
            } else {
                $.detach(this._uploadButton);
            }
        }

        if (this._cancelButton) {
            $.detach(this._cancelButton);
        }

        if (this._removeButton) {
            if (hasFiles || (this._fileList && this._options.removeCallback)) {
                $.append(this._group, this._removeButton);
            } else {
                $.detach(this._removeButton);
            }
        }

        if (this._browseButton) {
            $.append(this._group, this._browseButton);
        }
    }
    /**
     * Refresh the disabled styling.
     */
    function _refreshDisabled() {
        const nodes = this._getButtons();

        if (this._input) {
            nodes.push(this._input);
        }

        if ($.is(this._node, ':disabled')) {
            $.setAttribute(nodes, { disabled: true });
        } else {
            $.removeAttribute(nodes, 'disabled');
        }
    }
    /**
     * Start loading.
     * @param {HTMLElement} button The active button.
     */
    function _startLoading(button) {
        if (this._node) {
            $.setAttribute(this._node, { disabled: true });
        }

        const buttons = this._getButtons();

        $.detach(buttons);

        if (button) {
            $.setAttribute(button, { disabled: true });
            const content = $.getHTML(button);
            $.setDataset(button, { uiContent: content });
            const spinner = $.create('span', {
                class: this.constructor.classes.spinner,
            });
            $.empty(button);
            $.append(button, spinner);
            $.append(this._group, button);
        }
    }

    /**
     * Render the file input.
     */
    function _render() {
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

            const id = ui.generateId('upload-progress');

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
    }
    /**
     * Render a button.
     * @param {string} style The button style.
     * @param {string} key The button key.
     * @return {HTMLElement} The button.
     */
    function _renderButton(style, key) {
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
    }

    // FileInput default options
    FileInput.defaults = {
        uploadCallback: null,
        cancelCallback: null,
        removeCallback: null,
        initialValue: null,
        inputStyle: 'filled',
        browseStyle: 'secondary',
        removeStyle: 'light',
        uploadStyle: 'primary',
        cancelStyle: 'danger',
        multiSeparator: ', ',
        showBrowse: true,
        showRemove: true,
        showProgress: true,
        buttonText: false,
    };

    // FileInput classes
    FileInput.classes = {
        btn: 'btn',
        btnGroup: 'btn-group',
        fileNames: 'align-middle ms-2',
        formInput: 'form-input',
        hide: 'visually-hidden',
        iconText: 'd-inline-block me-1',
        inputFilled: 'input-filled',
        inputOutline: 'input-outline',
        inputGroup: 'input-group',
        inputGroupFilled: 'input-group-filled',
        progress: 'progress mt-1',
        progressBar: 'progress-bar',
        progressError: 'bg-danger',
        progressSuccess: 'bg-success',
        spinner: 'spinner-border spinner-border-sm',
    };

    // FileInput icons
    FileInput.icons = {
        browse: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="M19 20H4a2 2 0 0 1-2-2V6c0-1.11.89-2 2-2h6l2 2h7a2 2 0 0 1 2 2H4v10l2.14-8h17.07l-2.28 8.5c-.23.87-1.01 1.5-1.93 1.5z" fill="currentColor"/></svg>',
        cancel: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="M20 6.91L17.09 4L12 9.09L6.91 4L4 6.91L9.09 12L4 17.09L6.91 20L12 14.91L17.09 20L20 17.09L14.91 12L20 6.91z" fill="currentColor"/></svg>',
        remove: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="M20 6.91L17.09 4L12 9.09L6.91 4L4 6.91L9.09 12L4 17.09L6.91 20L12 14.91L17.09 20L20 17.09L14.91 12L20 6.91z" fill="currentColor"/></svg>',
        upload: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="M9 16v-6H5l7-7l7 7h-4v6H9m-4 4v-2h14v2H5z" fill="currentColor"/></svg>',
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
        uploadSuccess: 'Upload success',
    };

    // FileInput prototype
    const proto = FileInput.prototype;

    proto._endLoading = _endLoading;
    proto._events = _events;
    proto._getButtons = _getButtons;
    proto._getFileNames = _getFileNames;
    proto._refresh = _refresh;
    proto._refreshDisabled = _refreshDisabled;
    proto._render = _render;
    proto._renderButton = _renderButton;
    proto._startLoading = _startLoading;

    // FileInput init
    ui.initComponent('fileinput', FileInput);

    exports.FileInput = FileInput;

}));
//# sourceMappingURL=frost-ui-fileinput.js.map
