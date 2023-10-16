/**
 * Kubernetes
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * OpenAPI spec version: v1.22.2
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { HttpFile } from '../http/http';

/**
* WindowsSecurityContextOptions contain Windows-specific options and credentials.
*/
export class V1WindowsSecurityContextOptions {
    /**
    * GMSACredentialSpec is where the GMSA admission webhook (https://github.com/kubernetes-sigs/windows-gmsa) inlines the contents of the GMSA credential spec named by the GMSACredentialSpecName field.
    */
    'gmsaCredentialSpec'?: string;
    /**
    * GMSACredentialSpecName is the name of the GMSA credential spec to use.
    */
    'gmsaCredentialSpecName'?: string;
    /**
    * HostProcess determines if a container should be run as a \'Host Process\' container. This field is alpha-level and will only be honored by components that enable the WindowsHostProcessContainers feature flag. Setting this field without the feature flag will result in errors when validating the Pod. All of a Pod\'s containers must have the same effective HostProcess value (it is not allowed to have a mix of HostProcess containers and non-HostProcess containers).  In addition, if HostProcess is true then HostNetwork must also be set to true.
    */
    'hostProcess'?: boolean;
    /**
    * The UserName in Windows to run the entrypoint of the container process. Defaults to the user specified in image metadata if unspecified. May also be set in PodSecurityContext. If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence.
    */
    'runAsUserName'?: string;

    static readonly discriminator: string | undefined = undefined;

    static readonly attributeTypeMap: Array<{name: string, baseName: string, type: string, format: string}> = [
        {
            "name": "gmsaCredentialSpec",
            "baseName": "gmsaCredentialSpec",
            "type": "string",
            "format": ""
        },
        {
            "name": "gmsaCredentialSpecName",
            "baseName": "gmsaCredentialSpecName",
            "type": "string",
            "format": ""
        },
        {
            "name": "hostProcess",
            "baseName": "hostProcess",
            "type": "boolean",
            "format": ""
        },
        {
            "name": "runAsUserName",
            "baseName": "runAsUserName",
            "type": "string",
            "format": ""
        }    ];

    static getAttributeTypeMap() {
        return V1WindowsSecurityContextOptions.attributeTypeMap;
    }

    public constructor() {
    }
}
