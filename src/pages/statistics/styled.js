import styled from 'styled-components'
export const StyledStatistics = styled.div`
  .accolades {
    display: flex;
    flex-direction: column;
    /* padding: 1rem; */
    width: 100%;
    .accolades-item {
      background-color: #151616;
      border: 0;
      border-radius: 15px;
      color: #fff;
      display: flex;
      flex-direction: column;
      margin-top: 1rem;
      max-width: 325px;
      padding: 1rem 1.25rem;
      width: 50%;
      &:nth-child(1) {
        margin-left: 1rem;
        margin-right: auto;
      }
      &:nth-child(2) {
        margin-left: auto;
        margin-right: 1rem;
      }
      &:nth-child(3) {
        margin-left: 1rem;
        margin-right: auto;
      }
      .accolades-item-title {
        text-decoration: underline;
      }
      .accolades-item-player {
        font-size: 2.5rem;
        font-weight: 700;
        margin: 0.5rem auto 0 4rem;
      }
      .accolades-item-number {
        font-size: 2rem;
        margin: 0 0.5rem 0 auto;
      }
    }
  }
`
