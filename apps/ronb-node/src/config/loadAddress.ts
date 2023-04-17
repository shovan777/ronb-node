const fs = require('fs');
const csv = require('csv-parser');
const { Client } = require('pg');
const format = require('pg-format');
const path = require('path');
require('dotenv').config();

const BASE_DIR = path.join(__dirname, '..', '/common/csv');

const csvData = [
  {
    table_name: 'province',
    file_path: path.join(BASE_DIR, '/province.csv'),
  },
  {
    table_name: 'district',
    file_path: path.join(BASE_DIR, '/district.csv'),
  },
];

const dbConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
};

async function dataExists(client, obj, table_name) {
  const query = format(`SELECT * FROM ${table_name} WHERE name = %L`, obj.name);
  const res = await client.query(query);
  return res.rows.length > 0;
}

async function loadCsvData() {
  csvData.map((each) => {
    const data = [];

    fs.createReadStream(each.file_path)
      .pipe(csv())
      .on('data', (row) => {
        data.push(row);
      })
      .on('end', async () => {
        console.log(`CSV file for ${each.table_name} successfully processed.`);

        // Create a connection to the Postgres database
        const client = new Client(dbConfig);
        client.connect();

        // Check if data is already loaded in the database
        const objectsToInsert = [];

        for (const obj of data) {
          const exists = await dataExists(client, obj, each.table_name);
          if (!exists) {
            objectsToInsert.push(obj);
          } else {
            console.log(
              `Skipping data with name=${obj.name} as it already exists in the database.`,
            );
          }
        }

        // If no data needs to be inserted, log a message and end the database connection
        if (objectsToInsert.length === 0) {
          console.log(
            `All data in the CSV file already exists in the table ${each.table_name}. No data was inserted.`,
          );
          await client.end();
          return;
        }

        let query = null;

        // Execute an INSERT query for each object in the data array
        if (each.table_name == 'province') {
          const values = objectsToInsert.map((obj) => [obj.id, obj.name]);
          query = format('INSERT INTO province (id,name) VALUES %L', values);
        } else {
          const values = objectsToInsert.map((obj) => [
            obj.id,
            obj.name,
            obj.provinceId,
          ]);
          query = format(
            'INSERT INTO district (id,name,"provinceId") VALUES %L',
            values,
          );
        }

        try {
          const res = await client.query(query);
          console.log(
            `${res.rowCount} rows inserted successfully in the ${each.table_name} table.`,
          );
        } catch (err) {
          console.error(err);
        } finally {
          await client.end();
        }
      });
  });
}

loadCsvData();
