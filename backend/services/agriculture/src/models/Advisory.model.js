import mongoose from 'mongoose';

const advisorySchema = new mongoose.Schema({
    // Reference to Nexus request ID
    nexusRequestId: {
        type: String,
        required: true,
        index: true
    },
    citizenId: {
        type: String,
        required: true,
        index: true
    },
    citizenName: {
        type: String,
        required: true
    },
    citizenEmail: {
        type: String
    },
    cropType: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    landSize: {
        type: Number,
        required: true
    },
    problemDescription: {
        type: String,
        required: true
    },
    advisoryText: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['PENDING', 'ACCEPTED', 'REJECTED'],
        default: 'PENDING'
    },
    remarks: {
        type: String,
        default: ''
    },
    processedBy: {
        type: String,
        default: null
    },
    processedAt: {
        type: Date,
        default: null
    }
}, { timestamps: true });

const Advisory = mongoose.model('Advisory', advisorySchema);

export default Advisory;
