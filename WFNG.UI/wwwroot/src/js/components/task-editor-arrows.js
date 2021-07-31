uce.define('task-editor-arrows', {
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
        var stage = new Konva.Stage({
            container: this.shadowRoot.querySelector('section'),
            width: this.shadowRoot.querySelector('section').clientWidth,
            height: this.shadowRoot.querySelector('section').clientHeight
        });
        var layer = new Konva.Layer();
        var arrow = new Konva.Arrow({
            x: 140,
            y: 40,
            points: [0, 0, 60, 20, 40, 80],
            pointerLength: 20,
            pointerWidth: 20,
            fill: 'black',
            stroke: 'black',
            strokeWidth: 4,
            tension: 0.5,
        });
        layer.add(arrow);
        stage.add(layer);
    }
});
