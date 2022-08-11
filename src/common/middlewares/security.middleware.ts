import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { join } from 'path';
import { createClient } from 'redis';

const sub = createClient({
  url: `${process.env.REDIS_URL}/2`,
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
  async use(req: any, res: Response, next: NextFunction) {
    // do something
    console.log('**********security middleware');
    const cookies = await req.cookies;
    console.log(`the cookies here: ${cookies}`);
    const jwt_auth = cookies.JWT;
    console.log(jwt_auth);
    if (!jwt_auth) {
      console.log('No jwt token');
      // res.status(401).send('Unauthorized');
      req.user = null;
      next();
      return;
    }
    await pub.publish('nodeLdjango-node', jwt_auth).then(() => {
      sub.subscribe('nodeLdjango-django', (message) => {
        const user_id = JSON.parse(message).user_id;
        if (user_id) {
          console.log(`hello again ${user_id}`);
          const user = user_id;
          req.user = user;
          // next();
        } else {
          console.log('Please login first');
          res.status(401).send('Please login first');
        }
        sub.unsubscribe('nodeLdjango-django').then(() => {
          console.log('unsubscribed from the channel');
        });
        next();
      });
    });

    // next();
  }
}
