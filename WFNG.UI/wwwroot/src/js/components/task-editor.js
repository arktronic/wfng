uce.define('task-editor', {
    attachShadow: { mode: 'open' },
    init: function () {
        this.dragging = false;

        this.render();
    },
    render() {
        this.html`
            <style>
                .task-area {
                    height: 1000rem;
                    position: relative;
                    width: 1000rem;
                }
            </style>
            <section class="task-area">
                <slot></slot>
            </section>
        `;
    },
    onMouseDown(e) {
        if (e.target.customDraggable !== true) return;
        
        this.dragging = true;
        this.dragTarget = e.target;
        this.dragTargetInitX = Number(e.target.getAttribute('x'));
        this.dragTargetInitY = Number(e.target.getAttribute('y'));
        this.dragInitMouseX = e.clientX;
        this.dragInitMouseY = e.clientY;
    },
    onMouseMove(e) {
        if (!this.dragging) return;
        
        let newX = this.dragTargetInitX + e.clientX - this.dragInitMouseX;
        if (newX < 0) newX = 0;
        let newY = this.dragTargetInitY + e.clientY - this.dragInitMouseY;
        if (newY < 0) newY = 0;
        
        this.dragTarget.setAttribute('x', newX);
        this.dragTarget.setAttribute('y', newY);
    },
    onMouseUp(e) {
        this.dragging = false;
    },
    onMouseLeave(e) {
        this.dragging = false;
    },
    onDragOver(e) {
        e.preventDefault();
        try {
            let dropData = JSON.parse(e.dataTransfer.getData('text/plain'));
            if (dropData.newStep !== true) {
                e.dataTransfer.dropEffect = 'none';
            }
        }
        catch (e) {
        }
        return false;
    },
    onDrop(e) {
        e.preventDefault();
        
        try {
            let dropData = JSON.parse(e.dataTransfer.getData('text/plain'));

            let rect = this.getBoundingClientRect();
            let targetX = Math.round(e.clientX - rect.left);
            let targetY = Math.round(e.clientY - rect.top);

            let newStep = document.createElement('task-step');
            newStep.setAttribute('x', targetX);
            newStep.setAttribute('y', targetY);
            newStep.setAttribute('type', dropData.type);
            this.appendChild(newStep);
        }
        catch (e) {
            console.log('Unable to accept drop');
        }
        
        return false;
    }
});
