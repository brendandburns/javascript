/**
 * Kubernetes
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: release-1.25
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { RequestFile } from './models';
import { V1Condition } from './v1Condition';

/**
* NetworkPolicyStatus describe the current state of the NetworkPolicy.
*/
export class V1NetworkPolicyStatus {
    /**
    * Conditions holds an array of metav1.Condition that describe the state of the NetworkPolicy. Current service state
    */
    'conditions'?: Array<V1Condition>;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "conditions",
            "baseName": "conditions",
            "type": "Array<V1Condition>"
        }    ];

    static getAttributeTypeMap() {
        return V1NetworkPolicyStatus.attributeTypeMap;
    }
}
