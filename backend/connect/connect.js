const mongoose = require('mongoose')

const connectDB = async (url) => {
    try {
        // Add explicit options to improve TLS/connection behavior.
        // tlsAllowInvalidCertificates is set to false in production; set true only for local debugging if needed.
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000,
            // tls: true,
            // tlsAllowInvalidCertificates: false,
        };

        await mongoose.connect(url, options);
        console.log('connected to mongodb')
    } catch (error) {
        console.error('MongoDB connection error:', error.message || error);
        throw error;
    }
}

module.exports = connectDB