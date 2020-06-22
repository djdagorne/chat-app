import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

/* setting up user object for our db */
/* two types of users, used for API/db validation later */
export const USER_TYPES = {
  CONSUMER: "consumer",
  SUPPORT: "support",
};

/* telling mongoose what a single document in our users collection will look like  */
// timestamp:true gives our object automatic createdAt and updatedAt values
// collection: "users" names a group of the objects we just declared to mongoose
const userSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => uuidv4().replace(/\-/g, ""),
    },
    firstName: String,
    lastName: String,
    type: String,
  },
  {
    timestamp: true,
    collection: "users",
  }
);

/* now we are adding a static method to our userSchema for User */
userSchema.statics.createUser = async function (firstName, lastName, type) {
  /* no arrow functions or we lose 'this.' context */
  try {
    const user = await this.create({ firstName, lastName, type });
    return user;
  } catch (error) {
    throw error;
  }
};
userSchema.statics.getUserById = async function (id) {
  /* no arrow functions or we lose 'this.' context */
  try {
    const user = await this.findOne({ _id: id });
    if (!user) {
      throw { error: `No user with this id found.` };
    }
    return user;
  } catch (error) {
    throw error;
  }
};
userSchema.statics.getUsers = async function () {
  try {
    const users = await this.find();
    return users;
  } catch (error) {
    throw error;
  }
};
userSchema.statics.deleteByUserById = async function (id) {
  try {
    const result = await this.remove({ _id: id });
    return result;
  } catch (error) {
    throw error;
  }
};
userSchema.statics.getUserByIds = async function (ids) {
  try {
    // $in selects first document that matches any value in the array given
    const users = await this.find({ _id: { $id: ids } });
    return users;
  } catch (error) {
    throw error;
  }
};

/* As we export with .model we give our document object a name User and link it to our schema above */
export default mongoose.model("User", userSchema);
