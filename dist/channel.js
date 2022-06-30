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
exports.MessagingChannel = void 0;
const api_1 = require("./api");
const schema_1 = require("./schema");
/**
 * Multi-tenant version of MessagingClient that allows setting up multiple client ids
 */
class MessagingChannel extends api_1.MessagingChannelApi {
    /**
     * Sets up an express router to receive webhook events
     * @param router an express router
     * @param route optional route to receive events at
     */
    setup(router, route) {
        router.post(route || '/', this.asyncMiddleware(this.handleRequest.bind(this)));
    }
    asyncMiddleware(fn) {
        return (req, res, next) => {
            fn(req, res, next).catch((e) => {
                var _a;
                (_a = this.logger) === null || _a === void 0 ? void 0 : _a.error(e, 'Error occured processing webhook event');
                return res.sendStatus(500);
            });
        };
    }
    handleRequest(req, res) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const clientId = req.headers['x-bp-messaging-client-id'];
            const webhookToken = req.headers['x-bp-messaging-webhook-token'];
            const auth = this.auths[clientId];
            if (!webhookToken) {
                return res.status(401).send('Unauthorized. Webhook token is missing');
            }
            else if (!auth) {
                return res.status(404).send('Not Found. Client id is unknown');
            }
            else if (webhookToken !== auth.webhookToken) {
                return res.status(403).send('Forbidden. Webhook token is incorrect');
            }
            const type = (_a = req.body) === null || _a === void 0 ? void 0 : _a.type;
            const data = (_b = req.body) === null || _b === void 0 ? void 0 : _b.data;
            yield this.handleEvent(clientId, type, data, res);
        });
    }
    handleEvent(clientId, type, data, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (type === 'message.new') {
                const { error } = schema_1.Schemas.MessageNew.validate(data);
                if (error) {
                    return res.status(400).send(error.message);
                }
                yield this.emit('message', clientId, Object.assign(Object.assign({}, data), { message: this.deserializeMessage(data.message) }));
            }
            else if (type === 'conversation.started') {
                const { error } = schema_1.Schemas.ConversationStarted.validate(data);
                if (error) {
                    return res.status(400).send(error.message);
                }
                yield this.emit('started', clientId, data);
            }
            else if (type === 'user.new') {
                const { error } = schema_1.Schemas.UserNew.validate(data);
                if (error) {
                    return res.status(400).send(error.message);
                }
                yield this.emit('user', clientId, data);
            }
            else if (type === 'message.feedback') {
                const { error } = schema_1.Schemas.MessageFeedback.validate(data);
                if (error) {
                    return res.status(400).send(error.message);
                }
                yield this.emit('feedback', clientId, data);
            }
            res.sendStatus(200);
        });
    }
}
exports.MessagingChannel = MessagingChannel;
