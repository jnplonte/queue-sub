import { toJson, toString, isEmpty, isNotEmpty, replaceHtml } from 'jnpl-helper';

export class Helper {
    env: string = process.env.NODE_ENV || 'local';

    constructor() {

    }

    toJson(jsonData: any = ''): any {
        return toJson(jsonData);
    }

    toString(jsonData: any = ''): any {
        return toString(jsonData);
    }

    isNotEmpty(v: any = null): boolean {
        return isNotEmpty(v);
    }

    isEmpty(v: any = null): boolean {
        return isEmpty(v);
    }

    replaceHtml(html: string = '', data: Object = {}): string {
        return replaceHtml(html, data);
    }
}
