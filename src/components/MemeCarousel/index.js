import Carousel from 'react-material-ui-carousel'
import meme_01 from './../../images/memes/01.jpg'
import meme_02 from './../../images/memes/02.jpg'
import meme_03 from './../../images/memes/03.jpg'
import meme_04 from './../../images/memes/04.jpg'
import meme_05 from './../../images/memes/05.jpg'
import meme_06 from './../../images/memes/06.jpg'
import meme_07 from './../../images/memes/07.jpg'
import meme_08 from './../../images/memes/08.jpg'
import meme_09 from './../../images/memes/09.jpg'
import meme_10 from './../../images/memes/10.jpg'
import meme_11 from './../../images/memes/11.jpg'
import meme_12 from './../../images/memes/12.jpg'
import meme_13 from './../../images/memes/13.jpg'
import meme_14 from './../../images/memes/14.jpg'
import meme_15 from './../../images/memes/15.jpg'
import meme_16 from './../../images/memes/16.jpg'
import meme_17 from './../../images/memes/17.jpg'
import meme_18 from './../../images/memes/18.jpg'
import meme_19 from './../../images/memes/19.jpg'
import meme_20 from './../../images/memes/20.jpg'
import meme_21 from './../../images/memes/21.jpg'
import meme_22 from './../../images/memes/22.jpg'
import meme_23 from './../../images/memes/23.jpg'
import meme_24 from './../../images/memes/24.jpg'
import meme_25 from './../../images/memes/25.jpg'
import meme_26 from './../../images/memes/26.jpg'
import meme_27 from './../../images/memes/27.jpg'
import meme_28 from './../../images/memes/28.jpg'
import meme_29 from './../../images/memes/29.jpg'
import meme_30 from './../../images/memes/30.jpg'
import meme_31 from './../../images/memes/31.jpg'
import meme_32 from './../../images/memes/32.jpg'
import meme_33 from './../../images/memes/33.jpg'
import meme_34 from './../../images/memes/34.jpg'
import meme_35 from './../../images/memes/35.jpg'
import meme_36 from './../../images/memes/36.jpg'
import meme_37 from './../../images/memes/37.jpg'
import meme_38 from './../../images/memes/38.jpg'
import meme_39 from './../../images/memes/39.jpg'
import meme_40 from './../../images/memes/40.jpg'
import meme_41 from './../../images/memes/41.jpg'
import meme_42 from './../../images/memes/42.jpg'
import meme_43 from './../../images/memes/43.jpg'

const MemeCarousel = () => {
  const memes = [
    meme_01,
    meme_02,
    meme_03,
    meme_04,
    meme_05,
    meme_06,
    meme_07,
    meme_08,
    meme_09,
    meme_10,
    meme_11,
    meme_12,
    meme_13,
    meme_14,
    meme_15,
    meme_16,
    meme_17,
    meme_18,
    meme_19,
    meme_20,
    meme_21,
    meme_22,
    meme_23,
    meme_24,
    meme_25,
    meme_26,
    meme_27,
    meme_28,
    meme_29,
    meme_30,
    meme_31,
    meme_32,
    meme_33,
    meme_34,
    meme_35,
    meme_36,
    meme_37,
    meme_38,
    meme_39,
    meme_40,
    meme_41,
    meme_42,
    meme_43,
  ]

  return (
    <Carousel
      indicators={false}
      interval={5000}
      navButtonsAlwaysVisible={true}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        margin: 'auto',
        maxWidth: 600,
        minHeight: 500,
        width: '100%',
      }}
    >
      {memes.map((item, index) => (
        <div key={index} style={{ display: 'flex' }}>
          <img src={item} style={{ margin: 'auto', maxWidth: '100%' }} />
        </div>
      ))}
    </Carousel>
  )
}

export default MemeCarousel
