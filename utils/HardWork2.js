/* eslint-disable arrow-parens */
/* eslint-disable no-use-before-define */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Queue = require('bull');
const moment = require('moment');

dotenv.config({ path: '../config.env' });

const receiveQueue = new Queue('HardWork2');
const { MongoClient, ObjectID } = require('mongodb');
const JobQueue = require('../models/jobQueueModel');
const Existence = require('../models/existenceModel');

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

// const compose = (f, g) => (...args) => f(g(...args));
// const taskRunner = (...fns) => fns.reduce(compose);

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log('DB connection successful for HardWork2!'));

receiveQueue.process(async (job, done) => {
  const doc = await JobQueue.findById(job.data.refId);
  const client = new MongoClient(DB);

  try {
    await client.connect();
    // console.log('HARD woRK 2 -STEP2', doc);
    const iterateThis = doc.searchResult;
    const involvedListArray = [];
    while (iterateThis.length > 0) {
      const targetItem = iterateThis.pop();
      console.log('targetItem:', targetItem);
      const result = await getEMAC(targetItem);
      involvedListArray.push(result);
    }
    const uniqueList = [...new Set(involvedListArray)];

    await updateJobQueue({
      client,
      refId: job.data.refId,
      uniqueList
    });
    console.log('UniqueList created: JobQueue _id  ', job.data.refId);
  } catch (err) {
    console.log(err);
  } finally {
    await client.close();
  }

  done();
});

async function updateJobQueue({ client, refId, uniqueList }) {
  await client
    .db('gp-practice')
    .collection('jobqueues')
    .updateOne(
      { _id: new ObjectID(refId) },
      { $set: { uniqueList, completedAt: moment().toISOString() } }
    );
}

async function getEMAC(oneItem) {
  console.log('oneItem:', oneItem);
  const result = await Existence.findById(oneItem);
  return result.eMAC;
}
