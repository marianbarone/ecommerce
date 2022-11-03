import faker from "faker";
faker.locale = "es";

function generateUser() {
    return {
        username: faker.name.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        address: faker.address.streetAddress(),
        age: faker.datatype.number(),
        phone: faker.phone.phoneNumber(),
        avatar: faker.internet.avatar(),
    }
}

export default {
    generateUser
}
