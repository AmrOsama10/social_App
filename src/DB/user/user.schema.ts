import { Schema } from "mongoose";
import { IUser } from "../../utils/common/interface/index.js";
import { GENDER, SYS_ROLE, USER_AGENT } from "../../utils/common/enum/index.js";
;

export const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 3,
      maxLength: 20,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      minlength: 3,
      maxLength: 20,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required() {
        if (this.userAgent == USER_AGENT.googl) {
          return false;
        }
        return true;
      },
      minLength: 8,

    },
    phoneNumber: {
      type: String,
    },
    credentialUpdatedAt: Date,
    role: {
      type: String,
      enum: SYS_ROLE,
      default: SYS_ROLE.user,
    },
    gender: {
      type: String,
      enum: GENDER,
    },
    userAgent: {
      type: String,
      enum: USER_AGENT,
    },
    otp: { type: String },
    otpExpire: { type: Date },
    isVerify:{
      type:Boolean,
      default:false
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema
  .virtual("fullName")
  .get(function () {
    return this.firstName + " " + this.lastName;
  })
  .set(function (value: string) {
    const [fName, lName] = value.split(" ");
    this.firstName = fName as string;
    this.lastName = lName as string;
  });
