import styled from 'styled-components'

export const StyledPlayerBox = styled.div`
  background: linear-gradient(145deg, #15384b 0%, #0d2838 55%, #0a202d 100%);
  border: 1px solid rgba(185, 144, 69, 0.65);
  border-radius: 14px;
  box-shadow: 0 14px 35px rgba(0, 0, 0, 0.28),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  max-width: 400px;
  overflow: hidden;
  position: relative;
  width: 100%;

  &::before {
    background: linear-gradient(
      90deg,
      transparent,
      rgba(229, 199, 132, 0.8),
      transparent
    );
    content: '';
    height: 1px;
    left: 10%;
    position: absolute;
    top: 0;
    width: 80%;
  }

  .player-box {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 1.25rem;
  }

  .player-box__header {
    align-items: center;
    display: flex;
    gap: 0.9rem;
    min-height: 76px;
  }

  .player-box__identity {
    min-width: 0;
  }

  .player-box__name {
    color: #f5f0e6;
    font-size: clamp(1.45rem, 5vw, 2rem);
    font-weight: 700;
    line-height: 1.1;
    margin: 0 0 0.55rem;
    overflow-wrap: anywhere;
  }

  .player-box__championships {
    align-items: center;
    background: rgba(185, 144, 69, 0.15);
    border: 1px solid rgba(229, 199, 132, 0.38);
    border-radius: 999px;
    color: #e5c784;
    display: inline-flex;
    font-size: 0.72rem;
    font-weight: 800;
    gap: 0.35rem;
    letter-spacing: 0.06em;
    padding: 0.3rem 0.65rem 0.3rem 0.45rem;

    svg {
      color: #ffc857;
      font-size: 1.05rem;
    }
  }

  .player-box__cabinet {
    background: linear-gradient(
        115deg,
        rgba(255, 255, 255, 0.045),
        transparent 28%
      ),
      linear-gradient(180deg, #071923 0%, #0a202b 100%);
    border: 2px solid #98733a;
    border-radius: 8px;
    box-shadow: inset 0 0 24px rgba(0, 0, 0, 0.7), 0 3px 0 #4e351d,
      0 8px 18px rgba(0, 0, 0, 0.24);
    margin-top: 1.15rem;
    overflow: hidden;
    padding: 1rem 0.8rem 0.75rem;
    position: relative;
  }

  .player-box__cabinet::after {
    background: linear-gradient(
      105deg,
      transparent 0%,
      rgba(255, 255, 255, 0.055) 43%,
      transparent 55%
    );
    content: '';
    inset: 0;
    pointer-events: none;
    position: absolute;
  }

  .player-box__trophies {
    display: grid;
    gap: 1.1rem 0.75rem;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .player-box__trophy {
    align-items: flex-end;
    background: radial-gradient(
      ellipse at 50% 70%,
      rgba(242, 211, 139, 0.2),
      transparent 68%
    );
    display: flex;
    justify-content: center;
    min-height: 132px;
    padding: 0.45rem 0.25rem 0.8rem;
    position: relative;
    z-index: 1;

    &::before {
      background: linear-gradient(
        90deg,
        rgba(54, 34, 17, 0.9),
        #c19a52 12%,
        #e0bd72 50%,
        #c19a52 88%,
        rgba(54, 34, 17, 0.9)
      );
      bottom: 0;
      box-shadow: 0 4px 7px rgba(0, 0, 0, 0.75);
      content: '';
      height: 5px;
      left: -0.35rem;
      position: absolute;
      width: calc(100% + 0.7rem);
    }

    img {
      display: block;
      filter: drop-shadow(0 7px 6px rgba(0, 0, 0, 0.58));
      height: 108px;
      max-width: 100%;
      object-fit: contain;
      transition: filter 180ms ease, transform 180ms ease;
    }
  }

  @media (max-width: 420px) {
    .player-box {
      padding: 1rem;
    }

    .player-box__trophies {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .player-box__trophy img {
      transition: none;
    }
  }
`
