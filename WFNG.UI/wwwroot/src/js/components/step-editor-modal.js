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
        this.html``;
        this.html`
            <modal-screen height="70%" width="50rem" background="rgba(0,0,0,0)">
                <style>
                    .step-editor-container {
                        box-sizing: border-box;
                        display: block;
                        height: 100%;
                        width: 100%;
                        padding: 12px 4px;
                        background-color: #fff;
                        border-radius: 8px;
                        position: absolute;
                        overflow: hidden;
                    }
                    .scrollable {
                        height: calc(100% - 1.3rem);
                        width: 100%;
                        overflow-y: auto;
                        box-sizing: border-box;
                        padding: 0 12px;
                    }
                    h1 {
                        margin: 0;
                    }
                    .step-id-label {
                        font-size: small;
                    }
                    .modal-actions {
                        position: absolute;
                        bottom: 0.3rem;
                        left: 0;
                        text-align: center;
                        padding-top: 0.3rem;
                        width: 100%;
                        border-top: 1px solid #BBBBBB;
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
                            <label>Next step (optional)</label>
                            <br />
                            <input type="text" data-field="nextStep" value="${this.stepData.nextStep}" />
                        </p>

                        <p>
                            <label>External tasks</label>
                            <br />
                            <span>TBD</span>
                        </p>
                    </div>

                    <div class="modal-actions">
                        <button onclick="this.closest('modal-screen').notify('save');">Save Changes</button>
                        <button onclick="this.closest('modal-screen').sendHideRequest();">Discard</button>
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
    hide() {
        const ev = new Event('hide');
        this.shadowRoot.querySelector('modal-screen').dispatchEvent(ev);
    },
    onModalNotify(e) {
        e.preventDefault();
        
        switch(e.detail.name) {
            case 'hideRequest':
                this.hide();
                break;
            case 'save':
                const data = {};
                this.shadowRoot
                    .querySelectorAll('modal-screen *[data-field]')
                    .forEach(f => data[f.getAttribute('data-field')] = f.value);
                this.stepElement.stepData = data;
                this.hide();
                break;
            case 'hiding':
                break;
            default:
                console.log('Unknown generic notification:', e.detail);
        }
    }
});
