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
