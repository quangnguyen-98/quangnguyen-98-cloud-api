import { Duration, Fn, Stack, StackProps } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { AuthorizationType, LambdaIntegration, RestApi, MethodLoggingLevel, ApiKeySourceType } from 'aws-cdk-lib/aws-apigateway'
import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs'
import { Runtime } from 'aws-cdk-lib/aws-lambda'
import { join } from 'path'
import corsOptions from './cors'
import {
    gatewayResponseOptions4XX,
    gatewayResponseOptions5XX,
    gatewayResponseOptionsAccessDenied,
    gatewayResponseOptionsThrottled,
    gatewayResponseOptionsUnauthorized,
} from './gateway_response'
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class ProductStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps, buildConfig?: any) {
        super(scope, id, props)

        const defaultLambdaFnProps: NodejsFunctionProps = {
            bundling: {
                externalModules: ['aws-sdk'],
                minify: true,
            },
            entry: join('src/index.ts'),
            environment: {
                ENVIRONMENT: buildConfig?.Environment || 'dev',
            },
            runtime: Runtime.NODEJS_16_X,
        }

        const getProductFn = new NodejsFunction(this, 'GetProductFn', {
            ...defaultLambdaFnProps,
            functionName: `${id}-GetProductFn`,
            handler: 'main',
            timeout: Duration.seconds(30),
            memorySize: 256,
        })

        const getProductIntegration: any = new LambdaIntegration(getProductFn)
        // const methodOptions: any = { authorizationType: AuthorizationType.CUSTOM }

        const restApi = new RestApi(this, id + '-Api', {
            deployOptions: {
                stageName: buildConfig?.Environment?.toLowerCase() || 'dev',
                metricsEnabled: true,
                loggingLevel: MethodLoggingLevel.INFO,
                dataTraceEnabled: true,
                tracingEnabled: true,
            },
            defaultCorsPreflightOptions: corsOptions,
            cloudWatchRole: true,
            // apiKeySourceType: ApiKeySourceType.AUTHORIZER,
        })

        restApi.addGatewayResponse(`${id}-denied`, gatewayResponseOptionsAccessDenied)
        restApi.addGatewayResponse(`${id}-unauthorized`, gatewayResponseOptionsUnauthorized)
        restApi.addGatewayResponse(`${id}-throttled`, gatewayResponseOptionsThrottled)
        restApi.addGatewayResponse(`${id}-default4xx`, gatewayResponseOptions4XX)
        restApi.addGatewayResponse(`${id}-default5xx`, gatewayResponseOptions5XX)

        const clover = restApi.root.addResource('product')
        clover.addResource('list').addMethod('GET', getProductIntegration)
    }
}
