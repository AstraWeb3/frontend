import { ConnectWallet } from "@/components/ConnectWallet/ConnectWallet";
import "../social/Social.styles.scss";

const Social = () => {
  return (
    <div className="connect-page">
      <div className="connect-container">
        <div className="connect-card">
          <div className="connect-header">
            <h1>Connect Your Wallet</h1>
            <p>Sign in with your Solana wallet to continue</p>
          </div>
          <div className="connect-divider" />
          <div className="connect-wallet-wrapper">
            <ConnectWallet />
          </div>
          <div className="connect-footer">
            <p>
              By connecting your wallet, you agree to our{" "}
              <a href="/terms">Terms of Service</a> and{" "}
              <a href="/privacy">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Social;
