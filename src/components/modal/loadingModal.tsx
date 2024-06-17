import "./loadingModal.css";
import { Wallets, LoadingState } from "../WalletProvider";

interface LoadingModalProps {
    isLoading: boolean;
    walletId: string;
    message: string;
    OnCloseLoadingModal: ({isLoading,walletId,message} : LoadingState) => void;
}

export default function LoadingModal({isLoading, walletId, message, OnCloseLoadingModal}:LoadingModalProps)
{
    let wid = walletId as  keyof typeof Wallets;
    
    return isLoading?(
        <div className="mask" style={{zIndex: 1000}}>
        <div className="content choose-wallet-alert">
            <div onClick={() => OnCloseLoadingModal({isLoading: false,walletId,message})} className="close">Close</div>
            <div className="title">Choose Wallet</div>
            <div className="wallets">
                <div className="connecting flex-column-center">
                    <img alt={Wallets[wid].title} loading="lazy" width="42" height="42" decoding="async" data-nimg="1" src={Wallets[wid].logo} style={{ color: 'transparent', borderRadius: '4px' }}/>
                    <div className="name">{Wallets[wid].title}</div>
                    <div className="flex-row-v-center gap-16 mt16 alert-text">
                        <div className="ant-spin ant-spin-spinning css-1vjs91s" aria-live="polite" aria-busy="true">
                            <span className="ant-spin-dot ant-spin-dot-spin">
                            <i className="ant-spin-dot-item"></i>
                            <i className="ant-spin-dot-item"></i>
                            <i className="ant-spin-dot-item"></i>
                            <i className="ant-spin-dot-item"></i>
                            </span>
                        </div>
                        {message}...
                    </div>
                    <div onClick={() => OnCloseLoadingModal({isLoading: false,walletId,message})} className="notice mt16 clickable">Cancel</div>
                </div>
            </div>
        </div>
        </div>
    ):
    (<div></div>)
    ;
}

