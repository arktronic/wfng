import type * as _uce_type from 'uce';

declare global {
    namespace uce {
        const define: typeof _uce_type.define;
        const render: typeof _uce_type.render;
        const html: typeof _uce_type.html;
        const svg: typeof _uce_type.svg;
        const css: typeof _uce_type.css;
    }
}

