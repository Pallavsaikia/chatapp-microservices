import supertest from "supertest";
import { app } from "../app"
import { mockMongoConnect, mockMongoDisconnect } from "./helpers/moock-mongo"
import { isValidError, isValidErrorResonseBody, isValidSuccessResonseBody } from "./helpers/valid-response";
import { OTPGenerator } from "../util/otp/libs/otp-gen";

const request = supertest(app(mockMongoConnect))
const otp = 123456
const password = 123456
const wrongpassword = 123

beforeAll(() => {
    jest.spyOn(OTPGenerator, 'generateOTP')
        .mockImplementation(() => {
            return "123456"
        })
})


afterAll(async () => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
    await mockMongoDisconnect()
});

describe('Error-login/', () => {
    let userid: any
    let res1: any
    it("register and verify", async () => {
        const res = await request.post("/register").send({ email: "pallavsaikia50@gmail.com", username: "paultest", password: password }).expect(201)
        userid = res.body.data.id
        await request.post("/verify-user").send({ userid: userid, otp: otp }).expect(202)
    })

    it("wrong login cred/should be 400", async () => {
        res1 = await request.post("/login").send({ username: "paultest", password: wrongpassword }).expect(400)

    })
    it("should be valid error responsebody", async () => {
        isValidErrorResonseBody(res1)
    })
    it("should be valid error", async () => {
        isValidError(res1)
    })

})

describe('success-login/', () => {
    let res1: any
    it("should be 200", async () => {
        res1 = await request.post("/login").send({ username: "paultest", password: password }).expect(200)

    })
    it("should be valid responsebody", async () => {
        isValidSuccessResonseBody(res1)
    })

    it("should contain", async () => {
        expect(res1.body.data).toEqual(
            expect.objectContaining({
                id: expect.any(String),
                refreshToken: expect.any(String),
                username: expect.any(String),
            }))
    })




})


