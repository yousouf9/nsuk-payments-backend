import {Request, Response, Router} from 'express'
import {body, param} from 'express-validator';
import { NotFoundError } from '../../errors/not-found';
import { successResponse } from '../../helper/success-response';
import { requireAuth } from '../../middleware/require-auth';
import { validateRequest } from '../../middleware/validate-request';
import {Category} from '../../models/category';

const router = Router()

router.put('/:id',
    requireAuth,
    [
     body('title')
      .isString()
      .trim()
      .withMessage({message:'title must be provided'}),
    param("id")
      .isString()
      .trim()
      .withMessage({message:'id params must be provided'}),
  ], 
  validateRequest,
  async (req: Request, res:Response) => {

  const {id} = req.params;
   const { 
           title, 
        }  = req.body

  const category = await Category.findOne({_id: id});

  if(!category){
    throw new NotFoundError("Category not found")
  }

  category.set({title})
  await category.save();
  
  res.status(200).send(successResponse(category))
});


export default  router;