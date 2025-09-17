import { z } from "zod";
import { ErrorComp } from "./Error";
import { Spinner } from "./Spinner";
import { useRendering } from "../lib/use-rendering";
import { COMPOSITION_ID } from "~/remotion/constants.mjs";
import { CompositionProps } from "~/remotion/schemata";

export const RenderControls: React.FC<{
  inputProps: z.infer<typeof CompositionProps>;
}> = ({ inputProps }) => {
  const { renderMedia, state } = useRendering(COMPOSITION_ID, inputProps);

  const isInvoking = state.status === "invoking" || state.status === "rendering";
  const isDone = state.status === "done";

  const handleClick = () => {
    if (isDone) {
      const anchor = document.createElement("a");
      anchor.href = state.url;
      anchor.download = "tbpn-broadcast.mp4";
      anchor.rel = "noopener";
      anchor.target = "_blank";
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      return;
    }

    if (isInvoking) return;

    renderMedia();
  };

  const showLoading = state.status === "invoking" || state.status === "rendering";

  return (
    // <div className="mx-auto w-full max-w-[360px]">
    //   <button
    //     type="button"
    //     onClick={handleClick}
    //     disabled={isInvoking}
    //     className={`group relative flex h-12 w-full items-center justify-center overflow-hidden rounded-full border px-6 transition-all duration-200 ${
    //       isDone
    //         ? "border-[#2df7a7] bg-[linear-gradient(90deg,rgba(6,52,40,0.95),rgba(7,45,34,0.75))] shadow-[0_0_38px_rgba(31,255,177,0.18)]"
    //         : "border-[#1bd494] bg-[linear-gradient(90deg,rgba(8,45,34,0.92),rgba(4,25,18,0.9))] shadow-[0_0_24px_rgba(31,255,177,0.12)]"
    //     } ${
    //       isInvoking
    //         ? "opacity-70 cursor-wait"
    //         : "hover:border-[#25ffb5] hover:shadow-[0_0_32px_rgba(37,255,181,0.2)]"
    //     }`}
    //   >
    //     <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-[radial-gradient(circle_at_top,rgba(45,255,183,0.35),rgba(0,0,0,0))]" aria-hidden />
    //     {showLoading ? (
    //       <div className="flex items-center gap-3 text-[#dfffee]">
    //         <Spinner size={24} color="#27ffc0" />
    //         <span className="tbpn-subheadline text-xs tracking-[0.3em] uppercase">Preparing…</span>
    //       </div>
    //     ) : (
    //       <div className="flex items-center gap-3 text-[#dfffee]">
    //         <span className="h-2.5 w-2.5 rounded-full bg-[#27ffc0] shadow-[0_0_12px_rgba(39,255,192,0.8)]"></span>
    //         <span className="tbpn-subheadline text-xs tracking-[0.32em] uppercase">Download the broadcast</span>
    //       </div>
    //     )}
    //   </button>
    //   {state.status === "error" ? (
    //     <div className="mt-3">
    //       <ErrorComp message={state.error.message}></ErrorComp>
    //     </div>
    //   ) : null}
    // </div>
    <></>
  );
};
