import type { AppProps } from "next/app";
import AppWithWeb3Access from "../components/AppWithWeb3Access";
import { pstlModalConfig } from "../web3/connection";
import { PstlW3Providers } from "@past3lle/web3-modal";
import { PstlHooksProvider } from "@past3lle/hooks";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <PstlHooksProvider>
            <PstlW3Providers config={pstlModalConfig}>
                <Component {...pageProps} />
                <AppWithWeb3Access />
            </PstlW3Providers>
        </PstlHooksProvider>
    )
}

export default MyApp;
