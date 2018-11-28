const Web3 = require('web3');
const path = require('path');
const fs = require('fs');
const solc = require('solc');
const express = require('express');

var app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', '*');
    next();
});

let web3 = new Web3();
web3.setProvider(
    new Web3.providers.WebsocketProvider(
        'ws://localhost:8546'
    )
)

let contract;

const codePath = path.resolve(__dirname, "contracts", "planeContract.sol")
const code = fs.readFileSync(codePath, 'utf8')
const compile = solc.compile(code, 1).contracts[':PlaneContract']

web3.eth.getAccounts().then(accounts => 
    web3.eth.personal.unlockAccount(accounts[0], '1111')
    .then(res => {
        (new web3.eth.Contract(JSON.parse(compile.interface)).deploy({data: "0x" + compile.bytecode}).send({from: accounts[0], gas: 6000000}))
            .then(res => {
                contract = res
                app.listen(8080, () => console.log(`listening on port 8080!`))
            }) 
    }).catch(err => {
    })
)

app.post('/login', (req, res) => {
    web3.eth.personal.unlockAccount( req.body.address, req.body.password)
        .then(result => {
            res.sendStatus(200)
        }).catch(err => {
            res.sendStatus(403)
        })
})

app.post('/signup', (req, res) => {
    web3.eth.personal.newAccount(req.body.password)
        .then(address => {
            res.status(200).send(address)
        }).catch(err => {
            res.sendStatus(403)
        })
})

app.post('/flights', (req, res) => {
    contract.methods.getPlanes().call({ from: req.body.address })
        .then(result => {
            res.status(200).send(result)
        }).catch(err => {
            console.error(err)
        })
})

app.post('/getSeats', (req, res) => {
    contract.methods.getSeats(req.body.plane).call({ from: req.body.address })
        .then(result => {
            var row = []
            for(var i = 0; i < 10; i++) {
                var column = []
                for(var j = 0; j < 4; j++) {
                    column.push({address: result[0][i * 4 + j] , forSale: result[1][i * 4 + j], price: +result[2][i * 4 + j]})
                }
                row.push(column)
            }
            res.status(200).send(row)
        }).catch(err => {
            console.error(err)
        })
})

app.post('/buySeat', (req, res) => {
    var count = 0
    req.body.seats.forEach(seat => {
        contract.methods.buySeat(req.body.plane, seat[0], seat[1]).send({ from: req.body.address, value: seat[2] })
            .then(result => {
                count++
                if (count === req.body.seats.length) {
                    res.sendStatus(200)
                }
            }).catch(err => {
                count++
                if (count === req.body.seats.length) {
                    res.sendStatus(200)
                }
            })
    })
})
