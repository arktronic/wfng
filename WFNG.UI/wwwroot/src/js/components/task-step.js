uce.define('task-step', {
    attachShadow: { mode: 'open' },
    observedAttributes: ['x', 'y'],
    init: function () {
        this.customDraggable = !this.getAttribute('draggable');
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
                iconClass = 'fas fa-sync-alt';
                description = 'Synchronous';
                break;
            case 'async':
                iconClass = 'fas fa-exchange-alt';
                description = 'Asynchronous';
                break;
            case 'starter':
                iconClass = 'fa fa-play';
                description = 'Starter';
        }
        
        this.html`
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
                  integrity="sha512-iBBXm8fW90+nuLcSKlbmrPcLa0OT92xO1BIsZ+ywDWZCvqsWgccV3gFoRBv0z+8dLJgyAHIhR35VZc2oM/gI1w=="
                  crossorigin="anonymous" referrer-policy="no-referrer"/>
            <style>
                :host {
                    display: inline-block;
                }
                .container {
                    align-items: center;
                    background-color: rgba(0, 0, 0, 0.08);
                    border: 1px solid rgba(0, 0, 0, 0.3);
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
                }

                i {
                    color: #08ee088a;
                    font-size: 2rem;
                    position: absolute;
                    z-index: -1;
                }
            </style>
            <div class="container">
                <i class="${iconClass}"/>
                <div class="description">${description}</div>
            </div>
        `;
        
        this.restyle();
    },
    attributeChanged(name, oldValue, newValue) {
        this.restyle();
        this._stepData.x = this.getAttribute('x');
        this._stepData.y = this.getAttribute('y');
    },
    restyle() {
        if (!this.customDraggable) {
            return;
        }
        
        this.setAttribute('style', `position:absolute;left:${this.getAttribute('x')}px;top:${this.getAttribute('y')}px;`);
    },
    onDragStart(e) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', JSON.stringify({newStep: true, type: this.getAttribute('type')}));
        e.dataTransfer.setDragImage(document.querySelector(this.getAttribute('visual-dragger-selector')), 0, -15);
        return true;
    },
    onDblClick(e) {
        if (!this.customDraggable) {
            return;
        }

        this.editStep();
    },
    editStep() {
        document.querySelector('step-editor-modal').show(this);
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
    }
});
