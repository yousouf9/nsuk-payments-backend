import {Request, Response, Router} from 'express'
import {body, param} from 'express-validator';
import { NotFoundError } from '../../errors/not-found';
import { successResponse } from '../../helper/success-response';
import { requireAuth } from '../../middleware/require-auth';
import { validateRequest } from '../../middleware/validate-request';
import {Category} from '../../models/category';

const router = Router()

router.delete('/:id',
    requireAuth,
    [
    param("id")
      .isString()
      .trim()
      .withMessage({message:'id params must be provided'}),
  ], 
  validateRequest,
  async (req: Request, res:Response) => {

  const {id} = req.params;

  const category = await Category.findOneAndDelete({_id: id});

  if(!category){
    throw new NotFoundError("category not found");
  }

  res.status(200).send(successResponse(category))
});


export default  router;