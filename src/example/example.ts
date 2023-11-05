import { createChart } from 'lightweight-charts';
import { generateLineData } from '../sample-data';
import { TradeMarkers as TradeMarkers } from '../trade-markers';

const chart = ((window as unknown as any).chart = createChart('chart', {
	autoSize: true,
}));

const lineSeries = chart.addLineSeries({
	color: '#000000',
	priceLineVisible: false,
});
const data = generateLineData();
lineSeries.setData(data);

const time1 = data[data.length - 50].time;
const time2 = data[data.length - 10].time;

const time3 = data[data.length - 100].time;
const time4 = data[data.length - 60].time;

const primitive = new TradeMarkers();

lineSeries.attachPrimitive(primitive);

primitive.trades = [
	{
		entryTime: time1,
		entryPrice: 350,
		exitTime: time2,
		exitPrice: 500,
		stopPrice: 100,
		targetPrice: 600,
	},
	{
		entryTime: time3,
		entryPrice: 450,
		exitTime: time4,
		exitPrice: 300,
		stopPrice: 600,
		targetPrice: 100,
	},
];
