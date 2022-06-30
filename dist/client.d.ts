import { Conversation, Endpoint, HealthReport, Message, SyncRequest, SyncResult, User, uuid } from '@botpress/messaging-base';
import { AxiosRequestConfig } from 'axios';
import { Router } from 'express';
import { MessageFeedbackEvent } from '.';
import { MessagingChannel } from './channel';
import { ProtectedEmitter } from './emitter';
import { ConversationStartedEvent, MessageNewEvent, UserNewEvent } from './events';
import { Logger } from './logger';
import { MessagingOptions } from './options';
export declare class MessagingClient extends ProtectedEmitter<{
    user: UserNewEvent;
    started: ConversationStartedEvent;
    message: MessageNewEvent;
    feedback: MessageFeedbackEvent;
}> {
    /** Client id configured for this instance */
    get clientId(): uuid;
    set clientId(val: uuid);
    /** Client token of to authenticate requests made with the client id */
    get clientToken(): string | undefined;
    set clientToken(val: string | undefined);
    /** Webhook token to validate webhook events that are received */
    get webhookToken(): string | undefined;
    set webhookToken(val: string | undefined);
    /** Options that are currently applied */
    get options(): MessagingOptions;
    set options(val: MessagingOptions);
    /** Base url of the messaging server */
    get url(): string;
    set url(val: string);
    /** A custom axios config giving more control over the HTTP client used internally. Optional */
    get axios(): Omit<AxiosRequestConfig, 'baseURL'> | undefined;
    set axios(val: Omit<AxiosRequestConfig, 'baseURL'> | undefined);
    /** Logger interface that can be used to get better debugging. Optional */
    get logger(): Logger | undefined;
    set logger(val: Logger | undefined);
    /** Name of the cookie for sticky sessions */
    get sessionCookieName(): string | undefined;
    set sessionCookieName(val: string | undefined);
    protected readonly channel: MessagingChannel;
    protected _options: MessagingOptions;
    constructor(options: MessagingOptions);
    private applyOptions;
    /**
     * Sets up an express router to receive webhook events
     * @param router an express router
     * @param route optional route to receive events at
     */
    setup(router: Router, route?: string): void;
    /**
     * Configures channels and webhooks
     * @param config channel and webhook configs
     * @returns a list of webhook tokens
     */
    sync(config: SyncRequest): Promise<SyncResult>;
    /**
     * Polls health events
     * @returns a list of health events per channel
     */
    getHealth(): Promise<HealthReport>;
    /**
     * Creates a new messaging user
     * @returns info of the newly created user
     */
    createUser(): Promise<User>;
    /**
     * Fetches a messaging user
     * @param id id of the user to fetch
     * @returns info of the user or `undefined` if not found
     */
    getUser(id: uuid): Promise<User | undefined>;
    /**
     * Creates a new messaging conversation
     * @param userId id of the user that starts this conversation
     * @returns info of the newly created conversation
     */
    createConversation(userId: uuid): Promise<Conversation>;
    /**
     * Fetches a messaging conversation
     * @param id id of the conversation to fetch
     * @returns info of the conversation or `undefined` if not found
     */
    getConversation(id: uuid): Promise<Conversation | undefined>;
    /**
     * Lists the conversations that a user participates in
     * @param userId id of the user that participates in the conversations
     * @param limit max amount of conversations to list (default 20)
     * @returns an array of conversations
     */
    listConversations(userId: uuid, limit?: number): Promise<Conversation[]>;
    /**
     * Sends a message to the messaging server
     * @param conversationId id of the conversation to post the message to
     * @param authorId id of the message autor. `undefined` if bot
     * @param payload content of the message
     * @param flags message flags
     * @returns info of the created message
     */
    createMessage(conversationId: uuid, authorId: uuid | undefined, payload: any, flags?: {
        incomingId: uuid;
    }): Promise<Message>;
    /**
     * Fetches a message
     * @param id id of the message to fetch
     * @returns info of the message or `undefined` if not found
     */
    getMessage(id: uuid): Promise<Message | undefined>;
    /**
     * Lists the messages of a conversation
     * @param conversationId id of the conversation that owns the messages
     * @param limit max amount of messages to list (default 20)
     * @returns an array of conversations
     */
    listMessages(conversationId: uuid, limit?: number): Promise<Message[]>;
    /**
     * Deletes a message
     * @param id id of the message to delete
     * @returns `true` if a message was deleted
     */
    deleteMessage(id: uuid): Promise<boolean>;
    /**
     * Deletes all messages of a conversation
     * @param conversationId id of the conversation that owns the messages
     * @returns amount of messages deleted
     */
    deleteMessagesByConversation(conversationId: uuid): Promise<number>;
    /**
     * When using converse, ends the answering turn of a message, terminating
     * the waiting period and returning all payloads that were collected
     * @param id id of the incoming message that has finished being answered
     */
    endTurn(id: uuid): Promise<void>;
    /**
     * Maps an endpoint to a conversation id. Calling this function with the
     * same endpoint always returns the same conversation id
     * @param endpoint endpoint to be mapped
     * @returns a conversation id associated to the endpoint
     */
    mapEndpoint(endpoint: Endpoint): Promise<uuid>;
    /**
     * Lists the endpoints associated to a conversation
     * @param conversationId id of the conversation that is associated with the endpoints
     * @returns an array of endpoints that are linked to the provided conversation
     */
    listEndpoints(conversationId: uuid): Promise<Endpoint[]>;
}
