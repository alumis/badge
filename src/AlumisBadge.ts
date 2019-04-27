import { Component, createNode, appendDispose } from "@alumis/observables-dom";
import { Observable, ComputedObservable } from "@alumis/observables";

import { AlumisBadgeAttributes } from "./AlumisBadgeAttributes";
import { AlumisBadgeCssClasses } from "./AlumisBadgeCssClasses";
import { AlumisBadgeTheme } from "./AlumisBadgeTheme";


export abstract class AlumisBadge extends Component<HTMLSpanElement> {

    constructor(attrs: AlumisBadgeAttributes, children: any[], protected cssClasses: AlumisBadgeCssClasses) {

        super();

        this.colorAction = this.colorAction.bind(this);

        let theme: AlumisBadgeTheme | Observable<AlumisBadgeTheme> | (() => AlumisBadgeTheme);

        if (attrs) {

            theme = attrs.theme;

            delete attrs.theme;
        }

        if (!theme && theme !== AlumisBadgeTheme.None)
            theme = AlumisBadgeTheme.Primary;

        this.node = <HTMLSpanElement>createNode('span', attrs, children);

        this.node.classList.add(cssClasses.badge);

        if (theme instanceof Observable) {

            appendDispose(this.node, theme.subscribeInvoke(this.colorAction).dispose);
            this.colorAsObservable = theme;
        } 

        else if (typeof theme === 'function') {

            let computedObservable = ComputedObservable.createComputed(theme);

            computedObservable.subscribeInvoke(this.colorAction);
            appendDispose(this.node, computedObservable.dispose);

            this.colorAsObservable = computedObservable;
        } else {

            let observable = Observable.create(theme);

            observable.subscribeInvoke(this.colorAction);
            appendDispose(this.node, observable.dispose);

            this.colorAsObservable = observable;
        }
    }

    colorAsObservable: Observable<AlumisBadgeTheme>;

    protected getColorClass(color: AlumisBadgeTheme) {

        switch(color) {

            case AlumisBadgeTheme.Primary:
                return this.cssClasses['badge-primary'];
            case AlumisBadgeTheme.Secondary:
                return this.cssClasses['badge-secondary'];
            case AlumisBadgeTheme.Success:
                return this.cssClasses['badge-success'];
            case AlumisBadgeTheme.Warning:
                return this.cssClasses['badge-warning'];
            case AlumisBadgeTheme.Danger:
                return this.cssClasses['badge-danger'];
            case AlumisBadgeTheme.Info:
                return this.cssClasses['badge-info'];
            case AlumisBadgeTheme.Light:
                return this.cssClasses['badge-light'];
            case AlumisBadgeTheme.Dark:
                return this.cssClasses['badge-dark'];
        }
    }

    private colorAction(newColor: AlumisBadgeTheme, oldColor: AlumisBadgeTheme) {

        let cls = this.getColorClass(newColor);

        if (cls)
            this.node.classList.add(cls);

        if (cls = this.getColorClass(oldColor))
            this.node.classList.remove(cls);
    }
}