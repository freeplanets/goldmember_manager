import { registerAs } from "@nestjs/config";

export default registerAs('secret', () => {
    const jwt = process.env.API_KEY;
    return { jwt };
})