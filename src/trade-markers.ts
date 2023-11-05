import { AutoscaleInfo, Logical, Time } from 'lightweight-charts';
import { TradeMarkersPriceAxisView } from './axis-view';
import { Trade, TradeMarkerDataSource } from './data-source';
import { TradeMarkersOptions, defaultOptions } from './options';
import { TradeMarkersPaneView } from './pane-view';
import { PluginBase } from './plugin-base';

export class TradeMarkers
	extends PluginBase
	implements TradeMarkerDataSource {
	_options: TradeMarkersOptions;
	_trades: Trade[] = [];
	_paneViews: TradeMarkersPaneView[];
	_priceAxisViews: TradeMarkersPriceAxisView[] = [];

	constructor(
		options: Partial<TradeMarkersOptions> = {}
	) {
		super();
		this._options = {
			...defaultOptions,
			...options,
		};
		this._paneViews = [new TradeMarkersPaneView(this)];
	}

	updateAllViews() {
		//* Use this method to update any data required by the
		//* views to draw.
		this._paneViews.forEach(pw => pw.update());
		this._priceAxisViews.forEach(pw => pw.update());
	}

	priceAxisViews() {
		//* Labels rendered on the price scale
		return this._priceAxisViews;
	}

	paneViews() {
		//* rendering on the main chart pane
		return this._paneViews;
	}

	autoscaleInfo(
		startTimePoint: Logical,
		endTimePoint: Logical
	): AutoscaleInfo | null {
		//* Use this method to provide autoscale information if your primitive
		//* should have the ability to remain in view automatically.

		const ranges = this._trades.flatMap((trade) => {

			if (
				this._timeCurrentlyVisible(trade.entryTime, startTimePoint, endTimePoint) ||
				this._timeCurrentlyVisible(trade.exitTime, startTimePoint, endTimePoint)
			) {
				return [{
					priceRange: {
						minValue: Math.min(trade.entryPrice, trade.exitPrice, trade.stopPrice, trade.targetPrice),
						maxValue: Math.max(trade.entryPrice, trade.exitPrice, trade.stopPrice, trade.targetPrice),
					},
				}];
			}

			return [];
		});

		if (ranges.length > 0) {

			let minValue = Number.MAX_VALUE
			let maxValue = Number.MIN_VALUE

			ranges.forEach((range) => {
				minValue = Math.min(minValue, range.priceRange.minValue);
				maxValue = Math.max(maxValue, range.priceRange.maxValue);
			});

			return {
				priceRange: { minValue: minValue, maxValue: maxValue, },
			};
		}

		return null;
	}

	_timeCurrentlyVisible(
		time: Time,
		startTimePoint: Logical,
		endTimePoint: Logical
	): boolean {
		const ts = this.chart.timeScale();
		const coordinate = ts.timeToCoordinate(time);
		if (coordinate === null) return false;
		const logical = ts.coordinateToLogical(coordinate);
		if (logical === null) return false;
		return logical <= endTimePoint && logical >= startTimePoint;
	}

	public get options(): TradeMarkersOptions {
		return this._options;
	}

	applyOptions(options: Partial<TradeMarkersOptions>) {
		this._options = { ...this._options, ...options };
		this.requestUpdate();
	}

	public set trades(trades: Trade[]) {
		this._trades = trades;
		this._priceAxisViews = trades.flatMap((trade) => {
			return [
				new TradeMarkersPriceAxisView(this, { time: trade.entryTime, price: trade.entryPrice }, this._options.entryLabelOptions),
				new TradeMarkersPriceAxisView(this, { time: trade.entryTime, price: trade.stopPrice }, this._options.stopLabelOptions),
				new TradeMarkersPriceAxisView(this, { time: trade.entryTime, price: trade.targetPrice }, this._options.targetLabelOptions),
			];
		});
	}

	public get trades(): Trade[] {
		return this._trades;
	}
}
