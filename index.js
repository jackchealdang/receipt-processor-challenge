import Fastify from 'fastify'

const fastify = Fastify({
    logger: true
})

fastify.addSchema({
    $id: 'item',
    type: 'object',
    required: ['shortDescription', 'price'],
    properties: {
        shortDescription: {type: 'string'},
        price: {type: 'string'}
    }
})

const receiptSchema = {
    type: 'object',
    required: ['retailer','purchaseDate','purchaseTime','items','total'],
    properties: {
        retailer: {type: 'string'},
        purchaseDate: {type: 'string'},
        purchaseTime: {type: 'string'},
        items: {
            type: 'array',
            minItems: 1,
            items: {
                $ref: 'item#',
            }
        },
        total: {type: 'string'}
    }
}

const schema = {
    body: receiptSchema
}

let receipts = {}

// Declare routes
fastify.post('/receipts/process', { schema }, (request, reply) => {
    const id = crypto.randomUUID()
    receipts[id] = request.body
    return {"id": id}
})

fastify.get('/receipts/:id/points', (request, reply) => {
    return {"points": calculatePoints(receipts[request.params.id])}
})

// Start server
fastify.listen({port: 3000}, async (err, address) => {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
    fastify.log.info(`Server listening at ${address}`)
})

function calculatePoints(receipt)
{
    let points = 0

    // calculate alphanumeric characters
    for (const c of receipt["retailer"]) {
        if (c.match(/[0-9a-zA-Z]/)) {
            points += 1
        }
    }

    const total = parseFloat(receipt["total"])

    // calculate total is round dollar
    if (Number.isInteger(total)) {
        points += 50
    }

    // calculate total is multiple of 0.25
    if (total % 0.25 === 0) {
        points += 25
    }

    // calculate every two items
    points += Math.floor(receipt["items"].length / 2) * 5

    // calculate and add item price
    for (let i of receipt["items"]) {
        const desc = i["shortDescription"]
        const price = parseFloat(i["price"])
        const descLength = desc.trim().length

        if (descLength % 3 === 0) {
            points += Math.ceil(price * 0.2)
        }
    }

    // calculate odd purchase date
    const date = new Date(receipt["purchaseDate"])
    if (date.getDate() % 2 == 1) {
        points += 6
    }

    // calculate time between 2:00 PM and 4:00 PM
    const [hours, minutes] = receipt["purchaseTime"].split(":").map(Number)
    // convert hours into minutes of the day
    const startTime = 14 * 60 // 2:00 PM
    const endTime = 16 * 60
    const currTime = hours * 60 + minutes
    if (startTime < currTime < endTime) {
        points += 10
    }

    return points
}