import React from "react";
import "./Header.css";

type FooterProps = {};

const Footer: React.FC<FooterProps> = () => {
  return (
    <div className="footer">
      <div className="footer-text">
        If you have any problems with the system, please contact us.
        <br />
        <a href="mailto:daeun.choi@kaist.ac.kr">
          daeun(dot)choi (at) kaist.ac.kr
        </a>
      </div>
    </div>
  );
};

export default Footer;
