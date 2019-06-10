import * as pixi from 'pixi.js';

import useLifeCycles from './hooks/useLifeCycles';

interface IPixiOptions {
    autoStart?: boolean;
    width?: number;
    height?: number;
    view?: HTMLCanvasElement;
    transparent?: boolean;
    autoDensity?: boolean;
    antialias?: boolean;
    preserveDrawingBuffer?: boolean;
    resolution?: number;
    forceCanvas?: boolean;
    backgroundColor?: number;
    clearBeforeRender?: boolean;
    forceFXAA?: boolean;
    powerPreference?: string;
    sharedTicker?: boolean;
    sharedLoader?: boolean;
    resizeTo?: Window | HTMLElement;
}

interface IUsePixiOptions extends IPixiOptions {
    containerId?: string;
}

type IFuncType = (app: pixi.Application, PIXI: typeof pixi, rootContainer: HTMLElement | Element | undefined) => void;

const blacklistedProps = [
    'containerId'
];

const cleanHookOptions = (opts?: IPixiOptions) => {
    if (!opts) return opts;
    const res = Object.keys(opts).reduce((prev: any, curr: string) => {
        if (!blacklistedProps.includes(curr)) {
            return {
                ...prev,
                [curr]: (opts as any)[curr],
            }
        } else {
            return prev;
        }
    }, {});

    return res;
}

const usePixi = (opts: IUsePixiOptions, func?: IFuncType) => {
    const app = new pixi.Application(cleanHookOptions(opts));
    let rootContainer: HTMLElement | Element | undefined = undefined; 

    useLifeCycles(() => {
        if (!rootContainer) {
            rootContainer = window.document.getElementById(opts.containerId || '') || undefined;
            if (rootContainer) {
                rootContainer.appendChild(app.view);
                if (func) {
                    func(app, pixi, rootContainer);
                }
            }
        }
    }, () => {
        if (rootContainer) {
            rootContainer.removeChild(rootContainer.children[0]);
        }
    });
    return {app, PIXI: pixi, rootContainer};
}

export default usePixi;