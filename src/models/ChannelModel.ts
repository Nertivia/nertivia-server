import { Schema, model } from 'mongoose';

export interface Channel {
  _id: string,
  id: string

  name: string;
  creator?: string;
  latestMessage?: string
  // Only used in DM Channels
  participants?: string[]

  createdAt: number
}

const schema = new Schema<Channel>({
  _id: { type : String },
  id: { type : String, required: true},

  name: String,
  creator: { type: 'String', ref: 'User' },
  latestMessage: { type: 'String', ref: 'Message' },
  participants: [{type: 'String', ref: 'User'}],

  createdAt: {type: Number,default: Date.now()}
});

schema.pre('save', function (next) {      
  if (this.isNew) {
    this._doc._id = this._doc.id;   
  }
  next();
});


const ChannelModel = model<Channel>('Channel', schema);


export default ChannelModel;