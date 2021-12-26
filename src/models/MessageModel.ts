import { Schema, model } from 'mongoose';

export interface Message {
  _id: string;
  id: string;

  channel: string;

  content: string;
  creator: string;

  createdAt: number;
}

const schema = new Schema<Message>({
  _id: { type : String },
  id: { type : String, required : true},

  content: String,
  channel: { type: 'String', ref: 'channel' },
  creator: { type: 'String', ref: 'User' },

  createdAt: {type: Number,default: Date.now()}
});

schema.pre('save', function (next) {      
  if (this.isNew) {
    this._doc._id = this._doc.id;
  }
  next();
});


const MessageModel = model<Message>('Message', schema);


export default MessageModel;