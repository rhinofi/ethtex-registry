const commandLineArgs = require('command-line-args')
const Web3 = require('web3')
const _get = require('lodash/get')

const Utils = require('./utils')

const registryContractInfo = require('./build/contracts/RegistryLookup.json')
const batContractInfo = require('./build/contracts/BAT.json')
const daiContractInfo = require('./build/contracts/Dai.json')
const golemContractInfo = require('./build/contracts/Golem.json')
const leoContractInfo = require('./build/contracts/Leo.json')
const omiseGoContractInfo = require('./build/contracts/OmiseGo.json')
const tetherContractInfo = require('./build/contracts/Tether.json')
const wEthContractInfo = require('./build/contracts/WEth.json')
const zeroXContractInfo = require('./build/contracts/ZeroX.json')
const wethContractInfo = require('./build/contracts/Weth.json')

const NETWORK_ID = "5777"
const defaultProvider = 'HTTP://127.0.0.1:8545'
const pvtKeyDefault = '4909ceca58bff841f06a31671b84610faafe3ab5d674cc4c4715f81fea38a47b'
const contractAddressDefault = _get(registryContractInfo.networks[NETWORK_ID], 'address', '')
const tokensDefault = [
  _get(batContractInfo.networks[NETWORK_ID], 'address', ''),
  _get(daiContractInfo.networks[NETWORK_ID], 'address', ''),
  _get(golemContractInfo.networks[NETWORK_ID], 'address', ''),
  _get(leoContractInfo.networks[NETWORK_ID], 'address', ''),
  _get(omiseGoContractInfo.networks[NETWORK_ID], 'address', ''),
  _get(tetherContractInfo.networks[NETWORK_ID], 'address', ''),
  _get(wEthContractInfo.networks[NETWORK_ID], 'address', ''),
  _get(zeroXContractInfo.networks[NETWORK_ID], 'address', ''),
]
const defaultWethAddress = _get(wethContractInfo.networks[NETWORK_ID], 'address', '')

const options = commandLineArgs([
  { name: 'provider', alias: 'p', type: String, defaultValue: defaultProvider },
  { name: 'privatekey', alias: 'k', type: String, defaultValue: pvtKeyDefault },
  { name: 'contract', alias: 'c', type: String, defaultValue: contractAddressDefault },
  { name: 'token', alias: 't', type: String, multiple: true, defaultValue: tokensDefault },
  { name: 'wethAddress', alias: 'w', type: String, defaultValue: defaultWethAddress }
])

const { provider, privatekey, contract, token, wethAddress } = options
const web3 = new Web3(provider)

let contractInstance = new web3.eth.Contract(registryContractInfo.abi, contract)

const pvtKey = Buffer.from(privatekey, 'hex')
const utils = new Utils(contractInstance, web3, pvtKey)

async function seed() {
  try {
    await utils.addTokens(token)
    await utils.setWrappedEthAddress(wethAddress)

    // web3 bug keeps the process running ( calling currentProvider.disconnect() doesn't end the connection)
    // https://github.com/ethereum/web3.js/issues/2882
    web3.currentProvider.disconnect()
    console.log('\nSeed successful! \nYou can safely terminate this process.');
  } catch (e) {
    console.error(e)
  }
}

seed()