import "./Header.scss";
import { Link } from "react-router-dom";
import holoBall from "../../assets/illustrations/holoball.png";

const Header = () => {
  return (
    <header className="header">
      <Link to="/" className="header__link">
        InterAI
      </Link>
    </header>
  );
};

export default Header;
