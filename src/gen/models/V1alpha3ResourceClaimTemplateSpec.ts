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

import { V1ObjectMeta } from '../models/V1ObjectMeta.js';
import { V1alpha3ResourceClaimSpec } from '../models/V1alpha3ResourceClaimSpec.js';
import { HttpFile } from '../http/http.js';

/**
* ResourceClaimTemplateSpec contains the metadata and fields for a ResourceClaim.
*/
export class V1alpha3ResourceClaimTemplateSpec {
    'metadata'?: V1ObjectMeta;
    'spec': V1alpha3ResourceClaimSpec;

    static readonly discriminator: string | undefined = undefined;

    static readonly mapping: {[index: string]: string} | undefined = undefined;

    static readonly attributeTypeMap: Array<{name: string, baseName: string, type: string, format: string}> = [
        {
            "name": "metadata",
            "baseName": "metadata",
            "type": "V1ObjectMeta",
            "format": ""
        },
        {
            "name": "spec",
            "baseName": "spec",
            "type": "V1alpha3ResourceClaimSpec",
            "format": ""
        }    ];

    static getAttributeTypeMap() {
        return V1alpha3ResourceClaimTemplateSpec.attributeTypeMap;
    }

    public constructor() {
    }
}
