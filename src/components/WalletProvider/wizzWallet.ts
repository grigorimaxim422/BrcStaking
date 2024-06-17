import WizzLogo from "../../assets/images/wizz.png";
import {SIGNINGMESSAGE, WalletListener} from  "./common";

export {WizzLogo};

export async function registerWizzListener(listener: WalletListener) {
    try {
      (window as any).wizz.on("accountsChanged", listener);
    } catch (error) {
      console.log(error);
    }
}

export async function connectWizzWallet() {
    try {
        const accounts = await (window as any).wizz.requestAccounts();
        const publicKey = await (window as any).wizz.getPublicKey();
        return {type: "success", message:"success", accounts: [{address: accounts[0], publicKey}]};

    } catch (error) {
        return {
            type: "error",
            message: "Wizz Wallet Not Found",
            accounts: []
        };
    }
}

export async function signWizzWallet (
    address: string,
    _publicKey: string
) {
    let signature = "";
    try {
        if(address.startsWith('bc1p')){
            signature = await (window as any).wizz.signMessage(SIGNINGMESSAGE,"bip322-simple");
        }
        else {
            signature = await (window as any).wizz.signMessage(SIGNINGMESSAGE);
        }
        
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