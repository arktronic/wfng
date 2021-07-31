﻿uce.define('task-editor-arrows', {
    attachShadow: { mode: 'open' },
    render() {
        this.html`
            <style>
                #container {
                    height: 100%;
                    position: relative;
                    width: 100%;
                }
            </style>
            <section id="container">
            </section>
        `;
        const stage = new Konva.Stage({
            container: this.shadowRoot.querySelector('section'),
            width: this.shadowRoot.querySelector('section').clientWidth,
            height: this.shadowRoot.querySelector('section').clientHeight
        });
        this._layer = new Konva.Layer();
        stage.add(this._layer);
    },
    showArrow(x1, y1, x2, y2) {
        var arrow = new Konva.Arrow({
            x: 0,
            y: 0,
            points: [x1, y1, x1 + 50, y1, x2 - 52, y2, x2 - 2, y2],
            pointerLength: 10,
            pointerWidth: 10,
            fill: '#00000000',
            stroke: '#00000055',
            strokeWidth: 3,
            tension: 0.5,
        });
        this._layer.add(arrow);
    },
    clear() {
        this._layer.destroyChildren();
    }
});
