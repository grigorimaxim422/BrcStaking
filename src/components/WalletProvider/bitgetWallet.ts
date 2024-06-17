import BitgetLogo from "../../assets/images/bitget.png";
import {SIGNINGMESSAGE, WalletListener} from  "./common";

export {BitgetLogo};

export async function registerBitkeepListener(listener: WalletListener) {
    try {
      (window as any).bitkeep.unisat.on("accountsChanged", listener);
    } catch (error) {
      console.log(error);
    }
  }

export async function connectBitgetWallet() {
    try {
        const accounts = await (window as any).bitkeep.unisat.requestAccounts();
        const publicKey = await (window as any).bitkeep.unisat.getPublicKey();
        return {type: "success", message:"success", accounts: [{address: accounts[0], publicKey}]};

    } catch (error) {
        return {
            type: "error",
            message: "Bitget Wallet Not Found",
            accounts: []
        };
    }
}

export async function signBitgetWallet(
    _address: string,
    _publicKey: string
) {
    let signature = "";
    try {
        signature = await (window as any).bitkeep.unisat.signMessage(SIGNINGMESSAGE);
        return {
            type: "success",
            signature,
        };
    } catch (error) {
        return {
            type: "error",
            signature,
        };
    }
};