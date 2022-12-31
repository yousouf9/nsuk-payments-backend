import {Request, Response, Router} from 'express'
import {body} from 'express-validator';
import { BadRequestError } from '../../errors/bad-request-error';
import { successResponse } from '../../helper/success-response';
import { requireAuth } from '../../middleware/require-auth';
import { validateRequest } from '../../middleware/validate-request';
import {Category} from '../../models/category';

const router = Router()

router.post('/',
    requireAuth,
    [
     body('title')
      .isString()
      .trim()
      .not()
      .isEmpty()
      .withMessage({message:'title must be provided'}),
  ], 
  validateRequest,
  async (req: Request, res:Response) => {
   const { 
           title, 
        }  = req.body




 const category = await Category.findOne({title});

 if(category){
   throw new BadRequestError("category already exists")
 }

  const cat =  Category.createCategory({
        title,

  })
  await cat.save();

  
  
  res.status(201).send(successResponse(cat))
});


export default  router;