import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { join, resolve } from 'path';
import { createClient } from 'redis';

const sub = createClient({
  url: `${process.env.REDIS_URL}/0`,
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
    const cachedUser = JSON.parse(cached_user);
    if (cached_user) {
      // req.user.id = parseInt(cachedUser.user);
      // req.user.isAdmin = cachedUser.is_admin;
      // req.user.role = cachedUser.role;
      req.user = cachedUser;
      req.resume();
      next();
      return;
    }
    // not needed
    // req.pause();
    await pub.publish('nodeLdjango-node', jwt_auth);
    await sub.subscribe('nodeLdjango-django', (message) => {
      const { user_id, is_admin, role, ttl = 500 } = JSON.parse(message);
      if (user_id) {
        console.log(`hello again ${user_id}`);
        req.user = {
          id: parseInt(user_id),
          isAdmin: is_admin,
          role: role,
        };
        // const userProps = { user, is_admin };
        // const userPropsJson = JSON.stringify(userProps);
        // cache.set(jwt_auth, userPropsJson);
        cache.set(jwt_auth, JSON.stringify(req.user));
        // console.log(userPropsJson);
        // cache.set(jwt_auth, user);
        cache.expire(jwt_auth, ttl);
        // req.resume();
        // next();
      } else {
        console.log('Please login first');
        req.user = null;
        // res.status(401).send('Please login first');
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
