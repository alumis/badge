import { Observable } from '@alumis/observables';
import { Attributes } from "@alumis/observables-dom";

import { AlumisBadgeTheme } from './AlumisBadgeTheme';


export interface AlumisBadgeAttributes extends Attributes {

    theme?: AlumisBadgeTheme | Observable<AlumisBadgeTheme> | (() => AlumisBadgeTheme);
}