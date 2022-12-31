import {Request, Response, Router} from 'express'
import {param} from 'express-validator';
import { NotFoundError } from '../../errors/not-found';
import { requireAuth } from '../../middleware/require-auth';
import {Book} from '../../models/Book';

const router = Router()

router.get('/:id',
    requireAuth,
    [
    param('id')
      .isString()
      .trim()
      .withMessage('id must be provided')
    ],
  async (req: Request, res:Response) => {

    const { id } = req.params

    const book =  await Book.findOne({_id: id})
    if(!book){
      throw new NotFoundError("Book not found")
    }

   res.status(200).send(book)
});





export default  router;