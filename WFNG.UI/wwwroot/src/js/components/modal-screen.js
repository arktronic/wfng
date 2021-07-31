uce.define('modal-screen', {
    attachShadow: { mode: 'open' },
    init() {
        this._boundGlobalKeyDown = (e) => { if (e.keyCode === 27) { this.sendHideRequest(); } };
        
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
        this.notify('hide-request');
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
        const ev = new CustomEvent('ModalNotify', { bubbles: true, cancelable: true, detail: { name: name, data: data  } });
        this.dispatchEvent(ev);
    },
    render() {
        this.html`
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
