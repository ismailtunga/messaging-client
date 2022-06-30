import { uuid } from '@botpress/messaging-base';
import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { ConversationStartedEvent, MessageFeedbackEvent, MessageNewEvent, UserNewEvent } from '.';
import { MessagingClientAuth } from './auth';
import { Emitter } from './emitter';
import { Logger } from './logger';
import { MessagingChannelOptions } from './options';
export declare abstract class MessagingChannelBase extends Emitter<{
    user: UserNewEvent;
    started: ConversationStartedEvent;
    message: MessageNewEvent;
    feedback: MessageFeedbackEvent;
}> {
    /** Options that are currently applied */
    get options(): MessagingChannelOptions;
    set options(val: MessagingChannelOptions);
    /** Base url of the messaging server */
    get url(): string;
    set url(val: string);
    /** Key to access admin routes. Optional */
    get adminKey(): string | undefined;
    set adminKey(val: string | undefined);
    /** A custom axios config giving more control over the HTTP client used internally. Optional */
    get axios(): Omit<AxiosRequestConfig, 'baseURL'> | undefined;
    set axios(val: Omit<AxiosRequestConfig, 'baseURL'> | undefined);
    /** Logger interface that can be used to get better debugging. Optional */
    get logger(): Logger | undefined;
    set logger(val: Logger | undefined);
    /** Name of the cookie for sticky sessions */
    get sessionCookieName(): string | undefined;
    set sessionCookieName(val: string | undefined);
    protected _options: MessagingChannelOptions;
    protected http: AxiosInstance;
    protected auths: {
        [clientId: uuid]: MessagingClientAuth | undefined;
    };
    protected headers: {
        [clientId: uuid]: any;
    };
    protected adminHeader: any;
    constructor(options: MessagingChannelOptions);
    private applyOptions;
    private saveCookie;
    private getAxiosConfig;
    /**
     * Indicates if credentials for a specific client id are currently known (start was called)
     */
    has(clientId: uuid): boolean;
    /**
     * Configures credentials of a client to allow making requests using that client id
     * Credentials are stored in memory
     */
    start(clientId: uuid, auth: MessagingClientAuth): void;
    /**
     * Removed credentials of a client id. It's not possible to make request to this
     * client id after stop was called (start needs to be called again)
     */
    stop(clientId: uuid): void;
}
