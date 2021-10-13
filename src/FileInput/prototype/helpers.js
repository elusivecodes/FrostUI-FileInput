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
