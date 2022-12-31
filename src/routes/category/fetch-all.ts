import {Request, Response, Router} from 'express'
import {body, param} from 'express-validator';
import {Category} from '../../models/category';

const router = Router()

router.get('/',

  async (req: Request, res:Response) => {

  const {id} = req.params;

  const category = await Category.find();

  res.status(200).send(category)
});


export default  router;