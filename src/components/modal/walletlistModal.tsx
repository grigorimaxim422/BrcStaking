import { useState } from "react";
import { Wallets, LoadingState, WalletListener, registListener } from "../WalletProvider";

import "./walletlistModal.css";

interface  WalletListModalProps {
    isShow: boolean;
    OnClickCloseButton: () => void;
    OnAccountChanged: WalletListener;
    OnAuthenticate: ({isLoading, walletId, message}: LoadingState) => void;
}

export default function WalletListModal(
    {isShow, OnClickCloseButton, OnAccountChanged, OnAuthenticate} : WalletListModalProps
)
{
    const [sateOfLoading, setStateOfLoading] = useState<string[]>([]);

    async function OnCickWalletItem(walletId: string)
    {
        if (sateOfLoading.includes(walletId))
        {
            setStateOfLoading((prev) => prev.filter((id) => id !== walletId));
        } else {
            setStateOfLoading((prev) => [...prev, walletId]);
            registListener(walletId, OnAccountChanged);
            OnAuthenticate({isLoading: true, walletId, message: 'Connecting'});
            //await OnAuthHandler(walletId);

            setStateOfLoading((prev) => prev.filter((id) => id !== walletId));
        }
    }

    return isShow?(
        <section className={`connect-dialog`}>
            <aside className={`wrapper bg opened`}></aside>
            <aside className={`wrapper opened`}>
                <div className={`dialog`}>
                <section className="header">
                    <p className="title">Connect Wallet</p>
                </section>
                <section className="body">
                    <div className="wallet-login">
                    <p className="instruction">
                        Please select the connection method.
                    </p>
                    <div className="wallet-list">
                        {Object.entries(Wallets).map(([walletID, walletItem]) => (
                            <button className="wallet-item" onClick={() => OnCickWalletItem(walletID)}>
                            <div className="content">
                                <img className="logo" src={walletItem.logo} />
                                <span className="title">{walletItem.title}</span>
                            </div>
                            <div className="indicators">
                                <i
                                className="el-icon-loading"
                                style={{
                                    display: sateOfLoading.includes(walletID) ? "" : "none",
                                }}
                                ></i>
                                <i
                                className="iconfont icon-arrow-right"
                                style={{
                                    display: sateOfLoading.includes(walletID) ? "none" : "",
                                }}
                                ></i>
                            </div>
                            </button>
                        ))}
                    </div>
                    </div>
                </section>
                <section className="footer">
                    <button className="gn-button gn-button--medium close-btn" onClick={OnClickCloseButton}>
                    Close
                    </button>
                </section>
                </div>
            </aside>
        </section>
    ):
    (<></>);
}