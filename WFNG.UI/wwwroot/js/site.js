window.generateUuid = () => {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
};
define("global", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
uce.define('modal-screen', {
    attachShadow: { mode: 'open' },
    init() {
        this._boundGlobalKeyDown = (e) => { if (e.keyCode === 27) {
            this.hide();
        } };
        this._hideRequestEvent = new CustomEvent('ModalHideRequest', { bubbles: true, cancelable: true });
        this.render();
        this.shadowRoot.querySelector('.backdrop').addEventListener('click', (e) => {
            this.sendHideRequest();
        });
    },
    onShow() {
        document.addEventListener('keydown', this._boundGlobalKeyDown);
        this.shadowRoot.host.style.animation = 'fadeInFromNone 0.5s both ease-out';
    },
    sendHideRequest() {
        this.dispatchEvent(this._hideRequestEvent);
    },
    onHide() {
        this.notify('hiding');
        this.shadowRoot.host.style.animation = 'fadeOutToNone 0.2s both ease-in';
        document.removeEventListener('keydown', this._boundGlobalKeyDown);
        if (this.getAttribute('keep-after-hide') !== 'true') {
            setTimeout(() => { this.remove(); delete this; }, 1000);
        }
    },
    notify(name, data) {
        const ev = new CustomEvent('ModalNotifyGeneric', { bubbles: true, cancelable: true, detail: { name: name, data: data } });
        this.dispatchEvent(ev);
    },
    render() {
        this.html `
            <style>
                @keyframes fadeInFromNone {
                    0% { visibility: hidden; opacity: 0; }
                    1% { visibility: visible; opacity: 0; }
                    100% { visibility: visible; opacity: 1; }
                }
                @keyframes fadeOutToNone {
                    0% { visibility: visible; opacity: 1; }
                    99% { visibility: visible; opacity: 0; }
                    100% { visibility: hidden; opacity: 0; }
                }
                :host {
                    opacity: 0;
                    visibility: hidden;
                }
                .backdrop {
                    height: 100%;
                    width: 100%;
                    box-sizing: border-box;
                    background-color: rgba(0, 0, 0, 0.5);
                    position: absolute;
                    top: 0;
                    left: 0;
                }
                .contents {
                    display: block;
                    margin: auto;
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    overflow: auto;
                }
            </style>
            <section class="backdrop"></section>
            <section class="contents">
                <slot></slot>
            </section>
        `;
        this.shadowRoot.querySelector('.contents').style.background = this.getAttribute('background') || '#fff';
        this.shadowRoot.querySelector('.contents').style.height = this.getAttribute('height') || '90%';
        this.shadowRoot.querySelector('.contents').style.width = this.getAttribute('width') || '90%';
    }
});
uce.define('step-editor-modal', {
    attachShadow: { mode: 'open' },
    init() {
        const proto = Reflect.getPrototypeOf(this);
        Reflect.ownKeys(proto).forEach(k => {
            if (/^on.*$/.test(k) && !/Options$/.test(k)) {
                this.shadowRoot.addEventListener(k.substr(2), this[k].bind(this));
            }
        });
    },
    render() {
        this.html ``;
        this.html `
            <modal-screen height="50%" width="40rem" background="rgba(0,0,0,0)">
                <style>
                    .step-editor-container {
                        box-sizing: border-box;
                        display: block;
                        height: 100%;
                        width: 100%;
                        padding: 4px;
                        background-color: #fff;
                        border-radius: 8px;
                        position: absolute;
                    }
                    .scrollable {
                        height: 100%;
                        width: 100%;
                        overflow-y: auto;
                    }
                    h1 {
                        margin-bottom: 0;
                    }
                    .step-id-label {
                        font-size: small;
                    }
                </style>
                <section class="step-editor-container">
                    <div class="scrollable">
                        <input type="hidden" data-field="id" value="${this.stepData.id}" />
                        <input type="hidden" data-field="type" value="${this.stepData.type}" />
                        <h1>
                            Edit
                            <span class="typed type-starter">Starter</span>
                            <span class="typed type-sync">Synchronous</span>
                            <span class="typed type-async">Asynchronous</span>
                            Step
                        </h1>
                        <label class="step-id-label">Step ID: ${this.stepData.id}</label>
                        <h4 class="typed type-starter">This task can be initiated by POSTing to <code>[baseURL]/[TBD]/${this.stepData.id}</code>.</h4>
                        <h4 class="typed type-async">This step must be updated/completed by POSTing to <code>[baseURL]/[TBD]/${this.stepData.id}</code>.</h4>
                        <p class="typed type-starter">
                            <label>Cron schedule:</label>
                            <input type="text" data-field="cron" value="${this.stepData.cron}" />
                        </p>
                        <div class="typed type-starter">Cron explanation: TBD</div>

                        <p>
                            <label>Timeout (in seconds):</label>
                            <input type="number" data-field="timeout" min="0" value="${this.stepData.timeout}" />
                        </p>
                        <p class="typed type-async">
                            <label>Failsafe timeout (in seconds):</label>
                            <input type="number" data-field="failsafeTimeout" min="0" value="${this.stepData.failsafeTimeout}" />
                        </p>

                        <p>
                            <label>Script <span class="typed type-starter">(optional)</span></label>
                            <br />
                            <textarea data-field="script"></textarea>
                        </p>

                        <p>
                            <label>External tasks</label>
                            <br />
                            <span>TBD</span>
                        </p>

                        <div>
                            <button onclick="this.closest('modal-screen').notify('save');">Save Changes</button>
                            <button onclick="this.closest('modal-screen').sendHideRequest();">Discard</button>
                        </div>
                    </div>
                </section>
            </modal-screen>
        `;
        this.shadowRoot.querySelectorAll(`.typed:not(.type-${this.stepData.type})`)
            .forEach(el => el.style.display = 'none');
        this.shadowRoot.querySelector('textarea[data-field="script"]').innerText = this.stepData.script;
    },
    show(stepEl) {
        this.stepElement = stepEl;
        this.stepData = stepEl.stepData;
        this.render();
        const ev = new Event('show');
        this.shadowRoot.querySelector('modal-screen').dispatchEvent(ev);
    },
    onModalNotifyGeneric(e) {
        e.preventDefault();
        switch (e.detail.name) {
            case 'save':
                const data = {};
                this.shadowRoot
                    .querySelectorAll('modal-screen *[data-field]')
                    .forEach(f => data[f.getAttribute('data-field')] = f.value);
                this.stepElement.stepData = data;
                this.onModalHideRequest(e);
                break;
            case 'hiding':
                break;
            default:
                console.log('Unknown generic notification:', e.detail);
        }
    },
    onModalHideRequest(e) {
        e.preventDefault();
        const ev = new Event('hide');
        this.shadowRoot.querySelector('modal-screen').dispatchEvent(ev);
    }
});
uce.define('task-editor', {
    attachShadow: { mode: 'open' },
    init: function () {
        this.dragging = false;
        this.render();
    },
    render() {
        this.html `
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
        if (e.target.customDraggable !== true)
            return;
        this.dragging = true;
        this.dragTarget = e.target;
        this.dragTargetInitX = Number(e.target.getAttribute('x'));
        this.dragTargetInitY = Number(e.target.getAttribute('y'));
        this.dragInitMouseX = e.clientX;
        this.dragInitMouseY = e.clientY;
    },
    onMouseMove(e) {
        if (!this.dragging)
            return;
        let newX = this.dragTargetInitX + e.clientX - this.dragInitMouseX;
        if (newX < 0)
            newX = 0;
        let newY = this.dragTargetInitY + e.clientY - this.dragInitMouseY;
        if (newY < 0)
            newY = 0;
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
uce.define('task-step', {
    attachShadow: { mode: 'open' },
    observedAttributes: ['x', 'y'],
    init: function () {
        this.customDraggable = !this.getAttribute('draggable');
    },
    connected() {
        if (!this.getAttribute('step-id')) {
            this.setAttribute('step-id', window.generateUuid());
        }
        this._stepData = {
            id: this.getAttribute('step-id'),
            type: this.getAttribute('type'),
            cron: '',
            timeout: '',
            failsafeTimeout: '',
            script: ''
        };
        this.render();
    },
    render() {
        let iconClass, description;
        switch (this.getAttribute('type')) {
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
        this.html `
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
                  integrity="sha512-iBBXm8fW90+nuLcSKlbmrPcLa0OT92xO1BIsZ+ywDWZCvqsWgccV3gFoRBv0z+8dLJgyAHIhR35VZc2oM/gI1w=="
                  crossorigin="anonymous" referrer-policy="no-referrer"/>
            <style>
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
    },
    restyle() {
        if (!this.customDraggable) {
            return;
        }
        this.setAttribute('style', `position:absolute;left:${this.getAttribute('x')}px;top:${this.getAttribute('y')}px;`);
    },
    onDragStart(e) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', JSON.stringify({ newStep: true, type: this.getAttribute('type') }));
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
            return;
        }
        this._stepData.cron = value.cron;
        this._stepData.timeout = value.timeout;
        this._stepData.failsafeTimeout = value.failsafeTimeout;
        this._stepData.script = value.script;
    }
});
//# sourceMappingURL=site.js.map