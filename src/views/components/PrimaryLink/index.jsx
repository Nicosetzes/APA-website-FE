import { Button, Link } from './styled';

const PrimaryLink = ({
  asButton = false,
  disabled = false,
  href = '/book-demo',
  onClick = null,
  text,
}) => {

  return asButton ? (
    <Button
      disabled={disabled}
      type="button"
      onClick={() => {
        if (!disabled && onClick) onClick();
      }}
    >
    {text}
    </Button>
  ) : (
    <Link href={href} aria-disabled={disabled}>{text}
    </Link>
  );
}

export default PrimaryLink;

  