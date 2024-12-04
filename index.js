import Fastify from 'fastify'

const fastify = Fastify({
    logger: true
})

const receiptSchema = {
    type: 'object',
    required: ['retailer','purchaseDate','purchaseTime','items','total'],
    properties: {
        retailer: {type: 'string'},
        purchaseDate: {type: 'string'},
        purchaseTime: {type: 'string'},
        items: {type: 'array'},
        total: {type: 'string'}
    }
}

const schema = {
    body: receiptSchema
}

let receipts = {}

fastify.post('/receipts/process', { schema }, (request, reply) => {
    const id = crypto.randomUUID()
    receipts[id] = receiptSchema
    return {
        "id": id
    }
})

fastify.get('/receipts/:id/points', (reply, request) => {
    return calculatePoints(request.params.id)
})

function calculatePoints(id)
{
    let points = 0

    return points
}