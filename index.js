const express = require('express');
const helmet = require('helmet');
const cloudinary = require('cloudinary').v2;
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const cluster = require('cluster');
const os = require('os');
const cookieParser = require("cookie-parser");
const http = require('http');

require('dotenv').config();

const numCPUs = os.cpus().length;

const { connectDatabase } = require('./config/db.config');
const { authRoutes } = require('./routes/auth.routes');
const { eventRoutes } = require('./routes/event.routes');
const { userRoutes } = require('./routes/user.routes');
const { authRqeuired } = require('./middleware/auth.middleware');

if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    cluster.fork();
  });

} else {
  const app = express();
  const port = process.env.PORT || 5003;

  const server = http.createServer(app);
  const corsOptions = {
    origin: [
      'https://aizaflab.retwho.com',
      'https://www.aizaflab.retwho.com',
      'http://localhost:8001',
    ],
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
    credentials: true
  };

  app.use(helmet());
  app.use(bodyParser.urlencoded({ extended: false, limit: '10mb' }));
  app.use(express.json({ limit: '10mb' }));
  app.use(cookieParser());

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10000,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  });

  app.use(limiter);
  app.use(cors(corsOptions));
  app.use("/uploads", express.static("uploads"));

  app.use('/auth', authRoutes);
  app.use('/user', authRqeuired, userRoutes);
  app.use('/event',authRqeuired, eventRoutes);

  const mongodb_uri = process.env.ENV !== 'dev' ? process.env.PROD_DB : process.env.DEV_DB;
  connectDatabase(mongodb_uri);

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  app.get('/', (req, res) => {
    res.send(`Hello from worker ${process.pid}`);
  });

  server.listen(port, () => {
    console.log(`Worker ${process.pid} is running on http://localhost:${port}`);
  });
}