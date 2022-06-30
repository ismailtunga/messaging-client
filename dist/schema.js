"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Schemas = void 0;
const joi_1 = __importDefault(require("joi"));
// we put as any here, because joi changed their typings at some version,
// and having the joi typings here might created unecessary incompatibilites.
/**
 * Schemas for the webhook events
 */
exports.Schemas = {
    UserNew: joi_1.default
        .object({
        userId: joi_1.default.string().uuid().required()
    })
        .required()
        .options({ stripUnknown: true }),
    ConversationStarted: joi_1.default
        .object({
        userId: joi_1.default.string().uuid().required(),
        conversationId: joi_1.default.string().uuid().required(),
        channel: joi_1.default.string().required()
    })
        .required()
        .options({ stripUnknown: true }),
    MessageNew: joi_1.default
        .object({
        userId: joi_1.default.string().uuid().required(),
        conversationId: joi_1.default.string().uuid().required(),
        channel: joi_1.default.string().required(),
        collect: joi_1.default.boolean().optional(),
        message: joi_1.default
            .object({
            id: joi_1.default.string().uuid().required(),
            conversationId: joi_1.default.string().uuid().required(),
            authorId: joi_1.default.string().uuid().optional(),
            sentOn: joi_1.default.date().required(),
            payload: joi_1.default.object().required()
        })
            .required()
    })
        .required()
        .options({ stripUnknown: true }),
    MessageFeedback: joi_1.default
        .object({
        userId: joi_1.default.string().uuid().required(),
        conversationId: joi_1.default.string().uuid().required(),
        channel: joi_1.default.string().required(),
        messageId: joi_1.default.string().uuid().required(),
        feedback: joi_1.default.number().allow(1, -1)
    })
        .required()
        .options({ stripUnknown: true })
};
