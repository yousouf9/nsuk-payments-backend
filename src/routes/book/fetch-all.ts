import {Request, Response, Router} from 'express'
import {param} from 'express-validator';
import { PaginationOptions } from 'mongoose-paginate-ts';
import {Book} from '../../models/Book';


const router = Router()

router.get('/',

  async (req: Request, res:Response) => {

    const {
      limit, 
      page,
      search,
      category,
      free,

    } = req.query


    const size = parseInt(limit as string, 10) ||  20;
    const currentPage = parseInt(page as string, 10) || 1;
    let query =  {};

    const premium = free === "true" ? true : false;
    

    if(search){
      let regex = new RegExp(search as string,'i');
      console.log(search, "heree", regex);
      query = { 
        $or: [ {author: regex },{description: regex}, {title: regex}, {free:premium}, {category: category} ]
      }
      console.log(query);
      
    }

    const options: PaginationOptions ={
        query,
        limit:size,
        page:currentPage,
        populate: {path:"addedBy", select:"email firstName lastName"}
    }

    const book =  await Book.paginate(options)

   res.status(200).send(book)
});





export default  router;