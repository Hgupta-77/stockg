const mongoose = require('mongoose');


const ShareSchema = new mongoose.Schema({
symbol: { type: String, required: true },
name: { type: String, required: true },
price: { type: Number, default: 0 },
sector: { type: String },
notes: { type: String },
color: { type: String },
owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });


module.exports = mongoose.model('Share', ShareSchema);