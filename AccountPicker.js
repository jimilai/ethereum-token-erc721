import Web3 from 'web3'

class AccountPicker {
  constructor(){
    this.web3 = new Web3(ETH_NODE_URL ? ETH_NODE_URL : 'http://localhost:8545')
    this.render('body')
  }
  async render(host){
    let accounts = await this.web3.eth.getAccounts()
    
    let opts = accounts.map((acc,idx) => {
      let abbr = acc.substr(0,6) + '...' + acc.substr(38)
      return `<option value="${acc}" title="${acc}">${idx} | ${abbr}</option>`
    })
    let html = `<div class="account-picker">
    			  <select>
    			    ${opts}
    			  </select>
    			</div>`
    
    let $el = $(html).appendTo(host).change(() => {
      let activeAccount = $el.find('select').val()
      console.log(activeAccount)
      localStorage.setItem('activeAccount',activeAccount)
      if(this.onChange) this.onChange(activeAccount)
    })
    
    let lastActive = localStorage.getItem('activeAccount')
    if(lastActive) $el.find('select').val(lastActive)
    
    $el.trigger('change')
  }
}

export default AccountPicker
