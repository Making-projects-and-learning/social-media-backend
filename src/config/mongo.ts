/** Libraries */
import "dotenv/config";
import chalk from 'chalk';
import { connect, set } from "mongoose";

/** .env - variables */
const DB_URL = <string>process.env.DB_URL;

export const dbConnect = async (): Promise<void> => {

  try {

    await set("strictQuery", false)

    await connect(DB_URL)

    console.log(chalk.green('Online database'))

  } catch (error) {
    throw new Error(`${chalk.red.bold('Error connecting to the database')} \n ${error}`)
  }

}