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

import { V1Condition } from '../models/V1Condition.js';
import { HttpFile } from '../http/http.js';

/**
* ServiceCIDRStatus describes the current state of the ServiceCIDR.
*/
export class V1beta1ServiceCIDRStatus {
    /**
    * conditions holds an array of metav1.Condition that describe the state of the ServiceCIDR. Current service state
    */
    'conditions'?: Array<V1Condition>;

    static readonly discriminator: string | undefined = undefined;

    static readonly mapping: {[index: string]: string} | undefined = undefined;

    static readonly attributeTypeMap: Array<{name: string, baseName: string, type: string, format: string}> = [
        {
            "name": "conditions",
            "baseName": "conditions",
            "type": "Array<V1Condition>",
            "format": ""
        }    ];

    static getAttributeTypeMap() {
        return V1beta1ServiceCIDRStatus.attributeTypeMap;
    }

    public constructor() {
    }
}