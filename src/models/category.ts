import {Schema, model, Model, HydratedDocument}  from "mongoose";
import { Password } from "../services/Password";

interface CategoryI {
  title: string;
}

interface CategoryModel extends Model<CategoryI> {
  createCategory(book:CategoryI): HydratedDocument<CategoryI>;
}


const CategorySchema = new Schema<CategoryI, CategoryModel>({

  title:{
    type: String,
    required: [true, "title must be provided"]
  },
},
{ 
  timestamps:true,
  toJSON:{
    transform(doc, ret) {
      ret.id = ret._id
      delete ret._id
    },
  },
  versionKey:"version",
  optimisticConcurrency:true,
}
)

CategorySchema.statics.createCategory = (book:CategoryI) =>{
  return new Category(book)
}

const Category = model<CategoryI, CategoryModel>("Category", CategorySchema);

export {Category};

