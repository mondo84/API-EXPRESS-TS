import { Request, Response } from 'express';

let indexWelcome = (req: Request, res: Response): Response => {
    return res.json('Welcome to my APII.');
}

// Exportacion de respuesta servidor.
export {indexWelcome};