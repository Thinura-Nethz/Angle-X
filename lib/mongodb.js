const mongoose = require('mongoose');
const config = require('../config');
const EnvVar = require('./mongodbenv');

const defaultEnvVariables = [
    { key: 'ALIVE_IMG', value: 'https://raw.githubusercontent.com/Thinura-Nethz/bot-img/refs/heads/main/ChatGPT%20Image%20Jun%2013%2C%202025%2C%2004_35_42%20PM.png' },
    { key: 'ALIVE_MSG', value: 'Hello , AngleX is alive now!! And Ready to Assist You☺\n\n🥶𝐌𝐚𝐝𝐞 𝐛𝐲 Thinura_Nethz🥶' },
    { key: 'PREFIX', value: '.' },
    { key: 'AUTO_READ_STATUS',value: 'true'},
];

// MongoDB connection function
const connectDB = async () => {
    try {
        await mongoose.connect(config.MONGODB);
        console.log('🛜 MongoDB Connected ✅');

        // Check and create default environment variables
        for (const envVar of defaultEnvVariables) {
            const existingVar = await EnvVar.findOne({ key: envVar.key });

            if (!existingVar) {
                // Create new environment variable with default value
                await EnvVar.create(envVar);
                console.log(`➕ Created default env var: ${envVar.key}`);
            }
        }

    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
