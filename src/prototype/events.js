import $ from '@fr0st/query';

/**
 * Attach events for the FileInput.
 */
export function _events() {
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
};
