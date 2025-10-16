export interface Path {
    label?: string;
    getHref?: (path?: string) => string;
    hidden?: boolean;
    [key: string]: Path | any;
}
