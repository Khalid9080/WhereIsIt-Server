require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 5000;
const app = express();
const cookieParser = require('cookie-parser');

// id - WhereIsIt
// pass - z8nIHG58qsVdEXag
const corsOptions = {
  origin: ["http://localhost:5173",
    "https://whereisit-697aa.web.app",
    "https://whereisit-697aa.firebaseapp.com",
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// jwt verifytoken
const verifyToken = async (req, res, next) => {
  const token = req.cookies?.token;

  // verify
  if (!token) return res.status(401).send({ message: 'Unauthorized Access' });
  console.log("No token found, unauthorized access");
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: 'Unauthorized Access' });
    }
    req.User = decoded;
    next()
  });

  console.log(token);

}


// const verifyToken = async (req, res, next) => {
//   const token = req.cookies?.token;

//   if (!token) {
//     console.log("No token found, unauthorized access");
//     return res.status(401).send({ message: 'Unauthorized Access' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.User = decoded;
//     console.log("Token verified, user decoded: ", decoded);
//     next();
//   } catch (err) {
//     console.log("Token verification failed");
//     return res.status(401).send({ message: 'Unauthorized Access' });
//   }
// }


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fqi16.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});




async function run() {
  try {

    // generate jwt token 
    app.post('/jwt', (req, res) => {
      const email = req.body;
      const token = jwt.sign(email, process.env.JWT_SECRET, { expiresIn: '1d' });
      console.log(token);
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      }).send({ success: true });
    });

    // jwt logout - clear cookie from server
    app.get('/logout', async (req, res) => {
      res.clearCookie('token', {
        maxAge: 0,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      }).send({ success: true });
    });



    //DB
    // const db=client.db("WhereIsIt");
    // const Add_Lost_Found_collection = db.collection("add_lostFound");
    const Add_Lost_Found_collection = client.db("WhereIsIt").collection("add_lostFound");
    const RecoveredItems_collection = client.db("WhereIsIt").collection("RecoveredItems");



    //Add lost found 
    app.post('/add-LostFound', async (req, res) => {
      const LostFoundData = req.body;
      const result = await Add_Lost_Found_collection.insertOne(LostFoundData);
      console.log(result);
      res.send(result);
    });

    // Get lost found
    app.get('/Get-All-lostFound', async (req, res) => {
      const result = await Add_Lost_Found_collection.find({}).toArray();
      res.send(result);
    });

    //  for home page
    app.get('/Get-Allhome-lostFound', async (req, res) => {
      const result = await Add_Lost_Found_collection.find({})
        .sort({ date: -1 }) // Sort by date in descending order (most recent first)
        .limit(6)  // Limit the result to 6 items
        .toArray();
      res.send(result);
    });


    // post edit lost found
    // app.get('/Get-All-lostFound/:id', async (req, res) => {
    //     const result = await Add_Lost_Found_collection.find({}).toArray();
    //     res.send(result);
    // });
    app.get('/Get-All-lostFound', async (req, res) => {
      const result = await Add_Lost_Found_collection.find({}).toArray();
      res.send(result);
    });

    // Get Manage my (Item - with email) : 
    app.get('/Get-All-lostFound/:email', verifyToken, async (req, res) => {
      const decodedEmail = req.User?.email;
      const email = req.params.email;
      console.log(req.WhereIsIt);
      console.log('Email from token->', decodedEmail);
      console.log('Email from params->', email);

      if (decodedEmail !== email)
        return res.status(401).send({ message: 'Unauthorized Access' });



      const query = { email: email };
      const result = await Add_Lost_Found_collection.find(query).toArray();
      res.send(result);
    });



    // app.get('/Get-All-lostFound/:email', verifyToken, async (req, res) => {
    //   const decodedEmail = req.User?.email; // From the token
    //   const emailFromParams = req.params.email; // From the URL param

    //   console.log('Decoded email from token:', decodedEmail);
    //   console.log('Email from route params:', emailFromParams);

    //   if (decodedEmail !== emailFromParams) {
    //     return res.status(401).send({ message: 'Unauthorized Access' });
    //   }

    //   const query = { email: emailFromParams };
    //   const result = await Add_Lost_Found_collection.find(query).toArray();
    //   res.send(result);
    // });

    // Delete a job from db
    app.delete('/delete-lostFound/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await Add_Lost_Found_collection.deleteOne(query);
      res.send(result);
    });


    // Get-Update Data a from db
    app.get('/updateItems/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await Add_Lost_Found_collection.findOne(query);
      res.send(result);
    });


    app.put('/update-Items/:id', async (req, res) => {
      const id = req.params.id;
      const LostFoundData = req.body;
      const updated = { $set: LostFoundData };
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const result = await Add_Lost_Found_collection.updateOne(query, updated, options);
      console.log(result);
      res.send(result);
    });

    app.put('/mark-as-recovered/:id', async (req, res) => {
      const id = req.params.id;
      const { recoveredLocation, recoveredDate } = req.body;

      // Check if the item is already marked as "recovered"
      const existingItem = await Add_Lost_Found_collection.findOne({ _id: new ObjectId(id) });

      if (existingItem && existingItem.status === "recovered") {
        return res.status(400).send({ message: "Item has already been marked as recovered" });
      }

      // Insert recovered item into RecoveredItems collection
      const recoveredItem = {
        itemId: new ObjectId(id),
        recoveredLocation,
        recoveredDate,
        recoveredBy: req.body.recoveredBy, // You can pass user info to track who marked it
        date: new Date(),
      };

      const result = await RecoveredItems_collection.insertOne(recoveredItem);

      // Update the status of the item in the LostFound collection to "recovered"
      const updateResult = await Add_Lost_Found_collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { status: "recovered" } }
      );

      res.send({ message: "The Item marked as recovered", result, updateResult });
    });

    // Fetch all recovered items
    app.get('/get-all-recovered-items', async (req, res) => {
      try {
        const result = await RecoveredItems_collection.find({}).toArray();
        res.send(result);
      } catch (error) {
        console.log("Error fetching recovered items:", error);
        res.status(500).send("Server Error");
      }
    });


    // Search items in Lost Found collection page
    app.get('/search-items', async (req, res) => {
      const search = req.query.search;
      const query = { title: { $regex: search, $options: 'i' } };
      const result = await Add_Lost_Found_collection.find(query).toArray();
      res.send(result);
    });









    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    //console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello Wher is it ?');
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});