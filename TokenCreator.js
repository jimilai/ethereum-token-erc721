import Web3 from 'web3'
import ipfsClient from 'ipfs-http-client'
import contract from 'truffle-contract'
import RandomGraphTokenArtifacts from '../../build/contracts/RandomGraphToken.json'


class TokenCreator{
  constructor(account){
    this.account = account
    this.web3 = new Web3(ETH_NODE_URL ? ETH_NODE_URL : 'http://localhost:8545')
    this.ipfs = ipfsClient({
      host: IPFS_API_HOST ? IPFS_API_HOST : 'localhost',
      port: IPFS_API_PORT ? IPFS_API_PORT : 5001,
      protocol: 'http'
    })
	this.RandomGraphToken = contract(RandomGraphTokenArtifacts)
    this.RandomGraphToken.setProvider(this.web3.currentProvider)
  }
  setAccount(account){
    this.account = account
  }
  async createToken(svg,params){
    let base = IPFS_GATEWAY_URL ? IPFS_GATEWAY_URL : 'http://localhost:6001'
    let data = {
      path: 'token.svg',
      content: Buffer.from(svg)
    }
    let opts = {
      wrapWithDirectory: true
    }
    let ret = await this.ipfs.add(data,opts)
    let imageUri = [base, 'ipfs',ret[1].hash,'token.svg'].join('/')
    let meta = {
      name: 'Graph Art Token',
      description: 'Demo Non-Fungible Toke for hubwiz.com',
      image: imageUri
    }
    ret = await this.ipfs.add(Buffer.from(JSON.stringify(meta)))
    let metaUri = [base,'ipfs',ret[0].hash].join('/')
    
    let model = this.web3.utils.toHex(params.model)
    let modelArgs = this.encodeModelArgs(params)
    let inst = await this.RandomGraphToken.deployed()
    let accounts = await this.web3.eth.getAccounts()
    await inst.createUniqueArt(model,params.charge,params.linkDistance,modelArgs,metaUri,{from:this.account})
    console.log('gat token created!')
  }
  encodeModelArgs(params){
	let r = 0, h = 0, n = 0, mo = 0      
    let m = 0, p = 0, k = 0, alpha = 0, beta = 0
    
    switch(params.model){
      case 'BalancedTree':
        r = params.args[0]
        h = params.args[1]
        break
      case 'BarabasiAlbert':
        n = params.args[0]
        m0 = params.args[1]
        m = params.args[2]
        break
     case 'ErdosRenyi.np':
        n = params.args[0]
        p = params.args[1]
        break
      case 'ErdosRenyi.nm':
        n = params.args[0]
        m = params.args[1]
        break
      case 'WattsStrogatz.alpha':
        n = params.args[0]
        k = params.args[1]
        alpha = params.args[2]
        break
      case 'WattsStrogatz.beta':
        n = params.args[0]
        k = params.args[1]
        beta = params.args[2]
        break       
    }    
    return [r, h, n, mo, m, p, k, alpha, beta]
  }
  
}

export default TokenCreator
