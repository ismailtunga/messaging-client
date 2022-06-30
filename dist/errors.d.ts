export declare const handleNotFound: <U, T, F extends Function = () => U>(func: F, returnValue: T) => Promise<U | T>;
export declare const handleUnauthorized: <U, T, F extends Function = () => U>(func: F, returnValue: T) => Promise<U | T>;
