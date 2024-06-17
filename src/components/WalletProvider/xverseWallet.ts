
import { AddressPurpose, RpcErrorCode, request } from "sats-connect";
import XverseLogo from "../../assets/images/xverse.svg";
import {SIGNINGMESSAGE, WalletListener} from  "./common";

export {XverseLogo};

export async function registerXverseListener(_listener: WalletListener) {

}

export async function connectXverseWallet() {
    try {
        const response = await request("getAccounts", {purposes: [AddressPurpose.Ordinals, AddressPurpose.Payment, AddressPurpose.Stacks], message: "Address for receiving Ordinals",});
        if (response.status === "success") {
            const ordiAccount = response.result.find((address) => address.purpose === AddressPurpose.Ordinals);
            const payAccount = response.result.find((address) => address.purpose === AddressPurpose.Payment);
            //const stacksAccount = response.result.find((address) => address.purpose === AddressPurpose.Stacks);
            return {type: "success", message:"success",
                accounts: [
                    {address: ordiAccount?.address, publicKey: ordiAccount?.publicKey},
                    {address: payAccount?.address, publicKey: payAccount?.publicKey},
                    //{address: stacksAccount?.address, publicKey: stacksAccount?.publicKey}
                ]
            };
        }
        else {
            if (response.error.code === RpcErrorCode.USER_REJECTION) {
                return {
                    type: "error",
                    message: "Xverse Wallet User Rejection",
                    accounts: []
                };
            } else {
                return {
                    type: "error",
                    message: "Xverse Wallet Connection Failed",
                    accounts: []
                };
            }
        }
    } catch (error) {
        return {
            type: "error",
            message: "Xverse Wallet Not Found",
            accounts: []
        };
    }
}

export async function signXverseWallet(
    address: string,
    _publicKey: string
) {
    let signature = "";
    try {
        const response = await request("signMessage", {
            address,
            message: SIGNINGMESSAGE,
            });
        if (response.status === "success") {
            signature = response.result.signature;
            return {
                type: "success",
                signature,
            };
        }
        else {
            throw new Error('Sign failed.');
        }        
    } catch (error) {
        return {
            type: "error",
            signature,
        };
    }
};