const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.DB_CONNECTION);
        console.log(`DB connected ${connection.connection.host}`);
    } catch (error) {
        console.log(`DB error ${error}`);
    }
}

module.exports = connectDB;
