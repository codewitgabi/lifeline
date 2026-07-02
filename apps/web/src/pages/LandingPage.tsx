import { useNavigate } from "react-router-dom";
import { useActiveRequestStore } from "../store/activeRequestStore";
import LandingNav from "../components/landing/LandingNav";
import ActiveRequestBar from "../components/landing/ActiveRequestBar";
import HeroSection from "../components/landing/HeroSection";
import HowItWorksSection from "../components/landing/HowItWorksSection";
import CompatExplorer from "../components/landing/CompatExplorer";
import BuiltForSpeedSection from "../components/landing/BuiltForSpeedSection";
import JoinSection from "../components/landing/JoinSection";
import LandingFooter from "../components/landing/LandingFooter";

function LandingPage() {
  const navigate = useNavigate();
  const { active } = useActiveRequestStore();
  const hasActiveRequest = active && new Date(active.expiresAt) > new Date();

  return (
    <div style={{ background: "#FBF8F6", color: "#231518", minHeight: "100vh" }}>
      <LandingNav onRegister={() => navigate("/register")} />
      {hasActiveRequest && (
        <ActiveRequestBar
          active={active}
          onContinue={() => navigate(`/request/${active.id}`)}
        />
      )}
      <HeroSection
        onRegister={() => navigate("/register")}
        onRequest={() => navigate("/request/new")}
      />
      <HowItWorksSection />
      <CompatExplorer />
      <BuiltForSpeedSection />
      <JoinSection onRegister={() => navigate("/register")} />
      <LandingFooter />
    </div>
  );
}

export default LandingPage;
