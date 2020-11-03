import Web3ProviderEngine from 'web3-provider-engine';
import RpcSource from 'web3-provider-engine/subproviders/rpc';
import HookedWalletSubprovider from 'web3-provider-engine/subproviders/hooked-wallet';
import SubscriptionSubprovider from 'web3-provider-engine/subproviders/subscriptions';
import FilterSubprovider from 'web3-provider-engine/subproviders/filters';

function createProvider(config) {
  var getAccounts = config.getAccounts,
      signTransaction = config.signTransaction,
      rpcUrl = config.rpcUrl,
      processMessage = config.processMessage,
      processPersonalMessage = config.processPersonalMessage,
      signMessage = config.signMessage,
      signPersonalMessage = config.signPersonalMessage;
  var idMgmt = getAccounts && new HookedWalletSubprovider({
    getAccounts: getAccounts,
    signTransaction: signTransaction,
    processMessage: processMessage,
    processPersonalMessage: processPersonalMessage,
    signMessage: signMessage,
    signPersonalMessage: signPersonalMessage
  });
  var rpcSubProvider = new RpcSource({
    rpcUrl: rpcUrl.includes('http') ? rpcUrl : "https://".concat(rpcUrl)
  });
  var provider = new Web3ProviderEngine();
  provider.addProvider(new SubscriptionSubprovider());
  provider.addProvider(new FilterSubprovider());
  idMgmt && provider.addProvider(idMgmt);
  provider.addProvider(rpcSubProvider);
  provider.start();
  provider.on('error', console.error);
  return provider;
}

export default createProvider;