
import mongoose = require("mongoose");
export interface UserModel extends mongoose.Document {
  _id?: string;
  fullName?: string;
  gender?: string;
  profile?: string;
  sockets?: string[];
}