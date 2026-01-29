import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'db.json');

export const readData = () => {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data:', error);
    throw error;
  }
};

export const writeData = (data) => {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing data:', error);
    throw error;
  }
};

export const initializeDB = () => {
  try {
    if (!fs.existsSync(DB_PATH)) {
      const initialData = {
        polls: [],
        options: [],
        votes: []
      };
      writeData(initialData);
    }
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};
