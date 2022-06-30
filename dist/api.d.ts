import { Conversation, Endpoint, HealthReport, Message, SyncRequest, SyncResult, User, uuid } from '@botpress/messaging-base';
import { MessagingChannelBase } from './base';
export declare abstract class MessagingChannelApi extends MessagingChannelBase {
    /**
     * Creates a new client
     * @param id Id of the client
     * @returns Id and token of the created client
     */
    createClient(id?: uuid): Promise<{
        id: uuid;
        token: string;
    }>;
    /**
     * Renames a client
     * @param id Id of the client
     * @param name Name of the client
     */
    renameClient(clientId: uuid, name: string): Promise<void>;
    /**
     * Tests a client's credentials
     * @param clientId id of the client to test
     * @returns true if the client's credentials are valid
     */
    getClient(clientId: uuid): Promise<boolean>;
    /**
     * Synchronize a client with channel and webhook configs
     * @param clientId id of the client to configure
     * @param config channel and webhook configs
     * @returns a list of webhook tokens
     */
    sync(clientId: uuid, config: SyncRequest): Promise<SyncResult>;
    /**
     * Polls health events for a client
     * @param clientId id of the client to poll
     * @returns a list of health events per channel
     */
    getHealth(clientId: uuid): Promise<HealthReport>;
    /**
     * Creates a new messaging user
     * @param clientId id of the client that will own the user
     * @returns info of the newly created user
     */
    createUser(clientId: uuid): Promise<User>;
    /**
     * Fetches a messaging user
     * @param clientId id of the client that owns the user
     * @param id id of the user to fetch
     * @returns info of the user or `undefined` if not found
     */
    getUser(clientId: uuid, id: uuid): Promise<User | undefined>;
    /**
     * Creates a new messaging conversation
     * @param clientId id of the client that will own this conversation
     * @param userId id of the user that starts this conversation
     * @returns info of the newly created conversation
     */
    createConversation(clientId: uuid, userId: uuid): Promise<Conversation>;
    /**
     * Fetches a messaging conversation
     * @param clientId id of the client that owns the conversation
     * @param id id of the conversation to fetch
     * @returns info of the conversation or `undefined` if not found
     */
    getConversation(clientId: uuid, id: uuid): Promise<Conversation | undefined>;
    /**
     * Lists the conversations that a user participates in
     * @param clientId id of the client that owns the user
     * @param userId id of the user that participates in the conversations
     * @param limit max amount of conversations to list (default 20)
     * @returns an array of conversations
     */
    listConversations(clientId: uuid, userId: uuid, limit?: number): Promise<Conversation[]>;
    /**
     * Sends a message to the messaging server
     * @param clientId id of the client that owns the conversation
     * @param conversationId id of the conversation to post the message to
     * @param authorId id of the message autor. `undefined` if bot
     * @param payload content of the message
     * @param flags message flags for converse
     * @returns info of the created message
     */
    createMessage(clientId: uuid, conversationId: uuid, authorId: uuid | undefined, payload: any, flags?: {
        incomingId: uuid;
    }): Promise<Message>;
    /**
     * Fetches a message
     * @param clientId id of the client that owns the message
     * @param id id of the message to fetch
     * @returns info of the message or `undefined` if not found
     */
    getMessage(clientId: uuid, id: uuid): Promise<Message | undefined>;
    /**
     * Lists the messages of a conversation
     * @param clientId id of the client that owns the conversation
     * @param conversationId id of the conversation that owns the messages
     * @param limit max amount of messages to list (default 20)
     * @returns an array of conversations
     */
    listMessages(clientId: uuid, conversationId: uuid, limit?: number): Promise<Message[]>;
    /**
     * Deletes a message
     * @param clientId id of the client that owns the message
     * @param id id of the message to delete
     * @returns `true` if a message was deleted
     */
    deleteMessage(clientId: uuid, id: uuid): Promise<boolean>;
    /**
     * Deletes all messages of a conversation
     * @param clientId id of the client that owns the conversation
     * @param conversationId id of the conversation that owns the messages
     * @returns amount of messages deleted
     */
    deleteMessagesByConversation(clientId: uuid, conversationId: uuid): Promise<number>;
    /**
     * When using converse, ends the answering turn of a message, terminating
     * the waiting period and returning all payloads that were collected
     * @param clientId id of the client that owns the message
     * @param id id of the incoming message that has finished being answered
     */
    endTurn(clientId: uuid, id: uuid): Promise<void>;
    /**
     * Maps an endpoint to a conversation id. Calling this function with the
     * same endpoint always returns the same conversation id
     * @param clientId id of the client on which to do the mapping
     * @param endpoint endpoint to be mapped
     * @returns a conversation id associated to the endpoint
     */
    mapEndpoint(clientId: uuid, endpoint: Endpoint): Promise<uuid>;
    /**
     * Lists the endpoints associated to a conversation
     * @param clientId id of the client that owns the conversation
     * @param conversationId id of the conversation that is associated with the endpoints
     * @returns an array of endpoints that are linked to the provided conversation
     */
    listEndpoints(clientId: uuid, conversationId: uuid): Promise<Endpoint[]>;
    protected deserializeHealth(report: HealthReport): HealthReport;
    protected deserializeConversation(conversation: Conversation): Conversation;
    protected deserializeMessage(message: Message): Message;
}
