import LeatherLogo from "../../assets/images/leather.svg";
import {SIGNINGMESSAGE, WalletListener} from  "./common";

export {LeatherLogo};

export async function registerLeatherListener(_listener: WalletListener) {

  }

export async function connectLeatherWallet() {
    try {
        const accounts = await (window as any).LeatherProvider?.request("getAddresses");
        const p2trAccount = accounts.result.addresses.find((account: any) => account.type === "p2tr" && account.symbol === 'BTC');
        const p2wpkhAccount = accounts.result.addresses.find((account: any) => account.type === "p2wpkh" && account.symbol === 'BTC');
        //const staksAccount = accounts.result.addresses.find((account: any) => account.symbol === 'STX');

        return {type: "success", message:"success",
            accounts: [
                {address: p2trAccount.address, publicKey: p2trAccount.publicKey},
                {address: p2wpkhAccount.address, publicKey: p2wpkhAccount.publicKey},
                //{address: staksAccount.address, publicKey: staksAccount.publicKey},
            ]
        };

    } catch (error) {
        return {
            type: "error",
            message: "Leather Wallet Not Found",
            accounts: []
        };
    }
}

export async function signLeatherWallet(
    address: string,
    _publicKey: string
) {
    let signature = "";
    try {
        let paymentType = '';
        if(address.startsWith('bc1p'))
            paymentType = 'p2tr';
        else if(address.startsWith('bc1q'))
            paymentType = 'p2wpkh';

        const response = await (window as any).LeatherProvider?.request("signMessage", {
                message: SIGNINGMESSAGE,
                paymentType,
            });

        if (response.result.address === address) {
            signature = response.result.signature;
        } else {
            throw Error("Sign Error");
        }

        return {
            type: "success",
            signature,
        };
    } catch (error) {
        return {
            type: "error",
            signature
        };
    }
};