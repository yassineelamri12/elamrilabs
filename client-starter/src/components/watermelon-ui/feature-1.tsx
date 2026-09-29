// Watermelon UI "feature-1" (https://ui.watermelon.sh), made data-driven:
// content comes from props instead of being hard-coded.
import type { IconType } from "react-icons";
import { Card, CardContent } from "@/components/ui/card";

export interface FeatureItem { icon: IconType; color: string; title: string; text: string; tag: string }
export interface FeatureHighlight extends FeatureItem { rows: { label: string; value: string }[] }
export interface Features1Props { title: string; items: FeatureItem[]; highlight: FeatureHighlight }

const CARD = "bg-muted/50 rounded-3xl ring-0 transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_10px_30px_rgba(0,0,0,0.6)]";
const ICON_WRAP = "flex h-10 w-10 items-center justify-center rounded-lg bg-white/80 shadow-[inset_0_-2px_0.5px_0px_rgba(0,0,0,0),inset_0px_2px_0_2px_rgba(255,255,255,1),0_0px_6px_0_rgba(0,0,0,0.07),0_2px_4px_0_rgba(0,0,0,0.05)] dark:bg-black/20 dark:shadow-[inset_0_-1px_0px_0px_rgba(0,0,0,0.1),inset_0px_1px_0px_0px_rgba(255,255,255,0.05),0_0px_2px_0_rgba(0,0,0,0.2),0_1px_4px_0_rgba(0,0,0,0.05)]";
const PILL = "text-muted-foreground inline-flex items-center rounded-md bg-white/80 px-2 py-1 text-[10px] font-medium shadow-[inset_0_-2px_0.5px_0px_rgba(0,0,0,0),inset_0px_2px_0_2px_rgba(255,255,255,1),0_0px_2px_0_rgba(0,0,0,0.08),0_1px_4px_0_rgba(0,0,0,0.05)] dark:bg-black/20 dark:shadow-[inset_0_-1px_0px_0px_rgba(0,0,0,0.1),inset_0px_1px_0px_0px_rgba(255,255,255,0.04),0_0px_2px_0_rgba(0,0,0,0.08),0_1px_4px_0_rgba(0,0,0,0.05)]";

function Icon({ icon: I, color }: { icon: IconType; color: string }) {
  return (
    <div className="bg-muted dark:bg-muted/10 mb-2 size-fit rounded-lg p-px">
      <div className={ICON_WRAP}><I className={`h-5 w-5 ${color}`} /></div>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-muted dark:bg-muted/10 inline-flex rounded-lg p-0.5">
      <div className={PILL}>{children}</div>
    </div>
  );
}

function Item({ item }: { item: FeatureItem }) {
  return (
    <Card className={CARD}>
      <CardContent className="p-6">
        <Icon icon={item.icon} color={item.color} />
        <h3 className="mb-1 text-lg font-medium">{item.title}</h3>
        <p className="text-muted-foreground mb-3 text-sm">{item.text}</p>
        <Tag>{item.tag}</Tag>
      </CardContent>
    </Card>
  );
}

export default function Features1({ title, items, highlight }: Features1Props) {
  const [a, b, ...rest] = items;
  return (
    <div className="theme-injected flex w-full flex-col items-center justify-center px-6 py-16">
      <h2 className="mb-12 max-w-3xl text-center text-3xl leading-[0.98] font-semibold md:text-5xl">{title}</h2>
      <div className="grid w-full max-w-6xl grid-cols-1 gap-4 md:grid-cols-3">
        {a && <Item item={a} />}
        {b && <Item item={b} />}
        <Card className="bg-muted/50 row-span-2 flex flex-col justify-between rounded-3xl ring-0 transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_12px_40px_rgba(0,0,0,0.7)]">
          <CardContent className="p-6">
            <Icon icon={highlight.icon} color={highlight.color} />
            <h3 className="mb-2 text-lg font-medium">{highlight.title}</h3>
            <p className="text-muted-foreground mb-6 text-sm">{highlight.text}</p>
            <div className="space-y-3">
              {highlight.rows.map((r) => (
                <div key={r.label} className="bg-muted dark:bg-muted/10 flex items-center justify-between rounded-md px-3 py-2 text-xs">
                  <span className="text-muted-foreground">{r.label}</span>
                  <span className="font-medium">{r.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
          <div className="px-6 pb-6"><Tag>{highlight.tag}</Tag></div>
        </Card>
        {rest.map((item) => <Item key={item.title} item={item} />)}
      </div>
    </div>
  );
}
