import styled from 'styled-components'
export const StyledPlayerBox = styled.div`
  align-items: center;
  background: linear-gradient(
    45deg,
    #8e5e3a,
    #6f3b2d
  ); /* Gradiente de madera más oscuro */
  background-size: 100% 100%; /* Ajusta el fondo para que se vea bien */
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1); /* Ajusta la sombra para que sea más suave */
  display: flex;
  flex-direction: column;
  justify-content: start;
  margin: 1rem auto;
  max-width: 400px;
  min-height: 525px;
  overflow: hidden; /* Para asegurar que ::before y ::after no sobresalgan */
  padding: 1rem 0;
  width: 100%;
  .player-box {
    .player-box__name {
      color: #f5f5f5; /* Blanco roto */
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 1rem;
      text-align: center;
    }
    .player-box__stars {
      display: flex;
      justify-content: center;
      margin-bottom: 1rem;
    }
    .player-box__trophies {
      align-content: start; /* Alinea las filas de trofeos desde arriba */
      border: 5px solid #6f3d2e; /* Madera más oscura con un toque rojizo */
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      justify-items: center;
      margin-top: 1rem;
      min-height: 375px;
      padding: 1rem;
      position: relative;
      width: 300px;
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(173, 216, 230, 0.4); /* Azul claro translúcido */
        backdrop-filter: blur(
          1.5px
        ); /* Desenfoque para dar un aspecto de vidrio esmerilado */
        pointer-events: none;
        opacity: 0.5; /* Ajuste de opacidad */
      }
      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(
          45deg,
          rgba(255, 255, 255, 0.6) 0%,
          rgba(255, 255, 255, 0) 80%
        );
        border-radius: 5px;
        pointer-events: none;
      }

      img {
        height: 100px;
        border-radius: 8px; /* Para dar un efecto más agradable */
        margin: auto 0;
        display: block; /* Asegura que la imagen sea un bloque para manejar el borde */
        border-bottom: 4px solid #d4af37; /* Color dorado oscuro */
        padding-bottom: 5px; /* Ajusta el espacio entre la imagen y el borde */
      }
    }
  }
`
