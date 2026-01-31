import { useScanFlowStore } from "@/lib/scanFlowStore";
import PreScanScreen from "@/pages/PreScanScreen";
import AnalyzingScreen from "@/pages/AnalyzingScreen";
import ResultsScreen from "@/pages/ResultsScreen";

const ScanController = () => {
    const stage = useScanFlowStore((state) => state.stage);

    switch (stage) {
        case "pre":
            return <PreScanScreen />;
        case "scanning":
            return <AnalyzingScreen />;
        case "done":
            return <ResultsScreen />;
        default:
            return <PreScanScreen />;
    }
};

export default ScanController;
