import mongoose from 'mongoose';
const itemSchema = mongoose.Schema({
    title: String,
    image: String,
    description:String,
    price:Number,
    quantity:Number,
    supplier:String
}, { timestamps: true })

const Item = mongoose.model('Item', itemSchema);

export const getItems = async (req, res) => {
    console.log('get items')
    try {
        const item = await Item.find()
        res.status(200).json(item);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}
export const createItem = async (req, res) => {
    const item = new Item(req.body);
    try {
        await item.save();
        res.status(201).json(item);
    } catch (error) {
    }
}