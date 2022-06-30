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
exports.MessagingChannelApi = void 0;
const _1 = require(".");
const base_1 = require("./base");
const errors_1 = require("./errors");
class MessagingChannelApi extends base_1.MessagingChannelBase {
    /**
     * Creates a new client
     * @param id Id of the client
     * @returns Id and token of the created client
     */
    createClient(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.http.post('/admin/clients', { id }, { headers: this.adminHeader })).data;
        });
    }
    /**
     * Renames a client
     * @param id Id of the client
     * @param name Name of the client
     */
    renameClient(clientId, name) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.http.put('/admin/clients/name', { id: clientId, name }, { headers: this.adminHeader });
        });
    }
    /**
     * Tests a client's credentials
     * @param clientId id of the client to test
     * @returns true if the client's credentials are valid
     */
    getClient(clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, _1.handleUnauthorized)(() => __awaiter(this, void 0, void 0, function* () {
                yield this.http.get('/clients', { headers: this.headers[clientId] });
                return true;
            }), false);
        });
    }
    /**
     * Synchronize a client with channel and webhook configs
     * @param clientId id of the client to configure
     * @param config channel and webhook configs
     * @returns a list of webhook tokens
     */
    sync(clientId, config) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.http.post('/sync', config, { headers: this.headers[clientId] })).data;
        });
    }
    /**
     * Polls health events for a client
     * @param clientId id of the client to poll
     * @returns a list of health events per channel
     */
    getHealth(clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.deserializeHealth((yield this.http.get('/health', { headers: this.headers[clientId] })).data);
        });
    }
    /**
     * Creates a new messaging user
     * @param clientId id of the client that will own the user
     * @returns info of the newly created user
     */
    createUser(clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.http.post('/users', undefined, { headers: this.headers[clientId] })).data;
        });
    }
    /**
     * Fetches a messaging user
     * @param clientId id of the client that owns the user
     * @param id id of the user to fetch
     * @returns info of the user or `undefined` if not found
     */
    getUser(clientId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, errors_1.handleNotFound)(() => __awaiter(this, void 0, void 0, function* () {
                return (yield this.http.get(`/users/${id}`, { headers: this.headers[clientId] })).data;
            }), undefined);
        });
    }
    /**
     * Creates a new messaging conversation
     * @param clientId id of the client that will own this conversation
     * @param userId id of the user that starts this conversation
     * @returns info of the newly created conversation
     */
    createConversation(clientId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.deserializeConversation((yield this.http.post('/conversations', { userId }, { headers: this.headers[clientId] })).data);
        });
    }
    /**
     * Fetches a messaging conversation
     * @param clientId id of the client that owns the conversation
     * @param id id of the conversation to fetch
     * @returns info of the conversation or `undefined` if not found
     */
    getConversation(clientId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, errors_1.handleNotFound)(() => __awaiter(this, void 0, void 0, function* () {
                return this.deserializeConversation((yield this.http.get(`/conversations/${id}`, { headers: this.headers[clientId] })).data);
            }), undefined);
        });
    }
    /**
     * Lists the conversations that a user participates in
     * @param clientId id of the client that owns the user
     * @param userId id of the user that participates in the conversations
     * @param limit max amount of conversations to list (default 20)
     * @returns an array of conversations
     */
    listConversations(clientId, userId, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.http.get(`/conversations/user/${userId}`, {
                headers: this.headers[clientId],
                params: { limit }
            })).data.map((x) => this.deserializeConversation(x));
        });
    }
    /**
     * Sends a message to the messaging server
     * @param clientId id of the client that owns the conversation
     * @param conversationId id of the conversation to post the message to
     * @param authorId id of the message autor. `undefined` if bot
     * @param payload content of the message
     * @param flags message flags for converse
     * @returns info of the created message
     */
    createMessage(clientId, conversationId, authorId, payload, flags) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.deserializeMessage((yield this.http.post('/messages', { conversationId, authorId, payload, incomingId: flags === null || flags === void 0 ? void 0 : flags.incomingId }, { headers: this.headers[clientId] })).data);
        });
    }
    /**
     * Fetches a message
     * @param clientId id of the client that owns the message
     * @param id id of the message to fetch
     * @returns info of the message or `undefined` if not found
     */
    getMessage(clientId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, errors_1.handleNotFound)(() => __awaiter(this, void 0, void 0, function* () {
                return this.deserializeMessage((yield this.http.get(`/messages/${id}`, { headers: this.headers[clientId] })).data);
            }), undefined);
        });
    }
    /**
     * Lists the messages of a conversation
     * @param clientId id of the client that owns the conversation
     * @param conversationId id of the conversation that owns the messages
     * @param limit max amount of messages to list (default 20)
     * @returns an array of conversations
     */
    listMessages(clientId, conversationId, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.http.get(`/messages/conversation/${conversationId}`, {
                headers: this.headers[clientId],
                params: { limit }
            })).data.map((x) => this.deserializeMessage(x));
        });
    }
    /**
     * Deletes a message
     * @param clientId id of the client that owns the message
     * @param id id of the message to delete
     * @returns `true` if a message was deleted
     */
    deleteMessage(clientId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, errors_1.handleNotFound)(() => __awaiter(this, void 0, void 0, function* () {
                yield this.http.delete(`/messages/${id}`, { headers: this.headers[clientId] });
                return true;
            }), false);
        });
    }
    /**
     * Deletes all messages of a conversation
     * @param clientId id of the client that owns the conversation
     * @param conversationId id of the conversation that owns the messages
     * @returns amount of messages deleted
     */
    deleteMessagesByConversation(clientId, conversationId) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, errors_1.handleNotFound)(() => __awaiter(this, void 0, void 0, function* () {
                return (yield this.http.delete(`/messages/conversation/${conversationId}`, {
                    headers: this.headers[clientId]
                })).data.count;
            }), 0);
        });
    }
    /**
     * When using converse, ends the answering turn of a message, terminating
     * the waiting period and returning all payloads that were collected
     * @param clientId id of the client that owns the message
     * @param id id of the incoming message that has finished being answered
     */
    endTurn(clientId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.http.post(`/messages/turn/${id}`, undefined, { headers: this.headers[clientId] });
        });
    }
    /**
     * Maps an endpoint to a conversation id. Calling this function with the
     * same endpoint always returns the same conversation id
     * @param clientId id of the client on which to do the mapping
     * @param endpoint endpoint to be mapped
     * @returns a conversation id associated to the endpoint
     */
    mapEndpoint(clientId, endpoint) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.http.post('/endpoints/map', endpoint, { headers: this.headers[clientId] })).data.conversationId;
        });
    }
    /**
     * Lists the endpoints associated to a conversation
     * @param clientId id of the client that owns the conversation
     * @param conversationId id of the conversation that is associated with the endpoints
     * @returns an array of endpoints that are linked to the provided conversation
     */
    listEndpoints(clientId, conversationId) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.http.get(`/endpoints/conversation/${conversationId}`, {
                headers: this.headers[clientId]
            })).data;
        });
    }
    deserializeHealth(report) {
        for (const channel of Object.keys(report.channels)) {
            report.channels[channel].events = report.channels[channel].events.map((x) => (Object.assign(Object.assign({}, x), { time: new Date(x.time) })));
        }
        return report;
    }
    deserializeConversation(conversation) {
        return Object.assign(Object.assign({}, conversation), { createdOn: new Date(conversation.createdOn) });
    }
    deserializeMessage(message) {
        return Object.assign(Object.assign({}, message), { sentOn: new Date(message.sentOn) });
    }
}
exports.MessagingChannelApi = MessagingChannelApi;
