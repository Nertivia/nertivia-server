import database from "../../database/database";
import { User } from "../interface/User";
import FlakeId from "@brecert/flakeid";
import { hash } from "bcrypt";
const flake = new FlakeId({
  mid: 42,
  timeOffset: (2013 - 1970) * 31536000 * 1000,
});

interface CreateUser {
  email: string,
  username: string,
  password: string
}

// Creates an account and then returns the id.
export const createUser = async (details: CreateUser) => {
  const hashPassword = await hash(details.password, 10);
  const id = flake.gen().toString();
  return database<User>("users")
    .insert({
      id,
      email: details.email,
      username: details.username,
      password: hashPassword,
    })
    .returning("id")
    .then(([id]) => [id as string, null])
    .catch(err => {
      if (err.code === "23505") {
        return [null, 'Email already exists!']
      } 
      console.log(err)
      return [null, 'Error inserting user into database.']
    })

};
