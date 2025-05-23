import { describe, it } from 'node:test';
import { deepEqual, deepStrictEqual } from 'node:assert';
import { ObjectSerializer } from './serializer.js';

describe('ObjectSerializer', () => {
    describe('serialize', () => {
        it('should serialize a known object', () => {
            const s = {
                apiVersion: 'v1',
                kind: 'Secret',
                metadata: {
                    name: 'k8s-js-client-test',
                    namespace: 'default',
                    creationTimestamp: new Date('2022-01-01T00:00:00.000Z'),
                },
                data: {
                    key: 'value',
                },
            };
            const res = ObjectSerializer.serialize(s, 'V1Secret');
            deepStrictEqual(res, {
                apiVersion: 'v1',
                kind: 'Secret',
                metadata: {
                    name: 'k8s-js-client-test',
                    namespace: 'default',
                    creationTimestamp: '2022-01-01T00:00:00.000Z',
                    uid: undefined,
                    annotations: undefined,
                    labels: undefined,
                    finalizers: undefined,
                    generateName: undefined,
                    selfLink: undefined,
                    resourceVersion: undefined,
                    generation: undefined,
                    ownerReferences: undefined,
                    deletionTimestamp: undefined,
                    deletionGracePeriodSeconds: undefined,
                    managedFields: undefined,
                },
                data: {
                    key: 'value',
                },
                type: undefined,
                immutable: undefined,
                stringData: undefined,
            });
        });

        it('should serialize a unknown kubernetes object', () => {
            const s = {
                apiVersion: 'v1alpha1',
                kind: 'MyCustomResource',
                metadata: {
                    name: 'k8s-js-client-test',
                    namespace: 'default',
                    creationTimestamp: new Date('2022-01-01T00:00:00.000Z'),
                },
                data: {
                    key: 'value',
                },
            };
            const res = ObjectSerializer.serialize(s, 'v1alpha1MyCustomResource');
            deepStrictEqual(res, {
                apiVersion: 'v1alpha1',
                kind: 'MyCustomResource',
                metadata: {
                    name: 'k8s-js-client-test',
                    namespace: 'default',
                    creationTimestamp: '2022-01-01T00:00:00.000Z',
                    uid: undefined,
                    annotations: undefined,
                    labels: undefined,
                    finalizers: undefined,
                    generateName: undefined,
                    selfLink: undefined,
                    resourceVersion: undefined,
                    generation: undefined,
                    ownerReferences: undefined,
                    deletionTimestamp: undefined,
                    deletionGracePeriodSeconds: undefined,
                    managedFields: undefined,
                },
                data: {
                    key: 'value',
                },
            });
        });

        it('should serialize a unknown primitive', () => {
            const s = {
                key: 'value',
            };
            const res = ObjectSerializer.serialize(s, 'unknown');
            deepStrictEqual(res, s);
        });
    });

    describe('deserialize', () => {
        it('should deserialize a known object', () => {
            const s = {
                apiVersion: 'v1',
                kind: 'Secret',
                metadata: {
                    name: 'k8s-js-client-test',
                    namespace: 'default',
                    creationTimestamp: '2022-01-01T00:00:00.000Z',
                },
                data: {
                    key: 'value',
                },
            };
            const res = ObjectSerializer.deserialize(s, 'V1Secret');
            deepEqual(res, {
                apiVersion: 'v1',
                kind: 'Secret',
                metadata: {
                    name: 'k8s-js-client-test',
                    namespace: 'default',
                    creationTimestamp: new Date('2022-01-01T00:00:00.000Z'),
                },
                data: {
                    key: 'value',
                },
            });
        });

        it('should deserialize a unknown object', () => {
            const s = {
                apiVersion: 'v1alpha1',
                kind: 'MyCustomResource',
                metadata: {
                    name: 'k8s-js-client-test',
                    namespace: 'default',
                    creationTimestamp: '2022-01-01T00:00:00.000Z',
                },
                data: {
                    key: 'value',
                },
            };
            const res = ObjectSerializer.deserialize(s, 'v1alpha1MyCustomResource');
            deepEqual(res, {
                apiVersion: 'v1alpha1',
                kind: 'MyCustomResource',
                metadata: {
                    name: 'k8s-js-client-test',
                    namespace: 'default',
                    creationTimestamp: new Date('2022-01-01T00:00:00.000Z'),
                },
                data: {
                    key: 'value',
                },
            });
        });

        it('should deserialize a unknown primitive', () => {
            const s = {
                key: 'value',
            };
            const res = ObjectSerializer.serialize(s, 'unknown');
            deepStrictEqual(res, s);
        });
    });
});
