import styled from 'styled-components'

export const StyledFormatBox = styled.div`
  border: black 1px solid;
  background-image: ${(props) => `url(${props.img})`};
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  filter: opacity(50%) grayscale(100%);
  height: 250px;
  /* justify-content: center; */
  margin: 0.5rem;
  width: 200px;
  .formats__box-title {
    font-weight: 700;
    text-align: center;
    width: 100%;
  }
`
