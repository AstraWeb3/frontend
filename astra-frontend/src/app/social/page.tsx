import { ConnectWallet } from "@/components/ConnectWallet/ConnectWallet";
import "../social/Social.styles.scss";
import { ArrowRight, Github, Twitter } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const Social = () => {
  return (
    <div className="social-page">
      <section className="hero">
        <div className="container">
          <h1 className="headline">Connect. Transact. Build.</h1>
          <p className="subheadline">A Web3 Experience—Seamless & Secure.</p>
          <div className="cta-container">
            <ConnectWallet />
            <Link href="/explore" className="secondary-button">
              Explore Feed <ArrowRight className="icon" />
            </Link>
          </div>
          <div className="stats">
            <div className="stat">
              <span className="stat-number">10K+</span>
              <span className="stat-label">Nodes</span>
            </div>
            <div className="stat">
              <span className="stat-number">500</span>
              <span className="stat-label">Dailyn Engagement</span>
            </div>
            <div className="stat">
              <span className="stat-number">1M+</span>
              <span className="stat-label">Goal</span>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2 className="section-title">Join the Future of Social & Finance</h2>

          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <div className="icon-wrapper">🔐</div>
              </div>
              <h3>Own Your Social Identity</h3>
              <p>
                No ads. No middlemen. No data tracking. On Astra, you own your
                content, connections, and digital identity.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <div className="icon-wrapper">👥</div>
              </div>
              <h3>Send & Receive Money Instantly</h3>
              <p>
                No banks, no delays—just instant, borderless payments between
                you and your peers. All you need is a wallet!
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <div className="icon-wrapper">💡</div>
              </div>
              <h3>Discover Trends</h3>
              <p>
                Discover emerging trends in blockchain, DeFi, and AI to stay
                competitive in the digital space.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <div className="icon-wrapper">🔗</div>
              </div>
              <h3>Build Your Network and Wealth</h3>
              <p>
                Grow your influence in a decentralized economy and unlock new
                opportunities for collaboration and investment.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="trending">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Trending Projects</h2>
            <Link href="/trending" className="view-all">
              View all <ArrowRight className="icon" size={16} />
            </Link>
          </div>

          <div className="project-grid">
            {[1, 2, 3].map((i) => (
              <div key={i} className="project-card">
                <div className="project-image">
                  <Image
                    src={`/placeholder.svg?height=200&width=400`}
                    alt="Project thumbnail"
                    width={400}
                    height={200}
                    className="thumbnail"
                  />
                </div>
                <div className="project-content">
                  <div className="project-meta">
                    <div className="avatar">
                      <Image
                        src={`/placeholder.svg?height=40&width=40`}
                        alt="User avatar"
                        width={40}
                        height={40}
                        className="avatar-image"
                      />
                    </div>
                    <span className="username">user{i}dev</span>
                  </div>
                  <h3 className="project-title">Next.js Project {i}</h3>
                  <p className="project-description">
                    A modern web application built with Next.js, React, and
                    Tailwind CSS.
                  </p>
                  <div className="project-footer">
                    <div className="tech-stack">
                      <span className="tech-tag">Next.js</span>
                      <span className="tech-tag">React</span>
                      <span className="tech-tag">Tailwind</span>
                    </div>
                    <div className="project-stats">
                      <span className="stat">
                        <span className="stat-icon">★</span> 128
                      </span>
                      <span className="stat">
                        <span className="stat-icon">🍴</span> 32
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="join-community">
        <div className="container">
          <div className="join-content">
            <h2>Join the Future</h2>
            <p>No more Fiat. No more Middleman. No more Lies.</p>
            <div className="join-buttons">
              <ConnectWallet />
              <div className="social-links">
                <a
                  href="https://github.com"
                  className="social-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github size={20} />
                </a>
                <a
                  href="https://twitter.com"
                  className="social-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Twitter size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Social;
