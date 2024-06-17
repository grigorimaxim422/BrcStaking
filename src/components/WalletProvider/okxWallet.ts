import OkxLogo from "../../assets/images/okx.svg";
import {SIGNINGMESSAGE, WalletListener} from  "./common";

export {OkxLogo};

export async function registerOKXListener(listener: WalletListener) {
    try {
        (window as any).okxwallet.bitcoin.on('accountChanged', listener);
    } catch (error) {
        console.log(error);
    }
}

export async function connectOkxWallet() {
    try {
        const account = await (window as any).okxwallet.bitcoin.connect();
        return {type: "success", message:"success", accounts: [{address: account.address, publicKey: account.compressedPublicKey}]};
    }
    catch (error) {
        return {
            type: "error",
            message: "OKX Wallet Connection Failed",
            accounts: []
        };
    }
}

export async function signOkxWallet(
    address: string,
    _publicKey: string
) {
    let signature = "";
    try {
        signature = await (window as any).okxwallet.bitcoin.signMessage(SIGNINGMESSAGE, {from: address,});
        return {
            type: "success",
            signature,
        };
    } catch (error) {
        console.log("An error occured", error);
        return {
            type: "error",
            signature,
        };
    }
};