import { Express } from "express";
import { Db, WithId, ObjectId } from "mongodb";
import passport, { session } from "passport";
import IUser from "./user";

import { Strategy as LocalStrategy } from "passport-local";
import { compare } from "bcrypt";

declare global {
    namespace Express {
        interface User extends WithId<IUser> {}
    }
}

// express authentication with passport

// function params: app: Express, db: Db
export default function (app: Express, db: Db) {

    if (!process.env.SESSION_SECRET) throw new Error("ENV: SESSION_SECRET is missing!");

    // passport authentication
    app.use(session(undefined));

    app.use(passport.initialize());
    app.use(passport.session());

    // user collection
    const userCollection = db.collection<IUser>("users");

    passport.use(new LocalStrategy({ usernameField: 'username' }, async (username, password, done) => {
        const user = await userCollection.findOne({ username });
        if (!user) {
            return done(null, false, { message: 'Login failed' });
        }

        if (await compare(user.password, password)) {
            return done(null, user);
        }

        if (user.permissionLevel === "locked") {
            return done(null, false, { message: 'Account locked' });
        };

        return done(null, false, { message: 'Login failed' });

    }));

    passport.serializeUser((user, done) => {

        if (user._id) {
            return done(null, user._id.toHexString());
        }

        return done("User has no id", null);

    });

    passport.deserializeUser(async (id: string, done) => {

        if (!/[a-f0-]{24}/.test(id)) {
            return done("Invalid id", null);
        }

        if (!ObjectId.isValid(id)) {
            return done("Invalid id", null);
        }

        const user = await userCollection.findOne({ _id: ObjectId.createFromHexString(id)})

        if (!user) {
            return done("User not found", null);
        }

        return done(null, user);

    });


    // login route
    app.post('/login', passport.authenticate('local', {
        successRedirect: '/admin',
        failureRedirect: '/login?failed=true',
    }));

    // logout route
    app.get('/logout', (req, res) => {
        req.logout((err: any) => {
            if (err) return res.status(500).send("Fehler beim Logout");
            res.redirect('/');
        });
    });
};