const {Web3} = require("web3");
const ganache = require("ganache");
const assert = require("assert");
const {abi, evm} = require("../compile");

const web3 = new Web3(ganache.provider());

let accounts;
let lottery;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    lottery = await new web3.eth.Contract(abi)
        .deploy({data: evm.bytecode.object})
        .send({from: accounts[0], gas: "1000000"});
});

describe( "Lottery Contract", () => {
    it("deploys a contract", () => {
        console.log(lottery.methods);
        assert.ok(lottery.options.address);
    });

    it ("allows one account to enter", async () => {
        await lottery.methods.enter().send({
            from : accounts[0],
            value : web3.utils.toWei('0.02',"ether")
            }
        );
        const players = await lottery.methods.getPlayers().call({
            from : accounts[0]
        });
        assert.equal(accounts[0],players[0]);
        assert.equal(1,players.length);
    });

    it("allows multiple accounts to enter", async () => {
        let i;
        for(i=0;i<3;i++){
            await lottery.methods.enter().send({
                from : accounts[i],
                value : web3.utils.toWei("0.02","ether")
            });
            let players = await lottery.methods.getPlayers().call({
                from : accounts[i]
            });
            assert.equal(accounts[i],players[i]);
        }
    });

    it("right amount of ether to enter", async ()=> {
        try{
            await lottery.methods.enter().send({
                from : accounts[0],
                value : 0
            });
            assert(false);
        }catch(err){
            assert(err);
        }
    });

    it('only manager has access to pickWinner', async () => {
        try{
            await lottery.methods.pickWinner().send({
                from: accounts[0]
            });
            assert(false);
        }catch (err){
            assert(err);
        }
    });

    it('sends money to the winner and resets the players array', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('2', 'ether')
        });

        const initialBalance = await web3.eth.getBalance(accounts[0]);
        await lottery.methods.pickWinner().send({ from: accounts[0] });
        const finalBalance = await web3.eth.getBalance(accounts[0]);
        const difference = finalBalance - initialBalance;

        assert(difference > web3.utils.toWei('1.8', 'ether'));
    });
});