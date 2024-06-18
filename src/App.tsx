import "./App.css";
import Navbar from "./components/navbar";
import { Key, useRef, useState } from "react";
import Alert, { AlertInfo, AlertType } from "./components/alerts";
// import MainFrame from './components/mainframe';
import LoadingModal from './components/modal/loadingModal';
import WalletListModal from './components/modal/walletlistModal';
import OnAuthHandler, { LoadingState } from './components/WalletProvider';
// import twitterIcon from "./assets/images/twitter.svg";
// import telegramIcon from "./assets/images/telegram.svg";
// import searchIcon from "./assets/images/searchIcon.png";
// import closeIcon from "./assets/images/close.png";
import stakingCoinImg from "./assets/images/stakingCoinImage.png";
import bCoinIcon from "./assets/images/bcoinIcon-t5wl58ob.png";

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
		token: "ornj",
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
				<img className="tableRowIcon" src={`./images/${token}.png`} alt="" />{token}</li>
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

	const scrollToSection = (id: string) => {
        const section = document.getElementById(id);
        if (section) {
            const scrollPosition = section.getBoundingClientRect().top + window.scrollY - 150;
            window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
        }
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

			<Navbar
			isConnected={walletInfo.isConnected}
			accountAddress={walletInfo.address}
			onClickConnectButton={() => setIsShowWalletList(true)}
			OnWalletDisconnect={OnWalletDisconnect}
			/>
			<main className=" wrapper dark-theme">

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
								<div className=" flex flex-col gap-4 mb-[49px]">
									<div className=" mb-4">
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
								<div className=" flex flex-col justify-between gap-10 md:flex-row md:items-center">
									<a href="#pools" onClick={() => scrollToSection('pools')} className=" items-center flex justify-center min-h-[63px] min-w-[292px] overflow-hidden relative text-center bg-[rgb(255,128,0)] text-white cursor-pointer box-border text-[13.3333px] font-normal rounded-[10px]" >
										<span className="text-black text-[16px] font-medium tracking-[0.003px] box-border text-center cursor-pointer bg-[rgb(255,128,0)]">
										[ Stake now ]
										</span>
									</a>
									<button type="button" aria-haspopup="dialog" aria-expanded="false" aria-controls="radix-:r0:" data-state="closed" className="bg-[rgba(0,0,0,0)] text-white cursor-pointer box-border text-[13.3333px] font-normal">
										[ How It Works ]
									</button>
								</div>
								<div className=" flex gap-6 mt-[34px]">
									<a href="https://twitter.com/BRC20com">
										<svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' ><path d='M18.2048 2.25H21.5128L14.2858 10.51L22.7878 21.75H16.1298L10.9158 14.933L4.94984 21.75H1.63984L9.36984 12.915L1.21484 2.25H8.03984L12.7528 8.481L18.2028 2.25H18.2048ZM17.0438 19.77H18.8768L7.04484 4.126H5.07784L17.0438 19.77Z' fill='white' /></svg>
									</a>
									<a href="https://t.me/brc_20_com">
										<svg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'><g clip-path='url(#clip0_547_2025)'><path fill-rule='evenodd' clip-rule='evenodd' d='M24.7203 5.53746C25.0292 5.40745 25.3673 5.36261 25.6994 5.4076C26.0315 5.4526 26.3455 5.58579 26.6087 5.79331C26.8719 6.00083 27.0746 6.2751 27.1958 6.58756C27.317 6.90002 27.3522 7.23926 27.2978 7.56996L24.4628 24.7662C24.1878 26.425 22.3678 27.3762 20.8466 26.55C19.5741 25.8587 17.6841 24.7937 15.9841 23.6825C15.1341 23.1262 12.5303 21.345 12.8503 20.0775C13.1253 18.9937 17.5003 14.9212 20.0003 12.5C20.9816 11.5487 20.5341 11 19.3753 11.875C16.4966 14.0475 11.8778 17.3512 10.3503 18.2812C9.00283 19.1012 8.30033 19.2412 7.46033 19.1012C5.92783 18.8462 4.50658 18.4512 3.34658 17.97C1.77908 17.32 1.85533 15.165 3.34533 14.5375L24.7203 5.53746Z' fill='white'/></g><defs><clipPath id='clip0_547_2025'><rect width='30' height='30' fill='white'/></clipPath></defs></svg>
									</a>
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
						<div className=" flex flex-col gap-8">
							<div className="poolsHeader">
								<h2 className="poolsHeaderTitle"> All Pools</h2>
								<div className="poolsCheckbox">
									<input type="checkbox" className="checkbox" onChange={(e) =>setShowActive(e.target.checked)} />
									<label className="poolsCheckboxLabel">
										Show only Active
									</label>
								</div>
								<div className=" poolsSearch relative">
									<div className="icon-wrapper absolute top-1/2 left-4 translate-y-[-50%]">
										<svg width='18' height='18' viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'><g clip-path='url(#clip0_199_195)'><circle cx='8.625' cy='8.625' r='7.125' stroke='#959595' stroke-width='1.5'/><path d='M13.875 13.875L16.5 16.5' stroke='#959595' stroke-width='1.5' stroke-linecap='round'/></g><defs><clipPath id='clip0_199_195'><rect width='18' height='18' fill='white'/></clipPath></defs></svg>
										{/* <img src={searchIcon}></img> */}
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
										<svg width='22' height='22' viewBox='0 0 22 22' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M12.4969 11L16.6868 6.81011C16.8856 6.61161 16.9975 6.34224 16.9977 6.06127C16.998 5.7803 16.8866 5.51074 16.6881 5.31189C16.4896 5.11304 16.2202 5.00118 15.9393 5.00094C15.6583 5.00069 15.3887 5.11206 15.1899 5.31057L11 9.50046L6.81011 5.31057C6.61125 5.11171 6.34155 5 6.06034 5C5.77912 5 5.50942 5.11171 5.31057 5.31057C5.11171 5.50942 5 5.77912 5 6.06034C5 6.34155 5.11171 6.61125 5.31057 6.81011L9.50046 11L5.31057 15.1899C5.11171 15.3887 5 15.6584 5 15.9397C5 16.2209 5.11171 16.4906 5.31057 16.6894C5.50942 16.8883 5.77912 17 6.06034 17C6.34155 17 6.61125 16.8883 6.81011 16.6894L11 12.4995L15.1899 16.6894C15.3887 16.8883 15.6584 17 15.9397 17C16.2209 17 16.4906 16.8883 16.6894 16.6894C16.8883 16.4906 17 16.2209 17 15.9397C17 15.6584 16.8883 15.3887 16.6894 15.1899L12.4969 11Z' fill='black'/></svg>
										{/* <img className="" src={closeIcon} /> */}
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
															<img src={bCoinIcon} alt="coinIcon" />
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
												<div className="sidebarGridItemContent uppercase">{activeItem.token}</div>
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
