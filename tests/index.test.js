import { expect } from "chai";
import supertest from "supertest";
import productFactory from "./factory/product.factory.js";
import userFactory from "./factory/user.factory.js";

let request;

describe('Test API Restfull', () => {

    before(async () => {
        request = supertest("http://localhost:8080");
    })

    describe('GET', () => {
        it('deberia retornar un status 200', async () => {
            let response = await request.get('/api')
            //console.log(response.status)
            //console.log(response. body)
            expect(response.status).to.eql(200)
        })

        it('deberia devolver el carrito', async () => {
            let response = await request.get('/api/shopping-cart')
            //console.log(response.status)
            //console.log(response. body)
            expect(response.status).to.eql(200)
        })

    })

    describe('POST', () => {

        const productToCreate = productFactory.generateProduct();
        const userToCreate = userFactory.generateUser();
        let response;
        let res;

        it("Deberia crear el producto", async () => {
            response = await request
                .post("/api/products")
                .send(productToCreate);

            expect(response.status).to.eql(201);
        });

    
        it("Deberia crear una cuenta", async (done) => {

            const response = request
                .post("/api/signup")
                .send(userToCreate);
            done() 

            expect(response.status).to.eql(201);
            // done() 
        })


        it("Debería loguearse", async () => {

            const user = { username: "test9", password: "1234" };
            // console.log(user)
            const res = await request.post("/api/login").send(user);

            expect(res.status).to.eql(302);
        })


    })
})
