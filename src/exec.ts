import WebSocket from 'isomorphic-ws';
import querystring from 'node:querystring';
import stream from 'stream';

import { V1Status } from './api.js';
import { KubeConfig } from './config.js';
import { isResizable, ResizableStream, TerminalSizeQueue } from './terminal-size-queue.js';
import { WebSocketHandler, WebSocketInterface } from './web-socket-handler.js';

export class Exec {
    public 'handler': WebSocketInterface;

    private terminalSizeQueue?: TerminalSizeQueue;

    public constructor(config: KubeConfig, wsInterface?: WebSocketInterface) {
        this.handler = wsInterface || new WebSocketHandler(config);
    }

    /**
     * @param {string}  namespace - The namespace of the pod to exec the command inside.
     * @param {string} podName - The name of the pod to exec the command inside.
     * @param {string} containerName - The name of the container in the pod to exec the command inside.
     * @param {(string|string[])} command - The command or command and arguments to execute.
     * @param {stream.Writable} stdout - The stream to write stdout data from the command.
     * @param {stream.Writable} stderr - The stream to write stderr data from the command.
     * @param {stream.Readable} stdin - The stream to write stdin data into the command.
     * @param {boolean} tty - Should the command execute in a TTY enabled session.
     * @param {(V1Status) => void} statusCallback -
     *       A callback to received the status (e.g. exit code) from the command, optional.
     * @param {(err: any) => void} done -
     *       A callback called once when the command completes, is closed, or errors, optional.
     * @return {Promise<WebSocket>} A promise that will return the web socket created for this command.
     */
    public async exec(
        namespace: string,
        podName: string,
        containerName: string,
        command: string | string[],
        stdout: stream.Writable | null,
        stderr: stream.Writable | null,
        stdin: stream.Readable | null,
        tty: boolean,
        statusCallback?: (status: V1Status) => void,
        done?: (err: any) => void,
    ): Promise<WebSocket.WebSocket> {
        let doneCalled = false;
        const doneOnce = (err: any) => {
            if (!doneCalled) {
                doneCalled = true;
                done?.(err);
            }
        };
        stdout?.once('error', doneOnce);
        stderr?.once('error', doneOnce);
        const query = {
            stdout: stdout != null,
            stderr: stderr != null,
            stdin: stdin != null,
            tty,
            command,
            container: containerName,
        };
        const queryStr = querystring.stringify(query);
        const path = `/api/v1/namespaces/${namespace}/pods/${podName}/exec?${queryStr}`;
        const handleOutput = (streamNum: number, buff: Buffer): boolean => {
            const status = WebSocketHandler.handleStandardStreams(streamNum, buff, stdout, stderr);
            if (status != null) {
                if (statusCallback) {
                    statusCallback(status);
                }
                doneOnce(WebSocketHandler.statusError(status));
                return false;
            }
            return true;
        };
        const conn = done
            ? await this.handler.connect(path, null, handleOutput, doneOnce)
            : await this.handler.connect(path, null, handleOutput);
        if (stdin != null) {
            WebSocketHandler.handleStandardInput(conn, stdin, WebSocketHandler.StdinStream, doneOnce);
        }
        if (isResizable(stdout)) {
            this.terminalSizeQueue = new TerminalSizeQueue();
            WebSocketHandler.handleStandardInput(
                conn,
                this.terminalSizeQueue,
                WebSocketHandler.ResizeStream,
                doneOnce,
            );
            this.terminalSizeQueue.handleResizes(stdout as any as ResizableStream);
        }
        return conn;
    }
}
