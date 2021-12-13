import { Response } from "express";

interface StringOptions {
  max: number;
  min: number
  required?: boolean
}

type ErrorObj = {[key: string]: Error | any}

export class ValidateData {
  private data: { [key: string]: any; };
  errors: ErrorObj;

  constructor(data: {[key: string]: any}) {
    this.data = data;
    this.errors = {};
  }
  string(key: string, options: StringOptions) {
    const value = this.data[key];
    if (options.required && value === undefined) this.errors[key] = key + " is required.";
    if (value && typeof value !== "string") this.errors[key] = key + " is not a string.";
    if (value && options.max !== undefined && value.length > options.max) this.errors[key] = key + " is longer than " + options.max + " characters.";
    if (value && options.min !== undefined && value.length < options.min) this.errors[key] = key + " is shorter than " + options.min + " characters.";
    return this;
  }
  number(key: string, options: StringOptions) {
    const value = this.data[key];
    if (options.required && value === undefined) this.errors[key] = key + " is required.";
    if (value && typeof value !== "number") this.errors[key] = key + " is not a number.";
    if (value && options.max !== undefined && value > options.max) this.errors[key] = key + " must be less than " + options.max + ".";
    if (value && options.min !== undefined && value < options.min) this.errors[key] = key + " must be greater than " + options.min + ".";
    return this;
  }
  object(key: string, callback: (validate: ValidateData) => void) {
    const object = this.data[key];
    const validate = new ValidateData(object);
    callback(validate);
    const errors = validate.done();
    if (errors && Object.keys(errors).length) {
      this.errors[key] = errors;
    }
    return this;
  }
  done(res?: Response) {
    if (Object.keys(this.errors).length) {
      res?.status(400).json(this.errors);
      return this.errors;
    }
    return null;
  }

}