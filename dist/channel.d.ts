import { Router } from 'express';
import { MessagingChannelApi } from './api';
/**
 * Multi-tenant version of MessagingClient that allows setting up multiple client ids
 */
export declare class MessagingChannel extends MessagingChannelApi {
    /**
     * Sets up an express router to receive webhook events
     * @param router an express router
     * @param route optional route to receive events at
     */
    setup(router: Router, route?: string): void;
    private asyncMiddleware;
    private handleRequest;
    private handleEvent;
}
