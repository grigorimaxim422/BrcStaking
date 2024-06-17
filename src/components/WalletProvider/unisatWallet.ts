import {SIGNINGMESSAGE, WalletListener} from  "./common";
import UnisatLogo from "../../assets/images/unisat.svg";
export {UnisatLogo};

export async function registerUnisatListener(listener: WalletListener) {
    try {
      (window as any).unisat.on("accountsChanged", listener);
    } catch (error) {
      console.log(error);
    }
}

export async function connectUnisatWallet() {
    try {
        const accounts = await (window as any).unisat.requestAccounts();
        const publicKey = await (window as any).unisat.getPublicKey();
        return {type: "success", message:"success", accounts: [{address: accounts[0], publicKey}]};

    } catch (error) {
        return {
            type: "error",
            message: "Unisat Wallet Not Found",
            accounts: []
        };
    }
}

export async function signUnisatWallet(
    _address: string,
    _publicKey: string
) {
    let signature = "";
    try {
        signature = await (window as any).unisat.signMessage(SIGNINGMESSAGE);
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
}