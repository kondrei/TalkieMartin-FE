import type { ReactNode } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import '../css/home.page.css';

import Gallery from '@/components/gallery';
import TopBar from '@/components/top-bar';

export function HomePage({ children }: { children?: ReactNode }) {
  return (
    <div>
      <TopBar />
      {children ?? <Outlet />}
    </div>
  );
}

export function HomeContent() {
  const navigate = useNavigate();
  return (
    <>
      <section className="hero-row">
        <article className="hero-card">
          <h1 className="hero-title">Celebrate Every Memory</h1>
          <button className="hero-btn" onClick={() => navigate('/upload-memory')}>
            Create New Album
          </button>
        </article>

        <div className="pill-grid">
          <div className="pill holidays">
            <span>Holidays</span>
            <span className="bullet" />
          </div>
          <div className="pill adventures">
            <span>Adventures</span>
            <span className="bullet" />
          </div>
          <div className="pill everyday">
            <span>Everyday Moments</span>
            <span className="bullet" />
          </div>
          <div className="pill controls">
            <button className="controls-btn">•••</button>
            <button className="controls-btn">🔍</button>
            <button className="controls-btn">🔎</button>
          </div>
        </div>
      </section>
      <Gallery />
    </>
  );
}
