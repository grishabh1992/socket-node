
import mongoose = require("mongoose");
export interface UserModel extends mongoose.Document {
  fullName?: string;
  gender?: string;
  profile?: string;
  sockets?: string[];
}