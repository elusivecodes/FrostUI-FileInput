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
