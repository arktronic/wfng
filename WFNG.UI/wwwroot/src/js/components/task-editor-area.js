uce.define('task-editor-area', {
    attachShadow: { mode: 'open' },
    init: function () {
        this.dragging = false;
        this.connecting = false;

        this.render();
    },
    render() {
        this.html`
            <style>
                .task-area {
                    height: 300rem;
                    position: relative;
                    width: 300rem;
                }
            </style>
            <section class="task-area">
                <task-editor-arrows></task-editor-arrows>
                <slot></slot>
            </section>
        `;
    },
    onMouseDown(e) {
        if (e.target.shouldCustomDrag !== undefined && e.target.shouldCustomDrag(e)) {
            this.dragging = true;
            this.dragTarget = e.target;
            this.dragTargetInitX = Number(e.target.getAttribute('x'));
            this.dragTargetInitY = Number(e.target.getAttribute('y'));
            this.dragInitMouseX = e.clientX;
            this.dragInitMouseY = e.clientY;
        }
        else if (e.target.shouldInitiateConnection !== undefined && e.target.shouldInitiateConnection(e)) {
            this.connecting = true;
            this.connectionSource = e.target;
        }
    },
    onMouseMove(e) {
        if (this.dragging) {
            let newX = this.dragTargetInitX + e.clientX - this.dragInitMouseX;
            if (newX < 0) newX = 0;
            let newY = this.dragTargetInitY + e.clientY - this.dragInitMouseY;
            if (newY < 0) newY = 0;

            this.dragTarget.setAttribute('x', newX);
            this.dragTarget.setAttribute('y', newY);
        }
        this.drawArrows(e);
    },
    onMouseUp(e) {
        this.dragging = false;
        
        if (this.connecting) {
            this.connecting = false;
            if (e.target.isConnectableTarget === true) {
                const stepData = this.connectionSource.stepData;
                stepData.nextStep = e.target.stepData.id;
                this.connectionSource.stepData = stepData;
            }
        }
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
        catch (er) {
            console.log('Unable to accept drop', er);
        }
        
        return false;
    },
    onTaskUpdated(e) {
        this.drawArrows(e);
    },
    serialize() {
        const taskData = [];
        this.querySelectorAll('task-step').forEach((s) => {
            taskData.push(s.stepData);
        });
        return JSON.stringify(taskData);
    },
    deserialize(taskDataString) {
        this.innerHTML = '';
        
        const taskData = JSON.parse(taskDataString);
        taskData.forEach(s => {
            const el = document.createElement('task-step');
            el.setAttribute('type', s.type);
            el.setAttribute('step-id', s.id);
            el.setAttribute('x', s.x);
            el.setAttribute('y', s.y);
            this.appendChild(el);
            el.stepData = s;
        });
    },
    drawArrows(e) {
        const arrows = this.shadowRoot.querySelector('task-editor-arrows');
        arrows.clear();
        this.querySelectorAll('task-step').forEach((currentStep) => {
            if (!currentStep.stepData.nextStep) return;
            const targetStep = this.querySelector(`task-step[step-id="${currentStep.stepData.nextStep}"]`);
            if (!targetStep) return;
            
            arrows.showArrow(
                currentStep.sourcePoint.x, currentStep.sourcePoint.y,
                targetStep.targetPoint.x, targetStep.targetPoint.y);
        });
        
        if (this.connecting) {
            const rect = this.getBoundingClientRect();
            arrows.showArrow(
                this.connectionSource.sourcePoint.x, this.connectionSource.sourcePoint.y,
                e.clientX - rect.x, e.clientY - rect.y);
        }
    }
});
