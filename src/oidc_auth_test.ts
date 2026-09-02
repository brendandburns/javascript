import { beforeEach, describe, it } from 'node:test';
import { notStrictEqual, strictEqual } from 'node:assert';
import { OutgoingHttpHeaders } from 'node:http';
import https from 'node:https';
import { base64url } from 'rfc4648';

import { User } from './config_types.js';
import { OpenIDConnectAuth } from './oidc_auth.js';

function encode(value: string): string {
    return base64url.stringify(new TextEncoder().encode(value));
}

function makeJWT(header: string, payload: object, signature: string): string {
    return encode(header) + '.' + encode(JSON.stringify(payload)) + '.' + encode(signature);
}

describe('OIDCAuth', () => {
    let auth: OpenIDConnectAuth;
    beforeEach(() => {
        auth = new OpenIDConnectAuth();
    });

    it('should correctly parse a JWT', () => {
        const jwt = OpenIDConnectAuth.decodeJWT(makeJWT('{}', { exp: 100 }, 'fake'));
        notStrictEqual(jwt, null);
    });

    it('should correctly parse time from token', () => {
        const time = Math.floor(Date.now() / 1000);
        const token = makeJWT('{}', { exp: time }, 'fake');
        const timeOut = OpenIDConnectAuth.expirationFromToken(token);

        strictEqual(timeOut, time);
    });

    it('should be true for oidc user', () => {
        const user = {
            authProvider: {
                name: 'oidc',
            },
        } as User;

        strictEqual(auth.isAuthProvider(user), true);
    });

    it('should be false for other user', () => {
        const user = {
            authProvider: {
                name: 'azure',
            },
        } as User;

        strictEqual(auth.isAuthProvider(user), false);
    });

    it('should be false for null user.authProvider', () => {
        const user = {} as User;

        strictEqual(auth.isAuthProvider(user), false);
    });

    it('authorization should be undefined if token missing', async () => {
        const user = {
            authProvider: {
                name: 'oidc',
                config: {
                    'client-id': 'id',
                    'client-secret': 'clientsecret',
                    'refresh-token': 'refreshtoken',
                    'idp-issuer-url': 'https://www.google.com/',
                },
            },
        } as User;

        const opts = {} as https.RequestOptions;
        opts.headers = {} as OutgoingHttpHeaders;
        await auth.applyAuthentication(user, opts);
        strictEqual(opts.headers.Authorization, undefined);
    });

    it('authorization should be undefined if client-id missing', async () => {
        const past = 100;
        const token = makeJWT('{}', { exp: past }, 'fake');
        const user = {
            authProvider: {
                name: 'oidc',
                config: {
                    'id-token': token,
                    'client-secret': 'clientsecret',
                    'refresh-token': 'refreshtoken',
                    'idp-issuer-url': 'https://www.google.com/',
                },
            },
        } as User;

        const opts = {} as https.RequestOptions;
        opts.headers = {} as OutgoingHttpHeaders;
        await auth.applyAuthentication(user, opts);
        strictEqual(opts.headers.Authorization, undefined);
    });

    it('authorization should be work if client-secret missing', async () => {
        const future = Date.now() / 1000 + 1000;
        const token = makeJWT('{}', { exp: future }, 'fake');
        const user = {
            authProvider: {
                name: 'oidc',
                config: {
                    'id-token': token,
                    'client-id': 'id',
                    'refresh-token': 'refreshtoken',
                    'idp-issuer-url': 'https://www.google.com/',
                },
            },
        } as User;

        const opts = {} as https.RequestOptions;
        opts.headers = {} as OutgoingHttpHeaders;
        await auth.applyAuthentication(user, opts);
        strictEqual((opts.headers.Authorization as string).startsWith('Bearer '), true);
    });

    it('authorization should be undefined if refresh-token missing', async () => {
        const past = 100;
        const token = makeJWT('{}', { exp: past }, 'fake');
        const user = {
            authProvider: {
                name: 'oidc',
                config: {
                    'id-token': token,
                    'client-id': 'id',
                    'client-secret': 'clientsecret',
                    'idp-issuer-url': 'https://www.google.com/',
                },
            },
        } as User;

        const opts = {} as https.RequestOptions;
        opts.headers = {} as OutgoingHttpHeaders;
        await auth.applyAuthentication(user, opts);
        strictEqual(opts.headers.Authorization, undefined);
    });

    it('authorization should work if refresh-token missing but token is unexpired', async () => {
        const future = Date.now() / 1000 + 1000000;
        const token = makeJWT('{}', { exp: future }, 'fake');
        const user = {
            authProvider: {
                name: 'oidc',
                config: {
                    'id-token': token,
                    'client-id': 'id',
                    'client-secret': 'clientsecret',
                    'idp-issuer-url': 'https://www.google.com/',
                },
            },
        } as User;

        const opts = {} as https.RequestOptions;
        opts.headers = {} as OutgoingHttpHeaders;
        await auth.applyAuthentication(user, opts);
        strictEqual((opts.headers.Authorization as string).startsWith('Bearer '), true);
    });

    it('authorization should be undefined if idp-issuer-url missing', async () => {
        const past = 100;
        const token = makeJWT('{}', { exp: past }, 'fake');
        const user = {
            authProvider: {
                name: 'oidc',
                config: {
                    'id-token': token,
                    'client-id': 'id',
                    'client-secret': 'clientsecret',
                    'refresh-token': 'refreshtoken',
                },
            },
        } as User;

        const opts = {} as https.RequestOptions;
        opts.headers = {} as OutgoingHttpHeaders;
        await auth.applyAuthentication(user, opts, {});
        strictEqual(opts.headers.Authorization, undefined);
    });

    it('return token when it is still active', async () => {
        const future = Date.now() / 1000 + 1000;
        const token = makeJWT('{}', { exp: future }, 'fake');
        const user = {
            authProvider: {
                name: 'oidc',
                config: {
                    'id-token': token,
                    'client-id': 'id',
                    'client-secret': 'clientsecret',
                    'refresh-token': 'refreshtoken',
                    'idp-issuer-url': 'https://www.google.com/',
                },
            },
        } as User;

        const opts = {} as https.RequestOptions;
        opts.headers = {} as OutgoingHttpHeaders;
        await auth.applyAuthentication(user, opts);
        strictEqual((opts.headers.Authorization as string).startsWith('Bearer '), true);
    });

    it('return new token when the current expired', async () => {
        const past = Math.floor(Date.now() / 1000) - 1000;
        const token = makeJWT('{}', { exp: past }, 'fake');
        const user = {
            authProvider: {
                name: 'oidc',
                config: {
                    'id-token': token,
                    'client-id': 'id',
                    'client-secret': 'clientsecret',
                    'refresh-token': 'refreshtoken',
                    'idp-issuer-url': 'https://www.google.com/',
                },
            },
        } as User;

        const opts = {} as https.RequestOptions;
        opts.headers = {} as OutgoingHttpHeaders;
        const newExpiration = Date.now() / 1000 + 120;
        await auth.applyAuthentication(user, opts, {
            refresh: async () => {
                return {
                    expires_at: newExpiration,
                    id_token: 'newToken',
                    refresh_token: 'newRefreshToken',
                };
            },
        });
        strictEqual((opts.headers.Authorization as string).startsWith('Bearer '), true);
        strictEqual(user.authProvider.config['id-token'], 'newToken');
        strictEqual(user.authProvider.config['refresh-token'], 'newRefreshToken');
    });

    it('return a new token when the token is expired', async () => {
        const past = Math.floor(Date.now() / 1000) - 1000;
        const token = makeJWT('{}', { exp: past }, 'fake');
        const user = {
            authProvider: {
                name: 'oidc',
                config: {
                    'id-token': token,
                    'client-id': 'id',
                    'client-secret': 'clientsecret',
                    'refresh-token': 'refreshtoken',
                    'idp-issuer-url': 'https://www.google.com/',
                },
            },
        } as User;

        const opts = {} as https.RequestOptions;
        opts.headers = {} as OutgoingHttpHeaders;
        const newExpiration = Date.now() / 1000 + 120;
        await auth.applyAuthentication(user, opts, {
            refresh: async () => {
                return {
                    expires_at: newExpiration,
                    id_token: 'newToken',
                };
            },
        });
        strictEqual(user.authProvider.config['refresh-token'], 'refreshtoken');
    });

    it('uses refresh expiry as relative seconds for opaque id tokens', async () => {
        const past = Math.floor(Date.now() / 1000) - 1000;
        const token = makeJWT('{}', { exp: past }, 'fake');
        const user = {
            authProvider: {
                name: 'oidc',
                config: {
                    'id-token': token,
                    'client-id': 'id',
                    'client-secret': 'clientsecret',
                    'refresh-token': 'refreshtoken',
                    'idp-issuer-url': 'https://www.google.com/',
                },
            },
        } as User;

        const opts = {} as https.RequestOptions;
        opts.headers = {} as OutgoingHttpHeaders;
        let refreshCount = 0;
        const overrideClient = {
            refresh: async () => {
                refreshCount++;
                return {
                    expires_at: 120,
                    id_token: 'opaqueToken',
                    refresh_token: 'newRefreshToken',
                };
            },
        };

        await auth.applyAuthentication(user, opts, overrideClient);
        await auth.applyAuthentication(user, opts, overrideClient);
        strictEqual(refreshCount, 1);
    });

    it('keeps OIDC expiration state isolated by credential identity', async () => {
        const future = Math.floor(Date.now() / 1000) + 1000;
        const past = Math.floor(Date.now() / 1000) - 1000;
        const userA = {
            authProvider: {
                name: 'oidc',
                config: {
                    'id-token': makeJWT('{}', { exp: future }, 'fake'),
                    'client-id': 'client-a',
                    'client-secret': 'clientsecret',
                    'refresh-token': 'refresh-a',
                    'idp-issuer-url': 'https://www.google.com/',
                },
            },
        } as User;
        const userB = {
            authProvider: {
                name: 'oidc',
                config: {
                    'id-token': makeJWT('{}', { exp: past }, 'fake'),
                    'client-id': 'client-b',
                    'client-secret': 'clientsecret',
                    'refresh-token': 'refresh-b',
                    'idp-issuer-url': 'https://www.google.com/',
                },
            },
        } as User;

        const optsA = {} as https.RequestOptions;
        const optsB = {} as https.RequestOptions;
        optsA.headers = {} as OutgoingHttpHeaders;
        optsB.headers = {} as OutgoingHttpHeaders;

        let refreshCount = 0;
        await auth.applyAuthentication(userA, optsA);
        await auth.applyAuthentication(userB, optsB, {
            refresh: async () => {
                refreshCount++;
                return {
                    expires_at: 120,
                    id_token: 'newTokenForUserB',
                    refresh_token: 'newRefreshTokenForUserB',
                };
            },
        });

        strictEqual(refreshCount, 1);
        strictEqual(userB.authProvider.config['id-token'], 'newTokenForUserB');
    });

    it('should work with idp-certificate-authority-data', async () => {
        const future = Date.now() / 1000 + 1000000;
        const token = makeJWT('{}', { exp: future }, 'fake');
        const user = {
            authProvider: {
                name: 'oidc',
                config: {
                    'id-token': token,
                    'client-id': 'id',
                    'client-secret': 'clientsecret',
                    'idp-issuer-url': 'https://idp.example.com/',
                    'idp-certificate-authority-data': 'LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0t',
                },
            },
        } as User;

        const opts = {} as https.RequestOptions;
        opts.headers = {} as OutgoingHttpHeaders;
        await auth.applyAuthentication(user, opts);
        strictEqual((opts.headers.Authorization as string).startsWith('Bearer '), true);
    });

    it('should work with idp-certificate-authority file', async () => {
        const future = Date.now() / 1000 + 1000000;
        const token = makeJWT('{}', { exp: future }, 'fake');
        const user = {
            authProvider: {
                name: 'oidc',
                config: {
                    'id-token': token,
                    'client-id': 'id',
                    'client-secret': 'clientsecret',
                    'idp-issuer-url': 'https://idp.example.com/',
                    'idp-certificate-authority': '/path/to/ca.crt',
                },
            },
        } as User;

        const opts = {} as https.RequestOptions;
        opts.headers = {} as OutgoingHttpHeaders;
        await auth.applyAuthentication(user, opts);
        strictEqual((opts.headers.Authorization as string).startsWith('Bearer '), true);
    });
});
