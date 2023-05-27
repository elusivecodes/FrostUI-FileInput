import $ from '@fr0st/query';

/**
 * End loading.
 */
export function _endLoading() {
    $.removeAttribute(this._node, 'disabled');

    const buttons = this._getButtons();

    for (const button of buttons) {
        if (!$.hasDataset(button, 'uiContent')) {
            continue;
        }

        $.removeAttribute(button, 'disabled');
        const content = $.getDataset(button, 'uiContent');
        $.setHTML(button, content);
        $.append(this._group, button);
    }

    this._refresh();
};

/**
 * Get the buttons.
 * @return {Array} The buttons.
 */
export function _getButtons() {
    return [this._uploadButton, this._cancelButton, this._removeButton, this._browseButton].filter((a) => a);
};

/**
 * Get the file names.
 * @return {Array} The file names.
 */
export function _getFileNames() {
    return this.getFiles()
        .map((file) => file.name);
};

/**
 * Refresh the file input.
 */
export function _refresh() {
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
        if (fileNames) {
            $.append(this._group, this._removeButton);
        } else {
            $.detach(this._removeButton);
        }
    }

    if (this._browseButton) {
        $.append(this._group, this._browseButton);
    }
};

/**
 * Refresh the disabled styling.
 */
export function _refreshDisabled() {
    const nodes = this._getButtons();

    if (this._input) {
        nodes.push(this._input);
    }

    if ($.is(this._node, ':disabled')) {
        $.setAttribute(nodes, { disabled: true });
    } else {
        $.removeAttribute(nodes, 'disabled');
    }
};

/**
 * Start loading.
 * @param {HTMLElement} button The active button.
 */
export function _startLoading(button) {
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
};
