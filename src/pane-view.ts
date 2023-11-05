import { Coordinate, ISeriesPrimitivePaneView } from 'lightweight-charts';
import { TradeMarkersPaneRenderer } from './pane-renderer';
import { TradeMarkerDataSource } from './data-source';

export interface TradeCoordinates {
	entryX: Coordinate;
	entryY: Coordinate;
	exitX: Coordinate;
	exitY: Coordinate;
	stopY: Coordinate;
	targetY: Coordinate;
}

export class TradeMarkersPaneView implements ISeriesPrimitivePaneView {

	_source: TradeMarkerDataSource;
	_tradeCoordinates: Array<TradeCoordinates | null> = [];

	constructor(source: TradeMarkerDataSource) {
		this._source = source;
	}

	update() {

		const chart = this._source.chart;
		const timeScale = chart.timeScale();
		const series = this._source.series;

		this._tradeCoordinates = this._source.trades.map((trade) => {

			const entryX = timeScale.timeToCoordinate(trade.entryTime);
			const exitX = timeScale.timeToCoordinate(trade.exitTime);

			const entryY = series.priceToCoordinate(trade.entryPrice);
			const exitY = series.priceToCoordinate(trade.exitPrice);

			const stopY = series.priceToCoordinate(trade.stopPrice);
			const targetY = series.priceToCoordinate(trade.targetPrice);


			if (entryX == null || entryY == null || exitX == null || exitY == null || stopY == null || targetY == null) {
				return null
			}

			return {
				entryX: entryX,
				entryY: entryY,
				exitX: exitX,
				exitY: exitY,
				stopY: stopY,
				targetY: targetY,
			};
		});
	}

	renderer() {
		return new TradeMarkersPaneRenderer(
			this._tradeCoordinates,
			this._source.options.stopFillColor,
			this._source.options.targetFillColor,
			this._source.options.exitArrowColor,
			this._source.options.separatorColor,
		);
	}
}
