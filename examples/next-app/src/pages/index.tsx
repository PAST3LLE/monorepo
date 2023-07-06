// make a simple page
import { usePstlAccountNetworkActions, usePstlUserConnectionInfo, usePstlWeb3Modal } from "@past3lle/web3-modal";
import React from "react"

const Home = () => {
    const { address, isConnected } = usePstlUserConnectionInfo();
    const { isOpen } = usePstlWeb3Modal();
    const { onAccountClick } = usePstlAccountNetworkActions()

    return (
        <div>
            <h1>Wagmi test</h1>
            <button
                className={`btn whitespace-nowrap ${address ? "bg-opus-teal" : "bg-black"
                    }`}
                disabled={isOpen}
                onClick={onAccountClick}
                style={{ width: 400 }}
            >
                {isConnected ? (
                    <>
                        <span id="account-info">{address}</span><br/>
                        <span>Click to view details</span>
                    </>
                ) : (
                    <span id="connect-wallet">Connect wallet</span>
                )}
            </button>
        </div>
    )
}

export default Home