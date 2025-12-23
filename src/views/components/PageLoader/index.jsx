import { Oval } from 'react-loader-spinner';
import { StyledPageLoader }  from './styled';

const PageLoader = ({ color="var(--green-900)", height="80", width="80" }) => {
    return ( 
    <StyledPageLoader>
        <Oval
          ariaLabel="three-dots-loading"
          color={color}
          height={height}
          radius="9"
          width={width}
          $wrapperStyle
          $wrapperClass
        />
      </StyledPageLoader> 
      );
}
 
export default PageLoader;

