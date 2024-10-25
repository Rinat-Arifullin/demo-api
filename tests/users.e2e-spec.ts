import { App } from "../src/app";
import { boot } from "../src/main";
import request from 'supertest'

let application: App;

beforeAll(async ()=>{
    const {app} = await boot;
    application = app
})

let jwtToken: string | null = null

describe('Users e2e', ()=> {
    it('Register - error', async ()=> {
        const res = await request(application.app).post('/users/register').send({
            email: 'a@a.ru',
            password: '1'
        })

        expect(res.statusCode).toBe(422)
    })

    it('Register - success', async () => {
        const res = await request(application.app).post('/users/register').send({
            email: 'r123@r.ru',
            password: '2',
            name: 'Rinat'
        })

        expect(res.statusCode).toBe(200)
    })

    it('Login - error', async () => {
        const res = await request(application.app).post('/users/login').send({
            email: 'r123@r.ru',
            password: '3',
        })

        expect(res.statusCode).toBe(422)
    })

    it('Login - success', async () => {
        const res = await request(application.app).post('/users/login').send({
            email: 'r123@r.ru',
            password: '2',
        })

        jwtToken = res.body.jwt

        expect(res.body.jwt).not.toBeUndefined()
    })

    it('Get Info - success', async () => {
        const res = await request(application.app)
        .get('/users/info')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${jwtToken}`)
        expect(res.statusCode).toBe(200)
    })

    it('Get Info - error', async () => {
        const res = await request(application.app)
        .get('/users/info')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer 123`)

        expect(res.statusCode).toBe(401)
    })
})


// неверный/верный логин
// получение информации от пользователя - успешное/неуспешное

afterAll(()=>{
    application.close()
})