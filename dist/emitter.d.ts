import { uuid } from '@botpress/messaging-base';
export declare class Emitter<T extends {
    [key: string]: any;
}> {
    private listeners;
    on<K extends keyof T>(event: K, listener: ((clientId: uuid, arg: T[K]) => Promise<any>) | ((arg: T[K]) => void)): void;
    protected emit<K extends keyof T>(event: K, clientId: uuid, arg: T[K]): Promise<boolean>;
}
export declare class ProtectedEmitter<T extends {
    [key: string]: any;
}> {
    private listeners;
    on<K extends keyof T>(event: K, listener: (arg: T[K]) => Promise<void>, pushBack?: boolean): void;
    protected emit<K extends keyof T>(event: K, arg: T[K]): Promise<boolean>;
}
