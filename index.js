const { response } = require("express");
const express = require("express");
const { v4: uuidv4 } = require("uuid")

const app = express();

app.use(express.json());

const costumers = [];

//Middleware
function verifyIfExistsAccountCPF(request, response, next) {
    const { cpf } = request.headers

    const customer = costumers.find((customer) => customer.cpf === cpf);

    if (!customer) {
        return response.status(400).json({
            "error": "Customer not found!"
        })
    }

    request.customer = customer;

    return next();
}

function getBalance(statement) {
    const balance = statement.reduce((acc, operation) => {
        if (operation.type === 'credit') {
            return acc + operation.amount
        } else {
            return acc - operation.amount
        }
    }, 0)

    return balance
}

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

app.use(verifyIfExistsAccountCPF);

app.get("/statement/", (request, response) => {
    const { customer } = request
    return response.send(customer.statement)
});

app.post("/deposit", verifyIfExistsAccountCPF, (request, response) => {
    const { description, amount } = request.body

    const { customer } = request

    const stamentOperation = {
        description,
        amount,
        created_at: new Date(),
        type: "credit"
    }

    customer.statement.push(stamentOperation)

    return response.status(201).send()
})

app.post("/withdraw", verifyIfExistsAccountCPF, (request, response) => {
    const { amount } = request.body
    const { customer } = request

    const balance = getBalance(customer.statement)

    if (balance < amount) {
        return response.status(400).json("Insuficient funds!")    
    }

    const statementOperation = {
        amount,
        created_at: new Date(),
        type: "debit"
    }

    customer.statement.push(statementOperation)

    return response.status(201).send()
})

app.listen(3333)