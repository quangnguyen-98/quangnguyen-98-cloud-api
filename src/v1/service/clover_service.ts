// const ProductFns = {
//     getProduct: async (event: any, context: any, callback: any) => {
//         console.log('event', event)
//         console.log('context', context)
//         callback(null, {
//             statusCode: 200,
//             body: JSON.stringify({
//                 success: true,
//                 data: {
//                     name: 'quang',
//                     age: 12,
//                     env: process.env.ENVIRONMENT,
//                 },
//             }),
//         })
//     },
// }

// export const ProductService = {
//     getProduct: ProductFns.getProduct,
// }

export async function main(event: any) {
    console.log('event 👉111', event)

    return {
        body: JSON.stringify({
            success: true,
            data: {
                name: 'quang',
                age: 12,
                env: process.env.ENVIRONMENT,
            },
        }),
        statusCode: 200,
    }
}
