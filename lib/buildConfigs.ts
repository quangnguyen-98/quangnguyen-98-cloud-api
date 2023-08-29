import * as aws from 'aws-sdk'

export const toCapitalized = (word: string) => {
    return word.charAt(0).toUpperCase() + word.slice(1)
}

const ensureString = (object: { [name: string]: any }, propName: string): string => {
    if (!object[propName] || object[propName].trim().length === 0) throw new Error(propName + ' does not exist or is empty')

    return object[propName]
}

export const getConfig = async (app: any) => {
    const env = process.env.ENVIRONMENT || app.node.tryGetContext('config')
    if (!env) throw new Error('Context variable missing on CDK command. Pass in as `-c config=XXX`')

    // const awsProfile = process.env.AWS_PROFILE || app.node.tryGetContext('profile')
    // if (!awsProfile) throw new Error('Context variable missing on CDK command. Pass in as `-c profile=XXX`')

    const awsRegion = process.env.AWS_DEFAULT_REGION || app.node.tryGetContext('region')
    if (!awsRegion) throw new Error('Context variable missing on CDK command. Pass in as `-c region=XXX`')

    aws.config.update({
        region: awsRegion,
        // profile: awsProfile,
    })

    // const ssm = new aws.SSM()
    // const ssmParamName = 'rpay-configuration-' + env
    // console.log('### Getting config from SSM Parameter store with name: ' + ssmParamName)
    // const ssmResponse = await ssm.getParameter({ Name: ssmParamName }).promise()
    // console.log('### Got config!!')
    // const unparsedEnv: any = yaml.load(ssmResponse?.Parameter?.Value || '')
    const buildConfig: any = {
        Environment: env,

        // AWSAccountID: ensureString(unparsedEnv, 'AWSAccountID'),
        // AWSProfileName: ensureString(unparsedEnv, 'AWSProfileName'),
        // AWSProfileRegion: ensureString(unparsedEnv, 'AWSProfileRegion'),

        // App: ensureString(unparsedEnv, 'App'),
        // Version: ensureString(unparsedEnv, 'Version'),
        // Environment: toCapitalized(ensureString(unparsedEnv, 'Environment')),
        // Build: ensureString(unparsedEnv, 'Build'),

        // Parameters: {
        //     LambdaInsightsLayer: ensureString(unparsedEnv['Parameters'], 'LambdaInsightsLayer'),
        //     TenantPublicApiUrl: ensureString(unparsedEnv['Parameters'], 'TenantPublicApiUrl'),
        // },
    }

    return buildConfig
}
