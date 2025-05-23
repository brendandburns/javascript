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

import { V2CrossVersionObjectReference } from '../models/V2CrossVersionObjectReference.js';
import { V2MetricIdentifier } from '../models/V2MetricIdentifier.js';
import { V2MetricValueStatus } from '../models/V2MetricValueStatus.js';
import { HttpFile } from '../http/http.js';

/**
* ObjectMetricStatus indicates the current value of a metric describing a kubernetes object (for example, hits-per-second on an Ingress object).
*/
export class V2ObjectMetricStatus {
    'current': V2MetricValueStatus;
    'describedObject': V2CrossVersionObjectReference;
    'metric': V2MetricIdentifier;

    static readonly discriminator: string | undefined = undefined;

    static readonly mapping: {[index: string]: string} | undefined = undefined;

    static readonly attributeTypeMap: Array<{name: string, baseName: string, type: string, format: string}> = [
        {
            "name": "current",
            "baseName": "current",
            "type": "V2MetricValueStatus",
            "format": ""
        },
        {
            "name": "describedObject",
            "baseName": "describedObject",
            "type": "V2CrossVersionObjectReference",
            "format": ""
        },
        {
            "name": "metric",
            "baseName": "metric",
            "type": "V2MetricIdentifier",
            "format": ""
        }    ];

    static getAttributeTypeMap() {
        return V2ObjectMetricStatus.attributeTypeMap;
    }

    public constructor() {
    }
}
