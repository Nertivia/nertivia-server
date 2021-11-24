import database from "../../database/database";
import { User } from "../interface/User";
import FlakeId from "@brecert/flakeid";
import bcrypt from "bcrypt";
import { randomLetterNumber } from "../utils/random";

const flake = new FlakeId({
  mid: 42,
  timeOffset: (2013 - 1970) * 31536000 * 1000,
});

export interface ReturnError {
  statusCode: number;
  message: string;
}

interface CreateUser {
  email: string;
  username: string;
  password: string;
}

// Creates an account and then returns the id.
export async function createUser(details: CreateUser) {
  const hashPassword = await bcrypt.hash(details.password, 10);
  const id = flake.gen().toString();

  return await database<User>("users")
    .insert({
      id,
      email: details.email,
      discriminator: randomLetterNumber(4),
      username: details.username,
      password: hashPassword,
      password_version: 0,
    })
    .returning("id")
    .then((createdIds) => {
      return createdIds[0];
    })
    .catch((err) => {
      if (err.code === "23505") {
        throw { statusCode: 403, message: "email already exists" };
      }
      throw {
        statusCode: 403,
        message: "Something went wrong when inserting to the database.",
        ...err
      };
    });
}

export async function getUser(id: string) {
  return database<User>("users")
    .where({ id })
    .select("id", "username", "discriminator")
    .first()
    .catch(err => {
      throw {
        statusCode: 403,
        message: "Something went wrong when getting from the database.",
        ...err
      };
    });
}
export async function getUserByTag(username: string, discriminator: string) {
  return database<User>("users")
    .where({ username, discriminator })
    .select("id", "username", "discriminator")
    .first()
    .catch(err => {
      throw {
        statusCode: 403,
        message: "Something went wrong when getting from the database.",
        ...err
      };
    });
}
export async function getUserAll(id: string) {
  return database<User>("users")
    .where({ id })
    .select("*")
    .first()
    .catch(err => {
      throw {
        statusCode: 403,
        message: "Something went wrong when inserting to the database.",
        ...err
      };
    });
}
export async function authenticateUser(email: string, password: string) {
  return database<User>("users")
    .where({ email })
    .select("password", "id", "password_version")
    .first()
    .then(async (user) => {
      if (!user) {
        throw { statusCode: 404, message: "Invalid email." };
      }
      const verifyPassword = await bcrypt.compare(password, user.password);
      if (!verifyPassword) {
        throw { statusCode: 403, message: "Invalid password" };
      }
      return user;
    })
    .catch(err => {
      throw {
        statusCode: 403,
        message: "Something went wrong when finding from the database.",
        ...err
      };
    });
}
