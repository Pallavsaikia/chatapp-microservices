import supertest from "supertest";
import { app } from "../app"
import { mockMongoConnect, mockMongoDisconnect } from "./helpers/moock-mongo"
import { isValidError, isValidErrorResonseBody, isValidSuccessResonseBody } from "./helpers/valid-response";
import { OTPGenerator } from "../util/otp/libs/otp-gen";

const request = supertest(app(mockMongoConnect, null))

describe('verify-user/', () => {
    const otp = 123456
    const wrongOtp = 123455
    beforeAll(() => {
        jest.spyOn(OTPGenerator, 'generateOTP')
            .mockImplementation(() => {
                return "123456"
            })
    })


    let res: any, res1: any, res2: any
    let userid: any
    it("register", async () => {
        res = await request.post("/register").send({ email: "pallavsaikia50@gmail.com", username: "paultest", password: "123456" }).expect(201)
        userid = res.body.data.id
    })
    it("should be not be verified", async () => {
        res1 = await request.post("/verify-user").send({ userid: userid, otp: wrongOtp }).expect(401)

    })
    it("should be valid error response ", () => {
        isValidErrorResonseBody(res1)
    })
    it("should be valid error body ", () => {
        isValidError(res1)
    })
    it("should be verified", async () => {
        res2 = await request.post("/verify-user").send({ userid: userid, otp: otp }).expect(202)

    })
    it("should be valid success response ", async () => {
        isValidSuccessResonseBody(res2)
    })
    it("should contain data", async () => {
        expect(res2.body).toEqual(
            expect.objectContaining({
                success: true,
                data: null,
                error: null,
            }))
    })

    afterAll(async () => {
        jest.restoreAllMocks();
        jest.clearAllMocks();
        await mockMongoDisconnect()
    });


})


