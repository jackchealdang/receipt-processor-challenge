import Fastify from 'fastify'

const fastify = Fastify({
    logger: true
})

// Declare and add Schemas
// Item schema
fastify.addSchema({
    $id: 'Item',
    type: 'object',
    required: ['shortDescription', 'price'],
    properties: {
        shortDescription: {type: 'string'},
        price: {type: 'string'}
    }
})

// Receipt schema
fastify.addSchema({
    $id: 'Receipt',
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
                $ref: 'Item#',
            }
        },
        total: {type: 'string'}
    }
})

// Body schema
const schema = {
    body: {
        $ref: 'Receipt#',
    }
}

// Store processed Receipts for current session
let receipts = {}

// Declare routes
// Process Receipt
fastify.post('/receipts/process', { schema }, (request, reply) => {
    const id = crypto.randomUUID()
    receipts[id] = request.body
    // TODO: move calculating points into process endpoint
    // TODO: add error handling to both endpoints
    receipts[id]["points"] = calculatePoints(request.body)
    return {"id": id}
})

// Calculate Points for Receipt
fastify.get('/receipts/:id/points', (request, reply) => {
    return {"points": receipts[id]["points"]}
})

// Start server
fastify.listen({port: 3000}, async (err, address) => {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
    fastify.log.info(`Server listening at ${address}`)
})

// Calculate points
function calculatePoints(receipt)
{
    let points = 0

    // Add points alphanumeric characters
    for (const c of receipt["retailer"]) {
        if (c.match(/[0-9a-zA-Z]/)) {
            points += 1
        }
    }

    const total = parseFloat(receipt["total"])

    // Add points if total is a round dollar amount
    if (Number.isInteger(total)) {
        points += 50
    }

    // Add points if total is multiple of 0.25
    if (total % 0.25 === 0) {
        points += 25
    }

    // Add points for every two items 
    points += Math.floor(receipt["items"].length / 2) * 5

    // Add points if trimmed item description
    // is a multiple of 3
    for (let i of receipt["items"]) {
        const desc = i["shortDescription"]
        const price = parseFloat(i["price"])
        const descLength = desc.trim().length

        if (descLength % 3 === 0) {
            points += Math.ceil(price * 0.2)
        }
    }

    // Add points if purchase date is odd
    const [YYYY, MM, DD] = receipt["purchaseDate"].split("-")
    if (DD % 2 == 1) {
        points += 6
    }

    // Add points if purchase time is between 2:00 PM and 4:00 PM
    const [hours, minutes] = receipt["purchaseTime"].split(":").map(Number)
    // Convert hours into minutes of the day
    const startTime = 14 * 60 // 2:00 PM
    const endTime = 16 * 60 // 4:00 PM
    const currTime = hours * 60 + minutes // Current time in minutes
    if (startTime < currTime < endTime) {
        points += 10
    }

    return points
}