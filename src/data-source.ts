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

export interface TradeMarkersDataSource {
	chart: IChartApi;
	series: ISeriesApi<keyof SeriesOptionsMap>;
	options: TradeMarkersOptions;
	p1: Point;
	p2: Point;
}
