import {dbConnection, closeConnection} from '../config/mongoConnection.js';
import {employees, employers} from '../config/mongoCollections.js';
import {v4 as uuid} from 'uuid';

const main = async () => {
  const db = await dbConnection();
  await db.dropDatabase();
  const employeeCollection = await employees();
  const employerCollection = await employers();

  await employeeCollection.insertMany([
    //filler employee data
    {
      _id: uuid(),
      firstName: 'Patrick',
      lastName: 'Hill',
      employerId: 1
    },
    {
      _id: uuid(),
      firstName: 'Jimi',
      lastName: 'Hendrix',
      employerId: 1
    },
    {
      _id: uuid(),
      firstName: 'Jim',
      lastName: 'Morrison',
      employerId: 2
    },
    {
      _id: uuid(),
      firstName: 'Roger',
      lastName: 'Waters',
      employerId: 1
    },
    {
      _id: uuid(),
      firstName: 'John',
      lastName: 'Smith',
      employerId: 2
    }
  ]);

  await employerCollection.insertMany([
    //filler employer data
    {
      _id: 1,
      name: 'Stevens Institute of Technology'
    },
    {
      _id: 2,
      name: 'Google'
    },
    {
      _id: 3,
      name: 'Apple'
    }
  ]);

  console.log('Done seeding database');
  await closeConnection();
};

main().catch(console.log);
