/**
 * Kubernetes
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * OpenAPI spec version: v1.32.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { V1ResourceHealth } from '../models/V1ResourceHealth.js';
import { HttpFile } from '../http/http.js';

/**
* ResourceStatus represents the status of a single resource allocated to a Pod.
*/
export class V1ResourceStatus {
    /**
    * Name of the resource. Must be unique within the pod and in case of non-DRA resource, match one of the resources from the pod spec. For DRA resources, the value must be \"claim:<claim_name>/<request>\". When this status is reported about a container, the \"claim_name\" and \"request\" must match one of the claims of this container.
    */
    'name': string;
    /**
    * List of unique resources health. Each element in the list contains an unique resource ID and its health. At a minimum, for the lifetime of a Pod, resource ID must uniquely identify the resource allocated to the Pod on the Node. If other Pod on the same Node reports the status with the same resource ID, it must be the same resource they share. See ResourceID type definition for a specific format it has in various use cases.
    */
    'resources'?: Array<V1ResourceHealth>;

    static readonly discriminator: string | undefined = undefined;

    static readonly mapping: {[index: string]: string} | undefined = undefined;

    static readonly attributeTypeMap: Array<{name: string, baseName: string, type: string, format: string}> = [
        {
            "name": "name",
            "baseName": "name",
            "type": "string",
            "format": ""
        },
        {
            "name": "resources",
            "baseName": "resources",
            "type": "Array<V1ResourceHealth>",
            "format": ""
        }    ];

    static getAttributeTypeMap() {
        return V1ResourceStatus.attributeTypeMap;
    }

    public constructor() {
    }
}