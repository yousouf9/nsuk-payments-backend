import {Schema, model, Model, HydratedDocument, Types}  from "mongoose";
import { mongoosePagination, Pagination } from "mongoose-paginate-ts";
import { Password } from "../services/Password";

interface BookI {
  author: string;
  title: string;
  category?: string;
  free?:boolean;
  image:string;
  content:string;
  addedBy:Types.ObjectId;
  description?:string;
  type:string
}

interface BookModel extends Model<BookI> {
  createBook(book:BookI): HydratedDocument<BookI>;
  findByEmail(email:string): Promise<HydratedDocument<BookI>>;
}


const bookSchema = new Schema<BookI, BookModel>({
  author:{
    type: String,
    required: [true, "author must be provided"]
  },
  title:{
    type: String,
    required: [true, "title must be provided"]
  },
  category:{
    type: String,
    required:false
  },
  free:{
    type: Boolean,
    required: false,
    default: false
  },
  image:{
     type: String,
     validate:{
      validator: function(value: string){
        return  /(https?:\/\/.*\.(?:png|jpg|jpeg|gif|png|svg))/i.test(value);
      },
      message: "Invalid Image format provided"
     },
     required:[true, "image url must be provided"]
     
  },
  content:{
    type: String,
    validate:{
     validator: function(value: string){
       return  /(https?:\/\/.*\.(?:pdf|avi|mpeg|mp4|ogg|webm))/i.test(value);
     },
     message: "Invalid pdf format provided"
    },
    required:false
  },
  addedBy:{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  "type":{
    type: String,
    enum:["pdf", "video"],
  },
  description:{
    type: String,
    required: false 
  }
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

bookSchema.statics.createBook = (book:BookI) =>{
  return new Book(book)
}

bookSchema.plugin(mongoosePagination);


const Book:Pagination<BookI> = model<BookI, Pagination<BookI>>("Book", bookSchema);

export {Book};

