"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagingClient = void 0;
const channel_1 = require("./channel");
const emitter_1 = require("./emitter");
class MessagingClient extends emitter_1.ProtectedEmitter {
    constructor(options) {
        super();
        this.channel = new channel_1.MessagingChannel(options);
        this.channel.on('user', (_, e) => __awaiter(this, void 0, void 0, function* () { return this.emit('user', e); }));
        this.channel.on('started', (_, e) => __awaiter(this, void 0, void 0, function* () { return this.emit('started', e); }));
        this.channel.on('message', (_, e) => __awaiter(this, void 0, void 0, function* () { return this.emit('message', e); }));
        this.channel.on('feedback', (_, e) => __awaiter(this, void 0, void 0, function* () { return this.emit('feedback', e); }));
        this._options = options;
        this.applyOptions();
    }
    /** Client id configured for this instance */
    get clientId() {
        return this._options.clientId;
    }
    set clientId(val) {
        this._options.clientId = val;
        this.applyOptions();
    }
    /** Client token of to authenticate requests made with the client id */
    get clientToken() {
        return this._options.clientToken;
    }
    set clientToken(val) {
        this._options.clientToken = val;
        this.applyOptions();
    }
    /** Webhook token to validate webhook events that are received */
    get webhookToken() {
        return this._options.webhookToken;
    }
    set webhookToken(val) {
        this._options.webhookToken = val;
        this.applyOptions();
    }
    /** Options that are currently applied */
    get options() {
        return this._options;
    }
    set options(val) {
        this.channel.options = val;
        this.applyOptions();
    }
    /** Base url of the messaging server */
    get url() {
        return this.channel.url;
    }
    set url(val) {
        this.channel.url = val;
    }
    /** A custom axios config giving more control over the HTTP client used internally. Optional */
    get axios() {
        return this.channel.axios;
    }
    set axios(val) {
        this.channel.axios = val;
    }
    /** Logger interface that can be used to get better debugging. Optional */
    get logger() {
        return this.channel.logger;
    }
    set logger(val) {
        this.channel.logger = val;
    }
    /** Name of the cookie for sticky sessions */
    get sessionCookieName() {
        return this.channel.sessionCookieName;
    }
    set sessionCookieName(val) {
        this.channel.sessionCookieName = val;
    }
    applyOptions() {
        if (this.channel.has(this.clientId)) {
            this.channel.stop(this.clientId);
        }
        const creds = { clientToken: this.options.clientToken, webhookToken: this.options.webhookToken };
        this.channel.start(this.clientId, creds);
    }
    /**
     * Sets up an express router to receive webhook events
     * @param router an express router
     * @param route optional route to receive events at
     */
    setup(router, route) {
        this.channel.setup(router, route);
    }
    /**
     * Configures channels and webhooks
     * @param config channel and webhook configs
     * @returns a list of webhook tokens
     */
    sync(config) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.channel.sync(this.clientId, config);
        });
    }
    /**
     * Polls health events
     * @returns a list of health events per channel
     */
    getHealth() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.channel.getHealth(this.clientId);
        });
    }
    /**
     * Creates a new messaging user
     * @returns info of the newly created user
     */
    createUser() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.channel.createUser(this.clientId);
        });
    }
    /**
     * Fetches a messaging user
     * @param id id of the user to fetch
     * @returns info of the user or `undefined` if not found
     */
    getUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.channel.getUser(this.clientId, id);
        });
    }
    /**
     * Creates a new messaging conversation
     * @param userId id of the user that starts this conversation
     * @returns info of the newly created conversation
     */
    createConversation(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.channel.createConversation(this.clientId, userId);
        });
    }
    /**
     * Fetches a messaging conversation
     * @param id id of the conversation to fetch
     * @returns info of the conversation or `undefined` if not found
     */
    getConversation(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.channel.getConversation(this.clientId, id);
        });
    }
    /**
     * Lists the conversations that a user participates in
     * @param userId id of the user that participates in the conversations
     * @param limit max amount of conversations to list (default 20)
     * @returns an array of conversations
     */
    listConversations(userId, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.channel.listConversations(this.clientId, userId, limit);
        });
    }
    /**
     * Sends a message to the messaging server
     * @param conversationId id of the conversation to post the message to
     * @param authorId id of the message autor. `undefined` if bot
     * @param payload content of the message
     * @param flags message flags
     * @returns info of the created message
     */
    createMessage(conversationId, authorId, payload, flags) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.channel.createMessage(this.clientId, conversationId, authorId, payload, flags);
        });
    }
    /**
     * Fetches a message
     * @param id id of the message to fetch
     * @returns info of the message or `undefined` if not found
     */
    getMessage(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.channel.getMessage(this.clientId, id);
        });
    }
    /**
     * Lists the messages of a conversation
     * @param conversationId id of the conversation that owns the messages
     * @param limit max amount of messages to list (default 20)
     * @returns an array of conversations
     */
    listMessages(conversationId, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.channel.listMessages(this.clientId, conversationId, limit);
        });
    }
    /**
     * Deletes a message
     * @param id id of the message to delete
     * @returns `true` if a message was deleted
     */
    deleteMessage(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.channel.deleteMessage(this.clientId, id);
        });
    }
    /**
     * Deletes all messages of a conversation
     * @param conversationId id of the conversation that owns the messages
     * @returns amount of messages deleted
     */
    deleteMessagesByConversation(conversationId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.channel.deleteMessagesByConversation(this.clientId, conversationId);
        });
    }
    /**
     * When using converse, ends the answering turn of a message, terminating
     * the waiting period and returning all payloads that were collected
     * @param id id of the incoming message that has finished being answered
     */
    endTurn(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.channel.endTurn(this.clientId, id);
        });
    }
    /**
     * Maps an endpoint to a conversation id. Calling this function with the
     * same endpoint always returns the same conversation id
     * @param endpoint endpoint to be mapped
     * @returns a conversation id associated to the endpoint
     */
    mapEndpoint(endpoint) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.channel.mapEndpoint(this.clientId, endpoint);
        });
    }
    /**
     * Lists the endpoints associated to a conversation
     * @param conversationId id of the conversation that is associated with the endpoints
     * @returns an array of endpoints that are linked to the provided conversation
     */
    listEndpoints(conversationId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.channel.listEndpoints(this.clientId, conversationId);
        });
    }
}
exports.MessagingClient = MessagingClient;
