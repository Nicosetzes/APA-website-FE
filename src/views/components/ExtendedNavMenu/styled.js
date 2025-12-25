import styled from 'styled-components'

export const StyledExtendedNavMenu = styled.div`
  display: flex;
  margin-left: auto;
  .nav-link {
    align-items: center;
    color: #fff;
    cursor: pointer;
    display: flex;
    font-size: 1rem;
    font-weight: 700;
    margin: 0 1rem;
    text-decoration: none;
  }
  .nav-link.login {
    border: var(--orange-900) 1px solid;
    margin-right: 0;
    padding: 0.5rem 0.75rem;
  }
  .nav-link.logout-button {
    background: transparent;
    border: var(--orange-900) 1px solid;
    margin-right: 0;
    padding: 0.5rem 0.75rem;
    transition: all 0.2s ease;
    font-size: 1rem;
    font-weight: 700;
    font-family: inherit;

    &:hover {
      background: #f5d87f;
      color: var(--blue-900);
    }
  }
  .container__dropdown {
    position: relative;
    .dropdown-link {
      align-items: center;
      display: flex;
    }
    .dropdown-menu {
      background-color: #f5d87f;
      display: flex;
      flex-direction: column;
      left: -30px;
      position: absolute;
      top: 40px;
      width: 150px;
      z-index: 100;
      .dropdown-menu-item {
        color: var(--blue-900);
        font-weight: 700;
        margin: 0.75rem 0;
        text-align: center;
        text-decoration: none;
      }
    }
  }
`
