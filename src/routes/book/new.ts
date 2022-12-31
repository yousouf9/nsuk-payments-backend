import {Request, Response, Router} from 'express'
import {body} from 'express-validator';
import {Book} from '../../models/Book';
import multer from  'multer';
import {upload} from '../../middleware/multi-storage';
import { requireAuth } from '../../middleware/require-auth';
import { validateRequest } from '../../middleware/validate-request';
import { successResponse } from '../../helper/success-response';
import { BadRequestError } from '../../errors/bad-request-error';
import { error_codes } from '../../helper/util/error-codes';

const upload_BookStorage = multer.diskStorage(upload('public/books/book'))
const upload_Book = multer({storage:upload_BookStorage});

const router = Router()

router.post('/',
    requireAuth,
    [
    body('author')
      .isString()
      .trim()
      .withMessage('author must be provided'),
    body('free')
      .isBoolean()
      .withMessage('free status must be a boolean'),
    body('category')
      .isString()
      .trim()
      .withMessage('category must be providen'),
    body('addedBy')
      .isString()
      .trim()
      .withMessage('addedBy must be provided'),
    body('description')
      .isString()
      .trim()
      .withMessage('description must be provided'),
    body('title')
      .isString()
      .trim()
      .withMessage('title must be provided'),
    body('type')
      .isString()
      .trim()
      .withMessage('title must be provided'),
  ], 
  //validateRequest,
  upload_Book.fields([{name:'content', maxCount: 1},{name:'photo', maxCount: 1}]),
  async (req: Request, res:Response) => {

   const { 
           title, 
           author,
           free, 
           category,
           addedBy,
           description,
           type
        }  = req.body


  
  const oldbook = await  Book.findOne({
          title,

    })
   
  if(oldbook){
    throw new BadRequestError("Book title already exists", error_codes.Book_exist)
  }
        
      const files= req.files as  {[fieldname: string]: Express.Multer.File[]};

      const image =files['photo'][0].filename;
      const content =files['content'][0].filename;

      console.log(files['content']);
      

      //setting the name of the image
      req.body.image = `${req.protocol}://${req.headers.host}/books/book/${image}`;
      req.body.content = `${req.protocol}://${req.headers.host}/books/book/${content}`; 

  const book = new  Book({
        title,
        author,
        free,
        image:req.body.image,
        category,
        content:req.body.content,
        description,
        addedBy,
        type
  })
  await book.save();
  
  res.status(200).send(successResponse(book))
});





export default  router;