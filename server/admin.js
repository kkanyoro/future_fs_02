const bcrypt = require('bcryptjs');
const db = require('./config/db');

const seed = async () => {
    const password = '6002';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
        await db.execute(
            'INSERT INTO admins (username, email, password_hash) VALUES (?, ?, ?)',
            ['admin', 'admin@crm.com', hashedPassword]
        );
        console.log('Admin user created successfully!');
        process.exit();
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

seed();