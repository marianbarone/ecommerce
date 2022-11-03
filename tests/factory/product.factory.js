import faker from "faker";
faker.locale = "es";

function generateProduct() {
    return {
        title: faker.commerce.product(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(100, 200, 0),
        thumbnail: faker.internet.url()
    };
}

export default {
    generateProduct
}
