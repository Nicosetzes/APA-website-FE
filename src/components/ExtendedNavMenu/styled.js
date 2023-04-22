import styled from 'styled-components'

export const StyledExtendedNavMenu = styled.div`
  display: flex;
  margin: auto 2rem auto auto;
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
    border: #f5d87f 1px solid;
    padding: 0.5rem 0.75rem;
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
        color: #004a79;
        font-weight: 700;
        margin: 0.75rem 0;
        text-align: center;
        text-decoration: none;
      }
    }
  }
`
