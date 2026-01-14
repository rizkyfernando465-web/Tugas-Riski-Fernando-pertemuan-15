const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const sequelize = require('./config/database');
const User = require('./models/user');
const Item = require('./models/item'); 
const authRoutes = require('./routes/authRoutes');
const itemRoutes = require('./routes/itemRoutes');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));

// Routes
app.use('/', authRoutes);
app.use('/items', itemRoutes);
app.get('/', (req, res) => res.redirect('/items')); // Redirect root ke items

// Sync Database & Seed Dummy Users
sequelize.sync({ force: false }).then(async () => {
    console.log('Database synced');
    
    // Cek apakah user sudah ada, jika belum buat dummy data 
    const count = await User.count();
    if (count === 0) {
        await User.bulkCreate([
            { username: 'user1', password: 'pass1', role: 'manager' }, // [cite: 14]
            { username: 'user2', password: 'pass2', role: 'admin' }    // [cite: 15]
        ]);
        console.log('Dummy users created: user1 (manager), user2 (admin)');
    }
    
    app.listen(3000, () => {
        console.log('Server running on http://localhost:3000');
    });
}).catch(err => console.log(err));