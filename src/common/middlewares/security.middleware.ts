import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { createClient } from 'redis';

const sub = createClient({
  url: 'redis://localhost:6379/2',
});
const pub = sub.duplicate();

(async (sub, pub) => {
  await pub.connect();
  await sub.connect();
})(sub, pub);
Promise.all([sub, pub])
  .then(() => {
    console.log('**********redis connected');
  })
  .catch((err) => {
    console.log('not connected');
    throw err;
  });

@Injectable()
export class SecurityMiddleware implements NestMiddleware {
  // use(cookieParser)
  //   use(cookieParser()
  use(req: Request, res: Response, next: NextFunction) {
    // do something
    console.log('*******hello from security middleware');
    const cookies = req.cookies;
    const jwt_auth = cookies.JWT;
    console.log(cookies);
    if (!jwt_auth) {
      console.log('No jwt token');
      res.status(401).send('Unauthorized');
      return;
    }


    next();
  }
}
