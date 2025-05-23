/**
 * Kubernetes
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * OpenAPI spec version: v1.33.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { V1Preconditions } from '../models/V1Preconditions.js';
import { HttpFile } from '../http/http.js';

/**
* DeleteOptions may be provided when deleting an API object.
*/
export class V1DeleteOptions {
    /**
    * APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources
    */
    'apiVersion'?: string;
    /**
    * When present, indicates that modifications should not be persisted. An invalid or unrecognized dryRun directive will result in an error response and no further processing of the request. Valid values are: - All: all dry run stages will be processed
    */
    'dryRun'?: Array<string>;
    /**
    * The duration in seconds before the object should be deleted. Value must be non-negative integer. The value zero indicates delete immediately. If this value is nil, the default grace period for the specified type will be used. Defaults to a per object value if not specified. zero means delete immediately.
    */
    'gracePeriodSeconds'?: number;
    /**
    * if set to true, it will trigger an unsafe deletion of the resource in case the normal deletion flow fails with a corrupt object error. A resource is considered corrupt if it can not be retrieved from the underlying storage successfully because of a) its data can not be transformed e.g. decryption failure, or b) it fails to decode into an object. NOTE: unsafe deletion ignores finalizer constraints, skips precondition checks, and removes the object from the storage. WARNING: This may potentially break the cluster if the workload associated with the resource being unsafe-deleted relies on normal deletion flow. Use only if you REALLY know what you are doing. The default value is false, and the user must opt in to enable it
    */
    'ignoreStoreReadErrorWithClusterBreakingPotential'?: boolean;
    /**
    * Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
    */
    'kind'?: string;
    /**
    * Deprecated: please use the PropagationPolicy, this field will be deprecated in 1.7. Should the dependent objects be orphaned. If true/false, the \"orphan\" finalizer will be added to/removed from the object\'s finalizers list. Either this field or PropagationPolicy may be set, but not both.
    */
    'orphanDependents'?: boolean;
    'preconditions'?: V1Preconditions;
    /**
    * Whether and how garbage collection will be performed. Either this field or OrphanDependents may be set, but not both. The default policy is decided by the existing finalizer set in the metadata.finalizers and the resource-specific default policy. Acceptable values are: \'Orphan\' - orphan the dependents; \'Background\' - allow the garbage collector to delete the dependents in the background; \'Foreground\' - a cascading policy that deletes all dependents in the foreground.
    */
    'propagationPolicy'?: string;

    static readonly discriminator: string | undefined = undefined;

    static readonly mapping: {[index: string]: string} | undefined = undefined;

    static readonly attributeTypeMap: Array<{name: string, baseName: string, type: string, format: string}> = [
        {
            "name": "apiVersion",
            "baseName": "apiVersion",
            "type": "string",
            "format": ""
        },
        {
            "name": "dryRun",
            "baseName": "dryRun",
            "type": "Array<string>",
            "format": ""
        },
        {
            "name": "gracePeriodSeconds",
            "baseName": "gracePeriodSeconds",
            "type": "number",
            "format": "int64"
        },
        {
            "name": "ignoreStoreReadErrorWithClusterBreakingPotential",
            "baseName": "ignoreStoreReadErrorWithClusterBreakingPotential",
            "type": "boolean",
            "format": ""
        },
        {
            "name": "kind",
            "baseName": "kind",
            "type": "string",
            "format": ""
        },
        {
            "name": "orphanDependents",
            "baseName": "orphanDependents",
            "type": "boolean",
            "format": ""
        },
        {
            "name": "preconditions",
            "baseName": "preconditions",
            "type": "V1Preconditions",
            "format": ""
        },
        {
            "name": "propagationPolicy",
            "baseName": "propagationPolicy",
            "type": "string",
            "format": ""
        }    ];

    static getAttributeTypeMap() {
        return V1DeleteOptions.attributeTypeMap;
    }

    public constructor() {
    }
}
