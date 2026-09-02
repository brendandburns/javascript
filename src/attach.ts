import WebSocket from 'isomorphic-ws';
import querystring from 'node:querystring';
import stream from 'node:stream';

import { KubeConfig } from './config.js';
import { isResizable, ResizableStream, TerminalSizeQueue } from './terminal-size-queue.js';
import { WebSocketHandler, WebSocketInterface } from './web-socket-handler.js';

export class Attach {
    public 'handler': WebSocketInterface;

    private terminalSizeQueue?: TerminalSizeQueue;

    public constructor(config: KubeConfig, websocketInterface?: WebSocketInterface) {
        this.handler = websocketInterface || new WebSocketHandler(config);
    }

    public async attach(
        namespace: string,
        podName: string,
        containerName: string,
        stdout: stream.Writable | any,
        stderr: stream.Writable | any,
        stdin: stream.Readable | any,
        tty: boolean,
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
            container: containerName,
            stderr: stderr != null,
            stdin: stdin != null,
            stdout: stdout != null,
            tty,
        };
        const queryStr = querystring.stringify(query);
        const path = `/api/v1/namespaces/${namespace}/pods/${podName}/attach?${queryStr}`;
        const handleOutput = (streamNum: number, buff: Buffer): boolean => {
            WebSocketHandler.handleStandardStreams(streamNum, buff, stdout, stderr);
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
