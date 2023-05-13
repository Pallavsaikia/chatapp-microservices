export enum Config {
    MONGO_URL = "mongodb://admin:password123@127.0.0.1:30201/room?authSource=admin",
    JWT_REFRESH_TOKEN_SALT = "0c28b13b6c684e54ed5568b7bfaac69df2463fd05aa5640398ec5d474f96e5a1eaeb2b135360bf96ff2cbc7361de6660f4e72fdbbff23d04d2b72f37ad23b471",
    JWT_ACCESS_TOKEN_SALT = "bb55056bfd9ab73beb362f82450e0bcf8d233424a21ed9e6dc6a9da59f322ee12e98bca60c1ed43e0847470e05b7ff2a348321c075d72b49d86e180f39e22c41",
    RABBITMQ_URL = "amqp://user:HvDxHHJAqRuikn0O@localhost:30221",
    USER_VERIFIED_QUEUE="roomuserqueue",
    PORT=3001
}
