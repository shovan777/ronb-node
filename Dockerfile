#########################
# BUILD FOR LOCAL DEV
#########################
# This is the stage where we build the image for local development

# base image
FROM node:16-alpine As development

# create app directory
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure copying both package.json AND package-lock.json (when available).
# Copying this first prevents re-running npm install on every code change
COPY --chown=node:node package*.json ./

# Install app dependencies using the `npm ci` command instead of `npm install`
# use npm ci whenever u want to make sure u'r doing clean install of dependencies
RUN npm ci
# RUN npm install

# Bundle app source
COPY --chown=node:node . .

# Use the node user from the image (instead of the root user)
# This is to add security and prevent the user from running arbitrary commands
USER node

#############################
# BUILD FOR PRODUCTION
#############################
# This is the stage where we build the image for production

FROM node:16-alpine As build

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

# In order to run `npm run build` we need access to the Nest CLI which is a dev dependency. 
# In the previous development stage we ran `npm ci` which installed all dependencies, 
# so we can copy over the node_modules directory from the development image
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

# Run the build command which creates the production bundle
RUN npm run build

# Set NODE_ENV environment variable to production
ENV NODE_ENV production

# Running `npm ci` removes the existing node_modules directory and 
# passing in --only=production ensures that only the production dependencies are installed. 
# This ensures that the node_modules directory is as optimized as possible
RUN npm ci --only=production && npm cache clean --force

# Use the node user from the image (instead of the root user)
USER node



#############################
# PRODUCTION
#############################
# Copy only the required files from build and start server

FROM node:16-alpine As production


# Copy the bundled code from the build stage to the production image
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

# Start the server using the production build
CMD ["node", "dist/main.js"]