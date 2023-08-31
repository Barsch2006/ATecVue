# ATec-Website

The Website of the ATec of the GRB. It is implemented in Vue and with Vuetify in the frontend and with MongoDB and Express in the backend.
Tested on Node 18.x

## use

1. install the latest node version
2. install mongodb and mongosh
3. run `npm run build` in both folders
4. create a new folder and copy the content of the `lib` folder in the `backend` in it
5. create a new folder `public` in this new folder and copy the content of `dist` (`frontend`) in it
6. create a `.env` file like:

```env
DISCORD_TOKEN = <Discord-Bot-Token>
DISCORD_APPLICATION_ID = <Application-Bot-Token>
DISCORD_DEFAULT_CHANNEL = <Discord-Channel-ID>
DISCORD_EVENT_CHANNEL = <Discord-Channel-ID>
DISCORD_REMINDER_CHANNEL = <Discord-Channel-ID>
PORT = <PORT>
DB_URL = <DB-URL>
DB_NAME = <DB-Name>
SESSION_SECRET = bar
JWT_SECRET = foo
PUBLIC_DIR = <path_to_public_dir>
```

7. insert an admin with mongosh into the `users` collection. like `insertOne( username: "admin", permissionLevel: "admin", password: <bycrypt-hash-10-rounds>, contactAdress: <email-adress>,})`
8. copy the package.json and install all node-modules
9. run your server
10. login with your created account

## usertypes

The user types extend eachother, a user < technician < admin.
"locked" is a special case.

### user

- Change Password
- create new event

### technician

- view events
- participate on them on the discord server

### admin

- manage users
- delete events

### locked

The user exists, but can't login (blocked). No rights

## features

### Webpage

- create a new event
- view events
- manage users

### Discord Bot

- /register Register own account.
- /userinfo return the contactAdress of a user
- Send msg on new event
- Participate on events.
