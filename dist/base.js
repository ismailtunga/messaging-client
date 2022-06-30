"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagingChannelBase = void 0;
const axios_1 = __importDefault(require("axios"));
const cookie_1 = __importDefault(require("cookie"));
const emitter_1 = require("./emitter");
class MessagingChannelBase extends emitter_1.Emitter {
    constructor(options) {
        super();
        this.auths = {};
        this.headers = {};
        this._options = options;
        this.applyOptions();
    }
    /** Options that are currently applied */
    get options() {
        return this._options;
    }
    set options(val) {
        this._options = val;
        this.applyOptions();
    }
    /** Base url of the messaging server */
    get url() {
        return this._options.url;
    }
    set url(val) {
        this._options.url = val;
        this.applyOptions();
    }
    /** Key to access admin routes. Optional */
    get adminKey() {
        return this._options.adminKey;
    }
    set adminKey(val) {
        this._options.adminKey = val;
        this.applyOptions();
    }
    /** A custom axios config giving more control over the HTTP client used internally. Optional */
    get axios() {
        return this._options.axios;
    }
    set axios(val) {
        this._options.axios = val;
        this.applyOptions();
    }
    /** Logger interface that can be used to get better debugging. Optional */
    get logger() {
        return this._options.logger;
    }
    set logger(val) {
        this._options.logger = val;
        this.applyOptions();
    }
    /** Name of the cookie for sticky sessions */
    get sessionCookieName() {
        return this._options.sessionCookieName;
    }
    set sessionCookieName(val) {
        this._options.sessionCookieName = val;
        this.applyOptions();
    }
    applyOptions() {
        var _a;
        const config = this.getAxiosConfig(this._options);
        this.adminHeader = ((_a = this._options.adminKey) === null || _a === void 0 ? void 0 : _a.length) ? { 'x-bp-messaging-admin-key': this._options.adminKey } : {};
        this.http = axios_1.default.create(config);
        this.http.interceptors.response.use((e) => {
            this.saveCookie(e.headers['set-cookie']);
            return e;
        }, (e) => {
            var _a, _b;
            this.saveCookie((_b = (_a = e === null || e === void 0 ? void 0 : e.response) === null || _a === void 0 ? void 0 : _a.headers) === null || _b === void 0 ? void 0 : _b['set-cookie']);
            return Promise.reject(e);
        });
    }
    saveCookie(cookieHeader) {
        if (!this.sessionCookieName || !cookieHeader) {
            return;
        }
        for (const strCookie of cookieHeader) {
            const resCookie = cookie_1.default.parse(strCookie);
            if (resCookie[this.sessionCookieName]) {
                this.http.defaults.headers.common['cookie'] = `${this.sessionCookieName}=${resCookie[this.sessionCookieName]};`;
            }
        }
    }
    getAxiosConfig({ url, axios }) {
        const defaultConfig = { baseURL: `${url}/api/v1` };
        return Object.assign(Object.assign({}, axios), defaultConfig);
    }
    /**
     * Indicates if credentials for a specific client id are currently known (start was called)
     */
    has(clientId) {
        return this.auths[clientId] !== undefined;
    }
    /**
     * Configures credentials of a client to allow making requests using that client id
     * Credentials are stored in memory
     */
    start(clientId, auth) {
        this.auths[clientId] = auth;
        this.headers[clientId] = {
            'x-bp-messaging-client-id': clientId,
            'x-bp-messaging-client-token': auth.clientToken
        };
    }
    /**
     * Removed credentials of a client id. It's not possible to make request to this
     * client id after stop was called (start needs to be called again)
     */
    stop(clientId) {
        delete this.auths[clientId];
        delete this.headers[clientId];
    }
}
exports.MessagingChannelBase = MessagingChannelBase;
