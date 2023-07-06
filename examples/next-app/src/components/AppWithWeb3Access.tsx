import { usePstlUserConnectionInfo } from "@past3lle/web3-modal";

const AppWithWeb3Access = () => {
    const { address } = usePstlUserConnectionInfo()
    return (
        <>
        <h1>Here has wagmi access</h1>
        <strong>Address: {address}</strong>
        </>
    );
};

export default AppWithWeb3Access;
