import {
	IChartApi,
	ISeriesApi,
	SeriesOptionsMap,
	Time,
} from 'lightweight-charts';
import { TradeMarkersOptions } from './options';

export interface Point {
	time: Time;
	price: number;
}

export interface Trade {
	entryTime: Time;
	entryPrice: number;
	exitTime: Time;
	exitPrice: number;
	stopPrice: number;
	targetPrice: number;
}

export interface TradeMarkerDataSource {
	chart: IChartApi;
	series: ISeriesApi<keyof SeriesOptionsMap>;
	options: TradeMarkersOptions;
	trades: Trade[];
}
