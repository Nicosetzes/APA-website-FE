import styled from 'styled-components'
import { Link } from 'react-router-dom'

export const StyledChampionshipBox = styled(Link)`
  background: linear-gradient(145deg, #15384b 0%, #0d2838 58%, #0a202d 100%);
  border: 1px solid rgba(185, 144, 69, 0.58);
  border-left: 4px solid #b99045;
  border-radius: 14px;
  box-shadow: 0 14px 35px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.045);
  color: inherit;
  display: flex;
  flex-direction: column;
  max-width: 575px;
  overflow: hidden;
  position: relative;
  text-decoration: none;
  transition: border-color 180ms ease, box-shadow 180ms ease;
  width: 100%;

  &:hover {
    border-color: rgba(229, 199, 132, 0.76);
    border-left-color: #c8a255;
    box-shadow: 0 14px 35px rgba(0, 0, 0, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.045),
      0 0 0 1px rgba(229, 199, 132, 0.08);
  }

  &:focus-visible {
    outline: 3px solid #e5c784;
    outline-offset: 4px;
  }

  .showcase__header {
    align-items: center;
    display: flex;
    gap: 1rem;
    justify-content: space-between;
    min-height: 102px;
    padding: 1.25rem 1.35rem;
  }

  .showcase__header-copy {
    min-width: 0;
  }

  .showcase__format {
    color: #e5c784;
    font-size: 0.75rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    margin-bottom: 0.45rem;
    text-transform: uppercase;
  }

  .showcase__title {
    color: #f5f0e6;
    font-size: clamp(1.3rem, 3vw, 1.75rem);
    font-weight: 750;
    line-height: 1.15;
    margin: 0;
    overflow-wrap: anywhere;
    text-transform: uppercase;
  }

  .showcase__link-label {
    align-items: center;
    color: #d6c49e;
    display: flex;
    flex: 0 0 auto;
    font-size: 0.76rem;
    font-weight: 700;
    gap: 0.25rem;
    white-space: nowrap;

    svg {
      font-size: 1rem;
      transition: transform 180ms ease;
    }
  }

  .showcase__trophy {
    align-items: center;
    background: radial-gradient(
        ellipse at 50% 67%,
        rgba(242, 211, 139, 0.22),
        transparent 53%
      ),
      linear-gradient(115deg, rgba(255, 255, 255, 0.04), transparent 28%),
      #071923;
    border-bottom: 1px solid rgba(185, 144, 69, 0.32);
    border-top: 1px solid rgba(185, 144, 69, 0.32);
    display: flex;
    justify-content: center;
    min-height: 230px;
    overflow: hidden;
    padding: 1rem;
    position: relative;

    &::after {
      background: linear-gradient(
        105deg,
        transparent 0%,
        rgba(255, 255, 255, 0.05) 44%,
        transparent 55%
      );
      content: '';
      inset: 0;
      pointer-events: none;
      position: absolute;
    }

    img {
      filter: drop-shadow(0 12px 9px rgba(0, 0, 0, 0.62));
      height: 200px;
      max-width: 90%;
      object-fit: contain;
      position: relative;
      transition: filter 180ms ease, transform 180ms ease;
      z-index: 1;
    }
  }

  .showcase__results {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .showcase__result {
    padding: 1rem 1.15rem 1.15rem;
    position: relative;
  }

  .showcase__result + .showcase__result {
    border-left: 1px solid rgba(229, 199, 132, 0.2);
  }

  .showcase__result--champion {
    background: linear-gradient(
      135deg,
      rgba(185, 144, 69, 0.17),
      rgba(185, 144, 69, 0.045)
    );
  }

  .showcase__result--finalist {
    background: linear-gradient(
      135deg,
      rgba(196, 204, 210, 0.11),
      rgba(196, 204, 210, 0.025)
    );
  }

  .showcase__result-label {
    color: #e5c784;
    font-size: 0.7rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    margin-bottom: 0.75rem;
    text-transform: uppercase;
  }

  .showcase__result--finalist .showcase__result-label {
    color: #c7cdd1;
  }

  .showcase__result-content {
    align-items: center;
    display: flex;
    gap: 0.75rem;
    min-width: 0;

    img {
      flex: 0 0 58px;
      height: 58px;
      object-fit: contain;
      width: 58px;
    }
  }

  .showcase__result-info {
    min-width: 0;
  }

  .showcase__team {
    color: #f5f0e6;
    font-size: 1rem;
    font-weight: 700;
    line-height: 1.2;
    overflow-wrap: anywhere;
  }

  .showcase__player {
    color: #aebdc5;
    font-size: 0.9rem;
    font-weight: 600;
    margin-top: 0.3rem;
    overflow-wrap: anywhere;
  }

  @media (max-width: 560px) {
    .showcase__header {
      align-items: flex-start;
      min-height: auto;
      padding: 1.1rem;
    }

    .showcase__link-label {
      span {
        display: none;
      }
    }

    .showcase__trophy {
      min-height: 175px;

      img {
        height: 145px;
      }
    }

    .showcase__results {
      grid-template-columns: 1fr;
    }

    .showcase__result + .showcase__result {
      border-left: 0;
      border-top: 1px solid rgba(229, 199, 132, 0.2);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    &,
    .showcase__link-label svg,
    .showcase__trophy img {
      transition: none;
    }
  }
`
