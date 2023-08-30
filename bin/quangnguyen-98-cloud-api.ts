#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { ProductStack } from '../lib/product-stack'
import { getConfig } from '../lib/buildConfigs'

const app = new cdk.App()
const main = async () => {
    const buildConfig: any = await getConfig(app)
    const stackProps = {
        env: {
            region: buildConfig.AWSProfileRegion,
            account: buildConfig.AWSAccountID,
        },
    }

    new ProductStack(app, `ProductStack-${buildConfig.Environment}`, stackProps,buildConfig)
    app.synth()
}
main()
