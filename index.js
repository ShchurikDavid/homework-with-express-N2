import express from 'express'
import moment from 'moment'

const app = express()

app.use(express.json())

const products = [
    { id: 1, name: 'Laptop', price: 1200, category: 'electronics' },
    { id: 2, name: 'Smartphone', price: 800, category: 'electronics' },
    { id: 3, name: 'Sofa', price: 500, category: 'furniture' },
    { id: 4, name: 'Armchair', price: 250, category: 'furniture' },
    { id: 5, name: 'Headphones', price: 150, category: 'electronics' }
]

const HOST = 'localhost'
const PORT = 3000

function addProduct(newProduct, fail = false) {
    return new Promise((resolve, reject) => {
        if (fail) {
            return reject(new Error('Failed to save product'))
        }

        const product = {
            name: newProduct.name,
            price: newProduct.price,
            category: newProduct.category,
            image: newProduct.image,
            id: products.length + 1
        }

        products.push(product)
        resolve(product)
    })
}

app.post('/products', async (req, res) => {
    const { name, price, category, image = '' } = req.body ?? {}

    if (
        typeof name !== 'string' || name.trim() === '' ||
        typeof price !== 'number' || price <= 0 ||
        typeof category !== 'string' || category.trim() === ''
    ) {
        return res.status(422).json({ message: 'Invalid product data' })
    }

    if (products.some(product => product.name === name)) {
        return res.status(409).json({ message: 'Conflict' })
    }

    try {
        const product = await addProduct({
            name,
            price,
            category,
            image
        }, req.query.fail === 'true')

        return res.status(201).json(product)
    } catch {
        return res.status(500).end()
    }
})

app.get('/products', (req, res) => {
    const { category, take } = req.query
    let result = products

    if (category) {
        result = result.filter(
            p => p.category === category.toLowerCase()
        )
    }
    if (take) {
        const limit = parseInt(take, 10)

        if (isNaN(limit) || limit <= 0) {
            return res.status(400).json({
                message: 'take must be a positive number'
            })
        }

        result = result.slice(0, limit)
    }
    res.status(200).json(result)
})

app.get('/products/:id', (req, res) => {
    const idParam = req.params.id
    const productId = parseInt(idParam, 10)

    if (isNaN(productId)) {
        return res.status(400).json({
            message: 'Invalid product ID format. ID must be a number.'
        })
    }

    const product = products.find(p => p.id === productId)

    if (!product) {
        return res.status(404).json({
            message: `Product with ID ${productId} not found.`
        })
    }

    res.status(200).json(product)
})

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok'
    })
})

app.get('/stats', (req, res) => {
    res.status(200).json({
        uptime: Math.floor(process.uptime()),
        nodeVersion: process.version,
        timestamp: moment()
    })
})

app.listen(PORT, HOST, () => {
    console.log(`http://${HOST}:${PORT}`)
})
