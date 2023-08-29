import corsOptions from './cors'
import { GatewayResponseOptions, ResponseType } from 'aws-cdk-lib/aws-apigateway'

const responseHeaders = {
    'Access-Control-Allow-Origin': "'*'",
    'Access-Control-Allow-Headers': "'*'",
    'Access-Control-Allow-Credentials': "'true'",
    'Content-Type': "'application/json'",
    'Access-Control-Allow-Methods': `'${corsOptions.allowMethods.join(',')}'`,
}

export const gatewayResponseOptions4XX: GatewayResponseOptions = {
    type: ResponseType.DEFAULT_4XX,
    responseHeaders,
}

export const gatewayResponseOptions5XX: GatewayResponseOptions = {
    type: ResponseType.DEFAULT_5XX,
    responseHeaders,
}

export const gatewayResponseOptionsAccessDenied: GatewayResponseOptions = {
    type: ResponseType.ACCESS_DENIED,
    templates: {
        'application/json': `{
            "success": false,
            "message": $context.error.messageString,
            "messageKey": "$context.authorizer.messageKey",
            "details": ["$context.authorizer.message"]
        }`,
    },
    responseHeaders,
}

export const gatewayResponseOptionsUnauthorized: GatewayResponseOptions = {
    type: ResponseType.UNAUTHORIZED,
    templates: {
        'application/json': `{
            "success": false,
            "message": $context.error.messageString,
            "messageKey": "MissingAuthorizerOrXTenantId",
            "details": ["Missing authorizer or x-tenant-id headers"]
        }`,
    },
    responseHeaders,
}

export const gatewayResponseOptionsThrottled: GatewayResponseOptions = {
    type: ResponseType.THROTTLED,
    templates: {
        'application/json': `{
            "success": false,
            "message": $context.error.messageString,
            "messageKey": "TooManyRequest"",
            "details": ["Too many request"]
        }`,
    },
    responseHeaders,
}
