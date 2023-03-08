const { response } = require("express");
const express = require("express");
const { v4: uuidv4 } = require("uuid")

const app = express();

app.use(express.json());

const costumers = [];

app.get("/", (request, response) => {
    return response.status(200).json({
        "teste": "ok"
    })
});

app.post("/account", (request, response) => {
    const { cpf, name } = request.body;
    const id = uuidv4();

    const costumersAlreadyExists = costumers.some(
        (costumer) => costumer.cpf === cpf
    )

    if (costumersAlreadyExists) {
        return response.status(400).json({
            "error": "Costumers already exists"
        })
    } 

    costumers.push({
        cpf,
        name,
        id,
        statement: []
    })

    return response.status(201).send()
});

app.get("/statement/", (request, response) => {
    const { cpf } = request.headers

    const customer = costumers.find((customer) => customer.cpf === cpf);

    if (!customer) {
        return response.status(400).json({
            "error": "Customer not found!"
        })
    }

    return response.send(customer.statement)
});

app.listen(3333)