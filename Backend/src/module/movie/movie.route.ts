import express from 'express';
import * as MovieController from './movie.controller';
import {validate} from "../../middlewares/validate"
import { MovieSchema } from './movie.validation';

const router = express.Router();

router.post('/', validate(MovieSchema),MovieController.createMovie);
router.get('/', MovieController.getAllMovies);
router.get('/recommended', MovieController.getTopMovieByVotes);
router.get('/:id', MovieController.getMovieById);

export default router;