import { useRef, useState } from "react";
import logo from "../../assets/images/logo.svg";
import { usePopper } from "react-popper";
import "./navbar.css";
import "./responsive.css";
// import axios from "axios";

interface NavItemProps {
  text: string;
  to: string;
}

function NavItem(props: NavItemProps) {
  return (
    <a className="nav-item text-decoration-none" href={props.to ?? '#'} target="_blank">
      <span className="">&lt;/A&gt; </span>{props.text}
      {/* <span className="text">{props.text}</span> */}
    </a>
  );
}

function MenuItem(props: NavItemProps) {
  return (
    <a className="menu-item menuItemsRow">
      <span className="menuItemsRow_code">&lt;/A&gt; </span>{props.text}
      {/* <span className="text">{props.text}</span> */}
    </a>
  );
}

// function GasPopover() {
//   const [visible, setVisible] = useState(false);
//   const referenceElement = useRef(null);
//   const popperElement = useRef(null);
//   const arrowElement = useRef(null);
//   const [feerate, setFeerate] = useState({hourFee: 0, halfHourFee: 0, fastestFee: 0});
//   const { styles, attributes } = usePopper(
//     referenceElement.current,
//     popperElement.current,
//     {
//       modifiers: [
//         { name: "arrow", options: { element: arrowElement.current } },
//       ],
//     }
//   );

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const { data } = await axios.get(`https://mempool.space/api/v1/fees/recommended`);
//         setFeerate(data);
//       } catch (error) {
//         console.log("Server responded with:", error);
//       }
//     };

//     fetchData(); // fetch data immediately
//     const intervalId = setInterval(fetchData, 5000); // fetch data every 30 seconds

//     // clean up the interval on component unmount
//     return () => clearInterval(intervalId);
//   }, []);

//   return (
//     <>
//       <button
//         className="pill"
//         ref={referenceElement}
//         onMouseEnter={() => setVisible(true)}
//         onMouseLeave={() => setVisible(false)}
//       >
//         <i className="iconfont icon-gas1"></i>
//         <span>{feerate.halfHourFee}</span>
//       </button>
//       <div
//         className={`gas-popover popover ${visible ? "is-visible" : "hidden"}`}
//         style={styles.popper}
//         ref={popperElement}
//         {...attributes.popper}
//       >
//         <div className="arrow" style={styles.arrow} ref={arrowElement}></div>
//         <div className="popover-content">
//           <div className="gas-list">
//             <div className="gas-item">
//               <i className="nav-rate-icon iconfont icon-bike"></i>
//               <span className="nav-rate-text">Low: {feerate.hourFee} sats/vB</span>
//             </div>
//             <div className="gas-item">
//               <i className="nav-rate-icon iconfont icon-plane1"></i>
//               <span className="nav-rate-text">Medium: {feerate.halfHourFee} sats/vB</span>
//             </div>
//             <div className="gas-item">
//               <i className="nav-rate-icon iconfont icon-flashlight-line"></i>
//               <span className="nav-rate-text">High: {feerate.fastestFee} sats/vB</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// interface InfoPopoverProps extends PropsWithChildren {
//   title: string;
// }

// function InfoPopover({ title, children }: InfoPopoverProps) {
//   const [visible, setVisible] = useState(false);
//   const referenceElement = useRef(null);
//   const popperElement = useRef(null);
//   const arrowElement = useRef(null);
//   const { styles, attributes } = usePopper(
//     referenceElement.current,
//     popperElement.current,
//     {
//       modifiers: [
//         { name: "arrow", options: { element: arrowElement.current } },
//       ],
//     }
//   );

//   return (
//     <>
//       <div
//         ref={referenceElement}
//         onMouseEnter={() => setVisible(true)}
//         onMouseLeave={() => setVisible(false)}
//       >
//         {children}
//       </div>
//       <div
//         className={`info-popover popover ${visible ? "is-visible" : "hidden"}`}
//         style={styles.popper}
//         ref={popperElement}
//         {...attributes.popper}
//       >
//         <div className="arrow" style={styles.arrow} ref={arrowElement}></div>
//         <span className="popover-content">{title}</span>
//       </div>
//     </>
//   );
// }

// interface ExtraItemProps {
//   title: string;
//   icon: string;
// }

// function ExtraItem({ title, icon }: ExtraItemProps) {
//   return (
//     <div className="additional-item">
//       <i className={`iconfont gn-icon-click ${icon}`}></i>
//       <span>{title}</span>
//     </div>
//   );
// }

// function EllipsisPopover() {
//   const [visible, setVisible] = useState(false);
//   const referenceElement = useRef(null);
//   const popperElement = useRef(null);
//   const { styles, attributes } = usePopper(
//     referenceElement.current,
//     popperElement.current
//   );

//   function onNightToggle() { }

//   return (
//     <>
//       <button
//         className="more-btn"
//         ref={referenceElement}
//         onClick={() => setVisible(!visible)}
//         onBlur={() => setVisible(false)}
//       >
//         <i className="iconfont icon-more"></i>
//       </button>
//       <div
//         className={`more-popover popover ${visible ? "is-visible" : "hidden"}`}
//         style={styles.popper}
//         ref={popperElement}
//         {...attributes.popper}
//       >
//         <div className="popover-content">
//           <div>
//             <div className="night-mode">
//               <i className="iconfont gn-icon-click icon-dark"></i>
//               <span>Night Mode</span>
//               <SwitchButton
//                 className="toggle"
//                 onUpdate={onNightToggle}
//                 defaultVal={true}
//               />
//             </div>
//             <ExtraItem title="About" icon="icon-info-circle-filled" />
//             <ExtraItem title="API" icon="icon-soundmian" />
//             <ExtraItem title="Twitter" icon="icon-twitter1" />
//             <ExtraItem title="Discord" icon="icon-discord-fill" />
//             <ExtraItem title="Documentation" icon="icon-book-filled" />
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

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

// interface SwitchButtonProps {
//   className?: string;
//   defaultVal?: boolean;
//   onUpdate?: (newVal: boolean) => void;
// }

// interface MenuControlToggleProps extends SwitchButtonProps {
//   text: string;
// }

// function SwitchButton({ className, defaultVal, onUpdate }: SwitchButtonProps) {
//   const [value, setValue] = useState(!!defaultVal);

//   function handleSwitch() {
//     setValue(!value);
//     onUpdate?.(!value);
//   }

//   return (
//     <label
//       className={`switch ${className} ${value ? "on" : "off"}`}
//       onClick={handleSwitch}
//     ></label>
//   );
// }

// function MenuControlToggle({ text, onUpdate }: MenuControlToggleProps) {
//   return (
//     <a className="menu-item">
//       <span className="text">{text}</span>
//       <SwitchButton onUpdate={onUpdate} />
//     </a>
//   );
// }

interface SideNavProps {
  open: boolean;
  handleClose: () => void;
}

function SideNav({ open, handleClose }: SideNavProps) {
  return (
    <aside
      className="sidenav"
      style={{
        display: open ? "" : "none",
      }}
    >
      <div className="sidenav-main-nav">
        <div className="w-[83px] h-[20px]">
          <img className="" src={logo} />
        </div>
        <div className="nav-end">
          <button className="small-menu" onClick={handleClose}>
            <i
              className="iconfont icon-close  menuClose px-1"
            ></i>
          </button>
        </div>
      </div>
      <div className="wrapper">
        <div className="menu-links">
          <MenuItem text="Dashboard" to="" />
          <MenuItem text="Wiki" to="" />
          <a className="menu-item menuItemsRow selected">
            <span className="menuItemsRow_code">&lt;/A&gt; </span>
            Staking
          </a>
        </div>
        {/* <MenuControlToggle text="Dark Mode" /> */}
        {/* <MenuItem text="Install Our App" to="" /> */}
      </div>
      <div className="menuLinks">
        <a href="https://twitter.com/BRC20com" target="_blank" className="menuLinksItem">Twitter</a>
        <a href="https://t.me/brc_20_com" target="_blank" className="menuLinksItem">Telegram</a>
      </div>
    </aside>
  );
}

interface NavbarProps {
  isConnected: boolean;
  accountAddress: string;
  onClickConnectButton: () => void;
  OnWalletDisconnect: () => void;
}

export default function Navbar({isConnected,
  accountAddress,
  onClickConnectButton,
  OnWalletDisconnect,}: NavbarProps) {
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <nav className="">
      <div className="main-nav">
        <div className="main-nav-container b-container">
          <div className="nav-body">
            <div className="logo-container cursor-pointer">
              <img className="" src={logo} />
            </div>
            {/* <form className="search">
              <div className="fees">
                <span className="gas-fee-item"> Low: 42 sats/vB</span>
                <span className="gas-fee-item"> Medium: 46 sats/vB</span>
                <span className="gas-fee-item"> High: 49 sats/vB</span>
              </div>
              <div className="wrapper">
                <div className="icon-wrapper search">
                  <i className="iconfont icon-search icon"></i>
                </div>
                <input placeholder="Search Address / Text / Tick / Name / Inscription" />
                <div className="icon-wrapper close">
                  <i className="iconfont icon icon-close"></i>
                </div>
              </div>
            </form> */}
            <div className="nav-links">
              <NavItem text="Dashboard" to="https://dashboard.brc20.com/" />
              <NavItem text="Wiki" to="https://brc20.com/wiki" />
              <a className="nav-item text-decoration-none selected" >
                <span className="">&lt;/A&gt; </span>Staking
              </a>
            </div>
            {/* <div
              className="extra-links"
              style={{
                display: openMenu ? "none" : "",
              }}
            >
              <div className="gas-fee">
                <GasPopover />
              </div>

              {isConnected ? (
                <div className="watchlist">
                  <InfoPopover title="Watchlist">
                    <i className="iconfont icon-star-filled"></i>
                  </InfoPopover>
                </div>
              ) : (
                ""
              )}

              <div className="gift-wrapper-icon-parent">
                <InfoPopover title="Rewards">
                  <i className="iconfont icon-gift"></i>
                </InfoPopover>
              </div>

              <div className="more-items">
                <EllipsisPopover />
              </div>
            </div> */}

            <div className="nav-end">
              <div className="walletConnectWrapper">
                {isConnected ? (
                  <div className="address-dropdown">
                    <AddressPopover
                      address={accountAddress}
                      disconnectWallet={OnWalletDisconnect}
                    />
                  </div>
                ) : (
                    <button onClick={onClickConnectButton} type="button" className="items-center flex justify-center min-h-[50px] min-w-[192px] overflow-hidden relative text-center bg-[rgb(255,128,0)] text-black cursor-pointer box-border visible text-[13.3333px] font-medium rounded-[10px] " >
                      <span className="buttonText">
                        [ Connect wallet ]
                      </span>
                    </button>
                  // <button
                  //   className="connect-wallet gn-button gn-button--medium gn-button--primary"
                  //   onClick={onClickConnectButton}
                  // >
                  //   <i className="iconfont icon-wallet"></i>
                  //   &nbsp;Connect
                  // </button>
                )}
              </div>

              <button className="small-menu" onClick={() => setOpenMenu(!openMenu)}>
                Menu
                <i
                  className="iconfont icon-chevron-down"
                  style={{
                    display: openMenu ? "none" : "",
                  }}
                ></i>
                <i
                  className="iconfont icon-close icon-click menuClose"
                  style={{
                    display: openMenu ? "" : "none",
                  }}
                ></i>
              </button>
            </div>
          </div>
        </div>
      </div>
        <SideNav open={openMenu} handleClose={() => setOpenMenu(false)}/>
    </nav>
  );
}
