import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { join, resolve } from 'path';
import { createClient } from 'redis';

const sub = createClient({
  url: `${process.env.REDIS_URL}/2`,
});
const pub = sub.duplicate();
const cache = sub.duplicate();

(async (sub, pub, cache) => {
  await pub.connect();
  await sub.connect();
  await cache.connect();
})(sub, pub, cache);
Promise.all([sub, pub, cache])
  .then(() => {
    console.log('**********redis connected');
  })
  .catch((err) => {
    console.log('not connected');
    throw err;
  });

const sleep = (sec) =>
  new Promise((resolve) => setTimeout(resolve, sec * 1000));

@Injectable()
export class SecurityMiddleware implements NestMiddleware {
  // use(cookieParser)
  //   use(cookieParser()
  async use(req: any, res: Response, next: NextFunction) {
    // do something
    req.pause();
    // console.log('**********security middleware');
    const cookies = await req.cookies;
    // console.log(`the cookies here: ${cookies.JWT}`);
    const jwt_auth = cookies.JWT;
    console.log(jwt_auth);
    if (!jwt_auth) {
      console.log('No jwt token');
      // res.status(401).send('Unauthorized');
      req.user = null;
      req.resume();
      next();
      return;
    }
    // TODO: GET user for cache if exists
    const cached_user = await cache.get(jwt_auth);
    if (cached_user) {
      req.user = cached_user;
      req.resume();
      next();
      return;
    }
    // req.pause();
    await pub.publish('nodeLdjango-node', jwt_auth);
    await sub.subscribe('nodeLdjango-django', (message) => {
      const user_id = JSON.parse(message).user_id;
      if (user_id) {
        // console.log(`hello again ${user_id}`);
        const user = user_id;
        req.user = user;
        cache.set(jwt_auth, user);
        // req.resume();
        // next();
        // TODO: cache the user to redis
      } else {
        console.log('Please login first');
        res.status(401).send('Please login first');
      }
      // next();
      sub.unsubscribe('nodeLdjango-django').then(() => {
        // console.log('unsubscribed from the channel');
      });
      // req.resume();
      // next();
    });
    // while (!truth) {
    //   // console.log(`waiting for the message ${truth}`);
    // }
    await sleep(0.5);
    req.resume();
    next();
  }
}
