import { GeistSans } from "geist/font/sans";
import Shell from "@/components/v2/Shell";

export const metadata = {
  title: "rodriwu.io / v2",
  description: "Rodrigo Martínez — Designer · Portfolio",
};

export default function V2Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={GeistSans.className} style={{ width: "100%", height: "100%" }}>
      <Shell>{children}</Shell>
    </div>
  );
}
