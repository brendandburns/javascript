import { describe, it } from 'node:test';
import { rejects, strictEqual } from 'node:assert';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { setTimeout } from 'node:timers/promises';
import { anything, anyFunction, capture, instance, mock, verify, when } from 'ts-mockito';
import querystring from 'node:querystring';
import WebSocket from 'isomorphic-ws';

import { V1Status } from './api.js';
import { CallAwaiter } from './test/index.js';
import { KubeConfig } from './config.js';
import { Exec } from './exec.js';
import { Cp } from './cp.js';
import { WebSocketHandler, WebSocketInterface } from './web-socket-handler.js';

describe('Cp', () => {
    describe('cpFromPod', () => {
        it('should run create tar command to a url', async () => {
            const kc = new KubeConfig();
            const fakeWebSocketInterface: WebSocketInterface = mock(WebSocketHandler);
            const fakeWebSocket: WebSocket.WebSocket = mock(WebSocket) as WebSocket.WebSocket;
            const exec = new Exec(kc, instance(fakeWebSocketInterface));
            const cp = new Cp(kc, exec);

            const namespace = 'somenamespace';
            const pod = 'somepod';
            const container = 'container';
            const srcPath = '/';
            const tgtPath = fs.mkdtempSync(path.join(os.tmpdir(), 'cp-from-pod-test-'));
            const cmdArray = ['tar', 'cf', '-', srcPath];
            const execPath = `/api/v1/namespaces/${namespace}/pods/${pod}/exec`;

            const query = {
                stdout: true,
                stderr: true,
                stdin: false,
                tty: false,
                command: cmdArray,
                container,
            };
            const queryStr = querystring.stringify(query);

            const fakeConn: WebSocket.WebSocket = instance(fakeWebSocket);
            when(fakeWebSocketInterface.connect(`${execPath}?${queryStr}`, null, anyFunction())).thenResolve(
                fakeConn,
            );

            const cpPromise = cp.cpFromPod(namespace, pod, container, srcPath, tgtPath);
            const [, , outputFn] = capture(fakeWebSocketInterface.connect).last();
            outputFn?.(WebSocketHandler.StatusStream, Buffer.from(JSON.stringify({ status: 'Success' })));

            await cpPromise;
            verify(fakeWebSocketInterface.connect(`${execPath}?${queryStr}`, null, anyFunction())).called();
            fs.rmSync(tgtPath, { recursive: true, force: true });
        });

        it('should run create tar command to a url with cwd', async () => {
            const kc = new KubeConfig();
            const fakeWebSocketInterface: WebSocketInterface = mock(WebSocketHandler);
            const fakeWebSocket: WebSocket.WebSocket = mock(WebSocket) as WebSocket.WebSocket;
            const exec = new Exec(kc, instance(fakeWebSocketInterface));
            const cp = new Cp(kc, exec);

            const namespace = 'somenamespace';
            const pod = 'somepod';
            const container = 'container';
            const srcPath = '/';
            const tgtPath = fs.mkdtempSync(path.join(os.tmpdir(), 'cp-from-pod-test-'));
            const cwd = '/abc';
            const cmdArray = ['tar', 'cf', '-', '-C', cwd, srcPath];
            const execPath = `/api/v1/namespaces/${namespace}/pods/${pod}/exec`;

            const query = {
                stdout: true,
                stderr: true,
                stdin: false,
                tty: false,
                command: cmdArray,
                container,
            };
            const queryStr = querystring.stringify(query);

            const fakeConn: WebSocket.WebSocket = instance(fakeWebSocket);
            when(fakeWebSocketInterface.connect(`${execPath}?${queryStr}`, null, anyFunction())).thenResolve(
                fakeConn,
            );

            const cpPromise = cp.cpFromPod(namespace, pod, container, srcPath, tgtPath, cwd);
            const [, , outputFn] = capture(fakeWebSocketInterface.connect).last();
            outputFn?.(WebSocketHandler.StatusStream, Buffer.from(JSON.stringify({ status: 'Success' })));

            await cpPromise;
            verify(fakeWebSocketInterface.connect(`${execPath}?${queryStr}`, null, anyFunction())).called();
            fs.rmSync(tgtPath, { recursive: true, force: true });
        });

        it('should wait for command completion before resolving', async () => {
            const kc = new KubeConfig();
            const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cp-from-pod-test-'));
            let finishExec: ((status: V1Status) => void) | undefined;
            let finishStream: (() => void) | undefined;
            const exec = {
                exec: async (
                    _namespace: string,
                    _podName: string,
                    _containerName: string,
                    _command: string | string[],
                    stdout: NodeJS.WritableStream | null,
                    _stderr: NodeJS.WritableStream | null,
                    _stdin: NodeJS.ReadableStream | null,
                    _tty: boolean,
                    statusCallback?: (status: V1Status) => void,
                ): Promise<WebSocket.WebSocket> => {
                    finishExec = statusCallback;
                    finishStream = () => stdout?.end();
                    return {} as WebSocket.WebSocket;
                },
            } as Exec;
            const cp = new Cp(kc, exec);

            try {
                const cpPromise = cp.cpFromPod('ns', 'pod', 'container', 'test.txt', tempDir, '/tmp');
                let completed = false;
                cpPromise.then(() => (completed = true));

                await setTimeout(20);
                strictEqual(completed, false);

                finishStream?.();
                finishExec?.({ status: 'Success' } as V1Status);
                await cpPromise;
            } finally {
                fs.rmSync(tempDir, { recursive: true, force: true });
            }
        });
    });

    describe('cpToPod', () => {
        it('should run extract tar command to a url', async () => {
            const kc = new KubeConfig();
            const fakeWebSocketInterface: WebSocketInterface = mock(WebSocketHandler);
            const fakeWebSocket: WebSocket.WebSocket = mock(WebSocket) as WebSocket.WebSocket;
            const callAwaiter: CallAwaiter = new CallAwaiter();
            const exec = new Exec(kc, instance(fakeWebSocketInterface));
            const cp = new Cp(kc, exec);

            const namespace = 'somenamespace';
            const pod = 'somepod';
            const container = 'container';
            const srcPath = 'testdata/archive.txt';
            const tgtPath = '/';
            const cmdArray = ['tar', 'xf', '-', '-C', tgtPath];
            const execPath = `/api/v1/namespaces/${namespace}/pods/${pod}/exec`;

            const query = {
                stdout: false,
                stderr: true,
                stdin: true,
                tty: false,
                command: cmdArray,
                container,
            };
            const queryStr = querystring.stringify(query);

            const fakeConn: WebSocket.WebSocket = instance(fakeWebSocket);
            when(fakeWebSocketInterface.connect(`${execPath}?${queryStr}`, null, anyFunction())).thenResolve(
                fakeConn,
            );
            when(fakeWebSocket.send(anything())).thenCall(callAwaiter.resolveCall('send'));
            when(fakeWebSocket.close()).thenCall(callAwaiter.resolveCall('close'));

            const cpPromise = cp.cpToPod(namespace, pod, container, srcPath, tgtPath);
            const [, , outputFn] = capture(fakeWebSocketInterface.connect).last();
            outputFn?.(WebSocketHandler.StatusStream, Buffer.from(JSON.stringify({ status: 'Success' })));

            await cpPromise;
            verify(fakeWebSocketInterface.connect(`${execPath}?${queryStr}`, null, anyFunction())).called();
        });

        it('should wait for command completion before resolving', async () => {
            const kc = new KubeConfig();
            let finishExec: ((status: V1Status) => void) | undefined;
            const exec = {
                exec: async (
                    _namespace: string,
                    _podName: string,
                    _containerName: string,
                    _command: string | string[],
                    _stdout: NodeJS.WritableStream | null,
                    _stderr: NodeJS.WritableStream | null,
                    stdin: NodeJS.ReadableStream | null,
                    _tty: boolean,
                    statusCallback?: (status: V1Status) => void,
                ): Promise<WebSocket.WebSocket> => {
                    finishExec = statusCallback;
                    stdin?.resume();
                    return {} as WebSocket.WebSocket;
                },
            } as Exec;
            const cp = new Cp(kc, exec);

            const cpPromise = cp.cpToPod('ns', 'pod', 'container', 'testdata/archive.txt', '/tmp');
            let completed = false;
            cpPromise.then(() => (completed = true));

            await setTimeout(20);
            strictEqual(completed, false);

            finishExec?.({ status: 'Success' } as V1Status);
            await cpPromise;
        });

        it('should reject when command status is not success', async () => {
            const kc = new KubeConfig();
            const exec = {
                exec: async (
                    _namespace: string,
                    _podName: string,
                    _containerName: string,
                    _command: string | string[],
                    _stdout: NodeJS.WritableStream | null,
                    _stderr: NodeJS.WritableStream | null,
                    stdin: NodeJS.ReadableStream | null,
                    _tty: boolean,
                    statusCallback?: (status: V1Status) => void,
                ): Promise<WebSocket.WebSocket> => {
                    stdin?.resume();
                    statusCallback?.({ status: 'Failure', message: 'exit code 1' } as V1Status);
                    return {} as WebSocket.WebSocket;
                },
            } as Exec;
            const cp = new Cp(kc, exec);

            await rejects(
                cp.cpToPod('ns', 'pod', 'container', 'testdata/archive.txt', '/tmp'),
                /Error from cpToPod/,
            );
        });
    });
});
