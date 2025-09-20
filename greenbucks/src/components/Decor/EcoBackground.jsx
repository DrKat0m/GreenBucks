import { useLocation } from "react-router-dom";
import { cn } from "../../lib/cn";
import bg from "../../assets/greenbkg.jpeg";

/**
 * Fixed, full-screen background using the leaves image.
 * - Default: blurred + dim (so content pops)
 * - Slightly less blur on the Dashboard so the hero can blend into it
 */
export default function EcoBackground() {
  const { pathname } = useLocation();
  const onDashboard = pathname === "/";

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Leaves */}
      <img
        src={bg}
        alt=""
        className={cn(
          "h-full w-full object-cover scale-105 transition-all duration-500",
          // Dial the blur down a notch on the dashboard so the hero can melt into it
          onDashboard ? "blur-[5px] opacity-[0.22]" : "blur-[7px] opacity-[0.18]"
        )}
      />

      {/* Very subtle vignettes so edges feel natural */}
      <div className="absolute inset-0 bg-[radial-gradient(1200px_900px_at_50%_-10%,#06110c_0%,transparent_60%)]" />
      <div className="absolute inset-x-0 bottom-0 h-[28vh] bg-gradient-to-b from-transparent to-[#080e0c]" />
    </div>
  );
}
