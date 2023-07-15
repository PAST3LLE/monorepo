import type { AppProps } from "next/app";
import AppWithWeb3Access from "../components/AppWithWeb3Access";
import { pstlModalConfig } from "../web3/connection";
import { WindowSizeProvider } from "@past3lle/hooks";
import { PstlW3Providers } from "@past3lle/web3-modal";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <WindowSizeProvider>
            <PstlW3Providers config={pstlModalConfig}>
                <Component {...pageProps} />
                <AppWithWeb3Access />
            </PstlW3Providers>
        </WindowSizeProvider>
    )
}

export default MyApp;
