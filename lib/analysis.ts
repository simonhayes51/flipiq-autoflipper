export type Observation = { time: number; price: number };

export function netTrade(buy: number, sell: number) {
  if (![buy, sell].every(v => Number.isFinite(v) && v >= 0) || buy === 0) return { gross: 0, net: 0, roi: 0, breakEven: 0 };
  const gross = sell - buy;
  const net = sell - Math.floor(sell * .05) - buy;
  return { gross, net, roi: net / buy * 100, breakEven: Math.ceil(buy / .95) };
}

export function analyse(points: Observation[], trigger = 16) {
  const valid = points.filter(p => Number.isFinite(p.time) && Number.isFinite(p.price) && p.price > 0).sort((a,b) => a.time-b.time);
  const windows = {} as Record<3|6|9, { change: number|null; status: string }>;
  for (const hours of [3,6,9] as const) {
    const slice = valid.filter(p => Date.now()-p.time <= hours*3600000);
    const span = slice.length>1 ? slice.at(-1)!.time-slice[0].time : 0;
    if (slice.length<3 || span<hours*3600000*.4) { windows[hours]={change:null,status:"Insufficient history"}; continue; }
    const change = (slice.at(-1)!.price/slice[0].price-1)*100;
    windows[hours]={change,status:change<=-trigger?"Significant decline":change<-2?"Declining":change>2?"Rising":"Stable"};
  }
  const complete = ([3,6,9] as const).every(h=>windows[h].change!==null);
  const falling = ([3,6,9] as const).filter(h=>windows[h].change!==null && windows[h].change! < -2).length;
  return {windows, explanation:!complete?"Insufficient observations across all windows. No chart-based purchase recommendation can be made.":falling===3?"All three timeframes are falling. A sharp price drop may continue; wait for stabilisation.":falling?"Timeframes disagree or the market is unsettled. Treat projected returns cautiously.":"Recent observations do not show a consistent decline; future prices remain uncertain."};
}
