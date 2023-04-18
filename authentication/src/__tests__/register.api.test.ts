import supertest from "supertest";
import { app } from "../app"
import { mockMongoConnect, mockMongoDisconnect } from "./helpers/moock-mongo"
import mongoose from 'mongoose';
import { isValidError, isValidErrorResonseBody, isValidSuccessResonseBody } from "./helpers/valid-response";

const request = supertest(app(mockMongoConnect))
describe('registration/GET', () => {
    let res: any
    it("should return 404", async () => {
        res = await request.get("/register").expect(404)
    })
    it("should be valid error response ", async () => {
        isValidErrorResonseBody(res)
    })
    it("should be valid error body ", async () => {
        isValidError(res)
    })

})

describe('registration/POST - no body', () => {
    let res: any
    it("should return 400", async () => {
        res = await request.post("/register").expect(400)
    })
    it("should be valid error response ", async () => {
        isValidErrorResonseBody(res)
    })
    it("should be valid error body ", async () => {
        isValidError(res)
    })

})

describe('registration/POST - validation errors', () => {
    let res: any, res1: any, res2: any
    it("should return 400", async () => {
        res = await request.post("/register").send({ email: "pallavsaikia57@gmail.com" }).expect(400)
        res1 = await request.post("/register").send({ email: "pallavsaiki" }).expect(400)
        res2 = await request.post("/register").send({ email: "pallavsaikia57@gmail.com", username: "/", password: "123456" }).expect(400)
    })
    it("should be valid error response ", async () => {
        isValidErrorResonseBody(res)
        isValidErrorResonseBody(res1)
        isValidErrorResonseBody(res2)
    })
    it("should be valid error body ", async () => {
        isValidError(res)
        isValidError(res1)
        isValidError(res2)
    })

})

describe('registration/POST - success', () => {
    let res: any
    it("should return 201", async () => {
        res = await request.post("/register").send({ email: "pallavsaikia57@gmail.com", username: "paul", password: "123456" }).expect(201)

    })
    it("should be valid success response ", async () => {
        isValidSuccessResonseBody(res)
    })
    it("should contain data with ", async () => {
        expect(res.body.data).toEqual(
            expect.objectContaining({
                username: expect.any(String),
                id: expect.any(String),
                email: expect.any(String),
            }))
    })

})
describe('registration/POST - failed because already exist', () => {
    let res: any
    it("should return 409", async () => {
        res = await request.post("/register").send({ email: "pallavsaikia57@gmail.com", username: "pauls", password: "123456" }).expect(409)

    })
    it("should be valid error response ", async () => {
        isValidErrorResonseBody(res)
    })
    it("should be valid error body ", async () => {
        isValidError(res)
    })
    afterAll(async () => {
        await mockMongoDisconnect()
    })

})
