import styled from 'styled-components'

export const StyledFooter = styled.div`
  align-items: center;
  background-color: #414141;
  border-top: #cfa420 10px solid;
  display: flex;
  flex-direction: ${(props) => `${props.isXS ? 'column' : 'row'}`};
  justify-content: space-between;
  padding: 3.75rem 0;
  width: 100%;
  .footer__img {
    display: flex;
    margin: ${(props) => `${props.isSm ? '0 0 0 0.5rem' : '0 0 0 3.5rem'}`};
    img {
      width: 150px;
    }
  }
  .footer__social {
    margin: 1rem 0;
    img {
      margin: 0 0.5rem;
      &:first-child {
        width: 40px;
      }
      &:last-child {
        width: 25px;
      }
    }
  }
  .footer__menu {
    align-items: ${(props) => `${props.isXS ? 'center' : 'flex-end'}`};
    display: flex;
    flex-direction: column;
    margin: ${(props) => `${props.isSm ? '0 0.5rem 0 0' : '0 3.5rem 0 0'}`};
    .menu-item {
      margin: 0.5rem 0;
      a {
        color: #fff;
        cursor: pointer;
        font-weight: 700;
        text-decoration: none;
      }
    }
  }
`
