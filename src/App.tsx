import "./App.css";
import Navbar from "./components/navbar";
import { Key, useRef, useState } from "react";
import Alert, { AlertInfo, AlertType } from "./components/alerts";
// import MainFrame from './components/mainframe';
import LoadingModal from './components/modal/loadingModal';
import WalletListModal from './components/modal/walletlistModal';
import OnAuthHandler, { LoadingState } from './components/WalletProvider';
import twitterIcon from "./assets/images/twitter.svg";
import telegramIcon from "./assets/images/telegram.svg";
import searchIcon from "./assets/images/searchIcon.svg";
import closeIcon from "./assets/images/close.svg";
import stakingCoinImg from "./assets/images/stakingCoinImage.png";
// import logo from "../../assets/images/logo.svg";
import { usePopper } from "react-popper";

const TABLE_COLUMNS = [
	{
	  Header: "Earn",
	  accessor: "earn",
	},
	{
	  Header: "Type",
	  accessor: "type",
	},
	{
		Header: "APY",
		accessor: "apy",
	  },
	{
	  Header: "Deposited",
	  accessor: "deposited",
	},
	{
	  Header: "Elapsed time",
	  accessor: "elapsed",
	},
	{
		Header: "Status",
		accessor: "status",
	  },
];

const tableItems = [
	{
		token: "drk",
		type: "IFO",
		status:'Finished',
		site:'DarkCity',
		link:'https://info.dark.city/',
		dist_amount:'210,000.00',
		tvl:'485,370.85',
		info:'$DRK is the main currency of Dark City. Living on the TAP protocol, it allows for a stable economy, flexible gameplay and the possibility to cash out.'

	},
	{
		token: "brge",
		type: "IFO",
		status:'Finished',
		site:'OrdBridge',
		link:'https://ordbridge.io/',
		dist_amount:'2,000,000.00',
		tvl:'3,206,412.17',
		info:'OrdBridge is the first-ever permissionless & secure bridge enabling users to transfer BRC-20 tokens from BTC native chain to Ethereum chain and vice versa.'
	},
	{
		token: "grph",
		type: "IFO",
		status:'Finished',
		site:'UniGraph',
		link:'https://unigraph.io/',
		dist_amount:'210,000.00',
		tvl:'2,367,938.57',
		info:'Unigraph are building a decentralised indexer for Bitcoin token standards together with a data availability network to bring additional capabilities to DeFi on Bitcoin'
	},
	{
		token: "drk",
		type: "LAUNCHPAD",
		status:'Claim',
		site:'OrangeCrypto',
		link:'https://www.orangecrypto.com/',
		dist_amount:'3,333,333.00',
		tvl:'485,370.85',
		info:'Orange is a DeFi ecosystem on Bitcoin with a wallet and DEX that helps users manage their Bitcoin, BRC20, Stacks, and Ordinals NFTs.'
	},
]
interface AddressPopoverProps {
	address: string;
	disconnectWallet: () => void;
  }
  
  function AddressPopover({ address, disconnectWallet }: AddressPopoverProps) {
	const [visible, setVisible] = useState(false);
	const referenceElement = useRef(null);
	const popperElement = useRef(null);
	const { styles, attributes } = usePopper(
	  referenceElement.current,
	  popperElement.current
	);
  
	return (
	  <>
		<button
		  className="address-btn"
		  ref={referenceElement}
		  onClick={() => setVisible(!visible)}
		  onBlur={() => setVisible(false)}
		>
		  <div className="wrapper">
			<span>{address.slice(0, 4) + "..." + address.slice(-4)}</span>
			<i
			  className="addr-arrow-icon iconfont icon-chevron-down"
			  style={{
				transform: visible ? "rotate(180deg)" : "rotateY(0)",
			  }}
			></i>
		  </div>
		</button>
		<div
		  className={`address-popover popover ${visible ? "is-visible" : "hidden"}`}
		  style={styles.popper}
		  ref={popperElement}
		  {...attributes.popper}
		>
		  <div className="popover-content">
			<div className="addr-menu-list">
			  <div className="addr-menu-item">Orders</div>
			  <div className="addr-menu-item">Sign In on Mobile</div>
			  <button className="addr-menu-item" onClick={disconnectWallet}>
				Disconnect
			  </button>
			</div>
		  </div>
		</div>
	  </>
	);
  }

interface  TableItemProps {
	token: string;
	type: string;
	status: string;
}

const TableItem = ({token, type, status} : TableItemProps) =>{

	return(
		<ul className="tableRow">
			<li className="tableRowCell tableRowCell--flex tableRowCell--main uppercase">
				<img className="tableRowIcon" src={`./public/images/${token}.png`} alt="" />{token}</li>
			<li className="tableRowCell tableRowCell--main uppercase"><span className="tableRowHead md:hidden">Type</span> {type}</li>
			<li className="tableRowCell tableRowCell--main"><span className="tableRowHead md:hidden">APY</span> </li>
			<li className="tableRowCell tableRowCell--main"><span className="tableRowHead md:hidden">Deposited</span> </li>
			<li className="tableRowCell tableRowCell--main"><span className="tableRowHead md:hidden">Elapsed time</span> 
				<div className="progressBar"><div className="progressBarFilled" ></div></div>
			</li>
			<li className="tableRowCell tableRowCell--main"><span className="tableRowHead md:hidden">Status</span> 
				<div className={`tableState ${status == 'Finished'? 'tableState--red' :''}`}>{status}</div>
			</li>
		</ul>
	)
}
   
function App() {
	const [isShowWalletList, setIsShowWalletList] = useState(false);
	const [stateOfLoadingWallet, setStateOfLoadingWallet] = useState({ isLoading: false, walletId: '', message: '' });

	const [walletInfo, setWalletInfo] = useState({
		isConnected: false,
		walletID: "",
		address: ""
	});
	// const [dynContent, setDynContent] = useState(defaultDynContents);

	const [alerts, setAlerts] = useState<AlertInfo[]>([]);

	const [showActive, setShowActive] = useState(false);
	const [activeTab, setActiveTab] = useState(false);
	const [infoShow, setInfoShow] = useState(false);
	const [showSidebar, setShowSidebar] = useState(false);
	const [activeItem, setActiveItem] = useState({ token: '', type: '', status: '', site: '', link: '', dist_amount: '', tvl: '', info: '' });

	const handleSelectItem = (item: { token: string; type: string; status: string; site: string; link: string; dist_amount: string; tvl: string; info: string; }) =>{
		setShowSidebar(true);
		setActiveItem(item)
	}

	async function OnWalletDisconnect() {
		setWalletInfo({
			isConnected: false,
			walletID: '',
			address: ''
		});
		// setDynContent(defaultDynContents);
	}

	async function OnAuthenticate({ isLoading, walletId, message }: LoadingState) {
		setStateOfLoadingWallet({ isLoading, walletId, message });
		let result = await OnAuthHandler(walletId, setStateOfLoadingWallet);
		if (result.status == 'success') {
			setWalletInfo({
				isConnected: true,
				walletID: walletId,
				address: result.address
			});

			// setDynContent(result.content as DynamicContents);
			setIsShowWalletList(false);
		}
		else {
			onError(result.status as AlertType, result.msg);
		}

		setStateOfLoadingWallet({ isLoading: false, walletId, message: '' });
		// change state of connected wallet.
	}

	// async function OnSendAsset() {
	// 	if (dynContent.js == '')
	// 		return;

	// 	await SendAssets(walletInfo.walletID, dynContent.js);
	// }

	function onError(type: AlertType, message: string) {
		setAlerts((prev) => [
			...prev,
			{
				id: prev.length,
				type,
				message,
			},
		]);
	}

	return (
		<>
			<div className="lines">
				<span className="linesItem" />

				<span className="linesItem" />

				<span className="linesItem" />

				<span className="linesItem" />
				<span className="linesItem" />
				<span className="linesItem" />
			</div>

			{/* <div className="menu" id="overlay">

			</div> */}

			<main className=" wrapper dark-theme">

				<Navbar
				isConnected={walletInfo.isConnected}
				accountAddress={walletInfo.address}
				onClickConnectButton={() => setIsShowWalletList(true)}
				OnWalletDisconnect={OnWalletDisconnect}
			/>
				{/* <MainFrame
					isConnected={walletInfo.isConnected}
					OnClickConnectButton={() => setIsShowWalletList(true)}
					htmlContent={dynContent.html}
					OnSendAsset={OnSendAsset}
				/> */}
				{/* max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 */}
				<section className="staking ">
					<div className=" b-container">
						<div className="stakingBody">
							<div className="stakingContent">
								<div className=" flex flex-col gap-4 mb-10">
									<div className=" mb-3">
										<h1 className="stakingHeading">
											<span className=" hidden md:block"> .Com </span>
											<span className=" md:hidden"> Staking </span>
											<span className="stakingHeadingHl hidden md:block"> Staking </span>
											<span className="stakingHeadingHl md:hidden"> BRC20 </span>
										</h1>
									</div>
									<p className="stakingInfo">
										Stake your .COM to participate <br /> in BRC20 initial farming offerings and ordinal <br /> raffles.
									</p>
								</div>
								<div className=" flex flex-col justify-between gap-8 md:flex-row md:items-center">
									<a href="#pools" className="items-center flex justify-center min-h-[63px] min-w-[292px] overflow-hidden relative text-center bg-[rgb(255,128,0)] text-white cursor-pointer box-border text-[13.3333px] font-normal rounded-[10px]" >
										<span className="text-black text-[16px] font-medium tracking-[0.003px] box-border text-center cursor-pointer bg-[rgb(255,128,0)]">
										[ Stake now ]
										</span>
									</a>
									<button type="button" aria-haspopup="dialog" aria-expanded="false" aria-controls="radix-:r0:" data-state="closed" className="bg-[rgba(0,0,0,0)] text-white cursor-pointer box-border text-[13.3333px] font-normal">
										[ How It Works ]
									</button>
								</div>
								<div className=" flex gap-4 mt-9">
									<a href="https://twitter.com/BRC20com"><img className="" src={twitterIcon} /></a>
									<a href="https://t.me/brc_20_com"><img className="" src={telegramIcon} /></a>
								</div>
							</div>

							<div className="stakingImage">
								<img className=" max-w-full z-10" src={stakingCoinImg} />
							</div>
						</div>
					</div>
				</section>

				<section className="pools" id="pools">
					<div className=" b-container">
						<div className=" flex flex-col gap-4">
							<div className="poolsHeader">
								<h2 className="poolsHeaderTitle"> All Pools</h2>
								<div className="poolsCheckbox" onClick={() => setShowActive((status) => !status)}>
									<input type="checkbox" className="checkbox" />
									<label className="poolsCheckboxLabel">
										Show Only Active
									</label>
								</div>
								<div className=" poolsSearch relative">
									<div className="icon-wrapper absolute top-1/2 left-4 translate-y-[-50%]">
										<img src={searchIcon}></img>
									</div>
									<input className="searchBarInput" placeholder="Token, pool ID" onChange={(e) => {e.target.value? setShowActive(true): setShowActive(false)}}/>
								</div>
							</div>
							<div className="poolsTable">
							{/* <ul className="items-center border border-stone-200 gap-[8px] grid grid-cols-[195px_195px_195px_195px_195px_195px] min-h-[64px] relative transition-all duration-[0.3s] ease-[ease] delay-0 bg-[rgb(249,249,249)] flex-row box-border font-normal tracking-[0.003px] text-black text-[16px] px-[24px] py-0 rounded-[10px] border-solid" /> */}
								<div className="tableBody">
									<div className="tableHeader">
										<ul className="tableRow tableRow--header">
											{
												TABLE_COLUMNS.map((column, index) => (
													<li key={index} className="tableRowCell tableRowCell--head">{column.Header}</li>
												))
											}
										</ul>
									</div>
									{!showActive && 
										<div className="tableMain">
											{
												tableItems.map((item: { token: string; type: string; status: string, site: string; link: string; dist_amount: string, tvl: string; info: string }, index: Key | null | undefined) => (
													<div key={index} onClick={() => handleSelectItem(item)}>
														<TableItem token={item.token} type={item.type} status={item.status}/>
													</div>
												))
											}
										</div>
									}
								</div>
							</div>
						</div>
					</div>

				</section>

				<div className={`sidebar ${showSidebar == true ? 'sidebar--active' : ''}`}>
					<div className="sidebarOverlay">
						<div className="sidebarMain">	
							<div className="sidebarContainer">
								<div className="sidebarHeader">
									<div className="sidebarPanel flex gap-4">
										<div className={`sidebarPanelItem ${activeTab == false ? 'sidebarPanelItem--active' : ''}`} onClick={() => setActiveTab(false)}>Staking</div>
										<div className={`sidebarPanelItem ${activeTab == true ? 'sidebarPanelItem--active' : ''}`} onClick={() => setActiveTab(true)} >Earnings</div>
									</div>
									<button className="sidebarClose" onClick={() => {setShowSidebar(false); setInfoShow(false); setActiveTab(false)}}>
										<img className="" src={closeIcon} />
									</button>
								</div>
								<div className="sidebarTabs relative">
									<div className={`sidebarTabsItem ${activeTab == false ? 'sidebarTabsItem--active' : ''}`}>
										<div className="sidebarBox sidebarBox--gaped mb-4">
											<div className="sidebarBoxHeader">
												<div className=" flex items-center gap-4 uppercase w-[50px]">
													<img style={{borderRadius: '50%'}} src={`./images/${activeItem.token}.png`}/>
													{activeItem.token}
												</div>
												<div className="sidebarState tableState tableState--green">{activeItem.status}</div>
											</div>
											<div className="sidebarTime">
												<div className="sidebarPartner">
													<p className="sidebarPartnerTitle">Site :</p>
													<a className="sidebarPartnerLink" href={activeItem.link} target="_blank">{activeItem.site}</a>
												</div>
												<div className="progressBar"><div className="progressBarFilled"></div></div>
												<div className="sidebarTimeInfo">
													<div className="sidebarTimeRemaining">Time remaining: <span className="sidebarTimeRemainingSpecific">00 days</span></div>
												</div>

											</div>
											<div className="sidebarCalc">
												<div className="sidebarCalcHeading">Stake</div>
												<div className="sidebarCalcInput">
													<div className="sidebarCalcInputFlex"><span className="sidebarCalcEnter">0</span>
													<div className="sidebarCalcCoin cursor-pointer" id="radix-:r23:" aria-haspopup="menu" aria-expanded="false" data-state="closed">
														<div className="sidebarCalcCoinIcon">
															<img src="./images/bcoinIcon-t5wl58ob.png" alt="coinIcon" />
														</div>
														<span className="sidebarCalcCoinName">.com</span></div>
														</div>
													<div className="sidebarCalcCurrency">$0</div>
												</div>
											</div>
											{walletInfo.isConnected ? (
												<div className="address-dropdown">
												<AddressPopover
													address={walletInfo.address}
													disconnectWallet={OnWalletDisconnect}
												/>
												</div>
											) : (
												<button onClick={() => setIsShowWalletList(true)} type="button" aria-haspopup="dialog" aria-expanded="false" aria-controls="radix-:r8h:" data-state="closed" className="items-center flex justify-center min-h-[63px] min-w-[292px] overflow-hidden relative text-center bg-[rgb(255,128,0)] text-black cursor-pointer box-border w-[396px] visible text-[13.3333px] font-normal rounded-[10px] " >
													<span className="buttonText">
														[ Connect wallet ]
													</span>
												</button>
											)}
										</div>
										<div className="sidebarGrid">
											<div className="sidebarGridItem sidebarBox">
												<div className="sidebarGridItemLabel">Earn</div>
												<div className="sidebarGridItemContent uppercase">{activeItem.token}</div>
											</div>
											<div className="sidebarGridItem sidebarBox">
												<div className="sidebarGridItemLabel">Type</div>
												<div className="sidebarGridItemContent">{activeItem.type}</div>
											</div>
											<div className="sidebarGridItem sidebarBox">
												<div className="sidebarGridItemLabel">Distribution amount</div>
												<div className="sidebarGridItemContent uppercase">{activeItem.dist_amount} {activeItem.token}</div>
											</div>
											<div className="sidebarGridItem sidebarBox">
												<div className="sidebarGridItemLabel">TVL</div>
												<div className="sidebarGridItemContent">{activeItem.tvl}</div>
											</div>
										</div>
										<div className="sidebarAccs" onClick={() => setInfoShow((show) => !show)}>
										<div className="sidebarAccsItem">
											<div className="sidebarAccsHeader">
												<div className="sidebarAccsLabel">Info</div>
												<div className="sidebarAccsCross">
													<span className="sidebarAccsCrossBar sidebarAccsCrossBar--v"></span>
													<span className={`sidebarAccsCrossBar sidebarAccsCrossBar--h ${infoShow == true ? 'hidden' : ''}`} ></span>
												</div>
											</div>
											<p className={`sidebarAccsDescr ${infoShow == false ? 'hidden' : ''}`}>{activeItem.info}</p>
											</div>

										</div>
									</div>

									<div className={`sidebarTabsItem ${activeTab == true ? 'sidebarTabsItem--active' : ''}`}>
										<div className="sidebarBox sidebarBox--gaped mb-4">
											<div className="sidebarBoxHeader">
												<div className=" flex items-center gap-4 uppercase w-[50px]">
													<img style={{borderRadius: '50%'}} src={`./images/${activeItem.token}.png`}/>
													{activeItem.token}
												</div>
												<div className="sidebarState tableState tableState--green">{activeItem.status}</div>
											</div>
											<div className="sidebarTime">
												<div className="sidebarPartner">
													<p className="sidebarPartnerTitle">Site :</p>
													<a className="sidebarPartnerLink" href={activeItem.link} target="_blank">{activeItem.site}</a>
												</div>
												<div className="progressBar"><div className="progressBarFilled"></div></div>
												<div className="sidebarTimeInfo">
													<div className="sidebarTimeRemaining">Time remaining: <span className="sidebarTimeRemainingSpecific">00 days</span></div>
												</div>

											</div>
											<div className="sidebarCalc">
												<div className="sidebarCalcHeading">Earned</div>
												<div className="sidebarCalcInput">
													<div className="sidebarCalcInputFlex"><span className="sidebarCalcEnter">0</span>
													<div className="sidebarCalcCoin" id="radix-:r23:" aria-haspopup="menu" aria-expanded="false" data-state="closed">
														<div className="sidebarCalcCoinIcon">
															<img style={{borderRadius: '50%'}} src={`./images/${activeItem.token}.png`}/>
														</div>
														<span className="sidebarCalcCoinName uppercase">{activeItem.token}</span></div>
														</div>
													<div className="sidebarCalcCurrency">$0</div>
												</div>
											</div>
											{walletInfo.isConnected ? (
												<div className="address-dropdown">
												<AddressPopover
													address={walletInfo.address}
													disconnectWallet={OnWalletDisconnect}
												/>
												</div>
											) : (
												<button onClick={() => setIsShowWalletList(true)} type="button" aria-haspopup="dialog" aria-expanded="false" aria-controls="radix-:r8h:" data-state="closed" className="items-center flex justify-center min-h-[63px] min-w-[292px] overflow-hidden relative text-center bg-[rgb(255,128,0)] text-black cursor-pointer box-border w-[396px] visible text-[13.3333px] font-normal rounded-[10px] " >
													<span className="buttonText">
														[ Connect wallet ]
													</span>
												</button>
											)}
										</div>
										<div className="sidebarGrid">
											<div className="sidebarGridItem sidebarBox">
												<div className="sidebarGridItemLabel">Earn</div>
												<div className="sidebarGridItemContent">{activeItem.token}</div>
											</div>
											<div className="sidebarGridItem sidebarBox">
												<div className="sidebarGridItemLabel">Type</div>
												<div className="sidebarGridItemContent">{activeItem.type}</div>
											</div>
											<div className="sidebarGridItem sidebarBox">
												<div className="sidebarGridItemLabel">Distribution amount</div>
												<div className="sidebarGridItemContent">{activeItem.dist_amount}</div>
											</div>
											<div className="sidebarGridItem sidebarBox">
												<div className="sidebarGridItemLabel">TVL</div>
												<div className="sidebarGridItemContent">{activeItem.tvl}</div>
											</div>
										</div>
										<div className="sidebarAccs" onClick={() => setInfoShow((show) => !show)}>
										<div className="sidebarAccsItem">
											<div className="sidebarAccsHeader">
												<div className="sidebarAccsLabel">Info</div>
												<div className="sidebarAccsCross">
													<span className="sidebarAccsCrossBar sidebarAccsCrossBar--v"></span>
													<span className={`sidebarAccsCrossBar sidebarAccsCrossBar--h ${infoShow == true ? 'hidden' : ''}`} ></span>
												</div>
											</div>
											<p className={`sidebarAccsDescr ${infoShow == false ? 'hidden' : ''}`}>{activeItem.info}</p>
											</div>

										</div>
									</div>

								</div>
							</div>
						</div>
					</div>
				</div>

				<LoadingModal
					isLoading={stateOfLoadingWallet.isLoading}
					walletId={stateOfLoadingWallet.walletId}
					message={stateOfLoadingWallet.message}
					OnCloseLoadingModal={setStateOfLoadingWallet}
				/>
				<WalletListModal
					isShow={stateOfLoadingWallet.isLoading ? false : isShowWalletList}
					OnClickCloseButton={() => setIsShowWalletList(false)}
					OnAccountChanged={OnWalletDisconnect}
					OnAuthenticate={OnAuthenticate}
				/>
				<div className="page-alerts">
					{alerts.map((alert) => (
						<Alert
							key={alert.id}
							{...alert}
							onRemove={(id) => setAlerts((prev) => prev.filter((alert) => alert.id !== id))}
						/>
					))}
				</div>
			</main>
		</>
	);
}

export default App;
