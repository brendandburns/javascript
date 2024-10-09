/**
 * Kubernetes
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * OpenAPI spec version: v1.30.1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { V1alpha2NamedResourcesRequest } from '../models/V1alpha2NamedResourcesRequest';
import { HttpFile } from '../http/http';

/**
* ResourceRequest is a request for resources from one particular driver.
*/
export class V1alpha2ResourceRequest {
    'namedResources'?: V1alpha2NamedResourcesRequest;
    /**
    * VendorParameters are arbitrary setup parameters for the requested resource. They are ignored while allocating a claim.
    */
    'vendorParameters'?: any;

    static readonly discriminator: string | undefined = undefined;

    static readonly attributeTypeMap: Array<{name: string, baseName: string, type: string, format: string}> = [
        {
            "name": "namedResources",
            "baseName": "namedResources",
            "type": "V1alpha2NamedResourcesRequest",
            "format": ""
        },
        {
            "name": "vendorParameters",
            "baseName": "vendorParameters",
            "type": "any",
            "format": ""
        }    ];

    static getAttributeTypeMap() {
        return V1alpha2ResourceRequest.attributeTypeMap;
    }

    public constructor() {
    }
}
