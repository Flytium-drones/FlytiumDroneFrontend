import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useScrollTo } from "./LenisProvider";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const { scrollToTop } = useScrollTo();

  useEffect(() => {
    // Use Lenis scrollToTop when available for a smooth instant reset
    if (scrollToTop) {
      // duration 0 to jump to top immediately
      scrollToTop({ duration: 0 });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, [pathname, scrollToTop]);

  return null;
};

export default ScrollToTop;
