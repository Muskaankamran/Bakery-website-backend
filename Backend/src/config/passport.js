import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import userModel from "../models/users.model.js";

const googleAuthEnabled = Boolean(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
);

function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function findAvailableUsername(profile, email) {
    const baseUsername = (profile.displayName || email.split("@")[0])
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9._-]/g, "") || "bakery-customer";

    for (let suffix = 0; ; suffix += 1) {
        const username = suffix === 0 ? baseUsername : `${baseUsername}-${suffix}`;
        const existingUser = await userModel.findOne({
            username: { $regex: new RegExp(`^${escapeRegExp(username)}$`, "i") }
        });
        if (!existingUser) {
            return username;
        }
    }
}

if (googleAuthEnabled) {
    passport.use("google", new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL
                || "http://localhost:3000/api/auth/google/callback"
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails?.[0]?.value?.trim().toLowerCase();
                if (!email || profile.emails?.[0]?.verified !== true) {
                    return done(new Error("Google did not provide a verified email address"));
                }

                let user = await userModel.findOne({ googleId: profile.id });
                if (user) {
                    return done(null, user);
                }

                user = await userModel.findOne({
                    email: { $regex: new RegExp(`^${escapeRegExp(email)}$`, "i") }
                });
                if (user) {
                    if (user.googleId && user.googleId !== profile.id) {
                        return done(new Error("This email is already linked to another Google account"));
                    }
                    user.googleId = profile.id;
                    await user.save();
                    return done(null, user);
                }

                user = await userModel.create({
                    username: await findAvailableUsername(profile, email),
                    email,
                    googleId: profile.id,
                    role: "user"
                });
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    ));
}

export { googleAuthEnabled, passport };
