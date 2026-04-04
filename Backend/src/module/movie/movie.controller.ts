import { Request, Response, NextFunction } from "express";
import * as MovieService from "./movie.service";

// 1. createMovie
export const createMovie = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const movie = await MovieService.createMovie(req.body);
    res.status(201).json({ movie });
  } catch (error) {
    next(error);
  }
};

// 2. getAllMovies
export const getAllMovies = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const movies = await MovieService.getAllMovies();
    res.status(200).json({ movies });
  } catch (error) {
    next(error);
  }
};

// 3. getMovieById
export const getMovieById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const movie = await MovieService.getMovieById(req.params.id);
    res.status(200).json({ movie });
  } catch (error) {
    next(error);
  }
};

// 4. getTopMovieByVotes
export const getTopMovieByVotes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const movies = await MovieService.getTopMovieByVotes(Number(req.params.limit));
    res.status(200).json({ movies });
  } catch (error) {
    next(error);
  }
};