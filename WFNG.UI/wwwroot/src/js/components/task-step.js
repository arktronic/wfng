uce.define('task-step', {
    attachShadow: { mode: 'open' },
    observedAttributes: ['x', 'y'],
    init: function () {
        this._customDraggable = !this.getAttribute('draggable');
        this._stepData = {
            cron: '',
            timeout: '',
            failsafeTimeout: '',
            script: '',
            nextStep: ''
        };
    },
    connected() {
        if (!this.getAttribute('step-id')) {
            this.setAttribute('step-id', window.generateUuid());
        }

        this._stepData.id = this.getAttribute('step-id');
        this._stepData.type = this.getAttribute('type');
        this._stepData.x = this.getAttribute('x');
        this._stepData.y = this.getAttribute('y');

        this.render();
    },
    render() {
        let iconClass, description;
        switch(this.getAttribute('type')) {
            case 'sync':
                iconClass = 'task-step bg sync';
                description = 'Synchronous';
                break;
            case 'async':
                iconClass = 'task-step bg async';
                description = 'Asynchronous';
                break;
            case 'starter':
                iconClass = 'task-step bg starter';
                description = 'Starter';
        }
        
        this.html`
            <style>
                :host {
                    display: inline-block;
                    position: relative;
                }
                .container {
                    align-items: center;
                    background-color: #FFFFFF;
                    border: 1px solid #BBBBBB;
                    border-radius: 6px;
                    cursor: grab;
                    box-sizing: border-box;
                    display: flex;
                    height: 40px;
                    justify-content: center;
                    padding: 4px;
                    width: 140px;
                }
                
                .container:active {
                    cursor: grabbing;
                }

                .description {
                    user-select: none;
                    padding-left: 32px;
                    width: 100%;
                }
                
                .connector {
                    position: absolute;
                    top: 12px;
                    left: 140px;
                    border: 1px solid #455A66;
                    border-radius: 9999px;
                    padding: 0 2px 2px;
                    cursor: pointer;
                    user-select: none;
                    font-size: 8pt;
                }
                
                .task-step.bg {
                    background-position: left;
                    background-repeat: no-repeat;
                    background-size: contain;
                    height: 100%;
                    width: 28px;
                    position: absolute;
                    left: 6px;
                    top: 0;
                    pointer-events: none;
                }
                .bg.sync {
                    background-image: url('img/sync.svg');
                }
                .bg.async {
                    background-image: url('img/async.svg');
                }
                .bg.starter {
                    background-image: url('img/starter.svg');
                }
            </style>
            <div class="container">
                <div class="${iconClass}"></div>
                <div class="description">${description}</div>
            </div>
            <div class="connector source-initiator">&rarr;</div>
        `;
        
        this.restyle();
    },
    attributeChanged(name, oldValue, newValue) {
        this.restyle();
        this._stepData.x = this.getAttribute('x');
        this._stepData.y = this.getAttribute('y');
    },
    restyle() {
        if (!this._customDraggable) {
            this.shadowRoot.querySelectorAll('.connector')
                .forEach((c) => c.style.display = 'none');
            return;
        }
        
        const hasNextStep = (this._stepData.nextStep !== null && this._stepData.nextStep !== undefined && this._stepData.nextStep.length > 0);
        
        this.shadowRoot.querySelectorAll('.source-initiator')
            .forEach((si) => si.style.display = (hasNextStep ? 'none' : 'unset'));
        
        this.setAttribute('style', `position:absolute;left:${this.getAttribute('x')}px;top:${this.getAttribute('y')}px;`);
    },
    onDragStart(e) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', JSON.stringify({newStep: true, type: this.getAttribute('type')}));
        e.dataTransfer.setDragImage(document.querySelector(this.getAttribute('visual-dragger-selector')), 0, -15);
        return true;
    },
    onDblClick(e) {
        if (!this._customDraggable) {
            return;
        }

        this.editStep();
    },
    editStep() {
        document.querySelector('step-editor-modal').show(this);
    },
    shouldCustomDrag(e) {
        const path = e.composedPath();
        const pathPointsToConnector = (path && path[0].classList.contains('connector'));
        return (this._customDraggable && !pathPointsToConnector);
    },
    shouldInitiateConnection(e) {
        const path = e.composedPath();
        const pathPointsToConnector = (path && path[0].classList.contains('source-initiator'));
        return (this._customDraggable && pathPointsToConnector);
    },
    get stepData() {
        return JSON.parse(JSON.stringify(this._stepData));
    },
    set stepData(value) {
        if (this._stepData.id !== value.id || this._stepData.type !== value.type) {
            console.log('Ignoring invalid stepData assignment!');
            return;
        }
        
        this._stepData.cron = value.cron;
        this._stepData.timeout = value.timeout;
        this._stepData.failsafeTimeout = value.failsafeTimeout;
        this._stepData.script = value.script;
        this._stepData.nextStep = value.nextStep;
        
        this.restyle();
        const ev = new Event('taskUpdated');
        this.parentElement.dispatchEvent(ev);
    },
    get sourcePoint() {
        const rect = this.getBoundingClientRect();
        return {
            x: Number(this._stepData.x) + 140,
            y: Number(this._stepData.y) + (rect.height / 2)
        };
    },
    get targetPoint() {
        const rect = this.getBoundingClientRect();
        return {
            x: Number(this._stepData.x),
            y: Number(this._stepData.y) + (rect.height / 2)
        };
    },
    get isConnectableTarget() {
        return this._stepData.type !== 'starter';
    },
});
