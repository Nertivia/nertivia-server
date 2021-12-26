import { Schema, model } from 'mongoose';

export interface User {
  _id: string,
  id: string

  username: string;
  discriminator: string
  email: string;
  password: string;
  passwordVersion: number;

  avatar?: string;
  presence: number

  createdAt: number
}

const schema = new Schema<User>({
  _id: { type : String, required : true },
  id: { type : String},

  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  passwordVersion: { type: Number, required: true },
  discriminator: { type: String, required: true },
  
  avatar: String,
  presence: Number,

  createdAt: {type: Number,default: Date.now()}
});

schema.pre('save', function (next) {      
  if (this.isNew) {
    this._doc.id = this._id;      
  }
  next();
});


const UserModel = model<User>('User', schema);


export default UserModel;