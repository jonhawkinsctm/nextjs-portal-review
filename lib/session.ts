import RedisStoreFactory from 'connect-redis';
import Redis from 'ioredis';
import { GetServerSidePropsContext } from 'next';
import nextSession from 'next-session';
import { expressSession, promisifyStore } from 'next-session/lib/compat';
import { ValidationErrors } from './dogs-api';
import { FormResponse } from './forms';

export interface Session {
    editDogError?: ValidationErrors;
    editDogResponse?: {
        id: string;
        response: FormResponse;
    };
}

const RedisStore = RedisStoreFactory(expressSession);
export const getSession = nextSession<Session>({
    store: promisifyStore(
        new RedisStore({
            client: new Redis({
                host: '127.0.0.1',
                port: 6379,
            }),
        }),
    ),
});

export const getSessionFromContext = (context: GetServerSidePropsContext) => {
    return getSession(context.req, context.res);
};
